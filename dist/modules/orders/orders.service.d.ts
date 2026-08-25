import { Model } from "mongoose";
import { Order, OrderDocument } from "./order.schema";
import { CreateOrderDto } from "./dto/create-order.dto";
import { ProductsService } from "../products/products.service";
import { NotificationsService } from "../notifications/notifications.service";
import { WhatsappService } from "../notifications/whatsapp.service";
import { PaymentsService } from "../payments/payments.service";
import { ConfigService } from "@nestjs/config";
export declare class OrdersService {
    private orderModel;
    private productsService;
    private notificationsService;
    private whatsappService;
    private paymentsService;
    private config;
    constructor(orderModel: Model<OrderDocument>, productsService: ProductsService, notificationsService: NotificationsService, whatsappService: WhatsappService, paymentsService: PaymentsService, config: ConfigService);
    private generateOrderNumber;
    private serialize;
    create(dto: CreateOrderDto, userId?: string | null): Promise<any>;
    findAll(): Promise<any[]>;
    findByUser(userId: string): Promise<any[]>;
    findOne(id: string): Promise<any>;
    findByOrderNumber(orderNumber: string): Promise<{
        orderNumber: string;
        status: string;
        createdAt: Date;
        items: {
            productId: string;
            name: string;
            image: string;
            price: number;
            size: string;
            color: string;
            quantity: number;
            customNote?: string;
        }[];
        subtotal: number;
        deliveryFee: number;
        total: number;
        paymentMethod: string;
        customerName: string;
        method: string;
        state: string;
        city: string;
        address: string;
    }>;
    updateStatus(id: string, status: string): Promise<any>;
    markPaidByReference(reference: string): Promise<import("mongoose").Document<unknown, {}, OrderDocument, {}, {}> & Order & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
}
