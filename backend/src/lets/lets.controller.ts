import { Controller, Get, Post, Body, Param, Query, UseGuards, Inject } from '@nestjs/common';
import { LetsService } from './lets.service';
import { CreateLetsTransactionDto, LetsBalanceDto, LetsExpiryCheckDto } from './dto/lets.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../rbac/guards/roles.guard';
import { Roles } from '../rbac/decorators/roles.decorator';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('lets')
@ApiBearerAuth()
@Controller('lets')
@UseGuards(JwtAuthGuard, RolesGuard)
export class LetsController {
  constructor(@Inject(LetsService) private readonly letsService: LetsService) {
// //     console.log('>>> LetsController CONSTRUCTOR: this.letsService IS', this.letsService ? 'DEFINED' : 'UNDEFINED');
  }

  /**
   * Obtener balance de Ünits de un usuario
   */
  @Get('balance/:userId')
  @Roles('admin', 'user')
  @ApiOperation({ summary: 'Get user Units balance' })
  async getUserBalance(
    @Param('userId') userId: string,
    @Query('tokenType') tokenType?: string
  ) {
//     console.log('>>> LetsController.getUserBalance: Getting balance for user', userId);
    
    const dto: LetsBalanceDto = { userId, tokenType };
    return await this.letsService.getUserBalance(dto);
  }

  /**
   * Realizar intercambio de Ünits entre usuarios
   */
  @Post('exchange')
  @Roles('admin', 'user')
  @ApiOperation({ summary: 'Exchange Units between users' })
  async exchangeUnits(@Body() dto: CreateLetsTransactionDto) {
//     console.log('>>> LetsController.exchangeUnits: Processing exchange', dto);
    return await this.letsService.exchangeUnits(dto);
  }

  /**
   * Verificar y procesar tokens caducados
   */
  @Post('process-expired/:userId')
  @Roles('admin', 'user')
  @ApiOperation({ summary: 'Process expired tokens for user' })
  async processExpiredTokens(
    @Param('userId') userId: string,
    @Query('tokenType') tokenType?: string
  ) {
//     console.log('>>> LetsController.processExpiredTokens: Processing expired tokens for user', userId);
    
    const dto: LetsExpiryCheckDto = { userId, tokenType };
    return await this.letsService.processExpiredTokens(dto);
  }

  /**
   * Obtener historial de transacciones LETS de un usuario
   */
  @Get('history/:userId')
  @Roles('admin', 'user')
  @ApiOperation({ summary: 'Get user LETS transaction history' })
  async getUserLetsHistory(
    @Param('userId') userId: string,
    @Query('limit') limit?: string
  ) {
//     console.log('>>> LetsController.getUserLetsHistory: Getting LETS history for user', userId);
    
    const limitNumber = limit ? parseInt(limit, 10) : 50;
    return await this.letsService.getUserLetsHistory(userId, limitNumber);
  }

  /**
   * Verificar elegibilidad para saldos negativos
   */
  @Get('negative-balance-eligibility/:userId')
  @Roles('admin', 'user')
  @ApiOperation({ summary: 'Check negative balance eligibility' })
  async checkNegativeBalanceEligibility(@Param('userId') userId: string) {
//     console.log('>>> LetsController.checkNegativeBalanceEligibility: Checking eligibility for user', userId);
    return await this.letsService.checkNegativeBalanceEligibility(userId);
  }

  // Nuevos endpoints requeridos por el reporte de integración

