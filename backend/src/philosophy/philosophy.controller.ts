import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Logger,
  Inject,
  HttpStatus,
  Delete,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiBody,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js.js';
import { RolesGuard } from '../rbac/guards/roles.guard.js.js';
import { Roles } from '../rbac/decorators/roles.decorator.js.js';
import { PhilosophyService } from './philosophy.service.js.js';
import {
  HambreMetricDto,
  UpdateHambreDto,
  IEAReciprocidadDto,
  PhilosophyMetricsResponseDto,
} from './dto/philosophy.dto.js.js';

/**
 * 🌌 ATLAS: Controlador del Backend Sagrado para Métricas Filosóficas
 *
 * Endpoints RESTful para la Consola de Experiencias del Gamifier Admin.
 * Proporciona acceso a las métricas fundamentales de CoomÜnity:
 * - HambrE (impulso evolutivo)
 * - IEA (Índice de Equilibrio de Reciprocidad)
 *
 * Conexión directa: MIRA (Gamifier Admin Frontend)
 * Audiencia: HumanWäre (equipo de administradores)
 */
@ApiTags('philosophy')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('philosophy')
export class PhilosophyController {
  private readonly logger = new Logger(PhilosophyController.name);

  constructor(
    @Inject(PhilosophyService)
    private readonly philosophyService: PhilosophyService
  ) {
    this.logger.log(
      '🌌 PhilosophyController CONSTRUCTOR: Activando endpoints de la Consola de Experiencias...'
    );
  }

  /**
   * 📊 Obtener todas las métricas filosóficas
   * Endpoint principal para la Consola de Experiencias
   */
  @Get('metrics')
  @Roles('admin', 'moderator')
  @ApiOperation({
    summary: 'Obtener métricas filosóficas completas',
    description:
      'Endpoint principal para la Consola de Experiencias del Gamifier Admin. Retorna HambrE e IEA de Reciprocidad.',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Métricas filosóficas obtenidas exitosamente',
    type: PhilosophyMetricsResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Token de autenticación requerido',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Permisos insuficientes (requiere admin o moderator)',
  })
  async getPhilosophyMetrics(): Promise<PhilosophyMetricsResponseDto> {
    this.logger.log(
      '📊 GET /philosophy/metrics - Solicitando métricas completas...'
    );

    try {
      const metrics = await this.philosophyService.getPhilosophyMetrics();

      this.logger.log('✅ Métricas filosóficas enviadas al Gamifier Admin');
      return metrics;
    } catch (error) {
      this.logger.error('❌ Error en GET /philosophy/metrics:', error);
      throw error;
    }
  }

  /**
   * 🔥 Obtener métricas específicas de HambrE
   */
  @Get('hambre')
  @Roles('admin', 'moderator', 'user')
  @ApiOperation({
    summary: 'Obtener métricas de HambrE',
    description:
      'Retorna el estado actual del HambrE (impulso evolutivo) del ecosistema.',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Métricas de HambrE obtenidas exitosamente',
    type: HambreMetricDto,
  })
  async getHambreMetrics(): Promise<HambreMetricDto> {
    this.logger.log(
      '🔥 GET /philosophy/hambre - Solicitando métricas de HambrE...'
    );

    try {
      const hambre = await this.philosophyService.getHambreMetrics();

      this.logger.log(`✅ HambrE enviado: ${hambre.level} (${hambre.value})`);
      return hambre;
    } catch (error) {
      this.logger.error('❌ Error en GET /philosophy/hambre:', error);
      throw error;
    }
  }

  /**
   * 🔄 Actualizar métricas de HambrE (solo administradores)
   */
  @Post('hambre')
  @Roles('admin')
  @ApiOperation({
    summary: 'Actualizar métricas de HambrE',
    description:
      'Permite a los administradores actualizar manualmente el nivel de HambrE del ecosistema.',
  })
  @ApiBody({
    type: UpdateHambreDto,
    description: 'Datos para actualizar el HambrE',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'HambrE actualizado exitosamente',
    type: HambreMetricDto,
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Solo administradores pueden actualizar HambrE',
  })
  async updateHambre(
    @Body() updateData: UpdateHambreDto
  ): Promise<HambreMetricDto> {
    this.logger.log(
      `🔄 POST /philosophy/hambre - Actualizando HambrE: ${updateData.level} (${updateData.value})`
    );

    try {
      const updatedHambre =
        await this.philosophyService.updateHambre(updateData);

      this.logger.log('✅ HambrE actualizado por administrador');
      return updatedHambre;
    } catch (error) {
      this.logger.error('❌ Error en POST /philosophy/hambre:', error);
      throw error;
    }
  }

  /**
   * 🔄 Obtener métricas de IEA de Reciprocidad
   */
  @Get('iea')
  @Roles('admin', 'moderator', 'user')
  @ApiOperation({
    summary: 'Obtener métricas de IEA de Reciprocidad',
    description:
      'Retorna el Índice de Equilibrio de Reciprocidad del ecosistema (balance dar/recibir).',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Métricas de IEA obtenidas exitosamente',
    type: IEAReciprocidadDto,
  })
  async getIEAMetrics(): Promise<IEAReciprocidadDto> {
    this.logger.log('🔄 GET /philosophy/iea - Solicitando métricas de IEA...');

    try {
      const iea = await this.philosophyService.getIEAMetrics();

      this.logger.log(`✅ IEA enviado: ${iea.indiceCalculado}`);
      return iea;
    } catch (error) {
      this.logger.error('❌ Error en GET /philosophy/iea:', error);
      throw error;
    }
  }

  /**
   * 🧹 Invalidar cache de métricas filosóficas (para desarrollo/depuración)
   */
  @Delete('cache')
  @Roles('admin')
  @ApiOperation({
    summary: 'Invalidar cache de métricas filosóficas',
    description:
      'Útil para desarrollo y depuración. Fuerza recálculo de métricas en próxima solicitud.',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Cache invalidado exitosamente',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string' },
        timestamp: { type: 'string' },
      },
    },
  })
  async invalidateCache(): Promise<{ message: string; timestamp: string }> {
    this.logger.log('🧹 DELETE /philosophy/cache - Invalidando cache...');

    try {
      await this.philosophyService.invalidateCache();

      const response = {
        message: 'Cache de métricas filosóficas invalidado exitosamente',
        timestamp: new Date().toISOString(),
      };

      this.logger.log('✅ Cache invalidado');
      return response;
    } catch (error) {
      this.logger.error('❌ Error en DELETE /philosophy/cache:', error);
      throw error;
    }
  }

  /**
   * 🏥 Health check específico del módulo de filosofía
   */
  @Get('health')
  @ApiOperation({
    summary: 'Health check del módulo de filosofía',
    description: 'Verifica el estado del servicio de métricas filosóficas.',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Módulo de filosofía operativo',
  })
  async healthCheck(): Promise<{
    status: string;
    module: string;
    timestamp: string;
  }> {
    this.logger.log('🏥 GET /philosophy/health - Health check...');

    return {
      status: 'ok',
      module: 'PhilosophyModule',
      timestamp: new Date().toISOString(),
    };
  }
}
