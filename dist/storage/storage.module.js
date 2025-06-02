"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StorageModule = void 0;
const common_1 = require("@nestjs/common");
const storage_service_1 = require("./storage.service");
const storage_controller_1 = require("./storage.controller");
const supabase_service_1 = require("./supabase.service");
const config_1 = require("@nestjs/config");
const platform_express_1 = require("@nestjs/platform-express");
const image_processor_service_1 = require("./image-processor.service");
let StorageModule = class StorageModule {
};
exports.StorageModule = StorageModule;
exports.StorageModule = StorageModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule,
            platform_express_1.MulterModule.register({
                limits: {
                    fileSize: 5 * 1024 * 1024,
                },
            }),
        ],
        controllers: [storage_controller_1.StorageController],
        providers: [storage_service_1.StorageService, supabase_service_1.SupabaseService, image_processor_service_1.ImageProcessorService],
        exports: [storage_service_1.StorageService],
    })
], StorageModule);
//# sourceMappingURL=storage.module.js.map