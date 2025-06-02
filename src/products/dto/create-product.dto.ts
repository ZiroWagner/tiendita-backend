import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumber, IsOptional, Min, IsUUID } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateProductDto {
  @ApiProperty({
    example: 'Coca Cola 600ml',
    description: 'The name of the product',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: 'Refreshing cola beverage in a 600ml bottle',
    description: 'The description of the product',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    example: 15.5,
    description: 'The price of the product',
  })
  @Transform(({ value }) => typeof value === 'string' ? parseFloat(value) : value)
  @IsNumber()
  @Min(0)
  @IsNotEmpty()
  price: number;

  @ApiProperty({
    example: 100,
    description: 'The stock quantity of the product',
  })
  @Transform(({ value }) => typeof value === 'string' ? parseInt(value) : value)
  @IsNumber()
  @Min(0)
  @IsNotEmpty()
  stock: number;

  @ApiProperty({
    example: 'kg',
    description: 'The unit of measurement for the product (kg, g, l, ml, unit, etc.)',
    required: false,
  })
  @IsString()
  @IsOptional()
  unit?: string;

  @ApiProperty({
    example: 'https://example.com/image.jpg',
    description: 'The image URL of the product',
    required: false,
  })
  @IsString()
  @IsOptional()
  image?: string;

  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'The category ID of the product',
  })
  @IsUUID()
  @IsNotEmpty()
  categoryId: string;
}
