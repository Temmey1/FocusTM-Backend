import { Model } from "mongoose";
import { OrderDocument } from "../orders/order.schema";
import { ProductDocument } from "../products/product.schema";
export declare class AdminController {
    private orderModel;
    private productModel;
    constructor(orderModel: Model<OrderDocument>, productModel: Model<ProductDocument>);
    getStats(): Promise<{
        totalOrders: number;
        pendingOrders: number;
        totalProducts: number;
        revenueThisMonth: number;
        revenueAllTime: number;
    }>;
    getUsers(pageToken?: string): Promise<{
        users: {
            uid: string;
            email: string;
            phoneNumber: string;
            displayName: string;
            createdAt: string;
            lastSignInAt: string;
            admin: boolean;
        }[];
        nextPageToken: string;
    }>;
}
