import { OnModuleInit } from '@nestjs/common';
import { SupabaseService } from './supabase.service';
import { ConfigService } from '@nestjs/config';
import { ImageProcessorService } from './image-processor.service';
export declare class StorageService implements OnModuleInit {
    private readonly supabaseService;
    private readonly configService;
    private readonly imageProcessor;
    private readonly AVATARS_BUCKET;
    private readonly PRODUCTS_BUCKET;
    constructor(supabaseService: SupabaseService, configService: ConfigService, imageProcessor: ImageProcessorService);
    onModuleInit(): Promise<void>;
    private ensureBucketExists;
    uploadFile(file: any, path: string, fileName?: string, userId?: string, productId?: string): Promise<string>;
    private extractStorageInfoFromUrl;
    deleteFile(fileUrl: string): Promise<boolean>;
}
