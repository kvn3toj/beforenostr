import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../rbac/guards/roles.guard';
import { Roles } from '../rbac/decorators/roles.decorator';
import { FeedbackService } from './feedback.service';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { UpdateFeedbackDto } from './dto/update-feedback.dto';
import { FeedbackStatus, FeedbackType } from '../generated/prisma';

@Controller('feedback')
@UseGuards(JwtAuthGuard)
export class FeedbackController {
  constructor(private readonly feedbackService: FeedbackService) {}

  /**
   * Crear un nuevo reporte de feedback
   * POST /feedback
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createFeedbackDto: CreateFeedbackDto, @Request() req) {
    try {
      console.log('🤖 Feedback creation request received:', {
        dto: createFeedbackDto,
        user: req.user
      });

      const userId = req.user.sub || req.user.id;
      console.log('🔑 Extracted userId:', userId);

      const result = await this.feedbackService.create(createFeedbackDto, userId);
      console.log('✅ Feedback created successfully:', result.id);

      return result;
    } catch (error) {
      console.error('❌ Error in feedback creation:', error);
      throw error;
    }
  }

  /**
   * Obtener todos los reportes de feedback (con filtros)
   * GET /feedback?status=SUBMITTED&type=BUG&limit=20&offset=0
   */
  @Get()
  async findAll(
    @Query('status') status?: FeedbackStatus,
    @Query('type') type?: FeedbackType,
    @Query('userId') userId?: string,
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
  ) {
    return this.feedbackService.findAll({
      status,
      type,
      userId,
      limit: limit ? parseInt(limit, 10) : undefined,
      offset: offset ? parseInt(offset, 10) : undefined,
    });
  }

  /**
   * Endpoint de ping para verificar que el módulo funciona
   * GET /feedback/ping
   */
  @Get('ping')
  @HttpCode(HttpStatus.OK)
  ping() {
    return {
      message: '🤖 Feedback Agent Module is running',
      timestamp: new Date().toISOString(),
      status: 'operational',
    };
  }

  /**
   * Obtener estadísticas de feedback (solo admins)
   * GET /feedback/stats
   */
  @Get('stats')
  @UseGuards(RolesGuard)
  @Roles('admin')
  async getStats() {
    return this.feedbackService.getStats();
  }

  /**
   * Obtener reportes del usuario actual
   * GET /feedback/me
   */
  @Get('me')
  async findMyReports(@Request() req) {
    const userId = req.user.sub || req.user.id;
    return this.feedbackService.findAll({ userId });
  }

  /**
   * Obtener un reporte específico por ID
   * GET /feedback/:id
   */
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.feedbackService.findOne(id);
  }

  /**
   * Actualizar un reporte de feedback (solo admins)
   * PATCH /feedback/:id
   */
  @Patch(':id')
  @UseGuards(RolesGuard)
  @Roles('admin')
  async update(
    @Param('id') id: string,
    @Body() updateFeedbackDto: UpdateFeedbackDto,
    @Request() req,
  ) {
    const adminUserId = req.user.sub || req.user.id;
    return this.feedbackService.update(id, updateFeedbackDto, adminUserId);
  }

  /**
   * Eliminar un reporte de feedback
   * DELETE /feedback/:id
   */
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string, @Request() req) {
    const userId = req.user.sub || req.user.id;
    const userRoles = req.user.roles || [];
    const isAdmin = userRoles.includes('admin');

    await this.feedbackService.remove(id, userId, isAdmin);
  }

}
