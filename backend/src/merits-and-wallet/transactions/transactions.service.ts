import {
  Injectable,
  ConflictException,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { WalletsService } from '../wallets/wallets.service';
import { Transaction, Currency } from '../../generated/prisma';
import {
  SendTransactionDto,
  TransactionCurrency,
} from './dto/send-transaction.dto';
import { Merit } from '../../generated/prisma';
import { Prisma } from '../../generated/prisma';
import Decimal from 'decimal.js';

// Define a basic type for the authenticated user passed from the controller
type AuthenticatedUser = { id: string; roles: string[] /* other properties */ };

// Basic type for eventData - its structure depends on the transaction source/type
export type TransactionEventData = Record<string, unknown>; // Can be refined if specific structures are known

@Injectable()
export class TransactionsService {
  constructor(
    private prisma: PrismaService,
    private walletsService: WalletsService // Inject WalletsService
  ) {}

  async createTransaction(data: {
    fromUserId?: string;
    toUserId: string;
    amount: number;
    currency: Currency;
    description?: string;
    metadata?: Record<string, unknown>;
  }): Promise<Transaction> {
    if (data.amount <= 0) {
      throw new Error('El monto debe ser mayor a 0');
    }
    const recipient = await this.prisma.user.findUnique({ where: { id: data.toUserId } });
    if (!recipient) {
      throw new NotFoundException(`El destinatario con id '${data.toUserId}' no fue encontrado en el ecosistema.`);
    }
    const [fromWallet, toWallet] = await Promise.all([
      data.fromUserId
        ? this.walletsService.getWalletForUserAdmin(data.fromUserId)
        : null,
      this.walletsService.getWalletForUserAdmin(data.toUserId)
    ]);
    const transaction = await this.prisma.$transaction(async (prisma) => {
      const transactionData: Prisma.TransactionCreateInput = {
        fromUser: data.fromUserId
          ? { connect: { id: data.fromUserId } }
          : undefined,
        toUser: { connect: { id: data.toUserId } },
        fromWallet: fromWallet ? { connect: { id: fromWallet.id } } : undefined,
        toWallet: { connect: { id: toWallet.id } },
        amount: data.amount,
        currency: data.currency,
        description: data.description,
        metadata: data.metadata ? JSON.stringify(data.metadata) : undefined,
      };
      const newTransaction = await prisma.transaction.create({
        data: transactionData,
      });
      if (data.fromUserId) {
        await this.walletsService.updateBalance(
          data.fromUserId,
          -data.amount,
          data.currency
        );
      }
      await this.walletsService.updateBalance(
        data.toUserId,
        data.amount,
        data.currency
      );
      return {
        ...newTransaction,
        metadata: newTransaction.metadata && typeof newTransaction.metadata === 'string'
          ? JSON.parse(newTransaction.metadata)
          : newTransaction.metadata,
      };
    });
    return transaction;
  }

  async findAllForUser(userId: string): Promise<Transaction[]> {
    return this.prisma.transaction.findMany({
      where: {
        OR: [{ fromUserId: userId }, { toUserId: userId }],
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findTransaction(
    id: string,
    user: AuthenticatedUser // Accept authenticated user object
  ): Promise<Transaction> {
    const transaction = await this.prisma.transaction.findUnique({
      where: { id },
    });

    if (!transaction) {
      throw new NotFoundException(`Transaction with ID ${id} not found`);
    }

    // Ownership check: User must be involved in the transaction OR have the 'admin' role
    if (
      transaction.fromUserId !== user.id &&
      transaction.toUserId !== user.id &&
      !user.roles.includes('admin')
    ) {
      throw new ForbiddenException(
        'You do not have permission to view this transaction.'
      );
    }

    return transaction;
  }

  // Admin method to find any transaction (no ownership check)
  async findTransactionAdmin(id: string): Promise<Transaction> {
    const transaction = await this.prisma.transaction.findUnique({
      where: { id },
    });

    if (!transaction) {
      throw new NotFoundException(`Transaction with ID ${id} not found`);
    }

    return transaction;
  }

  // Admin method to find all transactions (no ownership check)
  async findAllTransactionsAdmin(): Promise<Transaction[]> {
    return this.prisma.transaction.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  private mapTransactionCurrencyToCurrency(
    transactionCurrency: TransactionCurrency
  ): Currency {
    switch (transactionCurrency) {
      case TransactionCurrency.UNITS:
        return Currency.UNITS;
      default:
        throw new Error(`Moneda no soportada: ${transactionCurrency}`);
    }
  }

  /**
   * Procesa una transacción de envío de valor (Ünits o Mëritos) entre jugadores,
   * encarnando los principios de Confianza y Reciprocidad de CoomÜnity.
   *
   * - Valida que el emisor tenga saldo suficiente (Principio de Reciprocidad).
   * - Realiza la operación de forma atómica para garantizar la integridad (Principio de Confianza).
   * - Registra metadata filosófica, tejiendo el "alma en los números" para NIRA.
   *
   * @param senderId El ID del usuario que inicia la transacción (el "dador").
   * @param dto Los datos de la transacción, validados por el DTO.
   * @returns La transacción registrada, un artefacto de confianza en el ecosistema.
   */
  async sendTransaction(
    senderId: string,
    dto: SendTransactionDto
  ): Promise<Transaction> {
    const { recipientId, amount, currency, description, metadata } = dto;
    if (recipientId === senderId) {
      throw new ForbiddenException(
        'Un acto de dar requiere de otro. No puedes enviarte valor a ti mismo.'
      );
    }
    const recipient = await this.prisma.user.findUnique({
      where: { id: recipientId },
    });
    if (!recipient) {
      throw new NotFoundException(
        `El destinatario con id '${recipientId}' no fue encontrado en el ecosistema.`
      );
    }
    const prismaCurrency = this.mapTransactionCurrencyToCurrency(currency);
    const hasSufficientBalance = await this.walletsService.hasSufficientBalance(
      senderId,
      amount,
      prismaCurrency
    );
    if (!hasSufficientBalance) {
      throw new ForbiddenException(
        'Fondos insuficientes. La reciprocidad requiere un balance para poder dar.'
      );
    }
    return this.prisma.$transaction(async (prisma) => {
      const [senderWallet, recipientWallet] = await Promise.all([
        this.walletsService.getWalletForUserAdmin(senderId),
        this.walletsService.getWalletForUserAdmin(recipientId),
      ]);
      const updateSenderData: any = {};
      const updateRecipientData: any = {};
      const createRecipientData: any = {
        userId: recipientId,
        status: 'ACTIVE',
      };
      switch (prismaCurrency) {
        case Currency.UNITS:
          updateSenderData.balanceUnits = { decrement: amount };
          updateRecipientData.balanceUnits = { increment: amount };
          createRecipientData.balanceUnits = amount;
          createRecipientData.balanceToins = 0;
          break;
        case Currency.TOINS:
          updateSenderData.balanceToins = { decrement: amount };
          updateRecipientData.balanceToins = { increment: amount };
          createRecipientData.balanceToins = amount;
          createRecipientData.balanceUnits = 0;
          break;
        default:
          throw new Error(`Moneda no soportada: ${prismaCurrency}`);
      }
      await prisma.wallet.update({
        where: { userId: senderId },
        data: updateSenderData,
      });
      await prisma.wallet.upsert({
        where: { userId: recipientId },
        update: updateRecipientData,
        create: createRecipientData,
      });
      const newTransaction = await prisma.transaction.create({
        data: {
          fromUserId: senderId,
          toUserId: recipientId,
          fromWalletId: senderWallet.id,
          toWalletId: recipientWallet.id,
          amount,
          currency: prismaCurrency,
          description,
          metadata: metadata ? JSON.stringify(metadata) : undefined,
        },
      });
      return newTransaction;
    });
  }

  /**
   * Devuelve estadísticas de transacciones para un usuario:
   * - total enviado
   * - total recibido
   * - número de transacciones
   * - desglose por moneda
   */
  async getUserTransactionStats(userId: string) {
    const transactions = await this.prisma.transaction.findMany({
      where: {
        OR: [{ fromUserId: userId }, { toUserId: userId }],
      },
    });
    let totalSent = new Decimal(0);
    let totalReceived = new Decimal(0);
    const transactionCount = transactions.length;
    const currencyBreakdown: Record<string, { sent: Decimal; received: Decimal }> = {};
    for (const tx of transactions) {
      if (!currencyBreakdown[tx.currency]) {
        currencyBreakdown[tx.currency] = { sent: new Decimal(0), received: new Decimal(0) };
      }
      if (tx.fromUserId === userId) {
        totalSent = totalSent.plus(tx.amount);
        currencyBreakdown[tx.currency].sent = currencyBreakdown[tx.currency].sent.plus(tx.amount);
      }
      if (tx.toUserId === userId) {
        totalReceived = totalReceived.plus(tx.amount);
        currencyBreakdown[tx.currency].received = currencyBreakdown[tx.currency].received.plus(tx.amount);
      }
    }
    // Convertir a number para la respuesta final
    const breakdownAsNumber: Record<string, { sent: number; received: number }> = {};
    for (const [currency, values] of Object.entries(currencyBreakdown)) {
      breakdownAsNumber[currency] = {
        sent: values.sent.toNumber(),
        received: values.received.toNumber(),
      };
    }
    return {
      totalSent: totalSent.toNumber(),
      totalReceived: totalReceived.toNumber(),
      transactionCount,
      currencyBreakdown: breakdownAsNumber,
    };
  }
}
