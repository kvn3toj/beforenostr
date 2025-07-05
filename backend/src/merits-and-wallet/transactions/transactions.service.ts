import {
  Injectable,
  ConflictException,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { WalletsService } from '../wallets/wallets.service';
import { Transaction } from '../../generated/prisma';
import {
  SendTransactionDto,
  TransactionCurrency,
} from './dto/send-transaction.dto';
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
    type: string; // e.g., 'EARN', 'SPEND', 'ADJUST'
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
          currency: 'USD',
          type: data.type,
          description: data.description,
        } as any,
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

    // 1. Validaciones Preliminares: Asegurar la coherencia del acto de dar.
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

    // 2. Verificación de Fondos (Principio de Reciprocidad)
    // Se asegura que el dar no cree una deuda inexistente en el sistema.
    // Usamos el método de admin para una llamada interna entre servicios confiables.
    const senderWallet =
      await this.walletsService.getWalletForUserAdmin(senderId);
    if (!senderWallet || senderWallet.balance < amount) {
      throw new ForbiddenException(
        'Fondos insuficientes. La reciprocidad requiere un balance para poder dar.'
      );
    }

    // 3. Transacción Atómica (Corazón de la Confianza)
    // Usamos $transaction de Prisma para garantizar que el intercambio completo
    // (dar y recibir) ocurra exitosamente, o no ocurra en absoluto.
    return this.prisma.$transaction(async (prisma) => {
      // Deducir del emisor: Un acto de desprendimiento.
      await prisma.wallet.update({
        where: { userId: senderId },
        data: { balance: { decrement: amount } },
      });

      // Acreditar al receptor: Un acto de recepción.
      // Usamos upsert para crear una wallet si el receptor es nuevo en el flujo económico.
      await prisma.wallet.upsert({
        where: { userId: recipientId },
        update: { balance: { increment: amount } },
        create: {
          userId: recipientId,
          balance: amount,
          currency,
        },
      });

      // Registrar la memoria de la transacción para la posteridad.
      // NOTA: El error de linter sobre 'metadata' es esperado si Prisma Client
      // no se ha regenerado tras el cambio en schema.prisma. El código es correcto.
      const newTransaction = await prisma.transaction.create({
        data: {
          fromUserId: senderId,
          toUserId: recipientId,
          amount,
          currency,
          description,
          metadata,
          type: 'TRANSFER', // Este tipo podría evolucionar con la filosofía.
        },
      });

      return newTransaction;
    });
  }
}
