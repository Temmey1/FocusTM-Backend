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
var PaymentsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentsService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const axios_1 = require("axios");
let PaymentsService = PaymentsService_1 = class PaymentsService {
    constructor(config) {
        this.config = config;
        this.logger = new common_1.Logger(PaymentsService_1.name);
    }
    get baseUrl() {
        return this.config.get("MONNIFY_BASE_URL") || "https://sandbox.monnify.com";
    }
    async authenticate() {
        const apiKey = this.config.get("MONNIFY_API_KEY");
        const secretKey = this.config.get("MONNIFY_SECRET_KEY");
        if (!apiKey || !secretKey) {
            this.logger.warn("Monnify credentials not set — skipping authentication");
            return null;
        }
        const credentials = Buffer.from(`${apiKey}:${secretKey}`).toString("base64");
        const res = await axios_1.default.post(`${this.baseUrl}/api/v1/auth/login`, {}, { headers: { Authorization: `Basic ${credentials}` } });
        return res.data?.responseBody?.accessToken || null;
    }
    async initializeTransaction(params) {
        const token = await this.authenticate();
        if (!token)
            return { checkoutUrl: null };
        const contractCode = this.config.get("MONNIFY_CONTRACT_CODE");
        const res = await axios_1.default.post(`${this.baseUrl}/api/v1/merchant/transactions/init-transaction`, {
            amount: params.amount,
            customerName: params.customerName,
            customerEmail: params.customerEmail || "guest@focustm.com",
            paymentReference: params.paymentReference,
            paymentDescription: "FocusTM Collection Order",
            currencyCode: "NGN",
            contractCode,
            redirectUrl: params.redirectUrl,
            paymentMethods: ["CARD", "ACCOUNT_TRANSFER"],
        }, { headers: { Authorization: `Bearer ${token}` } });
        return { checkoutUrl: res.data?.responseBody?.checkoutUrl || null };
    }
    async verifyTransaction(transactionReference) {
        const token = await this.authenticate();
        if (!token)
            return { paid: false };
        const res = await axios_1.default.get(`${this.baseUrl}/api/v2/transactions/${transactionReference}`, { headers: { Authorization: `Bearer ${token}` } });
        const status = res.data?.responseBody?.paymentStatus;
        return { paid: status === "PAID", raw: res.data };
    }
};
exports.PaymentsService = PaymentsService;
exports.PaymentsService = PaymentsService = PaymentsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], PaymentsService);
//# sourceMappingURL=payments.service.js.map