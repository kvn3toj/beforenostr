import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { createClient, RedisClientType } from 'redis';
import { MetricsService } from '../common/metrics/metrics.service';

@Injectable()
export class CacheService implements OnModuleInit, OnModuleDestroy {
  private client: RedisClientType;
  private readonly defaultTTL = 7 * 24 * 60 * 60; // 7 días en segundos
  private cacheStats = { hits: 0, misses: 0 };
  private readonly logger = new Logger(CacheService.name);

  constructor(
    private readonly metricsService: MetricsService
  ) {
    this.logger.log('Initializing Redis client...', 'CacheService');

    this.client = createClient({
      socket: {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT || '6379', 10),
      },
      password: process.env.REDIS_PASSWORD || undefined,
    });

    // Configurar event listeners para Redis
    this.client.on('error', (err) => {
      this.logger.error('Redis Client Error', err.stack, 'CacheService', {
        error: err.message,
        host: process.env.REDIS_HOST || 'localhost',
        port: process.env.REDIS_PORT || '6379'
      });
    });

    this.client.on('connect', () => {
      this.logger.log('Redis Client Connected', 'CacheService');
    });

    this.client.on('ready', () => {
      this.logger.log('Redis Client Ready', 'CacheService');
    });

    this.client.on('end', () => {
      this.logger.log('Redis Client Connection Ended', 'CacheService');
    });
  }

  async onModuleInit() {
    try {
      this.logger.log('Connecting to Redis...', 'CacheService');
      await this.client.connect();
      this.logger.log('Redis connection established', 'CacheService');
    } catch (error) {
      this.logger.error('Failed to connect to Redis', error, 'CacheService');
      // No lanzar error para permitir que la aplicación funcione sin caché
    }
  }

  async onModuleDestroy() {
    try {
      this.logger.log('Disconnecting from Redis...', 'CacheService');
      await this.client.disconnect();
      this.logger.log('Redis disconnected', 'CacheService');
    } catch (error) {
      this.logger.error('Error disconnecting from Redis', error, 'CacheService');
    }
  }

  /**
   * Obtiene la duración de un video desde el caché
   * @param videoId ID del video de YouTube
   * @returns Duración en segundos o null si no está en caché
   */
  async getDuration(videoId: string): Promise<number | null> {
    try {
      if (!this.client.isReady) {
        this.logger.log('Redis client not ready, skipping cache', 'CacheService');
        return null;
      }

      const key = this.generateCacheKey(videoId);
      this.logger.log(`Checking cache for key: ${key}`, 'CacheService');

      const cachedValue = await this.client.get(key);

      if (cachedValue !== null && typeof cachedValue === 'string') {
        const duration = parseInt(cachedValue, 10);
        this.cacheStats.hits++;

        // Actualizar métricas de Prometheus
        this.metricsService.incrementCacheOperations('get', 'hit');
        this.metricsService.setCacheHitRatio(this.cacheStats.hits / (this.cacheStats.hits + this.cacheStats.misses));

        this.logger.log(`Cache HIT for ${videoId}: ${duration}s`, 'CacheService');
        return duration;
      }

      this.cacheStats.misses++;

      // Actualizar métricas de Prometheus
      this.metricsService.incrementCacheOperations('get', 'miss');
      this.metricsService.setCacheHitRatio(this.cacheStats.hits / (this.cacheStats.hits + this.cacheStats.misses));

      this.logger.log(`Cache MISS for ${videoId}`, 'CacheService');
      return null;
    } catch (error) {
      this.metricsService.incrementCacheOperations('get', 'error');
      this.logger.error('Error accessing cache', error, 'CacheService');
      return null;
    }
  }

  /**
   * Almacena la duración de un video en el caché
   * @param videoId ID del video de YouTube
   * @param duration Duración en segundos
   * @param ttl Tiempo de vida en segundos (opcional, por defecto 7 días)
   */
  async setDuration(videoId: string, duration: number, ttl?: number): Promise<void> {
    try {
      if (!this.client.isReady) {
        this.logger.log('Redis client not ready, skipping cache', 'CacheService');
        return;
      }

      const key = this.generateCacheKey(videoId);
      const timeToLive = ttl || this.defaultTTL;

      this.logger.log(`Setting cache for ${videoId}: ${duration}s (TTL: ${timeToLive}s)`, 'CacheService');

      await this.client.setEx(key, timeToLive, duration.toString());

      // Actualizar métricas de Prometheus
      this.metricsService.incrementCacheOperations('set', 'success');

      this.logger.log(`Cache SET for ${videoId}: ${duration}s`, 'CacheService');
    } catch (error) {
      this.metricsService.incrementCacheOperations('set', 'error');
      this.logger.error('Error setting cache', error, 'CacheService');
      // No lanzar error para permitir que la aplicación funcione sin caché
    }
  }

  /**
   * Elimina una entrada del caché
   * @param videoId ID del video de YouTube
   */
  async deleteDuration(videoId: string): Promise<void> {
    try {
      if (!this.client.isReady) {
        this.logger.log('Redis client not ready, skipping cache', 'CacheService');
        return;
      }

      const key = this.generateCacheKey(videoId);
      this.logger.log(`Deleting cache for key: ${key}`, 'CacheService');

      await this.client.del(key);

      this.logger.log(`Cache DELETED for ${videoId}`, 'CacheService');
    } catch (error) {
      this.logger.error('Error deleting from cache', error, 'CacheService');
    }
  }

  /**
   * Verifica si Redis está disponible y funcionando
   */
  async isHealthy(): Promise<boolean> {
    try {
      if (!this.client.isReady) {
        return false;
      }

      await this.client.ping();
      return true;
    } catch (error) {
      this.logger.error('Redis health check failed', error, 'CacheService');
      return false;
    }
  }

  /**
   * Obtiene estadísticas del caché
   */
  async getCacheStats(): Promise<{ totalKeys: number; memoryUsage: string }> {
    try {
      if (!this.client.isReady) {
        return { totalKeys: 0, memoryUsage: 'N/A - Redis not connected' };
      }

      const keys = await this.client.keys(this.generateCacheKey('*'));
      const info = await this.client.info('memory');

      // Extraer uso de memoria de la respuesta de INFO
      const memoryMatch = info.match(/used_memory_human:([^\r\n]+)/);
      const memoryUsage = memoryMatch ? memoryMatch[1] : 'Unknown';

      return {
        totalKeys: keys.length,
        memoryUsage: memoryUsage.trim()
      };
    } catch (error) {
      this.logger.error('Error getting cache stats', error, 'CacheService');
      return { totalKeys: 0, memoryUsage: 'Error retrieving stats' };
    }
  }

  /**
   * Genera la clave de caché para un video ID
   * @param videoId ID del video de YouTube
   * @returns Clave de caché formateada
   */
  private generateCacheKey(videoId: string): string {
    return `gamifier:video:duration:${videoId}`;
  }

  // ===== MÉTODOS DE CACHÉ PARA METADATOS (Fase 4.2) =====

  /**
   * Almacena metadatos de video en caché
   * @param videoId ID del video
   * @param metadata Metadatos del video
   * @param ttl TTL en segundos (opcional, usa defaultTTL si no se especifica)
   */
  async setMetadata(videoId: string, metadata: any, ttl?: number): Promise<void> {
    try {
      const key = this.generateMetadataCacheKey(videoId);
      const value = JSON.stringify(metadata);
      const cacheTTL = ttl || this.defaultTTL;

      await this.client.setEx(key, cacheTTL, value);

      this.logger.log(`Metadata cached for video ${videoId}`, 'CacheService', {
        key,
        ttl: cacheTTL,
        metadataSize: value.length
      });
    } catch (error) {
      this.logger.error('Error setting metadata cache:', error, 'CacheService', { videoId });
    }
  }

  /**
   * Obtiene metadatos de video desde caché
   * @param videoId ID del video
   * @returns Metadatos del video o null si no existe
   */
  async getMetadata(videoId: string): Promise<any | null> {
    try {
      const key = this.generateMetadataCacheKey(videoId);
      const value = await this.client.get(key);

      if (value && typeof value === 'string') {
        this.cacheStats.hits++;
        this.metricsService.incrementCacheOperations('get', 'hit');

        const metadata = JSON.parse(value);
        this.logger.log(`Metadata cache hit for video ${videoId}`, 'CacheService', { key });
        return metadata;
      } else {
        this.cacheStats.misses++;
        this.metricsService.incrementCacheOperations('get', 'miss');

        this.logger.log(`Metadata cache miss for video ${videoId}`, 'CacheService', { key });
        return null;
      }
    } catch (error) {
      this.logger.error('Error getting metadata cache:', error, 'CacheService', { videoId });
      this.cacheStats.misses++;
      this.metricsService.incrementCacheOperations('get', 'error');
      return null;
    }
  }

  /**
   * Elimina metadatos de video del caché
   * @param videoId ID del video
   */
  async deleteMetadata(videoId: string): Promise<void> {
    try {
      const key = this.generateMetadataCacheKey(videoId);
      await this.client.del(key);

      this.logger.log(`Metadata cache deleted for video ${videoId}`, 'CacheService', { key });
    } catch (error) {
      this.logger.error('Error deleting metadata cache:', error, 'CacheService', { videoId });
    }
  }

  /**
   * Verifica si existen metadatos en caché para un video
   * @param videoId ID del video
   * @returns true si existen metadatos en caché
   */
  async hasMetadata(videoId: string): Promise<boolean> {
    try {
      const key = this.generateMetadataCacheKey(videoId);
      const exists = await this.client.exists(key);
      return exists === 1;
    } catch (error) {
      this.logger.error('Error checking metadata cache existence:', error, 'CacheService', { videoId });
      return false;
    }
  }

  /**
   * Genera la clave de caché para metadatos de video
   * @param videoId ID del video
   * @returns Clave de caché formateada para metadatos
   */
  private generateMetadataCacheKey(videoId: string): string {
    return `gamifier:video:metadata:${videoId}`;
  }

  /**
   * Obtiene estadísticas del caché incluyendo metadatos
   */
  async getCacheStatsWithMetadata(): Promise<any> {
    try {
      const basicStats = await this.getCacheStats();

      // Contar claves de metadatos
      const metadataKeys = await this.client.keys('gamifier:video:metadata:*');
      const durationKeys = await this.client.keys('gamifier:video:duration:*');

      return {
        ...basicStats,
        metadataKeys: metadataKeys.length,
        durationKeys: durationKeys.length,
        totalVideoKeys: metadataKeys.length + durationKeys.length
      };
    } catch (error) {
      this.logger.error('Error getting cache stats with metadata:', error, 'CacheService');
      return this.getCacheStats();
    }
  }
}
