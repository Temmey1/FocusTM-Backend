"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomOrdersModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const custom_order_schema_1 = require("./custom-order.schema");
const custom_orders_service_1 = require("./custom-orders.service");
const custom_orders_controller_1 = require("./custom-orders.controller");
const notifications_module_1 = require("../notifications/notifications.module");
let CustomOrdersModule = class CustomOrdersModule {
};
exports.CustomOrdersModule = CustomOrdersModule;
exports.CustomOrdersModule = CustomOrdersModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([{ name: custom_order_schema_1.CustomOrder.name, schema: custom_order_schema_1.CustomOrderSchema }]),
            notifications_module_1.NotificationsModule,
        ],
        controllers: [custom_orders_controller_1.CustomOrdersController],
        providers: [custom_orders_service_1.CustomOrdersService],
    })
], CustomOrdersModule);
//# sourceMappingURL=custom-orders.module.js.map