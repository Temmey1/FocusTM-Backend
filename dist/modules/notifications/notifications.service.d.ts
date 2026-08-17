import { ConfigService } from "@nestjs/config";
import { Order } from "../orders/order.schema";
export declare class NotificationsService {
    private config;
    private readonly logger;
    private transporter;
    constructor(config: ConfigService);
    sendOrderConfirmation(order: Order & {
        orderNumber: string;
    }): Promise<void>;
    notifyAdminNewOrder(order: Order & {
        orderNumber: string;
    }): Promise<void>;
}
