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

import { UnitsService } from '../services/units.service';
import { 
  CreateUnitsTransactionDto, 
  UnitsTransactionResponseDto,
  GetUnitsBalanceDto,
  UnitsHistoryQueryDto
} from '../dto/units-transaction.dto';

/**
 * 🌌 Units Controller - API de Gestión de Ünits CoomÜnity
 * 
 * 🎯 INTENT: Proporcionar endpoints REST para gestión completa de economía Ünits
 * 🌟 VALUES: Transparencia (operaciones visibles), Bien Común (acceso equitativo), Reciprocidad (intercambios justos)
 * ⚡ CONSTRAINTS: Autenticación JWT, autorización RBAC, validación estricta, logging completo
 */
@ApiTags('Units Economy')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('units')
export class UnitsController {
  constructor(
    private readonly unitsService: UnitsService
  ) {}

  /**
   * 💰 Obtener balance actual de Ünits del usuario
   */
  @Get('balance')
  @ApiOperation({ 
    summary: 'Obtener balance de Ünits',
    description: 'Retorna el balance actual, pendiente e histórico de Ünits del usuario autenticado'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Balance obtenido exitosamente',
    type: GetUnitsBalanceDto 
  })
  async getBalance(@Request() req): Promise<GetUnitsBalanceDto> {
    try {
      return await this.unitsService.getUserBalance(req.user.id);
    } catch (error) {
      throw new HttpException(
        `Error al obtener balance: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  /**
   * 📊 Obtener historial de transacciones de Ünits
   */
  @Get('history')
  @ApiOperation({ 
    summary: 'Historial de transacciones',
    description: 'Obtiene el historial paginado de transacciones de Ünits del usuario'
  })
  @ApiQuery({ name: 'page', required: false, description: 'Número de página' })
  @ApiQuery({ name: 'limit', required: false, description: 'Transacciones por página' })
  @ApiQuery({ name: 'type', required: false, description: 'Filtrar por tipo de transacción' })
  @ApiQuery({ name: 'status', required: false, description: 'Filtrar por estado' })
  @ApiResponse({ 
    status: 200, 
    description: 'Historial obtenido exitosamente',
    type: [UnitsTransactionResponseDto] 
  })
  async getHistory(
    @Request() req,
    @Query() query: UnitsHistoryQueryDto
  ): Promise<{ transactions: UnitsTransactionResponseDto[], total: number, pages: number }> {
    try {
      return await this.unitsService.getUserTransactionHistory(req.user.id, query);
    } catch (error) {
      throw new HttpException(
        `Error al obtener historial: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  /**
   * 💸 Realizar transferencia de Ünits
   */
  @Post('transfer')
  @ApiOperation({ 
    summary: 'Transferir Ünits',
    description: 'Realiza una transferencia de Ünits a otro usuario con validaciones de saldo y reciprocidad'
  })
  @ApiResponse({ 
    status: 201, 
    description: 'Transferencia realizada exitosamente',
    type: UnitsTransactionResponseDto 
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Datos de transferencia inválidos o saldo insuficiente' 
  })
  async transferUnits(
    @Request() req,
    @Body() transferDto: CreateUnitsTransactionDto
  ): Promise<UnitsTransactionResponseDto> {
    try {
      return await this.unitsService.createTransaction(req.user.id, transferDto);
    } catch (error) {
      if (error.message.includes('saldo insuficiente')) {
        throw new HttpException(
          'Saldo insuficiente para realizar la transferencia',
          HttpStatus.BAD_REQUEST
        );
      }
      if (error.message.includes('usuario no encontrado')) {
        throw new HttpException(
          'Usuario receptor no encontrado',
          HttpStatus.NOT_FOUND
        );
      }
      throw new HttpException(
        `Error al procesar transferencia: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  /**
   * 🔍 Obtener detalles de una transacción específica
   */
  @Get('transaction/:transactionId')
  @ApiOperation({ 
    summary: 'Obtener transacción',
    description: 'Obtiene los detalles completos de una transacción específica'
  })
  @ApiParam({ name: 'transactionId', description: 'ID de la transacción' })
  @ApiResponse({ 
    status: 200, 
    description: 'Transacción encontrada',
    type: UnitsTransactionResponseDto 
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Transacción no encontrada' 
  })
  async getTransaction(
    @Request() req,
    @Param('transactionId') transactionId: string
  ): Promise<UnitsTransactionResponseDto> {
    try {
      const transaction = await this.unitsService.getTransaction(transactionId, req.user.id);
      
      if (!transaction) {
        throw new HttpException(
          'Transacción no encontrada',
          HttpStatus.NOT_FOUND
        );
      }

      return transaction;
    } catch (error) {
      if (error.status === HttpStatus.NOT_FOUND) {
        throw error;
      }
      throw new HttpException(
        `Error al obtener transacción: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  /**
   * 📈 Obtener estadísticas de Ünits del usuario
   */
  @Get('stats')
  @ApiOperation({ 
    summary: 'Estadísticas de Ünits',
    description: 'Obtiene estadísticas detalladas del uso de Ünits y reciprocidad'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Estadísticas obtenidas exitosamente' 
  })
  async getUnitsStats(@Request() req) {
    try {
      return await this.unitsService.getUserStats(req.user.id);
    } catch (error) {
      throw new HttpException(
        `Error al obtener estadísticas: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  /**
   * 🎁 Obtener recompensas disponibles por reciprocidad
   */
  @Get('rewards')
  @ApiOperation({ 
    summary: 'Recompensas de reciprocidad',
    description: 'Obtiene las recompensas de Ünits disponibles basadas en el score de reciprocidad'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Recompensas obtenidas exitosamente' 
  })
  async getAvailableRewards(@Request() req) {
    try {
      return await this.unitsService.getAvailableRewards(req.user.id);
    } catch (error) {
      throw new HttpException(
        `Error al obtener recompensas: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  /**
   * 🏆 Reclamar recompensa de reciprocidad
   */
  @Post('rewards/:rewardId/claim')
  @ApiOperation({ 
    summary: 'Reclamar recompensa',
    description: 'Reclama una recompensa específica de Ünits basada en reciprocidad'
  })
  @ApiParam({ name: 'rewardId', description: 'ID de la recompensa' })
  @ApiResponse({ 
    status: 200, 
    description: 'Recompensa reclamada exitosamente' 
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Recompensa no encontrada o ya reclamada' 
  })
  async claimReward(
    @Request() req,
    @Param('rewardId') rewardId: string
  ) {
    try {
      return await this.unitsService.claimReward(req.user.id, rewardId);
    } catch (error) {
      if (error.message.includes('no encontrada')) {
        throw new HttpException(
          'Recompensa no encontrada o ya reclamada',
          HttpStatus.NOT_FOUND
        );
      }
      throw new HttpException(
        `Error al reclamar recompensa: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}