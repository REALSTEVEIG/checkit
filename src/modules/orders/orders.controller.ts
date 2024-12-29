import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Patch,
  UseGuards,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { Request } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrderStatus } from './orders.entity';
import { Roles } from 'shared/decorators/roles.decorator';
import { RolesGuard } from 'shared/guards/roles.guard';
import { CreateOrderDto } from './dto/create-order.dto';
import { JwtAuthGuard } from 'shared/guards/jwt-auth.guard';
import { CustomRequest } from '../../global';

@ApiTags('Orders')
@Controller('orders')
@UseGuards(RolesGuard)
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @ApiBearerAuth('Authorization')
  @Post()
  @ApiOperation({ summary: 'Create a new order' })
  @ApiResponse({ status: 201, description: 'Order created successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  async createOrder(
    @Body() createOrderDto: CreateOrderDto,
    @Request() req: CustomRequest,
  ) {
    try {
      const user = req.user;
      const userId = user?.sub;
      console.log('User', user);
      if (!userId) {
        throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
      }

      return await this.ordersService.createOrder({
        ...createOrderDto,
        userId,
      });
    } catch (error: any) {
      console.error('Error creating order:', error.message);
      throw new HttpException(
        error.message || 'Failed to create the order',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/status')
  @ApiBearerAuth('Authorization')
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

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('Authorization')
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
