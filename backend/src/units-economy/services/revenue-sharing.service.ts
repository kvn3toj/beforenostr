import { Injectable, Inject, Logger } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { 
  CreateRevenueSharingDto,
  RevenueSharingResponseDto,
  RevenueSharingCalculationDto,
  RevenueSharingHistoryQueryDto
} from '../dto/revenue-sharing.dto';
import { ReciprocityService } from './reciprocity.service';
import { UnitsService } from './units.service';
import { UnitsTransactionType } from '../dto/units-transaction.dto';

/**
 * 🌌 Revenue Sharing Service - Distribución Automática de Ingresos CoomÜnity
 * 
 * 🎯 INTENT: Automatizar distribución equitativa de ingresos basada en contribuciones y reciprocidad
 * 🌟 VALUES: Bien Común (beneficio compartido), Reciprocidad (retorno justo), Transparencia (proceso visible)
 * ⚡ CONSTRAINTS: Matemáticas precisas, transacciones atómicas, trazabilidad completa, escalabilidad
 */
@Injectable()
export class RevenueSharingService {
  private readonly logger = new Logger(RevenueSharingService.name);

  constructor(
    @Inject() private readonly prisma: PrismaService,
    @Inject() private readonly reciprocityService: ReciprocityService
  ) {}

  /**
   * 💰 Crear y ejecutar distribución de ingresos
   */
  async createRevenueSharing(distributionDto: CreateRevenueSharingDto): Promise<RevenueSharingResponseDto> {
    try {
      this.logger.log(`Iniciando distribución de ${distributionDto.totalAmount} Ünits para ${distributionDto.sourceType}:${distributionDto.sourceId}`);

      // Validar que los porcentajes sumen 100%
      const totalPercentage = distributionDto.participants.reduce((sum, p) => sum + p.percentage, 0);
      if (Math.abs(totalPercentage - 100) > 0.01) {
        throw new Error(`Los porcentajes deben sumar 100%, suma actual: ${totalPercentage}%`);
      }

      // Obtener scores de reciprocidad de todos los participantes
      const participantsWithReciprocity = await Promise.all(
        distributionDto.participants.map(async (participant) => {
          const reciprocityScore = await this.reciprocityService.getUserReciprocityScore(participant.participantId);
          return {
            ...participant,
            reciprocityScore: reciprocityScore.currentScore
          };
        })
      );

      // Calcular distribución con bonificaciones de Ayni
      const calculations = this.calculateDistribution(
        distributionDto.totalAmount,
        participantsWithReciprocity,
        distributionDto.applyAyniBenefit
      );

      // Crear registro de distribución en transacción de BD
      const distribution = await this.prisma.$transaction(async (prisma) => {
        // Crear registro principal de distribución
        const distributionRecord = await prisma.revenueSharing.create({
          data: {
            totalAmount: distributionDto.totalAmount,
            sourceId: distributionDto.sourceId,
            sourceType: distributionDto.sourceType,
            description: distributionDto.description,
            status: 'processing',
            metadata: {
              ...distributionDto.metadata,
              originalParticipants: distributionDto.participants,
              applyAyniBenefit: distributionDto.applyAyniBenefit
            }
          }
        });

        // Crear transacciones individuales para cada participante
        const transactionIds: string[] = [];
        
        for (const calculation of calculations) {
          if (calculation.finalAmount > 0) {
            const transaction = await prisma.unitsTransaction.create({
              data: {
                senderId: 'system', // Sistema como emisor
                recipientId: calculation.participantId,
                amount: calculation.finalAmount,
                originalAmount: calculation.baseAmount,
                type: UnitsTransactionType.REVENUE_SHARING,
                status: 'confirmed',
                description: `Revenue sharing: ${distributionDto.description || distributionDto.sourceType}`,
                metadata: {
                  revenueSharingId: distributionRecord.id,
                  sourceId: distributionDto.sourceId,
                  sourceType: distributionDto.sourceType,
                  baseAmount: calculation.baseAmount,
                  reciprocityBonus: calculation.reciprocityBonus,
                  ayniBonus: calculation.ayniBonus,
                  effectivePercentage: calculation.effectivePercentage
                },
                reciprocityScore: participantsWithReciprocity.find(p => p.participantId === calculation.participantId)?.reciprocityScore || 0
              }
            });

            transactionIds.push(transaction.id);

            // Registrar evento de reciprocidad (recibir ingresos)
            await this.reciprocityService.recordReciprocityEvent({
              eventType: 'receive' as any,
              actorId: calculation.participantId,
              magnitude: Math.min(10, Math.ceil(calculation.finalAmount / 1000)), // Magnitud basada en cantidad
              context: 'revenue_sharing',
              resourceId: distributionRecord.id,
              description: `Revenue sharing de ${calculation.finalAmount} Ünits`
            });
          }
        }

        // Actualizar distribución con IDs de transacciones
        const totalDistributed = calculations.reduce((sum, calc) => sum + calc.finalAmount, 0);
        const remainder = distributionDto.totalAmount - totalDistributed;

        await prisma.revenueSharing.update({
          where: { id: distributionRecord.id },
          data: {
            status: 'completed',
            totalDistributed,
            remainder,
            transactionIds,
            calculations: calculations,
            completedAt: new Date()
          }
        });

        return {
          ...distributionRecord,
          totalDistributed,
          remainder,
          transactionIds,
          calculations,
          completedAt: new Date()
        };
      });

      this.logger.log(`Distribución completada: ${distribution.id}, ${calculations.length} participantes`);

      const response: RevenueSharingResponseDto = {
        id: distribution.id,
        totalAmount: distribution.totalAmount,
        sourceId: distribution.sourceId,
        sourceType: distribution.sourceType,
        status: 'completed',
        calculations,
        totalDistributed: distribution.totalDistributed,
        remainder: distribution.remainder,
        description: distribution.description,
        createdAt: distribution.createdAt,
        completedAt: distribution.completedAt,
        transactionIds: distribution.transactionIds
      };

      return response;

    } catch (error) {
      this.logger.error(`Error en distribución de ingresos:`, error);
      throw new Error(`Error en revenue sharing: ${error.message}`);
    }
  }

