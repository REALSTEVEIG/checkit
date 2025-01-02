import { INestApplication, HttpStatus } from '@nestjs/common';
import request from 'supertest';
import jwt from 'jsonwebtoken';
import { setupTestApp, resetDatabase, closeTestApp } from '../setup';
import { PrismaService } from '@shared/services/prisma.services';

describe('Orders Controller (Integration)', () => {
  let app: INestApplication;
  let prismaService: PrismaService;
  let token: string;
  let userId: number;

  beforeAll(async () => {
    app = await setupTestApp();
    prismaService = app.get(PrismaService);
    await resetDatabase();
  });

  afterAll(async () => {
    await closeTestApp();
  });

  beforeEach(async () => {
    const user = await prismaService.user.create({
      data: {
        username: `user_${Date.now()}`,
        email: `user_${Date.now()}@example.com`,
        password: 'hashedpassword',
      },
    });

    userId = user.id;
    token = jwt.sign(
      { userId: user.id, username: user.username },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '1h' },
    );
  });

  describe('/orders (POST)', () => {
    it('should create an order and return the created order', async () => {
      const orderDto = {
        description: 'Test order',
        specifications: 'Test specs',
        quantity: 10,
        metadata: { key: 'value' },
        userId,
      };

      const response = await request(app.getHttpServer())
        .post('/orders')
        .set('Authorization', `Bearer ${token}`)
        .send(orderDto)
        .expect(HttpStatus.CREATED);

      expect(response.body).toHaveProperty('id');
      expect(response.body.description).toBe(orderDto.description);
    });
  });
});
