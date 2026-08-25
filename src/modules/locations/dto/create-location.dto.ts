import { IsString, IsNumber, IsBoolean, IsOptional, IsIn, Min } from "class-validator";

export class CreateLocationDto {
  @IsIn(["delivery", "pickup"])
  type: string;

  @IsString()
  state: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsNumber()
  @Min(0)
  fee: number;

  @IsOptional()
  @IsBoolean()
  active?: boolean;

  @IsOptional()
  @IsString()
  note?: string;
}
