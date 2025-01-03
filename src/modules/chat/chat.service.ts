import { PrismaService } from '@shared/services/prisma.services';
import {
  Injectable,
  BadRequestException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

@Injectable()
export class ChatService {
  constructor(private prisma: PrismaService) {}

  async getChatRoomByOrderId(orderId: number) {
    return this.prisma.chatRoom.findUnique({
      where: { orderId: Number(orderId) },
      include: { order: true },
    });
  }

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
      include: { order: true },
    });

    if (!chatRoom) {
      throw new HttpException('Chat room not found', HttpStatus.NOT_FOUND);
    }

    if (chatRoom.isClosed) {
      throw new BadRequestException(
        'Chat room is closed. Cannot add messages.',
      );
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
    const chatRoom = await this.prisma.chatRoom.findUnique({
      where: { id: Number(chatRoomId) },
    });

    if (!chatRoom) {
      throw new HttpException('Chat room not found', HttpStatus.NOT_FOUND);
    }

    return this.prisma.chatRoom.update({
      where: { id: Number(chatRoomId) },
      data: {
        isClosed: true,
        summary,
      },
    });
  }

  async getMessages(chatRoomId: number) {
    return this.prisma.message.findMany({
      where: { chatRoomId: Number(chatRoomId) },
      orderBy: { createdAt: 'asc' },
    });
  }

  async getActiveChatRooms() {
    return this.prisma.chatRoom.findMany({
      where: { isClosed: false },
      include: { order: true },
    });
  }
}
