import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from '@shared/services/prisma.services';
import { ChatService } from '../chat/chat.service';

@Injectable()
export class OrdersService {
  constructor(
    private prisma: PrismaService,
    private chatService: ChatService,
  ) {}

  async createOrder(data: any) {
    try {
      if (!data.userId) {
        throw new HttpException('userId is required', HttpStatus.BAD_REQUEST);
      }

      const order = await this.prisma.order.create({
        data: {
          description: data.description,
          specifications: data.specifications,
          quantity: data.quantity,
          metadata: data.metadata,
          userId: data.userId,
        },
      });

      const chatRoom = await this.chatService.createChat(order.id);

      const updatedOrder = await this.prisma.order.update({
        where: { id: Number(order.id) },
        data: { chatRoomId: chatRoom.id },
      });

      return updatedOrder;
    } catch (error: any) {
      console.error('Error creating order:', error.message);
      throw new HttpException(
        `Error creating order: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updateOrderStatus(orderId: number, status: any) {
    try {
      return await this.prisma.order.update({
        where: { id: Number(orderId) },
        data: { status: status.status },
      });
    } catch (error: any) {
      throw new HttpException(
        `Error updating order status: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  async findOrdersByUser(
    userId: number,
    requesterId: number,
    userRole: string,
  ) {
    if (userRole === 'ADMIN') {
      return this.prisma.order.findMany({});
    }

    if (Number(userId) !== Number(requesterId)) {
      throw new HttpException(
        'Unauthorized access to orders.',
        HttpStatus.FORBIDDEN,
      );
    }

    return this.prisma.order.findMany({ where: { userId: Number(userId) } });
  }
}
