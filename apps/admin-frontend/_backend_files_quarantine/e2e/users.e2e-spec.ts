import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../app.module'; // Adjust if testing a subset of modules
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { JwtStrategy } from '../auth/strategies/jwt.strategy'; // Assuming this is your JWT strategy

describe('Users E2E', () => {
  let app: INestApplication;
  let prismaService: PrismaService; // Use if interacting with DB in tests
  let jwtService: JwtService; // Use to generate tokens for tests

  // Mock user data for testing different roles/permissions
  const adminUser = { id: 'test-admin-id', email: 'test.admin@example.com', role: { name: 'admin' }, roles: [{ name: 'admin' }], permissions: ['read:users', 'create:users', 'update:users', 'delete:users', 'manage:roles', 'manage:permissions'] };
  const regularUser = { id: 'test-user-id', email: 'test.user@example.com', role: { name: 'user' }, roles: [{ name: 'user' }], permissions: ['read:self'] };
  const anotherUser = { id: 'test-another-user-id', email: 'test.another@example.com' }; // User data to be potentially accessed

  // Helper to generate a mock token using the real JwtService
  const generateToken = (user: any) => {
      // The payload should match what your JwtStrategy expects
      return jwtService.sign({ sub: user.id, email: user.email });
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule], // Import your main application module or relevant modules
      // Consider overriding PrismaService with a testing database or in-memory alternative
      // if your E2E tests require actual DB interaction rather than just mocking guard behavior.
    })
    // Override the JwtStrategy to control which user is attached to the request based on the token payload
    // This allows simulating different logged-in users without a real auth flow.
    .overrideProvider(JwtStrategy)
    .useValue({
        validate: async (payload: { sub: string, email: string }) => {
            // Simulate user lookup based on payload from token
            if (payload.sub === adminUser.id) return adminUser;
            if (payload.sub === regularUser.id) return regularUser;
            // Add other test users if needed
            return null; // User not found or invalid token
        }
    })
    .compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    // Get real instances of services if needed for test data setup or assertions
    // prismaService = moduleFixture.get<PrismaService>(PrismaService);
    jwtService = moduleFixture.get<JwtService>(JwtService);

    // Optional: Set up test data in the database before running tests
    // E.g., create adminUser, regularUser, and anotherUser in the test database
    // You might need to mock PrismaService methods in your test setup if you don't use a real test DB.
  });

  afterAll(async () => {
    await app.close();
    // Optional: Clean up test data from the database after tests
  });

  describe('GET /users/me', () => {
    it('should return 401 Unauthorized without a token', () => {
      return request(app.getHttpServer())
        .get('/users/me')
        .expect(401);
    });

    it('should return 200 OK and the regular user\'s data with a valid user token', async () => {
      const userToken = generateToken(regularUser);

      return request(app.getHttpServer())
        .get('/users/me')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200)
        .expect(res => {
            expect(res.body.id).toBe(regularUser.id);
            expect(res.body.email).toBe(regularUser.email);
            // Add more assertions based on your user object structure
        });
    });

    it('should return 200 OK and the admin user\'s data with a valid admin token', async () => {
        const adminToken = generateToken(adminUser);
  
        return request(app.getHttpServer())
          .get('/users/me')
          .set('Authorization', `Bearer ${adminToken}`)
          .expect(200)
          .expect(res => {
              expect(res.body.id).toBe(adminUser.id);
              expect(res.body.email).toBe(adminUser.email);
          });
      });
  });

  describe('GET /users', () => {
    it('should return 401 Unauthorized without a token', () => {
      return request(app.getHttpServer())
        .get('/users')
        .expect(401);
    });

    it('should return 403 Forbidden with a non-admin user token', async () => {
      const userToken = generateToken(regularUser);

      return request(app.getHttpServer())
        .get('/users')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(403); // Assuming /users requires admin role
    });

    it('should return 200 OK with an admin user token', async () => {
      const adminToken = generateToken(adminUser);

      return request(app.getHttpServer())
        .get('/users')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);
        // Add assertions for the response body (e.g., array of users)
    });
  });

  describe('GET /users/:id', () => {
    it('should return 401 Unauthorized without a token', () => {
      return request(app.getHttpServer())
        .get(`/users/${regularUser.id}`)
        .expect(401);
    });

    it('should return 200 OK for own data with a valid user token', async () => {
      const userToken = generateToken(regularUser);

      return request(app.getHttpServer())
        .get(`/users/${regularUser.id}`)
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200)
        .expect(res => {
            expect(res.body.id).toBe(regularUser.id);
        });
    });

    it('should return 403 Forbidden for another user\'s data with a non-admin user token', async () => {
      const userToken = generateToken(regularUser);

      return request(app.getHttpServer())
        .get(`/users/${anotherUser.id}`)
        .set('Authorization', `Bearer ${userToken}`)
        .expect(403); // Assuming RBAC ownership or admin role is required
    });

    it('should return 200 OK for any user\'s data with an admin user token', async () => {
      const adminToken = generateToken(adminUser);

      return request(app.getHttpServer())
        .get(`/users/${regularUser.id}`) // Can access own data
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200)
        .expect(res => {
            expect(res.body.id).toBe(regularUser.id);
        });

      // And for another user's data
      return request(app.getHttpServer())
        .get(`/users/${anotherUser.id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200)
        .expect(res => {
            expect(res.body.id).toBe(anotherUser.id);
        });
    });
  });

  // Add tests for POST /users, PATCH /users/:id, DELETE /users/:id
  // These will require mocking Prisma or using a test DB to handle data creation/updates.
  // Example POST /users (requires admin role):
  // describe('POST /users', () => {
  //     it('should return 401 Unauthorized without a token', () => {
  //         return request(app.getHttpServer())
  //           .post('/users')
  //           .send({ email: 'newuser@example.com', password: 'password' })
  //           .expect(401);
  //     });

  //     it('should return 403 Forbidden with a non-admin user token', async () => {
  //         const userToken = generateToken(regularUser);
  //         return request(app.getHttpServer())
  //           .post('/users')
  // Add tests for GET /users/:id, POST /users, PATCH /users/:id, DELETE /users/:id
  // These tests should similarly verify 401, 403, and 200/201/204 responses based on user role.
  // For tests involving creating/updating/deleting users, you might need to interact with the test database.
}); 