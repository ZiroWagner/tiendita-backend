import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { RedisService } from '../redis/redis.service';
export declare class ProductsService {
    private prisma;
    private redisService;
    private readonly CACHE_TTL;
    private readonly PRODUCTS_CACHE_KEY;
    private readonly PRODUCT_CACHE_KEY_PREFIX;
    private readonly CATEGORY_PRODUCTS_PREFIX;
    private readonly logger;
    constructor(prisma: PrismaService, redisService: RedisService);
    create(createProductDto: CreateProductDto): Promise<{
        category: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
        };
    } & {
        id: string;
        name: string;
        description: string | null;
        price: number;
        stock: number;
        unit: string | null;
        image: string | null;
        categoryId: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    findAll(categoryId?: string): Promise<any[]>;
    findOne(id: string): Promise<unknown>;
    update(id: string, updateProductDto: UpdateProductDto): Promise<{
        category: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
        };
    } & {
        id: string;
        name: string;
        description: string | null;
        price: number;
        stock: number;
        unit: string | null;
        image: string | null;
        categoryId: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    updateStock(id: string, quantity: number): Promise<{
        id: string;
        name: string;
        description: string | null;
        price: number;
        stock: number;
        unit: string | null;
        image: string | null;
        categoryId: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    remove(id: string): Promise<{
        id: string;
        name: string;
        description: string | null;
        price: number;
        stock: number;
        unit: string | null;
        image: string | null;
        categoryId: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    private invalidateProductCaches;
    private invalidateCategoryCache;
}
