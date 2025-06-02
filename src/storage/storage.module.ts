import { Module } from '@nestjs/common';
import { StorageService } from './storage.service';
import { StorageController } from './storage.controller';
import { SupabaseService } from './supabase.service';
import { ConfigModule } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express';
import { ImageProcessorService } from './image-processor.service';

@Module({
  imports: [
    ConfigModule,
    MulterModule.register({
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB límite de tamaño
      },
    }),
  ],
  controllers: [StorageController],
  providers: [StorageService, SupabaseService, ImageProcessorService],
  exports: [StorageService],
})
export class StorageModule {}
