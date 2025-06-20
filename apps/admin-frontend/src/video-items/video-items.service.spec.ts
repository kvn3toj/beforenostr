import { Test, TestingModule } from '@nestjs/testing';
import { VideoItemsService } from './video-items.service';
import { PrismaService } from '../prisma/prisma.service';
import { CacheService } from '../cache/cache.service';
import { LoggerService } from '../common/logger';
import { MetricsService } from '../common/metrics/metrics.service';
import { VideoPlatform } from '../common/constants/platform.enum';

// Mock node-fetch
const mockFetch = jest.fn();
jest.mock('node-fetch', () => mockFetch);

describe('VideoItemsService', () => {
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
    duration: null,
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
            invalidatePattern: jest.fn(),
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

    it('should update platform and external ID when missing', async () => {
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
      expect(prismaService.videoItem.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: {
          platform: 'youtube',
          externalId: 'dQw4w9WgXcQ',
        },
      });
    });
  });

  describe('detectVideoPlatform', () => {
    it('should detect YouTube platform from URL', () => {
      // Arrange
      const youtubeUrl = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';

      // Act
      const platform = service.detectVideoPlatform(youtubeUrl);

      // Assert
      expect(platform).toBe(VideoPlatform.YOUTUBE);
    });

    it('should detect Vimeo platform from URL', () => {
      // Arrange
      const vimeoUrl = 'https://vimeo.com/123456789';

      // Act
      const platform = service.detectVideoPlatform(vimeoUrl);

      // Assert
      expect(platform).toBe(VideoPlatform.VIMEO);
    });

    it('should return UNKNOWN for unsupported URLs', () => {
      // Arrange
      const unsupportedUrl = 'https://example.com/video';

      // Act
      const platform = service.detectVideoPlatform(unsupportedUrl);

      // Assert
      expect(platform).toBe(VideoPlatform.UNKNOWN);
    });
  });

  describe('extractPlatformId', () => {
    it('should extract YouTube video ID from URL', () => {
      // Arrange
      const youtubeUrl = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';

      // Act
      const videoId = service.extractPlatformId(youtubeUrl, VideoPlatform.YOUTUBE);

      // Assert
      expect(videoId).toBe('dQw4w9WgXcQ');
    });

    it('should extract YouTube video ID from short URL', () => {
      // Arrange
      const youtubeShortUrl = 'https://youtu.be/dQw4w9WgXcQ';

      // Act
      const videoId = service.extractPlatformId(youtubeShortUrl, VideoPlatform.YOUTUBE);

      // Assert
      expect(videoId).toBe('dQw4w9WgXcQ');
    });

    it('should extract Vimeo video ID from URL', () => {
      // Arrange
      const vimeoUrl = 'https://vimeo.com/123456789';

      // Act
      const videoId = service.extractPlatformId(vimeoUrl, VideoPlatform.VIMEO);

      // Assert
      expect(videoId).toBe('123456789');
    });

    it('should return null for invalid URLs', () => {
      // Arrange
      const invalidUrl = 'https://example.com/video';

      // Act
      const videoId = service.extractPlatformId(invalidUrl, VideoPlatform.YOUTUBE);

      // Assert
      expect(videoId).toBeNull();
    });
  });

  describe('calculateVideoDuration', () => {
    beforeEach(() => {
      // Mock cache miss by default
      cacheService.getDuration = jest.fn().mockResolvedValue(null);
    });

    it('should return cached duration when available', async () => {
      // Arrange
      const content = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';
      const cachedDuration = 212;
      cacheService.getDuration = jest.fn().mockResolvedValue(cachedDuration);

      // Act
      const result = await service.calculateVideoDuration(content);

      // Assert
      expect(result).toBe(cachedDuration);
      expect(cacheService.getDuration).toHaveBeenCalled();
      expect(metricsService.incrementCacheOperations).toHaveBeenCalledWith('get', 'hit');
    });

    it('should calculate YouTube duration via API when not cached', async () => {
      // Arrange
      const content = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';
      const mockApiResponse = {
        items: [{
          contentDetails: {
            duration: 'PT3M32S' // 3 minutes 32 seconds = 212 seconds
          }
        }]
      };

      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockApiResponse),
      });

      // Mock environment variable
      process.env.YOUTUBE_API_KEY = 'test-api-key';

      // Act
      const result = await service.calculateVideoDuration(content);

      // Assert
      expect(result).toBe(212);
      expect(cacheService.setDuration).toHaveBeenCalled();
      expect(metricsService.incrementVideoDurationMethods).toHaveBeenCalledWith('youtube', true);
    });

    it('should calculate Vimeo duration via API when not cached', async () => {
      // Arrange
      const content = 'https://vimeo.com/123456789';
      const mockApiResponse = {
        duration: 212
      };

      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockApiResponse),
      });

      // Act
      const result = await service.calculateVideoDuration(content);

      // Assert
      expect(result).toBe(212);
      expect(cacheService.setDuration).toHaveBeenCalled();
      expect(metricsService.incrementVideoDurationMethods).toHaveBeenCalledWith('vimeo', true);
    });

    it('should fallback to estimation when API fails', async () => {
      // Arrange
      const content = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';
      
      mockFetch.mockRejectedValue(new Error('API Error'));

      // Act
      const result = await service.calculateVideoDuration(content);

      // Assert
      expect(result).toBeGreaterThan(0); // Should return estimated duration
      expect(metricsService.incrementApiErrors).toHaveBeenCalled();
    });

    it('should handle invalid content gracefully', async () => {
      // Arrange
      const invalidContent = 'invalid-content';

      // Act
      const result = await service.calculateVideoDuration(invalidContent);

      // Assert
      expect(result).toBeGreaterThan(0); // Should return default estimation
    });
  });

  describe('getEstimatedDuration', () => {
    it('should return default duration for unknown content', () => {
      // Arrange
      const content = 'unknown-content';

      // Act
      const result = service.getEstimatedDuration(content);

      // Assert
      expect(result).toBe(300); // Default 5 minutes
    });

    it('should return longer duration for educational content', () => {
      // Arrange
      const content = 'Educational video about programming';

      // Act
      const result = service.getEstimatedDuration(content);

      // Assert
      expect(result).toBeGreaterThan(300);
    });
  });

  describe('findAll', () => {
    it('should return all video items', async () => {
      // Arrange
      const mockVideoItems = [mockVideoItem];
      prismaService.videoItem.findMany = jest.fn().mockResolvedValue(mockVideoItems);

      // Act
      const result = await service.findAll();

      // Assert
      expect(result).toEqual(mockVideoItems);
      expect(prismaService.videoItem.findMany).toHaveBeenCalled();
    });

    it('should handle empty result', async () => {
      // Arrange
      prismaService.videoItem.findMany = jest.fn().mockResolvedValue([]);

      // Act
      const result = await service.findAll();

      // Assert
      expect(result).toEqual([]);
    });
  });

  describe('create', () => {
    it('should create a new video item', async () => {
      // Arrange
      const createData = {
        title: 'New Video',
        content: 'https://www.youtube.com/watch?v=newvideo',
        playlistId: 1,
      };
      
      const createdVideoItem = {
        ...mockVideoItem,
        ...createData,
        id: 2,
      };

      prismaService.videoItem.create = jest.fn().mockResolvedValue(createdVideoItem);

      // Act
      const result = await service.create(createData);

      // Assert
      expect(result).toEqual(createdVideoItem);
      expect(prismaService.videoItem.create).toHaveBeenCalledWith({
        data: expect.objectContaining(createData),
      });
    });
  });

  describe('update', () => {
    it('should update an existing video item', async () => {
      // Arrange
      const updateData = { title: 'Updated Title' };
      const updatedVideoItem = { ...mockVideoItem, ...updateData };

      prismaService.videoItem.update = jest.fn().mockResolvedValue(updatedVideoItem);

      // Act
      const result = await service.update(1, updateData);

      // Assert
      expect(result).toEqual(updatedVideoItem);
      expect(prismaService.videoItem.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: updateData,
      });
    });
  });

  describe('remove', () => {
    it('should delete a video item', async () => {
      // Arrange
      prismaService.videoItem.delete = jest.fn().mockResolvedValue(mockVideoItem);

      // Act
      const result = await service.remove(1);

      // Assert
      expect(result).toEqual(mockVideoItem);
      expect(prismaService.videoItem.delete).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });
  });
}); 