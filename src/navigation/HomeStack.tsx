// src/navigation/HomeStack.tsx
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HomeScreen } from '../screens/HomeScreen';
import ProductDetailScreen from '../screens/ProductDetailScreen';
import { CheckoutModal } from '../screens/CheckoutModal';
import { CheckoutScreen } from '../screens/CheckoutScreen';
import { OrdersScreen } from '../screens/OrdersScreen';
import { OrderDetailScreen } from '../screens/OrderDetailScreen';
import ScannerScreen from '../screens/ScannerScreen';
import AIChatScreen from '../screens/AIChatScreen';

export type HomeStackParamList = {
  Home: { scannedCode?: string } | undefined;
  Detail: { product?: any; productId?: string };
  ProductDetail: { product?: any; productId?: string };
  Checkout: { product?: any; quantity?: number } | undefined;
  CheckoutModal: { product: any; quantity: number };
  Orders: undefined;
  OrderDetail: { orderId: string };
  Scanner: undefined;
  AIChat: undefined;
  ChatAi: undefined;
};

const Stack = createNativeStackNavigator<HomeStackParamList>();

export function HomeStack({ onLogout }: { onLogout?: () => void }) {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home">
        {(props) => <HomeScreen {...props} onLogout={onLogout} />}
      </Stack.Screen>
      <Stack.Screen name="Detail" component={ProductDetailScreen} />
      <Stack.Screen name="ProductDetail" component={ProductDetailScreen} />
      <Stack.Screen name="Checkout" component={CheckoutScreen} />
      <Stack.Screen 
        name="CheckoutModal" 
        component={CheckoutModal} 
        options={{ presentation: 'transparentModal', animation: 'fade' }} 
      />
      <Stack.Screen name="Orders" component={OrdersScreen} />
      <Stack.Screen name="OrderDetail" component={OrderDetailScreen} />
      <Stack.Screen name="Scanner" component={ScannerScreen} options={{ headerShown: false }} />
      <Stack.Screen name="AIChat" component={AIChatScreen} options={{ title: 'Tư vấn AI', animation: 'slide_from_bottom' }} />
      <Stack.Screen name="ChatAi" component={AIChatScreen} options={{ title: 'Tư vấn AI', animation: 'slide_from_bottom' }} />
    </Stack.Navigator>
  );
}

export default HomeStack;
