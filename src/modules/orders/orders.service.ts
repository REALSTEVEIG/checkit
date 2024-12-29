import { Injectable } from '@nestjs/common';
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
    const order = await this.prisma.order.create({ data });
    await this.chatService.createChat(order.id);
    return order;
  }

  async updateOrderStatus(orderId: number, status: OrderStatus) {
    return this.prisma.order.update({
      where: { id: orderId },
      data: { status },
    });
  }

  async findOrdersByUser(userId: number) {
    return this.prisma.order.findMany({ where: { userId } });
  }
}

