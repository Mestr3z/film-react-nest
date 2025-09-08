import { Test, TestingModule } from '@nestjs/testing';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { CreateOrderDto, CreateOrderResponseDto } from './dto/order.dto';

describe('OrderController', () => {
  let controller: OrderController;
  let service: jest.Mocked<OrderService>;

  const dto: CreateOrderDto = {
    items: [
      { filmId: 'f1', scheduleId: 's1', row: 1, seat: 3 },
      { filmId: 'f1', scheduleId: 's1', row: 1, seat: 4 },
    ],
  };

  const resp: CreateOrderResponseDto = {
    ok: true,
    results: [
      { filmId: 'f1', scheduleId: 's1', row: 1, seat: 3, status: 'booked' },
      { filmId: 'f1', scheduleId: 's1', row: 1, seat: 4, status: 'already_booked' },
    ],
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrderController],
      providers: [
        {
          provide: OrderService,
          useValue: {
            createOrder: jest.fn().mockResolvedValue(resp),
          },
        },
      ],
    }).compile();

    controller = module.get(OrderController);
    service = module.get(OrderService) as any;
  });

  it('POST /order -> create()', async () => {
    const res = await controller.create(dto);
    expect(service.createOrder).toHaveBeenCalledWith(dto);
    expect(res).toEqual(resp);
  });
});
