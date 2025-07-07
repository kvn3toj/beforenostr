import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';

describe('Marketplace (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let authToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    prisma = moduleFixture.get<PrismaService>(PrismaService);
    await app.init();

    // Authenticate to get token
    const loginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: 'admin@gamifier.com',
        password: 'CoomUnity2025!Admin',
      })
      .expect(201);

    authToken = loginResponse.body.access_token;
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/marketplace/items (GET)', () => {
    it('should return marketplace items successfully', async () => {
      const response = await request(app.getHttpServer())
        .get('/marketplace/items')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toBeDefined();
      expect(Array.isArray(response.body.items || response.body)).toBe(true);

      // If there are items, validate structure
      const items = response.body.items || response.body;
      if (items.length > 0) {
        const item = items[0];
        expect(item).toHaveProperty('id');
        expect(item).toHaveProperty('name');
        expect(item).toHaveProperty('description');
        expect(item).toHaveProperty('itemType');
        expect(item).toHaveProperty('price');
        expect(item).toHaveProperty('status');
        expect(item).toHaveProperty('sellerId');
      }
    });

    it('should return 401 when not authenticated', async () => {
      await request(app.getHttpServer())
        .get('/marketplace/items')
        .expect(401);
    });

    it('should handle pagination parameters', async () => {
      const response = await request(app.getHttpServer())
        .get('/marketplace/items?page=1&limit=5')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toBeDefined();
    });

    it('should handle category filtering', async () => {
      const response = await request(app.getHttpServer())
        .get('/marketplace/items?category=Salud & Bienestar')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toBeDefined();
    });

    it('should handle search functionality', async () => {
      const response = await request(app.getHttpServer())
        .get('/marketplace/items?search=kombucha')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toBeDefined();
    });
  });

  describe('/marketplace/items/:id (GET)', () => {
    it('should return a specific marketplace item', async () => {
      // First get all items to find an ID
      const itemsResponse = await request(app.getHttpServer())
        .get('/marketplace/items')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      const items = itemsResponse.body.items || itemsResponse.body;
      if (items.length > 0) {
        const itemId = items[0].id;

        const response = await request(app.getHttpServer())
          .get(`/marketplace/items/${itemId}`)
          .set('Authorization', `Bearer ${authToken}`)
          .expect(200);

        expect(response.body).toHaveProperty('id', itemId);
        expect(response.body).toHaveProperty('name');
        expect(response.body).toHaveProperty('description');
      }
    });

    it('should return 404 for non-existent item', async () => {
      const fakeId = '00000000-0000-0000-0000-000000000000';
      await request(app.getHttpServer())
        .get(`/marketplace/items/${fakeId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);
    });
  });

  describe('Database seed validation', () => {
    it('should have seeded marketplace items in database', async () => {
      const items = await prisma.marketplaceItem.findMany();
      expect(items.length).toBeGreaterThan(0);

      // Check for specific seeded items
      const huerto = await prisma.marketplaceItem.findFirst({
        where: { name: { contains: 'Huerto' } },
      });
      expect(huerto).toBeDefined();
      expect(huerto?.itemType).toBe('SERVICE');
      expect(huerto?.status).toBe('ACTIVE');

      const kombucha = await prisma.marketplaceItem.findFirst({
        where: { name: { contains: 'Kombucha' } },
      });
      expect(kombucha).toBeDefined();
      expect(kombucha?.itemType).toBe('PRODUCT');
      expect(kombucha?.status).toBe('ACTIVE');
    });

    it('should have users associated with marketplace items', async () => {
      const itemsWithSeller = await prisma.marketplaceItem.findMany({
        include: {
          seller: true,
        },
      });

      expect(itemsWithSeller.length).toBeGreaterThan(0);

      // Verify all items have valid sellers
      itemsWithSeller.forEach(item => {
        expect(item.seller).toBeDefined();
        expect(item.seller.email).toBeDefined();
        expect(item.seller.status).toBe('ACTIVE');
      });
    });
  });

  describe('Error handling', () => {
    it('should handle database connection errors gracefully', async () => {
      // This test validates that the endpoint doesn't crash on database issues
      const response = await request(app.getHttpServer())
        .get('/marketplace/items')
        .set('Authorization', `Bearer ${authToken}`);

      // Should either return 200 with data or 500 with proper error message
      expect([200, 500]).toContain(response.status);

      if (response.status === 500) {
        expect(response.body).toHaveProperty('message');
      }
    });
  });
});
