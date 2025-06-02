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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductsController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const products_service_1 = require("./products.service");
const create_product_dto_1 = require("./dto/create-product.dto");
const update_product_dto_1 = require("./dto/update-product.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const client_1 = require("@prisma/client");
const swagger_1 = require("@nestjs/swagger");
const platform_express_1 = require("@nestjs/platform-express");
const storage_service_1 = require("../storage/storage.service");
let ProductsController = class ProductsController {
    constructor(productsService, storageService) {
        this.productsService = productsService;
        this.storageService = storageService;
    }
    async create(createProductDto, file) {
        const product = await this.productsService.create(createProductDto);
        if (file) {
            const imageUrl = await this.storageService.uploadFile(file, 'products', null, null, product.id);
            return this.productsService.update(product.id, { image: imageUrl });
        }
        return product;
    }
    findAll(categoryId) {
        return this.productsService.findAll(categoryId);
    }
    findOne(id) {
        return this.productsService.findOne(id);
    }
    async update(id, updateProductDto, file) {
        if (!file) {
            return this.productsService.update(id, updateProductDto);
        }
        const imageUrl = await this.storageService.uploadFile(file, 'products', null, null, id);
        return this.productsService.update(id, {
            ...updateProductDto,
            image: imageUrl
        });
    }
    updateStock(id, quantity) {
        return this.productsService.updateStock(id, Number(quantity));
    }
    remove(id) {
        return this.productsService.remove(id);
    }
};
exports.ProductsController = ProductsController;
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Create a new product with image' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Product created successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Category not found' }),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: {
                name: { type: 'string' },
                description: { type: 'string' },
                price: { type: 'number' },
                stock: { type: 'number' },
                unit: { type: 'string' },
                categoryId: { type: 'string' },
                file: {
                    type: 'string',
                    format: 'binary',
                },
            },
            required: ['name', 'price', 'stock', 'categoryId'],
        },
    }),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN),
    (0, common_1.Post)(),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    openapi.ApiResponse({ status: 201, type: Object }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_product_dto_1.CreateProductDto, Object]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "create", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get all products' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Return all products' }),
    (0, swagger_1.ApiQuery)({ name: 'categoryId', required: false, description: 'Filter products by category ID' }),
    (0, common_1.Get)(),
    openapi.ApiResponse({ status: 200, type: [Object] }),
    __param(0, (0, common_1.Query)('categoryId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ProductsController.prototype, "findAll", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get product by id' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Return product by id' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Product not found' }),
    (0, common_1.Get)(':id'),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ProductsController.prototype, "findOne", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Update product by id' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Product updated successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Product or category not found' }),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: {
                name: { type: 'string' },
                description: { type: 'string' },
                price: { type: 'number' },
                stock: { type: 'number' },
                unit: { type: 'string' },
                categoryId: { type: 'string' },
                file: {
                    type: 'string',
                    format: 'binary',
                },
            },
        },
    }),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN),
    (0, common_1.Patch)(':id'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_product_dto_1.UpdateProductDto, Object]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "update", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Update product stock by id' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Product stock updated successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Product not found' }),
    (0, swagger_1.ApiResponse)({ status: 409, description: 'Cannot reduce stock below 0' }),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN, client_1.Role.EMPLOYEE),
    (0, common_1.Patch)(':id/stock/:quantity'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('quantity')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number]),
    __metadata("design:returntype", void 0)
], ProductsController.prototype, "updateStock", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Soft Delete product by id' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Product deleted successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Product not found' }),
    (0, swagger_1.ApiResponse)({ status: 409, description: 'Product has associated sales' }),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN),
    (0, common_1.Delete)(':id'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ProductsController.prototype, "remove", null);
exports.ProductsController = ProductsController = __decorate([
    (0, swagger_1.ApiTags)('products'),
    (0, common_1.Controller)('products'),
    __metadata("design:paramtypes", [products_service_1.ProductsService,
        storage_service_1.StorageService])
], ProductsController);
//# sourceMappingURL=products.controller.js.map