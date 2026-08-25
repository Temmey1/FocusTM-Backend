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
exports.DeliveryLocationSchema = exports.DeliveryLocation = void 0;
const mongoose_1 = require("@nestjs/mongoose");
let DeliveryLocation = class DeliveryLocation {
};
exports.DeliveryLocation = DeliveryLocation;
__decorate([
    (0, mongoose_1.Prop)({ required: true, enum: ["delivery", "pickup"] }),
    __metadata("design:type", String)
], DeliveryLocation.prototype, "type", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], DeliveryLocation.prototype, "state", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], DeliveryLocation.prototype, "city", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], DeliveryLocation.prototype, "address", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], DeliveryLocation.prototype, "fee", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: true }),
    __metadata("design:type", Boolean)
], DeliveryLocation.prototype, "active", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], DeliveryLocation.prototype, "note", void 0);
exports.DeliveryLocation = DeliveryLocation = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], DeliveryLocation);
exports.DeliveryLocationSchema = mongoose_1.SchemaFactory.createForClass(DeliveryLocation);
//# sourceMappingURL=location.schema.js.map