  /**
   * 📊 Obtener historial de distribuciones
   */
  async getRevenueSharingHistory(query: RevenueSharingHistoryQueryDto): Promise<{
    distributions: RevenueSharingResponseDto[],
    total: number,
    pages: number
  }> {
    try {
      const { page = 1, limit = 20, sourceType, participantId, fromDate, toDate } = query;
      const skip = (page - 1) * limit;

      // Construir filtros
      const where: any = {};
      
      if (sourceType) where.sourceType = sourceType;
      if (fromDate || toDate) {
        where.createdAt = {};
        if (fromDate) where.createdAt.gte = new Date(fromDate);
        if (toDate) where.createdAt.lte = new Date(toDate);
      }

      // Si se filtra por participante, usar subquery
      if (participantId) {
        const distributionIds = await this.prisma.unitsTransaction.findMany({
          where: {
            recipientId: participantId,
            type: UnitsTransactionType.REVENUE_SHARING
          },
          select: { metadata: true }
        }).then(transactions => 
          transactions
            .map(tx => (tx.metadata as any)?.revenueSharingId)
            .filter(Boolean)
        );
        
        where.id = { in: distributionIds };
      }

      const [distributions, total] = await Promise.all([
        this.prisma.revenueSharing.findMany({
          where,
          skip,
          take: limit,
          orderBy: { createdAt: 'desc' }
        }),
        this.prisma.revenueSharing.count({ where })
      ]);

      const pages = Math.ceil(total / limit);

      const mappedDistributions: RevenueSharingResponseDto[] = distributions.map(dist => ({
        id: dist.id,
        totalAmount: dist.totalAmount,
        sourceId: dist.sourceId,
        sourceType: dist.sourceType,
        status: dist.status as any,
        calculations: (dist.calculations as any) || [],
        totalDistributed: dist.totalDistributed || 0,
        remainder: dist.remainder || 0,
        description: dist.description,
        createdAt: dist.createdAt,
        completedAt: dist.completedAt,
        transactionIds: (dist.transactionIds as string[]) || []
      }));

      return { distributions: mappedDistributions, total, pages };

    } catch (error) {
      this.logger.error(`Error al obtener historial de revenue sharing:`, error);
      throw new Error(`Error al obtener historial: ${error.message}`);
    }
  }

