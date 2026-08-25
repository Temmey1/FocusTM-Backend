import { Model } from "mongoose";
import { ProductDocument } from "./product.schema";
import { CreateProductDto } from "./dto/create-product.dto";
import { UpdateProductDto } from "./dto/update-product.dto";
export declare class ProductsService {
    private productModel;
    constructor(productModel: Model<ProductDocument>);
    private serialize;
    private getR2Client;
    create(dto: CreateProductDto): Promise<any>;
    findAll(category?: string, opts?: {
        limit?: number;
        skip?: number;
    }): Promise<{
        data: any[];
        total: number;
    }>;
    findBySlug(slug: string): Promise<any>;
    findOne(id: string): Promise<any>;
    update(id: string, dto: UpdateProductDto): Promise<any>;
    remove(id: string): Promise<{
        success: boolean;
    }>;
    decrementStock(id: string, quantity: number): Promise<void>;
    uploadImages(files: Express.Multer.File[]): Promise<{
        urls: string[];
    }>;
}
