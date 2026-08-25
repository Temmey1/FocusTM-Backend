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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomOrdersService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const uuid_1 = require("uuid");
const custom_order_schema_1 = require("./custom-order.schema");
const notifications_service_1 = require("../notifications/notifications.service");
const whatsapp_service_1 = require("../notifications/whatsapp.service");
let CustomOrdersService = class CustomOrdersService {
    constructor(model, notifications, whatsapp) {
        this.model = model;
        this.notifications = notifications;
        this.whatsapp = whatsapp;
    }
    async create(dto, userId) {
        const requestNumber = `FTM-CUSTOM-${Date.now().toString().slice(-6)}-${(0, uuid_1.v4)().slice(0, 4).toUpperCase()}`;
        const doc = await this.model.create({ ...dto, requestNumber, userId: userId || null, status: "new" });
        this.notifications.notifyAdminCustomOrder(doc).catch(() => undefined);
        this.whatsapp.notifyOwnerCustomOrder(doc).catch(() => undefined);
        return doc;
    }
    findAll() {
        return this.model.find().sort({ createdAt: -1 }).exec();
    }
    findByUser(userId) {
        return this.model.find({ userId }).sort({ createdAt: -1 }).exec();
    }
    async update(id, dto) {
        const doc = await this.model.findByIdAndUpdate(id, dto, { new: true }).exec();
        if (!doc)
            throw new common_1.NotFoundException("Custom order request not found");
        return doc;
    }
};
exports.CustomOrdersService = CustomOrdersService;
exports.CustomOrdersService = CustomOrdersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(custom_order_schema_1.CustomOrder.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        notifications_service_1.NotificationsService,
        whatsapp_service_1.WhatsappService])
], CustomOrdersService);
//# sourceMappingURL=custom-orders.service.js.map