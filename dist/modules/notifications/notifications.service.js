"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var NotificationsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationsService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const nodemailer = require("nodemailer");
let NotificationsService = NotificationsService_1 = class NotificationsService {
    constructor(config) {
        this.config = config;
        this.logger = new common_1.Logger(NotificationsService_1.name);
        this.transporter = null;
        const host = this.config.get("SMTP_HOST");
        if (host) {
            this.transporter = nodemailer.createTransport({
                host,
                port: Number(this.config.get("SMTP_PORT") || 587),
                secure: false,
                auth: {
                    user: this.config.get("SMTP_USER"),
                    pass: this.config.get("SMTP_PASS"),
                },
            });
        }
    }
    async sendOrderConfirmation(order) {
        if (!this.transporter || !order.delivery?.email) {
            this.logger.log(`Skipping email (no SMTP config or no customer email) for ${order.orderNumber}`);
            return;
        }
        try {
            await this.transporter.sendMail({
                from: this.config.get("SMTP_FROM") || "FocusTM Collection <orders@focustm.com>",
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
        }
        catch (err) {
            this.logger.error("Failed to send order confirmation email", err);
        }
    }
    async notifyAdminNewOrder(order) {
        if (!this.transporter)
            return;
        const adminEmail = this.config.get("ADMIN_NOTIFICATION_EMAIL");
        if (!adminEmail)
            return;
        try {
            await this.transporter.sendMail({
                from: this.config.get("SMTP_FROM") || "FocusTM Collection <orders@focustm.com>",
                to: adminEmail,
                subject: `New Order Received — #${order.orderNumber}`,
                html: `<p>New order from ${order.delivery.fullName} (${order.delivery.phone}) — Total ₦${order.total.toLocaleString()}</p>`,
            });
        }
        catch (err) {
            this.logger.error("Failed to notify admin of new order", err);
        }
    }
};
exports.NotificationsService = NotificationsService;
exports.NotificationsService = NotificationsService = NotificationsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], NotificationsService);
//# sourceMappingURL=notifications.service.js.map