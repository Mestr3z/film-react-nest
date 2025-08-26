import { Body, Controller, Post } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto, CreateOrderResponseDto } from './dto/order.dto';

@Controller()
export class OrderController {
  constructor(private readonly orders: OrderService) {}

  @Post('order')
  async create(@Body() dto: CreateOrderDto): Promise<CreateOrderResponseDto> {
    return this.orders.createOrder(dto);
  }
}
