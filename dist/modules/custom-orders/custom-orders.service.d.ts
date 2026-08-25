import { Model } from "mongoose";
import { CustomOrder, CustomOrderDocument } from "./custom-order.schema";
import { CreateCustomOrderDto } from "./dto/create-custom-order.dto";
import { UpdateCustomOrderDto } from "./dto/update-custom-order.dto";
import { NotificationsService } from "../notifications/notifications.service";
import { WhatsappService } from "../notifications/whatsapp.service";
export declare class CustomOrdersService {
    private model;
    private notifications;
    private whatsapp;
    constructor(model: Model<CustomOrderDocument>, notifications: NotificationsService, whatsapp: WhatsappService);
    create(dto: CreateCustomOrderDto, userId?: string | null): Promise<import("mongoose").Document<unknown, {}, CustomOrderDocument, {}, {}> & CustomOrder & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    findAll(): Promise<(import("mongoose").Document<unknown, {}, CustomOrderDocument, {}, {}> & CustomOrder & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    })[]>;
    findByUser(userId: string): Promise<(import("mongoose").Document<unknown, {}, CustomOrderDocument, {}, {}> & CustomOrder & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    })[]>;
    update(id: string, dto: UpdateCustomOrderDto): Promise<import("mongoose").Document<unknown, {}, CustomOrderDocument, {}, {}> & CustomOrder & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
}
