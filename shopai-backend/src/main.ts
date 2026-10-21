import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();

  // Trạm kiểm soát dữ liệu vào — áp dụng cho TOÀN BỘ endpoint, không cần khai báo lại từng chỗ
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,            // Client gửi thừa field lạ -> tự động cắt bỏ
      forbidNonWhitelisted: true, // Gửi field lạ thì báo lỗi 400 luôn cho minh bạch
      transform: true,            // Bật class-transformer: JSON -> instance DTO, tự ép kiểu
    }),
  );

  const swaggerConfig = new DocumentBuilder()
    .setTitle('ShopAI API')
    .setDescription('Backend phục vụ App React Native ShopAI (Chương 9)')
    .setVersion('1.0')
    .addBearerAuth() // Hiện ô nhập JWT — dùng thật ngay ở đây vì Guard (Phần 9.7) đã hoạt động
    .build();
  SwaggerModule.setup('api/docs', app, SwaggerModule.createDocument(app, swaggerConfig));

  await app.listen(3000, '0.0.0.0');
}
bootstrap();
