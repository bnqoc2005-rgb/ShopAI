import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';

interface AuthState {
  token: string | null;
  userToken: string | null;
  userInfo: { name: string; email: string } | null;
  isLoading: boolean; // Trạng thái đang kiểm tra ổ cứng
  isUnlocked: boolean; // Trạng thái vượt qua cổng sinh trắc học
  login: (newToken: string, user?: { name: string; email: string }) => Promise<void>;
  logout: () => Promise<void>;
  checkLocalToken: () => Promise<void>; // Hàm chạy lúc mở app
  setIsUnlocked: (unlocked: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  userToken: null,
  userInfo: { name: 'Người dùng', email: 'demo@shopai.com' },
  isLoading: true, // Mặc định vừa vào app là Loading
  isUnlocked: false,

  // Lưu token vào RAM (Đám mây) VÀ lưu xuống Ổ cứng mã hóa (Keystore)
  login: async (newToken, user) => {
    try {
      await SecureStore.setItemAsync('SHOP_ACCESS_TOKEN', newToken);
    } catch (e) {
      console.warn('Lỗi lưu Keystore:', e);
    }
    set({
      token: newToken,
      userToken: newToken,
      userInfo: user || { name: 'Học viên Demo', email: 'demo@shopai.com' },
      isUnlocked: true, // Vừa gõ mật khẩu đăng nhập thành công thì mở khóa luôn
    });
  },

  // Hủy Token trên cả 2 nơi
  logout: async () => {
    try {
      await SecureStore.deleteItemAsync('SHOP_ACCESS_TOKEN');
    } catch (e) {
      console.warn('Lỗi xóa Keystore:', e);
    }
    set({ token: null, userToken: null, isUnlocked: false });
  },

  setIsUnlocked: (unlocked: boolean) => set({ isUnlocked: unlocked }),

  // Hàm móc dữ liệu từ Keystore lên khi người dùng vừa khởi động lại điện thoại
  checkLocalToken: async () => {
    try {
      const storedToken = await SecureStore.getItemAsync('SHOP_ACCESS_TOKEN');
      if (storedToken) {
        set({ token: storedToken, userToken: storedToken }); // Tìm thấy Token
      }
    } catch (e) {
      console.log('Lỗi Keystore:', e);
    } finally {
      set({ isLoading: false }); // Kiểm tra xong, tắt vòng xoay Loading
    }
  },
}));

export default useAuthStore;
