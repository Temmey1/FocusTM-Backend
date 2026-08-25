import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Product, ProductDocument } from "./product.schema";
import { CreateProductDto } from "./dto/create-product.dto";
import { UpdateProductDto } from "./dto/update-product.dto";
import { getFirebaseAdmin } from "../../config/firebase-admin";
import * as path from "path";
import { v4 as uuid } from "uuid";

@Injectable()
export class ProductsService {
  constructor(@InjectModel(Product.name) private productModel: Model<ProductDocument>) {}

  private serialize(doc: ProductDocument) {
    const obj = doc.toObject();
    return { ...obj, id: doc._id.toString(), _id: undefined };
  }

  create(dto: CreateProductDto) {
    return this.productModel.create(dto).then((d) => this.serialize(d as any));
  }

  async findAll(category?: string, opts?: { limit?: number; skip?: number }) {
    const filter = category ? { category } : {};
    const q = this.productModel.find(filter).sort({ createdAt: -1 });
    if (typeof opts?.limit === "number") q.limit(opts.limit);
    if (typeof opts?.skip === "number") q.skip(opts.skip);
    const [docs, total] = await Promise.all([
      q.exec(),
      this.productModel.countDocuments(filter).exec(),
    ]);
    return { data: docs.map((d) => this.serialize(d)), total };
  }

  async findBySlug(slug: string) {
    const product = await this.productModel.findOne({ slug }).exec();
    if (!product) throw new NotFoundException("Product not found");
    return this.serialize(product);
  }

  async findOne(id: string) {
    const product = await this.productModel.findById(id).exec();
    if (!product) throw new NotFoundException("Product not found");
    return this.serialize(product);
  }

  async update(id: string, dto: UpdateProductDto) {
    const product = await this.productModel.findByIdAndUpdate(id, dto, { new: true }).exec();
    if (!product) throw new NotFoundException("Product not found");
    return this.serialize(product);
  }

  async remove(id: string) {
    const result = await this.productModel.findByIdAndDelete(id).exec();
    if (!result) throw new NotFoundException("Product not found");
    return { success: true };
  }

  async decrementStock(id: string, quantity: number) {
    await this.productModel.findByIdAndUpdate(id, { $inc: { stock: -quantity } }).exec();
  }

  async uploadImages(files: Express.Multer.File[]): Promise<{ urls: string[] }> {
    if (!files || files.length === 0) throw new BadRequestException("No files provided");

    const bucketName = process.env.FIREBASE_STORAGE_BUCKET;
    const urls: string[] = [];

    const admin = getFirebaseAdmin();

    if (!bucketName) {
      throw new BadRequestException(
        "FIREBASE_STORAGE_BUCKET not configured. Set FIREBASE_STORAGE_BUCKET in .env to enable image uploads.",
      );
    }

    const bucket = admin.storage().bucket(bucketName);

    for (const file of files) {
      if (!file.mimetype.startsWith("image/")) continue;
      const ext = path.extname(file.originalname) || ".png";
      const filename = `products/${Date.now()}-${uuid().slice(0, 8)}${ext}`;
      const fileRef = bucket.file(filename);
      await fileRef.save(file.buffer, {
        metadata: { contentType: file.mimetype, cacheControl: "public, max-age=31536000" },
        public: true,
      });
      urls.push(fileRef.publicUrl());
    }

    return { urls };
  }
}
