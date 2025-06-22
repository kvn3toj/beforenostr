import {
  Injectable,
  ConflictException,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { WalletsService } from '../wallets/wallets.service';
import { Transaction } from '../../generated/prisma';

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
}
