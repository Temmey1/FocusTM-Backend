import { OrdersService } from "./orders.service";
import { CreateOrderDto } from "./dto/create-order.dto";
import { UpdateOrderStatusDto } from "./dto/update-order-status.dto";
export declare class OrdersController {
    private readonly ordersService;
    constructor(ordersService: OrdersService);
    create(dto: CreateOrderDto, req: any): Promise<{
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
    findAll(): Promise<(import("mongoose").Document<unknown, {}, import("./order.schema").OrderDocument, {}, {}> & import("./order.schema").Order & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    })[]>;
    findMine(req: any): Promise<(import("mongoose").Document<unknown, {}, import("./order.schema").OrderDocument, {}, {}> & import("./order.schema").Order & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    })[]>;
    findOne(id: string): Promise<import("mongoose").Document<unknown, {}, import("./order.schema").OrderDocument, {}, {}> & import("./order.schema").Order & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    updateStatus(id: string, dto: UpdateOrderStatusDto): Promise<import("mongoose").Document<unknown, {}, import("./order.schema").OrderDocument, {}, {}> & import("./order.schema").Order & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
}
