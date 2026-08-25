import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from "@nestjs/common";
import { LocationsService } from "./locations.service";
import { CreateLocationDto } from "./dto/create-location.dto";
import { UpdateLocationDto } from "./dto/update-location.dto";
import { FirebaseAuthGuard } from "../../common/guards/firebase-auth.guard";
import { AdminGuard } from "../../common/guards/admin.guard";

@Controller("locations")
export class LocationsController {
  constructor(private readonly locationsService: LocationsService) {}

  // Public: store checkout reads active delivery/pickup locations to compute fees.
  @Get()
  findActive(@Query("type") type?: string) {
    return this.locationsService.findActive(type);
  }

  // Admin: full list including inactive, for the management table.
  @UseGuards(FirebaseAuthGuard, AdminGuard)
  @Get("all")
  findAll() {
    return this.locationsService.findAll();
  }

  @UseGuards(FirebaseAuthGuard, AdminGuard)
  @Post()
  create(@Body() dto: CreateLocationDto) {
    return this.locationsService.create(dto);
  }

  @UseGuards(FirebaseAuthGuard, AdminGuard)
  @Put(":id")
  update(@Param("id") id: string, @Body() dto: UpdateLocationDto) {
    return this.locationsService.update(id, dto);
  }

  @UseGuards(FirebaseAuthGuard, AdminGuard)
  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.locationsService.remove(id);
  }
}
