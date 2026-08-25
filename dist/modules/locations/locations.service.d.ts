import { Model } from "mongoose";
import { DeliveryLocation, DeliveryLocationDocument } from "./location.schema";
import { CreateLocationDto } from "./dto/create-location.dto";
import { UpdateLocationDto } from "./dto/update-location.dto";
export declare class LocationsService {
    private model;
    constructor(model: Model<DeliveryLocationDocument>);
    create(dto: CreateLocationDto): Promise<import("mongoose").Document<unknown, {}, DeliveryLocationDocument, {}, {}> & DeliveryLocation & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    findActive(type?: string): Promise<(import("mongoose").Document<unknown, {}, DeliveryLocationDocument, {}, {}> & DeliveryLocation & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    })[]>;
    findAll(): Promise<(import("mongoose").Document<unknown, {}, DeliveryLocationDocument, {}, {}> & DeliveryLocation & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    })[]>;
    update(id: string, dto: UpdateLocationDto): Promise<import("mongoose").Document<unknown, {}, DeliveryLocationDocument, {}, {}> & DeliveryLocation & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    remove(id: string): Promise<{
        success: boolean;
    }>;
}
