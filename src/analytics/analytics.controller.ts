import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  Param,
  // UseGuards,
} from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { CreateAnalyticsDataDto } from './dto/create-analytics-data.dto';
import { CreateReportDto } from './dto/create-report.dto';
import { CreateRankingDto } from './dto/create-ranking.dto';
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
  constructor(private readonly analyticsService: AnalyticsService) {
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

  @Get('ping')
  @ApiOperation({ summary: 'Health check for analytics module' })
  @ApiResponse({ status: 200, description: 'Analytics module is working' })
  ping() {
    return this.analyticsService.ping();
  }
} 