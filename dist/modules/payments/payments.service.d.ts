import { ConfigService } from "@nestjs/config";
export declare class PaymentsService {
    private config;
    private readonly logger;
    constructor(config: ConfigService);
    private get baseUrl();
    private authenticate;
    initializeTransaction(params: {
        amount: number;
        customerName: string;
        customerEmail: string;
        paymentReference: string;
        redirectUrl: string;
    }): Promise<{
        checkoutUrl: string | null;
    }>;
    verifyTransaction(transactionReference: string): Promise<{
        paid: boolean;
        raw?: any;
    }>;
}
