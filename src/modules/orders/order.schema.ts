import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type OrderDocument = Order & Document;

@Schema({ _id: false })
class OrderItem {
  @Prop({ required: true })
  productId: string;

  @Prop({ required: true })
  name: string;

  @Prop()
  image: string;

  @Prop({ required: true })
  price: number;

  @Prop()
  size: string;

  @Prop()
  color: string;

  @Prop({ required: true })
  quantity: number;

  @Prop()
  customNote?: string;
}

@Schema({ _id: false })
class DeliveryDetails {
  @Prop({ required: true })
  fullName: string;

  @Prop({ required: true })
  phone: string;

  @Prop()
  email?: string;

  @Prop({ required: true, enum: ["delivery", "pickup"] })
  method: string;

  @Prop({ required: true })
  state: string;

  @Prop()
  city?: string;

  @Prop()
  address?: string;

  @Prop()
  pickupLocationId?: string;

  @Prop()
  note?: string;
}

@Schema({ timestamps: true })
export class Order {
  @Prop({ required: true, unique: true })
  orderNumber: string;

  @Prop({ type: [OrderItem], required: true })
  items: OrderItem[];

  @Prop({ required: true })
  subtotal: number;

  @Prop({ required: true, default: 0 })
  deliveryFee: number;

  @Prop({ required: true })
  total: number;

  @Prop({ type: DeliveryDetails, required: true })
  delivery: DeliveryDetails;

  @Prop({ required: true, enum: ["whatsapp", "monnify"] })
  paymentMethod: string;

  @Prop({
    default: "pending",
    enum: ["pending", "paid", "processing", "shipped", "completed", "cancelled"],
  })
  status: string;

  @Prop({ default: null })
  userId?: string | null;

  @Prop({ default: null })
  monnifyTransactionReference?: string | null;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
