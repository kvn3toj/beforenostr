import { Test, TestingModule } from '@nestjs/testing';
import { TransactionsService } from './transactions.service';
import { PrismaService } from '../../prisma/prisma.service';
import { WalletsService } from '../wallets/wallets.service';
import { SendTransactionDto, TransactionCurrency } from './dto/send-transaction.dto';
import { ForbiddenException, NotFoundException, BadRequestException } from '@nestjs/common';
import { Currency } from '../../generated/prisma';

const mockPrisma = {
  user: { findUnique: jest.fn() },
  $transaction: jest.fn(),
  wallet: { update: jest.fn(), upsert: jest.fn() },
  transaction: { create: jest.fn() },
};
const mockWalletsService = {
  hasSufficientBalance: jest.fn(),
  findOne: jest.fn(),
  create: jest.fn(),
  findAll: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
  addFunds: jest.fn(),
  deductFunds: jest.fn(),
  getBalance: jest.fn(),
  getTransactionHistory: jest.fn(),
  getWalletForUserAdmin: jest.fn(),
};

const mockCreateTransactionDto = {
  recipientId: 'user-2',
  amount: 100,
  currency: TransactionCurrency.UNITS,
  description: 'Test transaction',
};

describe('TransactionsService (unit)', () => {
  let service: TransactionsService;
  let prisma: typeof mockPrisma;
  let walletsService: typeof mockWalletsService;

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionsService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: WalletsService, useValue: mockWalletsService },
      ],
    }).compile();
    service = module.get(TransactionsService);
    prisma = module.get(PrismaService);
    walletsService = module.get(WalletsService);

    // Mock base: usuario existe por defecto
    mockPrisma.user = {
      findUnique: jest.fn().mockResolvedValue({
        id: 'user-2',
        email: 'user2@example.com',
        name: 'Test User 2',
      }),
    };
    // Mock inteligente de wallets
    mockWalletsService.getWalletForUserAdmin.mockImplementation((userId) => {
      const wallets = {
        'user-1': { id: 'wallet-1', userId: 'user-1', balanceUnits: 100 },
        'user-2': { id: 'wallet-2', userId: 'user-2', balanceUnits: 50 },
      };
      return Promise.resolve(wallets[userId]);
    });
  });

  it('debe rechazar auto-envío (ForbiddenException)', async () => {
    const dto: SendTransactionDto = {
      recipientId: 'user-1',
      amount: 10,
      currency: TransactionCurrency.UNITS,
    };
    await expect(service.sendTransaction('user-1', dto)).rejects.toThrow(ForbiddenException);
  });

  it('debe rechazar destinatario inexistente (NotFoundException)', async () => {
    prisma.user.findUnique.mockResolvedValueOnce(null);
    const dto: SendTransactionDto = {
      recipientId: 'user-2',
      amount: 10,
      currency: TransactionCurrency.UNITS,
    };
    await expect(service.sendTransaction('user-1', dto)).rejects.toThrow(NotFoundException);
    expect(prisma.user.findUnique).toHaveBeenCalledWith({ where: { id: 'user-2' } });
  });

  it('debe rechazar fondos insuficientes (ForbiddenException)', async () => {
    prisma.user.findUnique.mockResolvedValueOnce({ id: 'user-2' });
    walletsService.getWalletForUserAdmin.mockResolvedValueOnce({ balance: 5 });
    const dto: SendTransactionDto = {
      recipientId: 'user-2',
      amount: 10,
      currency: TransactionCurrency.UNITS,
    };
    await expect(service.sendTransaction('user-1', dto)).rejects.toThrow(ForbiddenException);
  });

  it('debe procesar exitosamente una transacción y persistir metadata', async () => {
    mockWalletsService.hasSufficientBalance.mockResolvedValue(true);
    prisma.user.findUnique.mockResolvedValue({ id: 'user-2' });
    prisma.$transaction.mockImplementation(async (cb) => {
      // Simula la transacción atómica
      return cb({
        wallet: { update: jest.fn(), upsert: jest.fn() },
        transaction: { create: jest.fn().mockResolvedValue({ id: 'tx-1', metadata: { foo: 'bar' } }) },
      });
    });
    const dto: SendTransactionDto = {
      recipientId: 'user-2',
      amount: 10,
      currency: TransactionCurrency.UNITS,
      description: 'Test',
      metadata: { foo: 'bar' },
    };
    const result = await service.sendTransaction('user-1', dto);
    expect(walletsService.hasSufficientBalance).toHaveBeenCalledWith(
      'user-1',
      dto.amount,
      Currency.UNITS
    );
    expect(result).toBeDefined();
    expect(result.id).toBe('tx-1');
  });

  it('debe crear wallet para receptor si no existe (upsert)', async () => {
    mockWalletsService.hasSufficientBalance.mockResolvedValue(true);
    prisma.user.findUnique.mockResolvedValue({ id: 'user-2' });
    prisma.$transaction.mockImplementation(async (cb) => {
      // Simula la transacción atómica
      return cb({
        wallet: {
          update: jest.fn(),
          upsert: jest.fn().mockResolvedValue({ userId: 'user-2', balance: 10 }),
        },
        transaction: { create: jest.fn().mockResolvedValue({ id: 'tx-2', metadata: {} }) },
      });
    });
    const dto: SendTransactionDto = {
      recipientId: 'user-2',
      amount: 10,
      currency: TransactionCurrency.UNITS,
    };
    const result = await service.sendTransaction('user-1', dto);
    expect(walletsService.hasSufficientBalance).toHaveBeenCalledWith(
      'user-1',
      dto.amount,
      Currency.UNITS
    );
    expect(result).toBeDefined();
    expect(result.id).toBe('tx-2');
  });

  it('should create a transaction successfully', async () => {
    mockWalletsService.hasSufficientBalance.mockResolvedValue(true);
    mockPrisma.user.findUnique.mockResolvedValue({ id: 'user-2' });
    mockPrisma.$transaction.mockResolvedValue({
      id: 'transaction-1',
      ...mockCreateTransactionDto,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    const result = await service.sendTransaction('user-1', mockCreateTransactionDto);
    expect(walletsService.hasSufficientBalance).toHaveBeenCalledWith(
      'user-1',
      mockCreateTransactionDto.amount,
      Currency.UNITS
    );
    expect(result).toBeDefined();
    expect(result.id).toBe('transaction-1');
  });

  it('should throw ForbiddenException for insufficient balance', async () => {
    mockWalletsService.hasSufficientBalance.mockResolvedValue(false);
    await expect(service.sendTransaction('user-1', mockCreateTransactionDto)).rejects.toThrow(
      ForbiddenException
    );
  });

  it('should throw NotFoundException for non-existent user', async () => {
    mockPrisma.user.findUnique.mockResolvedValue(null);
    await expect(service.sendTransaction('user-1', mockCreateTransactionDto)).rejects.toThrow(
      NotFoundException
    );
  });
});
