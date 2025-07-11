import { Injectable, Inject, Logger } from '@nestjs/common';
import { UnitsService } from './units.service';
import { RevenueSharingService } from './revenue-sharing.service';
import { ReciprocityService } from './reciprocity.service';
import { CreateRevenueSharingDto } from '../dto/revenue-sharing.dto';
import { CreateReciprocityEventDto } from '../dto/reciprocity.dto';

/**
 * 🌌 Units Economy Orchestrator - Coordinador Central de Economía Ünits
 * 
 * 🎯 INTENT: Coordinar operaciones complejas entre Units, Revenue Sharing y Reciprocidad
 * 🌟 VALUES: Bien Común (coordinación sistémica), Ayni (equilibrio perfecto), Metanöia (transformación consciente)
 * ⚡ CONSTRAINTS: Operaciones atómicas, consistencia de datos, logging completo, alta performance
 */
@Injectable()
export class UnitsEconomyOrchestrator {
  private readonly logger = new Logger(UnitsEconomyOrchestrator.name);

  constructor(
    @Inject() private readonly unitsService: UnitsService,
    @Inject() private readonly revenueSharingService: RevenueSharingService,
    @Inject() private readonly reciprocityService: ReciprocityService
  ) {}

  /**
   * 🎯 Procesar venta de template con revenue sharing automático
   */
  async processTemplateSale(
    templateId: string,
    buyerId: string,
    sellerId: string,
    saleAmount: number,
    contributors: Array<{ userId: string, percentage: number, contributionType: string }>
  ) {
    try {
      this.logger.log(`Procesando venta de template ${templateId}: ${saleAmount} Ünits`);

      // 1. Validar que el comprador tenga saldo suficiente
      const buyerBalance = await this.unitsService.getUserBalance(buyerId);
      if (buyerBalance.currentBalance < saleAmount) {
        throw new Error('Saldo insuficiente para la compra');
      }

      // 2. Crear transacción de compra (comprador -> sistema)
      const purchaseTransaction = await this.unitsService.createTransaction(buyerId, {
        recipientId: 'system',
        amount: saleAmount,
        type: 'template_purchase' as any,
        description: `Compra de template ${templateId}`,
        metadata: {
          templateId,
          sellerId,
          contributors
        }
      });

      // 3. Registrar evento de reciprocidad para el comprador
      await this.reciprocityService.recordReciprocityEvent({
        eventType: 'receive' as any,
        actorId: buyerId,
        recipientId: sellerId,
        magnitude: Math.min(10, Math.ceil(saleAmount / 500)), // Magnitud basada en valor
        context: 'template_purchase',
        resourceId: templateId,
        description: `Compra de template por ${saleAmount} Ünits`
      });

      // 4. Crear distribución de ingresos automática
      const revenueSharingDto: CreateRevenueSharingDto = {
        totalAmount: saleAmount,
        sourceId: templateId,
        sourceType: 'template',
        participants: contributors.map(c => ({
          participantId: c.userId,
          percentage: c.percentage,
          contributionType: c.contributionType
        })),
        description: `Venta de template ${templateId}`,
        applyAyniBenefit: true,
        metadata: {
          purchaseTransactionId: purchaseTransaction.id,
          buyerId,
          sellerId
        }
      };

      const revenueDistribution = await this.revenueSharingService.createRevenueSharing(revenueSharingDto);

      // 5. Registrar eventos de reciprocidad para los contributores
      await Promise.all(
        contributors.map(contributor =>
          this.reciprocityService.recordReciprocityEvent({
            eventType: 'create' as any,
            actorId: contributor.userId,
            recipientId: buyerId,
            magnitude: Math.min(10, Math.ceil((saleAmount * contributor.percentage / 100) / 200)),
            context: 'template_contribution',
            resourceId: templateId,
            description: `Contribución a template vendido: ${contributor.contributionType}`
          })
        )
      );

      this.logger.log(`Venta procesada exitosamente: ${purchaseTransaction.id}, distribución: ${revenueDistribution.id}`);

      return {
        purchaseTransaction,
        revenueDistribution,
        success: true,
        message: 'Venta procesada y distribuida exitosamente'
      };

    } catch (error) {
      this.logger.error(`Error al procesar venta de template:`, error);
      throw error;
    }
  }

