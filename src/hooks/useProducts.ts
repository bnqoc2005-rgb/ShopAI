// src/hooks/useProducts.ts
import { useQuery } from '@tanstack/react-query';

const fetchProducts = async () => {
  const res = await fetch('https://api.example.com/products');
  return res.json();
};

export function useProducts() {
  return useQuery({
    queryKey: ['products'],
    queryFn: fetchProducts,
    staleTime: 1000 * 60 * 5, // Cache dữ liệu trong 5 phút
  });
}

export default useProducts;
