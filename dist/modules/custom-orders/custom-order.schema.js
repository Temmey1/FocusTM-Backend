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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomOrderSchema = exports.CustomOrder = void 0;
const mongoose_1 = require("@nestjs/mongoose");
let CustomOrder = class CustomOrder {
};
exports.CustomOrder = CustomOrder;
__decorate([
    (0, mongoose_1.Prop)({ required: true, unique: true }),
    __metadata("design:type", String)
], CustomOrder.prototype, "requestNumber", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], CustomOrder.prototype, "fullName", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], CustomOrder.prototype, "phone", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], CustomOrder.prototype, "email", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], CustomOrder.prototype, "itemType", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], CustomOrder.prototype, "description", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], CustomOrder.prototype, "budget", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [String], default: [] }),
    __metadata("design:type", Array)
], CustomOrder.prototype, "referenceImages", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        default: "new",
        enum: ["new", "reviewing", "quoted", "in_progress", "completed", "declined"],
    }),
    __metadata("design:type", String)
], CustomOrder.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: null }),
    __metadata("design:type", String)
], CustomOrder.prototype, "userId", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], CustomOrder.prototype, "adminNote", void 0);
exports.CustomOrder = CustomOrder = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], CustomOrder);
exports.CustomOrderSchema = mongoose_1.SchemaFactory.createForClass(CustomOrder);
//# sourceMappingURL=custom-order.schema.js.map