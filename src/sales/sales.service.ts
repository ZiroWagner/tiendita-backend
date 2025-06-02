import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSaleDto } from './dto/create-sale.dto';
import { UpdateSaleDto } from './dto/update-sale.dto';
import { ProductsService } from '../products/products.service';
import { Prisma, SaleStatus } from '@prisma/client';

// Definir una interfaz personalizada para los items de venta antes de crear la venta
interface SaleItemData {
  productId: string;
  quantity: number;
  price: number;
}

@Injectable()
export class SalesService {
  constructor(
    private prisma: PrismaService,
    private productsService: ProductsService,
  ) {}

  async create(userId: string, createSaleDto: CreateSaleDto) {
    const { items, paymentMethod } = createSaleDto;

    // Check if user exists
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    // Check if all products exist and have enough stock
    const productIds = items.map((item) => item.productId);
    const products = await this.prisma.product.findMany({
      where: {
        id: {
          in: productIds,
        },
      },
    });

    if (products.length !== productIds.length) {
      throw new NotFoundException('One or more products not found');
    }

    // Check stock and calculate total
    let total = 0;
    const saleItems: SaleItemData[] = [];
    const stockUpdates: { id: string; quantity: number }[] = [];

    for (const item of items) {
      const product = products.find((p) => p.id === item.productId);

      if (!product) {
        throw new NotFoundException(`Product with ID ${item.productId} not found`);
      }

      if (product.stock < item.quantity) {
        throw new ConflictException(
          `Not enough stock for product ${product.name}. Available: ${product.stock}, Requested: ${item.quantity}`,
        );
      }

      const itemTotal = product.price * item.quantity;
      total += itemTotal;

      saleItems.push({
        productId: product.id,
        quantity: item.quantity,
        price: product.price,
      });

      stockUpdates.push({
        id: product.id,
        quantity: -item.quantity, // Negative to reduce stock
      });
    }

    // Create sale and sale items in a transaction
    const sale = await this.prisma.$transaction(async (prisma) => {
      // Create sale first without items
      const newSale = await prisma.sale.create({
        data: {
          userId,
          total,
          paymentMethod,
        },
        select: {
          id: true,
        },
      });

      // Then create sale items with the sale ID
      for (const item of saleItems) {
        await prisma.saleItem.create({
          data: {
            saleId: newSale.id,
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
          },
        });
      }

      // Fetch the complete sale with items
      const completeSale = await prisma.sale.findUnique({
        where: { id: newSale.id },
        include: {
          items: {
            include: {
              product: true,
            },
          },
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });

      // Update product stock
      for (const update of stockUpdates) {
        await prisma.product.update({
          where: { id: update.id },
          data: {
            stock: {
              decrement: Math.abs(update.quantity),
            },
          },
        });
      }

      return completeSale;
    });

    return sale;
  }

  async findAll(userId?: string, startDate?: Date, endDate?: Date) {
    const where: Prisma.SaleWhereInput = {};

    if (userId) {
      where.userId = userId;
      where.isDeleted = false;
    }

    if (startDate || endDate) {
      where.createdAt = {};

      if (startDate) {
        where.createdAt.gte = startDate;
      }

      if (endDate) {
        where.createdAt.lte = endDate;
      }
    }

    return this.prisma.sale.findMany({
      where,
      include: {
        items: {
          include: {
            product: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: string) {
    const sale = await this.prisma.sale.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            product: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!sale || sale.isDeleted) {
      throw new NotFoundException(`Sale with ID ${id} not found`);
    }

    return sale;
  }

  async update(id: string, updateSaleDto: UpdateSaleDto) {
    const { status } = updateSaleDto;

    // Check if sale exists
    const sale = await this.prisma.sale.findUnique({
      where: { id },
      include: {
        items: true,
      },
    });

    if (!sale) {
      throw new NotFoundException(`Sale with ID ${id} not found`);
    }

    // If changing status to CANCELLED, restore product stock
    if (status === SaleStatus.CANCELLED && sale.status !== SaleStatus.CANCELLED) {
      await this.prisma.$transaction(async (prisma) => {
        // Update sale status
        await prisma.sale.update({
          where: { id },
          data: updateSaleDto,
        });

        // Restore product stock
        for (const item of sale.items) {
          await prisma.product.update({
            where: { id: item.productId },
            data: {
              stock: {
                increment: item.quantity,
              },
            },
          });
        }
      });
    } else {
      // Just update the sale
      await this.prisma.sale.update({
        where: { id },
        data: updateSaleDto,
      });
    }

    return this.findOne(id);
  }

  async remove(id: string) {
    // Check if sale exists
    const sale = await this.prisma.sale.findUnique({
      where: { id },
      include: {
        items: true,
      },
    });

    if (!sale || sale.isDeleted) {
      throw new NotFoundException(`Sale with ID ${id} not found`);
    }

    // Delete sale and restore product stock if not cancelled
    if (sale.status !== SaleStatus.CANCELLED) {
      await this.prisma.$transaction(async (prisma) => {
        // Delete sale
        await prisma.sale.delete({
          where: { id },
        });

        // Restore product stock
        for (const item of sale.items) {
          await prisma.product.update({
            where: { id: item.productId },
            data: {
              stock: {
                increment: item.quantity,
              },
            },
          });
        }
      });
    } else {
      // Just delete the sale
      await this.prisma.sale.update({
        where: { id },
        data: { isDeleted: true },
      });
    }

    return { message: 'Sale deleted successfully' };
  }
}
