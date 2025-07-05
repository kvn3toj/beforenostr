import {
  Controller,
  Get,
  Param,
  NotFoundException,
  Inject,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { PrismaService } from '../prisma/prisma.service.js.js';
import { VideoItemsService } from './video-items.service.js.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js.js';
import { VideoItemResponseDto } from './dto/video-item-response.dto.js.js';

@ApiTags('video-items')
@Controller('video-items')
@ApiBearerAuth() // Para indicar que requiere token JWT en Swagger
export class VideoItemsController {
  constructor(
    @Inject(PrismaService) private readonly prisma: PrismaService,
    @Inject(VideoItemsService)
    private readonly videoItemsService: VideoItemsService
  ) {
    // //     console.log('>>> VideoItemsController CONSTRUCTOR: this.prisma IS', this.prisma ? 'DEFINED' : 'UNDEFINED');
    // //     console.log('>>> VideoItemsController CONSTRUCTOR: this.videoItemsService IS', this.videoItemsService ? 'DEFINED' : 'UNDEFINED');
  }

  @Get()
  @ApiOperation({ summary: 'Get all video items' })
  @ApiResponse({
    status: 200,
    description: 'List of video items',
    type: [VideoItemResponseDto],
  })
  async findAll() {
    //     console.log('>>> VideoItemsController.findAll: Starting...');
    //     console.log('>>> VideoItemsController.findAll: this.prisma IS', this.prisma ? 'DEFINED' : 'UNDEFINED');

    try {
      //       console.log('>>> VideoItemsController.findAll: About to call prisma.videoItem.findMany');
      const videoItems = await this.prisma.videoItem.findMany({
        include: {
          subtitles: {
            where: { isActive: true },
          },
          questions: {
            where: { isActive: true },
            include: {
              answerOptions: {
                orderBy: { order: 'asc' },
              },
            },
          },
        },
        orderBy: { id: 'asc' },
      });

      // Mapear externalId a youtubeId y exponer thumbnailUrl
      return videoItems.map((item) => ({
        ...item,
        youtubeId: item.externalId,
        thumbnailUrl: item.thumbnailUrl,
      }));
    } catch (error) {
      //       console.error('>>> VideoItemsController.findAll: ERROR:', error);
      throw error;
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a video item by ID' })
  @ApiResponse({
    status: 200,
    description: 'Video item found',
    type: VideoItemResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Video item not found' })
  async findOne(@Param('id') id: string) {
    //     console.log('>>> VideoItemsController.findOne: Starting with id:', id);
    //     console.log('>>> VideoItemsController.findOne: this.prisma IS', this.prisma ? 'DEFINED' : 'UNDEFINED');

    try {
      const parsedId = parseInt(id);
      //       console.log('>>> VideoItemsController.findOne: Parsed ID:', parsedId);

      if (isNaN(parsedId)) {
        throw new NotFoundException(`Invalid ID format: ${id}`);
      }

      //       console.log('>>> VideoItemsController.findOne: About to call prisma.videoItem.findUnique');
      const videoItem = await this.prisma.videoItem.findUnique({
        where: { id: parsedId },
        include: {
          subtitles: {
            where: { isActive: true },
          },
          questions: {
            where: { isActive: true },
            include: {
              answerOptions: {
                orderBy: { order: 'asc' },
              },
            },
          },
        },
      });

      //       console.log('>>> VideoItemsController.findOne: Query result:', videoItem ? 'FOUND' : 'NOT FOUND');

      if (!videoItem) {
        throw new NotFoundException(`Video item with ID ${id} not found`);
      }

      // Mapear externalId a youtubeId y exponer thumbnailUrl
      return {
        ...videoItem,
        youtubeId: videoItem.externalId,
        thumbnailUrl: videoItem.thumbnailUrl,
      };
    } catch (error) {
      //       console.error('>>> VideoItemsController.findOne: ERROR:', error);
      throw error;
    }
  }

  @Get(':videoId/questions')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get interactive questions for a specific video' })
  @ApiResponse({
    status: 200,
    description: 'Returns questions and answer options for the video.',
  })
  @ApiResponse({
    status: 404,
    description: 'Video not found or no questions found.',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - JWT token required.',
  })
  async getQuestionsForVideo(@Param('videoId') videoId: string) {
    //     console.log('>>> VideoItemsController.getQuestionsForVideo: Starting with videoId:', videoId);

    try {
      const questions =
        await this.videoItemsService.findQuestionsByVideoId(videoId);
      //       console.log('>>> VideoItemsController.getQuestionsForVideo: SUCCESS, returning', questions.length, 'questions');
      return questions;
    } catch (error) {
      //       console.error('>>> VideoItemsController.getQuestionsForVideo: ERROR:', error);
      throw error;
    }
  }
}
