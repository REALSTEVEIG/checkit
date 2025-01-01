import { Test, TestingModule } from '@nestjs/testing';
import { OrdersController } from 'modules/orders/orders.controller';
import { OrdersService } from 'modules/orders/orders.service';
import { CreateOrderDto } from 'modules/orders/dto/create-order.dto';

describe('OrdersController', () => {
  let ordersController: OrdersController;
  let ordersService: OrdersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrdersController],
      providers: [
        {
          provide: OrdersService,
          useValue: {
            createOrder: jest.fn().mockResolvedValue({ id: 1, userId: 1 }),
            updateOrderStatus: jest
              .fn()
              .mockResolvedValue({ id: 1, status: 'Processing' }),
          },
        },
      ],
    }).compile();

    ordersController = module.get<OrdersController>(OrdersController);
    ordersService = module.get<OrdersService>(OrdersService);
  });

  it('should create a new order', async () => {
    // @ts-expect-error no-error
    const dto: CreateOrderDto = { productId: 1, quantity: 2 };
    const req = { user: { id: 1 } };
    const result = await ordersController.createOrder(dto, req as any);
    expect(result).toEqual({ id: 1, userId: 1 });
    expect(ordersService.createOrder).toHaveBeenCalledWith({
      ...dto,
      userId: 1,
    });
  });

  it('should update order status', async () => {
    // @ts-expect-error no-error
    const result = await ordersController.updateOrderStatus(1, 'Processing');
    expect(result).toEqual({ id: 1, status: 'Processing' });
    expect(ordersService.updateOrderStatus).toHaveBeenCalledWith(
      1,
      'Processing',
    );
  });
});
