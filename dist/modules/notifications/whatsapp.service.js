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
var WhatsappService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.WhatsappService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const axios_1 = require("axios");
let WhatsappService = WhatsappService_1 = class WhatsappService {
    constructor(config) {
        this.config = config;
        this.logger = new common_1.Logger(WhatsappService_1.name);
    }
    get ownerNumber() {
        return this.config.get("OWNER_WHATSAPP_NUMBER") || this.config.get("WHATSAPP_NUMBER");
    }
    get storeUrl() {
        return this.config.get("FRONTEND_URL") || "http://localhost:3000";
    }
    buildLink(message) {
        const number = this.ownerNumber;
        return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
    }
    async send(message) {
        const token = this.config.get("WHATSAPP_CLOUD_API_TOKEN");
        const phoneId = this.config.get("WHATSAPP_CLOUD_PHONE_ID");
        const to = this.ownerNumber;
        if (!token || !phoneId || !to) {
            this.logger.log(`[WhatsApp fallback] Open this link to notify the owner:\n${this.buildLink(message)}`);
            return { sent: false, link: this.buildLink(message) };
        }
        try {
            await axios_1.default.post(`https://graph.facebook.com/v20.0/${phoneId}/messages`, {
                messaging_product: "whatsapp",
                to,
                type: "text",
                text: { body: message },
            }, { headers: { Authorization: `Bearer ${token}` } });
            return { sent: true, link: this.buildLink(message) };
        }
        catch (err) {
            this.logger.error("WhatsApp Cloud API send failed, falling back to link", err);
            return { sent: false, link: this.buildLink(message) };
        }
    }
    async notifyOwnerNewOrder(order) {
        const trackLink = `${this.storeUrl}/track/${order.orderNumber}`;
        const message = `🛍️ New FocusTM Order — #${order.orderNumber}\n` +
            `Customer: ${order.delivery.fullName} (${order.delivery.phone})\n` +
            `Total: ₦${order.total.toLocaleString()}\n\n` +
            `View & update: ${trackLink}`;
        return this.send(message);
    }
    async notifyOwnerCustomOrder(request) {
        const message = `✏️ New Custom Order Request — #${request.requestNumber}\n` +
            `Customer: ${request.fullName} (${request.phone})\n` +
            `Item: ${request.itemType}\n\n` +
            `Review it in the admin panel.`;
        return this.send(message);
    }
};
exports.WhatsappService = WhatsappService;
exports.WhatsappService = WhatsappService = WhatsappService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], WhatsappService);
//# sourceMappingURL=whatsapp.service.js.map