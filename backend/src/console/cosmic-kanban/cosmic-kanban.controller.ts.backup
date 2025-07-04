/**
 * 🌌 Cosmic Kanban Controller
 * Portal Kanban Cósmico para gestión de high-value memes
 * Basado en filosofía CoomÜnity: Ayni, Bien Común, y los 12 Guardianes Digitales
 */

import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  HttpStatus,
  HttpCode,
  Headers,
  UnauthorizedException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../rbac/guards/roles.guard';
import { Roles } from '../../rbac/decorators/roles.decorator';
import { CosmicKanbanService } from './cosmic-kanban.service';
import { CreateCosmicTaskDto } from './dto/create-cosmic-task.dto';
import { UpdateCosmicTaskDto } from './dto/update-cosmic-task.dto';
import { CosmicTaskResponseDto } from './dto/cosmic-task.response.dto';

@ApiTags('cosmic-kanban')
@Controller('cosmic-kanban')
export class CosmicKanbanController {
  constructor(private readonly cosmicKanbanService: CosmicKanbanService) {}

  /**
   * Endpoint para webhooks que permite la sincronización automática desde sistemas externos
   * Este endpoint NO usa JWT y está protegido por un token secreto para permitir llamadas desde CI/CD
   */
  @Post('webhook/sync')
  @ApiOperation({ summary: 'Endpoint para webhooks que permite la sincronización automática desde sistemas externos' })
  @ApiResponse({ status: 201, description: 'Sincronización exitosa' })
  async webhookSync(@Body() payload: any, @Headers('x-webhook-token') token: string) {
    // Verificar token de seguridad
    const webhookToken = process.env.COSMIC_KANBAN_WEBHOOK_TOKEN || 'cosmic-kanban-secret-token';

    if (token !== webhookToken) {
      throw new UnauthorizedException('Token de webhook inválido');
    }

    console.log(`[CosmicKanban] Webhook recibido: ${JSON.stringify(payload)}`);

    // Procesar el evento según su tipo
    if (payload.event === 'code_push' || payload.event === 'pull_request_merged') {
      return this.cosmicKanbanService.syncProjectStatus();
    }

    // Para otros tipos de eventos, podemos implementar lógicas específicas
    return { message: 'Webhook recibido, pero no se requirió sincronización' };
  }

  // Resto de endpoints que SÍ requieren autenticación JWT
  @Post('tasks')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @Roles('admin', 'gamifier')
  @ApiOperation({
    summary: 'Crear nueva tarea cósmica',
    description: 'Manifestar un nuevo high-value meme en el Portal Kanban Cósmico'
  })
  @ApiResponse({
    status: 201,
    description: 'Tarea cósmica creada exitosamente',
    type: CosmicTaskResponseDto
  })
  @HttpCode(HttpStatus.CREATED)
  async createTask(@Body() createTaskDto: CreateCosmicTaskDto): Promise<CosmicTaskResponseDto> {
    return this.cosmicKanbanService.createTask(createTaskDto);
  }

  @Get('tasks')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @Roles('admin', 'gamifier', 'user')
  @ApiOperation({
    summary: 'Obtener todas las tareas cósmicas',
    description: 'Acceder a la sabiduría del Portal Kanban Cósmico'
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de tareas cósmicas',
    type: [CosmicTaskResponseDto]
  })
  async getAllTasks(
    @Query('guardian') guardian?: string,
    @Query('element') element?: string,
    @Query('status') status?: string,
    @Query('phase') phase?: number,
  ): Promise<CosmicTaskResponseDto[]> {
    return this.cosmicKanbanService.getAllTasks({ guardian, element, status, phase });
  }

