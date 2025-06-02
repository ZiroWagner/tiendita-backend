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
exports.StorageService = void 0;
const common_1 = require("@nestjs/common");
const supabase_service_1 = require("./supabase.service");
const config_1 = require("@nestjs/config");
const image_processor_service_1 = require("./image-processor.service");
let StorageService = class StorageService {
    constructor(supabaseService, configService, imageProcessor) {
        this.supabaseService = supabaseService;
        this.configService = configService;
        this.imageProcessor = imageProcessor;
        this.AVATARS_BUCKET = 'avatars';
        this.PRODUCTS_BUCKET = 'products';
    }
    async onModuleInit() {
        await this.ensureBucketExists(this.AVATARS_BUCKET);
        await this.ensureBucketExists(this.PRODUCTS_BUCKET);
    }
    async ensureBucketExists(bucketName) {
        try {
            const { data, error } = await this.supabaseService
                .getClient()
                .storage
                .getBucket(bucketName);
            if (error && error.message.includes('not found')) {
                console.log(`Bucket ${bucketName} no encontrado, creándolo...`);
                const { error: createError } = await this.supabaseService
                    .getClient()
                    .storage
                    .createBucket(bucketName, {
                    public: true,
                    fileSizeLimit: 5 * 1024 * 1024,
                });
                if (createError) {
                    console.error(`Error al crear bucket ${bucketName}: ${createError.message}`);
                }
                else {
                    console.log(`Bucket ${bucketName} creado exitosamente`);
                }
            }
            else if (error) {
                console.error(`Error al verificar bucket ${bucketName}: ${error.message}`);
            }
            else {
                console.log(`Bucket ${bucketName} ya existe`);
            }
        }
        catch (error) {
            console.error(`Error al verificar/crear bucket ${bucketName}: ${error.message}`);
        }
    }
    async uploadFile(file, path, fileName, userId, productId) {
        if (!file) {
            throw new common_1.BadRequestException('No se proporcionó ningún archivo');
        }
        try {
            let bucketName;
            let filePath;
            if (path === 'avatars' && userId) {
                bucketName = this.AVATARS_BUCKET;
                filePath = `${userId}/avatar.webp`;
            }
            else if (path === 'products' && productId) {
                bucketName = this.PRODUCTS_BUCKET;
                filePath = `${productId}/image.webp`;
            }
            else {
                throw new common_1.BadRequestException('Tipo de archivo no soportado o falta ID de usuario/producto');
            }
            console.log(`Procesando imagen antes de subir a bucket: ${bucketName}, ruta: ${filePath}`);
            let imageBufferToUpload;
            let contentType = 'image/webp';
            try {
                const processedImageBuffer = await this.imageProcessor.processImage(file.buffer);
                if (processedImageBuffer && processedImageBuffer.length > 0 && processedImageBuffer.length < file.buffer.length) {
                    console.log(`Imagen procesada exitosamente. Tamaño original: ${file.buffer.length} bytes, tamaño procesado: ${processedImageBuffer.length} bytes`);
                    imageBufferToUpload = processedImageBuffer;
                }
                else {
                    console.warn(`El procesamiento no redujo el tamaño de la imagen o falló. Usando imagen original.`);
                    imageBufferToUpload = file.buffer;
                    contentType = file.mimetype;
                }
            }
            catch (processingError) {
                console.error(`Error al procesar la imagen: ${processingError.message}. Usando imagen original.`);
                imageBufferToUpload = file.buffer;
                contentType = file.mimetype;
            }
            console.log(`Subiendo archivo a bucket: ${bucketName}, ruta: ${filePath}, tipo: ${contentType}`);
            const { data, error } = await this.supabaseService
                .getClient()
                .storage.from(bucketName)
                .upload(filePath, imageBufferToUpload, {
                contentType: contentType,
                upsert: true,
            });
            if (error) {
                throw new common_1.BadRequestException(`Error al subir el archivo: ${error.message}`);
            }
            const { data: urlData } = this.supabaseService
                .getClient()
                .storage.from(bucketName)
                .getPublicUrl(data.path);
            return urlData.publicUrl;
        }
        catch (error) {
            throw new common_1.BadRequestException(`Error al subir el archivo: ${error.message}`);
        }
    }
    extractStorageInfoFromUrl(url) {
        try {
            console.log(`Extrayendo información de URL: ${url}`);
            if (url.includes('/avatars/')) {
                const parts = url.split('/avatars/');
                if (parts.length > 1) {
                    const pathParts = parts[1].split('/');
                    if (pathParts.length >= 2) {
                        const userId = pathParts[0];
                        const filename = pathParts[pathParts.length - 1];
                        console.log(`Avatar detectado - userId: ${userId}, filename: ${filename}`);
                        return {
                            bucket: this.AVATARS_BUCKET,
                            path: `${userId}/${filename}`
                        };
                    }
                }
            }
            else if (url.includes('/products/')) {
                const parts = url.split('/products/');
                if (parts.length > 1) {
                    const pathParts = parts[1].split('/');
                    if (pathParts.length >= 2) {
                        const productId = pathParts[0];
                        const filename = pathParts[pathParts.length - 1];
                        console.log(`Producto detectado - productId: ${productId}, filename: ${filename}`);
                        return {
                            bucket: this.PRODUCTS_BUCKET,
                            path: `${productId}/${filename}`
                        };
                    }
                }
            }
            console.log('No se pudo extraer información de la URL');
            return null;
        }
        catch (error) {
            console.error(`Error al extraer información de almacenamiento: ${error.message}`);
            return null;
        }
    }
    async deleteFile(fileUrl) {
        if (!fileUrl) {
            console.log('No se proporcionó URL para eliminar');
            return false;
        }
        console.log(`Intentando eliminar archivo con URL: ${fileUrl}`);
        try {
            const storageInfo = this.extractStorageInfoFromUrl(fileUrl);
            if (!storageInfo) {
                console.error('No se pudo extraer información de almacenamiento de la URL');
                return false;
            }
            console.log(`Información extraída: bucket=${storageInfo.bucket}, path=${storageInfo.path}`);
            const { error } = await this.supabaseService
                .getClient()
                .storage.from(storageInfo.bucket)
                .remove([storageInfo.path]);
            if (error) {
                console.error(`Error al eliminar el archivo: ${error.message}`);
                return false;
            }
            console.log(`Archivo eliminado exitosamente: ${storageInfo.path} del bucket ${storageInfo.bucket}`);
            return true;
        }
        catch (error) {
            throw new common_1.BadRequestException(`Error al eliminar el archivo: ${error.message}`);
        }
    }
};
exports.StorageService = StorageService;
exports.StorageService = StorageService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [supabase_service_1.SupabaseService,
        config_1.ConfigService,
        image_processor_service_1.ImageProcessorService])
], StorageService);
//# sourceMappingURL=storage.service.js.map