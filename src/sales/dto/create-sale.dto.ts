import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsEnum, IsArray, ValidateNested, IsNumber, Min, IsUUID } from 'class-validator';
import { PaymentMethod } from '@prisma/client';

class SaleItemDto {
  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'The product ID',
  })
  @IsUUID()
  @IsNotEmpty()
  productId: string;

  @ApiProperty({
    example: 2,
    description: 'The quantity of the product',
  })
  @IsNumber()
  @Min(1)
  @IsNotEmpty()
  quantity: number;
}

export class CreateSaleDto {
  @ApiProperty({
    type: [SaleItemDto],
    description: 'The items in the sale',
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SaleItemDto)
  @IsNotEmpty()
  items: SaleItemDto[];

  @ApiProperty({
    example: 'CASH',
    description: 'The payment method',
    enum: PaymentMethod,
  })
  @IsEnum(PaymentMethod)
  @IsNotEmpty()
  paymentMethod: PaymentMethod;
}