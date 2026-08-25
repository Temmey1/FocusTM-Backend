import { ConfigService } from "@nestjs/config";
import { Order } from "../orders/order.schema";
import { CustomOrder } from "../custom-orders/custom-order.schema";
export declare class NotificationsService {
    private config;
    private readonly logger;
    private transporter;
    constructor(config: ConfigService);
    private get fromAddress();
    private get storeUrl();
    sendOrderConfirmation(order: Order & {
        orderNumber: string;
    }): Promise<void>;
    notifyAdminNewOrder(order: Order & {
        orderNumber: string;
    }): Promise<void>;
    notifyAdminCustomOrder(request: CustomOrder & {
        requestNumber: string;
    }): Promise<void>;
}
