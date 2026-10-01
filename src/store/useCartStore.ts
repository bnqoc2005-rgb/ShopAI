// src/store/useCartStore.ts
import { create } from 'zustand';
import { Product } from '../schemas/product';

export interface CartItem extends Product {
  quantity: number;
}

interface CartState {
  cart: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
}

export const useCartStore = create<CartState>((set, get) => ({
  cart: [],
  addToCart: (product) =>
    set((state) => {
      const existingIndex = state.cart.findIndex((item) => item.id === product.id);
      if (existingIndex > -1) {
        const updatedCart = [...state.cart];
        updatedCart[existingIndex].quantity += 1;
        return { cart: updatedCart };
      }
      return { cart: [...state.cart, { ...product, quantity: 1 }] };
    }),
  removeFromCart: (id) =>
    set((state) => ({ cart: state.cart.filter((item) => item.id !== id) })),
  clearCart: () => set({ cart: [] }),
  getTotalPrice: () => {
    return get().cart.reduce((total, item) => {
      const priceNum =
        typeof item.price === 'number'
          ? item.price
          : parseFloat(String(item.price).replace(/[^0-9.-]+/g, '')) || 0;
      return total + priceNum * item.quantity;
    }, 0);
  },
}));

export default useCartStore;
