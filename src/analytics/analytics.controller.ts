import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  Param,
  Inject,
  // UseGuards,
} from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { CreateAnalyticsDataDto } from './dto/create-analytics-data.dto';
import { CreateReportDto } from './dto/create-report.dto';
import { CreateRankingDto } from './dto/create-ranking.dto';
import { CreateVideoEngagementEventDto } from './dto/create-video-engagement-event.dto';
import { VideoEngagementMetricsDto, VideoEngagementReportDto } from './dto/video-engagement-metrics.dto';
// import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
// import { RolesGuard } from '../rbac/guards/roles.guard';
// import { Roles } from '../rbac/decorators/roles.decorator';
import {
  ApiTags,
  // ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiParam,
} from '@nestjs/swagger';

@ApiTags('analytics')
// @ApiBearerAuth()
// @UseGuards(JwtAuthGuard)
@Controller('analytics')
export class AnalyticsController {
  constructor(@Inject(AnalyticsService) private readonly analyticsService: AnalyticsService) {
    console.log('>>> AnalyticsController CONSTRUCTOR: this.analyticsService IS', this.analyticsService ? 'DEFINED' : 'UNDEFINED');
  }

  // === ANALYTICS DATA ENDPOINTS ===
  @Post('data')
  @ApiOperation({ summary: 'Create analytics data entry' })
  @ApiResponse({ status: 201, description: 'Analytics data created successfully' })
  createAnalyticsData(@Body() createAnalyticsDataDto: CreateAnalyticsDataDto) {
    return this.analyticsService.createAnalyticsData(createAnalyticsDataDto);
  }

  @Get('data')
  @ApiOperation({ summary: 'Get analytics data' })
  @ApiQuery({ name: 'eventType', required: false, description: 'Filter by event type' })
  @ApiQuery({ name: 'userId', required: false, description: 'Filter by user ID' })
  @ApiQuery({ name: 'startDate', required: false, description: 'Start date (ISO string)' })
  @ApiQuery({ name: 'endDate', required: false, description: 'End date (ISO string)' })
  @ApiQuery({ name: 'limit', required: false, description: 'Number of results', type: Number })
  @ApiResponse({ status: 200, description: 'Analytics data retrieved successfully' })
  getAnalyticsData(
    @Query('eventType') eventType?: string,
    @Query('userId') userId?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('limit') limit?: string,
  ) {
    return this.analyticsService.getAnalyticsData({
      eventType,
      userId,
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
      limit: limit ? parseInt(limit, 10) : undefined,
    });
  }

  // === REPORT ENDPOINTS ===
  @Post('reports')
  // @UseGuards(RolesGuard)
  // @Roles('admin', 'superadmin')
  @ApiOperation({ summary: 'Create a new report (Admin only)' })
  @ApiResponse({ status: 201, description: 'Report created successfully' })
  createReport(@Body() createReportDto: CreateReportDto) {
    return this.analyticsService.createReport(createReportDto);
  }

  @Get('reports')
  // @UseGuards(RolesGuard)
  // @Roles('admin', 'superadmin')
  @ApiOperation({ summary: 'Get reports (Admin only)' })
  @ApiQuery({ name: 'type', required: false, description: 'Filter by report type' })
  @ApiQuery({ name: 'generatedById', required: false, description: 'Filter by generator user ID' })
  @ApiQuery({ name: 'limit', required: false, description: 'Number of results', type: Number })
  @ApiResponse({ status: 200, description: 'Reports retrieved successfully' })
  getReports(
    @Query('type') type?: string,
    @Query('generatedById') generatedById?: string,
    @Query('limit') limit?: string,
  ) {
    return this.analyticsService.getReports({
      type,
      generatedById,
      limit: limit ? parseInt(limit, 10) : undefined,
    });
  }

  // === RANKING ENDPOINTS ===
  @Post('rankings')
  // @UseGuards(RolesGuard)
  // @Roles('admin', 'superadmin')
  @ApiOperation({ summary: 'Create a new ranking entry (Admin only)' })
  @ApiResponse({ status: 201, description: 'Ranking created successfully' })
  createRanking(@Body() createRankingDto: CreateRankingDto) {
    return this.analyticsService.createRanking(createRankingDto);
  }

