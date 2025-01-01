// test/auth/auth.integration.spec.ts
import { INestApplication, HttpStatus } from '@nestjs/common';
import request from 'supertest';
import { setupTestApp, resetDatabase, closeTestApp } from '../setup';

describe('Auth Controller (Integration)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    app = await setupTestApp();
    await resetDatabase();
  });

  afterAll(async () => {
    await closeTestApp();
  });

  describe('/auth/login (POST)', () => {
    it('should authenticate and return a JWT token', async () => {
      // Seed user
      await app.get('PrismaService').user.create({
        data: {
          username: 'testuser',
          password: '$2a$10$hashedpassword',
          email: 'testuser@example.com',
        },
      });

      const loginDto = { username: 'testuser', password: 'password' };

      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send(loginDto)
        .expect(HttpStatus.CREATED);

      expect(response.body).toHaveProperty('access_token');
    });

    it('should return 401 for invalid credentials', async () => {
      const loginDto = { username: 'invaliduser', password: 'password' };

      await request(app.getHttpServer())
        .post('/auth/login')
        .send(loginDto)
        .expect(HttpStatus.UNAUTHORIZED);
    });
  });
});
