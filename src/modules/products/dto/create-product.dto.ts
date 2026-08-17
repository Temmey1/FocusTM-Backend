import { IsString, IsNumber, IsArray, IsBoolean, IsOptional, IsIn, Min } from "class-validator";

export class CreateProductDto {
  @IsString()
  name: string;

  @IsString()
  slug: string;

  @IsString()
  description: string;

  @IsNumber()
  @Min(0)
  price: number;

  @IsArray()
  @IsOptional()
  images?: string[];

  @IsIn(["tops", "shirts", "caps", "wears"])
  category: string;

  @IsArray()
  @IsOptional()
  sizes?: string[];

  @IsArray()
  @IsOptional()
  colors?: string[];

  @IsBoolean()
  @IsOptional()
  customizable?: boolean;

  @IsNumber()
  @IsOptional()
  stock?: number;

  @IsBoolean()
  @IsOptional()
  featured?: boolean;
}
