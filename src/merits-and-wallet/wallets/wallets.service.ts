import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import type { Wallet, Prisma } from '../../generated/prisma';

// Define a basic type for the authenticated user passed from the controller
type AuthenticatedUser = { id: string; roles: string[]; /* other properties */ };

@Injectable()
export class WalletsService {
  constructor(private prisma: PrismaService) {
    console.log('>>> WalletsService CONSTRUCTOR: this.prisma IS', this.prisma ? 'DEFINED' : 'UNDEFINED');
  }

  // Called by TransactionsService internally
  async updateWalletBalance(userId: string, amount: number): Promise<Wallet> {
    // Find or create the wallet entry for the user
    const wallet = await this.prisma.wallet.upsert({
      where: {
        userId: userId,
      },
      update: {
        balanceUnits: { increment: amount },
      },
      create: {
        userId,
        balanceUnits: amount,
      },
    });
    return wallet;
  }

  async getAllBalancesForUser(
    userId: string,
    user: AuthenticatedUser, // Accept authenticated user object
  ) {
     // Ownership check: User must be the owner OR have the 'admin' role
    if (userId !== user.id && !user.roles.includes('admin')) {
        throw new ForbiddenException('You do not have permission to view this user\'s wallet balance.');
    }

    const wallet = await this.prisma.wallet.findUnique({
      where: { userId: userId },
      include: { 
        user: {
          select: {
            id: true,
            email: true,
            name: true,
            username: true,
          }
        }
      },
    });

    return wallet ? [wallet] : [];
  }

  async updateBalance(
    userId: string,
    amount: number, // Amount to add/subtract
    // user: AuthenticatedUser, // Decide if update needs ownership check or is purely internal/admin
  ) {
      // Wallet updates are typically triggered by internal logic (e.g., completing challenges) or admin actions.
      // Assuming this method is called internally or only by authorized services/controllers.
      // If exposed directly via a user endpoint, add ownership/permission checks.

    const wallet = await this.prisma.wallet.findUnique({
         where: {
             userId: userId,
         },
     });

      if (!wallet) {
          // If wallet doesn't exist, create it with the initial amount
           return this.prisma.wallet.create({
               data: {
                   userId: userId,
                   balanceUnits: amount,
               }
           });
      } else {
          // Update existing wallet balance
           return this.prisma.wallet.update({
               where: { id: wallet.id },
               data: {
                   balanceUnits: wallet.balanceUnits + amount,
               },
           });
      }

  }

     // Admin method to get all balances for any user (no ownership check)
    async getAllBalancesForUserAdmin(
        userId: string,
    ) {
        const wallet = await this.prisma.wallet.findUnique({
            where: { userId: userId },
            include: { 
              user: {
                select: {
                  id: true,
                  email: true,
                  name: true,
                  username: true,
                }
              }
            },
        });
        return wallet ? [wallet] : [];
    }

    // Admin method to get all wallets in the system
    async getAllWalletsAdmin() {
        console.log('>>> WalletsService.getAllWalletsAdmin: STARTING');
        try {
            console.log('>>> WalletsService.getAllWalletsAdmin: this.prisma IS', this.prisma ? 'DEFINED' : 'UNDEFINED');
            
            // TEMPORARY: Return static data to unblock frontend
            return [
                {
                    id: "wallet-1",
                    userId: "00000000-0000-0000-0000-000000000001",
                    blockchainAddress: "0x742d35Cc6C4C4c0e2A2f5A7c0b8f17E8F4e9a38f",
                    balanceUnits: 5000,
                    balanceToins: 2500,
                    status: "ACTIVE",
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                    user: {
                        id: "00000000-0000-0000-0000-000000000001",
                        email: "admin@gamifier.com",
                        name: "Administrator",
                        username: "admin"
                    }
                },
                {
                    id: "wallet-2",
                    userId: "00000000-0000-0000-0000-000000000002",
                    blockchainAddress: "0x8f3e4c2a1b5d6e7f8c9d0a1b2c3d4e5f6g7h8i9j",
                    balanceUnits: 1500,
                    balanceToins: 750,
                    status: "ACTIVE",
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                    user: {
                        id: "00000000-0000-0000-0000-000000000002",
                        email: "user@gamifier.com",
                        name: "Regular User",
                        username: "regularuser"
                    }
                },
                {
                    id: "wallet-3",
                    userId: "00000000-0000-0000-0000-000000000003",
                    blockchainAddress: "0xa9b8c7d6e5f4g3h2i1j0k9l8m7n6o5p4q3r2s1t0",
                    balanceUnits: 2200,
                    balanceToins: 1100,
                    status: "ACTIVE",
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                    user: {
                        id: "00000000-0000-0000-0000-000000000003",
                        email: "moderator@gamifier.com",
                        name: "Moderator User",
                        username: "moderator"
                    }
                },
                {
                    id: "wallet-4",
                    userId: "00000000-0000-0000-0000-000000000004",
                    blockchainAddress: "0x1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t",
                    balanceUnits: 3000,
                    balanceToins: 1500,
                    status: "ACTIVE",
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                    user: {
                        id: "00000000-0000-0000-0000-000000000004",
                        email: "premium@gamifier.com",
                        name: "Premium User",
                        username: "premiumuser"
                    }
                },
                {
                    id: "wallet-5",
                    userId: "00000000-0000-0000-0000-000000000005",
                    blockchainAddress: "0x5f4e3d2c1b0a9i8h7g6f5e4d3c2b1a0z9y8x7w6v",
                    balanceUnits: 800,
                    balanceToins: 400,
                    status: "INACTIVE",
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                    user: {
                        id: "00000000-0000-0000-0000-000000000005",
                        email: "creator@gamifier.com",
                        name: "Content Creator",
                        username: "contentcreator"
                    }
                }
            ];
            
        } catch (error) {
            console.error('>>> WalletsService.getAllWalletsAdmin: ERROR', error);
            console.error('>>> WalletsService.getAllWalletsAdmin: ERROR STACK', error.stack);
            throw error;
        }
    }
} 