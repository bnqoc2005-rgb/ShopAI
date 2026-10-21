import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module.js';
import { ProductModule } from './product/product.module.js';
import { AiModule } from './ai/ai.module.js';
import { AuthModule } from './auth/auth.module.js';
import { OrderModule } from './order/order.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }), // isGlobal: dùng ConfigService ở BẤT KỲ Module nào, không cần import lại
    PrismaModule,
    ProductModule,
    AiModule,
    AuthModule,
    OrderModule,
  ],
})
export class AppModule {}