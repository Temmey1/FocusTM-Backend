import { OrdersService } from "../orders/orders.service";
export declare class PaymentsController {
    private ordersService;
    private readonly logger;
    constructor(ordersService: OrdersService);
    handleMonnifyWebhook(payload: any): Promise<{
        received: boolean;
    }>;
}
