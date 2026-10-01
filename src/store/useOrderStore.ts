// src/store/useOrderStore.ts
import { create } from 'zustand';

export interface Order {
  id: string;
  items: any[];
  totalAmount: number;
  status: 'PENDING' | 'PAID';
  createdAt: string;
}

interface OrderState {
  orders: Order[];
  addOrder: (order: Order) => void;
  payOrder: (orderId: string) => void;
}

export const useOrderStore = create<OrderState>((set) => ({
  orders: [],
  addOrder: (order) => set((state) => ({ orders: [order, ...state.orders] })),
  payOrder: (orderId) =>
    set((state) => ({
      orders: state.orders.map((o) =>
        o.id === orderId ? { ...o, status: 'PAID' } : o
      ),
    })),
}));

export default useOrderStore;
