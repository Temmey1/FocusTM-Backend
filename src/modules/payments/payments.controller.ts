import { Body, Controller, Post, Logger } from "@nestjs/common";
import { OrdersService } from "../orders/orders.service";

@Controller("payments")
export class PaymentsController {
  private readonly logger = new Logger(PaymentsController.name);

  constructor(private ordersService: OrdersService) {}

  // Configure this URL in your Monnify dashboard: POST https://yourdomain.com/payments/monnify/webhook
  @Post("monnify/webhook")
  async handleMonnifyWebhook(@Body() payload: any) {
    this.logger.log(`Monnify webhook received: ${JSON.stringify(payload?.eventType)}`);

    const reference = payload?.eventData?.paymentReference;
    const status = payload?.eventData?.paymentStatus;

    if (reference && status === "PAID") {
      await this.ordersService.markPaidByReference(reference);
    }

    return { received: true };
  }
}
