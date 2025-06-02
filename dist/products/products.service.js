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
exports.ProductsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let ProductsService = class ProductsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createProductDto) {
        const { categoryId } = createProductDto;
        const category = await this.prisma.category.findUnique({
            where: { id: categoryId },
        });
        if (!category) {
            throw new common_1.NotFoundException(`Category with ID ${categoryId} not found`);
        }
        return this.prisma.product.create({
            data: createProductDto,
            include: {
                category: true,
            },
        });
    }
    async findAll(categoryId) {
        const where = categoryId ? { categoryId } : { status: 'active' };
        return this.prisma.product.findMany({
            where,
            include: {
                category: true,
            },
        });
    }
    async findOne(id) {
        const product = await this.prisma.product.findUnique({
            where: { id },
            include: {
                category: true,
            },
        });
        if (!product || product.status !== "active") {
            throw new common_1.NotFoundException(`Product with ID ${id} not found`);
        }
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
        return this.prisma.product.update({
            where: { id },
            data: updateProductDto,
            include: {
                category: true,
            },
        });
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
        return this.prisma.product.update({
            where: { id },
            data: {
                stock: newStock,
            },
        });
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
        return this.prisma.product.update({
            where: { id },
            data: { status: "inactive" },
        });
    }
};
exports.ProductsService = ProductsService;
exports.ProductsService = ProductsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ProductsService);
//# sourceMappingURL=products.service.js.map