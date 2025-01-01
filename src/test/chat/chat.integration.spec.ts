import { INestApplication, HttpStatus } from '@nestjs/common';
import request from 'supertest';
import { setupTestApp, resetDatabase, closeTestApp } from '../setup';
import { PrismaService } from '@shared/services/prisma.services';

describe('Chat Controller (Integration)', () => {
  let app: INestApplication;
  let prismaService: PrismaService;

  beforeAll(async () => {
    app = await setupTestApp();
    prismaService = app.get(PrismaService); // Initialize PrismaService
    await resetDatabase();
  });

  afterAll(async () => {
    await closeTestApp();
  });

  describe('/chats/message (POST)', () => {
    it('should add a message to a chat room', async () => {
      // Seed chat room
      const chatRoom = await prismaService.chatRoom.create({
        data: { orderId: 1, isClosed: false },
      });

      const messageDto = {
        chatRoomId: chatRoom.id,
        senderId: 1,
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
