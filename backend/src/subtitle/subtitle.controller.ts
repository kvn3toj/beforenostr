import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Patch,
  Delete,
  Query,
  HttpCode,
  HttpStatus,
  ValidationPipe,
  ParseIntPipe,
  BadRequestException,
  Inject,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '@/rbac/guards/roles.guard';
import { Roles } from '@/rbac/decorators/roles.decorator';
import { SubtitleService } from './subtitle.service';
import { CreateSubtitleDto } from './dto/create-subtitle.dto';
import { UpdateSubtitleDto } from './dto/update-subtitle.dto';
import { FindAllSubtitlesDto } from './dto/find-all-subtitles.dto';
import type { Subtitle } from '../generated/prisma';

@ApiTags('subtitles')
@ApiBearerAuth()
@Controller('subtitles')
export class SubtitleController {
  constructor(
    @Inject(SubtitleService) private readonly subtitleService: SubtitleService
  ) {
    //     console.log('>>> SubtitleController CONSTRUCTOR called');
    // //     console.log('>>> SubtitleController CONSTRUCTOR: this.subtitleService IS', this.subtitleService ? 'DEFINED' : 'UNDEFINED');
    if (!this.subtitleService) {
      //       console.error('>>> SubtitleController CONSTRUCTOR: SubtitleService is not available!');
    }
  }

  @Get('ping')
  async ping() {
    //     console.log('>>> SubtitleController.ping: Starting - no dependencies');
    return {
      message: 'SubtitleController is working',
      timestamp: new Date().toISOString(),
      controller: 'SubtitleController',
    };
  }

  @Get('test')
  async test() {
    //     console.log('>>> SubtitleController.test: Starting');
    //     console.log('>>> SubtitleController.test: this.subtitleService IS', this.subtitleService ? 'DEFINED' : 'UNDEFINED');
    return {
      message: 'Subtitle controller is working',
      serviceAvailable: !!this.subtitleService,
    };
  }

  @Get('simple')
  async simple() {
    //     console.log('>>> SubtitleController.simple: Starting');
    //     console.log('>>> SubtitleController.simple: this.subtitleService IS', this.subtitleService ? 'DEFINED' : 'UNDEFINED');

    if (!this.subtitleService) {
      //       console.error('>>> SubtitleController.simple: SubtitleService not available');
      return { error: 'SubtitleService not available' };
    }

    try {
      //       console.log('>>> SubtitleController.simple: About to call service.findAll');
      const result = await this.subtitleService.findAll({ videoItemId: 1 });
      //       console.log('>>> SubtitleController.simple: SUCCESS, result:', result);
      return { success: true, data: result };
    } catch (error) {
      //       console.error('>>> SubtitleController.simple: ERROR:', error);
      return { error: error.message };
    }
  }

  @Post()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new subtitle' })
  @ApiResponse({ status: 201, description: 'Subtitle created' })
  @ApiResponse({ status: 403, description: 'Forbidden resource' })
  async create(
    @Body() createSubtitleDto: CreateSubtitleDto
  ): Promise<Subtitle> {
    //     console.log('>>> SubtitleController.create: Starting with data:', createSubtitleDto);
    //     console.log('>>> SubtitleController.create: this.subtitleService IS', this.subtitleService ? 'DEFINED' : 'UNDEFINED');

    const result = await this.subtitleService.create(createSubtitleDto);
    //       console.log('>>> SubtitleController.create: SUCCESS');
    return result;
  }

  @Get('search')
  async findAll(
    @Query() findAllDto: FindAllSubtitlesDto
  ): Promise<Subtitle[]> {
    //     console.log('>>> SubtitleController.findAll: Starting with params:', findAllDto);
    //     console.log('>>> SubtitleController.findAll: this.subtitleService IS', this.subtitleService ? 'DEFINED' : 'UNDEFINED');

    if (!this.subtitleService) {
      //         console.error('>>> SubtitleController.findAll: SubtitleService is not available!');
      throw new Error('SubtitleService is not available');
    }

    //       console.log('>>> SubtitleController.findAll: About to call service.findAll');
    const result = await this.subtitleService.findAll(findAllDto);
    //       console.log('>>> SubtitleController.findAll: SUCCESS, found', result.length, 'subtitles');
    return result;
  }

