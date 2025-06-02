"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImageProcessorService = void 0;
const common_1 = require("@nestjs/common");
const sharp_1 = __importDefault(require("sharp"));
let ImageProcessorService = class ImageProcessorService {
    async compressAndConvertToWebP(buffer, quality = 80) {
        try {
            if (!buffer || buffer.length === 0) {
                throw new Error('Buffer de imagen vacío o inválido');
            }
            if (typeof sharp_1.default !== 'function') {
                throw new Error('Sharp no está disponible como una función');
            }
            const sharpInstance = (0, sharp_1.default)(buffer);
            if (!sharpInstance) {
                throw new Error('No se pudo crear instancia de sharp');
            }
            return await sharpInstance
                .webp({ quality, lossless: false })
                .toBuffer();
        }
        catch (error) {
            console.error(`Error al procesar la imagen: ${error.message}`);
            return buffer;
        }
    }
    async resizeIfNeeded(buffer, maxWidth = 1200, maxHeight = 1200) {
        try {
            if (!buffer || buffer.length === 0) {
                throw new Error('Buffer de imagen vacío o inválido');
            }
            if (typeof sharp_1.default !== 'function') {
                throw new Error('Sharp no está disponible como una función');
            }
            const sharpInstance = (0, sharp_1.default)(buffer);
            if (!sharpInstance) {
                throw new Error('No se pudo crear instancia de sharp');
            }
            const metadata = await sharpInstance.metadata();
            if (!metadata.width ||
                !metadata.height ||
                (metadata.width <= maxWidth && metadata.height <= maxHeight)) {
                return buffer;
            }
            return await sharpInstance
                .resize({
                width: metadata.width > maxWidth ? maxWidth : undefined,
                height: metadata.height > maxHeight ? maxHeight : undefined,
                fit: 'inside',
                withoutEnlargement: true,
            })
                .toBuffer();
        }
        catch (error) {
            console.error(`Error al redimensionar la imagen: ${error.message}`);
            return buffer;
        }
    }
    async processImage(buffer, quality = 80) {
        try {
            if (!buffer || buffer.length === 0) {
                console.warn('Buffer de imagen vacío o inválido, devolviendo buffer original');
                return buffer;
            }
            let processedBuffer = buffer;
            try {
                const resizedBuffer = await this.resizeIfNeeded(buffer);
                processedBuffer = resizedBuffer;
            }
            catch (resizeError) {
                console.error(`Error al redimensionar: ${resizeError.message}. Continuando con el buffer original.`);
            }
            try {
                return await this.compressAndConvertToWebP(processedBuffer, quality);
            }
            catch (webpError) {
                console.error(`Error al convertir a WebP: ${webpError.message}. Devolviendo buffer redimensionado.`);
                return processedBuffer;
            }
        }
        catch (error) {
            console.error(`Error general al procesar la imagen: ${error.message}`);
            return buffer;
        }
    }
};
exports.ImageProcessorService = ImageProcessorService;
exports.ImageProcessorService = ImageProcessorService = __decorate([
    (0, common_1.Injectable)()
], ImageProcessorService);
//# sourceMappingURL=image-processor.service.js.map