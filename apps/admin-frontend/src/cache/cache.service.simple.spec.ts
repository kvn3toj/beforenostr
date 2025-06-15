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
  ping: jest.fn(),
  info: jest.fn(),
};

// Mock Redis module
jest.mock('redis', () => ({
  createClient: jest.fn(() => mockRedisClient),
}));

describe('CacheService (Simple)', () => {
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
        error.stack,
        'CacheService',
        expect.any(Object)
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
  });

  describe('deleteDuration', () => {
    it('should delete cached duration', async () => {
      // Arrange
      const videoId = 'dQw4w9WgXcQ';
      mockRedisClient.del.mockResolvedValue(1);

      // Act
      await service.deleteDuration(videoId);

      // Assert
      expect(mockRedisClient.del).toHaveBeenCalledWith(`video_duration:${videoId}`);
      expect(loggerService.log).toHaveBeenCalledWith(
        `Deleted duration cache for video: ${videoId}`,
        'CacheService'
      );
    });
  });

  describe('isHealthy', () => {
    it('should return true when Redis is healthy', async () => {
      // Arrange
      mockRedisClient.ping.mockResolvedValue('PONG');

      // Act
      const result = await service.isHealthy();

      // Assert
      expect(result).toBe(true);
      expect(mockRedisClient.ping).toHaveBeenCalled();
    });

    it('should return false when Redis is unhealthy', async () => {
      // Arrange
      mockRedisClient.ping.mockRejectedValue(new Error('Redis error'));

      // Act
      const result = await service.isHealthy();

      // Assert
      expect(result).toBe(false);
    });
  });

  describe('getCacheStats', () => {
    it('should return cache statistics', async () => {
      // Arrange
      mockRedisClient.keys.mockResolvedValue(['key1', 'key2']);
      mockRedisClient.info.mockResolvedValue('used_memory:1024\r\n');

      // Act
      const result = await service.getCacheStats();

      // Assert
      expect(result).toBeDefined();
      expect(typeof result.totalKeys).toBe('number');
      expect(typeof result.memoryUsage).toBe('string');
    });
  });

  describe('setMetadata', () => {
    it('should cache metadata', async () => {
      // Arrange
      const videoId = 'dQw4w9WgXcQ';
      const metadata = { title: 'Test Video', duration: 212 };
      mockRedisClient.set.mockResolvedValue('OK');

      // Act
      await service.setMetadata(videoId, metadata);

      // Assert
      expect(mockRedisClient.set).toHaveBeenCalledWith(
        `video_metadata:${videoId}`,
        JSON.stringify(metadata),
        { EX: 7 * 24 * 60 * 60 }
      );
    });
  });

  describe('getMetadata', () => {
    it('should return cached metadata', async () => {
      // Arrange
      const videoId = 'dQw4w9WgXcQ';
      const metadata = { title: 'Test Video', duration: 212 };
      mockRedisClient.get.mockResolvedValue(JSON.stringify(metadata));

      // Act
      const result = await service.getMetadata(videoId);

      // Assert
      expect(result).toEqual(metadata);
      expect(mockRedisClient.get).toHaveBeenCalledWith(`video_metadata:${videoId}`);
    });
  });
}); 