/**
 * 🎭 Stages Controller - Customer Journey Management
 *
 * Controller para gestión de los 4 STAGES del customer journey
 * (BUYER → SEEKER → SOLVER → PROMOTER)
 */

import {
  Controller,
  Get,
  Put,
  Post,
  Param,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { StagesService } from './stages.service.js.js';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard.js.js';
import { RolesGuard } from '@/rbac/guards/roles.guard';
import { Roles } from '@/rbac/decorators/roles.decorator';
import { UpdateStageDto } from './dto/update-stage.dto.js.js';
import {
  StageConfigurationDto,
  StageAnalyticsDto,
  UserProgressionDto,
  ProgressActionResultDto,
} from './dto/stage-response.dto.js.js';
import { AuthenticatedRequest } from '../../types/auth.types.js.js';

@ApiTags('stages')
@Controller('console/stages')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class StagesController {
  constructor(private readonly stagesService: StagesService) {}

  /**
   * 📊 Get all stages with analytics
   */
  @Get()
  @Roles('admin', 'moderator')
  @ApiOperation({
    summary: 'Obtener todos los stages con métricas',
    description: 'Lista completa de stages del customer journey con analytics',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de stages con métricas',
    schema: { type: 'object', additionalProperties: true },
  })
  async getAllStages(): Promise<unknown> {
    return this.stagesService.getAllStages();
  }

  /**
   * 🔍 Get specific stage data
   */
  @Get(':stageId')
  @Roles('admin', 'moderator')
  @ApiOperation({
    summary: 'Obtener datos específicos de un stage',
    description: 'Información detallada de un stage específico',
  })
  @ApiResponse({
    status: 200,
    description: 'Datos del stage solicitado',
    schema: { type: 'object', additionalProperties: true },
  })
  async getStageById(@Param('stageId') stageId: string): Promise<unknown> {
    return this.stagesService.getStageById(stageId);
  }

  /**
   * ✏️ Update stage configuration
   */
  @Put(':stageId')
  @Roles('admin')
  @ApiOperation({
    summary: 'Actualizar configuración de stage',
    description: 'Modificar la configuración de un stage específico',
  })
  @ApiResponse({
    status: 200,
    description: 'Stage actualizado exitosamente',
    schema: { type: 'object', additionalProperties: true },
  })
  async updateStage(
    @Param('stageId') stageId: string,
    @Body() data: UpdateStageDto
  ): Promise<unknown> {
    return this.stagesService.updateStage(stageId, data);
  }

  /**
   * 📈 Get stage analytics
   */
  @Get(':stageId/analytics')
  @Roles('admin', 'moderator')
  @ApiOperation({
    summary: 'Obtener analytics de un stage',
    description: 'Métricas detalladas y analytics de un stage específico',
  })
  @ApiResponse({
    status: 200,
    description: 'Analytics del stage',
    schema: { type: 'object', additionalProperties: true },
  })
  async getStageAnalytics(@Param('stageId') stageId: string): Promise<unknown> {
    return this.stagesService.getStageAnalytics(stageId);
  }

  /**
   * 🎯 Check user progression status
   */
  @Get('user/:userId/progression')
  @Roles('admin', 'moderator')
  @ApiOperation({
    summary: 'Verificar progresión de un usuario específico',
    description: 'Estado de progresión de un usuario en el customer journey',
  })
  @ApiResponse({
    status: 200,
    description: 'Estado de progresión del usuario',
    schema: { type: 'object', additionalProperties: true },
  })
  async checkUserProgression(
    @Param('userId') userId: string
  ): Promise<unknown> {
    return this.stagesService.checkUserProgression(userId);
  }

  /**
   * ⬆️ Progress user to next stage
   */
  @Post('user/:userId/progress')
  @Roles('admin')
  @ApiOperation({
    summary: 'Progresar usuario al siguiente stage',
    description: 'Mover un usuario al siguiente stage del customer journey',
  })
  @ApiResponse({
    status: 201,
    description: 'Usuario progresado exitosamente',
    schema: { type: 'object', additionalProperties: true },
  })
  async progressUser(@Param('userId') userId: string): Promise<unknown> {
    return this.stagesService.progressUserToNextStage(userId);
  }

  /**
   * 👤 Check current user's progression (for user-facing endpoints)
   */
  @Get('me/progression')
  @Roles('user', 'admin', 'moderator')
  @ApiOperation({
    summary: 'Verificar progresión del usuario actual',
    description:
      'Estado de progresión del usuario autenticado en el customer journey',
  })
  @ApiResponse({
    status: 200,
    description: 'Estado de progresión del usuario actual',
    schema: { type: 'object', additionalProperties: true },
  })
  async checkMyProgression(
    @Request() req: AuthenticatedRequest
  ): Promise<unknown> {
    return this.stagesService.checkUserProgression(req.user.sub);
  }

  /**
   * 🚀 Progress current user to next stage (self-service)
   */
  @Post('me/progress')
  @Roles('user', 'admin', 'moderator')
  @ApiOperation({
    summary: 'Auto-progresar al siguiente stage',
    description:
      'Permitir al usuario progresarse a sí mismo al siguiente stage',
  })
  @ApiResponse({
    status: 201,
    description: 'Usuario progresado exitosamente',
    schema: { type: 'object', additionalProperties: true },
  })
  async progressMe(@Request() req: AuthenticatedRequest): Promise<unknown> {
    return this.stagesService.progressUserToNextStage(req.user.sub);
  }
}
