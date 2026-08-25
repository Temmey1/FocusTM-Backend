"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LocationsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const location_schema_1 = require("./location.schema");
let LocationsService = class LocationsService {
    constructor(model) {
        this.model = model;
    }
    create(dto) {
        return this.model.create(dto);
    }
    findActive(type) {
        const filter = { active: true };
        if (type)
            filter.type = type;
        return this.model.find(filter).sort({ state: 1, city: 1 }).exec();
    }
    findAll() {
        return this.model.find().sort({ type: 1, state: 1 }).exec();
    }
    async update(id, dto) {
        const loc = await this.model.findByIdAndUpdate(id, dto, { new: true }).exec();
        if (!loc)
            throw new common_1.NotFoundException("Location not found");
        return loc;
    }
    async remove(id) {
        const result = await this.model.findByIdAndDelete(id).exec();
        if (!result)
            throw new common_1.NotFoundException("Location not found");
        return { success: true };
    }
};
exports.LocationsService = LocationsService;
exports.LocationsService = LocationsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(location_schema_1.DeliveryLocation.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], LocationsService);
//# sourceMappingURL=locations.service.js.map