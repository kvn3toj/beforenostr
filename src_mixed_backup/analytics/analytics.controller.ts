import {
  Controller, Get, Post, Param, Body, Req, UseGuards, Query,
  Inject,
} from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { CreateUserEngagementDto } from './dto/create-user-engagement.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../rbac/guards/roles.guard';
import { Roles } from '../rbac/decorators/roles.decorator';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';

@ApiTags('analytics')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('analytics')
export class AnalyticsController {
  constructor(@Inject(AnalyticsService) private readonly analyticsService: AnalyticsService) {
    console.log('>>> AnalyticsController CONSTRUCTOR: this.analyticsService IS', this.analyticsService ? 'DEFINED' : 'UNDEFINED');
  }

  // Endpoints de engagement de usuarios (ya implementados)
  @Post('/events')
  @ApiOperation({ summary: 'Record user engagement event' })
  @ApiResponse({ status: 201, description: 'Engagement event recorded' })
  recordEngagement(@Body() dto: CreateUserEngagementDto, @Req() req) {
    return this.analyticsService.recordEngagement(dto, req.user.id);
  }

  @Get('/me/engagement')
  @ApiOperation({ summary: 'Get engagement history for the authenticated user' })
  getMyEngagement(@Req() req) {
    return this.analyticsService.getMyEngagement(req.user.id);
  }

  @Get('/users/:userId/engagement')
  @UseGuards(RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Get engagement history for a specific user (Admin only)' })
  getUserEngagement(@Param('userId') userId: string) {
    return this.analyticsService.getUserEngagement(userId);
  }

  @Get('/items/:itemId/engagement')
  @UseGuards(RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Get engagement history for a specific content item (Admin only)' })
  getContentItemEngagement(@Param('itemId') itemId: string) {
    return this.analyticsService.getContentItemEngagement(itemId);
  }

  // Nuevos endpoints de métricas (temporalmente devuelven mocks hasta implementar en el servicio)
  @Get('/total-users')
  @UseGuards(RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Get total users count' })
  async getTotalUsers() {
    return this.analyticsService.getTotalUsers();
  }

  @Get('/total-playlists')
  @UseGuards(RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Get total playlists count' })
  async getTotalPlaylists() {
    return this.analyticsService.getTotalPlaylists();
  }

  @Get('/total-mundos')
  @UseGuards(RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Get total mundos count' })
  async getTotalMundos() {
    return this.analyticsService.getTotalMundos();
  }

  @Get('/users-created-over-time')
  @UseGuards(RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Get users created over time' })
  @ApiQuery({ name: 'interval', required: false, enum: ['day', 'week', 'month'] })
  @ApiQuery({ name: 'startDate', required: false, type: String })
  @ApiQuery({ name: 'endDate', required: false, type: String })
  async getUsersCreatedOverTime(
    @Query('interval') interval?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.analyticsService.getUsersCreatedOverTime({ interval, startDate, endDate });
  }

  @Get('/playlists-created-over-time')
  @UseGuards(RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Get playlists created over time' })
  @ApiQuery({ name: 'interval', required: false, enum: ['day', 'week', 'month'] })
  @ApiQuery({ name: 'startDate', required: false, type: String })
  @ApiQuery({ name: 'endDate', required: false, type: String })
  async getPlaylistsCreatedOverTime(
    @Query('interval') interval?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.analyticsService.getPlaylistsCreatedOverTime({ interval, startDate, endDate });
  }

  @Get('/mundos-created-over-time')
  @UseGuards(RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Get mundos created over time' })
  @ApiQuery({ name: 'interval', required: false, enum: ['day', 'week', 'month'] })
  @ApiQuery({ name: 'startDate', required: false, type: String })
  @ApiQuery({ name: 'endDate', required: false, type: String })
  async getMundosCreatedOverTime(
    @Query('interval') interval?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.analyticsService.getMundosCreatedOverTime({ interval, startDate, endDate });
  }

  @Get('/top-viewed-playlists')
  @UseGuards(RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Get top viewed playlists' })
  async getTopViewedPlaylists() {
    return this.analyticsService.getTopViewedPlaylists();
  }

  @Get('/top-viewed-mundos')
  @UseGuards(RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Get top viewed mundos' })
  async getTopViewedMundos() {
    return this.analyticsService.getTopViewedMundos();
  }

  @Get('/active-users-over-time')
  @UseGuards(RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Get active users over time' })
  @ApiQuery({ name: 'interval', required: false, enum: ['day', 'week', 'month'] })
  @ApiQuery({ name: 'startDate', required: false, type: String })
  @ApiQuery({ name: 'endDate', required: false, type: String })
  async getActiveUsersOverTime(
    @Query('interval') interval?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.analyticsService.getActiveUsersOverTime({ interval, startDate, endDate });
  }

  @Get('/top-interacted-content')
  @UseGuards(RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Get top interacted content' })
  async getTopInteractedContent() {
    return this.analyticsService.getTopInteractedContent();
  }

  @Get('/least-viewed-playlists')
  @UseGuards(RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Get least viewed playlists' })
  async getLeastViewedPlaylists() {
    return this.analyticsService.getLeastViewedPlaylists();
  }

  @Get('/least-viewed-mundos')
  @UseGuards(RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Get least viewed mundos' })
  async getLeastViewedMundos() {
    return this.analyticsService.getLeastViewedMundos();
  }

  @Get('/least-interacted-playlists')
  @UseGuards(RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Get least interacted playlists' })
  async getLeastInteractedPlaylists() {
    return this.analyticsService.getLeastInteractedPlaylists();
  }

  @Get('/least-interacted-mundos')
  @UseGuards(RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Get least interacted mundos' })
  async getLeastInteractedMundos() {
    return this.analyticsService.getLeastInteractedMundos();
  }

  @Get('/system-stats')
  @UseGuards(RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Get system statistics' })
  async getSystemStats() {
    return this.analyticsService.getSystemStats();
  }

  @Get('/user-stats')
  @UseGuards(RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Get user statistics' })
  async getUserStats() {
    return this.analyticsService.getUserStats();
  }

  @Get('/content-stats')
  @UseGuards(RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Get content statistics' })
  async getContentStats() {
    return this.analyticsService.getContentStats();
  }
} 