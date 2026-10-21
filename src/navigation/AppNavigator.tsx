// src/navigation/AppNavigator.tsx
import React, { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { AuthStack } from './AuthStack';
import { MainTabNavigator } from './MainTabNavigator';
import { useAuthStore } from '../store/useAuthStore';
import BiometricGateScreen from '../screens/BiometricGateScreen';

export function AppNavigator() {
  const userToken = useAuthStore((state) => state.token ?? state.userToken);
  const isLoading = useAuthStore((state) => state.isLoading);
  const isUnlocked = useAuthStore((state) => state.isUnlocked);
  const checkLocalToken = useAuthStore((state) => state.checkLocalToken);
  const setIsUnlocked = useAuthStore((state) => state.setIsUnlocked);
  const logout = useAuthStore((state) => state.logout);

  useEffect(() => {
    checkLocalToken(); // Móc vào ổ cứng SecureStore ngay khi App vừa khởi chạy
  }, [checkLocalToken]);

  // Nếu đang lục ổ cứng thì hiện vòng xoay Loading tràn màn hình
  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFFFFF' }}>
        <ActivityIndicator size="large" color="#4F46E5" />
      </View>
    );
  }

  // Có token (đã đăng nhập từ trước) NHƯNG chưa vượt cổng sinh trắc học -> chặn ở đây
  if (userToken != null && !isUnlocked) {
    return <BiometricGateScreen onUnlock={() => setIsUnlocked(true)} />;
  }

  return (
    <NavigationContainer>
      {userToken == null ? (
        <AuthStack onLogin={() => {}} />
      ) : (
        <MainTabNavigator onLogout={logout} />
      )}
    </NavigationContainer>
  );
}

export default AppNavigator;
