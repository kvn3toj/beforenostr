import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
  Inject,
  NotFoundException,
} from '@nestjs/common';
import { VideoPermissionsService } from './video-permissions.service.js.js';
import { CreateVideoPermissionsDto } from './dto/create-video-permissions.dto.js.js';
import { UpdateVideoPermissionsDto } from './dto/update-video-permissions.dto.js.js';

@Controller('video-permissions')
export class VideoPermissionsController {
  constructor(
    @Inject(VideoPermissionsService)
    private readonly videoPermissionsService: VideoPermissionsService
  ) {
    // //     console.log('>>> VideoPermissionsController CONSTRUCTOR: this.videoPermissionsService IS', this.videoPermissionsService ? 'DEFINED' : 'UNDEFINED');
  }

  @Get('test')
  async test() {
    //     console.log('>>> VideoPermissionsController.test called');
    return {
      message: 'Video Permissions API is working',
      timestamp: new Date().toISOString(),
      service: this.videoPermissionsService ? 'CONNECTED' : 'DISCONNECTED',
    };
  }

  @Post('video/:videoItemId')
  async create(
    @Param('videoItemId', ParseIntPipe) videoItemId: number,
    @Body() createDto: CreateVideoPermissionsDto
  ) {
    //     console.log('>>> VideoPermissionsController.create called with:', { videoItemId, createDto });
    return this.videoPermissionsService.create(videoItemId, createDto);
  }

  @Get('video/:videoItemId')
  async findByVideoItemId(
    @Param('videoItemId', ParseIntPipe) videoItemId: number
  ) {
    //     console.log('>>> VideoPermissionsController.findByVideoItemId called with:', videoItemId);
    const permissions =
      await this.videoPermissionsService.findByVideoItemId(videoItemId);

    if (!permissions) {
      throw new NotFoundException(
        `Video permissions not found for video item ${videoItemId}`
      );
    }

    return permissions;
  }

  @Put('video/:videoItemId')
  async update(
    @Param('videoItemId', ParseIntPipe) videoItemId: number,
    @Body() updateDto: UpdateVideoPermissionsDto
  ) {
    //     console.log('>>> VideoPermissionsController.update called with:', { videoItemId, updateDto });
    return this.videoPermissionsService.update(videoItemId, updateDto);
  }

  @Post('video/:videoItemId/upsert')
  async upsert(
    @Param('videoItemId', ParseIntPipe) videoItemId: number,
    @Body() createDto: CreateVideoPermissionsDto
  ) {
    //     console.log('>>> VideoPermissionsController.upsert called with:', { videoItemId, createDto });
    return this.videoPermissionsService.upsert(videoItemId, createDto);
  }

  @Delete('video/:videoItemId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('videoItemId', ParseIntPipe) videoItemId: number) {
    //     console.log('>>> VideoPermissionsController.delete called with:', videoItemId);
    return this.videoPermissionsService.delete(videoItemId);
  }

  @Get('drafts')
  async findDrafts(@Query('userId') userId?: string) {
    //     console.log('>>> VideoPermissionsController.findDrafts called with userId:', userId);
    return this.videoPermissionsService.findDrafts(userId);
  }

  @Post('video/:videoItemId/publish')
  async publishDraft(@Param('videoItemId', ParseIntPipe) videoItemId: number) {
    //     console.log('>>> VideoPermissionsController.publishDraft called with:', videoItemId);
    return this.videoPermissionsService.publishDraft(videoItemId);
  }
}
