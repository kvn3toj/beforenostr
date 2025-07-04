import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Wallet, Prisma } from '@prisma/client';

// Define a basic type for the authenticated user passed from the controller
type AuthenticatedUser = { id: string; roles: string[]; /* other properties */ };

@Injectable()
export class WalletsService {
  constructor(private prisma: PrismaService) {}

  // Called by TransactionsService internally
  async updateWalletBalance(userId: string, meritId: string, amount: number): Promise<Wallet> {
    // Find or create the wallet entry for the user and merit
    const wallet = await this.prisma.wallet.upsert({
      where: {
        userId_meritId: { userId, meritId },
      },
      update: {
        balance: { increment: amount },
      },
      create: {
        userId,
        meritId,
        balance: amount,
      },
    });
    return wallet;
  }

  async getBalanceForUser(
    userId: string,
    meritSlug: string,
    user: AuthenticatedUser, // Accept authenticated user object
  ) {
     // Ownership check: User must be the owner OR have the 'admin' role
    if (userId !== user.id && !user.roles.includes('admin')) {
        throw new ForbiddenException('You do not have permission to view this user\'s wallet balance.');
    }

    const wallet = await this.prisma.wallet.findUnique({
      where: {
        userId_meritSlug: {
          userId,
          meritSlug,
        },
      },
    });

    // Note: Could return 0 or throw NotFound if balance is 0 or wallet doesn't exist.
    // Returning null/undefined for non-existent wallet, controller handles 404.
    return wallet;
  }

  async getAllBalancesForUser(
    userId: string,
    user: AuthenticatedUser, // Accept authenticated user object
  ) {
     // Ownership check: User must be the owner OR have the 'admin' role
    if (userId !== user.id && !user.roles.includes('admin')) {
        throw new ForbiddenException('You do not have permission to view this user\'s wallet balances.');
    }

    return this.prisma.wallet.findMany({
      where: { userId },
      include: { merit: true }, // Include merit details
    });
  }

  async updateBalance(
    userId: string,
    meritSlug: string,
    amount: number, // Amount to add/subtract
    // user: AuthenticatedUser, // Decide if update needs ownership check or is purely internal/admin
  ) {
      // Wallet updates are typically triggered by internal logic (e.g., completing challenges) or admin actions.
      // Assuming this method is called internally or only by authorized services/controllers.
      // If exposed directly via a user endpoint, add ownership/permission checks.

    const wallet = await this.prisma.wallet.findUnique({
         where: {
             userId_meritSlug: {
                 userId,
                 meritSlug,
             },
         },
     });

      if (!wallet) {
          // If wallet doesn't exist, create it with the initial amount
           return this.prisma.wallet.create({
               data: {
                   userId,
                   meritSlug,
                   balance: amount,
               }
           });
      } else {
          // Update existing wallet balance
           return this.prisma.wallet.update({
               where: { id: wallet.id },
               data: {
                   balance: wallet.balance + amount,
               },
           });
      }

  }

    // Admin method to get balance for any user (no ownership check)
    async getBalanceForUserAdmin(
        userId: string,
        meritSlug: string,
    ) {
         const wallet = await this.prisma.wallet.findUnique({
             where: {
                 userId_meritSlug: {
                     userId,
                     meritSlug,
                 },
             },
         });
         return wallet; // Can return null if not found
    }

     // Admin method to get all balances for any user (no ownership check)
    async getAllBalancesForUserAdmin(
        userId: string,
    ) {
        return this.prisma.wallet.findMany({
            where: { userId },
            include: { merit: true },
        });
    }
} 