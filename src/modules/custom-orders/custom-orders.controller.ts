import { Controller, Get, Post, Put, Body, Param, UseGuards, Req } from "@nestjs/common";
import { CustomOrdersService } from "./custom-orders.service";
import { CreateCustomOrderDto } from "./dto/create-custom-order.dto";
import { UpdateCustomOrderDto } from "./dto/update-custom-order.dto";
import { FirebaseAuthGuard } from "../../common/guards/firebase-auth.guard";
import { AdminGuard } from "../../common/guards/admin.guard";
import { OptionalFirebaseAuthGuard } from "../../common/guards/optional-firebase-auth.guard";

@Controller("custom-orders")
export class CustomOrdersController {
  constructor(private readonly service: CustomOrdersService) {}

  // Guests and signed-in users can both submit a custom order request.
  @UseGuards(OptionalFirebaseAuthGuard)
  @Post()
  create(@Body() dto: CreateCustomOrderDto, @Req() req: any) {
    return this.service.create(dto, req.user?.uid || null);
  }

  @UseGuards(FirebaseAuthGuard)
  @Get("mine")
  findMine(@Req() req: any) {
    return this.service.findByUser(req.user.uid);
  }

  @UseGuards(FirebaseAuthGuard, AdminGuard)
  @Get()
  findAll() {
    return this.service.findAll();
  }

  @UseGuards(FirebaseAuthGuard, AdminGuard)
  @Put(":id")
  update(@Param("id") id: string, @Body() dto: UpdateCustomOrderDto) {
    return this.service.update(id, dto);
  }
}
