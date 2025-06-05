import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { Redis } from '@upstash/redis';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RedisService implements OnModuleInit {
  private redisClient: Redis;
  private readonly logger = new Logger(RedisService.name);

  constructor(private configService: ConfigService) {}

  onModuleInit() {
    try {
      // Inicializar el cliente de Redis con las credenciales de Upstash
      this.redisClient = new Redis({
        url: this.configService.get<string>('KV_REST_API_URL'),
        token: this.configService.get<string>('KV_REST_API_TOKEN')
      });
      
      this.logger.log('Redis client initialized successfully');
    } catch (error) {
      this.logger.error(`Failed to initialize Redis client: ${error.message}`);
    }
  }

  async get<T>(key: string): Promise<T | null> {
    try {
      return await this.redisClient.get(key) as T;
    } catch (error) {
      this.logger.error(`Error getting key ${key} from Redis: ${error.message}`);
      return null;
    }
  }

  async set(key: string, value: any, ttl?: number): Promise<string | null> {
    try {
      if (ttl) {
        return await this.redisClient.set(key, value, { ex: ttl });
      }
      return await this.redisClient.set(key, value);
    } catch (error) {
      this.logger.error(`Error setting key ${key} in Redis: ${error.message}`);
      return null;
    }
  }

  async del(key: string): Promise<number> {
    try {
      return await this.redisClient.del(key);
    } catch (error) {
      this.logger.error(`Error deleting key ${key} from Redis: ${error.message}`);
      return 0;
    }
  }

  async flushAll(): Promise<string> {
    try {
      return await this.redisClient.flushall();
    } catch (error) {
      this.logger.error(`Error flushing Redis: ${error.message}`);
      return 'ERROR';
    }
  }
}