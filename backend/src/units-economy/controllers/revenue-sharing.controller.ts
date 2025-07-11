import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Param, 
  Query, 
  UseGuards, 
  Request,
  HttpException,
  HttpStatus 
} from '@nestjs/common';
import { 
  ApiTags, 
  ApiOperation, 
  ApiResponse, 
  ApiBearerAuth,
  ApiParam,
  ApiQuery 
} from '@nestjs/swagger';
import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';
import { RolesGuard } from '@/rbac/guards/roles.guard';
import { Roles } from '@/rbac/decorators/roles.decorator';

import { RevenueSharingService } from '../services/revenue-sharing.service';
import { 
  CreateRevenueSharingDto, 
  RevenueSharingResponseDto,
  RevenueSharingHistoryQueryDto
} from '../dto/revenue-sharing.dto';

/**
 * 🌌 Revenue Sharing Controller - API de Distribución de Ingresos CoomÜnity
 * 
 * 🎯 INTENT: Proporcionar endpoints para gestión de distribución automática de ingresos
 * 🌟 VALUES: Bien Común (beneficio compartido), Transparencia (distribución visible), Reciprocidad (retorno justo)
 * ⚡ CONSTRAINTS: Autorización estricta, validación matemática, trazabilidad completa
 */
@ApiTags('Revenue Sharing')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('revenue-sharing')
export class RevenueSharingController {
  constructor(
    private readonly revenueSharingService: RevenueSharingService
  ) {}

