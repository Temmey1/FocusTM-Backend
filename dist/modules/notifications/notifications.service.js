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
const emailShell = (title, bodyHtml) => `
  <div style="font-family: Arial, sans-serif; background:#080808; color:#f2f0ed; padding:32px;">
    <h2 style="color:#f2f0ed; font-weight:400; border-bottom:1px solid #2e2e2e; padding-bottom:16px;">${title}</h2>
    ${bodyHtml}
    <p style="margin-top:32px; text-transform:uppercase; letter-spacing:3px; color:#dcd9d4; font-size:11px;">
      Excellence Is The Standard
    </p>
  </div>
`;
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
    get fromAddress() {
        return this.config.get("SMTP_FROM") || "FocusTM Collection <orders@focustm.com>";
    }
    get storeUrl() {
        return this.config.get("FRONTEND_URL") || "http://localhost:3000";
    }
    async sendOrderConfirmation(order) {
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
                html: emailShell("Thank you for shopping FocusTM Collection", `
            <p>Order <strong>#${order.orderNumber}</strong> has been received.</p>
            <p>Total: <strong>₦${order.total.toLocaleString()}</strong></p>
            <p>Track your order anytime: <a href="${trackLink}" style="color:#dcd9d4;">${trackLink}</a></p>
            <p>We'll notify you as your order is processed and shipped.</p>
          `),
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
                from: this.fromAddress,
                to: adminEmail,
                subject: `New Order Received — #${order.orderNumber}`,
                html: emailShell("New Order Received", `<p>${order.delivery.fullName} (${order.delivery.phone}) — <strong>₦${order.total.toLocaleString()}</strong></p>
           <p>Payment: ${order.paymentMethod}</p>`),
            });
        }
        catch (err) {
            this.logger.error("Failed to notify admin of new order", err);
        }
    }
    async notifyAdminCustomOrder(request) {
        if (!this.transporter)
            return;
        const adminEmail = this.config.get("ADMIN_NOTIFICATION_EMAIL");
        if (!adminEmail)
            return;
        try {
            await this.transporter.sendMail({
                from: this.fromAddress,
                to: adminEmail,
                subject: `New Custom Order Request — #${request.requestNumber}`,
                html: emailShell("New Custom Order Request", `<p>${request.fullName} (${request.phone}) wants: <strong>${request.itemType}</strong></p>
           <p>${request.description}</p>`),
            });
        }
        catch (err) {
            this.logger.error("Failed to notify admin of custom order request", err);
        }
    }
};
exports.NotificationsService = NotificationsService;
exports.NotificationsService = NotificationsService = NotificationsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], NotificationsService);
//# sourceMappingURL=notifications.service.js.map