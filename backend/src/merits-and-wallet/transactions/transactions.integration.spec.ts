import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../../prisma/prisma.service';
import { TransactionsService } from './transactions.service';
import { WalletsService } from '../wallets/wallets.service';
import { Currency } from '../../generated/prisma';
import { TestDatabaseSetup } from './__tests__/setup/test-database.setup';
import { TransactionsSeed, TEST_DATA } from './__tests__/seeds/transactions.seed';
import { TestHelpers, AssertionHelpers } from './__tests__/helpers/test-helpers';
import { TransactionCurrency } from './dto/send-transaction.dto';

describe('TransactionsService - Integration Tests', () => {
  let app: TestingModule;
  let prisma: PrismaService;
  let transactionsService: TransactionsService;
  let walletsService: WalletsService;
  let testHelpers: TestHelpers;
  let seed: TransactionsSeed;
  const mockUser = { id: 'user-atlas', email: 'atlas@coomunit.test' };

  beforeAll(async () => {
    // Configurar base de datos de test
    const testPrisma = await TestDatabaseSetup.setupTestDatabase();

    // Configurar módulo de testing con servicios reales
    app = await Test.createTestingModule({
      providers: [
        { provide: PrismaService, useValue: testPrisma },
        TransactionsService,
        WalletsService,
      ],
    }).compile();

    prisma = app.get<PrismaService>(PrismaService);
    transactionsService = app.get<TransactionsService>(TransactionsService);
    walletsService = app.get<WalletsService>(WalletsService);

    testHelpers = new TestHelpers(prisma);
    seed = new TransactionsSeed(prisma);
  });

  beforeEach(async () => {
    await seed.resetTestData();
    const isDataValid = await seed.verifyTestData();
    if (!isDataValid) throw new Error('Test data verification failed');
  });

  afterEach(async () => {
    await seed.cleanupTestData();
  });

  afterAll(async () => {
    await TestDatabaseSetup.cleanupTestDatabase();
    await app.close();
  });

  describe('sendTransaction', () => {
    it('should create transaction with real database persistence', async () => {
      const initialSenderBalance = await testHelpers.getWalletBalance('wallet-atlas');
      const initialReceiverBalance = await testHelpers.getWalletBalance('wallet-sage');
      const initialTransactionCount = await testHelpers.getTransactionCount();

      const senderId = 'user-atlas';
      const transactionData = {
        recipientId: 'user-sage',
        amount: 100,
        currency: TransactionCurrency.UNITS,
        description: 'Integration test transaction'
      };
      const result = await transactionsService.sendTransaction(senderId, transactionData);

      AssertionHelpers.expectTransactionSuccess(result);

      const finalSenderBalance = await testHelpers.getWalletBalance('wallet-atlas');
      const finalReceiverBalance = await testHelpers.getWalletBalance('wallet-sage');
      const finalTransactionCount = await testHelpers.getTransactionCount();

      AssertionHelpers.expectBalanceChange(initialSenderBalance, finalSenderBalance, -100);
      AssertionHelpers.expectBalanceChange(initialReceiverBalance, finalReceiverBalance, 100);
      AssertionHelpers.expectTransactionCountIncrease(initialTransactionCount, finalTransactionCount, 1);

      const transactionExists = await testHelpers.verifyTransactionExists(result.id);
      expect(transactionExists).toBe(true);

      const transactionRecord = await testHelpers.getTransactionInfo(result.id);
      AssertionHelpers.expectTransactionStructure(transactionRecord);

      const expectedData = {
        fromWalletId: 'wallet-atlas',
        toWalletId: 'wallet-sage',
        amount: 100,
        description: 'Integration test transaction'
      };
      // Normalizar el amount a number para comparación robusta
      const normalizedTransaction = {
        ...transactionRecord,
        amount: Number(transactionRecord.amount)
      };
      expect(normalizedTransaction).toMatchObject(expectedData);
    });

    // ...Agrega aquí más casos de éxito y error según tu plan de cobertura...
  });

  // ...Agrega aquí más describes para getTransactionHistory, getTransactionById, etc...
});
