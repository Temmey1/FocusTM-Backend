import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as nodemailer from "nodemailer";
import { Order } from "../orders/order.schema";

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

  async sendOrderConfirmation(order: Order & { orderNumber: string }) {
    if (!this.transporter || !order.delivery?.email) {
      this.logger.log(`Skipping email (no SMTP config or no customer email) for ${order.orderNumber}`);
      return;
    }

    try {
      await this.transporter.sendMail({
        from: this.config.get<string>("SMTP_FROM") || "FocusTM Collection <orders@focustm.com>",
        to: order.delivery.email,
        subject: `FocusTM Order Confirmation — #${order.orderNumber}`,
        html: `
          <div style="font-family: sans-serif; background:#0a0a0a; color:#f7f7f5; padding:24px;">
            <h2 style="color:#c9a86a;">Thank you for shopping FocusTM Collection</h2>
            <p>Order <strong>#${order.orderNumber}</strong> has been received.</p>
            <p>Total: <strong style="color:#c9a86a;">₦${order.total.toLocaleString()}</strong></p>
            <p>We'll notify you as your order is processed and shipped.</p>
            <p style="margin-top:24px; text-transform:uppercase; letter-spacing:2px; color:#c9a86a; font-size:12px;">
              Excellence Is The Standard
            </p>
          </div>
        `,
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
        from: this.config.get<string>("SMTP_FROM") || "FocusTM Collection <orders@focustm.com>",
        to: adminEmail,
        subject: `New Order Received — #${order.orderNumber}`,
        html: `<p>New order from ${order.delivery.fullName} (${order.delivery.phone}) — Total ₦${order.total.toLocaleString()}</p>`,
      });
    } catch (err) {
      this.logger.error("Failed to notify admin of new order", err as Error);
    }
  }
}
