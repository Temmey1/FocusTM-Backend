import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { v4 as uuid } from "uuid";
import { Order, OrderDocument } from "./order.schema";
import { CreateOrderDto } from "./dto/create-order.dto";
import { ProductsService } from "../products/products.service";
import { NotificationsService } from "../notifications/notifications.service";
import { PaymentsService } from "../payments/payments.service";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
    private productsService: ProductsService,
    private notificationsService: NotificationsService,
    private paymentsService: PaymentsService,
    private config: ConfigService
  ) {}

  private generateOrderNumber() {
    return `FTM-${Date.now().toString().slice(-6)}-${uuid().slice(0, 4).toUpperCase()}`;
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

      await this.orderModel.updateOne(
        { _id: order._id },
        { monnifyTransactionReference: orderNumber }
      );
    }

    return {
      id: order._id,
      orderId: orderNumber,
      orderNumber,
      monnifyCheckoutUrl,
      ...order.toObject(),
    };
  }

  findAll() {
    return this.orderModel.find().sort({ createdAt: -1 }).exec();
  }

  findByUser(userId: string) {
    return this.orderModel.find({ userId }).sort({ createdAt: -1 }).exec();
  }

  async findOne(id: string) {
    const order = await this.orderModel.findById(id).exec();
    if (!order) throw new NotFoundException("Order not found");
    return order;
  }

  async updateStatus(id: string, status: string) {
    const order = await this.orderModel.findByIdAndUpdate(id, { status }, { new: true }).exec();
    if (!order) throw new NotFoundException("Order not found");
    return order;
  }

  async markPaidByReference(reference: string) {
    return this.orderModel.findOneAndUpdate(
      { orderNumber: reference },
      { status: "paid" },
      { new: true }
    );
  }
}
