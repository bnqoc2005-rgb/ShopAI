import { Module } from '@nestjs/common';
import { OrderController } from './order.controller.js';
import { OrderService } from './order.service.js';
import { PrismaOrderRepository } from './order.repository.js';
import { ProductModule } from '../product/product.module.js';

@Module({
  imports: [ProductModule],
  controllers: [OrderController],
  providers: [
    OrderService,
    {
      provide: 'IOrderRepository',
      useClass: PrismaOrderRepository,
    },
  ],
  exports: [OrderService],
})
export class OrderModule {}
