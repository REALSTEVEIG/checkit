// test/users/users.integration.spec.ts
import { INestApplication, HttpStatus } from '@nestjs/common';
import request from 'supertest';
import { setupTestApp, resetDatabase, closeTestApp } from '../setup';

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
        username: 'newuser',
        email: 'newuser@example.com',
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

    it('should return 400 for duplicate email or username', async () => {
      const userDto = {
        username: 'duplicateuser',
        email: 'duplicate@example.com',
        password: 'securepassword',
      };

      // First registration
      await request(app.getHttpServer())
        .post('/users/register')
        .send(userDto)
        .expect(HttpStatus.CREATED);

      // Second registration with the same username or email
      await request(app.getHttpServer())
        .post('/users/register')
        .send(userDto)
        .expect(HttpStatus.BAD_REQUEST);
    });

    it('should return 400 for invalid input data', async () => {
      const userDto = {
        username: '',
        email: 'invalidemail',
        password: '',
      };

      await request(app.getHttpServer())
        .post('/users/register')
        .send(userDto)
        .expect(HttpStatus.BAD_REQUEST);
    });
  });
});
