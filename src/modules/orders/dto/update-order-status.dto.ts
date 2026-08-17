import { IsIn } from "class-validator";

export class UpdateOrderStatusDto {
  @IsIn(["pending", "paid", "processing", "shipped", "completed", "cancelled"])
  status: string;
}