  @Get('rankings')
  @ApiOperation({ summary: 'Get rankings' })
  @ApiQuery({ name: 'type', required: false, description: 'Filter by ranking type' })
  @ApiQuery({ name: 'userId', required: false, description: 'Filter by user ID' })
  @ApiQuery({ name: 'limit', required: false, description: 'Number of results', type: Number })
  @ApiResponse({ status: 200, description: 'Rankings retrieved successfully' })
  getRankings(
    @Query('type') type?: string,
    @Query('userId') userId?: string,
    @Query('limit') limit?: string,
  ) {
    return this.analyticsService.getRankings({
      type,
      userId,
      limit: limit ? parseInt(limit, 10) : undefined,
    });
  }

  @Get('rankings/top/:type')
  @ApiOperation({ summary: 'Get top users by ranking type' })
  @ApiParam({ name: 'type', description: 'Ranking type' })
  @ApiQuery({ name: 'limit', required: false, description: 'Number of results', type: Number })
  @ApiResponse({ status: 200, description: 'Top users retrieved successfully' })
  getTopUsersByType(
    @Param('type') type: string,
    @Query('limit') limit?: string,
  ) {
    return this.analyticsService.getTopUsersByType(type, limit ? parseInt(limit, 10) : undefined);
  }

  // === DASHBOARD ENDPOINTS ===
  @Get('dashboard')
  // @UseGuards(RolesGuard)
  // @Roles('admin', 'superadmin')
  @ApiOperation({ summary: 'Get dashboard metrics (Admin only)' })
  @ApiResponse({ status: 200, description: 'Dashboard metrics retrieved successfully' })
  getDashboardMetrics() {
    return this.analyticsService.getDashboardMetrics();
  }

  // === SPECIFIC ANALYTICS ENDPOINTS (Frontend compatibility) ===
  @Get('total-users')
  @ApiOperation({ summary: 'Get total users count' })
  @ApiResponse({ status: 200, description: 'Total users count retrieved successfully' })
  async getTotalUsers() {
    const metrics = await this.analyticsService.getDashboardMetrics();
    return { count: metrics.overview.totalUsers };
  }

  @Get('total-playlists')
  @ApiOperation({ summary: 'Get total playlists count' })
  @ApiResponse({ status: 200, description: 'Total playlists count retrieved successfully' })
  async getTotalPlaylists() {
    const metrics = await this.analyticsService.getDashboardMetrics();
    return { count: metrics.overview.totalPlaylists };
  }

  @Get('total-mundos')
  @ApiOperation({ summary: 'Get total mundos count' })
  @ApiResponse({ status: 200, description: 'Total mundos count retrieved successfully' })
  async getTotalMundos() {
    const metrics = await this.analyticsService.getDashboardMetrics();
    return { count: metrics.overview.totalMundos };
  }

  @Get('engagement')
  @ApiOperation({ summary: 'Get user engagement metrics' })
  @ApiQuery({ name: 'userId', required: false, description: 'Filter by user ID' })
  @ApiQuery({ name: 'startDate', required: false, description: 'Start date (ISO string)' })
  @ApiQuery({ name: 'endDate', required: false, description: 'End date (ISO string)' })
  @ApiResponse({ status: 200, description: 'Engagement metrics retrieved successfully' })
  getUserEngagementMetrics(
    @Query('userId') userId?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.analyticsService.getUserEngagementMetrics({
      userId,
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
    });
  }

  @Get('content/performance')
  // @UseGuards(RolesGuard)
  // @Roles('admin', 'superadmin')
  @ApiOperation({ summary: 'Get content performance metrics (Admin only)' })
  @ApiQuery({ name: 'startDate', required: false, description: 'Start date (ISO string)' })
  @ApiQuery({ name: 'endDate', required: false, description: 'End date (ISO string)' })
  @ApiQuery({ name: 'limit', required: false, description: 'Number of results', type: Number })
  @ApiResponse({ status: 200, description: 'Content performance metrics retrieved successfully' })
  getContentPerformanceMetrics(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('limit') limit?: string,
  ) {
    return this.analyticsService.getContentPerformanceMetrics({
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
      limit: limit ? parseInt(limit, 10) : undefined,
    });
  }

  // === VIDEO ENGAGEMENT ENDPOINTS (FASE 6.2) ===
  
  @Post('video-engagement/events')
  @ApiOperation({ summary: 'Registrar evento de engagement de video' })
  @ApiResponse({ status: 201, description: 'Evento de video registrado exitosamente' })
  createVideoEngagementEvent(@Body() eventDto: CreateVideoEngagementEventDto) {
    return this.analyticsService.createVideoEngagementEvent(eventDto);
  }