  /**
   * Obtener calificaciones de confianza de un usuario
   */
  @Get('trust-ratings/:userId')
  @Roles('admin', 'user')
  @ApiOperation({ summary: 'Get trust ratings for a user' })
  @ApiResponse({ 
    status: 200, 
    description: 'Trust ratings retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        userId: { type: 'string' },
        trustScore: { type: 'number' },
        ratingsCount: { type: 'number' },
        averageRating: { type: 'number' },
        ratings: { type: 'array' }
      }
    }
  })
  async getTrustRatings(@Param('userId') userId: string) {
//     console.log('>>> LetsController.getTrustRatings: Getting trust ratings for user', userId);
    return await this.letsService.getTrustRatings(userId);
  }

  /**
   * Crear calificación de confianza
   */
  @Post('trust-ratings')
  @Roles('admin', 'user')
  @ApiOperation({ summary: 'Create trust rating' })
  async createTrustRating(@Body() ratingData: {
    ratedId: string;
    transactionId?: string;
    rating: number;
    communicationRating?: number;
    deliveryRating?: number;
    qualityRating?: number;
    comments?: string;
  }) {
//     console.log('>>> LetsController.createTrustRating: Creating trust rating', ratingData);
    return await this.letsService.createTrustRating(ratingData);
  }

  /**
   * Obtener intercambios de conocimiento disponibles
   */
  @Get('knowledge-exchanges')
  @Roles('admin', 'user')
  @ApiOperation({ summary: 'Get available knowledge exchanges' })
  @ApiResponse({ 
    status: 200, 
    description: 'Knowledge exchanges retrieved successfully',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          title: { type: 'string' },
          description: { type: 'string' },
          teacherId: { type: 'string' },
          unitsCost: { type: 'number' },
          maxParticipants: { type: 'number' },
          scheduledAt: { type: 'string' }
        }
      }
    }
  })
  async getKnowledgeExchanges(
    @Query('copId') copId?: string,
    @Query('category') category?: string
  ) {
//     console.log('>>> LetsController.getKnowledgeExchanges: Getting knowledge exchanges', { copId, category });
    return await this.letsService.getKnowledgeExchanges({ copId, category });
  }

  /**
   * Crear intercambio de conocimiento
   */
  @Post('knowledge-exchanges')
  @Roles('admin', 'user')
  @ApiOperation({ summary: 'Create knowledge exchange' })
  async createKnowledgeExchange(@Body() exchangeData: {
    copId: string;
    teacherId: string;
    sessionType: string;
    title: string;
    description: string;
    knowledgeAreas: string[];
    unitsCost: number;
    durationHours: number;
    maxParticipants: number;
    scheduledAt: string;
  }) {
//     console.log('>>> LetsController.createKnowledgeExchange: Creating knowledge exchange', exchangeData);
    return await this.letsService.createKnowledgeExchange(exchangeData);
  }

  /**
   * Obtener recomendaciones personalizadas para un usuario
   */
  @Get('recommendations/:userId')
  @Roles('admin', 'user')
  @ApiOperation({ summary: 'Get personalized recommendations for user' })
  @ApiResponse({ 
    status: 200, 
    description: 'Recommendations retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        userId: { type: 'string' },
        recommendations: { type: 'array' },
        categories: { type: 'array' },
        trustBasedSuggestions: { type: 'array' }
      }
    }
  })
  async getRecommendations(@Param('userId') userId: string) {
//     console.log('>>> LetsController.getRecommendations: Getting recommendations for user', userId);
    return await this.letsService.getRecommendations(userId);
  }

  /**
   * Obtener notificaciones LETS para un usuario
   */
  @Get('notifications/:userId')
  @Roles('admin', 'user')
  @ApiOperation({ summary: 'Get LETS notifications for user' })
  @ApiResponse({ 
    status: 200, 
    description: 'Notifications retrieved successfully',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          type: { type: 'string' },
          title: { type: 'string' },
          message: { type: 'string' },
          timestamp: { type: 'string' },
          read: { type: 'boolean' }
        }
      }
    }
  })
  async getNotifications(@Param('userId') userId: string) {
//     console.log('>>> LetsController.getNotifications: Getting notifications for user', userId);
    return await this.letsService.getNotifications(userId);
  }

  /**
   * Endpoint de prueba para verificar conectividad
   */
  @Get('ping')
  @ApiOperation({ summary: 'Test LETS module connectivity' })
  async ping() {
//     console.log('>>> LetsController.ping: LETS module is working');
    return { 
      message: 'LETS module is working', 
      timestamp: new Date().toISOString(),
      module: 'Local Exchange Trading System'
    };
  }
} 