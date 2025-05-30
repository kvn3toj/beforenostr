import { Controller, Get, Param, Post, Inject } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { VideoItemsService } from './video-items.service';
import { CacheService } from '../cache/cache.service';

@ApiTags('video-items')
@Controller('video-items')
export class VideoItemsController {
  constructor(
    @Inject(VideoItemsService) private readonly videoItemsService: VideoItemsService,
    @Inject(CacheService) private readonly cacheService: CacheService
  ) {
    console.log('>>> VideoItemsController CONSTRUCTOR: this.videoItemsService IS', this.videoItemsService ? 'DEFINED' : 'UNDEFINED');
    console.log('>>> VideoItemsController CONSTRUCTOR: this.cacheService IS', this.cacheService ? 'DEFINED' : 'UNDEFINED');
  }

  @Get('cache/health')
  @ApiOperation({ summary: 'Check Redis cache health status' })
  @ApiResponse({ status: 200, description: 'Cache health status' })
  async getCacheHealth() {
    console.log('>>> VideoItemsController.getCacheHealth: Checking cache health');
    const isHealthy = await this.cacheService.isHealthy();
    const stats = await this.cacheService.getCacheStats();
    
    return {
      healthy: isHealthy,
      stats,
      timestamp: new Date().toISOString()
    };
  }

  @Get('cache/stats')
  @ApiOperation({ summary: 'Get cache statistics' })
  @ApiResponse({ status: 200, description: 'Cache statistics' })
  async getCacheStats() {
    console.log('>>> VideoItemsController.getCacheStats: Getting cache statistics');
    return this.cacheService.getCacheStats();
  }

  @Get('test-youtube-api/:videoId')
  @ApiOperation({ summary: 'Test YouTube Data API v3 with a specific video ID' })
  @ApiResponse({ status: 200, description: 'YouTube API test completed' })
  async testYouTubeAPI(@Param('videoId') videoId: string) {
    console.log(`>>> VideoItemsController.testYouTubeAPI: Testing YouTube API for video ${videoId}`);
    
    // Crear contenido de prueba con el video ID
    const testContent = JSON.stringify({ videoId });
    
    // Probar el flujo completo que incluye la API de YouTube
    const result = await this.videoItemsService.testFullDurationFlow(videoId);
    
    return {
      videoId,
      testContent,
      result,
      apiKeyConfigured: !!process.env.YOUTUBE_API_KEY,
      timestamp: new Date().toISOString()
    };
  }

  @Get('test-duration/:id')
  @ApiOperation({ summary: 'Test duration calculation for a specific video' })
  @ApiResponse({ status: 200, description: 'Duration calculation test completed' })
  async testDurationCalculation(@Param('id') id: string) {
    console.log(`>>> VideoItemsController.testDurationCalculation: Testing video ${id}`);
    return this.videoItemsService.testDurationCalculation(parseInt(id));
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get video item by ID with duration' })
  @ApiResponse({ status: 200, description: 'Video item found with duration' })
  @ApiResponse({ status: 404, description: 'Video item not found' })
  async findOne(@Param('id') id: string) {
    console.log(`>>> VideoItemsController.findOne: Called with id = ${id}`);
    
    const numericId = parseInt(id, 10);
    if (isNaN(numericId)) {
      throw new Error(`Invalid ID format: ${id}. VideoItem ID must be a number.`);
    }
    
    return this.videoItemsService.findOne(numericId);
  }

  @Post('update-durations')
  @ApiOperation({ summary: 'Update durations for all videos without duration' })
  @ApiResponse({ status: 200, description: 'Durations updated successfully' })
  async updateAllDurations() {
    console.log('>>> VideoItemsController.updateAllDurations: Called');
    return this.videoItemsService.updateAllDurations();
  }

  @Post('verify-durations')
  @ApiOperation({ summary: 'Verify and fix all video durations using improved methods' })
  @ApiResponse({ status: 200, description: 'Duration verification completed' })
  async verifyAllDurations() {
    console.log('>>> VideoItemsController.verifyAllDurations: Called');
    return this.videoItemsService.verifyAllDurations();
  }

  @Get('recalculate-durations')
  @ApiOperation({ summary: 'Recalculate all video durations using improved methods' })
  @ApiResponse({ 
    status: 200, 
    description: 'Video durations recalculated successfully',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string' },
        totalVideos: { type: 'number' },
        updated: { type: 'number' },
        errors: { type: 'number' },
        results: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'number' },
              title: { type: 'string' },
              oldDuration: { type: 'number' },
              newDuration: { type: 'number' },
              status: { type: 'string' }
            }
          }
        }
      }
    }
  })
  async recalculateAllDurations() {
    console.log('>>> VideoItemsController.recalculateAllDurations: Starting mass recalculation');
    return this.videoItemsService.recalculateAllDurations();
  }

  @Get('test-full-duration/:videoId')
  @ApiOperation({ summary: 'Test complete duration calculation flow including scraping fallback' })
  @ApiResponse({ status: 200, description: 'Complete duration calculation test completed' })
  async testFullDurationFlow(@Param('videoId') videoId: string) {
    console.log(`>>> VideoItemsController.testFullDurationFlow: Testing complete flow for video ${videoId}`);
    return this.videoItemsService.testFullDurationFlow(videoId);
  }

  @Get('test-scraping/:videoId')
  @ApiOperation({ summary: 'Test HTML scraping method for a specific YouTube video ID' })
  @ApiResponse({ status: 200, description: 'Scraping test completed' })
  async testScraping(@Param('videoId') videoId: string) {
    console.log(`>>> VideoItemsController.testScraping: Testing scraping for video ${videoId}`);
    return this.videoItemsService.testScrapingMethod(videoId);
  }

  @Get('test-system')
  @ApiOperation({ summary: 'Comprehensive test of cache and YouTube API system' })
  @ApiResponse({ status: 200, description: 'System test completed with detailed results' })
  async testSystem() {
    console.log('>>> VideoItemsController.testSystem: Starting comprehensive system test');
    return this.videoItemsService.testCacheAndAPISystem();
  }
} 