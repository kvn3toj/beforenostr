import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  Inject,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Wallet, Currency } from '../../generated/prisma';
import Decimal from 'decimal.js';

// Define a basic type for the authenticated user passed from the controller
type AuthenticatedUser = { id: string; roles: string[] /* other properties */ };

@Injectable()
export class WalletsService {
  constructor(@Inject(PrismaService) private prisma: PrismaService) {}

  // Called by TransactionsService internally
  async updateWalletBalance(
    userId: string,
    amount: number,
    currency: Currency = Currency.UNITS
  ): Promise<Wallet> {
    if (amount < 0) {
      throw new Error('La cantidad no puede ser negativa en una actualización de balance');
    }
    const updateData: any = {};
    const createData: any = {
      userId,
      status: 'ACTIVE',
    };
    switch (currency) {
      case Currency.UNITS:
        updateData.balanceUnits = { increment: amount };
        createData.balanceUnits = amount;
        createData.balanceToins = 0;
        break;
      case Currency.TOINS:
        updateData.balanceToins = { increment: amount };
        createData.balanceToins = amount;
        createData.balanceUnits = 0;
        break;
      default:
        throw new Error(`Moneda no soportada: ${currency}`);
    }
    const wallet = await this.prisma.wallet.upsert({
      where: { userId },
      update: updateData,
      create: createData,
    });
    return wallet;
  }

  async getWalletForUser(
    userId: string,
    user: AuthenticatedUser
  ): Promise<Wallet> {
    if (userId !== user.id && !user.roles.includes('admin')) {
      throw new ForbiddenException(
        "You do not have permission to view this user's wallet."
      );
    }
    const wallet = await this.prisma.wallet.findUnique({
      where: { userId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            avatarUrl: true,
          },
        },
      },
    });
    if (!wallet) {
      return this.prisma.wallet.create({
        data: {
          userId,
          balanceUnits: 0,
          balanceToins: 0,
          status: 'ACTIVE',
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              avatarUrl: true,
            },
          },
        },
      });
    }
    return wallet;
  }

  async getAllBalancesForUser(
    userId: string,
    user: AuthenticatedUser // Accept authenticated user object
  ) {
    // Ownership check: User must be the owner OR have the 'admin' role
    if (userId !== user.id && !user.roles.includes('admin')) {
      throw new ForbiddenException(
        "You do not have permission to view this user's wallet balances."
      );
    }

    // Get wallet with user info
    const wallet = await this.getWalletForUser(userId, user);

    // Get merits summary by type
    const meritsGrouped = await this.prisma.merit.groupBy({
      by: ['type'],
      where: { userId },
      _sum: {
        amount: true,
      },
    });

    return {
      wallet,
      meritsSummary: meritsGrouped.map((group) => ({
        type: group.type,
        totalAmount: group._sum.amount || 0,
      })),
    };
  }

  async updateBalance(
    userId: string,
    amount: number, // Amount to add/subtract
    currency: string = 'USD'
    // user: AuthenticatedUser, // Decide if update needs ownership check or is purely internal/admin
  ) {
    // Wallet updates are typically triggered by internal logic (e.g., completing challenges) or admin actions.
    // Assuming this method is called internally or only by authorized services/controllers.
    // If exposed directly via a user endpoint, add ownership/permission checks.

    // Convertir string a enum Currency de Prisma de forma segura
    const currencyEnum = (Object.values(Currency) as string[]).includes(currency)
      ? (currency as Currency)
      : Currency.UNITS;
    return this.updateWalletBalance(userId, amount, currencyEnum);
  }

  // Admin method to get wallet for any user (no ownership check)
  async getWalletForUserAdmin(userId: string) {
    const wallet = await this.prisma.wallet.findUnique({
      where: { userId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            avatarUrl: true,
          },
        },
      },
    });

    // If wallet doesn't exist, create one with zero balances
    if (!wallet) {
      return this.prisma.wallet.create({
        data: {
          userId,
          balanceUnits: 0,
          balanceToins: 0,
          status: 'ACTIVE',
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              avatarUrl: true,
            },
          },
        },
      });
    }

    return wallet;
  }

  // Admin method to get all balances for any user (no ownership check)
  async getAllBalancesForUserAdmin(userId: string) {
    // Get wallet with user info
    const wallet = await this.getWalletForUserAdmin(userId);

    // Get merits summary by type
    const meritsGrouped = await this.prisma.merit.groupBy({
      by: ['type'],
      where: { userId },
      _sum: {
        amount: true,
      },
    });

    return {
      wallet,
      meritsSummary: meritsGrouped.map((group) => ({
        type: group.type,
        totalAmount: group._sum.amount || 0,
      })),
    };
  }

  async hasSufficientBalance(
    userId: string,
    amount: number,
    currency: Currency = Currency.UNITS
  ): Promise<boolean> {
    const wallet = await this.prisma.wallet.findUnique({
      where: { userId },
    });
    if (!wallet) {
      return false;
    }
    switch (currency) {
      case Currency.UNITS:
        return new Decimal(wallet.balanceUnits).gte(amount);
      case Currency.TOINS:
        return new Decimal(wallet.balanceToins).gte(amount);
      default:
        return false;
    }
  }

  async getBalanceByCurrency(
    userId: string,
    currency: Currency
  ): Promise<number> {
    const wallet = await this.prisma.wallet.findUnique({
      where: { userId },
    });
    if (!wallet) {
      return 0;
    }
    switch (currency) {
      case Currency.UNITS:
        return new Decimal(wallet.balanceUnits).toNumber();
      case Currency.TOINS:
        return new Decimal(wallet.balanceToins).toNumber();
      default:
        return 0;
    }
  }
}
