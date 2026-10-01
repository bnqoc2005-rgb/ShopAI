// src/navigation/RootNavigator.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MainTabNavigator } from './MainTabNavigator';
import { CheckoutScreen } from '../screens/CheckoutScreen';
import { OrdersScreen } from '../screens/OrdersScreen';
import { OrderDetailScreen } from '../screens/OrderDetailScreen';
import ScannerScreen from '../screens/ScannerScreen';

export type RootStackParamList = {
  MainTabs: undefined;
  Checkout: undefined;
  Orders: undefined;
  OrderDetail: { orderId: string };
  Scanner: undefined;
};

const RootStack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  return (
    <NavigationContainer>
      <RootStack.Navigator screenOptions={{ headerShown: false }}>
        {/* MainTabNavigator chứa Home, Cart, Account... */}
        <RootStack.Screen name="MainTabs" component={MainTabNavigator} />
        
        {/* Các màn hình Modal/Stack bọc ngoài */}
        <RootStack.Screen name="Checkout" component={CheckoutScreen} />
        <RootStack.Screen name="Orders" component={OrdersScreen} /> 
        <RootStack.Screen name="OrderDetail" component={OrderDetailScreen} />
        <RootStack.Screen 
          name="Scanner" 
          component={ScannerScreen} 
          options={{ headerShown: true, title: 'Quét mã' }} 
        />
      </RootStack.Navigator>
    </NavigationContainer>
  );
}

