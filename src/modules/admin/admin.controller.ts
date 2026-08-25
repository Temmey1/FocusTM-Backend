import { Controller, Get, UseGuards, Query } from "@nestjs/common";
import { FirebaseAuthGuard } from "../../common/guards/firebase-auth.guard";
import { AdminGuard } from "../../common/guards/admin.guard";
import { getFirebaseAdmin } from "../../config/firebase-admin";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Order, OrderDocument } from "../orders/order.schema";
import { Product, ProductDocument } from "../products/product.schema";

@UseGuards(FirebaseAuthGuard, AdminGuard)
@Controller("admin")
export class AdminController {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
    @InjectModel(Product.name) private productModel: Model<ProductDocument>
  ) {}

  @Get("stats")
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

  // Registered customer accounts, pulled directly from Firebase Auth.
  @Get("users")
  async getUsers(@Query("pageToken") pageToken?: string) {
    const result = await getFirebaseAdmin().auth().listUsers(100, pageToken);
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
}
