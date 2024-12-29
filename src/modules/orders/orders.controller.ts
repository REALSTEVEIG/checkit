import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { OrdersService } from './orders.service';
import { OrderStatus } from './orders.entity';
import { Roles } from 'shared/decorators/roles.decorator';
import { RolesGuard } from 'shared/guards/roles.guard';
import { CreateOrderDto } from './dto/create-order.dto';

@ApiTags('Orders')
@Controller('orders')
@UseGuards(RolesGuard)
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new order' })
  @ApiResponse({ status: 201, description: 'Order created successfully.' })
  @ApiResponse({ status: 400, description: 'Invalid input data.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  async createOrder(@Body() createOrderDto: CreateOrderDto) {
    return this.ordersService.createOrder(createOrderDto);
  }

  @Patch(':id/status')
  @Roles('Admin')
  @ApiOperation({ summary: 'Update the status of an order' })
  @ApiParam({ name: 'id', description: 'The ID of the order' })
  @ApiResponse({
    status: 200,
    description: 'Order status updated successfully.',
  })
  @ApiResponse({ status: 404, description: 'Order not found.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  async updateOrderStatus(
    @Param('id') id: number,
    @Body() status: OrderStatus,
  ) {
    return this.ordersService.updateOrderStatus(id, status);
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Get all orders by user ID' })
  @ApiParam({ name: 'userId', description: 'The ID of the user' })
  @ApiResponse({ status: 200, description: 'Orders retrieved successfully.' })
  @ApiResponse({ status: 404, description: 'No orders found for the user.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  async getOrdersByUser(@Param('userId') userId: number) {
    return this.ordersService.findOrdersByUser(userId);
  }
}
