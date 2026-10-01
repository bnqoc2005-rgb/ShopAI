// src/screens/CartScreen.tsx
import React from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useCartStore } from '../store/useCartStore';

export function CartScreen({ navigation }: any) {
  const { cart, getTotalPrice } = useCartStore();

  const total = typeof getTotalPrice === 'function' ? getTotalPrice() : 0;

  if (cart.length === 0) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        <View style={styles.headerBar}>
          <Text style={styles.headerTitle}>Giỏ hàng</Text>
        </View>
        <View style={styles.emptyContainer}>
          <Text style={{ fontSize: 50, marginBottom: 12 }}>🛒</Text>
          <Text style={styles.emptyText}>Giỏ hàng của bạn đang trống</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <View style={styles.headerBar}>
        <Text style={styles.headerTitle}>Giỏ hàng ({cart.length})</Text>
      </View>
      <FlatList
        data={cart}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => {
          const itemPriceFormatted =
            typeof item.price === 'number'
              ? `${item.price.toLocaleString('vi-VN')} VNĐ`
              : item.price;

          return (
            <View style={styles.itemRow}>
              <Image source={{ uri: item.image }} style={styles.itemImg} resizeMode="cover" />
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemPrice}>{itemPriceFormatted}</Text>
                <Text style={styles.itemQty}>Số lượng: {item.quantity}</Text>
              </View>
            </View>
          );
        }}
      />
      <View style={styles.footer}>
        <Text style={styles.totalText}>Tổng tiền: {total.toLocaleString('vi-VN')} VNĐ</Text>
        <TouchableOpacity
          style={styles.checkoutBtn}
          onPress={() => (navigation?.navigate ? navigation.navigate('Checkout') : null)}
          activeOpacity={0.8}
        >
          <Text style={styles.checkoutText}>Thanh toán</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FAFAFA' },
  headerBar: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#1A202C' },
  listContent: { padding: 16 },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FAFAFA' },
  emptyText: { fontSize: 16, color: '#8E8E93', fontWeight: '500' },
  itemRow: { flexDirection: 'row', backgroundColor: '#FFF', padding: 10, borderRadius: 10, marginBottom: 10, borderWidth: 1, borderColor: '#F0F0F0' },
  itemImg: { width: 60, height: 60, borderRadius: 8 },
  itemName: { fontSize: 14, fontWeight: 'bold', color: '#1A202C' },
  itemPrice: { color: '#FF424E', fontWeight: 'bold', marginTop: 4 },
  itemQty: { color: '#8E8E93', fontSize: 12, marginTop: 2 },
  footer: { padding: 16, backgroundColor: '#FFF', borderTopWidth: 1, borderColor: '#EEE' },
  totalText: { fontSize: 16, fontWeight: 'bold', marginBottom: 12, color: '#1A202C' },
  checkoutBtn: { backgroundColor: '#FF424E', height: 44, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  checkoutText: { color: '#FFF', fontWeight: 'bold' },
});

export default CartScreen;
