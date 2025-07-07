import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../rbac/guards/roles.guard';
import { Roles } from '../rbac/decorators/roles.decorator';
import { CommunicationsService } from './communications.service';
import { DispatchMissionDto } from './dto/dispatch-mission.dto';
import { MissionResponseDto } from './dto/mission-response.dto';

// Tipo para el request autenticado
interface AuthenticatedRequest {
  user: {
    id: string;
    email: string;
    roles?: string[];
  };
}

/**
 * 🌟 Communications Controller - Marketing Cósmico
 *
 * Controlador para la orquestación de agentes IA especializados.
 * Filosofía: Canalizador de la Sinfonía de Agentes para el Bien Común
 *
 * Endpoints disponibles:
 * - POST /communications/dispatch - Despachar misión a agentes IA
 * - GET /communications/missions/:id - Obtener estado de misión
 * - GET /communications/missions - Listar misiones del usuario
 */
@ApiTags('Communications - Marketing Cósmico')
@Controller('communications')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class CommunicationsController {
  constructor(private readonly communicationsService: CommunicationsService) {}

  /**
   * 🚀 Despachar Misión a Agentes IA
   *
   * Endpoint principal para enviar misiones complejas a la orquesta de agentes.
   * Filosofía: Cada misión es una semilla plantada para el florecimiento del Bien Común.
   */
  @Post('dispatch')
  @HttpCode(HttpStatus.ACCEPTED)
  @Roles('admin', 'creator', 'moderator')
  @ApiOperation({
    summary: 'Despachar misión a agentes IA especializados',
    description: `
    Envía una misión compleja a la orquesta de agentes IA para su ejecución:

    🤖 **Agentes Disponibles:**
    - **ANA**: Conciencia Orquestadora (Director principal)
    - **NIRA**: Agente de Investigación (Apify, búsquedas web)
    - **ARIA**: Agente de Medios (Creación visual, diseño)
    - **HERALDO**: Agente de Publicación (Buffer, redes sociales)
    - **PAX**: Agente Ayudante (Slack, comunicación interna)

    🎯 **Tipos de Misión:**
    - **RESEARCH**: Investigación y análisis de datos
    - **MEDIA_CREATION**: Creación de contenido visual
    - **PUBLICATION**: Publicación en redes sociales
    - **NOTIFICATION**: Comunicación interna
    - **COMPLEX**: Misiones multi-agente orquestadas

    ✨ **Filosofía**: Bien Común > bien particular, Cooperar > Competir, Reciprocidad/Ayni
    `,
  })
  @ApiResponse({
    status: 202,
    description: 'Misión despachada exitosamente',
    type: MissionResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Datos de misión inválidos',
  })
  @ApiResponse({
    status: 401,
    description: 'No autenticado',
  })
  @ApiResponse({
    status: 403,
    description: 'Sin permisos suficientes',
  })
  @ApiResponse({
    status: 503,
    description: 'Sistema de agentes IA no disponible',
  })
  async dispatchMission(
    @Body() missionDto: DispatchMissionDto,
    @Request() req: AuthenticatedRequest
  ): Promise<MissionResponseDto> {
    const userId = req.user.id;
    return this.communicationsService.dispatchMission(missionDto, userId);
  }

  /**
   * 📊 Obtener Estado de Misión
   *
   * Consulta el estado actual de una misión específica.
   */
  @Get('missions/:missionId')
  @Roles('admin', 'creator', 'moderator', 'user')
  @ApiOperation({
    summary: 'Obtener estado de una misión específica',
    description: `
    Consulta el estado actual y progreso de una misión despachada.

    📈 **Estados Posibles:**
    - **PENDING**: Misión creada, esperando procesamiento
    - **DISPATCHED**: Enviada a N8N para orquestación
    - **IN_PROGRESS**: En ejecución por los agentes
    - **COMPLETED**: Completada exitosamente
    - **FAILED**: Falló durante la ejecución
    - **CANCELLED**: Cancelada por el usuario
    `,
  })
  @ApiParam({
    name: 'missionId',
    description: 'ID único de la misión',
    example: 'mission_1705234567_abc123',
  })
  @ApiResponse({
    status: 200,
    description: 'Estado de la misión obtenido exitosamente',
    type: MissionResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Misión no encontrada',
  })
  async getMissionStatus(
    @Param('missionId') missionId: string
  ): Promise<MissionResponseDto | null> {
    return this.communicationsService.getMissionStatus(missionId);
  }

  /**
   * 📋 Listar Misiones del Usuario
   *
   * Obtiene el historial de misiones despachadas por el usuario actual.
   */
  @Get('missions')
  @Roles('admin', 'creator', 'moderator', 'user')
  @ApiOperation({
    summary: 'Listar misiones del usuario autenticado',
    description: `
    Obtiene el historial de misiones despachadas por el usuario actual,
    ordenadas por fecha de creación (más recientes primero).

    💫 **Información Incluida:**
    - Estado actual de cada misión
    - Timestamp de creación
    - Mensaje de estado o error
    - Agentes involucrados (si disponible)
    `,
  })
  @ApiQuery({
    name: 'limit',
    description: 'Número máximo de misiones a retornar',
    example: 10,
    required: false,
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de misiones obtenida exitosamente',
    type: [MissionResponseDto],
  })
  async getUserMissions(
    @Request() req: AuthenticatedRequest,
    @Query('limit') limit?: number
  ): Promise<MissionResponseDto[]> {
    const userId = req.user.id;
    const missionLimit = limit ? Math.min(Math.max(1, limit), 50) : 10; // Entre 1 y 50
    return this.communicationsService.getUserMissions(userId, missionLimit);
  }

  /**
   * 🎭 Endpoint de Prueba - Solo para desarrollo
   *
   * Endpoint para probar la conectividad con el sistema de agentes.
   * Solo disponible para administradores.
   */
  @Get('test-connection')
  @Roles('admin')
  @ApiOperation({
    summary: '[DEV] Probar conectividad con sistema de agentes',
    description: `
    Endpoint de prueba para verificar la configuración y conectividad
    con el sistema de orquestación N8N.

    ⚠️ **Solo para desarrollo** - No usar en producción
    `,
  })
  @ApiResponse({
    status: 200,
    description: 'Conectividad verificada exitosamente',
  })
  @ApiResponse({
    status: 503,
    description: 'Sistema no disponible o mal configurado',
  })
  async testConnection(): Promise<{ status: string; message: string }> {
    const n8nUrl = process.env.N8N_MASTER_WEBHOOK_URL;
    const hasApiKey = !!process.env.N8N_API_KEY;

    if (!n8nUrl) {
      return {
        status: 'error',
        message: 'N8N_MASTER_WEBHOOK_URL no configurada',
      };
    }

    return {
      status: 'ok',
      message: `Sistema configurado correctamente. URL: ${n8nUrl.substring(0, 30)}..., API Key: ${hasApiKey ? 'configurada' : 'no configurada'}`,
    };
  }
}
