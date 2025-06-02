import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { SaleStatus, PaymentMethod } from '@prisma/client';

export class UpdateSaleDto {
  @ApiProperty({
    example: 'COMPLETED',
    description: 'The status of the sale',
    enum: SaleStatus,
    required: false,
  })
  @IsEnum(SaleStatus)
  @IsOptional()
  status?: SaleStatus;

  @ApiProperty({
    example: 'CARD',
    description: 'The payment method',
    enum: PaymentMethod,
    required: false,
  })
  @IsEnum(PaymentMethod)
  @IsOptional()
  paymentMethod?: PaymentMethod;
}
