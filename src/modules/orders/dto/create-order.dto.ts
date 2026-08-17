import { Type } from "class-transformer";
import {
  IsArray,
  IsString,
  IsNumber,
  IsIn,
  IsOptional,
  ValidateNested,
  Min,
  ArrayMinSize,
} from "class-validator";

class OrderItemDto {
  @IsString()
  productId: string;

  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  image?: string;

  @IsNumber()
  @Min(0)
  price: number;

  @IsOptional()
  @IsString()
  size?: string;

  @IsOptional()
  @IsString()
  color?: string;

  @IsNumber()
  @Min(1)
  quantity: number;

  @IsOptional()
  @IsString()
  customNote?: string;
}

class DeliveryDetailsDto {
  @IsString()
  fullName: string;

  @IsString()
  phone: string;

  @IsOptional()
  @IsString()
  email?: string;

  @IsIn(["delivery", "pickup"])
  method: string;

  @IsString()
  state: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  pickupLocationId?: string;

  @IsOptional()
  @IsString()
  note?: string;
}

export class CreateOrderDto {
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];

  @IsNumber()
  @Min(0)
  subtotal: number;

  @IsNumber()
  @Min(0)
  deliveryFee: number;

  @IsNumber()
  @Min(0)
  total: number;

  @ValidateNested()
  @Type(() => DeliveryDetailsDto)
  delivery: DeliveryDetailsDto;

  @IsIn(["whatsapp", "monnify"])
  paymentMethod: string;
}
