import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { CustomOrder, CustomOrderSchema } from "./custom-order.schema";
import { CustomOrdersService } from "./custom-orders.service";
import { CustomOrdersController } from "./custom-orders.controller";
import { NotificationsModule } from "../notifications/notifications.module";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: CustomOrder.name, schema: CustomOrderSchema }]),
    NotificationsModule,
  ],
  controllers: [CustomOrdersController],
  providers: [CustomOrdersService],
})
export class CustomOrdersModule {}
