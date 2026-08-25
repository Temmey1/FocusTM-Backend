import { IsString, IsOptional, IsArray, IsEmail } from "class-validator";

export class CreateCustomOrderDto {
  @IsString()
  fullName: string;

  @IsString()
  phone: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsString()
  itemType: string;

  @IsString()
  description: string;

  @IsOptional()
  @IsString()
  budget?: string;

  @IsOptional()
  @IsArray()
  referenceImages?: string[];
}
