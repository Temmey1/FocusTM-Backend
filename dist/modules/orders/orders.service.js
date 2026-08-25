"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrdersService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const uuid_1 = require("uuid");
const order_schema_1 = require("./order.schema");
const products_service_1 = require("../products/products.service");
const notifications_service_1 = require("../notifications/notifications.service");
const whatsapp_service_1 = require("../notifications/whatsapp.service");
const payments_service_1 = require("../payments/payments.service");
const config_1 = require("@nestjs/config");
let OrdersService = class OrdersService {
    constructor(orderModel, productsService, notificationsService, whatsappService, paymentsService, config) {
        this.orderModel = orderModel;
        this.productsService = productsService;
        this.notificationsService = notificationsService;
        this.whatsappService = whatsappService;
        this.paymentsService = paymentsService;
        this.config = config;
    }
    generateOrderNumber() {
        return `FTM-${Date.now().toString().slice(-6)}-${(0, uuid_1.v4)().slice(0, 4).toUpperCase()}`;
    }
    serialize(order) {
        const obj = order.toObject();
        return { ...obj, id: order._id.toString(), _id: undefined };
    }
    async create(dto, userId) {
        const orderNumber = this.generateOrderNumber();
        const order = await this.orderModel.create({
            ...dto,
            orderNumber,
            userId: userId || null,
            status: "pending",
        });
        for (const item of dto.items) {
            this.productsService.decrementStock(item.productId, item.quantity).catch(() => undefined);
        }
        this.notificationsService.sendOrderConfirmation(order).catch(() => undefined);
        this.notificationsService.notifyAdminNewOrder(order).catch(() => undefined);
        this.whatsappService.notifyOwnerNewOrder(order).catch(() => undefined);
        let monnifyCheckoutUrl = null;
        if (dto.paymentMethod === "monnify") {
            const frontendUrl = this.config.get("FRONTEND_URL") || "http://localhost:3000";
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
    async findByUser(userId) {
        const orders = await this.orderModel.find({ userId }).sort({ createdAt: -1 }).exec();
        return orders.map((o) => this.serialize(o));
    }
    async findOne(id) {
        const order = await this.orderModel.findById(id).exec();
        if (!order)
            throw new common_1.NotFoundException("Order not found");
        return this.serialize(order);
    }
    async findByOrderNumber(orderNumber) {
        const order = await this.orderModel.findOne({ orderNumber }).exec();
        if (!order)
            throw new common_1.NotFoundException("Order not found");
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
    async updateStatus(id, status) {
        const order = await this.orderModel.findByIdAndUpdate(id, { status }, { new: true }).exec();
        if (!order)
            throw new common_1.NotFoundException("Order not found");
        return this.serialize(order);
    }
    async markPaidByReference(reference) {
        return this.orderModel.findOneAndUpdate({ orderNumber: reference }, { status: "paid" }, { new: true });
    }
};
exports.OrdersService = OrdersService;
exports.OrdersService = OrdersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(order_schema_1.Order.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        products_service_1.ProductsService,
        notifications_service_1.NotificationsService,
        whatsapp_service_1.WhatsappService,
        payments_service_1.PaymentsService,
        config_1.ConfigService])
], OrdersService);
//# sourceMappingURL=orders.service.js.map