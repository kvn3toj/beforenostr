import { Injectable, Inject, Logger } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { 
  CreateReciprocityEventDto,
  ReciprocityScoreDto,
  ReciprocityEventResponseDto,
  ReciprocityRewardDto,
  GetReciprocityHistoryDto,
  ReciprocityEventType,
  AyniLevel
} from '../dto/reciprocity.dto';

/**
 * 🌌 Reciprocity Service - Lógica de Reciprocidad y Ayni CoomÜnity
 * 
 * 🎯 INTENT: Medir, recompensar y fomentar reciprocidad auténtica en la comunidad
 * 🌟 VALUES: Ayni (reciprocidad sagrada), Metanöia (transformación de conciencia), Bien Común (equilibrio comunitario)
 * ⚡ CONSTRAINTS: Algoritmos justos, medición precisa, incentivos balanceados, escalabilidad
 */
@Injectable()
export class ReciprocityService {
  private readonly logger = new Logger(ReciprocityService.name);

  constructor(
    @Inject() private readonly prisma: PrismaService
  ) {}

  /**
   * 📊 Obtener score de reciprocidad del usuario
   */
  async getUserReciprocityScore(userId: string): Promise<ReciprocityScoreDto> {
    try {
      this.logger.log(`Calculando score de reciprocidad para usuario: ${userId}`);

      // Obtener eventos de reciprocidad del último año
      const oneYearAgo = new Date();
      oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

      const events = await this.prisma.reciprocityEvent.findMany({
        where: {
          actorId: userId,
          createdAt: { gte: oneYearAgo }
        },
        orderBy: { createdAt: 'desc' }
      });

      // Calcular métricas básicas
      const giveActions = events.filter(e => 
        ['give', 'share', 'help', 'mentor', 'create', 'appreciate'].includes(e.eventType)
      ).length;

      const receiveActions = events.filter(e => 
        ['receive', 'learn'].includes(e.eventType)
      ).length;

      const collaborativeActions = events.filter(e => 
        ['collaborate', 'review'].includes(e.eventType)
      ).length;

      // Calcular score base (0-100)
      const baseScore = this.calculateBaseScore(giveActions, receiveActions, collaborativeActions);
      
      // Aplicar factor de tiempo (eventos recientes valen más)
      const timeWeightedScore = this.applyTimeWeighting(events, baseScore);
      
      // Aplicar factor de calidad (magnitud de acciones)
      const qualityWeightedScore = this.applyQualityWeighting(events, timeWeightedScore);
      
      // Normalizar a 0-100
      const currentScore = Math.min(100, Math.max(0, Math.round(qualityWeightedScore)));

      // Determinar nivel de Ayni
      const ayniLevel = this.determineAyniLevel(currentScore);
      
      // Calcular ratio de equilibrio
      const balanceRatio = receiveActions > 0 ? giveActions / receiveActions : giveActions;

      // Calcular puntos para siguiente nivel
      const pointsToNextLevel = this.calculatePointsToNextLevel(currentScore, ayniLevel);

      // Calcular bonificación actual de Ünits
      const unitsBonus = this.calculateUnitsBonus(currentScore);

      const scoreData: ReciprocityScoreDto = {
        currentScore,
        ayniLevel,
        giveActions,
        receiveActions,
        balanceRatio,
        pointsToNextLevel,
        unitsBonus,
        lastUpdated: new Date()
      };

      this.logger.log(`Score calculado para ${userId}: ${currentScore} (${ayniLevel})`);
      return scoreData;

    } catch (error) {
      this.logger.error(`Error al calcular score de reciprocidad para ${userId}:`, error);
      throw new Error(`Error al calcular reciprocidad: ${error.message}`);
    }
  }

