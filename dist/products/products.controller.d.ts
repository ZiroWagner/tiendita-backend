import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { StorageService } from '../storage/storage.service';
export declare class ProductsController {
    private readonly productsService;
    private readonly storageService;
    constructor(productsService: ProductsService, storageService: StorageService);
    create(createProductDto: CreateProductDto, file?: Express.Multer.File): Promise<{
        category: {
            name: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
        };
    } & {
        name: string;
        description: string | null;
        id: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        price: number;
        stock: number;
        unit: string | null;
        image: string | null;
        categoryId: string;
    }>;
    findAll(categoryId?: string): Promise<({
        category: {
            name: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
        };
    } & {
        name: string;
        description: string | null;
        id: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        price: number;
        stock: number;
        unit: string | null;
        image: string | null;
        categoryId: string;
    })[]>;
    findOne(id: string): Promise<{
        category: {
            name: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
        };
    } & {
        name: string;
        description: string | null;
        id: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        price: number;
        stock: number;
        unit: string | null;
        image: string | null;
        categoryId: string;
    }>;
    update(id: string, updateProductDto: UpdateProductDto, file?: Express.Multer.File): Promise<{
        category: {
            name: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
        };
    } & {
        name: string;
        description: string | null;
        id: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        price: number;
        stock: number;
        unit: string | null;
        image: string | null;
        categoryId: string;
    }>;
    updateStock(id: string, quantity: number): Promise<{
        name: string;
        description: string | null;
        id: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        price: number;
        stock: number;
        unit: string | null;
        image: string | null;
        categoryId: string;
    }>;
    remove(id: string): Promise<{
        name: string;
        description: string | null;
        id: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        price: number;
        stock: number;
        unit: string | null;
        image: string | null;
        categoryId: string;
    }>;
}
