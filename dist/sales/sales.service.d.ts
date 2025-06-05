import { PrismaService } from '../prisma/prisma.service';
import { CreateSaleDto } from './dto/create-sale.dto';
import { UpdateSaleDto } from './dto/update-sale.dto';
import { ProductsService } from '../products/products.service';
export declare class SalesService {
    private prisma;
    private productsService;
    constructor(prisma: PrismaService, productsService: ProductsService);
    create(userId: string, createSaleDto: CreateSaleDto): Promise<{
        user: {
            id: string;
            name: string;
            email: string;
        };
        items: ({
            product: {
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
            };
        } & {
            id: string;
            price: number;
            createdAt: Date;
            updatedAt: Date;
            saleId: string;
            productId: string;
            quantity: number;
        })[];
    } & {
        id: string;
        status: import(".prisma/client").$Enums.SaleStatus;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        total: number;
        paymentMethod: import(".prisma/client").$Enums.PaymentMethod;
        isDeleted: boolean;
    }>;
    findAll(userId?: string, startDate?: Date, endDate?: Date): Promise<({
        user: {
            id: string;
            name: string;
            email: string;
        };
        items: ({
            product: {
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
            };
        } & {
            id: string;
            price: number;
            createdAt: Date;
            updatedAt: Date;
            saleId: string;
            productId: string;
            quantity: number;
        })[];
    } & {
        id: string;
        status: import(".prisma/client").$Enums.SaleStatus;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        total: number;
        paymentMethod: import(".prisma/client").$Enums.PaymentMethod;
        isDeleted: boolean;
    })[]>;
    findOne(id: string): Promise<{
        user: {
            id: string;
            name: string;
            email: string;
        };
        items: ({
            product: {
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
            };
        } & {
            id: string;
            price: number;
            createdAt: Date;
            updatedAt: Date;
            saleId: string;
            productId: string;
            quantity: number;
        })[];
    } & {
        id: string;
        status: import(".prisma/client").$Enums.SaleStatus;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        total: number;
        paymentMethod: import(".prisma/client").$Enums.PaymentMethod;
        isDeleted: boolean;
    }>;
    update(id: string, updateSaleDto: UpdateSaleDto): Promise<{
        user: {
            id: string;
            name: string;
            email: string;
        };
        items: ({
            product: {
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
            };
        } & {
            id: string;
            price: number;
            createdAt: Date;
            updatedAt: Date;
            saleId: string;
            productId: string;
            quantity: number;
        })[];
    } & {
        id: string;
        status: import(".prisma/client").$Enums.SaleStatus;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        total: number;
        paymentMethod: import(".prisma/client").$Enums.PaymentMethod;
        isDeleted: boolean;
    }>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
