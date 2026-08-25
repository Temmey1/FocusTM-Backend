import { CustomOrdersService } from "./custom-orders.service";
import { CreateCustomOrderDto } from "./dto/create-custom-order.dto";
import { UpdateCustomOrderDto } from "./dto/update-custom-order.dto";
export declare class CustomOrdersController {
    private readonly service;
    constructor(service: CustomOrdersService);
    create(dto: CreateCustomOrderDto, req: any): Promise<import("mongoose").Document<unknown, {}, import("./custom-order.schema").CustomOrderDocument, {}, {}> & import("./custom-order.schema").CustomOrder & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    findMine(req: any): Promise<(import("mongoose").Document<unknown, {}, import("./custom-order.schema").CustomOrderDocument, {}, {}> & import("./custom-order.schema").CustomOrder & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    })[]>;
    findAll(): Promise<(import("mongoose").Document<unknown, {}, import("./custom-order.schema").CustomOrderDocument, {}, {}> & import("./custom-order.schema").CustomOrder & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    })[]>;
    update(id: string, dto: UpdateCustomOrderDto): Promise<import("mongoose").Document<unknown, {}, import("./custom-order.schema").CustomOrderDocument, {}, {}> & import("./custom-order.schema").CustomOrder & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
}
