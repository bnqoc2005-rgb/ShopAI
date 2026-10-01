// src/store/usePersistCart.ts
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const usePersistCart = create(
  persist(
    (set) => ({
      cart: [],
      addToCart: (product: any) =>
        set((state: any) => ({ cart: [...state.cart, product] })),
    }),
    {
      name: 'shopai-cart-storage', // Tên key lưu trong AsyncStorage
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

export default usePersistCart;
