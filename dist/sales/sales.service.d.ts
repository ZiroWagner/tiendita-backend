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
            name: string;
            email: string;
            id: string;
        };
        items: ({
            product: {
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
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            price: number;
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
        paymentMethod: import(".prisma/client").$Enums.PaymentMethod;
        total: number;
        isDeleted: boolean;
    }>;
    findAll(userId?: string, startDate?: Date, endDate?: Date): Promise<({
        user: {
            name: string;
            email: string;
            id: string;
        };
        items: ({
            product: {
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
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            price: number;
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
        paymentMethod: import(".prisma/client").$Enums.PaymentMethod;
        total: number;
        isDeleted: boolean;
    })[]>;
    findOne(id: string): Promise<{
        user: {
            name: string;
            email: string;
            id: string;
        };
        items: ({
            product: {
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
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            price: number;
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
        paymentMethod: import(".prisma/client").$Enums.PaymentMethod;
        total: number;
        isDeleted: boolean;
    }>;
    update(id: string, updateSaleDto: UpdateSaleDto): Promise<{
        user: {
            name: string;
            email: string;
            id: string;
        };
        items: ({
            product: {
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
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            price: number;
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
        paymentMethod: import(".prisma/client").$Enums.PaymentMethod;
        total: number;
        isDeleted: boolean;
    }>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
