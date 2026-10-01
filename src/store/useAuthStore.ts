// src/store/useAuthStore.ts
import { create } from 'zustand';

interface AuthState {
  userToken: string | null;
  userInfo: { name: string; email: string } | null;
  login: (tokenOrEmail?: string) => void;
  setToken: (token: string | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  userToken: null,
  userInfo: { name: 'Người dùng', email: 'user@shopai.vn' },
  login: (tokenOrEmail) =>
    set({
      userToken: 'mock_token_123456',
      userInfo: {
        name: 'Nguyễn Văn A',
        email: typeof tokenOrEmail === 'string' && tokenOrEmail.includes('@') ? tokenOrEmail : 'baongoc@gmail.com',
      },
    }),
  setToken: (token) => set({ userToken: token }),
  logout: () => set({ userToken: null }),
}));

export default useAuthStore;
