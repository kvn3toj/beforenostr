import {
  Controller,
  Post,
  Get,
  Patch,
  Body,
  Param,
  Query,
  UseGuards,
  Req,
  HttpCode,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request } from 'express';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { FeedbackService } from './feedback.service.js.js';
import { CreateFeedbackDto } from './dto/create-feedback.dto.js.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js.js';
import { RolesGuard } from '@/rbac/guards/roles.guard';
import { Roles } from '@/rbac/decorators/roles.decorator';

interface AuthenticatedRequest extends Request {
  user: {
    id: string;
    email: string;
    name?: string;
  };
}

@ApiTags('🔮 Feedback - Oráculo de CoomÜnity')
@ApiBearerAuth()
@Controller('feedback')
@UseGuards(JwtAuthGuard, RolesGuard)
export class FeedbackController {
  private readonly logger = new Logger(FeedbackController.name);

  constructor(private readonly feedbackService: FeedbackService) {}

  @Post()
  @Roles('admin') // Solo los administradores pueden usar el Oráculo
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Enviar feedback desde el Oráculo de CoomÜnity',
    description:
      'Endpoint exclusivo para que el agente Oráculo reporte feedback detectado automáticamente en la plataforma',
  })
  @ApiResponse({
    status: 201,
    description: 'Feedback enviado exitosamente al sistema de la CoP Oráculo.',
    schema: {
      example: {
        id: 'cuid_123456789',
        userId: 'admin_user_id',
        pageUrl: 'http://localhost:3001/uplay/video/123',
        feedbackText: 'El reproductor de video presenta latencia en la carga',
        feedbackType: 'PERFORMANCE',
        status: 'PENDING',
        priority: 3,
        tags: ['video-player', 'performance'],
        createdAt: '2025-06-20T12:35:00Z',
        user: {
          id: 'admin_user_id',
          email: 'admin@coomunity.com',
          name: 'Administrador Oráculo',
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'No autorizado - Token JWT inválido',
  })
  @ApiResponse({
    status: 403,
    description: 'Prohibido - Solo administradores pueden usar el Oráculo',
  })
  async submitFeedback(
    @Body() createFeedbackDto: CreateFeedbackDto,
    @Req() req: AuthenticatedRequest
  ) {
    this.logger.log(
      `🔮 [ORÁCULO-CONTROLLER] Recibiendo feedback de admin: ${req.user.email}`
    );
    this.logger.log(
      `🔮 [ORÁCULO-CONTROLLER] Tipo: ${createFeedbackDto.feedbackType} | URL: ${createFeedbackDto.pageUrl}`
    );

    const adminUserId = req.user.id;
    const feedback = await this.feedbackService.create(
      createFeedbackDto,
      adminUserId
    );

    this.logger.log(
      `✅ [ORÁCULO-CONTROLLER] Feedback procesado exitosamente: ${feedback.id}`
    );
    return feedback;
  }

  @Get()
  @Roles('admin') // Solo administradores pueden ver todos los feedbacks
  @ApiOperation({
    summary: 'Obtener todos los feedbacks de la CoP Oráculo',
    description:
      'Lista paginada de feedbacks con filtros opcionales para la gestión en la CoP',
  })
  @ApiQuery({
    name: 'status',
    required: false,
    description: 'Filtrar por estado del feedback',
  })
  @ApiQuery({
    name: 'feedbackType',
    required: false,
    description: 'Filtrar por tipo de feedback',
  })
  @ApiQuery({
    name: 'priority',
    required: false,
    type: Number,
    description: 'Filtrar por prioridad (0-5)',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Límite de resultados (default: 50)',
  })
  @ApiQuery({
    name: 'offset',
    required: false,
    type: Number,
    description: 'Offset para paginación (default: 0)',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de feedbacks obtenida exitosamente',
    schema: {
      type: 'array',
      items: {
        example: {
          id: 'cuid_123456789',
          pageUrl: 'http://localhost:3001/uplay',
          feedbackText: 'Problema detectado',
          feedbackType: 'BUG',
          status: 'PENDING',
          priority: 2,
          createdAt: '2025-06-20T12:35:00Z',
          user: { email: 'admin@coomunity.com' },
        },
      },
    },
  })
  async getAllFeedbacks(
    @Query('status') status?: string,
    @Query('feedbackType') feedbackType?: string,
    @Query('priority') priority?: number,
    @Query('limit') limit?: number,
    @Query('offset') offset?: number
  ) {
    this.logger.log(`🔍 [ORÁCULO-CONTROLLER] Obteniendo feedbacks con filtros`);

    const filters = {
      status,
      feedbackType,
      priority,
      limit,
      offset,
    };

    const feedbacks = await this.feedbackService.findAll(filters);

    this.logger.log(
      `📋 [ORÁCULO-CONTROLLER] Devolviendo ${feedbacks.length} feedbacks`
    );
    return feedbacks;
  }

  @Get('stats')
  @Roles('admin')
  @ApiOperation({
    summary: 'Obtener estadísticas de feedbacks para la CoP Oráculo',
    description: 'Métricas agregadas para gamificación y dashboards de la CoP',
  })
  @ApiResponse({
    status: 200,
    description: 'Estadísticas de feedbacks obtenidas exitosamente',
    schema: {
      example: {
        total: 25,
        byStatus: {
          PENDING: 15,
          INVESTIGATING: 5,
          RESOLVED: 5,
        },
        byType: {
          BUG: 10,
          IMPROVEMENT: 8,
          UI_UX: 5,
          PERFORMANCE: 2,
        },
        byPriority: {
          priority_0: 3,
          priority_1: 5,
          priority_2: 8,
          priority_3: 6,
          priority_4: 2,
          priority_5: 1,
        },
      },
    },
  })
  async getFeedbackStats() {
    this.logger.log(`📊 [ORÁCULO-CONTROLLER] Generando estadísticas para CoP`);

    const stats = await this.feedbackService.getStats();

    this.logger.log(
      `📈 [ORÁCULO-CONTROLLER] Estadísticas generadas exitosamente`
    );
    return stats;
  }

  @Get(':id')
  @Roles('admin')
  @ApiOperation({
    summary: 'Obtener un feedback específico por ID',
    description: 'Detalles completos de un feedback para gestión en la CoP',
  })
  @ApiParam({ name: 'id', description: 'ID único del feedback' })
  @ApiResponse({
    status: 200,
    description: 'Feedback encontrado exitosamente',
    schema: {
      example: {
        id: 'cuid_123456789',
        pageUrl: 'http://localhost:3001/uplay/video/123',
        feedbackText: 'Descripción detallada del feedback',
        feedbackType: 'BUG',
        status: 'PENDING',
        priority: 3,
        componentContext: 'VideoPlayer -> PlayButton',
        technicalContext: {
          userAgent: 'Mozilla/5.0...',
          screenResolution: '1920x1080',
        },
        tags: ['video-player', 'critical'],
        createdAt: '2025-06-20T12:35:00Z',
        user: {
          email: 'admin@coomunity.com',
          name: 'Administrador',
        },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Feedback no encontrado' })
  async getFeedbackById(@Param('id') id: string) {
    this.logger.log(`🔍 [ORÁCULO-CONTROLLER] Obteniendo feedback: ${id}`);

    const feedback = await this.feedbackService.findOne(id);

    if (!feedback) {
      this.logger.warn(`⚠️ [ORÁCULO-CONTROLLER] Feedback no encontrado: ${id}`);
      return { message: 'Feedback no encontrado' };
    }

    this.logger.log(
      `✅ [ORÁCULO-CONTROLLER] Feedback encontrado: ${feedback.id}`
    );
    return feedback;
  }

  @Patch(':id/status')
  @Roles('admin')
  @ApiOperation({
    summary: 'Actualizar el estado de un feedback',
    description:
      'Cambiar el estado de un feedback para gestión del flujo en la CoP',
  })
  @ApiParam({ name: 'id', description: 'ID único del feedback' })
  @ApiResponse({
    status: 200,
    description: 'Estado del feedback actualizado exitosamente',
  })
  @ApiResponse({ status: 404, description: 'Feedback no encontrado' })
  async updateFeedbackStatus(
    @Param('id') id: string,
    @Body('status') status: string,
    @Req() req: AuthenticatedRequest
  ) {
    this.logger.log(
      `🔄 [ORÁCULO-CONTROLLER] Admin ${req.user.email} actualizando status de ${id} a: ${status}`
    );

    const updatedFeedback = await this.feedbackService.updateStatus(id, status);

    this.logger.log(
      `✅ [ORÁCULO-CONTROLLER] Status actualizado exitosamente: ${updatedFeedback.id}`
    );
    return updatedFeedback;
  }

  @Get('health/check')
  @ApiOperation({
    summary: 'Health check del módulo feedback',
    description:
      'Endpoint para verificar que el módulo de feedback está funcionando correctamente',
  })
  @ApiResponse({
    status: 200,
    description: 'Módulo funcionando correctamente',
    schema: {
      example: {
        status: 'ok',
        module: 'feedback',
        message: 'Oráculo de CoomÜnity operacional',
        timestamp: '2025-06-20T12:35:00Z',
      },
    },
  })
  healthCheck() {
    this.logger.log(`💚 [ORÁCULO-CONTROLLER] Health check ejecutado`);

    return {
      status: 'ok',
      module: 'feedback',
      message: 'Oráculo de CoomÜnity operacional ✨',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
    };
  }
}
