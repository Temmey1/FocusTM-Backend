import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type PushSubscriptionDocument = PushSubscription & Document;

@Schema({ _id: false })
class PushKeys {
  @Prop({ required: true })
  p256dh: string;

  @Prop({ required: true })
  auth: string;
}

@Schema({ timestamps: true })
export class PushSubscription {
  @Prop({ required: true })
  userId: string;

  @Prop()
  userEmail?: string;

  @Prop({ required: true })
  endpoint: string;

  @Prop({ type: PushKeys, required: true })
  keys: PushKeys;

  @Prop({ default: "admin" })
  scope?: string;

  @Prop({ default: true })
  enabled?: boolean;

  @Prop({ default: null })
  lastError?: string | null;

  createdAt?: Date;
  updatedAt?: Date;
}

export const PushSubscriptionSchema = SchemaFactory.createForClass(PushSubscription);

PushSubscriptionSchema.index({ userId: 1, endpoint: 1 }, { unique: true });
PushSubscriptionSchema.index({ scope: 1, enabled: 1 });
