import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

export interface CreateOrderInput {
  id: string;
  userId: string | number;
  total: number;
  items: { productId: string; quantity: number; price: number }[];
}

export interface OrderRecord {
  id: string;
  userId: any;
  total: number;
  status: string;
  createdAt: Date;
  items: { productId: string; quantity: number; price: number }[];
}

// Bản hợp đồng GIỮ NGUYÊN như Phần 9.8 mục 5 — chỉ phần triển khai bên dưới là mới
export interface IOrderRepository {
  save(input: CreateOrderInput): Promise<OrderRecord>;
  findAll(): Promise<OrderRecord[]>;
  findByUserId(userId: string | number): Promise<OrderRecord[]>;
  findById(orderId: string): Promise<OrderRecord | null>;
  updateStatus(orderId: string, status: string): Promise<OrderRecord>;
}

@Injectable()
export class PrismaOrderRepository implements IOrderRepository {
  constructor(private readonly prisma: PrismaService) {}

  async save(input: CreateOrderInput): Promise<OrderRecord> {
    // "items: { create: [...] }" là cú pháp Prisma để tạo Order VÀ toàn bộ OrderItem con
    // trong CÙNG một câu lệnh/transaction — không sợ tạo được Order mà thiếu Item giữa chừng.
    const userIdNum = typeof input.userId === 'string' ? parseInt(input.userId, 10) : input.userId;
    return this.prisma.order.create({
      data: {
        id: input.id,
        userId: Number.isNaN(userIdNum) ? null : userIdNum,
        total: input.total,
        status: 'PENDING',
        items: { create: input.items },
      },
      include: { items: true }, // Trả kèm luôn danh sách items trong response
    }) as unknown as OrderRecord;
  }

  async findAll(): Promise<OrderRecord[]> {
    return this.prisma.order.findMany({
      include: { items: true },
      orderBy: { createdAt: 'desc' }, // Đơn mới nhất lên đầu — tiện giảng viên nghiệm thu
    }) as unknown as OrderRecord[];
  }

  async findByUserId(userId: string | number): Promise<OrderRecord[]> {
    const userIdNum = typeof userId === 'string' ? parseInt(userId, 10) : userId;
    return this.prisma.order.findMany({
      where: { userId: Number.isNaN(userIdNum) ? undefined : userIdNum },
      include: { items: true },
      orderBy: { createdAt: 'desc' },
    }) as unknown as OrderRecord[];
  }

  async findById(orderId: string): Promise<OrderRecord | null> {
    return this.prisma.order.findUnique({
      where: { id: orderId },
      include: { items: true },
    }) as unknown as OrderRecord | null;
  }

  async updateStatus(orderId: string, status: string): Promise<OrderRecord> {
    return this.prisma.order.update({
      where: { id: orderId },
      data: { status },
      include: { items: true },
    }) as unknown as OrderRecord;
  }
}
