import { Controller, Get, Param, NotFoundException, Inject } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { PrismaService } from '../prisma/prisma.service';

@ApiTags('video-items')
@Controller('video-items')
export class VideoItemsController {
  constructor(@Inject(PrismaService) private readonly prisma: PrismaService) {
    console.log('>>> VideoItemsController CONSTRUCTOR: this.prisma IS', this.prisma ? 'DEFINED' : 'UNDEFINED');
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a video item by ID' })
  @ApiResponse({ status: 200, description: 'Video item found' })
  @ApiResponse({ status: 404, description: 'Video item not found' })
  async findOne(@Param('id') id: string) {
    console.log('>>> VideoItemsController.findOne: Starting with id:', id);
    console.log('>>> VideoItemsController.findOne: this.prisma IS', this.prisma ? 'DEFINED' : 'UNDEFINED');
    
    try {
      const parsedId = parseInt(id);
      console.log('>>> VideoItemsController.findOne: Parsed ID:', parsedId);
      
      if (isNaN(parsedId)) {
        throw new NotFoundException(`Invalid ID format: ${id}`);
      }
      
      console.log('>>> VideoItemsController.findOne: About to call prisma.videoItem.findUnique');
      const videoItem = await this.prisma.videoItem.findUnique({
        where: { id: parsedId },
        include: {
          subtitles: {
            where: { isActive: true }
          },
          questions: {
            where: { isActive: true },
            include: {
              answerOptions: {
                orderBy: { order: 'asc' }
              }
            }
          }
        }
      });

      console.log('>>> VideoItemsController.findOne: Query result:', videoItem ? 'FOUND' : 'NOT FOUND');

      if (!videoItem) {
        throw new NotFoundException(`Video item with ID ${id} not found`);
      }

      console.log('>>> VideoItemsController.findOne: SUCCESS, returning videoItem');
      return videoItem;
    } catch (error) {
      console.error('>>> VideoItemsController.findOne: ERROR:', error);
      throw error;
    }
  }
} 