  /**
   * 📝 Registrar evento de reciprocidad
   */
  async recordReciprocityEvent(eventDto: CreateReciprocityEventDto): Promise<ReciprocityEventResponseDto> {
    try {
      this.logger.log(`Registrando evento de reciprocidad: ${eventDto.eventType} por ${eventDto.actorId}`);

      // Calcular puntos de reciprocidad otorgados
      const pointsAwarded = this.calculateEventPoints(eventDto.eventType, eventDto.magnitude);

      // Crear evento en base de datos
      const event = await this.prisma.reciprocityEvent.create({
        data: {
          eventType: eventDto.eventType,
          actorId: eventDto.actorId,
          recipientId: eventDto.recipientId,
          magnitude: eventDto.magnitude,
          pointsAwarded,
          context: eventDto.context,
          resourceId: eventDto.resourceId,
          description: eventDto.description,
          metadata: eventDto.metadata || {}
        }
      });

      // Recalcular score de reciprocidad del actor
      const newReciprocityScore = await this.getUserReciprocityScore(eventDto.actorId);

      // Verificar si se activa recompensa automática
      const automaticReward = await this.checkAutomaticReward(
        eventDto.actorId, 
        newReciprocityScore.currentScore
      );

      const response: ReciprocityEventResponseDto = {
        id: event.id,
        eventType: event.eventType as ReciprocityEventType,
        actorId: event.actorId,
        recipientId: event.recipientId,
        magnitude: event.magnitude,
        pointsAwarded: event.pointsAwarded,
        context: event.context,
        description: event.description,
        createdAt: event.createdAt,
        newReciprocityScore: newReciprocityScore.currentScore,
        automaticReward
      };

      this.logger.log(`Evento registrado: ${event.id}, puntos: ${pointsAwarded}`);
      return response;

    } catch (error) {
      this.logger.error(`Error al registrar evento de reciprocidad:`, error);
      throw new Error(`Error al registrar evento: ${error.message}`);
    }
  }

  /**
   * 📚 Obtener historial de eventos de reciprocidad
   */
  async getReciprocityHistory(
    userId: string, 
    query: GetReciprocityHistoryDto
  ): Promise<{ events: ReciprocityEventResponseDto[], total: number, pages: number }> {
    try {
      const { page = 1, limit = 20, eventType, fromDate, toDate } = query;
      const skip = (page - 1) * limit;

      // Construir filtros
      const where: any = { actorId: userId };
      
      if (eventType) where.eventType = eventType;
      if (fromDate || toDate) {
        where.createdAt = {};
        if (fromDate) where.createdAt.gte = new Date(fromDate);
        if (toDate) where.createdAt.lte = new Date(toDate);
      }

      const [events, total] = await Promise.all([
        this.prisma.reciprocityEvent.findMany({
          where,
          skip,
          take: limit,
          orderBy: { createdAt: 'desc' }
        }),
        this.prisma.reciprocityEvent.count({ where })
      ]);

      const pages = Math.ceil(total / limit);

      const mappedEvents: ReciprocityEventResponseDto[] = events.map(event => ({
        id: event.id,
        eventType: event.eventType as ReciprocityEventType,
        actorId: event.actorId,
        recipientId: event.recipientId,
        magnitude: event.magnitude,
        pointsAwarded: event.pointsAwarded,
        context: event.context,
        description: event.description,
        createdAt: event.createdAt,
        newReciprocityScore: 0 // Se calculará si es necesario
      }));

      return { events: mappedEvents, total, pages };

    } catch (error) {
      this.logger.error(`Error al obtener historial de reciprocidad para ${userId}:`, error);
      throw new Error(`Error al obtener historial: ${error.message}`);
    }
  }

  // ═══════════════════════════════════════════════════════════════
  // 🔧 MÉTODOS PRIVADOS DE CÁLCULO
  // ═══════════════════════════════════════════════════════════════

  /**
   * 🧮 Calcular score base de reciprocidad
   */
  private calculateBaseScore(giveActions: number, receiveActions: number, collaborativeActions: number): number {
    // Fórmula balanceada que premia tanto dar como recibir, con énfasis en equilibrio
    const totalActions = giveActions + receiveActions + collaborativeActions;
    
    if (totalActions === 0) return 0;

    // Calcular balance ideal (más dar que recibir, pero no desequilibrado)
    const idealRatio = 1.5; // 60% dar, 40% recibir
    const actualRatio = receiveActions > 0 ? giveActions / receiveActions : giveActions;
    
    // Penalizar desequilibrios extremos
    const balanceFactor = actualRatio > idealRatio 
      ? Math.max(0.5, 1 - (actualRatio - idealRatio) * 0.1)
      : Math.min(1, actualRatio / idealRatio);

    // Score base considerando volumen y balance
    const volumeScore = Math.min(50, totalActions * 2); // Máximo 50 puntos por volumen
    const balanceScore = balanceFactor * 50; // Máximo 50 puntos por balance

    return volumeScore + balanceScore;
  }

