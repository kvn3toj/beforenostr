import { Test, TestingModule } from '@nestjs/testing';
import { TransactionsService } from './transactions.service';
import { PrismaService } from '../../prisma/prisma.service';
import { WalletsService } from '../wallets/wallets.service';
import { SendTransactionDto, TransactionCurrency } from './dto/send-transaction.dto';
import { ForbiddenException, NotFoundException } from '@nestjs/common';

const mockPrisma = {
  user: { findUnique: jest.fn() },
  $transaction: jest.fn(),
  wallet: { update: jest.fn(), upsert: jest.fn() },
  transaction: { create: jest.fn() },
};
const mockWalletsService = {
  getWalletForUserAdmin: jest.fn(),
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
    prisma.user.findUnique.mockResolvedValueOnce({ id: 'user-2' });
    walletsService.getWalletForUserAdmin.mockResolvedValueOnce({ balance: 100 });
    const createdTx = { id: 'tx-1', metadata: { foo: 'bar' } };
    prisma.$transaction.mockImplementation(async (cb) => {
      // Simula la transacción atómica
      return cb({
        wallet: { update: jest.fn(), upsert: jest.fn() },
        transaction: { create: jest.fn().mockResolvedValue(createdTx) },
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
    expect(result).toEqual(createdTx);
    expect(prisma.$transaction).toHaveBeenCalled();
  });

  it('debe crear wallet para receptor si no existe (upsert)', async () => {
    prisma.user.findUnique.mockResolvedValueOnce({ id: 'user-2' });
    walletsService.getWalletForUserAdmin.mockResolvedValueOnce({ balance: 100 });
    const createdTx = { id: 'tx-2', metadata: {} };
    prisma.$transaction.mockImplementation(async (cb) => {
      // Simula la transacción atómica
      return cb({
        wallet: {
          update: jest.fn(),
          upsert: jest.fn().mockResolvedValue({ userId: 'user-2', balance: 10 }),
        },
        transaction: { create: jest.fn().mockResolvedValue(createdTx) },
      });
    });
    const dto: SendTransactionDto = {
      recipientId: 'user-2',
      amount: 10,
      currency: TransactionCurrency.UNITS,
    };
    const result = await service.sendTransaction('user-1', dto);
    expect(result).toEqual(createdTx);
    expect(prisma.$transaction).toHaveBeenCalled();
  });
});
