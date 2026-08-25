import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type CustomOrderDocument = CustomOrder & Document;

@Schema({ timestamps: true })
export class CustomOrder {
  @Prop({ required: true, unique: true })
  requestNumber: string;

  @Prop({ required: true })
  fullName: string;

  @Prop({ required: true })
  phone: string;

  @Prop()
  email?: string;

  @Prop({ required: true })
  itemType: string; // e.g. "Custom Hoodie", "Custom Cap"

  @Prop({ required: true })
  description: string;

  @Prop()
  budget?: string;

  @Prop({ type: [String], default: [] })
  referenceImages: string[];

  @Prop({
    default: "new",
    enum: ["new", "reviewing", "quoted", "in_progress", "completed", "declined"],
  })
  status: string;

  @Prop({ default: null })
  userId?: string | null;

  @Prop()
  adminNote?: string;

  // Added automatically by { timestamps: true } — declared for TS visibility.
  createdAt?: Date;
  updatedAt?: Date;
}

export const CustomOrderSchema = SchemaFactory.createForClass(CustomOrder);
