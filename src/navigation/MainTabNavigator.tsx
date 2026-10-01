// src/navigation/MainTabNavigator.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { HomeStack } from './HomeStack';
import { CartStack } from './CartStack';
import { AccountScreen } from '../screens/AccountScreen';
import { useCartStore } from '../store/useCartStore';

const Tab = createBottomTabNavigator();

export function MainTabNavigator({ onLogout }: { onLogout?: () => void }) {
  const cart = useCartStore((state) => state.cart);
  const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#FF424E',
        tabBarInactiveTintColor: '#8E8E93',
        tabBarIcon: ({ color }) => {
          if (route.name === 'HomeTab') {
            return <Text style={{ fontSize: 18, color }}>⌂</Text>;
          } else if (route.name === 'CartTab') {
            return (
              <View style={{ width: 28, height: 24, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ fontSize: 16, color }}>🛒</Text>
                {totalItems > 0 && (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>{totalItems > 99 ? '99+' : totalItems}</Text>
                  </View>
                )}
              </View>
            );
          } else {
            return <Text style={{ fontSize: 18, color }}>👤</Text>;
          }
        },
      })}
    >
      <Tab.Screen 
        name="HomeTab" 
        options={{ title: 'Trang chủ' }}
      >
        {(props) => <HomeStack {...props} onLogout={onLogout} />}
      </Tab.Screen>
      
      <Tab.Screen 
        name="CartTab" 
        component={CartStack} 
        options={{ title: 'Giỏ hàng' }} 
      />

      <Tab.Screen 
        name="AccountTab" 
        component={AccountScreen} 
        options={{ title: 'Tài khoản' }} 
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  badge: {
    position: 'absolute',
    right: -6,
    top: -3,
    backgroundColor: '#FF424E',
    borderRadius: 8,
    minWidth: 15,
    height: 15,
    paddingHorizontal: 3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: { color: '#FFF', fontSize: 9, fontWeight: 'bold' },
});

export default MainTabNavigator;