  /**
   * 💰 Crear nueva distribución de ingresos
   */
  @Post()
  @Roles('admin', 'gamifier', 'system')
  @ApiOperation({ 
    summary: 'Crear distribución de ingresos',
    description: 'Crea y ejecuta una nueva distribución de ingresos con bonificaciones de reciprocidad'
  })
  @ApiResponse({ 
    status: 201, 
    description: 'Distribución creada y ejecutada exitosamente',
    type: RevenueSharingResponseDto 
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Datos de distribución inválidos (porcentajes incorrectos, etc.)' 
  })
  @ApiResponse({ 
    status: 403, 
    description: 'Sin permisos para crear distribuciones' 
  })
  async createRevenueSharing(
    @Request() req,
    @Body() distributionDto: CreateRevenueSharingDto
  ): Promise<RevenueSharingResponseDto> {
    try {
      return await this.revenueSharingService.createRevenueSharing(distributionDto);
    } catch (error) {
      if (error.message.includes('porcentajes')) {
        throw new HttpException(
          'Error en porcentajes: deben sumar exactamente 100%',
          HttpStatus.BAD_REQUEST
        );
      }
      if (error.message.includes('participante no encontrado')) {
        throw new HttpException(
          'Uno o más participantes no existen',
          HttpStatus.BAD_REQUEST
        );
      }
      throw new HttpException(
        `Error al crear distribución: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  /**
   * 📊 Obtener historial de distribuciones
   */
  @Get('history')
  @ApiOperation({ 
    summary: 'Historial de distribuciones',
    description: 'Obtiene el historial paginado de distribuciones de ingresos'
  })
  @ApiQuery({ name: 'page', required: false, description: 'Número de página' })
  @ApiQuery({ name: 'limit', required: false, description: 'Distribuciones por página' })
  @ApiQuery({ name: 'sourceType', required: false, description: 'Filtrar por tipo de fuente' })
  @ApiQuery({ name: 'participantId', required: false, description: 'Filtrar por participante' })
  @ApiQuery({ name: 'fromDate', required: false, description: 'Fecha desde (ISO)' })
  @ApiQuery({ name: 'toDate', required: false, description: 'Fecha hasta (ISO)' })
  @ApiResponse({ 
    status: 200, 
    description: 'Historial obtenido exitosamente' 
  })
  async getHistory(
    @Request() req,
    @Query() query: RevenueSharingHistoryQueryDto
  ) {
    try {
      return await this.revenueSharingService.getRevenueSharingHistory(query);
    } catch (error) {
      throw new HttpException(
        `Error al obtener historial: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  /**
   * 🔍 Obtener detalles de distribución específica
   */
  @Get(':distributionId')
  @ApiOperation({ 
    summary: 'Obtener distribución',
    description: 'Obtiene los detalles completos de una distribución específica'
  })
  @ApiParam({ name: 'distributionId', description: 'ID de la distribución' })
  @ApiResponse({ 
    status: 200, 
    description: 'Distribución encontrada',
    type: RevenueSharingResponseDto 
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Distribución no encontrada' 
  })
  async getDistribution(
    @Request() req,
    @Param('distributionId') distributionId: string
  ): Promise<RevenueSharingResponseDto> {
    try {
      const distribution = await this.revenueSharingService.getDistributionDetails(distributionId);
      
      if (!distribution) {
        throw new HttpException(
          'Distribución no encontrada',
          HttpStatus.NOT_FOUND
        );
      }

      return distribution;
    } catch (error) {
      if (error.status === HttpStatus.NOT_FOUND) {
        throw error;
      }
      throw new HttpException(
        `Error al obtener distribución: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  /**
   * 📈 Obtener estadísticas de distribuciones por usuario
   */
  @Get('user/:userId/stats')
  @Roles('admin', 'gamifier', 'self')
  @ApiOperation({ 
    summary: 'Estadísticas de usuario',
    description: 'Obtiene estadísticas de distribuciones para un usuario específico'
  })
  @ApiParam({ name: 'userId', description: 'ID del usuario' })
  @ApiResponse({ 
    status: 200, 
    description: 'Estadísticas obtenidas exitosamente' 
  })
  async getUserStats(
    @Request() req,
    @Param('userId') userId: string
  ) {
    try {
      // Verificar que el usuario puede acceder a estas estadísticas
      if (req.user.role !== 'admin' && req.user.role !== 'gamifier' && req.user.id !== userId) {
        throw new HttpException(
          'Sin permisos para ver estas estadísticas',
          HttpStatus.FORBIDDEN
        );
      }

      // Obtener distribuciones donde el usuario participó
      const history = await this.revenueSharingService.getRevenueSharingHistory({
        participantId: userId,
        page: 1,
        limit: 1000 // Obtener todas para estadísticas
      });

      // Calcular estadísticas
      const totalDistributions = history.total;
      const totalReceived = history.distributions.reduce((sum, dist) => {
        const userCalculation = dist.calculations.find(calc => calc.participantId === userId);
        return sum + (userCalculation?.finalAmount || 0);
      }, 0);

      const averagePerDistribution = totalDistributions > 0 ? totalReceived / totalDistributions : 0;
      
      const sourceTypes = history.distributions.reduce((acc, dist) => {
        acc[dist.sourceType] = (acc[dist.sourceType] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      return {
        totalDistributions,
        totalReceived,
        averagePerDistribution,
        sourceTypes,
        recentDistributions: history.distributions.slice(0, 5)
      };

    } catch (error) {
      if (error.status === HttpStatus.FORBIDDEN) {
        throw error;
      }
      throw new HttpException(
        `Error al obtener estadísticas: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  /**
   * 💡 Simular distribución (sin ejecutar)
   */
  @Post('simulate')
  @Roles('admin', 'gamifier', 'creator')
  @ApiOperation({ 
    summary: 'Simular distribución',
    description: 'Simula una distribución de ingresos sin ejecutarla, para previsualización'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Simulación completada exitosamente' 
  })
  async simulateDistribution(
    @Request() req,
    @Body() distributionDto: CreateRevenueSharingDto
  ) {
    try {
      // Validar porcentajes
      const totalPercentage = distributionDto.participants.reduce((sum, p) => sum + p.percentage, 0);
      if (Math.abs(totalPercentage - 100) > 0.01) {
        throw new HttpException(
          `Los porcentajes deben sumar 100%, suma actual: ${totalPercentage}%`,
          HttpStatus.BAD_REQUEST
        );
      }

      // Simular cálculos sin crear registros
      // TODO: Extraer lógica de cálculo del servicio para reutilizar en simulación
      return {
        simulation: true,
        totalAmount: distributionDto.totalAmount,
        participants: distributionDto.participants.length,
        estimatedDistribution: distributionDto.participants.map(p => ({
          participantId: p.participantId,
          baseAmount: Math.floor((distributionDto.totalAmount * p.percentage) / 100),
          estimatedFinalAmount: Math.floor((distributionDto.totalAmount * p.percentage) / 100 * 1.1) // Estimación con bonificación promedio
        }))
      };

    } catch (error) {
      throw new HttpException(
        `Error en simulación: ${error.message}`,
        HttpStatus.BAD_REQUEST
      );
    }
  }
}