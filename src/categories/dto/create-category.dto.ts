import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({
    example: 'Beverages',
    description: 'The name of the category',
  })
  @IsString()
  @IsNotEmpty()
  name: string;
}