import {
  Controller, Get, Post, Put, Delete, Param, Body, Req, UseGuards, Inject,
} from '@nestjs/common';
import { ContentItemsService } from './content-items.service';
import { CreateContentItemDto } from './dto/create-content-item.dto';
import { UpdateContentItemDto } from './dto/update-content-item.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../rbac/guards/roles.guard';
import { Roles } from '../../rbac/decorators/roles.decorator';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('content-items')
@ApiBearerAuth()
@Controller('content/items')
export class ContentItemsController {
  constructor(@Inject(ContentItemsService) private readonly contentItemsService: ContentItemsService) {
    console.log('>>> ContentItemsController CONSTRUCTOR: this.contentItemsService IS', this.contentItemsService ? 'DEFINED' : 'UNDEFINED');
  }

  @Get('test')
  @ApiOperation({ summary: 'Test endpoint without authentication' })
  async test() {
    console.log('>>> ContentItemsController.test: Called');
    try {
      const result = await this.contentItemsService.findAll(true);
      console.log('>>> ContentItemsController.test: Success, returning', result.length, 'items');
      return { status: 'ok', itemCount: result.length, items: result };
    } catch (error) {
      console.error('>>> ContentItemsController.test: Error:', error);
      return { status: 'error', error: error.message };
    }
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get all content items' })
  async findAll(@Req() req) {
    console.log('>>> ContentItemsController.findAll: Called');
    console.log('>>> ContentItemsController.findAll: User:', req.user);
    
    const isAdmin = req.user?.roles?.includes('admin');
    console.log('>>> ContentItemsController.findAll: isAdmin =', isAdmin);
    
    try {
      const result = await this.contentItemsService.findAll(isAdmin);
      console.log('>>> ContentItemsController.findAll: Success, returning', result.length, 'items');
      return result;
    } catch (error) {
      console.error('>>> ContentItemsController.findAll: Error:', error);
      throw error;
    }
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get a content item by ID' })
  findOne(@Param('id') id: string, @Req() req) {
    console.log('>>> ContentItemsController.findOne: Called with id =', id);
    const isAdmin = req.user?.roles?.includes('admin');
    return this.contentItemsService.findOne(id, isAdmin);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Create a new content item' })
  @ApiResponse({ status: 201, description: 'Content item created' })
  create(@Body() dto: CreateContentItemDto, @Req() req) {
    console.log('>>> ContentItemsController.create: Called with dto =', dto);
    return this.contentItemsService.create(dto, req.user.id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Update a content item' })
  update(@Param('id') id: string, @Body() dto: UpdateContentItemDto) {
    console.log('>>> ContentItemsController.update: Called with id =', id, 'dto =', dto);
    return this.contentItemsService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Soft delete a content item' })
  remove(@Param('id') id: string) {
    console.log('>>> ContentItemsController.remove: Called with id =', id);
    return this.contentItemsService.remove(id);
  }

  @Get(':id/versions')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get versions for a content item' })
  findVersions(@Param('id') id: string) {
    console.log('>>> ContentItemsController.findVersions: Called with id =', id);
    return this.contentItemsService.findVersionsByItemId(id);
  }

  @Post('test-create-video')
  @ApiOperation({ summary: 'Test creation of a new video with automatic duration calculation' })
  @ApiResponse({ status: 201, description: 'Test video created successfully with duration' })
  async testCreateVideo() {
    console.log('>>> ContentItemsController.testCreateVideo: Creating test video...');
    
    // Crear un video de prueba con contenido de YouTube
    const testVideoDto = {
      title: 'Test Video - Auto Duration',
      description: 'Video de prueba para verificar cálculo automático de duración',
      content: JSON.stringify({
        type: 'youtube_video',
        videoId: 'EEZkQv25uEs', // Economía Sagrada - sabemos que debería dar 729s
        url: 'https://www.youtube.com/watch?v=EEZkQv25uEs',
        title: 'Test Video - Auto Duration',
        author: 'Test Author',
        category: 'Test Category',
        description: 'Video de prueba para verificar cálculo automático de duración'
      }),
      playlistId: '33333333-3333-3333-3333-333333333333', // Usar playlist existente
      itemTypeId: 'video',
      order: 999,
      isActive: true
    };

    try {
      const createdVideo = await this.contentItemsService.create(testVideoDto, 'test-user');
      
      console.log('>>> ContentItemsController.testCreateVideo: Test video created successfully');
      
      return {
        success: true,
        message: 'Test video created with automatic duration calculation',
        video: {
          id: createdVideo.id,
          title: createdVideo.title,
          duration: createdVideo.duration,
          durationFormatted: createdVideo.duration ? 
            `${Math.floor(createdVideo.duration/60)}:${(createdVideo.duration%60).toString().padStart(2,'0')}` : 
            'No duration',
          expectedDuration: 729,
          durationCorrect: createdVideo.duration === 729,
          createdAt: createdVideo.createdAt
        },
        testing: {
          expectedDuration: '729s (12:09)',
          actualDuration: createdVideo.duration ? `${createdVideo.duration}s` : 'null',
          autoCalculationWorking: createdVideo.duration === 729
        }
      };
    } catch (error) {
      console.error('>>> ContentItemsController.testCreateVideo: Error:', error);
      throw error;
    }
  }
} 