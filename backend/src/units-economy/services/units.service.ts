import { Injectable, Inject, Logger } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { 
  CreateUnitsTransactionDto, 
  UnitsTransactionResponseDto,
  GetUnitsBalanceDto,
  UnitsHistoryQueryDto,
  UnitsTransactionType,
  UnitsTransactionStatus
} from '../dto/units-transaction.dto';
import { ReciprocityService } from './reciprocity.service';

/**
 * 🌌 Units Service - Lógica de Negocio de Economía Ünits CoomÜnity
 * 
 * 🎯 INTENT: Gestionar todas las operaciones de Ünits con reciprocidad y transparencia total
 * 🌟 VALUES: Bien Común (distribución justa), Reciprocidad (incentivos balanceados), Transparencia (operaciones visibles)
 * ⚡ CONSTRAINTS: Transacciones atómicas, validación estricta, logging completo, performance optimizada
 */
@Injectable()
export class UnitsService {
  private readonly logger = new Logger(UnitsService.name);

  constructor(
    @Inject() private readonly prisma: PrismaService,
    @Inject() private readonly reciprocityService: ReciprocityService
  ) {}

  /**
   * 💰 Obtener balance completo de Ünits del usuario
   */
  async getUserBalance(userId: string): Promise<GetUnitsBalanceDto> {
    try {
      this.logger.log(`Obteniendo balance para usuario: ${userId}`);

      // Obtener transacciones confirmadas del usuario
      const [sentTransactions, receivedTransactions, pendingTransactions] = await Promise.all([
        // Ünits enviadas (confirmadas)
        this.prisma.unitsTransaction.aggregate({
          where: {
            senderId: userId,
            status: UnitsTransactionStatus.CONFIRMED
          },
          _sum: { amount: true }
        }),
        
        // Ünits recibidas (confirmadas)
        this.prisma.unitsTransaction.aggregate({
          where: {
            recipientId: userId,
            status: UnitsTransactionStatus.CONFIRMED
          },
          _sum: { amount: true }
        }),

        // Ünits pendientes de confirmación
        this.prisma.unitsTransaction.aggregate({
          where: {
            OR: [
              { senderId: userId, status: UnitsTransactionStatus.PENDING },
              { recipientId: userId, status: UnitsTransactionStatus.PENDING }
            ]
          },
          _sum: { amount: true }
        })
      ]);

      const totalEarned = receivedTransactions._sum.amount || 0;
      const totalSpent = sentTransactions._sum.amount || 0;
      const pendingBalance = pendingTransactions._sum.amount || 0;
      const currentBalance = totalEarned - totalSpent;

      // Obtener score de reciprocidad
      const reciprocityData = await this.reciprocityService.getUserReciprocityScore(userId);

      const balance: GetUnitsBalanceDto = {
        currentBalance,
        pendingBalance,
        totalEarned,
        totalSpent,
        reciprocityScore: reciprocityData.currentScore,
        ayniLevel: reciprocityData.ayniLevel
      };

      this.logger.log(`Balance calculado para ${userId}: ${currentBalance} Ünits`);
      return balance;

    } catch (error) {
      this.logger.error(`Error al obtener balance para ${userId}:`, error);
      throw new Error(`Error al calcular balance: ${error.message}`);
    }
  }

  /**
   * 📊 Obtener historial paginado de transacciones
   */
  async getUserTransactionHistory(
    userId: string, 
    query: UnitsHistoryQueryDto
  ): Promise<{ transactions: UnitsTransactionResponseDto[], total: number, pages: number }> {
    try {
      this.logger.log(`Obteniendo historial para usuario: ${userId}`);

      const { page = 1, limit = 20, type, status } = query;
      const skip = (page - 1) * limit;

      // Construir filtros
      const where = {
        OR: [
          { senderId: userId },
          { recipientId: userId }
        ],
        ...(type && { type }),
        ...(status && { status })
      };

      const [transactions, total] = await Promise.all([
        this.prisma.unitsTransaction.findMany({
          where,
          skip,
          take: limit,
          orderBy: { createdAt: 'desc' },
          include: {
            sender: { select: { id: true, username: true, avatar: true } },
            recipient: { select: { id: true, username: true, avatar: true } }
          }
        }),
        this.prisma.unitsTransaction.count({ where })
      ]);

      const pages = Math.ceil(total / limit);

      const mappedTransactions: UnitsTransactionResponseDto[] = transactions.map(tx => ({
        id: tx.id,
        senderId: tx.senderId,
        recipientId: tx.recipientId,
        amount: tx.amount,
        type: tx.type as UnitsTransactionType,
        status: tx.status as UnitsTransactionStatus,
        description: tx.description,
        metadata: tx.metadata as Record<string, any>,
        createdAt: tx.createdAt,
        updatedAt: tx.updatedAt,
        reciprocityScore: tx.reciprocityScore,
        ayniPercentage: tx.ayniPercentage
      }));

      return { transactions: mappedTransactions, total, pages };

    } catch (error) {
      this.logger.error(`Error al obtener historial para ${userId}:`, error);
      throw new Error(`Error al obtener historial: ${error.message}`);
    }
  }

