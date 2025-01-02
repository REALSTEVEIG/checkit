import { INestApplication, HttpStatus } from '@nestjs/common';
import request from 'supertest';
import { setupTestApp, resetDatabase, closeTestApp } from '../setup';
import { PrismaService } from '@shared/services/prisma.services';

describe('Chat Controller (Integration)', () => {
  let app: INestApplication;
  let prismaService: PrismaService;

  beforeAll(async () => {
    app = await setupTestApp();
    prismaService = app.get(PrismaService);
    await resetDatabase();
  });

  afterAll(async () => {
    await closeTestApp();
  });

  describe('/chats/message (POST)', () => {
    it('should add a message to a chat room', async () => {
      // Seed user and chat room
      const user = await prismaService.user.create({
        data: {
          username: 'user1',
          email: 'user1@example.com',
          password: 'password',
        },
      });
      const chatRoom = await prismaService.chatRoom.create({
        data: { orderId: 1, isClosed: false },
      });

      const messageDto = {
        chatRoomId: chatRoom.id,
        senderId: user.id,
        content: 'Test message',
      };

      const response = await request(app.getHttpServer())
        .post('/chats/message')
        .send(messageDto)
        .expect(HttpStatus.CREATED);

      expect(response.body).toHaveProperty('id');
      expect(response.body.content).toBe(messageDto.content);
    });
  });
});
