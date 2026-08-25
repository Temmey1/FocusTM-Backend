import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { DeliveryLocation, DeliveryLocationSchema } from "./location.schema";
import { LocationsService } from "./locations.service";
import { LocationsController } from "./locations.controller";

@Module({
  imports: [MongooseModule.forFeature([{ name: DeliveryLocation.name, schema: DeliveryLocationSchema }])],
  controllers: [LocationsController],
  providers: [LocationsService],
  exports: [LocationsService],
})
export class LocationsModule {}
