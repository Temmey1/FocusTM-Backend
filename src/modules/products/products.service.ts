import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Product, ProductDocument } from "./product.schema";
import { CreateProductDto } from "./dto/create-product.dto";
import { UpdateProductDto } from "./dto/update-product.dto";
import { S3Client } from "@aws-sdk/client-s3";
import * as path from "path";
import { v4 as uuid } from "uuid";

@Injectable()
export class ProductsService {
  constructor(@InjectModel(Product.name) private productModel: Model<ProductDocument>) {}

  private serialize(doc: ProductDocument) {
    const obj = doc.toObject();
    return { ...obj, id: doc._id.toString(), _id: undefined };
  }

  private getR2Client(): S3Client | null {
    const accountId = process.env.R2_ACCOUNT_ID;
    const accessKeyId = process.env.R2_ACCESS_KEY_ID;
    const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
    if (!accountId || !accessKeyId || !secretAccessKey) return null;
    return new S3Client({
      region: "auto",
      endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
      credentials: { accessKeyId, secretAccessKey },
    });
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

    const bucket = process.env.R2_BUCKET;
    const publicBase = (process.env.R2_PUBLIC_URL || "").replace(/\/$/, "");

    const s3 = this.getR2Client();
    if (!s3) {
      throw new BadRequestException(
        "R2 credentials missing. Set R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET, and R2_PUBLIC_URL in .env to enable image uploads.",
      );
    }
    if (!bucket) {
      throw new BadRequestException("R2_BUCKET not configured in .env");
    }
    if (!publicBase) {
      throw new BadRequestException("R2_PUBLIC_URL not configured in .env (e.g. https://pub-xxxxx.r2.dev)");
    }

    const urls: string[] = [];
    for (const file of files) {
      if (!file.mimetype.startsWith("image/")) continue;
      const ext = path.extname(file.originalname) || ".png";
      const key = `products/${Date.now()}-${uuid().slice(0, 8)}${ext}`;
      await (s3 as any).putObject({
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
}