  @Get('tasks/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @Roles('admin', 'gamifier', 'user')
  @ApiOperation({
    summary: 'Obtener tarea cósmica específica',
    description: 'Contemplar los detalles de un high-value meme específico'
  })
  @ApiResponse({
    status: 200,
    description: 'Tarea cósmica encontrada',
    type: CosmicTaskResponseDto
  })
  async getTaskById(@Param('id') id: string): Promise<CosmicTaskResponseDto> {
    return this.cosmicKanbanService.getTaskById(id);
  }

  @Put('tasks/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @Roles('admin', 'gamifier')
  @ApiOperation({
    summary: 'Actualizar tarea cósmica',
    description: 'Evolucionar un high-value meme en el Portal Kanban Cósmico'
  })
  @ApiResponse({
    status: 200,
    description: 'Tarea cósmica actualizada exitosamente',
    type: CosmicTaskResponseDto
  })
  async updateTask(
    @Param('id') id: string,
    @Body() updateTaskDto: UpdateCosmicTaskDto,
  ): Promise<CosmicTaskResponseDto> {
    return this.cosmicKanbanService.updateTask(id, updateTaskDto);
  }

  @Delete('tasks/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @Roles('admin')
  @ApiOperation({
    summary: 'Eliminar tarea cósmica',
    description: 'Transmuar un high-value meme del Portal Kanban Cósmico'
  })
  @ApiResponse({
    status: 204,
    description: 'Tarea cósmica eliminada exitosamente'
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteTask(@Param('id') id: string): Promise<void> {
    return this.cosmicKanbanService.deleteTask(id);
  }

  @Get('stats')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @Roles('admin', 'gamifier')
  @ApiOperation({
    summary: 'Estadísticas del Portal Kanban Cósmico',
    description: 'Métricas de manifestación de high-value memes por Guardián y Elemento'
  })
  @ApiResponse({
    status: 200,
    description: 'Estadísticas cósmicas'
  })
  async getCosmicStats() {
    return this.cosmicKanbanService.getCosmicStats();
  }

  @Get('project-status')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @Roles('admin', 'gamifier')
  @ApiOperation({
    summary: 'Estado actual del proyecto CoomÜnity',
    description: 'Obtener información completa sobre el estado de desarrollo de SuperApp y Gamifier'
  })
  @ApiResponse({
    status: 200,
    description: 'Estado del proyecto actualizado'
  })
  async getProjectStatus() {
    return this.cosmicKanbanService.getProjectStatus();
  }

  /**
   * Sincroniza el estado del proyecto y genera tareas automáticamente
   */
  @Post('sync-project-status')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @Roles('admin')
  @ApiOperation({ summary: 'Sincroniza el estado del proyecto y genera tareas automáticamente' })
  @ApiResponse({ status: 201, description: 'Sincronización exitosa' })
  async syncProjectStatus() {
    return this.cosmicKanbanService.syncProjectStatus();
  }

  @Get('debug')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @Roles('admin', 'gamifier')
  @ApiOperation({
    summary: 'DEBUG: Ver todas las challenges en la BD',
    description: 'Endpoint temporal para debugging'
  })
  async debugAllChallenges() {
    return this.cosmicKanbanService.debugAllChallenges();
  }

  @Post('purify-thor-legacy')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @Roles('admin')
  @ApiOperation({
    summary: '🌟 GRAN PURIFICACIÓN CÓSMICA - Migrar tareas THOR Legacy',
    description: 'Transforma el caos creativo en orden fractal asignando Guardianes correctos a todas las tareas THOR Legacy según la arquitectura fractal'
  })
  @ApiResponse({
    status: 201,
    description: 'Purificación cósmica completada exitosamente',
    schema: {
      type: 'object',
      properties: {
        migrated: { type: 'number', description: 'Número de tareas migradas' },
        errors: { type: 'array', items: { type: 'string' }, description: 'Lista de errores ocurridos' },
        summary: { type: 'object', description: 'Resumen de asignaciones por Guardián' }
      }
    }
  })
  @HttpCode(HttpStatus.CREATED)
  async purifyThorLegacyTasks() {
    return this.cosmicKanbanService.purifyThorLegacyTasks();
  }
}
