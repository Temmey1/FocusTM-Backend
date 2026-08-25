import { LocationsService } from "./locations.service";
import { CreateLocationDto } from "./dto/create-location.dto";
import { UpdateLocationDto } from "./dto/update-location.dto";
export declare class LocationsController {
    private readonly locationsService;
    constructor(locationsService: LocationsService);
    findActive(type?: string): Promise<(import("mongoose").Document<unknown, {}, import("./location.schema").DeliveryLocationDocument, {}, {}> & import("./location.schema").DeliveryLocation & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    })[]>;
    findAll(): Promise<(import("mongoose").Document<unknown, {}, import("./location.schema").DeliveryLocationDocument, {}, {}> & import("./location.schema").DeliveryLocation & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    })[]>;
    create(dto: CreateLocationDto): Promise<import("mongoose").Document<unknown, {}, import("./location.schema").DeliveryLocationDocument, {}, {}> & import("./location.schema").DeliveryLocation & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    update(id: string, dto: UpdateLocationDto): Promise<import("mongoose").Document<unknown, {}, import("./location.schema").DeliveryLocationDocument, {}, {}> & import("./location.schema").DeliveryLocation & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    remove(id: string): Promise<{
        success: boolean;
    }>;
}
