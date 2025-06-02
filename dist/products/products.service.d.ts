import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
export declare class ProductsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(createProductDto: CreateProductDto): Promise<{
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
    update(id: string, updateProductDto: UpdateProductDto): Promise<{
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
