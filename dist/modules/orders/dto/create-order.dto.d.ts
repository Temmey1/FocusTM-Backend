declare class OrderItemDto {
    productId: string;
    name: string;
    image?: string;
    price: number;
    size?: string;
    color?: string;
    quantity: number;
    customNote?: string;
}
declare class DeliveryDetailsDto {
    fullName: string;
    phone: string;
    email?: string;
    method: string;
    state: string;
    city?: string;
    address?: string;
    pickupLocationId?: string;
    note?: string;
}
export declare class CreateOrderDto {
    items: OrderItemDto[];
    subtotal: number;
    deliveryFee: number;
    total: number;
    delivery: DeliveryDetailsDto;
    paymentMethod: string;
}
export {};