  /**
   * 🔍 Obtener detalles de distribución específica
   */
  async getDistributionDetails(distributionId: string): Promise<RevenueSharingResponseDto | null> {
    try {
      const distribution = await this.prisma.revenueSharing.findUnique({
        where: { id: distributionId }
      });

      if (!distribution) return null;

      return {
        id: distribution.id,
        totalAmount: distribution.totalAmount,
        sourceId: distribution.sourceId,
        sourceType: distribution.sourceType,
        status: distribution.status as any,
        calculations: (distribution.calculations as any) || [],
        totalDistributed: distribution.totalDistributed || 0,
        remainder: distribution.remainder || 0,
        description: distribution.description,
        createdAt: distribution.createdAt,
        completedAt: distribution.completedAt,
        transactionIds: (distribution.transactionIds as string[]) || []
      };

    } catch (error) {
      this.logger.error(`Error al obtener distribución ${distributionId}:`, error);
      throw new Error(`Error al obtener distribución: ${error.message}`);
    }
  }

  // ═══════════════════════════════════════════════════════════════
  // 🔧 MÉTODOS PRIVADOS DE CÁLCULO
  // ═══════════════════════════════════════════════════════════════

  /**
   * 🧮 Calcular distribución con bonificaciones de reciprocidad
   */
  private calculateDistribution(
    totalAmount: number,
    participants: Array<{ participantId: string, percentage: number, reciprocityScore: number }>,
    applyAyniBenefit: boolean = true
  ): RevenueSharingCalculationDto[] {
    
    const calculations: RevenueSharingCalculationDto[] = [];
    let totalCalculatedAmount = 0;

    for (const participant of participants) {
      // Cantidad base según porcentaje
      const baseAmount = Math.floor((totalAmount * participant.percentage) / 100);

      // Bonificación por reciprocidad
      const reciprocityBonusRate = applyAyniBenefit ? this.calculateReciprocityBonus(participant.reciprocityScore) : 0;
      const reciprocityBonus = Math.floor(baseAmount * (reciprocityBonusRate / 100));

      // Bonificación de Ayni (adicional a reciprocidad)
      const ayniBonusRate = applyAyniBenefit ? this.calculateAyniBonus(participant.reciprocityScore) : 0;
      const ayniBonus = Math.floor(baseAmount * (ayniBonusRate / 100));

      // Monto final
      const finalAmount = baseAmount + reciprocityBonus + ayniBonus;

      // Porcentaje efectivo final
      const effectivePercentage = (finalAmount / totalAmount) * 100;

      calculations.push({
        participantId: participant.participantId,
        baseAmount,
        reciprocityBonus,
        ayniBonus,
        finalAmount,
        effectivePercentage
      });

      totalCalculatedAmount += finalAmount;
    }

    // Ajustar redondeos distribuyendo el remanente
    const remainder = totalAmount - totalCalculatedAmount;
    if (remainder > 0 && calculations.length > 0) {
      // Distribuir el remanente entre los participantes con mayor porcentaje
      const sortedCalculations = [...calculations].sort((a, b) => b.finalAmount - a.finalAmount);
      
      for (let i = 0; i < remainder && i < sortedCalculations.length; i++) {
        const calc = calculations.find(c => c.participantId === sortedCalculations[i].participantId);
        if (calc) {
          calc.finalAmount += 1;
          calc.effectivePercentage = (calc.finalAmount / totalAmount) * 100;
        }
      }
    }

    return calculations;
  }

  /**
   * 🏆 Calcular bonificación por reciprocidad
   */
  private calculateReciprocityBonus(reciprocityScore: number): number {
    // Bonificación progresiva por reciprocidad (0-15%)
    if (reciprocityScore >= 95) return 15; // Cosmic: 15% bonus
    if (reciprocityScore >= 80) return 12; // Sage: 12% bonus
    if (reciprocityScore >= 60) return 8;  // Generous: 8% bonus
    if (reciprocityScore >= 40) return 5;  // Balanced: 5% bonus
    if (reciprocityScore >= 20) return 2;  // Growing: 2% bonus
    return 0; // Beginner: sin bonus
  }

  /**
   * 🌟 Calcular bonificación de Ayni
   */
  private calculateAyniBonus(reciprocityScore: number): number {
    // Bonificación adicional por Ayni (reciprocidad sagrada) (0-10%)
    if (reciprocityScore >= 95) return 10; // Cosmic: 10% bonus adicional
    if (reciprocityScore >= 80) return 8;  // Sage: 8% bonus adicional
    if (reciprocityScore >= 60) return 5;  // Generous: 5% bonus adicional
    if (reciprocityScore >= 40) return 3;  // Balanced: 3% bonus adicional
    if (reciprocityScore >= 20) return 1;  // Growing: 1% bonus adicional
    return 0; // Beginner: sin bonus adicional
  }
}