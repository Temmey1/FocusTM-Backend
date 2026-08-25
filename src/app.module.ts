import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";
import { ThrottlerModule, ThrottlerGuard } from "@nestjs/throttler";
import { APP_GUARD } from "@nestjs/core";
import { ProductsModule } from "./modules/products/products.module";
import { OrdersModule } from "./modules/orders/orders.module";
import { PaymentsModule } from "./modules/payments/payments.module";
import { NotificationsModule } from "./modules/notifications/notifications.module";
import { AuthModule } from "./modules/auth/auth.module";
import { LocationsModule } from "./modules/locations/locations.module";
import { CustomOrdersModule } from "./modules/custom-orders/custom-orders.module";
import { AdminModule } from "./modules/admin/admin.module";
import { PushSubscriptionsModule } from "./modules/push-subscriptions/push-subscriptions.module";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(process.env.MONGODB_URI || "mongodb://localhost:27017/focustm"),
    // Basic rate limiting: 60 requests per 60s per IP across the API,
    // protects checkout/auth routes from abuse without needing extra infra.
    ThrottlerModule.forRoot([{ ttl: 60000, limit: 60 }]),
    PushSubscriptionsModule,
    ProductsModule,
    OrdersModule,
    PaymentsModule,
    NotificationsModule,
    AuthModule,
    LocationsModule,
    CustomOrdersModule,
    AdminModule,
  ],
  providers: [{ provide: APP_GUARD, useClass: ThrottlerGuard }],
})
export class AppModule {}