  /**
   * ⏰ Aplicar ponderación temporal
   */
  private applyTimeWeighting(events: any[], baseScore: number): number {
    if (events.length === 0) return baseScore;

    const now = new Date();
    const totalWeight = events.reduce((sum, event) => {
      const daysSinceEvent = (now.getTime() - event.createdAt.getTime()) / (1000 * 60 * 60 * 24);
      // Eventos recientes (último mes) tienen peso 1.0, van decayendo hasta 0.1 después de un año
      const weight = Math.max(0.1, 1 - (daysSinceEvent / 365) * 0.9);
      return sum + weight;
    }, 0);

    const averageWeight = totalWeight / events.length;
    return baseScore * averageWeight;
  }

  /**
   * 💎 Aplicar ponderación de calidad
   */
  private applyQualityWeighting(events: any[], timeWeightedScore: number): number {
    if (events.length === 0) return timeWeightedScore;

    const totalMagnitude = events.reduce((sum, event) => sum + event.magnitude, 0);
    const averageMagnitude = totalMagnitude / events.length;
    
    // Bonificar acciones de alta calidad/magnitud
    const qualityMultiplier = 0.8 + (averageMagnitude / 10) * 0.4; // 0.8x a 1.2x
    
    return timeWeightedScore * qualityMultiplier;
  }

  /**
   * 🏆 Determinar nivel de Ayni
   */
  private determineAyniLevel(score: number): AyniLevel {
    if (score >= 96) return AyniLevel.COSMIC;
    if (score >= 81) return AyniLevel.SAGE;
    if (score >= 61) return AyniLevel.GENEROUS;
    if (score >= 41) return AyniLevel.BALANCED;
    if (score >= 21) return AyniLevel.GROWING;
    return AyniLevel.BEGINNER;
  }

  /**
   * 📈 Calcular puntos para siguiente nivel
   */
  private calculatePointsToNextLevel(currentScore: number, currentLevel: AyniLevel): number {
    const levelThresholds = {
      [AyniLevel.BEGINNER]: 21,
      [AyniLevel.GROWING]: 41,
      [AyniLevel.BALANCED]: 61,
      [AyniLevel.GENEROUS]: 81,
      [AyniLevel.SAGE]: 96,
      [AyniLevel.COSMIC]: 100
    };

    const nextThreshold = levelThresholds[currentLevel];
    return currentScore >= 100 ? 0 : nextThreshold - currentScore;
  }

  /**
   * 💰 Calcular bonificación de Ünits
   */
  private calculateUnitsBonus(score: number): number {
    if (score >= 96) return 20; // Cosmic: 20% bonus
    if (score >= 81) return 15; // Sage: 15% bonus
    if (score >= 61) return 10; // Generous: 10% bonus
    if (score >= 41) return 5;  // Balanced: 5% bonus
    if (score >= 21) return 2;  // Growing: 2% bonus
    return 0; // Beginner: sin bonus
  }

  /**
   * 🎯 Calcular puntos por evento
   */
  private calculateEventPoints(eventType: ReciprocityEventType, magnitude: number): number {
    const basePoints = {
      [ReciprocityEventType.GIVE]: 10,
      [ReciprocityEventType.RECEIVE]: 5,
      [ReciprocityEventType.SHARE]: 8,
      [ReciprocityEventType.HELP]: 12,
      [ReciprocityEventType.COLLABORATE]: 15,
      [ReciprocityEventType.MENTOR]: 20,
      [ReciprocityEventType.LEARN]: 8,
      [ReciprocityEventType.CREATE]: 15,
      [ReciprocityEventType.REVIEW]: 10,
      [ReciprocityEventType.APPRECIATE]: 5
    };

    return (basePoints[eventType] || 5) * (magnitude / 5);
  }

  /**
   * 🎁 Verificar recompensa automática
   */
  private async checkAutomaticReward(userId: string, newScore: number): Promise<ReciprocityRewardDto | undefined> {
    // Verificar si cruzó un umbral importante
    const previousScore = 0; // TODO: Obtener score anterior
    const levelThresholds = [21, 41, 61, 81, 96];
    
    for (const threshold of levelThresholds) {
      if (previousScore < threshold && newScore >= threshold) {
        return {
          rewardType: 'units_bonus',
          unitsAmount: threshold * 10, // Bonus proporcional al nivel
          bonusPercentage: this.calculateUnitsBonus(newScore),
          message: `¡Felicitaciones! Has alcanzado un nuevo nivel de Ayni`,
          triggerScore: newScore,
          durationDays: 30
        };
      }
    }

    return undefined;
  }
}