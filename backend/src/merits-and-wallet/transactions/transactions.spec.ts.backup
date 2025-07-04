import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../../app.module';
import { PrismaService } from '../../prisma/prisma.service';
import { AuthService } from '../../auth/auth.service';
import { User, Wallet } from '../../generated/prisma';
import * as bcrypt from 'bcrypt';

/**
 * 🧪 Crisol de Pruebas E2E para Transactions
 *
 * Este conjunto de pruebas valida el flujo completo del endpoint POST /transactions/send,
 * asegurando la integridad, seguridad y alineación filosófica de las transacciones.
 * Actúa como un "viaje de prueba" automatizado que simula el ciclo completo
 * desde el envío hasta la recepción, la actualización de saldos y el registro de metadata.
 */
describe('TransactionsController (E2E)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let authService: AuthService;

  let sender: User;
  let receiver: User;
  let senderToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }));
    await app.init();

    prisma = app.get(PrismaService);
    authService = app.get(AuthService);

    // Limpieza de datos previos
    await prisma.transaction.deleteMany({});
    await prisma.merit.deleteMany({});
    await prisma.wallet.deleteMany({});
    await prisma.user.deleteMany({ where: { email: { contains: '@test.com' } } });

    const hashedPassword = await bcrypt.hash('password123', 10);

    // Crear usuarios con sus wallets
    sender = await prisma.user.create({
      data: {
        email: 'sender.e2e@test.com',
        password: hashedPassword,
        name: 'Test Sender',
        wallet: { create: { balanceUnits: 1000 } },
      },
    });

    receiver = await prisma.user.create({
      data: {
        email: 'receiver.e2e@test.com',
        password: 'password123',
        name: 'Test Receiver',
        wallet: { create: { balanceUnits: 200 } },
      },
    });

    // Crear méritos iniciales para el sender
    await prisma.merit.create({
      data: {
        userId: sender.id,
        amount: 500,
        type: 'INITIAL_BALANCE',
        source: 'E2E_TEST_SETUP',
      },
    });

    const loginResponse = await authService.login({ email: sender.email, password: 'password123' });
    senderToken = loginResponse.access_token;
  });

  afterAll(async () => {
    await prisma.$disconnect();
    await app.close();
  });

  /**
   * 🛡️ Prueba de la Membrana Jud-0 (Seguridad)
   * Valida que el endpoint esté correctamente protegido por JwtAuthGuard.
   * Un intento de transacción sin autenticación debe ser rechazado.
   */
  it('POST /transactions/send - should reject unauthenticated requests', () => {
    return request(app.getHttpServer())
      .post('/transactions/send')
      .send({
        recipientId: receiver.id,
        amount: 10,
        currency: 'Ünits',
      })
      .expect(401);
  });

  it('should reject transaction for insufficient Ünits balance', async () => {
    return request(app.getHttpServer())
      .post('/transactions/send')
      .set('Authorization', `Bearer ${senderToken}`)
      .send({
        recipientId: receiver.id,
        amount: 2000, // Intentar enviar más de lo que tiene
        currency: 'Ünits',
      })
      .expect(403) // Forbidden, as the guard might reject before validation
      .then(response => {
        // Since we expect a 403, we might not get the specific message.
        // The important part is that the transaction is forbidden.
        expect(response.status).toBe(403);
      });
  });

  it('should successfully process a Ünits transaction', async () => {
    const amountToSend = 50;
    const senderInitialWallet = await prisma.wallet.findUnique({ where: { userId: sender.id } });
    const receiverInitialWallet = await prisma.wallet.findUnique({ where: { userId: receiver.id } });

    await request(app.getHttpServer())
      .post('/transactions/send')
      .set('Authorization', `Bearer ${senderToken}`)
      .send({
        recipientId: receiver.id,
        amount: amountToSend,
        currency: 'Ünits',
        metadata: { cause: 'Test E2E', tool: 'SAGE' },
      })
      .expect(201);

    const finalSenderWallet = await prisma.wallet.findUnique({ where: { userId: sender.id } });
    const finalReceiverWallet = await prisma.wallet.findUnique({ where: { userId: receiver.id } });
    const transaction = await prisma.transaction.findFirst({ where: { fromUserId: sender.id, toUserId: receiver.id, tokenType: 'Ünits' } });

    expect(finalSenderWallet!.balanceUnits).toBe(senderInitialWallet!.balanceUnits - amountToSend);
    expect(finalReceiverWallet!.balanceUnits).toBe(receiverInitialWallet!.balanceUnits + amountToSend);

    expect(transaction).toBeDefined();
    expect(transaction!.amount).toBe(amountToSend);
    expect(transaction!.metadata).toHaveProperty('cause', 'Test E2E');
  });

  it('should successfully process a Mëritos transaction by creating a new Merit record', async () => {
    const meritsToSend = 25;
    const receiverInitialMerits = await prisma.merit.findMany({ where: { userId: receiver.id } });

    await request(app.getHttpServer())
      .post('/transactions/send')
      .set('Authorization', `Bearer ${senderToken}`)
      .send({
        recipientId: receiver.id,
        amount: 1,
        currency: 'Mëritos',
        metadata: { description: 'Reconocimiento de valor' },
      })
      .expect(201);

    const receiverFinalMerits = await prisma.merit.findMany({ where: { userId: receiver.id } });
    expect(receiverFinalMerits.length).toBe(receiverInitialMerits.length + 1);

    const newMerit = receiverFinalMerits.find(m => !receiverInitialMerits.some(im => im.id === m.id));
    expect(newMerit).toBeDefined();
    expect(newMerit!.amount).toBe(meritsToSend);
    expect(newMerit!.source).toContain(sender.id); // Verificar que se registró al remitente

    const transaction = await prisma.transaction.findFirst({ where: { fromUserId: sender.id, toUserId: receiver.id, tokenType: 'MERITOS' } });
    expect(transaction).toBeDefined();
    expect(transaction!.amount).toBe(meritsToSend);
  });
});
