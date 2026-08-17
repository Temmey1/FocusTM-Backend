import { Document } from "mongoose";
export type OrderDocument = Order & Document;
declare class OrderItem {
    productId: string;
    name: string;
    image: string;
    price: number;
    size: string;
    color: string;
    quantity: number;
    customNote?: string;
}
declare class DeliveryDetails {
    fullName: string;
    phone: string;
    email?: string;
    method: string;
    state: string;
    city?: string;
    address?: string;
    pickupLocationId?: string;
    note?: string;
}
export declare class Order {
    orderNumber: string;
    items: OrderItem[];
    subtotal: number;
    deliveryFee: number;
    total: number;
    delivery: DeliveryDetails;
    paymentMethod: string;
    status: string;
    userId?: string | null;
    monnifyTransactionReference?: string | null;
}
export declare const OrderSchema: import("mongoose").Schema<Order, import("mongoose").Model<Order, any, any, any, Document<unknown, any, Order, any, {}> & Order & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Order, Document<unknown, {}, import("mongoose").FlatRecord<Order>, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").FlatRecord<Order> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
export {};
