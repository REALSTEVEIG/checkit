import { INestApplication, HttpStatus } from '@nestjs/common';
import request from 'supertest';
import { setupTestApp, resetDatabase, closeTestApp } from '../setup';

describe('Orders Controller (Integration)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    app = await setupTestApp();
    await resetDatabase();
  });

  afterAll(async () => {
    await closeTestApp();
  });

  describe('/orders (POST)', () => {
    it('should create an order and return the created order', async () => {
      const orderDto = {
        description: 'Test order',
        specifications: 'Test specs',
        quantity: 10,
        metadata: { key: 'value' },
        userId: 1,
      };

      const response = await request(app.getHttpServer())
        .post('/orders')
        .set('Authorization', 'Bearer <valid-jwt-token>')
        .send(orderDto)
        .expect(HttpStatus.CREATED);

      expect(response.body).toHaveProperty('id');
      expect(response.body.description).toBe(orderDto.description);
    });
  });
});
