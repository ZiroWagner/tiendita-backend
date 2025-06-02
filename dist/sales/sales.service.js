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
Object.defineProperty(exports, "__esModule", { value: true });
exports.SalesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const products_service_1 = require("../products/products.service");
const client_1 = require("@prisma/client");
let SalesService = class SalesService {
    constructor(prisma, productsService) {
        this.prisma = prisma;
        this.productsService = productsService;
    }
    async create(userId, createSaleDto) {
        const { items, paymentMethod } = createSaleDto;
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        });
        if (!user) {
            throw new common_1.NotFoundException(`User with ID ${userId} not found`);
        }
        const productIds = items.map((item) => item.productId);
        const products = await this.prisma.product.findMany({
            where: {
                id: {
                    in: productIds,
                },
            },
        });
        if (products.length !== productIds.length) {
            throw new common_1.NotFoundException('One or more products not found');
        }
        let total = 0;
        const saleItems = [];
        const stockUpdates = [];
        for (const item of items) {
            const product = products.find((p) => p.id === item.productId);
            if (!product) {
                throw new common_1.NotFoundException(`Product with ID ${item.productId} not found`);
            }
            if (product.stock < item.quantity) {
                throw new common_1.ConflictException(`Not enough stock for product ${product.name}. Available: ${product.stock}, Requested: ${item.quantity}`);
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
                quantity: -item.quantity,
            });
        }
        const sale = await this.prisma.$transaction(async (prisma) => {
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
    async findAll(userId, startDate, endDate) {
        const where = {};
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
    async findOne(id) {
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
            throw new common_1.NotFoundException(`Sale with ID ${id} not found`);
        }
        return sale;
    }
    async update(id, updateSaleDto) {
        const { status } = updateSaleDto;
        const sale = await this.prisma.sale.findUnique({
            where: { id },
            include: {
                items: true,
            },
        });
        if (!sale) {
            throw new common_1.NotFoundException(`Sale with ID ${id} not found`);
        }
        if (status === client_1.SaleStatus.CANCELLED && sale.status !== client_1.SaleStatus.CANCELLED) {
            await this.prisma.$transaction(async (prisma) => {
                await prisma.sale.update({
                    where: { id },
                    data: updateSaleDto,
                });
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
        }
        else {
            await this.prisma.sale.update({
                where: { id },
                data: updateSaleDto,
            });
        }
        return this.findOne(id);
    }
    async remove(id) {
        const sale = await this.prisma.sale.findUnique({
            where: { id },
            include: {
                items: true,
            },
        });
        if (!sale || sale.isDeleted) {
            throw new common_1.NotFoundException(`Sale with ID ${id} not found`);
        }
        if (sale.status !== client_1.SaleStatus.CANCELLED) {
            await this.prisma.$transaction(async (prisma) => {
                await prisma.sale.delete({
                    where: { id },
                });
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
        }
        else {
            await this.prisma.sale.update({
                where: { id },
                data: { isDeleted: true },
            });
        }
        return { message: 'Sale deleted successfully' };
    }
};
exports.SalesService = SalesService;
exports.SalesService = SalesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        products_service_1.ProductsService])
], SalesService);
//# sourceMappingURL=sales.service.js.map