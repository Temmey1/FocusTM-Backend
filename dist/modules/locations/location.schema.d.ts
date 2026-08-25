import { Document } from "mongoose";
export type DeliveryLocationDocument = DeliveryLocation & Document;
export declare class DeliveryLocation {
    type: string;
    state: string;
    city?: string;
    address?: string;
    fee: number;
    active: boolean;
    note?: string;
    createdAt?: Date;
    updatedAt?: Date;
}
export declare const DeliveryLocationSchema: import("mongoose").Schema<DeliveryLocation, import("mongoose").Model<DeliveryLocation, any, any, any, Document<unknown, any, DeliveryLocation, any, {}> & DeliveryLocation & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, DeliveryLocation, Document<unknown, {}, import("mongoose").FlatRecord<DeliveryLocation>, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").FlatRecord<DeliveryLocation> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
