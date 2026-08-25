import { OrdersService } from "./orders.service";
import { CreateOrderDto } from "./dto/create-order.dto";
import { UpdateOrderStatusDto } from "./dto/update-order-status.dto";
export declare class OrdersController {
    private readonly ordersService;
    constructor(ordersService: OrdersService);
    create(dto: CreateOrderDto, req: any): Promise<any>;
    track(orderNumber: string): Promise<{
        orderNumber: string;
        status: string;
        createdAt: Date;
        items: {
            productId: string;
            name: string;
            image: string;
            price: number;
            size: string;
            color: string;
            quantity: number;
            customNote?: string;
        }[];
        subtotal: number;
        deliveryFee: number;
        total: number;
        paymentMethod: string;
        customerName: string;
        method: string;
        state: string;
        city: string;
        address: string;
    }>;
    findAll(): Promise<any[]>;
    findMine(req: any): Promise<any[]>;
    findOne(id: string): Promise<any>;
    updateStatus(id: string, dto: UpdateOrderStatusDto): Promise<any>;
}
