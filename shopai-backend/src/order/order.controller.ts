import { Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { OrderService } from './order.service.js';
import { CreateOrderDto } from './dto/create-order.dto.js';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';

@Controller('api/orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async createOrder(@Body() dto: CreateOrderDto, @Req() req: any) {
    const userId = req.user?.userId;
    return this.orderService.createOrder(dto, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async getMyOrders(@Req() req: any) {
    const userId = req.user?.userId;
    return this.orderService.getOrdersForUser(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getOrderById(@Param('id') id: string, @Req() req: any) {
    const userId = req.user?.userId;
    return this.orderService.getOrderForUser(id, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/pay')
  async payOrder(@Param('id') id: string, @Req() req: any) {
    const userId = req.user?.userId;
    return this.orderService.payOrder(id, userId);
  }
}
