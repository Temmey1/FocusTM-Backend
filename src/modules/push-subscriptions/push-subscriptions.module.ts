import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { PushSubscription, PushSubscriptionSchema } from "./push-subscription.schema";
import { PushSubscriptionsService } from "./push-subscriptions.service";
import { PushSubscriptionsController } from "./push-subscriptions.controller";

@Module({
  imports: [MongooseModule.forFeature([{ name: PushSubscription.name, schema: PushSubscriptionSchema }])],
  providers: [PushSubscriptionsService],
  controllers: [PushSubscriptionsController],
  exports: [PushSubscriptionsService],
})
export class PushSubscriptionsModule {}
