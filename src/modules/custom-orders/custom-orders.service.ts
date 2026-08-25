import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { v4 as uuid } from "uuid";
import { CustomOrder, CustomOrderDocument } from "./custom-order.schema";
import { CreateCustomOrderDto } from "./dto/create-custom-order.dto";
import { UpdateCustomOrderDto } from "./dto/update-custom-order.dto";
import { NotificationsService } from "../notifications/notifications.service";
import { WhatsappService } from "../notifications/whatsapp.service";

@Injectable()
export class CustomOrdersService {
  constructor(
    @InjectModel(CustomOrder.name) private model: Model<CustomOrderDocument>,
    private notifications: NotificationsService,
    private whatsapp: WhatsappService
  ) {}

  async create(dto: CreateCustomOrderDto, userId?: string | null) {
    const requestNumber = `FTM-CUSTOM-${Date.now().toString().slice(-6)}-${uuid().slice(0, 4).toUpperCase()}`;
    const doc = await this.model.create({ ...dto, requestNumber, userId: userId || null, status: "new" });

    this.notifications.notifyAdminCustomOrder(doc as any).catch(() => undefined);
    this.whatsapp.notifyOwnerCustomOrder(doc as any).catch(() => undefined);

    return doc;
  }

  findAll() {
    return this.model.find().sort({ createdAt: -1 }).exec();
  }

  findByUser(userId: string) {
    return this.model.find({ userId }).sort({ createdAt: -1 }).exec();
  }

  async update(id: string, dto: UpdateCustomOrderDto) {
    const doc = await this.model.findByIdAndUpdate(id, dto, { new: true }).exec();
    if (!doc) throw new NotFoundException("Custom order request not found");
    return doc;
  }
}
