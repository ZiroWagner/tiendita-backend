import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async create(createProductDto: CreateProductDto) {
    const { categoryId } = createProductDto;

    // Check if category exists
    const category = await this.prisma.category.findUnique({
      where: { id: categoryId },
    });

    if (!category) {
      throw new NotFoundException(`Category with ID ${categoryId} not found`);
    }

    return this.prisma.product.create({
      data: createProductDto,
      include: {
        category: true,
      },
    });
  }

  async findAll(categoryId?: string) {
    const where = categoryId ? { categoryId } : { status: 'active' };

    return this.prisma.product.findMany({
      where,
      include: {
        category: true,
      },
    });
  }

  async findOne(id: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
      },
    });

    if (!product || product.status !== "active") {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    return product;
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    const { categoryId } = updateProductDto;

    // Check if product exists
    const product = await this.prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    // Check if category exists if provided
    if (categoryId) {
      const category = await this.prisma.category.findUnique({
        where: { id: categoryId },
      });

      if (!category) {
        throw new NotFoundException(`Category with ID ${categoryId} not found`);
      }
    }

    return this.prisma.product.update({
      where: { id },
      data: updateProductDto,
      include: {
        category: true,
      },
    });
  }

  async updateStock(id: string, quantity: number) {
    const product = await this.prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    const newStock = product.stock + quantity;
    
    if (newStock < 0) {
      throw new ConflictException(`Cannot reduce stock below 0. Current stock: ${product.stock}, Requested reduction: ${Math.abs(quantity)}`);
    }

    return this.prisma.product.update({
      where: { id },
      data: {
        stock: newStock,
      },
    });
  }

  async remove(id: string) {
    // Check if product exists
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: {
        saleItems: true,
      },
    });

    if (!product || product.status!== "active") {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    // Check if product has sale items
    if (product.saleItems.length > 0) {
      throw new ConflictException(
        `Cannot delete product with ID ${id} because it has associated sales`,
      );
    }

    return this.prisma.product.update({
      where: { id },
      data: { status: "inactive" },
    });
  }
}