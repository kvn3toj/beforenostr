import { Test, TestingModule } from '@nestjs/testing';
import { CacheService } from './cache.service';
import { LoggerService } from '../common/logger';
import { MetricsService } from '../common/metrics/metrics.service';

// Mock Redis client
const mockRedisClient = {
  connect: jest.fn(),
  disconnect: jest.fn(),
  get: jest.fn(),
  set: jest.fn(),
  del: jest.fn(),
  exists: jest.fn(),
  expire: jest.fn(),
  keys: jest.fn(),
  on: jest.fn(),
  isReady: true,
};

// Mock Redis module
jest.mock('redis', () => ({
  createClient: jest.fn(() => mockRedisClient),
}));

describe('CacheService', () => {
  let service: CacheService;
  let loggerService: LoggerService;
  let metricsService: MetricsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CacheService,
        {
          provide: LoggerService,
          useValue: {
            log: jest.fn(),
            error: jest.fn(),
            warn: jest.fn(),
          },
        },
        {
          provide: MetricsService,
          useValue: {
            incrementCacheOperations: jest.fn(),
            setCacheHitRatio: jest.fn(),
            recordCacheOperationDuration: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<CacheService>(CacheService);
    loggerService = module.get<LoggerService>(LoggerService);
    metricsService = module.get<MetricsService>(MetricsService);

    // Reset all mocks
    jest.clearAllMocks();
    mockRedisClient.isReady = true;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('onModuleInit', () => {
    it('should connect to Redis successfully', async () => {
      // Arrange
      mockRedisClient.connect.mockResolvedValue(undefined);

      // Act
      await service.onModuleInit();

      // Assert
      expect(mockRedisClient.connect).toHaveBeenCalled();
      expect(loggerService.log).toHaveBeenCalledWith(
        'Redis connection established',
        'CacheService'
      );
    });

    it('should handle Redis connection failure gracefully', async () => {
      // Arrange
      const error = new Error('Connection failed');
      mockRedisClient.connect.mockRejectedValue(error);

      // Act
      await service.onModuleInit();

      // Assert
      expect(loggerService.error).toHaveBeenCalledWith(
        'Failed to connect to Redis',
        error,
        'CacheService'
      );
    });
  });

  describe('onModuleDestroy', () => {
    it('should disconnect from Redis successfully', async () => {
      // Arrange
      mockRedisClient.disconnect.mockResolvedValue(undefined);

      // Act
      await service.onModuleDestroy();

      // Assert
      expect(mockRedisClient.disconnect).toHaveBeenCalled();
      expect(loggerService.log).toHaveBeenCalledWith(
        'Redis disconnected',
        'CacheService'
      );
    });

    it('should handle Redis disconnection error gracefully', async () => {
      // Arrange
      const error = new Error('Disconnection failed');
      mockRedisClient.disconnect.mockRejectedValue(error);

      // Act
      await service.onModuleDestroy();

      // Assert
      expect(loggerService.error).toHaveBeenCalledWith(
        'Error disconnecting from Redis',
        error,
        'CacheService'
      );
    });
  });

  describe('getDuration', () => {
    it('should return cached duration when available', async () => {
      // Arrange
      const videoId = 'dQw4w9WgXcQ';
      const cachedDuration = '212';
      mockRedisClient.get.mockResolvedValue(cachedDuration);

      // Act
      const result = await service.getDuration(videoId);

      // Assert
      expect(result).toBe(212);
      expect(mockRedisClient.get).toHaveBeenCalledWith(`video_duration:${videoId}`);
      expect(metricsService.incrementCacheOperations).toHaveBeenCalledWith('get', 'hit');
    });

    it('should return null when cache miss', async () => {
      // Arrange
      const videoId = 'nonexistent';
      mockRedisClient.get.mockResolvedValue(null);

      // Act
      const result = await service.getDuration(videoId);

      // Assert
      expect(result).toBeNull();
      expect(metricsService.incrementCacheOperations).toHaveBeenCalledWith('get', 'miss');
    });

    it('should return null when Redis client is not ready', async () => {
      // Arrange
      const videoId = 'dQw4w9WgXcQ';
      mockRedisClient.isReady = false;

      // Act
      const result = await service.getDuration(videoId);

      // Assert
      expect(result).toBeNull();
      expect(mockRedisClient.get).not.toHaveBeenCalled();
      expect(loggerService.log).toHaveBeenCalledWith(
        'Redis client not ready, skipping cache',
        'CacheService'
      );
    });

    it('should handle Redis errors gracefully', async () => {
      // Arrange
      const videoId = 'dQw4w9WgXcQ';
      const error = new Error('Redis error');
      mockRedisClient.get.mockRejectedValue(error);

      // Act
      const result = await service.getDuration(videoId);

      // Assert
      expect(result).toBeNull();
      expect(loggerService.error).toHaveBeenCalledWith(
        'Error getting duration from cache',
        error,
        'CacheService'
      );
    });
  });

  describe('setDuration', () => {
    it('should cache duration with default TTL', async () => {
      // Arrange
      const videoId = 'dQw4w9WgXcQ';
      const duration = 212;
      mockRedisClient.set.mockResolvedValue('OK');

      // Act
      await service.setDuration(videoId, duration);

      // Assert
      expect(mockRedisClient.set).toHaveBeenCalledWith(
        `video_duration:${videoId}`,
        duration.toString(),
        { EX: 7 * 24 * 60 * 60 } // 7 days
      );
      expect(metricsService.incrementCacheOperations).toHaveBeenCalledWith('set', 'success');
    });

    it('should cache duration with custom TTL', async () => {
      // Arrange
      const videoId = 'dQw4w9WgXcQ';
      const duration = 212;
      const customTTL = 3600; // 1 hour
      mockRedisClient.set.mockResolvedValue('OK');

      // Act
      await service.setDuration(videoId, duration, customTTL);

      // Assert
      expect(mockRedisClient.set).toHaveBeenCalledWith(
        `video_duration:${videoId}`,
        duration.toString(),
        { EX: customTTL }
      );
    });

    it('should skip caching when Redis client is not ready', async () => {
      // Arrange
      const videoId = 'dQw4w9WgXcQ';
      const duration = 212;
      mockRedisClient.isReady = false;

      // Act
      await service.setDuration(videoId, duration);

      // Assert
      expect(mockRedisClient.set).not.toHaveBeenCalled();
      expect(loggerService.log).toHaveBeenCalledWith(
        'Redis client not ready, skipping cache',
        'CacheService'
      );
    });

    it('should handle Redis errors gracefully', async () => {
      // Arrange
      const videoId = 'dQw4w9WgXcQ';
      const duration = 212;
      const error = new Error('Redis error');
      mockRedisClient.set.mockRejectedValue(error);

      // Act
      await service.setDuration(videoId, duration);

      // Assert
      expect(loggerService.error).toHaveBeenCalledWith(
        'Error setting duration in cache',
        error,
        'CacheService'
      );
      expect(metricsService.incrementCacheOperations).toHaveBeenCalledWith('set', 'error');
    });
  });

  describe('invalidatePattern', () => {
    it('should delete keys matching pattern', async () => {
      // Arrange
      const pattern = 'video_duration:*';
      const matchingKeys = ['video_duration:key1', 'video_duration:key2'];
      mockRedisClient.keys.mockResolvedValue(matchingKeys);
      mockRedisClient.del.mockResolvedValue(2);

      // Act
      const result = await service.invalidatePattern(pattern);

      // Assert
      expect(result).toBe(2);
      expect(mockRedisClient.keys).toHaveBeenCalledWith(pattern);
      expect(mockRedisClient.del).toHaveBeenCalledWith(matchingKeys);
    });

    it('should return 0 when no keys match pattern', async () => {
      // Arrange
      const pattern = 'nonexistent:*';
      mockRedisClient.keys.mockResolvedValue([]);

      // Act
      const result = await service.invalidatePattern(pattern);

      // Assert
      expect(result).toBe(0);
      expect(mockRedisClient.del).not.toHaveBeenCalled();
    });

    it('should skip invalidation when Redis client is not ready', async () => {
      // Arrange
      const pattern = 'video_duration:*';
      mockRedisClient.isReady = false;

      // Act
      const result = await service.invalidatePattern(pattern);

      // Assert
      expect(result).toBe(0);
      expect(mockRedisClient.keys).not.toHaveBeenCalled();
    });

    it('should handle Redis errors gracefully', async () => {
      // Arrange
      const pattern = 'video_duration:*';
      const error = new Error('Redis error');
      mockRedisClient.keys.mockRejectedValue(error);

      // Act
      const result = await service.invalidatePattern(pattern);

      // Assert
      expect(result).toBe(0);
      expect(loggerService.error).toHaveBeenCalledWith(
        'Error invalidating cache pattern',
        error,
        'CacheService'
      );
    });
  });

  describe('get', () => {
    it('should get value from cache', async () => {
      // Arrange
      const key = 'test_key';
      const value = 'test_value';
      mockRedisClient.get.mockResolvedValue(value);

      // Act
      const result = await service.get(key);

      // Assert
      expect(result).toBe(value);
      expect(mockRedisClient.get).toHaveBeenCalledWith(key);
    });

    it('should return null for non-existent key', async () => {
      // Arrange
      const key = 'nonexistent_key';
      mockRedisClient.get.mockResolvedValue(null);

      // Act
      const result = await service.get(key);

      // Assert
      expect(result).toBeNull();
    });
  });

  describe('set', () => {
    it('should set value in cache', async () => {
      // Arrange
      const key = 'test_key';
      const value = 'test_value';
      const ttl = 3600;
      mockRedisClient.set.mockResolvedValue('OK');

      // Act
      await service.set(key, value, ttl);

      // Assert
      expect(mockRedisClient.set).toHaveBeenCalledWith(key, value, { EX: ttl });
    });

    it('should set value without TTL when not provided', async () => {
      // Arrange
      const key = 'test_key';
      const value = 'test_value';
      mockRedisClient.set.mockResolvedValue('OK');

      // Act
      await service.set(key, value);

      // Assert
      expect(mockRedisClient.set).toHaveBeenCalledWith(key, value, { EX: 7 * 24 * 60 * 60 });
    });
  });

  describe('del', () => {
    it('should delete key from cache', async () => {
      // Arrange
      const key = 'test_key';
      mockRedisClient.del.mockResolvedValue(1);

      // Act
      const result = await service.del(key);

      // Assert
      expect(result).toBe(1);
      expect(mockRedisClient.del).toHaveBeenCalledWith(key);
    });
  });

  describe('exists', () => {
    it('should check if key exists', async () => {
      // Arrange
      const key = 'test_key';
      mockRedisClient.exists.mockResolvedValue(1);

      // Act
      const result = await service.exists(key);

      // Assert
      expect(result).toBe(true);
      expect(mockRedisClient.exists).toHaveBeenCalledWith(key);
    });

    it('should return false for non-existent key', async () => {
      // Arrange
      const key = 'nonexistent_key';
      mockRedisClient.exists.mockResolvedValue(0);

      // Act
      const result = await service.exists(key);

      // Assert
      expect(result).toBe(false);
    });
  });
}); 