  @Get('video-engagement/metrics/:videoId')
  @ApiOperation({ summary: 'Obtener métricas de engagement para un video específico' })
  @ApiParam({ name: 'videoId', description: 'ID del video' })
  @ApiQuery({ name: 'startDate', required: false, description: 'Fecha de inicio (ISO string)' })
  @ApiQuery({ name: 'endDate', required: false, description: 'Fecha de fin (ISO string)' })
  @ApiQuery({ name: 'includeUserBreakdown', required: false, description: 'Incluir desglose por usuario', type: Boolean })
  @ApiResponse({ status: 200, description: 'Métricas de engagement obtenidas exitosamente', type: VideoEngagementMetricsDto })
  async getVideoEngagementMetrics(
    @Param('videoId') videoId: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('includeUserBreakdown') includeUserBreakdown?: string,
  ): Promise<VideoEngagementMetricsDto> {
    return this.analyticsService.calculateVideoEngagementMetrics(videoId, {
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
      includeUserBreakdown: includeUserBreakdown === 'true',
    });
  }

  @Get('video-engagement/report')
  @ApiOperation({ summary: 'Generar reporte de engagement de videos' })
  @ApiQuery({ name: 'videoIds', required: false, description: 'IDs de videos separados por coma' })
  @ApiQuery({ name: 'playlistId', required: false, description: 'ID de playlist' })
  @ApiQuery({ name: 'mundoId', required: false, description: 'ID de mundo' })
  @ApiQuery({ name: 'startDate', required: true, description: 'Fecha de inicio (ISO string)' })
  @ApiQuery({ name: 'endDate', required: true, description: 'Fecha de fin (ISO string)' })
  @ApiQuery({ name: 'includeUserBreakdown', required: false, description: 'Incluir desglose por usuario', type: Boolean })
  @ApiResponse({ status: 200, description: 'Reporte de engagement generado exitosamente', type: VideoEngagementReportDto })
  async generateVideoEngagementReport(
    @Query('videoIds') videoIds?: string,
    @Query('playlistId') playlistId?: string,
    @Query('mundoId') mundoId?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('includeUserBreakdown') includeUserBreakdown?: string,
  ): Promise<VideoEngagementReportDto> {
    if (!startDate || !endDate) {
      throw new Error('startDate and endDate are required');
    }

    return this.analyticsService.generateVideoEngagementReport({
      videoIds: videoIds ? videoIds.split(',') : undefined,
      playlistId,
      mundoId,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      includeUserBreakdown: includeUserBreakdown === 'true',
    });
  }

  // === DURATION DISCREPANCY ENDPOINTS ===
  
  @Get('duration-discrepancies')
  @ApiOperation({ summary: 'Obtener discrepancias históricas de duración de videos' })
  @ApiQuery({ name: 'videoItemId', required: false, description: 'ID del video específico' })
  @ApiQuery({ name: 'startDate', required: false, description: 'Fecha de inicio (ISO string)' })
  @ApiQuery({ name: 'endDate', required: false, description: 'Fecha de fin (ISO string)' })
  @ApiQuery({ name: 'limit', required: false, description: 'Número máximo de resultados', type: Number })
  @ApiResponse({ status: 200, description: 'Discrepancias históricas obtenidas exitosamente' })
  getHistoricalDurationDiscrepancies(
    @Query('videoItemId') videoItemId?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('limit') limit?: string,
  ) {
    return this.analyticsService.getHistoricalDurationDiscrepancies({
      videoItemId,
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
      limit: limit ? parseInt(limit, 10) : undefined,
    });
  }

  @Get('duration-discrepancies/stats')
  @ApiOperation({ summary: 'Obtener estadísticas de discrepancias de duración' })
  @ApiQuery({ name: 'startDate', required: false, description: 'Fecha de inicio (ISO string)' })
  @ApiQuery({ name: 'endDate', required: false, description: 'Fecha de fin (ISO string)' })
  @ApiResponse({ status: 200, description: 'Estadísticas de discrepancias obtenidas exitosamente' })
  getDurationDiscrepancyStats(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.analyticsService.getDurationDiscrepancyStats({
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
    });
  }

