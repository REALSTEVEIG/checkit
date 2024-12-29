import { PrismaService } from 'shared/services/prisma.services';
import { Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class ChatService {
  constructor(private prisma: PrismaService) {}

  async createChat(orderId: number) {
    return this.prisma.chatRoom.create({
      data: {
        orderId,
        isClosed: false,
      },
    });
  }

  async addMessage(chatRoomId: number, senderId: number, content: string) {
    const chatRoom = await this.prisma.chatRoom.findUnique({
      where: { id: chatRoomId },
    });

    if (chatRoom?.isClosed) {
      throw new BadRequestException('Chat room is closed. Cannot add messages.');
    }

    return this.prisma.message.create({
      data: {
        chatRoomId,
        senderId,
        content,
      },
    });
  }

  async closeChat(chatRoomId: number, summary: string) {
    return this.prisma.chatRoom.update({
      where: { id: chatRoomId },
      data: {
        isClosed: true,
        summary,
      },
    });
  }

  async getMessages(chatRoomId: number) {
    return this.prisma.message.findMany({
      where: { chatRoomId },
      orderBy: { createdAt: 'asc' },
    });
  }
}
