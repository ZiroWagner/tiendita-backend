import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { StorageService } from '../storage/storage.service';
import { RedisService } from '../redis/redis.service';
export declare class ProductsController {
    private readonly productsService;
    private readonly storageService;
    private readonly redisService;
    constructor(productsService: ProductsService, storageService: StorageService, redisService: RedisService);
    create(createProductDto: CreateProductDto, file?: Express.Multer.File): Promise<{
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
    update(id: string, updateProductDto: UpdateProductDto, file?: Express.Multer.File): Promise<{
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
    clearCache(): Promise<{
        message: string;
    }>;
}
