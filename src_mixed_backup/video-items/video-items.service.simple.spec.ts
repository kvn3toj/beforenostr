import { Test, TestingModule } from '@nestjs/testing';
import { VideoItemsService } from './video-items.service';
import { PrismaService } from '../prisma/prisma.service';
import { CacheService } from '../cache/cache.service';
import { LoggerService } from '../common/logger';
import { MetricsService } from '../common/metrics/metrics.service';

describe('VideoItemsService (Simple)', () => {
  let service: VideoItemsService;
  let prismaService: PrismaService;
  let cacheService: CacheService;
  let loggerService: LoggerService;
  let metricsService: MetricsService;

  const mockVideoItem = {
    id: 1,
    title: 'Test Video',
    content: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    platform: 'youtube',
    externalId: 'dQw4w9WgXcQ',
    duration: 212,
    playlist: null,
    questions: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VideoItemsService,
        {
          provide: PrismaService,
          useValue: {
            videoItem: {
              findFirst: jest.fn(),
              findMany: jest.fn(),
              create: jest.fn(),
              update: jest.fn(),
              delete: jest.fn(),
            },
          },
        },
        {
          provide: CacheService,
          useValue: {
            getDuration: jest.fn(),
            setDuration: jest.fn(),
            deleteDuration: jest.fn(),
          },
        },
        {
          provide: LoggerService,
          useValue: {
            log: jest.fn(),
            error: jest.fn(),
            warn: jest.fn(),
            logVideoCalculation: jest.fn(),
            logCacheOperation: jest.fn(),
          },
        },
        {
          provide: MetricsService,
          useValue: {
            incrementVideoDurationMethods: jest.fn(),
            incrementCacheOperations: jest.fn(),
            incrementApiErrors: jest.fn(),
            recordVideoDurationCalculation: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<VideoItemsService>(VideoItemsService);
    prismaService = module.get<PrismaService>(PrismaService);
    cacheService = module.get<CacheService>(CacheService);
    loggerService = module.get<LoggerService>(LoggerService);
    metricsService = module.get<MetricsService>(MetricsService);

    // Reset all mocks
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findOne', () => {
    it('should return a video item by id', async () => {
      // Arrange
      const videoId = 1;
      prismaService.videoItem.findFirst = jest.fn().mockResolvedValue(mockVideoItem);

      // Act
      const result = await service.findOne(videoId);

      // Assert
      expect(result).toEqual(mockVideoItem);
      expect(prismaService.videoItem.findFirst).toHaveBeenCalledWith({
        where: { id: videoId },
        include: {
          playlist: true,
          questions: true,
        },
      });
    });

    it('should throw error when video item not found', async () => {
      // Arrange
      const videoId = 999;
      prismaService.videoItem.findFirst = jest.fn().mockResolvedValue(null);

      // Act & Assert
      await expect(service.findOne(videoId)).rejects.toThrow(
        `Video item with ID ${videoId} not found`
      );
    });

    it('should update platform info when missing', async () => {
      // Arrange
      const videoItemWithoutPlatform = {
        ...mockVideoItem,
        platform: null,
        externalId: null,
      };
      
      prismaService.videoItem.findFirst = jest.fn().mockResolvedValue(videoItemWithoutPlatform);
      prismaService.videoItem.update = jest.fn().mockResolvedValue({
        ...videoItemWithoutPlatform,
        platform: 'youtube',
        externalId: 'dQw4w9WgXcQ',
      });

      // Act
      const result = await service.findOne(1);

      // Assert
      expect(prismaService.videoItem.update).toHaveBeenCalled();
      expect(loggerService.log).toHaveBeenCalled();
    });
  });

  describe('updateAllDurations', () => {
    it('should be callable', async () => {
      // Arrange
      prismaService.videoItem.findMany = jest.fn().mockResolvedValue([]);

      // Act
      const result = await service.updateAllDurations();

      // Assert
      expect(result).toBeDefined();
      expect(loggerService.log).toHaveBeenCalled();
    });
  });

  describe('verifyAllDurations', () => {
    it('should be callable', async () => {
      // Arrange
      prismaService.videoItem.findMany = jest.fn().mockResolvedValue([]);

      // Act
      const result = await service.verifyAllDurations();

      // Assert
      expect(result).toBeDefined();
      expect(loggerService.log).toHaveBeenCalled();
    });
  });

  describe('testDurationCalculation', () => {
    it('should be callable', async () => {
      // Arrange
      const videoId = 1;
      prismaService.videoItem.findFirst = jest.fn().mockResolvedValue(mockVideoItem);

      // Act
      const result = await service.testDurationCalculation(videoId);

      // Assert
      expect(result).toBeDefined();
      expect(loggerService.log).toHaveBeenCalled();
    });
  });
}); 