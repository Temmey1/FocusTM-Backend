import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import axios from "axios";

/**
 * Sends the store owner a WhatsApp message whenever a new order or custom
 * order request comes in, including a public link to view/update it.
 *
 * Two modes:
 *  1. WhatsApp Cloud API (Meta) — if WHATSAPP_CLOUD_API_TOKEN and
 *     WHATSAPP_CLOUD_PHONE_ID are set, the message is sent automatically,
 *     no owner interaction required.
 *  2. Fallback — if not configured, a wa.me deep link is logged to the
 *     server console/log stream so you can wire it into any process
 *     (e.g. forward to Slack, or click it manually). This keeps the app
 *     fully functional without requiring a paid WhatsApp Business account.
 */
@Injectable()
export class WhatsappService {
  private readonly logger = new Logger(WhatsappService.name);

  constructor(private config: ConfigService) {}

  private get ownerNumber() {
    return this.config.get<string>("OWNER_WHATSAPP_NUMBER") || this.config.get<string>("WHATSAPP_NUMBER");
  }

  private get storeUrl() {
    return this.config.get<string>("FRONTEND_URL") || "http://localhost:3000";
  }

  private buildLink(message: string) {
    const number = this.ownerNumber;
    return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
  }

  private async send(message: string) {
    const token   = this.config.get<string>("WHATSAPP_CLOUD_API_TOKEN");
    const phoneId = this.config.get<string>("WHATSAPP_CLOUD_PHONE_ID");
    const to      = this.ownerNumber;

    if (!token || !phoneId || !to) {
      // Fallback: log a clickable deep link instead of failing silently.
      this.logger.log(`[WhatsApp fallback] Open this link to notify the owner:\n${this.buildLink(message)}`);
      return { sent: false, link: this.buildLink(message) };
    }

    try {
      await axios.post(
        `https://graph.facebook.com/v20.0/${phoneId}/messages`,
        {
          messaging_product: "whatsapp",
          to,
          type: "text",
          text: { body: message },
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return { sent: true, link: this.buildLink(message) };
    } catch (err) {
      this.logger.error("WhatsApp Cloud API send failed, falling back to link", err as Error);
      return { sent: false, link: this.buildLink(message) };
    }
  }

  async notifyOwnerNewOrder(order: { orderNumber: string; total: number; delivery: { fullName: string; phone: string } }) {
    const trackLink = `${this.storeUrl}/track/${order.orderNumber}`;
    const message =
      `🛍️ New FocusTM Order — #${order.orderNumber}\n` +
      `Customer: ${order.delivery.fullName} (${order.delivery.phone})\n` +
      `Total: ₦${order.total.toLocaleString()}\n\n` +
      `View & update: ${trackLink}`;
    return this.send(message);
  }

  async notifyOwnerCustomOrder(request: { requestNumber: string; fullName: string; phone: string; itemType: string }) {
    const message =
      `✏️ New Custom Order Request — #${request.requestNumber}\n` +
      `Customer: ${request.fullName} (${request.phone})\n` +
      `Item: ${request.itemType}\n\n` +
      `Review it in the admin panel.`;
    return this.send(message);
  }
}
