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

import { ReciprocityService } from '../services/reciprocity.service';
import { 
  CreateReciprocityEventDto,
  ReciprocityScoreDto,
  ReciprocityEventResponseDto,
  GetReciprocityHistoryDto
} from '../dto/reciprocity.dto';

/**
 * 🌌 Reciprocity Controller - API de Reciprocidad y Ayni CoomÜnity
 * 
 * 🎯 INTENT: Proporcionar endpoints para gestión de reciprocidad y eventos de Ayni
 * 🌟 VALUES: Ayni (reciprocidad sagrada), Metanöia (transformación consciente), Bien Común (equilibrio comunitario)
 * ⚡ CONSTRAINTS: Autenticación JWT, validación de eventos, medición precisa, incentivos balanceados
 */
@ApiTags('Reciprocity & Ayni')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('reciprocity')
export class ReciprocityController {
  constructor(
    private readonly reciprocityService: ReciprocityService
  ) {}

  /**
   * 📊 Obtener score de reciprocidad del usuario
   */
  @Get('score')
  @ApiOperation({ 
    summary: 'Score de reciprocidad',
    description: 'Obtiene el score actual de reciprocidad y nivel de Ayni del usuario autenticado'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Score obtenido exitosamente',
    type: ReciprocityScoreDto 
  })
  async getMyReciprocityScore(@Request() req): Promise<ReciprocityScoreDto> {
    try {
      return await this.reciprocityService.getUserReciprocityScore(req.user.id);
    } catch (error) {
      throw new HttpException(
        `Error al obtener score de reciprocidad: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  /**
   * 📊 Obtener score de reciprocidad de otro usuario (público)
   */
  @Get('score/:userId')
  @ApiOperation({ 
    summary: 'Score de reciprocidad público',
    description: 'Obtiene el score de reciprocidad público de cualquier usuario'
  })
  @ApiParam({ name: 'userId', description: 'ID del usuario' })
  @ApiResponse({ 
    status: 200, 
    description: 'Score obtenido exitosamente',
    type: ReciprocityScoreDto 
  })
  async getUserReciprocityScore(
    @Request() req,
    @Param('userId') userId: string
  ): Promise<ReciprocityScoreDto> {
    try {
      return await this.reciprocityService.getUserReciprocityScore(userId);
    } catch (error) {
      throw new HttpException(
        `Error al obtener score de reciprocidad: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  /**
   * 📝 Registrar evento de reciprocidad
   */
  @Post('event')
  @ApiOperation({ 
    summary: 'Registrar evento de reciprocidad',
    description: 'Registra un nuevo evento de reciprocidad (dar, recibir, colaborar, etc.)'
  })
  @ApiResponse({ 
    status: 201, 
    description: 'Evento registrado exitosamente',
    type: ReciprocityEventResponseDto 
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Datos del evento inválidos' 
  })
  async recordEvent(
    @Request() req,
    @Body() eventDto: CreateReciprocityEventDto
  ): Promise<ReciprocityEventResponseDto> {
    try {
      // Asegurar que el actorId sea el usuario autenticado (seguridad)
      const eventData = {
        ...eventDto,
        actorId: req.user.id
      };

      return await this.reciprocityService.recordReciprocityEvent(eventData);
    } catch (error) {
      throw new HttpException(
        `Error al registrar evento: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  /**
   * 📚 Obtener historial de eventos de reciprocidad
   */
  @Get('history')
  @ApiOperation({ 
    summary: 'Historial de reciprocidad',
    description: 'Obtiene el historial paginado de eventos de reciprocidad del usuario'
  })
  @ApiQuery({ name: 'page', required: false, description: 'Número de página' })
  @ApiQuery({ name: 'limit', required: false, description: 'Eventos por página' })
  @ApiQuery({ name: 'eventType', required: false, description: 'Filtrar por tipo de evento' })
  @ApiQuery({ name: 'fromDate', required: false, description: 'Fecha desde (ISO)' })
  @ApiQuery({ name: 'toDate', required: false, description: 'Fecha hasta (ISO)' })
  @ApiResponse({ 
    status: 200, 
    description: 'Historial obtenido exitosamente' 
  })
  async getHistory(
    @Request() req,
    @Query() query: GetReciprocityHistoryDto
  ) {
    try {
      return await this.reciprocityService.getReciprocityHistory(req.user.id, query);
    } catch (error) {
      throw new HttpException(
        `Error al obtener historial: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  /**
   * 📊 Obtener leaderboard de reciprocidad (público)
   */
  @Get('leaderboard')
  @ApiOperation({ 
    summary: 'Leaderboard de reciprocidad',
    description: 'Obtiene el ranking público de usuarios por score de reciprocidad'
  })
  @ApiQuery({ name: 'limit', required: false, description: 'Número de usuarios en el ranking', default: 50 })
  @ApiQuery({ name: 'period', required: false, description: 'Período: week, month, year, all', default: 'month' })
  @ApiResponse({ 
    status: 200, 
    description: 'Leaderboard obtenido exitosamente' 
  })
  async getLeaderboard(
    @Query('limit') limit: number = 50,
    @Query('period') period: string = 'month'
  ) {
    try {
      // TODO: Implementar lógica de leaderboard
      // Por ahora devolvemos estructura placeholder
      return {
        period,
        limit,
        leaderboard: [],
        lastUpdated: new Date(),
        message: 'Leaderboard en desarrollo - próximamente disponible'
      };
    } catch (error) {
      throw new HttpException(
        `Error al obtener leaderboard: ${error.message}`,
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
    description: 'Obtiene las recompensas disponibles basadas en el score de reciprocidad'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Recompensas obtenidas exitosamente' 
  })
  async getAvailableRewards(@Request() req) {
    try {
      const reciprocityScore = await this.reciprocityService.getUserReciprocityScore(req.user.id);
      
      // Calcular recompensas disponibles basadas en el score
      const rewards = [];
      
      // Recompensas por niveles de Ayni
      const levelRewards = {
        'beginner': { unitsBonus: 0, message: 'Comienza tu viaje de reciprocidad' },
        'growing': { unitsBonus: 2, message: 'Creciendo en consciencia - 2% bonus en Ünits' },
        'balanced': { unitsBonus: 5, message: 'Equilibrio alcanzado - 5% bonus en Ünits' },
        'generous': { unitsBonus: 10, message: 'Generosidad activa - 10% bonus en Ünits' },
        'sage': { unitsBonus: 15, message: 'Sabiduría en reciprocidad - 15% bonus en Ünits' },
        'cosmic': { unitsBonus: 20, message: 'Maestría cósmica - 20% bonus en Ünits' }
      };

      const currentReward = levelRewards[reciprocityScore.ayniLevel];
      
      return {
        currentLevel: reciprocityScore.ayniLevel,
        currentScore: reciprocityScore.currentScore,
        currentReward,
        nextLevelReward: this.getNextLevelReward(reciprocityScore.ayniLevel, levelRewards),
        pointsToNextLevel: reciprocityScore.pointsToNextLevel,
        availableActions: this.getAvailableReciprocityActions()
      };

    } catch (error) {
      throw new HttpException(
        `Error al obtener recompensas: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  /**
   * 📈 Obtener métricas de reciprocidad comunitaria
   */
  @Get('community-metrics')
  @ApiOperation({ 
    summary: 'Métricas comunitarias',
    description: 'Obtiene métricas agregadas de reciprocidad de toda la comunidad'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Métricas obtenidas exitosamente' 
  })
  async getCommunityMetrics() {
    try {
      // TODO: Implementar métricas comunitarias agregadas
      return {
        totalEvents: 0,
        averageScore: 0,
        topContributors: [],
        levelDistribution: {},
        trendingActions: [],
        message: 'Métricas comunitarias en desarrollo'
      };
    } catch (error) {
      throw new HttpException(
        `Error al obtener métricas comunitarias: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  /**
   * 🎯 Obtener sugerencias de acciones de reciprocidad
   */
  @Get('suggestions')
  @ApiOperation({ 
    summary: 'Sugerencias de reciprocidad',
    description: 'Obtiene sugerencias personalizadas de acciones para mejorar reciprocidad'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Sugerencias obtenidas exitosamente' 
  })
  async getReciprocitySuggestions(@Request() req) {
    try {
      const reciprocityScore = await this.reciprocityService.getUserReciprocityScore(req.user.id);
      
      const suggestions = this.generateReciprocitySuggestions(reciprocityScore);
      
      return {
        currentScore: reciprocityScore.currentScore,
        currentLevel: reciprocityScore.ayniLevel,
        suggestions,
        priorityActions: suggestions.filter(s => s.priority === 'high'),
        estimatedImpact: this.calculateEstimatedImpact(reciprocityScore)
      };

    } catch (error) {
      throw new HttpException(
        `Error al obtener sugerencias: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  // ═══════════════════════════════════════════════════════════════
  // 🔧 MÉTODOS PRIVADOS
  // ═══════════════════════════════════════════════════════════════

  private getNextLevelReward(currentLevel: string, levelRewards: any) {
    const levels = ['beginner', 'growing', 'balanced', 'generous', 'sage', 'cosmic'];
    const currentIndex = levels.indexOf(currentLevel);
    const nextLevel = levels[currentIndex + 1];
    
    return nextLevel ? levelRewards[nextLevel] : null;
  }

  private getAvailableReciprocityActions() {
    return [
      { action: 'give', description: 'Donar o transferir Ünits', points: '10-50' },
      { action: 'share', description: 'Compartir conocimiento o recursos', points: '8-40' },
      { action: 'help', description: 'Ayudar a otros usuarios', points: '12-60' },
      { action: 'collaborate', description: 'Colaborar en proyectos', points: '15-75' },
      { action: 'mentor', description: 'Mentoría a otros usuarios', points: '20-100' },
      { action: 'create', description: 'Crear contenido valioso', points: '15-75' },
      { action: 'appreciate', description: 'Reconocer contribuciones', points: '5-25' }
    ];
  }

  private generateReciprocitySuggestions(reciprocityScore: ReciprocityScoreDto) {
    const suggestions = [];

    // Sugerencias basadas en el balance de acciones
    if (reciprocityScore.balanceRatio < 1) {
      suggestions.push({
        type: 'balance_improvement',
        priority: 'high',
        action: 'Aumentar acciones de dar',
        description: 'Tu ratio de dar/recibir está desequilibrado. Considera contribuir más a la comunidad.',
        estimatedPoints: 50
      });
    }

    // Sugerencias por nivel
    if (reciprocityScore.currentScore < 20) {
      suggestions.push({
        type: 'beginner_actions',
        priority: 'medium',
        action: 'Comenzar con pequeñas contribuciones',
        description: 'Inicia con acciones simples como agradecer o compartir recursos.',
        estimatedPoints: 30
      });
    }

    return suggestions;
  }

  private calculateEstimatedImpact(reciprocityScore: ReciprocityScoreDto) {
    return {
      nextLevelProgress: reciprocityScore.pointsToNextLevel,
      estimatedTimeToNextLevel: Math.ceil(reciprocityScore.pointsToNextLevel / 10) + ' días',
      potentialUnitsBonus: '+' + (reciprocityScore.unitsBonus + 3) + '%'
    };
  }
}