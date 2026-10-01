// src/navigation/AppNavigator.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { AuthStack } from './AuthStack';
import { MainTabNavigator } from './MainTabNavigator';
import { useAuthStore } from '../store/useAuthStore';

export function AppNavigator() {
  const { userToken, login, logout } = useAuthStore();

  const handleLogin = () => login('mock_token_123456');

  return (
    <NavigationContainer>
      {userToken == null ? (
        <AuthStack onLogin={handleLogin} />
      ) : (
        <MainTabNavigator onLogout={logout} />
      )}
    </NavigationContainer>
  );
}

export default AppNavigator;
