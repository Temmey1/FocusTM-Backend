import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { DeliveryLocation, DeliveryLocationDocument } from "./location.schema";
import { CreateLocationDto } from "./dto/create-location.dto";
import { UpdateLocationDto } from "./dto/update-location.dto";

@Injectable()
export class LocationsService {
  constructor(
    @InjectModel(DeliveryLocation.name) private model: Model<DeliveryLocationDocument>
  ) {}

  create(dto: CreateLocationDto) {
    return this.model.create(dto);
  }

  // Public — used by the store at checkout. Only returns active locations.
  findActive(type?: string) {
    const filter: any = { active: true };
    if (type) filter.type = type;
    return this.model.find(filter).sort({ state: 1, city: 1 }).exec();
  }

  // Admin — returns everything including inactive rows.
  findAll() {
    return this.model.find().sort({ type: 1, state: 1 }).exec();
  }

  async update(id: string, dto: UpdateLocationDto) {
    const loc = await this.model.findByIdAndUpdate(id, dto, { new: true }).exec();
    if (!loc) throw new NotFoundException("Location not found");
    return loc;
  }

  async remove(id: string) {
    const result = await this.model.findByIdAndDelete(id).exec();
    if (!result) throw new NotFoundException("Location not found");
    return { success: true };
  }
}
