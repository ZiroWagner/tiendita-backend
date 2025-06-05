"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var ProductsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const redis_service_1 = require("../redis/redis.service");
let ProductsService = ProductsService_1 = class ProductsService {
    constructor(prisma, redisService) {
        this.prisma = prisma;
        this.redisService = redisService;
        this.CACHE_TTL = 3600;
        this.PRODUCTS_CACHE_KEY = 'products';
        this.PRODUCT_CACHE_KEY_PREFIX = 'product:';
        this.CATEGORY_PRODUCTS_PREFIX = 'category_products:';
        this.logger = new common_1.Logger(ProductsService_1.name);
    }
    async create(createProductDto) {
        const { categoryId } = createProductDto;
        const category = await this.prisma.category.findUnique({
            where: { id: categoryId },
        });
        if (!category) {
            throw new common_1.NotFoundException(`Category with ID ${categoryId} not found`);
        }
        const product = await this.prisma.product.create({
            data: createProductDto,
            include: {
                category: true,
            },
        });
        await this.invalidateProductCaches(product.id, product.categoryId);
        return product;
    }
    async findAll(categoryId) {
        const cacheKey = categoryId
            ? `${this.CATEGORY_PRODUCTS_PREFIX}${categoryId}`
            : this.PRODUCTS_CACHE_KEY;
        const cachedProducts = await this.redisService.get(cacheKey);
        if (cachedProducts) {
            this.logger.log(`Cache hit for ${cacheKey}`);
            return cachedProducts;
        }
        this.logger.log(`Cache miss for ${cacheKey}`);
        const where = categoryId ? { categoryId } : { status: 'active' };
        const products = await this.prisma.product.findMany({
            where,
            include: {
                category: true,
            },
        });
        await this.redisService.set(cacheKey, products, this.CACHE_TTL);
        return products;
    }
    async findOne(id) {
        const cacheKey = `${this.PRODUCT_CACHE_KEY_PREFIX}${id}`;
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
            throw new common_1.NotFoundException(`Product with ID ${id} not found`);
        }
        await this.redisService.set(cacheKey, product, this.CACHE_TTL);
        return product;
    }
    async update(id, updateProductDto) {
        const { categoryId } = updateProductDto;
        const product = await this.prisma.product.findUnique({
            where: { id },
        });
        if (!product) {
            throw new common_1.NotFoundException(`Product with ID ${id} not found`);
        }
        if (categoryId) {
            const category = await this.prisma.category.findUnique({
                where: { id: categoryId },
            });
            if (!category) {
                throw new common_1.NotFoundException(`Category with ID ${categoryId} not found`);
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
    async updateStock(id, quantity) {
        const product = await this.prisma.product.findUnique({
            where: { id },
        });
        if (!product) {
            throw new common_1.NotFoundException(`Product with ID ${id} not found`);
        }
        const newStock = product.stock + quantity;
        if (newStock < 0) {
            throw new common_1.ConflictException(`Cannot reduce stock below 0. Current stock: ${product.stock}, Requested reduction: ${Math.abs(quantity)}`);
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
    async remove(id) {
        const product = await this.prisma.product.findUnique({
            where: { id },
            include: {
                saleItems: true,
            },
        });
        if (!product || product.status !== "active") {
            throw new common_1.NotFoundException(`Product with ID ${id} not found`);
        }
        if (product.saleItems.length > 0) {
            throw new common_1.ConflictException(`Cannot delete product with ID ${id} because it has associated sales`);
        }
        const deletedProduct = await this.prisma.product.update({
            where: { id },
            data: { status: "inactive" },
        });
        await this.invalidateProductCaches(id, product.categoryId);
        return deletedProduct;
    }
    async invalidateProductCaches(productId, categoryId) {
        const productCacheKey = `${this.PRODUCT_CACHE_KEY_PREFIX}${productId}`;
        await this.redisService.del(productCacheKey);
        await this.redisService.del(this.PRODUCTS_CACHE_KEY);
        await this.invalidateCategoryCache(categoryId);
        this.logger.log(`Invalidated cache for product ${productId}`);
    }
    async invalidateCategoryCache(categoryId) {
        const categoryCacheKey = `${this.CATEGORY_PRODUCTS_PREFIX}${categoryId}`;
        await this.redisService.del(categoryCacheKey);
        this.logger.log(`Invalidated cache for category ${categoryId}`);
    }
};
exports.ProductsService = ProductsService;
exports.ProductsService = ProductsService = ProductsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        redis_service_1.RedisService])
], ProductsService);
//# sourceMappingURL=products.service.js.map