  /**
   * 💸 Crear nueva transacción de Ünits
   */
  async createTransaction(
    senderId: string, 
    transactionDto: CreateUnitsTransactionDto
  ): Promise<UnitsTransactionResponseDto> {
    try {
      this.logger.log(`Creando transacción: ${senderId} -> ${transactionDto.recipientId} (${transactionDto.amount} Ünits)`);

      // Validar que el emisor tenga saldo suficiente
      const senderBalance = await this.getUserBalance(senderId);
      if (senderBalance.currentBalance < transactionDto.amount) {
        throw new Error('Saldo insuficiente para realizar la transferencia');
      }

      // Validar que el receptor exista
      const recipient = await this.prisma.user.findUnique({
        where: { id: transactionDto.recipientId }
      });
      if (!recipient) {
        throw new Error('Usuario receptor no encontrado');
      }

      // Obtener scores de reciprocidad para calcular bonificaciones
      const [senderReciprocity, recipientReciprocity] = await Promise.all([
        this.reciprocityService.getUserReciprocityScore(senderId),
        this.reciprocityService.getUserReciprocityScore(transactionDto.recipientId)
      ]);

      // Calcular bonificación por Ayni (basada en reciprocidad del emisor)
      const ayniPercentage = this.calculateAyniBonus(senderReciprocity.currentScore);
      const finalAmount = Math.floor(transactionDto.amount * (1 + ayniPercentage / 100));

      // Crear transacción en una transacción de base de datos
      const transaction = await this.prisma.$transaction(async (prisma) => {
        // Crear el registro de transacción
        const newTransaction = await prisma.unitsTransaction.create({
          data: {
            senderId,
            recipientId: transactionDto.recipientId,
            amount: finalAmount, // Monto con bonificación
            originalAmount: transactionDto.amount, // Monto original
            type: transactionDto.type,
            status: UnitsTransactionStatus.CONFIRMED,
            description: transactionDto.description,
            metadata: {
              ...transactionDto.metadata,
              ayniBonus: finalAmount - transactionDto.amount,
              senderReciprocityScore: senderReciprocity.currentScore,
              recipientReciprocityScore: recipientReciprocity.currentScore
            },
            reciprocityScore: senderReciprocity.currentScore,
            ayniPercentage
          }
        });

        // Registrar eventos de reciprocidad
        await Promise.all([
          // Evento de dar para el emisor
          this.reciprocityService.recordReciprocityEvent({
            eventType: 'give' as any,
            actorId: senderId,
            recipientId: transactionDto.recipientId,
            magnitude: Math.min(10, Math.ceil(transactionDto.amount / 100)), // Magnitud basada en cantidad
            context: 'units_transfer',
            resourceId: newTransaction.id,
            description: `Transferencia de ${transactionDto.amount} Ünits`
          }),
          
          // Evento de recibir para el receptor
          this.reciprocityService.recordReciprocityEvent({
            eventType: 'receive' as any,
            actorId: transactionDto.recipientId,
            recipientId: senderId,
            magnitude: Math.min(10, Math.ceil(transactionDto.amount / 100)),
            context: 'units_transfer',
            resourceId: newTransaction.id,
            description: `Recepción de ${finalAmount} Ünits`
          })
        ]);

        return newTransaction;
      });

      this.logger.log(`Transacción creada exitosamente: ${transaction.id}`);

      return {
        id: transaction.id,
        senderId: transaction.senderId,
        recipientId: transaction.recipientId,
        amount: transaction.amount,
        type: transaction.type as UnitsTransactionType,
        status: transaction.status as UnitsTransactionStatus,
        description: transaction.description,
        metadata: transaction.metadata as Record<string, any>,
        createdAt: transaction.createdAt,
        updatedAt: transaction.updatedAt,
        reciprocityScore: transaction.reciprocityScore,
        ayniPercentage: transaction.ayniPercentage
      };

    } catch (error) {
      this.logger.error(`Error al crear transacción:`, error);
      throw error;
    }
  }

