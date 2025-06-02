import { SaleStatus, PaymentMethod } from '@prisma/client';
export declare class UpdateSaleDto {
    status?: SaleStatus;
    paymentMethod?: PaymentMethod;
}
