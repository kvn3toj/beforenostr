import { Injectable, BadRequestException, NotFoundException, Inject } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateLetsTransactionDto, LetsBalanceDto, LetsExpiryCheckDto, LetsTransactionType, LetsTransactionStatus } from './dto/lets.dto';
import type { Token, Transaction, User, Wallet } from '../generated/prisma';

@Injectable()
export class LetsService {
  constructor(@Inject(PrismaService) private readonly prisma: PrismaService) {
    console.log('>>> LetsService CONSTRUCTOR: this.prisma IS', this.prisma ? 'DEFINED' : 'UNDEFINED');
  }

  /**
   * Obtener balance de Ünits de un usuario con información de caducidad
   */
  async getUserBalance(dto: LetsBalanceDto) {
    console.log('>>> LetsService.getUserBalance: Getting balance for user', dto.userId);

    const user = await this.prisma.user.findUnique({
      where: { id: dto.userId },
      include: {
        wallet: true,
        tokens: {
          where: {
            status: 'ACTIVE',
            ...(dto.tokenType && { type: dto.tokenType })
          },
          orderBy: { caducityDate: 'asc' }
        }
      }
    });

    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    // Calcular balance total y por tipo
    const balanceByType = user.tokens.reduce((acc, token) => {
      if (!acc[token.type]) {
        acc[token.type] = {
          total: 0,
          expiring: 0,
          expired: 0
        };
      }
      
      acc[token.type].total += token.amount;
      
      // Verificar si está próximo a caducar (30 días)
      if (token.caducityDate) {
        const daysToExpiry = Math.ceil((token.caducityDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
        if (daysToExpiry <= 30 && daysToExpiry > 0) {
          acc[token.type].expiring += token.amount;
        } else if (daysToExpiry <= 0) {
          acc[token.type].expired += token.amount;
        }
      }
      
      return acc;
    }, {} as Record<string, { total: number; expiring: number; expired: number }>);

    return {
      userId: dto.userId,
      walletBalance: {
        units: user.wallet?.balanceUnits || 0,
        toins: user.wallet?.balanceToins || 0
      },
      tokenBalance: balanceByType,
      totalActiveTokens: user.tokens.reduce((sum, token) => sum + token.amount, 0)
    };
  }

  /**
   * Realizar intercambio de Ünits entre usuarios
   */
  async exchangeUnits(dto: CreateLetsTransactionDto) {
    console.log('>>> LetsService.exchangeUnits: Processing exchange', dto);

    // Verificar que los usuarios existen y tienen wallets
    const [fromUser, toUser] = await Promise.all([
      this.prisma.user.findUnique({
        where: { id: dto.fromUserId },
        include: { wallet: true, tokens: { where: { status: 'ACTIVE' } } }
      }),
      this.prisma.user.findUnique({
        where: { id: dto.toUserId },
        include: { wallet: true }
      })
    ]);

    if (!fromUser || !toUser) {
      throw new NotFoundException('Usuario no encontrado');
    }

    if (!fromUser.wallet || !toUser.wallet) {
      throw new BadRequestException('Ambos usuarios deben tener wallets activas');
    }

    // Verificar balance suficiente
    const availableBalance = fromUser.tokens.reduce((sum, token) => sum + token.amount, 0);
    if (availableBalance < dto.amount) {
      throw new BadRequestException('Balance insuficiente para realizar el intercambio');
    }

    // Realizar transacción en una transacción de base de datos
    return await this.prisma.$transaction(async (tx) => {
      // 1. Crear registro de transacción
      const transaction = await tx.transaction.create({
        data: {
          fromUserId: dto.fromUserId,
          toUserId: dto.toUserId,
          amount: dto.amount,
          tokenType: 'CIRCULATING_UNIT',
          type: 'EXCHANGE',
          status: 'COMPLETED',
          description: dto.description || `Intercambio LETS de ${dto.amount} Ünits`
        }
      });

      // 2. Actualizar balances en wallets
      await tx.wallet.update({
        where: { userId: dto.fromUserId },
        data: { balanceUnits: { decrement: dto.amount } }
      });

      await tx.wallet.update({
        where: { userId: dto.toUserId },
        data: { balanceUnits: { increment: dto.amount } }
      });

      // 3. Manejar tokens del remitente (usar FIFO - primero los que caducan antes)
      let remainingAmount = dto.amount;
      const tokensToUpdate = fromUser.tokens
        .sort((a, b) => {
          if (!a.caducityDate && !b.caducityDate) return 0;
          if (!a.caducityDate) return 1;
          if (!b.caducityDate) return -1;
          return a.caducityDate.getTime() - b.caducityDate.getTime();
        });

      for (const token of tokensToUpdate) {
        if (remainingAmount <= 0) break;

        const amountToDeduct = Math.min(token.amount, remainingAmount);
        
        if (amountToDeduct === token.amount) {
          // Marcar token como usado
          await tx.token.update({
            where: { id: token.id },
            data: { status: 'USED' }
          });
        } else {
          // Reducir cantidad del token
          await tx.token.update({
            where: { id: token.id },
            data: { amount: token.amount - amountToDeduct }
          });
        }

        remainingAmount -= amountToDeduct;
      }

      // 4. Crear nuevo token para el receptor
      await tx.token.create({
        data: {
          userId: dto.toUserId,
          amount: dto.amount,
          type: 'CIRCULATING_UNIT',
          status: 'ACTIVE',
          source: 'CONVERSION',
          caducityDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) // 1 año de caducidad
        }
      });

      return transaction;
    });
  }

  /**
   * Verificar y procesar tokens caducados
   */
  async processExpiredTokens(dto: LetsExpiryCheckDto) {
    console.log('>>> LetsService.processExpiredTokens: Processing expired tokens for user', dto.userId);

    const expiredTokens = await this.prisma.token.findMany({
      where: {
        userId: dto.userId,
        status: 'ACTIVE',
        caducityDate: {
          lte: new Date()
        },
        ...(dto.tokenType && { type: dto.tokenType })
      }
    });

    if (expiredTokens.length === 0) {
      return { message: 'No hay tokens caducados', expiredCount: 0, totalExpiredAmount: 0 };
    }

    const totalExpiredAmount = expiredTokens.reduce((sum, token) => sum + token.amount, 0);

    // Marcar tokens como expirados y actualizar wallet
    await this.prisma.$transaction(async (tx) => {
      // Marcar tokens como expirados
      await tx.token.updateMany({
        where: {
          id: { in: expiredTokens.map(t => t.id) }
        },
        data: { status: 'EXPIRED' }
      });

      // Actualizar balance en wallet
      await tx.wallet.update({
        where: { userId: dto.userId },
        data: { balanceUnits: { decrement: totalExpiredAmount } }
      });

      // Crear registro de transacción para auditoría
      await tx.transaction.create({
        data: {
          toUserId: dto.userId,
          amount: totalExpiredAmount,
          tokenType: 'CIRCULATING_UNIT',
          type: 'RECEIVE', // Transacción negativa por caducidad
          status: 'COMPLETED',
          description: `Caducidad automática de ${expiredTokens.length} tokens`
        }
      });
    });

    return {
      message: `Se procesaron ${expiredTokens.length} tokens caducados`,
      expiredCount: expiredTokens.length,
      totalExpiredAmount
    };
  }

  /**
   * Obtener historial de transacciones LETS de un usuario
   */
  async getUserLetsHistory(userId: string, limit: number = 50) {
    console.log('>>> LetsService.getUserLetsHistory: Getting LETS history for user', userId);

    const transactions = await this.prisma.transaction.findMany({
      where: {
        OR: [
          { fromUserId: userId },
          { toUserId: userId }
        ],
        type: { in: ['EXCHANGE', 'CONVERT'] }
      },
      include: {
        fromUser: { select: { id: true, email: true, firstName: true, lastName: true } },
        toUser: { select: { id: true, email: true, firstName: true, lastName: true } }
      },
      orderBy: { createdAt: 'desc' },
      take: limit
    });

    return transactions.map(tx => ({
      ...tx,
      direction: tx.fromUserId === userId ? 'OUTGOING' : 'INCOMING'
    }));
  }

  /**
   * Verificar si un usuario puede realizar saldos negativos (según reglas LETS)
   */
  async checkNegativeBalanceEligibility(userId: string) {
    console.log('>>> LetsService.checkNegativeBalanceEligibility: Checking eligibility for user', userId);

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        wallet: true,
        transactions: {
          where: { status: 'COMPLETED' },
          orderBy: { createdAt: 'desc' },
          take: 10
        }
      }
    });

    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    // Reglas básicas para saldo negativo:
    // 1. Usuario debe tener al menos 30 días de antigüedad
    // 2. Debe haber realizado al menos 5 transacciones exitosas
    // 3. No debe tener historial de transacciones fallidas recientes

    const accountAge = Math.ceil((Date.now() - user.createdAt.getTime()) / (1000 * 60 * 60 * 24));
    const successfulTransactions = user.transactions.filter(tx => tx.status === 'COMPLETED').length;
    
    const isEligible = accountAge >= 30 && successfulTransactions >= 5;
    const maxNegativeBalance = isEligible ? -100 : 0; // Máximo -100 Ünits

    return {
      isEligible,
      accountAge,
      successfulTransactions,
      maxNegativeBalance,
      currentBalance: user.wallet?.balanceUnits || 0
    };
  }
} 