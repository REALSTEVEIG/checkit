import { INestApplication, HttpStatus } from '@nestjs/common';
import request from 'supertest';
import { setupTestApp, resetDatabase, closeTestApp } from '../setup';
import { faker } from '@faker-js/faker';

describe('Users Controller (Integration)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    app = await setupTestApp();
    await resetDatabase();
  });

  afterAll(async () => {
    await closeTestApp();
  });

  describe('/users/register (POST)', () => {
    it('should register a new user successfully', async () => {
      const userDto = {
        username: faker.internet.userName(),
        email: faker.internet.email(),
        password: 'securepassword',
      };

      const response = await request(app.getHttpServer())
        .post('/users/register')
        .send(userDto)
        .expect(HttpStatus.CREATED);

      expect(response.body).toHaveProperty('id');
      expect(response.body.username).toBe(userDto.username);
      expect(response.body.email).toBe(userDto.email);
    });
  });
});
