import { Injectable, NotFoundException, ConflictException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { RedisService } from '../redis/redis.service';

@Injectable()
export class ProductsService {
  private readonly CACHE_TTL = 3600; // 1 hora en segundos
  private readonly PRODUCTS_CACHE_KEY = 'products';
  private readonly PRODUCT_CACHE_KEY_PREFIX = 'product:';
  private readonly CATEGORY_PRODUCTS_PREFIX = 'category_products:';
  private readonly logger = new Logger(ProductsService.name);

  constructor(
    private prisma: PrismaService,
    private redisService: RedisService
  ) {}

  async create(createProductDto: CreateProductDto) {
    const { categoryId } = createProductDto;

    // Check if category exists
    const category = await this.prisma.category.findUnique({
      where: { id: categoryId },
    });

    if (!category) {
      throw new NotFoundException(`Category with ID ${categoryId} not found`);
    }

    const product = await this.prisma.product.create({
      data: createProductDto,
      include: {
        category: true,
      },
    });
    
    // Invalidar caches
    await this.invalidateProductCaches(product.id, product.categoryId);
    
    return product;
  }

  async findAll(categoryId?: string) {
    const cacheKey = categoryId 
      ? `${this.CATEGORY_PRODUCTS_PREFIX}${categoryId}` 
      : this.PRODUCTS_CACHE_KEY;
    
    // Intentar obtener productos desde la cache
    const cachedProducts = await this.redisService.get<any[]>(cacheKey);
    
    if (cachedProducts) {
      this.logger.log(`Cache hit for ${cacheKey}`);
      return cachedProducts;
    }
    
    this.logger.log(`Cache miss for ${cacheKey}`);

    // Si no está en la cache, obtener desde la base de datos
    const where = categoryId ? { categoryId } : { status: 'active' };

    const products = await this.prisma.product.findMany({
      where,
      include: {
        category: true,
      },
    });
    
    // Guardar en cache
    await this.redisService.set(cacheKey, products, this.CACHE_TTL);
    
    return products;
  }

  async findOne(id: string) {
    const cacheKey = `${this.PRODUCT_CACHE_KEY_PREFIX}${id}`;
    
    // Intentar obtener producto desde la cache
    const cachedProduct = await this.redisService.get(cacheKey);
    
    if (cachedProduct) {
      this.logger.log(`Cache hit for ${cacheKey}`);
      return cachedProduct;
    }
    
    this.logger.log(`Cache miss for ${cacheKey}`);

    const product = await this.prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
      },
    });

    if (!product || product.status !== "active") {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    await this.redisService.set(cacheKey, product, this.CACHE_TTL);

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

    const updatedProduct = await this.prisma.product.update({
      where: { id },
      data: updateProductDto,
      include: {
        category: true,
      },
    });

    await this.invalidateProductCaches(id, product.categoryId);
    if (categoryId && categoryId !== product.categoryId) {
      await this.invalidateCategoryCache(categoryId);
    }
    
    return updatedProduct;
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

    const updatedProduct = await this.prisma.product.update({
      where: { id },
      data: {
        stock: newStock,
      },
    });

    await this.invalidateProductCaches(id, product.categoryId);
    
    return updatedProduct;
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

    const deletedProduct = await this.prisma.product.update({
      where: { id },
      data: { status: "inactive" },
    });

    await this.invalidateProductCaches(id, product.categoryId);
    
    return deletedProduct;
  }

  // Método auxiliar para invalidar todas las caches relacionadas con un producto
  private async invalidateProductCaches(productId: string, categoryId: string) {
    const productCacheKey = `${this.PRODUCT_CACHE_KEY_PREFIX}${productId}`;
    await this.redisService.del(productCacheKey);
    await this.redisService.del(this.PRODUCTS_CACHE_KEY);
    await this.invalidateCategoryCache(categoryId);
    
    this.logger.log(`Invalidated cache for product ${productId}`);
  }
  
  // Método auxiliar para invalidar la cache de una categoría
  private async invalidateCategoryCache(categoryId: string) {
    const categoryCacheKey = `${this.CATEGORY_PRODUCTS_PREFIX}${categoryId}`;
    await this.redisService.del(categoryCacheKey);
    
    this.logger.log(`Invalidated cache for category ${categoryId}`);
  }
}