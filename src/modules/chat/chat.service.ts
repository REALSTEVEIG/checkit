import { PrismaService } from 'shared/services/prisma.services';
import { Injectable, BadRequestException, HttpException, HttpStatus } from '@nestjs/common';

@Injectable()
export class ChatService {
  constructor(private prisma: PrismaService) {}

  async createChat(orderId: number) {
    try {
      return await this.prisma.chatRoom.create({
        data: {
          orderId,
          isClosed: false,
        },
      });
    } catch (error: any) {
      throw new HttpException(`Error creating chat: ${error.message}`, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async addMessage(chatRoomId: number, senderId: number, content: string) {
    try {
      const chatRoom = await this.prisma.chatRoom.findUnique({
        where: { id: chatRoomId },
      });

      if (chatRoom?.isClosed) {
        throw new BadRequestException('Chat room is closed. Cannot add messages.');
      }

      return await this.prisma.message.create({
        data: {
          chatRoomId,
          senderId,
          content,
        },
      });
    } catch (error: any) {
      throw new HttpException(`Error adding message: ${error.message}`, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async closeChat(chatRoomId: number, summary: string) {
    try {
      return await this.prisma.chatRoom.update({
        where: { id: chatRoomId },
        data: {
          isClosed: true,
          summary,
        },
      });
    } catch (error: any) {
      throw new HttpException(`Error closing chat: ${error.message}`, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getMessages(chatRoomId: number) {
    try {
      return await this.prisma.message.findMany({
        where: { chatRoomId },
        orderBy: { createdAt: 'asc' },
      });
    } catch (error: any) {
      throw new HttpException(`Error retrieving messages: ${error.message}`, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
