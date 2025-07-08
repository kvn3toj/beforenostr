/**
 * 🌌 CosmicBrainController - API del AI Cosmic Brain
 *
 * Controlador RESTful para el sistema AI Cosmic Brain del Gamifier Admin.
 * Proporciona endpoints para acceder a métricas, estado de guardianes,
 * misiones activas y datos del dashboard.
 *
 * Filosofía CoomÜnity:
 * - Bien Común: API accesible para el equipo de administración
 * - Ayni: Balance entre funcionalidad y performance
 * - Neguentropía: Estructura clara de endpoints
 * - Metanöia: Evolución continua del sistema
 *
 * Endpoints disponibles:
 * - GET /admin/cosmic-brain/dashboard - Dashboard completo
 * - GET /admin/cosmic-brain/metrics/philosophy - Métricas filosóficas
 * - GET /admin/cosmic-brain/metrics/system-health - Salud del sistema
 * - GET /admin/cosmic-brain/missions - Misiones activas
 * - GET /admin/cosmic-brain/harmony - Métricas de armonía
 * - GET /admin/cosmic-brain/guardians - Estado de guardianes
 * - GET /admin/cosmic-brain/guardians/:type - Guardián específico
 * - POST /admin/cosmic-brain/evolve - Trigger evolución
 */

import { Controller, Get, UseGuards } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../rbac/guards/roles.guard';
import { Roles } from '../rbac/decorators/roles.decorator';
import { CosmicBrainService } from './cosmic-brain.service';
import { CosmicBrainStatusDto } from './dto/status.dto';
import { CosmicBrainMetricsDto } from './dto/metrics.dto';
import { CosmicBrainMissionsDto } from './dto/missions.dto';

@ApiTags('cosmic-brain')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
@Controller('cosmic-brain')
export class CosmicBrainController {
  constructor(private readonly cosmicBrainService: CosmicBrainService) {}

  /**
   * 🌌 Obtiene el estado actual del sistema cósmico
   * Incluye métricas de armonía, alineación filosófica y alertas activas
   */
  @Get('status')
  @ApiOperation({
    summary: 'Get current cosmic brain status',
    description:
      'Retrieves the current status of the cosmic brain system including harmony, alignment, and active alerts. Admin access required.',
  })
  @ApiResponse({
    status: 200,
    description: 'Current cosmic brain status retrieved successfully',
    type: CosmicBrainStatusDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Valid JWT token required',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Admin role required',
  })
  async getStatus(): Promise<CosmicBrainStatusDto> {
    return this.cosmicBrainService.getStatus();
  }

  /**
   * 📊 Obtiene las métricas del sistema cósmico
   * Incluye estadísticas de uptime, evoluciones, predicciones y análisis
   */
  @Get('metrics')
  @ApiOperation({
    summary: 'Get cosmic brain metrics',
    description:
      'Retrieves detailed metrics about the cosmic brain system including uptime, evolution count, predictions, and performance data. Admin access required.',
  })
  @ApiResponse({
    status: 200,
    description: 'Cosmic brain metrics retrieved successfully',
    type: CosmicBrainMetricsDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Valid JWT token required',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Admin role required',
  })
  async getMetrics(): Promise<CosmicBrainMetricsDto> {
    return this.cosmicBrainService.getMetrics();
  }

  /**
   * 🎯 Obtiene las misiones activas del sistema cósmico
   * Incluye información detallada sobre el progreso y estado de cada misión
   */
  @Get('missions')
  @ApiOperation({
    summary: 'Get active cosmic brain missions',
    description:
      'Retrieves information about active missions assigned by the cosmic brain system including progress, status, and details. Admin access required.',
  })
  @ApiResponse({
    status: 200,
    description: 'Active missions retrieved successfully',
    type: CosmicBrainMissionsDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Valid JWT token required',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Admin role required',
  })
  async getMissions(): Promise<CosmicBrainMissionsDto> {
    return this.cosmicBrainService.getMissions();
  }
}
