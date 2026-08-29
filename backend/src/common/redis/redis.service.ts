import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisService implements OnModuleDestroy {
  private readonly logger = new Logger(RedisService.name);
  private client: Redis | null = null;
  private readonly memoryCache = new Map<string, { value: string; expiresAt: number }>();

  constructor() {
    const redisHost = process.env.REDIS_HOST || 'localhost';
    const redisPort = parseInt(process.env.REDIS_PORT || '6379', 10);
    const redisPassword = process.env.REDIS_PASSWORD || undefined;

    try {
      this.client = new Redis({
        host: redisHost,
        port: redisPort,
        password: redisPassword,
        maxRetriesPerRequest: 1,
        enableOfflineQueue: false,
        retryStrategy: () => null, // fallback gracefully to in-memory cache
      });

      this.client.on('connect', () => {
        this.logger.log(`Redis cluster connected at ${redisHost}:${redisPort}`);
      });

      this.client.on('error', (err) => {
        this.logger.warn(`Redis not available (${err.message}). Using high-performance In-Memory Cache fallback.`);
        this.client = null;
      });
    } catch {
      this.logger.warn('Initializing standalone In-Memory caching engine.');
      this.client = null;
    }
  }

  async get<T>(key: string): Promise<T | null> {
    try {
      if (this.client) {
        const data = await this.client.get(key);
        return data ? JSON.parse(data) : null;
      }
    } catch {
      // fallback
    }

    // In-memory fallback
    const cached = this.memoryCache.get(key);
    if (!cached) return null;
    if (Date.now() > cached.expiresAt) {
      this.memoryCache.delete(key);
      return null;
    }
    return JSON.parse(cached.value);
  }

  async set(key: string, value: any, ttlSeconds: number = 60): Promise<void> {
    const serialized = JSON.stringify(value);
    try {
      if (this.client) {
        await this.client.set(key, serialized, 'EX', ttlSeconds);
        return;
      }
    } catch {
      // fallback
    }

    // In-memory fallback
    this.memoryCache.set(key, {
      value: serialized,
      expiresAt: Date.now() + ttlSeconds * 1000,
    });
  }

  async del(key: string): Promise<void> {
    try {
      if (this.client) {
        await this.client.del(key);
      }
    } catch {
      // fallback
    }
    this.memoryCache.delete(key);
  }

  async onModuleDestroy() {
    if (this.client) {
      await this.client.quit();
    }
  }
}
