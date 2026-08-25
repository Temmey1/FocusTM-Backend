import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type DeliveryLocationDocument = DeliveryLocation & Document;

/**
 * A deliverable/pickup location. `type: "delivery"` rows represent a state
 * (and optional city) with its delivery fee. `type: "pickup"` rows represent
 * an actual pickup address customers can select at checkout.
 */
@Schema({ timestamps: true })
export class DeliveryLocation {
  @Prop({ required: true, enum: ["delivery", "pickup"] })
  type: string;

  @Prop({ required: true })
  state: string;

  @Prop()
  city?: string;

  @Prop()
  address?: string;

  @Prop({ default: 0 })
  fee: number;

  @Prop({ default: true })
  active: boolean;

  @Prop()
  note?: string;
}

export const DeliveryLocationSchema = SchemaFactory.createForClass(DeliveryLocation);
