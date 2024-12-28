import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../shared/services/prisma.services';
import { OrderStatus } from './orders.entity'; 

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  async createOrder(data: any) {
    return this.prisma.order.create({ data });
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
