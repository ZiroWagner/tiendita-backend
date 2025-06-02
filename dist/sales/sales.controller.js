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
exports.SalesController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const sales_service_1 = require("./sales.service");
const create_sale_dto_1 = require("./dto/create-sale.dto");
const update_sale_dto_1 = require("./dto/update-sale.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const client_1 = require("@prisma/client");
const swagger_1 = require("@nestjs/swagger");
let SalesController = class SalesController {
    constructor(salesService) {
        this.salesService = salesService;
    }
    create(req, createSaleDto) {
        return this.salesService.create(req.user.id, createSaleDto);
    }
    findAll(userId, startDate, endDate) {
        return this.salesService.findAll(userId, startDate ? new Date(startDate) : undefined, endDate ? new Date(endDate) : undefined);
    }
    findMySales(req, startDate, endDate) {
        return this.salesService.findAll(req.user.id, startDate ? new Date(startDate) : undefined, endDate ? new Date(endDate) : undefined);
    }
    findOne(id) {
        return this.salesService.findOne(id);
    }
    update(id, updateSaleDto) {
        return this.salesService.update(id, updateSaleDto);
    }
    remove(id) {
        return this.salesService.remove(id);
    }
};
exports.SalesController = SalesController;
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Create a new sale' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Sale created successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'User or product not found' }),
    (0, swagger_1.ApiResponse)({ status: 409, description: 'Not enough stock for product' }),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Post)(),
    openapi.ApiResponse({ status: 201, type: Object }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_sale_dto_1.CreateSaleDto]),
    __metadata("design:returntype", void 0)
], SalesController.prototype, "create", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get all sales' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Return all sales' }),
    (0, swagger_1.ApiQuery)({ name: 'userId', required: false, description: 'Filter sales by user ID' }),
    (0, swagger_1.ApiQuery)({ name: 'startDate', required: false, description: 'Filter sales by start date (ISO format)' }),
    (0, swagger_1.ApiQuery)({ name: 'endDate', required: false, description: 'Filter sales by end date (ISO format)' }),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN),
    (0, common_1.Get)(),
    openapi.ApiResponse({ status: 200, type: [Object] }),
    __param(0, (0, common_1.Query)('userId')),
    __param(1, (0, common_1.Query)('startDate')),
    __param(2, (0, common_1.Query)('endDate')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", void 0)
], SalesController.prototype, "findAll", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get my sales' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Return user sales' }),
    (0, swagger_1.ApiQuery)({ name: 'startDate', required: false, description: 'Filter sales by start date (ISO format)' }),
    (0, swagger_1.ApiQuery)({ name: 'endDate', required: false, description: 'Filter sales by end date (ISO format)' }),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Get)('my-sales'),
    openapi.ApiResponse({ status: 200, type: [Object] }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('startDate')),
    __param(2, (0, common_1.Query)('endDate')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", void 0)
], SalesController.prototype, "findMySales", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get sale by id' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Return sale by id' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Sale not found' }),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Get)(':id'),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SalesController.prototype, "findOne", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Update sale by id' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Sale updated successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Sale not found' }),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN, client_1.Role.EMPLOYEE),
    (0, common_1.Patch)(':id'),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_sale_dto_1.UpdateSaleDto]),
    __metadata("design:returntype", void 0)
], SalesController.prototype, "update", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Soft Delete sale by id' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Sale deleted successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Sale not found' }),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN),
    (0, common_1.Delete)(':id'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SalesController.prototype, "remove", null);
exports.SalesController = SalesController = __decorate([
    (0, swagger_1.ApiTags)('sales'),
    (0, common_1.Controller)('sales'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [sales_service_1.SalesService])
], SalesController);
//# sourceMappingURL=sales.controller.js.map