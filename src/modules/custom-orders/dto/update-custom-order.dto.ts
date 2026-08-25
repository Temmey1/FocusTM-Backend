import { IsIn, IsOptional, IsString } from "class-validator";

export class UpdateCustomOrderDto {
  @IsOptional()
  @IsIn(["new", "reviewing", "quoted", "in_progress", "completed", "declined"])
  status?: string;

  @IsOptional()
  @IsString()
  adminNote?: string;
}
