import { OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
export declare class RedisService implements OnModuleInit {
    private configService;
    private redisClient;
    private readonly logger;
    constructor(configService: ConfigService);
    onModuleInit(): void;
    get<T>(key: string): Promise<T | null>;
    set(key: string, value: any, ttl?: number): Promise<string | null>;
    del(key: string): Promise<number>;
    flushAll(): Promise<string>;
}
