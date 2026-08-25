import { Document } from "mongoose";
export type CustomOrderDocument = CustomOrder & Document;
export declare class CustomOrder {
    requestNumber: string;
    fullName: string;
    phone: string;
    email?: string;
    itemType: string;
    description: string;
    budget?: string;
    referenceImages: string[];
    status: string;
    userId?: string | null;
    adminNote?: string;
    createdAt?: Date;
    updatedAt?: Date;
}
export declare const CustomOrderSchema: import("mongoose").Schema<CustomOrder, import("mongoose").Model<CustomOrder, any, any, any, Document<unknown, any, CustomOrder, any, {}> & CustomOrder & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, CustomOrder, Document<unknown, {}, import("mongoose").FlatRecord<CustomOrder>, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").FlatRecord<CustomOrder> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
