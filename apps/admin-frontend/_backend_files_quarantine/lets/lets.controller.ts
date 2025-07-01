import { Controller, Get, Post, Body, Param, Query, UseGuards, Inject } from '@nestjs/common';
import { LetsService } from './lets.service';
import { CreateLetsTransactionDto, LetsBalanceDto, LetsExpiryCheckDto } from './dto/lets.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../rbac/guards/roles.guard';
import { Roles } from '../rbac/decorators/roles.decorator';

@Controller('lets')
@UseGuards(JwtAuthGuard, RolesGuard)
export class LetsController {
  constructor(@Inject(LetsService) private readonly letsService: LetsService) {
    console.log('>>> LetsController CONSTRUCTOR: this.letsService IS', this.letsService ? 'DEFINED' : 'UNDEFINED');
  }

  /**
   * Obtener balance de Ünits de un usuario
   */
  @Get('balance/:userId')
  @Roles('admin', 'user')
  async getUserBalance(
    @Param('userId') userId: string,
    @Query('tokenType') tokenType?: string
  ) {
    console.log('>>> LetsController.getUserBalance: Getting balance for user', userId);
    
    const dto: LetsBalanceDto = { userId, tokenType };
    return await this.letsService.getUserBalance(dto);
  }

  /**
   * Realizar intercambio de Ünits entre usuarios
   */
  @Post('exchange')
  @Roles('admin', 'user')
  async exchangeUnits(@Body() dto: CreateLetsTransactionDto) {
    console.log('>>> LetsController.exchangeUnits: Processing exchange', dto);
    return await this.letsService.exchangeUnits(dto);
  }

  /**
   * Verificar y procesar tokens caducados
   */
  @Post('process-expired/:userId')
  @Roles('admin', 'user')
  async processExpiredTokens(
    @Param('userId') userId: string,
    @Query('tokenType') tokenType?: string
  ) {
    console.log('>>> LetsController.processExpiredTokens: Processing expired tokens for user', userId);
    
    const dto: LetsExpiryCheckDto = { userId, tokenType };
    return await this.letsService.processExpiredTokens(dto);
  }

  /**
   * Obtener historial de transacciones LETS de un usuario
   */
  @Get('history/:userId')
  @Roles('admin', 'user')
  async getUserLetsHistory(
    @Param('userId') userId: string,
    @Query('limit') limit?: string
  ) {
    console.log('>>> LetsController.getUserLetsHistory: Getting LETS history for user', userId);
    
    const limitNumber = limit ? parseInt(limit, 10) : 50;
    return await this.letsService.getUserLetsHistory(userId, limitNumber);
  }

  /**
   * Verificar elegibilidad para saldos negativos
   */
  @Get('negative-balance-eligibility/:userId')
  @Roles('admin', 'user')
  async checkNegativeBalanceEligibility(@Param('userId') userId: string) {
    console.log('>>> LetsController.checkNegativeBalanceEligibility: Checking eligibility for user', userId);
    return await this.letsService.checkNegativeBalanceEligibility(userId);
  }

  /**
   * Endpoint de prueba para verificar conectividad
   */
  @Get('ping')
  async ping() {
    console.log('>>> LetsController.ping: LETS module is working');
    return { 
      message: 'LETS module is working', 
      timestamp: new Date().toISOString(),
      module: 'Local Exchange Trading System'
    };
  }
} 