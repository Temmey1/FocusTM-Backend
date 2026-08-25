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
exports.AdminController = void 0;
const common_1 = require("@nestjs/common");
const firebase_auth_guard_1 = require("../../common/guards/firebase-auth.guard");
const admin_guard_1 = require("../../common/guards/admin.guard");
const firebase_admin_1 = require("../../config/firebase-admin");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const order_schema_1 = require("../orders/order.schema");
const product_schema_1 = require("../products/product.schema");
let AdminController = class AdminController {
    constructor(orderModel, productModel) {
        this.orderModel = orderModel;
        this.productModel = productModel;
    }
    async getStats() {
        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        startOfMonth.setHours(0, 0, 0, 0);
        const [totalOrders, pendingOrders, totalProducts, ordersThisMonth, allPaidOrders] = await Promise.all([
            this.orderModel.countDocuments(),
            this.orderModel.countDocuments({ status: "pending" }),
            this.productModel.countDocuments(),
            this.orderModel.find({ createdAt: { $gte: startOfMonth }, status: { $in: ["paid", "processing", "shipped", "completed"] } }),
            this.orderModel.find({ status: { $in: ["paid", "processing", "shipped", "completed"] } }),
        ]);
        const revenueThisMonth = ordersThisMonth.reduce((sum, o) => sum + o.total, 0);
        const revenueAllTime = allPaidOrders.reduce((sum, o) => sum + o.total, 0);
        return { totalOrders, pendingOrders, totalProducts, revenueThisMonth, revenueAllTime };
    }
    async getUsers(pageToken) {
        const result = await (0, firebase_admin_1.getFirebaseAdmin)().auth().listUsers(100, pageToken);
        const users = result.users.map((u) => ({
            uid: u.uid,
            email: u.email || null,
            phoneNumber: u.phoneNumber || null,
            displayName: u.displayName || null,
            createdAt: u.metadata.creationTime,
            lastSignInAt: u.metadata.lastSignInTime,
            admin: !!u.customClaims?.admin,
        }));
        return { users, nextPageToken: result.pageToken || null };
    }
};
exports.AdminController = AdminController;
__decorate([
    (0, common_1.Get)("stats"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getStats", null);
__decorate([
    (0, common_1.Get)("users"),
    __param(0, (0, common_1.Query)("pageToken")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getUsers", null);
exports.AdminController = AdminController = __decorate([
    (0, common_1.UseGuards)(firebase_auth_guard_1.FirebaseAuthGuard, admin_guard_1.AdminGuard),
    (0, common_1.Controller)("admin"),
    __param(0, (0, mongoose_1.InjectModel)(order_schema_1.Order.name)),
    __param(1, (0, mongoose_1.InjectModel)(product_schema_1.Product.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model])
], AdminController);
//# sourceMappingURL=admin.controller.js.map