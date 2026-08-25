import { ProductsService } from "./products.service";
import { CreateProductDto } from "./dto/create-product.dto";
import { UpdateProductDto } from "./dto/update-product.dto";
export declare class ProductsController {
    private readonly productsService;
    constructor(productsService: ProductsService);
    findAll(category?: string, limit?: string, skip?: string): Promise<any[] | {
        data: any[];
        total: number;
    }>;
    findBySlug(slug: string): Promise<any>;
    findOne(id: string): Promise<any>;
    uploadImages(files: Express.Multer.File[]): Promise<{
        urls: string[];
    }>;
    create(dto: CreateProductDto): Promise<any>;
    update(id: string, dto: UpdateProductDto): Promise<any>;
    remove(id: string): Promise<{
        success: boolean;
    }>;
}
