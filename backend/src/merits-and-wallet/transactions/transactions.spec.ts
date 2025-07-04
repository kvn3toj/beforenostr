import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../../app.module';
import { PrismaService } from '../../prisma/prisma.service';
import { AuthService } from '../../auth/auth.service';
import { User } from '../../generated/prisma';
import * as bcrypt from 'bcrypt';
import { TransactionCurrency } from './dto/send-transaction.dto';

/**
 * 🧪 Crisol de Pruebas E2E para Transactions
 *
 * Este conjunto de pruebas valida el flujo completo del endpoint POST /transactions/send,
 * asegurando la integridad, seguridad y alineación filosófica de las transacciones.
 * Actúa como un "viaje de prueba" automatizado que simula el ciclo completo
 * desde el envío hasta la recepción, la actualización de saldos y el registro de metadata.
 */
describe('TransactionsController (E2E) - El Crisol de la Confianza', () => {
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
    app.useGlobalPipes(
      new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true })
    );
    await app.init();

    prisma = app.get(PrismaService);
    authService = app.get(AuthService);

    // Limpieza alquímica del entorno de pruebas
    await prisma.transaction.deleteMany({});
    await prisma.wallet.deleteMany({});
    await prisma.user.deleteMany({
      where: { email: { contains: '.e2e@test.com' } },
    });

    const hashedPassword = await bcrypt.hash('password123', 10);

    // Creación de arquetipos para la prueba: el Dador y el Receptor
    sender = await prisma.user.create({
      data: {
        email: 'sender.e2e@test.com',
        password: hashedPassword,
        name: 'Test Sender',
        wallet: { create: { balance: 100, currency: 'Ünits' } },
      },
    });

    receiver = await prisma.user.create({
      data: {
        email: 'receiver.e2e@test.com',
        password: hashedPassword,
        name: 'Test Receiver',
        wallet: { create: { balance: 50, currency: 'Ünits' } },
      },
    });

    const loginResponse = await authService.login({
      email: sender.email,
      password: 'password123',
    });
    senderToken = loginResponse.access_token;
  });

  afterAll(async () => {
    await prisma.$disconnect();
    await app.close();
  });

  describe('🛡️ Pruebas de la Membrana Jud-0 (Seguridad y Validación)', () => {
    it('debe rechazar transacciones sin autenticación (401 Unauthorized)', () => {
      return request(app.getHttpServer())
        .post('/transactions/send')
        .send({
          recipientId: receiver.id,
          amount: 10,
          currency: TransactionCurrency.UNITS,
        })
        .expect(401);
    });

    it('debe rechazar transacciones con un DTO inválido (400 Bad Request)', async () => {
      // Caso 1: Monto negativo
      await request(app.getHttpServer())
        .post('/transactions/send')
        .set('Authorization', `Bearer ${senderToken}`)
        .send({
          recipientId: receiver.id,
          amount: -10,
          currency: TransactionCurrency.UNITS,
        })
        .expect(400);

      // Caso 2: Moneda inválida
      await request(app.getHttpServer())
        .post('/transactions/send')
        .set('Authorization', `Bearer ${senderToken}`)
        .send({ recipientId: receiver.id, amount: 10, currency: 'InvalidCash' })
        .expect(400);

      // Caso 3: recipientId no es UUID
      await request(app.getHttpServer())
        .post('/transactions/send')
        .set('Authorization', `Bearer ${senderToken}`)
        .send({
          recipientId: 'not-a-uuid',
          amount: 10,
          currency: TransactionCurrency.UNITS,
        })
        .expect(400);
    });
  });

  describe('📜 Pruebas de Lógica de Negocio y Flujo de Reciprocidad', () => {
    it('debe rechazar un auto-envío (403 Forbidden)', () => {
      return request(app.getHttpServer())
        .post('/transactions/send')
        .set('Authorization', `Bearer ${senderToken}`)
        .send({
          recipientId: sender.id, // Enviándose a sí mismo
          amount: 10,
          currency: TransactionCurrency.UNITS,
        })
        .expect(403)
        .then((response) => {
          expect(response.body.message).toContain(
            'No puedes enviarte valor a ti mismo'
          );
        });
    });

    it('debe rechazar transacción si el destinatario no existe (404 Not Found)', () => {
      const nonExistentId = 'a1b2c3d4-e5f6-7890-1234-567890abcdef';
      return request(app.getHttpServer())
        .post('/transactions/send')
        .set('Authorization', `Bearer ${senderToken}`)
        .send({
          recipientId: nonExistentId,
          amount: 10,
          currency: TransactionCurrency.UNITS,
        })
        .expect(404)
        .then((response) => {
          expect(response.body.message).toContain(
            `destinatario con id '${nonExistentId}' no fue encontrado`
          );
        });
    });

    it('debe rechazar transacción por balance insuficiente (403 Forbidden)', () => {
      return request(app.getHttpServer())
        .post('/transactions/send')
        .set('Authorization', `Bearer ${senderToken}`)
        .send({
          recipientId: receiver.id,
          amount: 200, // Intentar enviar más de los 100 que tiene
          currency: TransactionCurrency.UNITS,
        })
        .expect(403)
        .then((response) => {
          expect(response.body.message).toContain('Fondos insuficientes');
        });
    });

    it('debe procesar exitosamente una transacción de Ünits y actualizar balances', async () => {
      const amountToSend = 50;
      const senderInitialWallet = await prisma.wallet.findUnique({
        where: { userId: sender.id },
      });
      const receiverInitialWallet = await prisma.wallet.findUnique({
        where: { userId: receiver.id },
      });

      await request(app.getHttpServer())
        .post('/transactions/send')
        .set('Authorization', `Bearer ${senderToken}`)
        .send({
          recipientId: receiver.id,
          amount: amountToSend,
          currency: TransactionCurrency.UNITS,
          description: 'Prueba de SAGE',
          metadata: { cause: 'Test E2E', tool: 'SAGE' },
        })
        .expect(201);

      const finalSenderWallet = await prisma.wallet.findUnique({
        where: { userId: sender.id },
      });
      const finalReceiverWallet = await prisma.wallet.findUnique({
        where: { userId: receiver.id },
      });
      const transaction = await prisma.transaction.findFirst({
        where: {
          fromUserId: sender.id,
          toUserId: receiver.id,
          currency: TransactionCurrency.UNITS,
        },
      });

      expect(finalSenderWallet!.balance).toBe(
        senderInitialWallet!.balance - amountToSend
      );
      expect(finalReceiverWallet!.balance).toBe(
        receiverInitialWallet!.balance + amountToSend
      );

      expect(transaction).toBeDefined();
      expect(transaction!.amount).toBe(amountToSend);
      expect(transaction!.description).toBe('Prueba de SAGE');
      expect(transaction!.metadata).toHaveProperty('cause', 'Test E2E');
    });

    it('debe procesar exitosamente una transacción de Mëritos (afectando la misma wallet)', async () => {
      // En esta prueba, asumimos que "Mëritos" es otra moneda que afecta el mismo `balance` del Wallet.
      const meritsToSend = 10;
      // El sender tiene 50 Ünits restantes. Los méritos no deben interferir con ese balance si son lógicas separadas.
      // Para esta prueba, asumiremos que se descuentan del mismo balance general.
      const senderInitialWallet = await prisma.wallet.findUnique({
        where: { userId: sender.id },
      });

      await request(app.getHttpServer())
        .post('/transactions/send')
        .set('Authorization', `Bearer ${senderToken}`)
        .send({
          recipientId: receiver.id,
          amount: meritsToSend,
          currency: TransactionCurrency.MERITS,
          description: 'Reconocimiento de valor en Mëritos',
        })
        .expect(201);

      const finalSenderWallet = await prisma.wallet.findUnique({
        where: { userId: sender.id },
      });
      const transaction = await prisma.transaction.findFirst({
        where: { fromUserId: sender.id, currency: TransactionCurrency.MERITS },
        orderBy: { createdAt: 'desc' },
      });

      expect(finalSenderWallet!.balance).toBe(
        senderInitialWallet!.balance - meritsToSend
      );
      expect(transaction).toBeDefined();
      expect(transaction!.amount).toBe(meritsToSend);
      expect(transaction!.currency).toBe(TransactionCurrency.MERITS);
    });
  });
});
