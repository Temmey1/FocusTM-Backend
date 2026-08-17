import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Product, ProductDocument } from "./product.schema";
import { CreateProductDto } from "./dto/create-product.dto";
import { UpdateProductDto } from "./dto/update-product.dto";

@Injectable()
export class ProductsService {
  constructor(@InjectModel(Product.name) private productModel: Model<ProductDocument>) {}

  create(dto: CreateProductDto) {
    return this.productModel.create(dto);
  }

  findAll(category?: string) {
    const filter = category ? { category } : {};
    return this.productModel.find(filter).sort({ createdAt: -1 }).exec();
  }

  async findBySlug(slug: string) {
    const product = await this.productModel.findOne({ slug }).exec();
    if (!product) throw new NotFoundException("Product not found");
    return product;
  }

  async findOne(id: string) {
    const product = await this.productModel.findById(id).exec();
    if (!product) throw new NotFoundException("Product not found");
    return product;
  }

  async update(id: string, dto: UpdateProductDto) {
    const product = await this.productModel.findByIdAndUpdate(id, dto, { new: true }).exec();
    if (!product) throw new NotFoundException("Product not found");
    return product;
  }

  async remove(id: string) {
    const result = await this.productModel.findByIdAndDelete(id).exec();
    if (!result) throw new NotFoundException("Product not found");
    return { success: true };
  }

  async decrementStock(id: string, quantity: number) {
    await this.productModel.findByIdAndUpdate(id, { $inc: { stock: -quantity } }).exec();
  }
}
