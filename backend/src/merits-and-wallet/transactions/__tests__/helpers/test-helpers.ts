import { PrismaService } from '../../../../prisma/prisma.service';
import { Currency } from '../../../../generated/prisma';
import { TransactionCurrency } from '../../dto/send-transaction.dto';

/**
 * Helpers para manipulación y verificación de datos en tests de integración
 */
export class TestHelpers {
  constructor(private prisma: PrismaService) {}

  // ==================== WALLET HELPERS ====================

  async getWalletBalance(walletId: string, currency: Currency = Currency.UNITS): Promise<number> {
    const wallet = await this.prisma.wallet.findUnique({ where: { id: walletId } });
    if (!wallet) return 0;
    return currency === Currency.UNITS
      ? Number(wallet.balanceUnits)
      : Number(wallet.balanceToins);
  }

  async setWalletBalance(walletId: string, amount: number, currency: Currency = Currency.UNITS): Promise<void> {
    await this.prisma.wallet.update({
      where: { id: walletId },
      data: currency === Currency.UNITS ? { balanceUnits: amount } : { balanceToins: amount }
    });
  }

  async walletExists(walletId: string): Promise<boolean> {
    const wallet = await this.prisma.wallet.findUnique({ where: { id: walletId } });
    return !!wallet;
  }

  async getWalletInfo(walletId: string): Promise<any> {
    return await this.prisma.wallet.findUnique({
      where: { id: walletId },
      include: { user: true }
    });
  }

  // ==================== USER HELPERS ====================

  async userExists(userId: string): Promise<boolean> {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    return !!user;
  }

  async getUserInfo(userId: string): Promise<any> {
    return await this.prisma.user.findUnique({
      where: { id: userId },
      include: { wallet: true }
    });
  }

  async createTestUser(userData: { id: string; email: string; username: string; password?: string }): Promise<any> {
    return await this.prisma.user.create({ data: { ...userData, password: userData.password || 'test123' } });
  }

  async createTestWallet(data: {
    id: string;
    userId: string;
    balanceUnits?: number;
    balanceToins?: number;
    currency: Currency;
  }): Promise<any> {
    return await this.prisma.wallet.create({
      data: {
        id: data.id,
        userId: data.userId,
        balanceUnits: data.balanceUnits ?? 0,
        balanceToins: data.balanceToins ?? 0,
        currency: data.currency
      }
    });
  }

  // ==================== TRANSACTION HELPERS ====================

  async getTransactionCount(): Promise<number> {
    return await this.prisma.transaction.count();
  }

  async getLastTransaction(): Promise<any> {
    return await this.prisma.transaction.findFirst({ orderBy: { createdAt: 'desc' } });
  }

  async verifyTransactionExists(transactionId: string): Promise<boolean> {
    const transaction = await this.prisma.transaction.findUnique({ where: { id: transactionId } });
    return !!transaction;
  }

  async getTransactionInfo(transactionId: string): Promise<any> {
    return await this.prisma.transaction.findUnique({
      where: { id: transactionId },
      include: { fromWallet: true, toWallet: true }
    });
  }

