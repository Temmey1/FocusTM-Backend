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
exports.CustomOrdersController = void 0;
const common_1 = require("@nestjs/common");
const custom_orders_service_1 = require("./custom-orders.service");
const create_custom_order_dto_1 = require("./dto/create-custom-order.dto");
const update_custom_order_dto_1 = require("./dto/update-custom-order.dto");
const firebase_auth_guard_1 = require("../../common/guards/firebase-auth.guard");
const admin_guard_1 = require("../../common/guards/admin.guard");
const optional_firebase_auth_guard_1 = require("../../common/guards/optional-firebase-auth.guard");
let CustomOrdersController = class CustomOrdersController {
    constructor(service) {
        this.service = service;
    }
    create(dto, req) {
        return this.service.create(dto, req.user?.uid || null);
    }
    findMine(req) {
        return this.service.findByUser(req.user.uid);
    }
    findAll() {
        return this.service.findAll();
    }
    update(id, dto) {
        return this.service.update(id, dto);
    }
};
exports.CustomOrdersController = CustomOrdersController;
__decorate([
    (0, common_1.UseGuards)(optional_firebase_auth_guard_1.OptionalFirebaseAuthGuard),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_custom_order_dto_1.CreateCustomOrderDto, Object]),
    __metadata("design:returntype", void 0)
], CustomOrdersController.prototype, "create", null);
__decorate([
    (0, common_1.UseGuards)(firebase_auth_guard_1.FirebaseAuthGuard),
    (0, common_1.Get)("mine"),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], CustomOrdersController.prototype, "findMine", null);
__decorate([
    (0, common_1.UseGuards)(firebase_auth_guard_1.FirebaseAuthGuard, admin_guard_1.AdminGuard),
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], CustomOrdersController.prototype, "findAll", null);
__decorate([
    (0, common_1.UseGuards)(firebase_auth_guard_1.FirebaseAuthGuard, admin_guard_1.AdminGuard),
    (0, common_1.Put)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_custom_order_dto_1.UpdateCustomOrderDto]),
    __metadata("design:returntype", void 0)
], CustomOrdersController.prototype, "update", null);
exports.CustomOrdersController = CustomOrdersController = __decorate([
    (0, common_1.Controller)("custom-orders"),
    __metadata("design:paramtypes", [custom_orders_service_1.CustomOrdersService])
], CustomOrdersController);
//# sourceMappingURL=custom-orders.controller.js.map