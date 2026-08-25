import { Controller, Get, Post, Put, Param, Body, UseGuards, Req } from "@nestjs/common";
import { OrdersService } from "./orders.service";
import { CreateOrderDto } from "./dto/create-order.dto";
import { UpdateOrderStatusDto } from "./dto/update-order-status.dto";
import { FirebaseAuthGuard } from "../../common/guards/firebase-auth.guard";
import { AdminGuard } from "../../common/guards/admin.guard";
import { OptionalFirebaseAuthGuard } from "../../common/guards/optional-firebase-auth.guard";

@Controller("orders")
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  // Guest checkout supported: auth is optional. If a Firebase token is present,
  // the order is linked to that user; otherwise it's saved as a guest order.
  @UseGuards(OptionalFirebaseAuthGuard)
  @Post()
  create(@Body() dto: CreateOrderDto, @Req() req: any) {
    return this.ordersService.create(dto, req.user?.uid || null);
  }

  // Public order tracking — no auth required, looked up by order number.
  // Used by the store's /track/:orderNumber page and the link sent via
  // WhatsApp/email when an order is placed.
  @Get("track/:orderNumber")
  track(@Param("orderNumber") orderNumber: string) {
    return this.ordersService.findByOrderNumber(orderNumber);
  }

  // Admin: list all orders
  @UseGuards(FirebaseAuthGuard, AdminGuard)
  @Get()
  findAll() {
    return this.ordersService.findAll();
  }

  // Signed-in customer: their own order history
  @UseGuards(FirebaseAuthGuard)
  @Get("my-orders")
  findMine(@Req() req: any) {
    return this.ordersService.findByUser(req.user.uid);
  }

  @UseGuards(FirebaseAuthGuard, AdminGuard)
  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.ordersService.findOne(id);
  }

  @UseGuards(FirebaseAuthGuard, AdminGuard)
  @Put(":id/status")
  updateStatus(@Param("id") id: string, @Body() dto: UpdateOrderStatusDto) {
    return this.ordersService.updateStatus(id, dto.status);
  }
}
