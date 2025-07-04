import { PrismaService } from '../../../../prisma/prisma.service';
import { Currency } from '../../../../generated/prisma';
import { TransactionCurrency } from '../../dto/send-transaction.dto';

/**
 * 🌱 Seeds de Datos para Tests de Integración - CoomÜnity
 *
 * - Idempotencia: Ejecutar varias veces no debe duplicar datos (deleteMany+createMany)
 * - Edge cases cubiertos:
 *   - Usuarios con y sin wallets
 *   - Wallets con balance cero, máximo y negativo (si el modelo lo permite)
 *   - Transacciones válidas y fallidas (comentadas para tests)
 *
 * Para agregar nuevos edge cases:
 *   1. Añadir usuario/wallet/transacción en TEST_DATA
 *   2. Agregar test de integración correspondiente
 *
 * Inspirado en buenas prácticas de seeds idempotentes [[fuente](https://thoughtbot.com/blog/seeds-of-destruction)]
 */

export const TEST_DATA = {
  users: {
    atlas: {
      id: 'user-atlas',
      username: 'atlas-test',
      email: 'atlas@coomunit.test',
      password: 'test123',
    },
    sage: {
      id: 'user-sage',
      username: 'sage-test',
      email: 'sage@coomunit.test',
      password: 'test123',
    },
    hermes: {
      id: 'user-hermes',
      username: 'hermes-test',
      email: 'hermes@coomunit.test',
      password: 'test123',
    },
    empty: {
      id: 'user-empty',
      username: 'empty-test',
      email: 'empty@coomunit.test',
      password: 'test123',
    },
    rich: {
      id: 'user-rich',
      username: 'rich-test',
      email: 'rich@coomunit.test',
      password: 'test123',
    },
    noWallet: {
      id: 'user-nowallet',
      username: 'nowallet-test',
      email: 'nowallet@coomunit.test',
      password: 'test123',
    },
  },
  wallets: {
    atlas: {
      id: 'wallet-atlas',
      userId: 'user-atlas',
      balanceUnits: 1000,
      balanceToins: 0,
      currency: Currency.UNITS,
    },
    sage: {
      id: 'wallet-sage',
      userId: 'user-sage',
      balanceUnits: 500,
      balanceToins: 0,
      currency: Currency.UNITS,
    },
    hermes: {
      id: 'wallet-hermes',
      userId: 'user-hermes',
      balanceUnits: 750,
      balanceToins: 0,
      currency: Currency.UNITS,
    },
    empty: {
      id: 'wallet-empty',
      userId: 'user-empty',
      balanceUnits: 0,
      balanceToins: 0,
      currency: Currency.UNITS,
    },
    rich: {
      id: 'wallet-rich',
      userId: 'user-rich',
      balanceUnits: 1000000,
      balanceToins: 0,
      currency: Currency.UNITS,
    },
    negative: {
      id: 'wallet-negative',
      userId: 'user-rich',
      balanceUnits: -100,
      balanceToins: 0,
      currency: Currency.UNITS,
    },
  },
  transactions: {
    welcomeReward: {
      id: 'txn-welcome-atlas',
      fromWalletId: 'wallet-community',
      toWalletId: 'wallet-atlas',
      amount: 100,
      currency: Currency.UNITS,
      description: 'Welcome reward for new guardian',
      metadata: {
        type: 'welcome_reward',
        category: 'onboarding',
      },
      createdAt: new Date('2024-01-01T01:00:00Z'),
      updatedAt: new Date('2024-01-01T01:00:00Z'),
    },
    meritTransfer: {
      id: 'txn-merit-sage-kira',
      fromWalletId: 'wallet-sage',
      toWalletId: 'wallet-kira',
      amount: 50,
      currency: Currency.UNITS,
      description: 'Merit transfer for excellent contribution',
      metadata: {
        type: 'merit_transfer',
        category: 'recognition',
        contributionId: 'contrib-001',
      },
      createdAt: new Date('2024-01-01T02:00:00Z'),
      updatedAt: new Date('2024-01-01T02:00:00Z'),
    },
  },
};

export class TransactionsSeed {
  constructor(private prisma: PrismaService) {}

  async resetTestData(): Promise<void> {
    await this.cleanupTestData();
    await this.seedTestData();
  }

  async cleanupTestData(): Promise<void> {
    await this.prisma.transaction.deleteMany();
    if (this.prisma.marketplaceItem) {
      await this.prisma.marketplaceItem.deleteMany();
    }
    if (this.prisma.merit) {
      await this.prisma.merit.deleteMany();
    }
    await this.prisma.wallet.deleteMany();
    await this.prisma.user.deleteMany();
  }

  async seedTestData(): Promise<void> {
    await this.prisma.user.deleteMany({ where: { id: { in: Object.values(TEST_DATA.users).map(u => u.id) } } });
    await this.prisma.wallet.deleteMany({ where: { id: { in: Object.values(TEST_DATA.wallets).map(w => w.id) } } });
    await this.prisma.user.createMany({ data: Object.values(TEST_DATA.users) });
    await this.prisma.wallet.createMany({ data: Object.values(TEST_DATA.wallets) });
  }

  async verifyTestData(): Promise<boolean> {
    try {
      const userCount = await this.prisma.user.count();
      if (userCount !== Object.keys(TEST_DATA.users).length) return false;
      const walletCount = await this.prisma.wallet.count();
      if (walletCount !== Object.keys(TEST_DATA.wallets).length) return false;
      for (const wallet of Object.values(TEST_DATA.wallets)) {
        const dbWallet = await this.prisma.wallet.findUnique({ where: { id: wallet.id } });
        if (!dbWallet || dbWallet.balanceUnits.toNumber() !== wallet.balanceUnits || dbWallet.balanceToins.toNumber() !== wallet.balanceToins) return false;
      }
      return true;
    } catch (error) {
      console.error('Test data verification failed:', error);
      return false;
    }
  }

  async createTestTransaction(data: {
    id: string;
    fromUserId: string;
    toUserId: string;
    fromWalletId: string;
    toWalletId: string;
    amount: number;
    currency: Currency;
    description?: string;
    metadata?: any;
    createdAt?: Date;
    updatedAt?: Date;
  }) {
    return await this.prisma.transaction.create({
      data: {
        id: data.id,
        fromUserId: data.fromUserId,
        toUserId: data.toUserId,
        fromWalletId: data.fromWalletId,
        toWalletId: data.toWalletId,
        amount: data.amount,
        currency: data.currency,
        description: data.description,
        metadata: data.metadata,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
      }
    });
  }

  async getTestWallet(walletId: string) {
    return await this.prisma.wallet.findUnique({
      where: { id: walletId },
      include: { user: true }
    });
  }

  async updateTestWalletBalance(walletId: string, amount: number, currency: Currency = Currency.UNITS) {
    return await this.prisma.wallet.update({
      where: { id: walletId },
      data: currency === Currency.UNITS ? { balanceUnits: amount } : { balanceToins: amount }
    });
  }
}
