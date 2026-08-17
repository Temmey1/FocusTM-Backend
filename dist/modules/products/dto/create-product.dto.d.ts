export declare class CreateProductDto {
    name: string;
    slug: string;
    description: string;
    price: number;
    images?: string[];
    category: string;
    sizes?: string[];
    colors?: string[];
    customizable?: boolean;
    stock?: number;
    featured?: boolean;
}
