// src/hooks/useVoucher.ts
import { useState } from 'react';

export function useVoucher() {
  const [discount, setDiscount] = useState(0);

  const applyVoucher = (code: string, totalAmount: number) => {
    if (code.trim().toUpperCase() === 'SHOPAI50') {
      const discountValue = totalAmount * 0.5; // Giảm 50%
      setDiscount(discountValue);
      return { success: true, message: 'Áp dụng mã giảm 50% thành công!' };
    }
    return { success: false, message: 'Mã giảm giá không hợp lệ!' };
  };

  return { discount, applyVoucher, setDiscount };
}

export default useVoucher;
