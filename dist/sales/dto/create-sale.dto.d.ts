import { PaymentMethod } from '@prisma/client';
declare class SaleItemDto {
    productId: string;
    quantity: number;
}
export declare class CreateSaleDto {
    items: SaleItemDto[];
    paymentMethod: PaymentMethod;
}
export {};
