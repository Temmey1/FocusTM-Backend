import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as nodemailer from "nodemailer";
import { Order } from "../orders/order.schema";
import { CustomOrder } from "../custom-orders/custom-order.schema";

const emailShell = (title: string, bodyHtml: string) => `
  <div style="font-family: Arial, sans-serif; background:#080808; color:#f2f0ed; padding:32px;">
    <h2 style="color:#f2f0ed; font-weight:400; border-bottom:1px solid #2e2e2e; padding-bottom:16px;">${title}</h2>
    ${bodyHtml}
    <p style="margin-top:32px; text-transform:uppercase; letter-spacing:3px; color:#dcd9d4; font-size:11px;">
      Excellence Is The Standard
    </p>
  </div>
`;

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);
  private transporter: nodemailer.Transporter | null = null;

  constructor(private config: ConfigService) {
    const host = this.config.get<string>("SMTP_HOST");
    if (host) {
      this.transporter = nodemailer.createTransport({
        host,
        port: Number(this.config.get<string>("SMTP_PORT") || 587),
        secure: false,
        auth: {
          user: this.config.get<string>("SMTP_USER"),
          pass: this.config.get<string>("SMTP_PASS"),
        },
      });
    }
  }

  private get fromAddress() {
    return this.config.get<string>("SMTP_FROM") || "FocusTM Collection <orders@focustm.com>";
  }

  private get storeUrl() {
    return this.config.get<string>("FRONTEND_URL") || "http://localhost:3000";
  }

  async sendOrderConfirmation(order: Order & { orderNumber: string }) {
    if (!this.transporter || !order.delivery?.email) {
      this.logger.log(`Skipping customer email (no SMTP config or no email given) for ${order.orderNumber}`);
      return;
    }

    const trackLink = `${this.storeUrl}/track/${order.orderNumber}`;

    try {
      await this.transporter.sendMail({
        from: this.fromAddress,
        to: order.delivery.email,
        subject: `FocusTM Order Confirmation — #${order.orderNumber}`,
        html: emailShell(
          "Thank you for shopping FocusTM Collection",
          `
            <p>Order <strong>#${order.orderNumber}</strong> has been received.</p>
            <p>Total: <strong>₦${order.total.toLocaleString()}</strong></p>
            <p>Track your order anytime: <a href="${trackLink}" style="color:#dcd9d4;">${trackLink}</a></p>
            <p>We'll notify you as your order is processed and shipped.</p>
          `
        ),
      });
    } catch (err) {
      this.logger.error("Failed to send order confirmation email", err as Error);
    }
  }

  async notifyAdminNewOrder(order: Order & { orderNumber: string }) {
    if (!this.transporter) return;
    const adminEmail = this.config.get<string>("ADMIN_NOTIFICATION_EMAIL");
    if (!adminEmail) return;

    try {
      await this.transporter.sendMail({
        from: this.fromAddress,
        to: adminEmail,
        subject: `New Order Received — #${order.orderNumber}`,
        html: emailShell(
          "New Order Received",
          `<p>${order.delivery.fullName} (${order.delivery.phone}) — <strong>₦${order.total.toLocaleString()}</strong></p>
           <p>Payment: ${order.paymentMethod}</p>`
        ),
      });
    } catch (err) {
      this.logger.error("Failed to notify admin of new order", err as Error);
    }
  }

  async notifyAdminCustomOrder(request: CustomOrder & { requestNumber: string }) {
    if (!this.transporter) return;
    const adminEmail = this.config.get<string>("ADMIN_NOTIFICATION_EMAIL");
    if (!adminEmail) return;

    try {
      await this.transporter.sendMail({
        from: this.fromAddress,
        to: adminEmail,
        subject: `New Custom Order Request — #${request.requestNumber}`,
        html: emailShell(
          "New Custom Order Request",
          `<p>${request.fullName} (${request.phone}) wants: <strong>${request.itemType}</strong></p>
           <p>${request.description}</p>`
        ),
      });
    } catch (err) {
      this.logger.error("Failed to notify admin of custom order request", err as Error);
    }
  }
}
