import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from 'shared/services/prisma.services';
import { OrderStatus } from './orders.entity';
import { ChatService } from '../chat/chat.service';

@Injectable()
export class OrdersService {
  constructor(
    private prisma: PrismaService,
    private chatService: ChatService,
  ) {}

  async createOrder(data: any) {
    try {
      const order = await this.prisma.order.create({ data });
      await this.chatService.createChat(order.id);
      return order;
    } catch (error: any) {
      throw new HttpException(`Error creating order: ${error.message}`, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async updateOrderStatus(orderId: number, status: OrderStatus) {
    try {
      return await this.prisma.order.update({
        where: { id: orderId },
        data: { status },
      });
    } catch (error: any) {
      throw new HttpException(`Error updating order status: ${error.message}`, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findOrdersByUser(userId: number) {
    try {
      return await this.prisma.order.findMany({ where: { userId } });
    } catch (error: any) {
      throw new HttpException(`Error finding orders: ${error.message}`, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
