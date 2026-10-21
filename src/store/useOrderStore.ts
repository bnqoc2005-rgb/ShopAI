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
  setOrders: (orders: Order[]) => void;
}

export const useOrderStore = create<OrderState>((set) => ({
  orders: [
    {
      id: 'ORD_928103',
      items: [
        {
          name: 'Kính thực tế AI Vision Pro Gen 2',
          quantity: 1,
          price: 4990000,
        },
      ],
      totalAmount: 4990000,
      status: 'PAID',
      createdAt: '15/10/2026',
    },
    {
      id: 'ORD_482109',
      items: [
        {
          name: 'Tai nghe Chống ồn AI Smart Buds Pro',
          quantity: 2,
          price: 1890000,
        },
      ],
      totalAmount: 3780000,
      status: 'PENDING',
      createdAt: '14/10/2026',
    },
  ],
  addOrder: (order) => set((state) => ({ orders: [order, ...state.orders] })),
  payOrder: (orderId) =>
    set((state) => ({
      orders: state.orders.map((o) =>
        o.id === orderId ? { ...o, status: 'PAID' } : o
      ),
    })),
  setOrders: (orders) => set({ orders }),
}));

export default useOrderStore;
