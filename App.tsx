// App.tsx
import React, { useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import crashlytics from '@react-native-firebase/crashlytics';
import { CartProvider } from './src/context/CartContext';
import AppNavigator from './src/navigation/AppNavigator';

const queryClient = new QueryClient();

export default function App() {
  useEffect(() => {
    // Bật thu thập Crashlytics (cần thiết khi chạy ở chế độ development/debug)
    crashlytics().setCrashlyticsCollectionEnabled(true);

    try {
      // Ghi vết hành vi người dùng (Breadcrumbs)
      crashlytics().log('User opened ShopAI App');
    } catch (error: any) {
      // Gửi lỗi về Firebase Dashboard (Non-fatal error)
      crashlytics().recordError(error);
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <CartProvider>
        <AppNavigator />
      </CartProvider>
    </QueryClientProvider>
  );
}