  // === PING ENDPOINT FOR DEBUGGING ===
  @Get('ping')
  @ApiOperation({ summary: 'Health check endpoint for analytics' })
  @ApiResponse({ status: 200, description: 'Analytics service is operational' })
  ping() {
    return { message: 'Analytics service is operational', timestamp: new Date().toISOString() };
  }

  // === TIME SERIES ENDPOINTS FOR FRONTEND ===
  @Get('users-created-over-time')
  @ApiOperation({ summary: 'Get users created over time' })
  @ApiQuery({ name: 'interval', required: false, description: 'Time interval (day, week, month)', enum: ['day', 'week', 'month'] })
  @ApiQuery({ name: 'startDate', required: false, description: 'Start date (ISO string)' })
  @ApiQuery({ name: 'endDate', required: false, description: 'End date (ISO string)' })
  @ApiResponse({ status: 200, description: 'Users created over time retrieved successfully' })
  async getUsersCreatedOverTime(
    @Query('interval') interval?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.analyticsService.getUsersCreatedOverTime({
      interval: interval || 'day',
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
    });
  }

  @Get('playlists-created-over-time')
  @ApiOperation({ summary: 'Get playlists created over time' })
  @ApiQuery({ name: 'interval', required: false, description: 'Time interval (day, week, month)', enum: ['day', 'week', 'month'] })
  @ApiQuery({ name: 'startDate', required: false, description: 'Start date (ISO string)' })
  @ApiQuery({ name: 'endDate', required: false, description: 'End date (ISO string)' })
  @ApiResponse({ status: 200, description: 'Playlists created over time retrieved successfully' })
  async getPlaylistsCreatedOverTime(
    @Query('interval') interval?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.analyticsService.getPlaylistsCreatedOverTime({
      interval: interval || 'day',
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
    });
  }

  @Get('mundos-created-over-time')
  @ApiOperation({ summary: 'Get mundos created over time' })
  @ApiQuery({ name: 'interval', required: false, description: 'Time interval (day, week, month)', enum: ['day', 'week', 'month'] })
  @ApiQuery({ name: 'startDate', required: false, description: 'Start date (ISO string)' })
  @ApiQuery({ name: 'endDate', required: false, description: 'End date (ISO string)' })
  @ApiResponse({ status: 200, description: 'Mundos created over time retrieved successfully' })
  async getMundosCreatedOverTime(
    @Query('interval') interval?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.analyticsService.getMundosCreatedOverTime({
      interval: interval || 'day',
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
    });
  }

  @Get('active-users-over-time')
  @ApiOperation({ summary: 'Get active users over time' })
  @ApiQuery({ name: 'interval', required: false, description: 'Time interval (day, week, month)', enum: ['day', 'week', 'month'] })
  @ApiQuery({ name: 'startDate', required: false, description: 'Start date (ISO string)' })
  @ApiQuery({ name: 'endDate', required: false, description: 'End date (ISO string)' })
  @ApiResponse({ status: 200, description: 'Active users over time retrieved successfully' })
  async getActiveUsersOverTime(
    @Query('interval') interval?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.analyticsService.getActiveUsersOverTime({
      interval: interval || 'day',
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
    });
  }

  // === TOP AND LEAST VIEWED ENDPOINTS ===

  @Get('top-viewed-playlists')
  @ApiOperation({ summary: 'Get top viewed playlists' })
  @ApiQuery({ name: 'limit', required: false, description: 'Number of results', type: Number })
  @ApiResponse({ status: 200, description: 'Top viewed playlists retrieved successfully' })
  async getTopViewedPlaylists(@Query('limit') limit?: string) {
    // Mock data - could be implemented with real analytics later
    const mockData = [
      { id: '33333333-3333-3333-3333-333333333333', name: 'Fundamentos de Gamificación', view_count: 150 },
      { id: '44444444-4444-4444-4444-444444444444', name: 'Técnicas Avanzadas', view_count: 120 },
      { id: '55555555-5555-5555-5555-555555555555', name: 'Evaluación y Métricas', view_count: 95 },
    ];
    
    const resultLimit = limit ? parseInt(limit, 10) : 10;
    return mockData.slice(0, resultLimit);
  }