  /**
   * 🏆 Procesar finalización de challenge con recompensas
   */
  async processChallengeCompletion(
    challengeId: string,
    completedByUserId: string,
    rewardAmount: number,
    challengeCreatorId: string,
    mentors: Array<{ userId: string, mentorshipLevel: number }>
  ) {
    try {
      this.logger.log(`Procesando completación de challenge ${challengeId} por usuario ${completedByUserId}`);

      // 1. Otorgar recompensa principal al usuario que completó
      const rewardTransaction = await this.unitsService.createTransaction('system', {
        recipientId: completedByUserId,
        amount: rewardAmount,
        type: 'community_reward' as any,
        description: `Recompensa por completar challenge ${challengeId}`,
        metadata: {
          challengeId,
          challengeCreatorId,
          mentors
        }
      });

      // 2. Registrar evento de reciprocidad por completación
      await this.reciprocityService.recordReciprocityEvent({
        eventType: 'achieve' as any,
        actorId: completedByUserId,
        magnitude: Math.min(10, Math.ceil(rewardAmount / 100)),
        context: 'challenge_completion',
        resourceId: challengeId,
        description: `Completación de challenge con recompensa de ${rewardAmount} Ünits`
      });

      // 3. Distribución de bonificaciones para mentores (si los hay)
      if (mentors.length > 0) {
        const mentorBonus = Math.floor(rewardAmount * 0.1); // 10% del reward para mentores
        
        const mentorDistribution = await this.revenueSharingService.createRevenueSharing({
          totalAmount: mentorBonus,
          sourceId: challengeId,
          sourceType: 'challenge_mentoring',
          participants: mentors.map(mentor => ({
            participantId: mentor.userId,
            percentage: (mentor.mentorshipLevel / mentors.reduce((sum, m) => sum + m.mentorshipLevel, 0)) * 100,
            contributionType: 'mentoring'
          })),
          description: `Bonificación de mentoría para challenge ${challengeId}`,
          applyAyniBenefit: true
        });

        // Registrar eventos de reciprocidad para mentores
        await Promise.all(
          mentors.map(mentor =>
            this.reciprocityService.recordReciprocityEvent({
              eventType: 'mentor' as any,
              actorId: mentor.userId,
              recipientId: completedByUserId,
              magnitude: Math.min(10, mentor.mentorshipLevel),
              context: 'challenge_mentoring',
              resourceId: challengeId,
              description: `Mentoría en challenge completado`
            })
          )
        );

        return {
          rewardTransaction,
          mentorDistribution,
          success: true,
          message: 'Challenge completado con recompensas distribuidas'
        };
      }

      return {
        rewardTransaction,
        success: true,
        message: 'Challenge completado exitosamente'
      };

    } catch (error) {
      this.logger.error(`Error al procesar completación de challenge:`, error);
      throw error;
    }
  }

