import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { createClient, RedisClientType } from 'redis';

@Injectable()
export class CacheService implements OnModuleInit, OnModuleDestroy {
  private client: RedisClientType;
  private readonly defaultTTL = 7 * 24 * 60 * 60; // 7 días en segundos

  constructor() {
    console.log('>>> CacheService CONSTRUCTOR: Initializing Redis client...');
    
    this.client = createClient({
      socket: {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT || '6379', 10),
      },
      password: process.env.REDIS_PASSWORD || undefined,
    });

    // Configurar event listeners para Redis
    this.client.on('error', (err) => {
      console.error('>>> CacheService: Redis Client Error:', err);
    });

    this.client.on('connect', () => {
      console.log('>>> CacheService: Redis Client Connected');
    });

    this.client.on('ready', () => {
      console.log('>>> CacheService: Redis Client Ready');
    });

    this.client.on('end', () => {
      console.log('>>> CacheService: Redis Client Connection Ended');
    });
  }

  async onModuleInit() {
    try {
      console.log('>>> CacheService.onModuleInit: Connecting to Redis...');
      await this.client.connect();
      console.log('>>> CacheService.onModuleInit: Redis connection established');
    } catch (error) {
      console.error('>>> CacheService.onModuleInit: Failed to connect to Redis:', error);
      // No lanzar error para permitir que la aplicación funcione sin caché
    }
  }

  async onModuleDestroy() {
    try {
      console.log('>>> CacheService.onModuleDestroy: Disconnecting from Redis...');
      await this.client.disconnect();
      console.log('>>> CacheService.onModuleDestroy: Redis disconnected');
    } catch (error) {
      console.error('>>> CacheService.onModuleDestroy: Error disconnecting from Redis:', error);
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
        console.log('>>> CacheService.getDuration: Redis client not ready, skipping cache');
        return null;
      }

      const key = this.generateCacheKey(videoId);
      console.log(`>>> CacheService.getDuration: Checking cache for key: ${key}`);
      
      const cachedValue = await this.client.get(key);
      
      if (cachedValue !== null) {
        const duration = parseInt(cachedValue, 10);
        console.log(`>>> CacheService.getDuration: Cache HIT for ${videoId}: ${duration}s`);
        return duration;
      }
      
      console.log(`>>> CacheService.getDuration: Cache MISS for ${videoId}`);
      return null;
    } catch (error) {
      console.error('>>> CacheService.getDuration: Error accessing cache:', error);
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
        console.log('>>> CacheService.setDuration: Redis client not ready, skipping cache');
        return;
      }

      const key = this.generateCacheKey(videoId);
      const timeToLive = ttl || this.defaultTTL;
      
      console.log(`>>> CacheService.setDuration: Setting cache for ${videoId}: ${duration}s (TTL: ${timeToLive}s)`);
      
      await this.client.setEx(key, timeToLive, duration.toString());
      
      console.log(`>>> CacheService.setDuration: Cache SET for ${videoId}: ${duration}s`);
    } catch (error) {
      console.error('>>> CacheService.setDuration: Error setting cache:', error);
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
        console.log('>>> CacheService.deleteDuration: Redis client not ready, skipping cache');
        return;
      }

      const key = this.generateCacheKey(videoId);
      console.log(`>>> CacheService.deleteDuration: Deleting cache for key: ${key}`);
      
      await this.client.del(key);
      
      console.log(`>>> CacheService.deleteDuration: Cache DELETED for ${videoId}`);
    } catch (error) {
      console.error('>>> CacheService.deleteDuration: Error deleting from cache:', error);
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
      console.error('>>> CacheService.isHealthy: Redis health check failed:', error);
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
      console.error('>>> CacheService.getCacheStats: Error getting cache stats:', error);
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
} 