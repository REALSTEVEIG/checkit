import { INestApplication, HttpStatus } from '@nestjs/common';
import request from 'supertest';
import { setupTestApp, resetDatabase, closeTestApp } from '../setup';
import { PrismaService } from '@shared/services/prisma.services';
import { faker } from '@faker-js/faker';

describe('Users Controller (Integration)', () => {
  let app: INestApplication;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let prismaService: PrismaService;

  beforeAll(async () => {
    app = await setupTestApp();
    prismaService = app.get(PrismaService);
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

    it('should return 400 for duplicate email or username', async () => {
      const userDto = {
        username: faker.internet.userName(),
        email: faker.internet.email(),
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
        username: 1,
        email: 'invalidemail',
        password: 1,
      };

      await request(app.getHttpServer())
        .post('/users/register')
        .send(userDto)
        .expect(HttpStatus.BAD_REQUEST);
    });
  });
});
