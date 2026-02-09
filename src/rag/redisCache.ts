import { createClient, RedisClientType } from 'redis';
import { EmbeddingCache } from '../types-rag.js';
import { logger } from '../utils/logger.js';

export class RedisCache {
  private enabled: boolean;
  private redisUrl: string;
  private client?: RedisClientType;
  private connected: boolean;

  constructor(redisUrl: string, enabled: boolean) {
    this.enabled = enabled;
    this.redisUrl = redisUrl;
    this.connected = false;

    if (!enabled) {
      logger.info('Redis cache disabled');
      return;
    }

    logger.info('Redis client created', { url: redisUrl });
  }

  async connect(): Promise<void> {
    if (!this.enabled) {
      return;
    }

    try {
      if (!this.client) {
        this.client = createClient({ url: this.redisUrl });
        this.client.on('error', (error: unknown) => {
          logger.error('Redis client error', {
            error: error instanceof Error ? error.message : String(error),
          });
        });
      }

      await this.client.connect();
      this.connected = true;
      logger.info('Redis cache connected successfully');
    } catch (error) {
      logger.error('Failed to connect to Redis', {
        error: error instanceof Error ? error.message : String(error),
      });
      this.enabled = false;
    }
  }

  async disconnect(): Promise<void> {
    if (!this.enabled || !this.client || !this.connected) {
      return;
    }

    try {
      await this.client.disconnect();
      this.connected = false;
      logger.info('Redis cache disconnected');
    } catch (error) {
      logger.error('Failed to disconnect Redis cache', {
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  async getCache(key: string): Promise<EmbeddingCache | null> {
    if (!this.enabled || !this.client || !this.connected) {
      return null;
    }

    try {
      const data = await this.client.get(key);
      if (!data) {
        return null;
      }

      return JSON.parse(data) as EmbeddingCache;
    } catch (error) {
      logger.error(`Failed to get cache for key: ${key}`, {
        error: error instanceof Error ? error.message : String(error),
      });
      return null;
    }
  }

  async saveCache(key: string, cache: EmbeddingCache): Promise<void> {
    if (!this.enabled || !this.client || !this.connected) {
      return;
    }

    try {
      await this.client.set(key, JSON.stringify(cache));
      logger.debug(`Saved cache for key: ${key}`);
    } catch (error) {
      logger.error(`Failed to save cache for key: ${key}`, {
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  async deleteCache(key: string): Promise<void> {
    if (!this.enabled || !this.client || !this.connected) {
      return;
    }

    try {
      await this.client.del(key);
      logger.debug(`Deleted cache for key: ${key}`);
    } catch (error) {
      logger.error(`Failed to delete cache for key: ${key}`, {
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  async batchSave(entries: Map<string, EmbeddingCache>): Promise<void> {
    if (!this.enabled || !this.client || !this.connected || entries.size === 0) {
      return;
    }

    try {
      const multi = this.client.multi();
      for (const [key, cache] of entries.entries()) {
        multi.set(key, JSON.stringify(cache));
      }
      await multi.exec();
      logger.info(`Batch saved ${entries.size} cache entries`);
    } catch (error) {
      logger.error('Failed to batch save cache entries', {
        error: error instanceof Error ? error.message : String(error),
        count: entries.size,
      });
    }
  }

  isEnabled(): boolean {
    return this.enabled;
  }
}
