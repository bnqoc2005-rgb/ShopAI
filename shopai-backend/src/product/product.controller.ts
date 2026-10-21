import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ProductService } from './product.service.js';
import { CreateProductDto } from './dto/create-product.dto.js';

@Controller('api/products') // Khai báo đường dẫn URL
export class ProductController {
  
  // Áp dụng Dependency Injection: Tiêm cái Service vào đây!
  constructor(private readonly productService: ProductService) {}

  @Get() // Khi Mobile gọi Method GET vào URL trên
  getProducts() {
    // Nhờ Đầu bếp làm món ăn và bưng ra cho Mobile
    return this.productService.getAllProducts();
  }

  @Get(':id') // GET /api/products/backend_prod_3
  getProductById(@Param('id') id: string) {
    // @Param trích đoạn ':id' trong URL ra thành biến — tương đương Route Params của
    // React Navigation ở Chương 5, chỉ khác là nó đi qua đường dây mạng.
    return this.productService.getProductById(id);
  }

  @Post() // POST /api/products — chỉ để minh họa ValidationPipe, ShopAI chưa dùng đến
  createProduct(@Body() dto: CreateProductDto) {
    // Đến được dòng này nghĩa là dữ liệu ĐÃ hợp lệ 100%.
    // Không cần một dòng if kiểm tra nào — ValidationPipe đã chặn hết ở ngoài cửa.
    return { message: 'Dữ liệu hợp lệ, đã nhận sản phẩm', data: dto };
  }
}