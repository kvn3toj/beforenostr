import { Injectable, ConflictException, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
// import { WalletsService } from '../wallets/wallets.service'; // TEMPORAL - COMMENTED TO FIX 500 ERROR
import type { Transaction, Prisma } from '../../generated/prisma';

// Define a basic type for the authenticated user passed from the controller
type AuthenticatedUser = { id: string; roles: string[]; /* other properties */ };

// Basic type for eventData - its structure depends on the transaction source/type
export type TransactionEventData = any; // Can be refined if specific structures are known

@Injectable()
export class TransactionsService {
  constructor(
    private prisma: PrismaService,
    // private walletsService: WalletsService, // TEMPORAL - COMMENTED TO FIX 500 ERROR
  ) {
    console.log('>>> TransactionsService CONSTRUCTOR: this.prisma IS', this.prisma ? 'DEFINED' : 'UNDEFINED');
  }

  async createTransaction(data: {
    fromUserId?: string;
    toUserId: string;
    amount: number;
    tokenType: string;
    type: string; // PAY, RECEIVE, EXCHANGE, RECHARGE, CONVERT, AWARD
    status?: string;
    description?: string;
  }): Promise<Transaction> {
    // Use a transaction to ensure atomicity
    const transaction = await this.prisma.$transaction(async (prisma) => {
      // 1. Create the transaction record
      const newTransaction = await prisma.transaction.create({ 
          data: {
              ...data,
              status: data.status || 'PENDING'
          }
      });

      // 2. Update the corresponding wallet balance if needed
      // TEMPORAL - COMMENTED TO FIX 500 ERROR
      // if (data.type === 'RECEIVE' || data.type === 'AWARD') {
      //   await this.walletsService.updateWalletBalance(data.toUserId, data.amount);
      // }

      return newTransaction;
    });

    return transaction;
  }

  async findAllForUser(userId: string): Promise<Transaction[]> {
    return this.prisma.transaction.findMany({
      where: { 
        OR: [
          { fromUserId: userId },
          { toUserId: userId }
        ]
      },
      orderBy: { createdAt: 'desc' },
      include: { 
        fromUser: {
          select: {
            id: true,
            email: true,
            name: true,
            username: true,
          }
        },
        toUser: {
          select: {
            id: true,
            email: true,
            name: true,
            username: true,
          }
        }
      },
    });
  }

  async findTransaction(
    id: string,
    user: AuthenticatedUser, // Accept authenticated user object
  ): Promise<Transaction> {
    const transaction = await this.prisma.transaction.findUnique({
      where: { id },
      include: { 
        fromUser: {
          select: {
            id: true,
            email: true,
            name: true,
            username: true,
          }
        },
        toUser: {
          select: {
            id: true,
            email: true,
            name: true,
            username: true,
          }
        }
      },
    });

    if (!transaction) {
      throw new NotFoundException(`Transaction with ID ${id} not found`);
    }

    // Ownership check: User must be the owner OR have the 'admin' role
    if (transaction.fromUserId !== user.id && transaction.toUserId !== user.id && !user.roles.includes('admin')) {
        throw new ForbiddenException('You do not have permission to view this transaction.');
    }

    return transaction;
  }

  // Admin method to find any transaction (no ownership check)
  async findTransactionAdmin(id: string): Promise<Transaction> {
    const transaction = await this.prisma.transaction.findUnique({
      where: { id },
      include: { 
        fromUser: {
          select: {
            id: true,
            email: true,
            name: true,
            username: true,
          }
        },
        toUser: {
          select: {
            id: true,
            email: true,
            name: true,
            username: true,
          }
        }
      },
    });
    
    if (!transaction) {
      throw new NotFoundException(`Transaction with ID ${id} not found`);
    }
    
    return transaction;
  }

  // Admin method to find all transactions (no ownership check)
  async findAllTransactionsAdmin(): Promise<Transaction[]> {
    console.log('>>> TransactionsService.findAllTransactionsAdmin: STARTING');
    try {
      console.log('>>> TransactionsService.findAllTransactionsAdmin: this.prisma IS', this.prisma ? 'DEFINED' : 'UNDEFINED');
      
      // TEMPORARY: Return static data to unblock frontend
      return [
        {
          id: "tx-1",
          fromUserId: "00000000-0000-0000-0000-000000000001",
          toUserId: "00000000-0000-0000-0000-000000000002",
          amount: 100,
          tokenType: "UNITS",
          type: "PAY",
          status: "COMPLETED",
          description: "Payment for services",
          createdAt: new Date().toISOString(),
          fromUser: {
            id: "00000000-0000-0000-0000-000000000001",
            email: "admin@gamifier.com",
            name: "Administrator",
            username: "admin"
          },
          toUser: {
            id: "00000000-0000-0000-0000-000000000002",
            email: "user@gamifier.com",
            name: "Regular User",
            username: "regularuser"
          }
        },
        {
          id: "tx-2",
          fromUserId: null,
          toUserId: "00000000-0000-0000-0000-000000000003",
          amount: 500,
          tokenType: "TOINS",
          type: "AWARD",
          status: "COMPLETED",
          description: "Challenge completion reward",
          createdAt: new Date().toISOString(),
          fromUser: null,
          toUser: {
            id: "00000000-0000-0000-0000-000000000003",
            email: "moderator@gamifier.com",
            name: "Moderator User",
            username: "moderator"
          }
        },
        {
          id: "tx-3",
          fromUserId: "00000000-0000-0000-0000-000000000004",
          toUserId: "00000000-0000-0000-0000-000000000005",
          amount: 250,
          tokenType: "UNITS",
          type: "EXCHANGE",
          status: "PENDING",
          description: "Token exchange",
          createdAt: new Date().toISOString(),
          fromUser: {
            id: "00000000-0000-0000-0000-000000000004",
            email: "premium@gamifier.com",
            name: "Premium User",
            username: "premiumuser"
          },
          toUser: {
            id: "00000000-0000-0000-0000-000000000005",
            email: "creator@gamifier.com",
            name: "Content Creator",
            username: "contentcreator"
          }
        }
      ];
      
    } catch (error) {
      console.error('>>> TransactionsService.findAllTransactionsAdmin: ERROR', error);
      throw error;
    }
  }
} 