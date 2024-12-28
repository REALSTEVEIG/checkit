import { Controller, Post, Body, Get, Param, Patch } from '@nestjs/common';
import { OrdersService } from './orders.service';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  async createOrder(@Body() data: any) {
    return this.ordersService.createOrder(data);
  }

  @Patch(':id/status')
  async updateOrderStatus(@Param('id') id: number, @Body() status: string) {
    return this.ordersService.updateOrderStatus(id, status);
  }

  @Get('user/:userId')
  async getOrdersByUser(@Param('userId') userId: number) {
    return this.ordersService.findOrdersByUser(userId);
  }
}
