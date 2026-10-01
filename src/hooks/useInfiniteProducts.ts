// src/hooks/useInfiniteProducts.ts
import { useInfiniteQuery } from '@tanstack/react-query';
import { Product } from '../schemas/product';

const fetchProductsPage = async ({ pageParam = 1 }: { pageParam?: number }): Promise<Product[]> => {
  // Giả lập API danh sách sản phẩm theo trang khớp Zod ProductSchema
  return new Promise<Product[]>((resolve) => {
    setTimeout(() => {
      const items: Product[] = Array.from({ length: 6 }).map((_, index) => {
        const idNum = (pageParam - 1) * 6 + index + 1;
        const isBook = idNum % 2 === 0;
        return {
          id: `P${idNum < 10 ? '0' + idNum : idNum}`,
          name: isBook ? `Sách: Lập Trình Chuyên Sâu #${idNum}` : `Tai nghe Công Nghệ Pro #${idNum}`,
          price: 150000 + idNum * 25000,
          category: isBook ? 'Sách kỹ thuật' : 'Thiết bị audio',
          stock: 10 + index,
          image: `https://picsum.photos/id/${(idNum * 7) % 50 + 1}/300/300`,
          description: isBook ? 'Tài liệu hướng dẫn thực chiến React Native.' : 'Tai nghe âm thanh trung thực, pin lâu.',
        };
      });
      resolve(items);
    }, 1000);
  });
};

export function useInfiniteProducts() {
  return useInfiniteQuery({
    queryKey: ['products-infinite'],
    queryFn: fetchProductsPage,
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      return allPages.length < 4 ? allPages.length + 1 : undefined; // Giới hạn 4 trang
    },
  });
}

export default useInfiniteProducts;
