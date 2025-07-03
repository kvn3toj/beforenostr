import {
  Injectable,
  ConflictException,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { WalletsService } from '../wallets/wallets.service';
import { Transaction } from '../../generated/prisma';
import { SendTransactionDto, TransactionCurrency } from './dto/send-transaction.dto';
import { Merit } from '../../generated/prisma';

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
    tokenType: string;
    type: string; // e.g., 'EARN', 'SPEND', 'ADJUST'
    status?: string;
    description?: string;
  }): Promise<Transaction> {
    // Use a transaction to ensure atomicity
    const transaction = await this.prisma.$transaction(async (prisma) => {
      // 1. Create the transaction record
      const newTransaction = await prisma.transaction.create({
        data: {
          fromUserId: data.fromUserId,
          toUserId: data.toUserId,
          amount: data.amount,
          tokenType: data.tokenType,
          type: data.type,
          status: data.status || 'PENDING',
          description: data.description,
        },
      });

      // 2. Update the corresponding wallet balance if needed
      // Note: This may need adjustment based on your wallet logic
      // await this.walletsService.updateWalletBalance(data.toUserId, data.amount);

      return newTransaction;
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

  /**
   * Procesa una transacción de envío de Ünits o Mëritos entre jugadores.
   * - Valida que el emisor tenga saldo suficiente (Reciprocidad Binaria).
   * - Realiza la operación de forma atómica (ACID).
   * - Registra metadata filosófica para trazabilidad y visualización sistémica.
   *
   * @param senderId ID del usuario que envía
   * @param dto Datos de la transacción
   */
  async sendTransaction(senderId: string, dto: SendTransactionDto): Promise<Transaction> {
    // 1. Validar que el destinatario existe y no es el mismo que el emisor
    if (dto.recipientId === senderId) {
      throw new ForbiddenException('No puedes enviarte Ünits o Mëritos a ti mismo.');
    }
    const recipient = await this.prisma.user.findUnique({ where: { id: dto.recipientId } });
    if (!recipient) {
      throw new NotFoundException('El destinatario no existe.');
    }

    // 2. Validar saldo suficiente según la moneda
    const senderWallet = await this.prisma.wallet.findUnique({ where: { userId: senderId } });
    if (!senderWallet) {
      throw new NotFoundException('El emisor no tiene wallet.');
    }
    let senderBalance = 0;
    let balanceField: 'balanceUnits' | 'balanceToins';
    if (dto.currency === TransactionCurrency.UNITS) {
      senderBalance = senderWallet.balanceUnits;
      balanceField = 'balanceUnits';
    } else {
      senderBalance = senderWallet.balanceToins;
      balanceField = 'balanceToins';
    }
    if (senderBalance < dto.amount) {
      // Ley de Reciprocidad Binaria: nunca permitir saldo negativo
      throw new ForbiddenException('Saldo insuficiente para completar la transacción.');
    }

    // 3. Transacción atómica: deducir del emisor y acreditar al receptor
    // Comentario filosófico: La atomicidad garantiza la Confianza y la armonía sistémica
    return this.prisma.$transaction(async (prisma) => {
      // Deducir saldo del emisor
      await prisma.wallet.update({
        where: { userId: senderId },
        data: { [balanceField]: { decrement: dto.amount } },
      });
      // Acreditar saldo al receptor (crear wallet si no existe)
      await prisma.wallet.upsert({
        where: { userId: dto.recipientId },
        update: { [balanceField]: { increment: dto.amount } },
        create: {
          userId: dto.recipientId,
          balanceUnits: balanceField === 'balanceUnits' ? dto.amount : 0,
          balanceToins: balanceField === 'balanceToins' ? dto.amount : 0,
        },
      });
      // Registrar la transacción con metadata filosófica
      const transaction = await prisma.transaction.create({
        data: {
          fromUserId: senderId,
          toUserId: dto.recipientId,
          amount: dto.amount,
          tokenType: dto.currency,
          type: 'TRANSFER',
          status: 'COMPLETED',
          description: dto.metadata?.purpose || 'Transferencia de valor',
          metadata: dto.metadata || {},
        },
      });
      return transaction;
    });
  }
}
