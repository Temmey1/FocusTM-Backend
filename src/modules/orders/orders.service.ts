import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { v4 as uuid } from "uuid";
import { Order, OrderDocument } from "./order.schema";
import { CreateOrderDto } from "./dto/create-order.dto";
import { ProductsService } from "../products/products.service";
import { NotificationsService } from "../notifications/notifications.service";
import { WhatsappService } from "../notifications/whatsapp.service";
import { PaymentsService } from "../payments/payments.service";
import { PushSubscriptionsService } from "../push-subscriptions/push-subscriptions.service";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
    private productsService: ProductsService,
    private notificationsService: NotificationsService,
    private whatsappService: WhatsappService,
    private paymentsService: PaymentsService,
    private pushSubs: PushSubscriptionsService,
    private config: ConfigService
  ) {}

  private generateOrderNumber() {
    return `FTM-${Date.now().toString().slice(-6)}-${uuid().slice(0, 4).toUpperCase()}`;
  }

  // Normalizes a Mongoose order document into the shape the frontend expects,
  // always exposing a plain string `id` (never a raw ObjectId).
  private serialize(order: OrderDocument) {
    const obj = order.toObject();
    return { ...obj, id: order._id.toString(), _id: undefined };
  }

  async create(dto: CreateOrderDto, userId?: string | null) {
    const orderNumber = this.generateOrderNumber();

    const order = await this.orderModel.create({
      ...dto,
      orderNumber,
      userId: userId || null,
      status: "pending",
    });

    // Best-effort stock decrement; does not block order creation if it fails.
    for (const item of dto.items) {
      this.productsService.decrementStock(item.productId, item.quantity).catch(() => undefined);
    }

    this.notificationsService.sendOrderConfirmation(order as any).catch(() => undefined);
    this.notificationsService.notifyAdminNewOrder(order as any).catch(() => undefined);
    this.whatsappService.notifyOwnerNewOrder(order as any).catch(() => undefined);
    this.pushSubs.broadcastToAdmins({
      title: `New Order — ${orderNumber}`,
      body: `${dto.delivery.fullName} — ₦${dto.total.toLocaleString()} (${dto.paymentMethod}) · ${dto.items.length} item(s)`,
      tag: `order-${orderNumber}`,
      requireInteraction: true,
      timestamp: Date.now(),
      data: { type: "order", orderNumber, url: `/orders` },
    }).catch(() => undefined);

    let monnifyCheckoutUrl: string | null = null;

    if (dto.paymentMethod === "monnify") {
      const frontendUrl = this.config.get<string>("FRONTEND_URL") || "http://localhost:3000";
      const { checkoutUrl } = await this.paymentsService
        .initializeTransaction({
          amount: dto.total,
          customerName: dto.delivery.fullName,
          customerEmail: dto.delivery.email || "guest@focustm.com",
          paymentReference: orderNumber,
          redirectUrl: `${frontendUrl}/checkout/success?order=${orderNumber}`,
        })
        .catch(() => ({ checkoutUrl: null }));

      monnifyCheckoutUrl = checkoutUrl;
      await this.orderModel.updateOne({ _id: order._id }, { monnifyTransactionReference: orderNumber });
    }

    return { ...this.serialize(order), monnifyCheckoutUrl };
  }

  async findAll() {
    const orders = await this.orderModel.find().sort({ createdAt: -1 }).exec();
    return orders.map((o) => this.serialize(o));
  }

  async findByUser(userId: string) {
    const orders = await this.orderModel.find({ userId }).sort({ createdAt: -1 }).exec();
    return orders.map((o) => this.serialize(o));
  }

  async findOne(id: string) {
    const order = await this.orderModel.findById(id).exec();
    if (!order) throw new NotFoundException("Order not found");
    return this.serialize(order);
  }

  // Public tracking — looked up by the human-readable order number, not the
  // Mongo _id, and returns a trimmed view (no internal fields) since this is
  // reachable without authentication via /track/:orderNumber on the store.
  async findByOrderNumber(orderNumber: string) {
    const order = await this.orderModel.findOne({ orderNumber }).exec();
    if (!order) throw new NotFoundException("Order not found");
    const { delivery, items, subtotal, deliveryFee, total, paymentMethod, status, createdAt } = order.toObject();
    return {
      orderNumber,
      status,
      createdAt,
      items,
      subtotal,
      deliveryFee,
      total,
      paymentMethod,
      customerName: delivery.fullName,
      method: delivery.method,
      state: delivery.state,
      city: delivery.city,
      address: delivery.address,
    };
  }

  async updateStatus(id: string, status: string) {
    const order = await this.orderModel.findByIdAndUpdate(id, { status }, { new: true }).exec();
    if (!order) throw new NotFoundException("Order not found");
    return this.serialize(order);
  }

  async markPaidByReference(reference: string) {
    return this.orderModel.findOneAndUpdate({ orderNumber: reference }, { status: "paid" }, { new: true });
  }
}
