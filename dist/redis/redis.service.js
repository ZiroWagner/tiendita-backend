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
var RedisService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.RedisService = void 0;
const common_1 = require("@nestjs/common");
const redis_1 = require("@upstash/redis");
const config_1 = require("@nestjs/config");
let RedisService = RedisService_1 = class RedisService {
    constructor(configService) {
        this.configService = configService;
        this.logger = new common_1.Logger(RedisService_1.name);
    }
    onModuleInit() {
        try {
            this.redisClient = new redis_1.Redis({
                url: this.configService.get('KV_REST_API_URL'),
                token: this.configService.get('KV_REST_API_TOKEN')
            });
            this.logger.log('Redis client initialized successfully');
        }
        catch (error) {
            this.logger.error(`Failed to initialize Redis client: ${error.message}`);
        }
    }
    async get(key) {
        try {
            return await this.redisClient.get(key);
        }
        catch (error) {
            this.logger.error(`Error getting key ${key} from Redis: ${error.message}`);
            return null;
        }
    }
    async set(key, value, ttl) {
        try {
            if (ttl) {
                return await this.redisClient.set(key, value, { ex: ttl });
            }
            return await this.redisClient.set(key, value);
        }
        catch (error) {
            this.logger.error(`Error setting key ${key} in Redis: ${error.message}`);
            return null;
        }
    }
    async del(key) {
        try {
            return await this.redisClient.del(key);
        }
        catch (error) {
            this.logger.error(`Error deleting key ${key} from Redis: ${error.message}`);
            return 0;
        }
    }
    async flushAll() {
        try {
            return await this.redisClient.flushall();
        }
        catch (error) {
            this.logger.error(`Error flushing Redis: ${error.message}`);
            return 'ERROR';
        }
    }
};
exports.RedisService = RedisService;
exports.RedisService = RedisService = RedisService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], RedisService);
//# sourceMappingURL=redis.service.js.map