  @Get('top-viewed-mundos')
  @ApiOperation({ summary: 'Get top viewed mundos' })
  @ApiQuery({ name: 'limit', required: false, description: 'Number of results', type: Number })
  @ApiResponse({ status: 200, description: 'Top viewed mundos retrieved successfully' })
  async getTopViewedMundos(@Query('limit') limit?: string) {
    // Mock data - could be implemented with real analytics later
    const mockData = [
      { id: '11111111-1111-1111-1111-111111111111', name: 'Gamificación Educativa', view_count: 450 },
      { id: '22222222-2222-2222-2222-222222222222', name: 'Análisis y Evaluación', view_count: 320 },
    ];
    
    const resultLimit = limit ? parseInt(limit, 10) : 10;
    return mockData.slice(0, resultLimit);
  }

  @Get('top-interacted-content')
  @ApiOperation({ summary: 'Get top interacted content' })
  @ApiQuery({ name: 'limit', required: false, description: 'Number of results', type: Number })
  @ApiResponse({ status: 200, description: 'Top interacted content retrieved successfully' })
  async getTopInteractedContent(@Query('limit') limit?: string) {
    // Mock data - could be implemented with real analytics later
    const mockData = [
      { id: '39', name: 'Introducción a la Gamificación', interaction_count: 85, content_type: 'playlist' },
      { id: '40', name: 'Elementos de Juego en Educación', interaction_count: 72, content_type: 'playlist' },
      { id: '41', name: 'Narrativa y Storytelling', interaction_count: 68, content_type: 'mundo' },
    ];
    
    const resultLimit = limit ? parseInt(limit, 10) : 10;
    return mockData.slice(0, resultLimit);
  }

  @Get('least-viewed-playlists')
  @ApiOperation({ summary: 'Get least viewed playlists' })
  @ApiQuery({ name: 'limit', required: false, description: 'Number of results', type: Number })
  @ApiResponse({ status: 200, description: 'Least viewed playlists retrieved successfully' })
  async getLeastViewedPlaylists(@Query('limit') limit?: string) {
    // Mock data - could be implemented with real analytics later
    const mockData = [
      { id: '55555555-5555-5555-5555-555555555555', name: 'Evaluación y Métricas', view_count: 15 },
      { id: '44444444-4444-4444-4444-444444444444', name: 'Técnicas Avanzadas', view_count: 28 },
    ];
    
    const resultLimit = limit ? parseInt(limit, 10) : 10;
    return mockData.slice(0, resultLimit);
  }

  @Get('least-viewed-mundos')
  @ApiOperation({ summary: 'Get least viewed mundos' })
  @ApiQuery({ name: 'limit', required: false, description: 'Number of results', type: Number })
  @ApiResponse({ status: 200, description: 'Least viewed mundos retrieved successfully' })
  async getLeastViewedMundos(@Query('limit') limit?: string) {
    // Mock data - could be implemented with real analytics later
    const mockData = [
      { id: '22222222-2222-2222-2222-222222222222', name: 'Análisis y Evaluación', view_count: 45 },
    ];
    
    const resultLimit = limit ? parseInt(limit, 10) : 10;
    return mockData.slice(0, resultLimit);
  }

  @Get('least-interacted-playlists')
  @ApiOperation({ summary: 'Get least interacted playlists' })
  @ApiQuery({ name: 'limit', required: false, description: 'Number of results', type: Number })
  @ApiResponse({ status: 200, description: 'Least interacted playlists retrieved successfully' })
  async getLeastInteractedPlaylists(@Query('limit') limit?: string) {
    // Mock data - could be implemented with real analytics later
    const mockData = [
      { id: '55555555-5555-5555-5555-555555555555', name: 'Evaluación y Métricas', interaction_count: 8, content_type: 'playlist' },
    ];
    
    const resultLimit = limit ? parseInt(limit, 10) : 10;
    return mockData.slice(0, resultLimit);
  }

  @Get('least-interacted-mundos')
  @ApiOperation({ summary: 'Get least interacted mundos' })
  @ApiQuery({ name: 'limit', required: false, description: 'Number of results', type: Number })
  @ApiResponse({ status: 200, description: 'Least interacted mundos retrieved successfully' })
  async getLeastInteractedMundos(@Query('limit') limit?: string) {
    // Mock data - could be implemented with real analytics later
    const mockData = [
      { id: '22222222-2222-2222-2222-222222222222', name: 'Análisis y Evaluación', interaction_count: 12, content_type: 'mundo' },
    ];
    
    const resultLimit = limit ? parseInt(limit, 10) : 10;
    return mockData.slice(0, resultLimit);
  }
} 