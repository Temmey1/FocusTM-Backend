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
exports.ProductsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const product_schema_1 = require("./product.schema");
const client_s3_1 = require("@aws-sdk/client-s3");
const path = require("path");
const uuid_1 = require("uuid");
let ProductsService = class ProductsService {
    constructor(productModel) {
        this.productModel = productModel;
    }
    serialize(doc) {
        const obj = doc.toObject();
        return { ...obj, id: doc._id.toString(), _id: undefined };
    }
    getR2Client() {
        const accountId = process.env.R2_ACCOUNT_ID;
        const accessKeyId = process.env.R2_ACCESS_KEY_ID;
        const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
        if (!accountId || !accessKeyId || !secretAccessKey)
            return null;
        return new client_s3_1.S3Client({
            region: "auto",
            endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
            credentials: { accessKeyId, secretAccessKey },
        });
    }
    create(dto) {
        return this.productModel.create(dto).then((d) => this.serialize(d));
    }
    async findAll(category, opts) {
        const filter = category ? { category } : {};
        const q = this.productModel.find(filter).sort({ createdAt: -1 });
        if (typeof opts?.limit === "number")
            q.limit(opts.limit);
        if (typeof opts?.skip === "number")
            q.skip(opts.skip);
        const [docs, total] = await Promise.all([
            q.exec(),
            this.productModel.countDocuments(filter).exec(),
        ]);
        return { data: docs.map((d) => this.serialize(d)), total };
    }
    async findBySlug(slug) {
        const product = await this.productModel.findOne({ slug }).exec();
        if (!product)
            throw new common_1.NotFoundException("Product not found");
        return this.serialize(product);
    }
    isValidObjectId(id) {
        return mongoose_2.Types.ObjectId.isValid(id);
    }
    async findOne(id) {
        if (!this.isValidObjectId(id))
            throw new common_1.NotFoundException("Product not found");
        const product = await this.productModel.findById(id).exec();
        if (!product)
            throw new common_1.NotFoundException("Product not found");
        return this.serialize(product);
    }
    async update(id, dto) {
        if (!this.isValidObjectId(id))
            throw new common_1.NotFoundException("Product not found");
        const product = await this.productModel.findByIdAndUpdate(id, dto, { new: true }).exec();
        if (!product)
            throw new common_1.NotFoundException("Product not found");
        return this.serialize(product);
    }
    async remove(id) {
        if (!this.isValidObjectId(id))
            throw new common_1.NotFoundException("Product not found");
        const result = await this.productModel.findByIdAndDelete(id).exec();
        if (!result)
            throw new common_1.NotFoundException("Product not found");
        return { success: true };
    }
    async decrementStock(id, quantity) {
        if (!this.isValidObjectId(id))
            return;
        await this.productModel.findByIdAndUpdate(id, { $inc: { stock: -quantity } }).exec();
    }
    async uploadImages(files) {
        if (!files || files.length === 0)
            throw new common_1.BadRequestException("No files provided");
        const bucket = process.env.R2_BUCKET;
        const publicBase = (process.env.R2_PUBLIC_URL || "").replace(/\/$/, "");
        const s3 = this.getR2Client();
        if (!s3) {
            throw new common_1.BadRequestException("R2 credentials missing. Set R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET, and R2_PUBLIC_URL in .env to enable image uploads.");
        }
        if (!bucket) {
            throw new common_1.BadRequestException("R2_BUCKET not configured in .env");
        }
        if (!publicBase) {
            throw new common_1.BadRequestException("R2_PUBLIC_URL not configured in .env (e.g. https://pub-xxxxx.r2.dev)");
        }
        const urls = [];
        for (const file of files) {
            if (!file.mimetype.startsWith("image/"))
                continue;
            const ext = path.extname(file.originalname) || ".png";
            const key = `products/${Date.now()}-${(0, uuid_1.v4)().slice(0, 8)}${ext}`;
            await s3.putObject({
                Bucket: bucket,
                Key: key,
                Body: file.buffer,
                ContentType: file.mimetype,
                CacheControl: "public, max-age=31536000",
            });
            urls.push(`${publicBase}/${key}`);
        }
        return { urls };
    }
};
exports.ProductsService = ProductsService;
exports.ProductsService = ProductsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(product_schema_1.Product.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], ProductsService);
//# sourceMappingURL=products.service.js.map