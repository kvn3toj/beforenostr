import { Injectable, ConflictException, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { WalletsService } from '../wallets/wallets.service';
import { MeritTransaction, Prisma } from '@prisma/client';

// Define a basic type for the authenticated user passed from the controller
type AuthenticatedUser = { id: string; roles: string[]; /* other properties */ };

// Basic type for eventData - its structure depends on the transaction source/type
export type TransactionEventData = any; // Can be refined if specific structures are known

@Injectable()
export class TransactionsService {
  constructor(
    private prisma: PrismaService,
    private walletsService: WalletsService, // Inject WalletsService
  ) {}

  async createTransaction(data: {
    userId: string;
    meritId: string;
    amount: number;
    type: string; // e.g., 'EARN', 'SPEND', 'ADJUST'
    source: string; // e.g., 'CHALLENGE', 'ADMIN', 'PURCHASE'
    sourceId?: string; // ID of the source entity (e.g., challengeId)
    notes?: string;
    eventData?: TransactionEventData; // Added eventData with basic typing
  }): Promise<MeritTransaction> {
    // Use a transaction to ensure atomicity
    const transaction = await this.prisma.$transaction(async (prisma) => {
      // 1. Create the transaction record
      // Note: Prisma handles JSONB fields with 'any' or specific types defined in schema.prisma
      const newTransaction = await prisma.transaction.create({ 
          data: {
              ...data,
              eventData: data.eventData as any || {}, // Cast to any for Prisma, default to empty object
          }
      });

      // 2. Update the corresponding wallet balance
      // The updateWalletBalance method in WalletsService handles finding/creating the wallet
      await this.walletsService.updateWalletBalance(data.userId, data.meritId, data.amount);

      return newTransaction;
    });

    return transaction;
  }

  async findAllForUser(userId: string): Promise<MeritTransaction[]> {
    // eventData is JsonValue, compatible with any.
    return this.prisma.transaction.findMany({
      where: { userId },
      orderBy: { timestamp: 'desc' },
      include: { merit: true }, // Optionally include merit details
    });
  }

  async findTransaction(
    id: string,
    user: AuthenticatedUser, // Accept authenticated user object
  ): Promise<MeritTransaction & { merit: any }> { // Include merit details in return type
    const transaction = await this.prisma.transaction.findUnique({
      where: { id },
      include: { merit: true },
    });

    if (!transaction) {
      throw new NotFoundException(`Transaction with ID ${id} not found`);
    }

    // Ownership check: User must be the owner OR have the 'admin' role
    if (transaction.userId !== user.id && !user.roles.includes('admin')) {
        throw new ForbiddenException('You do not have permission to view this transaction.');
    }

    // eventData is JsonValue, compatible with any.
    return transaction;
  }

  // Admin method to find any transaction (no ownership check)
  async findTransactionAdmin(id: string): Promise<MeritTransaction & { merit: any }> {
    const transaction = await this.prisma.transaction.findUnique({
      where: { id },
      include: { merit: true },
    });
    
    if (!transaction) {
      throw new NotFoundException(`Transaction with ID ${id} not found`);
    }
    // eventData is JsonValue, compatible with any.
    return transaction;
  }

  // Admin method to find all transactions (no ownership check)
  async findAllTransactionsAdmin(): Promise<(MeritTransaction & { merit: any })[]> {
    // eventData is JsonValue, compatible with any.
    return this.prisma.transaction.findMany({
      orderBy: { timestamp: 'desc' },
      include: { merit: true },
    });
  }
} 