  async getTransactionsForWallet(walletId: string): Promise<any[]> {
    return await this.prisma.transaction.findMany({
      where: {
        OR: [
          { fromWalletId: walletId },
          { toWalletId: walletId }
        ]
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  async getTransactionsBetweenWallets(fromWalletId: string, toWalletId: string): Promise<any[]> {
    return await this.prisma.transaction.findMany({
      where: { fromWalletId, toWalletId },
      orderBy: { createdAt: 'desc' }
    });
  }

  // ==================== VERIFICATION HELPERS ====================

  async verifyBalancesAfterTransaction(
    fromWalletId: string,
    toWalletId: string,
    expectedFromBalance: number,
    expectedToBalance: number,
    currency: Currency = Currency.UNITS
  ): Promise<boolean> {
    const fromBalance = await this.getWalletBalance(fromWalletId, currency);
    const toBalance = await this.getWalletBalance(toWalletId, currency);
    return fromBalance === expectedFromBalance && toBalance === expectedToBalance;
  }

  async verifyTransactionRecord(
    transactionId: string,
    expectedData: {
      fromWalletId: string;
      toWalletId: string;
      amount: number;
      description: string;
    }
  ): Promise<boolean> {
    const transaction = await this.getTransactionInfo(transactionId);
    if (!transaction) return false;
    return (
      transaction.fromWalletId === expectedData.fromWalletId &&
      transaction.toWalletId === expectedData.toWalletId &&
      transaction.amount === expectedData.amount &&
      transaction.description === expectedData.description
    );
  }

  // ==================== STATE HELPERS ====================

  async captureCurrentState(): Promise<{
    users: any[];
    wallets: any[];
    transactions: any[];
  }> {
    const [users, wallets, transactions] = await Promise.all([
      this.prisma.user.findMany(),
      this.prisma.wallet.findMany(),
      this.prisma.transaction.findMany()
    ]);
    return { users, wallets, transactions };
  }

  async wait(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async getDatabaseMetrics(): Promise<{
    userCount: number;
    walletCount: number;
    transactionCount: number;
  }> {
    const [userCount, walletCount, transactionCount] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.wallet.count(),
      this.prisma.transaction.count()
    ]);
    return { userCount, walletCount, transactionCount };
  }

  async updateWalletBalance(walletId: string, amount: number, currency: Currency = Currency.UNITS) {
    return await this.prisma.wallet.update({
      where: { id: walletId },
      data: currency === Currency.UNITS ? { balanceUnits: amount } : { balanceToins: amount }
    });
  }

  async deleteAllTransactions() {
    await this.prisma.transaction.deleteMany();
  }

  async deleteAllWallets() {
    await this.prisma.wallet.deleteMany();
  }

  async deleteAllUsers() {
    await this.prisma.user.deleteMany();
  }
}

/**
 * Helpers específicos para assertions en tests
 */
export class AssertionHelpers {
  static expectTransactionSuccess(result: any): void {
    expect(result).toBeDefined();
    expect(result.transactionId).toBeDefined();
    expect(result.success).toBe(true);
  }

  static expectTransactionFailure(result: any, expectedError?: string): void {
    expect(result).toBeDefined();
    expect(result.success).toBe(false);
    if (expectedError) {
      expect(result.error).toBe(expectedError);
    }
    expect(result.transactionId).toBeUndefined();
  }

  static expectBalanceChange(
    initialBalance: number,
    finalBalance: number,
    expectedChange: number,
    message?: string
  ): void {
    const actualChange = finalBalance - initialBalance;
    expect(actualChange).toBe(expectedChange);
    if (message) {
      expect(finalBalance).toBe(initialBalance + expectedChange);
    }
  }

  static expectNoBalanceChange(
    initialBalance: number,
    finalBalance: number
  ): void {
    expect(finalBalance).toBe(initialBalance);
  }

  static expectTransactionStructure(transaction: any): void {
    expect(transaction).toBeDefined();
    expect(transaction.id).toBeDefined();
    expect(transaction.fromWalletId).toBeDefined();
    expect(transaction.toWalletId).toBeDefined();
    expect(transaction.amount).toBeDefined();
    expect(transaction.description).toBeDefined();
    expect(transaction.currency).toBeDefined();
    expect(transaction.createdAt).toBeDefined();
    expect(transaction.updatedAt).toBeDefined();
  }

  static expectTransactionCountIncrease(
    initialCount: number,
    finalCount: number,
    expectedIncrease: number = 1
  ): void {
    expect(finalCount).toBe(initialCount + expectedIncrease);
  }

  static expectNoNewTransactions(
    initialCount: number,
    finalCount: number
  ): void {
    expect(finalCount).toBe(initialCount);
  }

  static expectWalletStructure(wallet: any): void {
    expect(wallet).toBeDefined();
    expect(wallet.id).toBeDefined();
    expect(wallet.userId).toBeDefined();
    expect(wallet.balanceUnits).toBeDefined();
    expect(wallet.balanceToins).toBeDefined();
    expect(wallet.currency).toBeDefined();
    expect(wallet.createdAt).toBeDefined();
    expect(wallet.updatedAt).toBeDefined();
  }
}
