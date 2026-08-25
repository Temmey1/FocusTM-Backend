import { ConfigService } from "@nestjs/config";
export declare class WhatsappService {
    private config;
    private readonly logger;
    constructor(config: ConfigService);
    private get ownerNumber();
    private get storeUrl();
    private buildLink;
    private send;
    notifyOwnerNewOrder(order: {
        orderNumber: string;
        total: number;
        delivery: {
            fullName: string;
            phone: string;
        };
    }): Promise<{
        sent: boolean;
        link: string;
    }>;
    notifyOwnerCustomOrder(request: {
        requestNumber: string;
        fullName: string;
        phone: string;
        itemType: string;
    }): Promise<{
        sent: boolean;
        link: string;
    }>;
}
