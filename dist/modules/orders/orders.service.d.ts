import { Model } from "mongoose";
import { Order, OrderDocument } from "./order.schema";
import { CreateOrderDto } from "./dto/create-order.dto";
import { ProductsService } from "../products/products.service";
import { NotificationsService } from "../notifications/notifications.service";
import { PaymentsService } from "../payments/payments.service";
import { ConfigService } from "@nestjs/config";
export declare class OrdersService {
    private orderModel;
    private productsService;
    private notificationsService;
    private paymentsService;
    private config;
    constructor(orderModel: Model<OrderDocument>, productsService: ProductsService, notificationsService: NotificationsService, paymentsService: PaymentsService, config: ConfigService);
    private generateOrderNumber;
    create(dto: CreateOrderDto, userId?: string | null): Promise<{
        orderNumber: string;
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
        delivery: {
            fullName: string;
            phone: string;
            email?: string;
            method: string;
            state: string;
            city?: string;
            address?: string;
            pickupLocationId?: string;
            note?: string;
        };
        paymentMethod: string;
        status: string;
        userId?: string | null;
        monnifyTransactionReference?: string | null;
        _id: import("mongoose").Types.ObjectId;
        $locals: Record<string, unknown>;
        $op: "save" | "validate" | "remove" | null;
        $where: Record<string, unknown>;
        baseModelName?: string;
        collection: import("mongoose").Collection;
        db: import("mongoose").Connection;
        errors?: import("mongoose").Error.ValidationError;
        id: any;
        isNew: boolean;
        schema: import("mongoose").Schema;
        __v: number;
        orderId: string;
        monnifyCheckoutUrl: string;
    }>;
    findAll(): Promise<(import("mongoose").Document<unknown, {}, OrderDocument, {}, {}> & Order & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    })[]>;
    findByUser(userId: string): Promise<(import("mongoose").Document<unknown, {}, OrderDocument, {}, {}> & Order & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    })[]>;
    findOne(id: string): Promise<import("mongoose").Document<unknown, {}, OrderDocument, {}, {}> & Order & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    updateStatus(id: string, status: string): Promise<import("mongoose").Document<unknown, {}, OrderDocument, {}, {}> & Order & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    markPaidByReference(reference: string): Promise<import("mongoose").Document<unknown, {}, OrderDocument, {}, {}> & Order & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
}