  /**
   * 🔍 Obtener transacción específica
   */
  async getTransaction(transactionId: string, userId: string): Promise<UnitsTransactionResponseDto | null> {
    try {
      const transaction = await this.prisma.unitsTransaction.findFirst({
        where: {
          id: transactionId,
          OR: [
            { senderId: userId },
            { recipientId: userId }
          ]
        }
      });

      if (!transaction) return null;

      return {
        id: transaction.id,
        senderId: transaction.senderId,
        recipientId: transaction.recipientId,
        amount: transaction.amount,
        type: transaction.type as UnitsTransactionType,
        status: transaction.status as UnitsTransactionStatus,
        description: transaction.description,
        metadata: transaction.metadata as Record<string, any>,
        createdAt: transaction.createdAt,
        updatedAt: transaction.updatedAt,
        reciprocityScore: transaction.reciprocityScore,
        ayniPercentage: transaction.ayniPercentage
      };

    } catch (error) {
      this.logger.error(`Error al obtener transacción ${transactionId}:`, error);
      throw new Error(`Error al obtener transacción: ${error.message}`);
    }
  }

  /**
   * 📈 Obtener estadísticas del usuario
   */
  async getUserStats(userId: string) {
    try {
      const [balance, reciprocityScore, monthlyStats] = await Promise.all([
        this.getUserBalance(userId),
        this.reciprocityService.getUserReciprocityScore(userId),
        this.getMonthlyStats(userId)
      ]);

      return {
        balance,
        reciprocityScore,
        monthlyStats,
        projectedRewards: await this.calculateProjectedRewards(userId)
      };

    } catch (error) {
      this.logger.error(`Error al obtener estadísticas para ${userId}:`, error);
      throw new Error(`Error al obtener estadísticas: ${error.message}`);
    }
  }

  /**
   * 🎁 Obtener recompensas disponibles
   */
  async getAvailableRewards(userId: string) {
    try {
      const reciprocityScore = await this.reciprocityService.getUserReciprocityScore(userId);
      return await this.calculateAvailableRewards(userId, reciprocityScore.currentScore);
    } catch (error) {
      this.logger.error(`Error al obtener recompensas para ${userId}:`, error);
      throw new Error(`Error al obtener recompensas: ${error.message}`);
    }
  }

  /**
   * 🏆 Reclamar recompensa
   */
  async claimReward(userId: string, rewardId: string) {
    try {
      // Implementar lógica de reclamación de recompensas
      this.logger.log(`Usuario ${userId} reclama recompensa ${rewardId}`);
      // TODO: Implementar reclamación de recompensas
      return { success: true, message: 'Recompensa reclamada exitosamente' };
    } catch (error) {
      this.logger.error(`Error al reclamar recompensa:`, error);
      throw error;
    }
  }

  // ═══════════════════════════════════════════════════════════════
  // 🔧 MÉTODOS PRIVADOS DE CÁLCULO
  // ═══════════════════════════════════════════════════════════════

  /**
   * 🌟 Calcular bonificación de Ayni basada en score de reciprocidad
   */
  private calculateAyniBonus(reciprocityScore: number): number {
    if (reciprocityScore >= 95) return 20; // Cosmic: 20% bonus
    if (reciprocityScore >= 80) return 15; // Sage: 15% bonus
    if (reciprocityScore >= 60) return 10; // Generous: 10% bonus
    if (reciprocityScore >= 40) return 5;  // Balanced: 5% bonus
    if (reciprocityScore >= 20) return 2;  // Growing: 2% bonus
    return 0; // Beginner: sin bonus
  }

  /**
   * 📊 Obtener estadísticas mensuales
   */
  private async getMonthlyStats(userId: string) {
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const monthlyTransactions = await this.prisma.unitsTransaction.findMany({
      where: {
        OR: [{ senderId: userId }, { recipientId: userId }],
        createdAt: { gte: startOfMonth },
        status: UnitsTransactionStatus.CONFIRMED
      }
    });

    const sent = monthlyTransactions
      .filter(tx => tx.senderId === userId)
      .reduce((sum, tx) => sum + tx.amount, 0);

    const received = monthlyTransactions
      .filter(tx => tx.recipientId === userId)
      .reduce((sum, tx) => sum + tx.amount, 0);

    return {
      sent,
      received,
      netFlow: received - sent,
      transactionCount: monthlyTransactions.length
    };
  }

  /**
   * 🔮 Calcular recompensas proyectadas
   */
  private async calculateProjectedRewards(userId: string) {
    const reciprocityScore = await this.reciprocityService.getUserReciprocityScore(userId);
    const currentBonus = this.calculateAyniBonus(reciprocityScore.currentScore);
    
    return {
      currentBonus,
      nextLevelBonus: this.calculateAyniBonus(reciprocityScore.currentScore + 20),
      pointsToNextLevel: reciprocityScore.pointsToNextLevel
    };
  }

  /**
   * 🎁 Calcular recompensas disponibles
   */
  private async calculateAvailableRewards(userId: string, reciprocityScore: number) {
    // TODO: Implementar lógica de recompensas disponibles
    return [];
  }
}