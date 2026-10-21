// src/store/useCartStore.ts
import { create } from 'zustand';
import { Product } from '../schemas/product';

export interface CartItem extends Product {
  quantity: number;
}

interface CartState {
  cart: CartItem[];
  items: CartItem[];
  addToCart: (product: any) => void;
  addItem: (product: any) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
}

export const useCartStore = create<CartState>((set, get) => ({
  cart: [],
  get items() {
    return this.cart;
  },
  addToCart: (product) =>
    set((state) => {
      const existingIndex = state.cart.findIndex((item) => item.id === product.id);
      let updated: CartItem[];
      if (existingIndex > -1) {
        updated = [...state.cart];
        updated[existingIndex].quantity += 1;
      } else {
        updated = [...state.cart, { ...product, quantity: 1 }];
      }
      return { cart: updated, items: updated };
    }),
  addItem: (product) => get().addToCart(product),
  removeFromCart: (id) =>
    set((state) => {
      const filtered = state.cart.filter((item) => item.id !== id);
      return { cart: filtered, items: filtered };
    }),
  clearCart: () => set({ cart: [], items: [] }),
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
