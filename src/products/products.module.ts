import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { CategoriesModule } from '../categories/categories.module';
import { StorageModule } from '../storage/storage.module';
import { RedisService } from '../redis/redis.service';

@Module({
  imports: [CategoriesModule, StorageModule],
  controllers: [ProductsController],
  providers: [ProductsService, RedisService],
  exports: [ProductsService, RedisService],
})
export class ProductsModule {}
