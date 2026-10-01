export interface Product {
  id: string;
  name: string;
  price: string;
  rating: string;
  image: string;
  description?: string;
}

export const MOCK_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Tai nghe Bluetooth Pro',
    price: '1.500.000 VNĐ',
    rating: '4.8',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&auto=format&fit=crop&q=80',
    description: 'Tai nghe chống ồn chủ động, pin 30 giờ, âm bass mạnh mẽ.',
  },
  {
    id: '2',
    name: 'Đồng hồ thông minh Series 7',
    price: '2.800.000 VNĐ',
    rating: '4.9',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&auto=format&fit=crop&q=80',
    description: 'Theo dõi sức khỏe AI, đo nhịp tim, chống nước 50m.',
  },
  {
    id: '3',
    name: 'Balo chống nước cao cấp',
    price: '650.000 VNĐ',
    rating: '4.7',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300&auto=format&fit=crop&q=80',
    description: 'Chất liệu Oxford chống thấm nước tuyệt đối, ngăn đựng laptop 15.6 inch.',
  },
  {
    id: '4',
    name: 'Giày thể thao Running X',
    price: '1.200.000 VNĐ',
    rating: '4.6',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&auto=format&fit=crop&q=80',
    description: 'Đế đệm khí êm ái, thoáng khí, hỗ trợ chạy bộ chuyên nghiệp.',
  },
];
