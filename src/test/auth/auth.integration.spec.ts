import { INestApplication, HttpStatus } from '@nestjs/common';
import request from 'supertest';
import { setupTestApp, resetDatabase, closeTestApp } from '../setup';
import bcrypt from 'bcryptjs';
import { PrismaService } from '@shared/services/prisma.services';

describe('Auth Controller (Integration)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    app = await setupTestApp();
    await resetDatabase();
    const prismaService = app.get(PrismaService);
    await prismaService.user.create({
      data: {
        username: 'testuser',
        password: await bcrypt.hash('password', 10),
        email: 'testuser@example.com',
      },
    });
  });

  afterAll(async () => {
    await closeTestApp();
  });

  describe('/auth/login (POST)', () => {
    it('should authenticate and return a JWT token', async () => {
      const loginDto = { username: 'testuser', password: 'password' };

      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send(loginDto)
        .expect(HttpStatus.CREATED);

      expect(response.body).toHaveProperty('access_token');
    });

    it('should return 401 for invalid credentials', async () => {
      const loginDto = { username: 'invaliduser', password: 'wrongpassword' };

      await request(app.getHttpServer())
        .post('/auth/login')
        .send(loginDto)
        .expect(HttpStatus.UNAUTHORIZED);
    });
  });
});
