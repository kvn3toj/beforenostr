import { Controller, Get, Post, Body, Param, Inject, ParseIntPipe, Put } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { VideoItemsService } from './video-items.service';

@ApiTags('video-items')
@Controller('video-items')
export class VideoItemsController {
  constructor(
    @Inject(VideoItemsService) private readonly videoItemsService: VideoItemsService
  ) {
    console.log('>>> VideoItemsController CONSTRUCTOR: this.videoItemsService IS', this.videoItemsService ? 'DEFINED' : 'UNDEFINED');
  }

  @Get()
  @ApiOperation({ summary: 'Get all video items' })
  @ApiResponse({ status: 200, description: 'Return all video items' })
  async findAll() {
    console.log('>>> VideoItemsController.findAll: ENTERING METHOD');
    try {
      console.log('>>> VideoItemsController.findAll: About to call this.videoItemsService.findAll()');
      const result = await this.videoItemsService.findAll();
      console.log('>>> VideoItemsController.findAll: Service call successful, returning result');
      return result;
    } catch (error) {
      console.error('>>> VideoItemsController.findAll: ERROR CAUGHT:', error);
      throw error;
    }
  }

  @Get('count')
  @ApiOperation({ summary: 'Count video items in database' })
  @ApiResponse({ status: 200, description: 'Video items count' })
  async countVideoItems() {
    const items = await this.videoItemsService.findAll();
    return {
      count: items.length,
      message: 'Video items count retrieved successfully',
      timestamp: new Date().toISOString()
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get video item by ID with duration' })
  @ApiResponse({ status: 200, description: 'Video item found with duration' })
  @ApiResponse({ status: 404, description: 'Video item not found' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.videoItemsService.findOne(id);
  }

  @Post('calculate-duration')
  @ApiOperation({ summary: 'Calculate video duration from content' })
  @ApiResponse({ status: 200, description: 'Duration calculated successfully' })
  async calculateDuration(@Body() body: { content: string }) {
    const platform = this.videoItemsService.detectVideoPlatform(body.content);
    const duration = await this.videoItemsService.calculateVideoDuration(body.content);
    
    return {
      duration,
      platform,
      method: duration > 0 ? 'api_or_estimation' : 'fallback',
      timestamp: new Date().toISOString()
    };
  }

  @Post('extract-metadata')
  @ApiOperation({ summary: 'Extract metadata from video content' })
  @ApiResponse({ status: 200, description: 'Metadata extracted successfully' })
  async extractMetadata(@Body() body: { content: string }) {
    const metadata = await this.videoItemsService.extractVideoMetadata(body.content);
    
    return {
      detectedPlatform: metadata.platform,
      platformVideoId: metadata.externalId,
      videoUrl: metadata.url,
      previewImageUrl: metadata.thumbnailUrl,
      videoDuration: metadata.duration,
      extractedTitle: metadata.title,
    };
  }

  @Put(':id/update-metadata')
  @ApiOperation({ summary: 'Update metadata for an existing video item' })
  @ApiResponse({ status: 200, description: 'Video metadata updated successfully' })
  @ApiResponse({ status: 404, description: 'Video item not found' })
  async updateMetadata(@Param('id', ParseIntPipe) id: number) {
    return this.videoItemsService.updateVideoMetadata(id);
  }

  @Put(':id/update-content')
  @ApiOperation({ summary: 'Update video item content and recalculate metadata' })
  @ApiResponse({ status: 200, description: 'Video content updated successfully' })
  @ApiResponse({ status: 404, description: 'Video item not found' })
  async updateContent(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: { content: string }
  ) {
    const updatedItem = await this.videoItemsService.update(id, { content: body.content });
    
    // Actualizar metadatos después de cambiar el contenido
    try {
      const metadata = await this.videoItemsService.extractVideoMetadata(body.content);
      if (metadata.duration) {
        await this.videoItemsService.update(id, { 
          duration: metadata.duration,
          platform: metadata.platform,
          externalId: metadata.externalId 
        });
      }
    } catch (error) {
      console.error('Error updating metadata:', error);
    }
    
    return this.videoItemsService.findOne(id);
  }

  @Post('recalculate-durations')
  @ApiOperation({ summary: 'Recalculate durations for all videos that have null duration' })
  @ApiResponse({ status: 200, description: 'Duration recalculation completed' })
  @ApiResponse({ status: 500, description: 'Error during duration recalculation' })
  async recalculateAllDurations() {
    try {
      const result = await this.videoItemsService.recalculateAllDurations();
      
      return {
        success: true,
        message: 'Duration recalculation completed',
        timestamp: new Date().toISOString(),
        ...result
      };
    } catch (error) {
      return {
        success: false,
        message: 'Error during duration recalculation',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      };
    }
  }

  @Post('force-recalculate-durations')
  @ApiOperation({ 
    summary: 'Force recalculate durations for ALL videos (WITH DATA PROTECTION)', 
    description: 'Recalculates durations for all videos with built-in protection against overwriting manually verified durations. Includes safeguards against destructive updates.' 
  })
  @ApiResponse({ status: 200, description: 'Force duration recalculation completed with protection report' })
  @ApiResponse({ status: 500, description: 'Error during force duration recalculation' })
  async forceRecalculateAllDurations() {
    try {
      const result = await this.videoItemsService.forceRecalculateAllDurations();
      
      return {
        success: true,
        message: 'Force duration recalculation completed - ALL videos processed WITH DATA PROTECTION',
        timestamp: new Date().toISOString(),
        protection: {
          enabled: true,
          manuallyVerifiedVideos: [39, 40, 41, 42, 43],
          protectionRules: [
            'Manually verified durations are protected from overwrite',
            'Fallback durations (300s, 480s) are treated with caution',
            'Large duration differences (>50%) trigger protection',
            'Small differences (±10s) are considered acceptable'
          ]
        },
        ...result
      };
    } catch (error) {
      return {
        success: false,
        message: 'Error during force duration recalculation',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      };
    }
  }
} 