  @Get('all-debug')
  async getAllDebug() {
    //     console.log('>>> SubtitleController.getAllDebug: Starting');
    //     console.log('>>> SubtitleController.getAllDebug: this.subtitleService IS', this.subtitleService ? 'DEFINED' : 'UNDEFINED');

    try {
      if (!this.subtitleService) {
        return { error: 'SubtitleService not available' };
      }

      // Get all subtitles without filter to see what videoItemIds exist
      //       console.log('>>> SubtitleController.getAllDebug: About to call prisma.subtitle.findMany without filter');
      const result = await this.subtitleService['prisma'].subtitle.findMany({
        orderBy: { createdAt: 'asc' },
      });
      //       console.log('>>> SubtitleController.getAllDebug: SUCCESS, found', result.length, 'subtitles');

      return {
        message: 'All subtitles retrieved successfully',
        data: result,
        count: result.length,
        videoItemIds: [...new Set(result.map((s) => s.videoItemId))],
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      //       console.error('>>> SubtitleController.getAllDebug: ERROR:', error);
      return {
        error: 'Failed to retrieve all subtitles',
        details: error.message,
        timestamp: new Date().toISOString(),
      };
    }
  }

  @Get('test-service')
  async testService() {
    //     console.log('>>> SubtitleController.testService: Starting');
    //     console.log('>>> SubtitleController.testService: this.subtitleService IS', this.subtitleService ? 'DEFINED' : 'UNDEFINED');

    try {
      if (!this.subtitleService) {
        return { error: 'SubtitleService not available' };
      }

      // Test service method with hardcoded parameters
      //       console.log('>>> SubtitleController.testService: About to call service.findAll with hardcoded params');
      const result = await this.subtitleService.findAll({ videoItemId: 1 });
      //       console.log('>>> SubtitleController.testService: SUCCESS, result:', result);

      return {
        message: 'Service test successful',
        data: result,
        count: result.length,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      //       console.error('>>> SubtitleController.testService: ERROR:', error);
      return {
        error: 'Service test failed',
        details: error.message,
        stack: error.stack,
        timestamp: new Date().toISOString(),
      };
    }
  }

  @Get('db-test')
  async dbTest() {
    //     console.log('>>> SubtitleController.dbTest: Starting');
    //     console.log('>>> SubtitleController.dbTest: this.subtitleService IS', this.subtitleService ? 'DEFINED' : 'UNDEFINED');

    try {
      if (!this.subtitleService) {
        return { error: 'SubtitleService not available' };
      }

      // Test direct database access
      //       console.log('>>> SubtitleController.dbTest: About to test direct database access');
      const count = await this.subtitleService['prisma'].subtitle.count();
      //       console.log('>>> SubtitleController.dbTest: SUCCESS, subtitle count:', count);

      return {
        message: 'Database test successful',
        subtitleCount: count,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      //       console.error('>>> SubtitleController.dbTest: ERROR:', error);
      return {
        error: 'Database test failed',
        details: error.message,
        timestamp: new Date().toISOString(),
      };
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Subtitle> {
    //     console.log('>>> SubtitleController.findOne: Starting with id:', id);
    //     console.log('>>> SubtitleController.findOne: this.subtitleService IS', this.subtitleService ? 'DEFINED' : 'UNDEFINED');

    const numericId = parseInt(id, 10);
    if (isNaN(numericId)) {
      throw new BadRequestException('Invalid ID format');
    }

    const result = await this.subtitleService.findOne(numericId);
    //       console.log('>>> SubtitleController.findOne: SUCCESS');
    return result;
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Update a subtitle' })
  @ApiResponse({ status: 200, description: 'Subtitle updated' })
  @ApiResponse({ status: 403, description: 'Forbidden resource' })
  async update(
    @Param('id') id: string,
    @Body() updateSubtitleDto: UpdateSubtitleDto
  ): Promise<Subtitle> {
    //     console.log('>>> SubtitleController.update: Starting with id:', id, 'data:', updateSubtitleDto);
    //     console.log('>>> SubtitleController.update: this.subtitleService IS', this.subtitleService ? 'DEFINED' : 'UNDEFINED');

    const numericId = parseInt(id, 10);
    if (isNaN(numericId)) {
      throw new BadRequestException('Invalid ID format');
    }

    const result = await this.subtitleService.update(
      numericId,
      updateSubtitleDto
    );
    //       console.log('>>> SubtitleController.update: SUCCESS');
    return result;
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a subtitle' })
  @ApiResponse({ status: 204, description: 'Subtitle deleted' })
  @ApiResponse({ status: 403, description: 'Forbidden resource' })
  async remove(@Param('id') id: string): Promise<void> {
    //     console.log('>>> SubtitleController.remove: Starting with id:', id);
    //     console.log('>>> SubtitleController.remove: this.subtitleService IS', this.subtitleService ? 'DEFINED' : 'UNDEFINED');

    const numericId = parseInt(id, 10);
    if (isNaN(numericId)) {
      throw new BadRequestException('Invalid ID format');
    }

    await this.subtitleService.remove(numericId);
    //       console.log('>>> SubtitleController.remove: SUCCESS');
  }
}