  /**
   * 🎁 Procesar intercambio de Ayni entre usuarios
   */
  async processAyniExchange(
    giverId: string,
    receiverId: string,
    serviceDescription: string,
    estimatedValue: number,
    exchangeType: 'skill' | 'resource' | 'knowledge' | 'time'
  ) {
    try {
      this.logger.log(`Procesando intercambio de Ayni: ${giverId} -> ${receiverId} (${exchangeType})`);

      // 1. Obtener scores de reciprocidad de ambos usuarios
      const [giverReciprocity, receiverReciprocity] = await Promise.all([
        this.reciprocityService.getUserReciprocityScore(giverId),
        this.reciprocityService.getUserReciprocityScore(receiverId)
      ]);

      // 2. Calcular valor de intercambio con bonificaciones de Ayni
      const ayniMultiplier = this.calculateAyniExchangeMultiplier(
        giverReciprocity.currentScore, 
        receiverReciprocity.currentScore
      );
      
      const finalValue = Math.floor(estimatedValue * ayniMultiplier);

      // 3. Crear transacción de Ayni (no monetaria, pero registrada)
      const ayniTransaction = await this.unitsService.createTransaction('system', {
        recipientId: giverId, // El que da recibe reconocimiento en Ünits
        amount: finalValue,
        type: 'ayni_exchange' as any,
        description: `Ayni: ${serviceDescription}`,
        metadata: {
          giverId,
          receiverId,
          exchangeType,
          estimatedValue,
          ayniMultiplier,
          serviceDescription
        }
      });

      // 4. Registrar eventos de reciprocidad para ambos
      await Promise.all([
        // Evento de dar para el dador
        this.reciprocityService.recordReciprocityEvent({
          eventType: 'give' as any,
          actorId: giverId,
          recipientId: receiverId,
          magnitude: Math.min(10, Math.ceil(estimatedValue / 200)),
          context: 'ayni_exchange',
          resourceId: ayniTransaction.id,
          description: `Ayni: ${serviceDescription}`,
          metadata: { exchangeType, estimatedValue }
        }),
        
        // Evento de recibir para el receptor
        this.reciprocityService.recordReciprocityEvent({
          eventType: 'receive' as any,
          actorId: receiverId,
          recipientId: giverId,
          magnitude: Math.min(10, Math.ceil(estimatedValue / 200)),
          context: 'ayni_exchange',
          resourceId: ayniTransaction.id,
          description: `Ayni recibido: ${serviceDescription}`,
          metadata: { exchangeType, estimatedValue }
        })
      ]);

      this.logger.log(`Intercambio de Ayni procesado: ${ayniTransaction.id}`);

      return {
        ayniTransaction,
        originalValue: estimatedValue,
        finalValue,
        ayniMultiplier,
        success: true,
        message: 'Intercambio de Ayni registrado exitosamente'
      };

    } catch (error) {
      this.logger.error(`Error al procesar intercambio de Ayni:`, error);
      throw error;
    }
  }

  /**
   * 📊 Obtener dashboard completo de economía del usuario
   */
  async getUserEconomyDashboard(userId: string) {
    try {
      const [balance, reciprocityScore, recentTransactions, stats] = await Promise.all([
        this.unitsService.getUserBalance(userId),
        this.reciprocityService.getUserReciprocityScore(userId),
        this.unitsService.getUserTransactionHistory(userId, { page: 1, limit: 10 }),
        this.unitsService.getUserStats(userId)
      ]);

      return {
        balance,
        reciprocityScore,
        recentTransactions: recentTransactions.transactions,
        stats,
        ayniOpportunities: await this.getAyniOpportunities(userId),
        projectedRewards: await this.getProjectedRewards(userId)
      };

    } catch (error) {
      this.logger.error(`Error al obtener dashboard de economía para ${userId}:`, error);
      throw error;
    }
  }

  // ═══════════════════════════════════════════════════════════════
  // 🔧 MÉTODOS PRIVADOS
  // ═══════════════════════════════════════════════════════════════

  /**
   * 🌟 Calcular multiplicador de intercambio Ayni
   */
  private calculateAyniExchangeMultiplier(giverScore: number, receiverScore: number): number {
    // Multiplicador basado en los scores de reciprocidad de ambos usuarios
    const averageScore = (giverScore + receiverScore) / 2;
    
    if (averageScore >= 90) return 1.5;  // Alta reciprocidad mutua
    if (averageScore >= 70) return 1.3;  // Buena reciprocidad mutua
    if (averageScore >= 50) return 1.1;  // Reciprocidad moderada
    return 1.0; // Sin bonificación
  }

  /**
   * 🎯 Obtener oportunidades de Ayni
   */
  private async getAyniOpportunities(userId: string) {
    // TODO: Implementar lógica para encontrar oportunidades de intercambio
    return [];
  }

  /**
   * 🔮 Obtener recompensas proyectadas
   */
  private async getProjectedRewards(userId: string) {
    // TODO: Implementar proyección de recompensas basada en tendencias
    return [];
  }
}