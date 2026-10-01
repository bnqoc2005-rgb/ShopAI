// src/screens/OrdersScreen.tsx
import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useOrderStore } from '../store/useOrderStore';

export function OrdersScreen({ navigation }: any) {
  const orders = useOrderStore((state) => state.orders);

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <View style={styles.headerBar}>
        <TouchableOpacity onPress={() => navigation?.goBack()} style={styles.backBtn} activeOpacity={0.7}>
          <Text style={styles.backBtnText}>← Quay lại</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Lịch sử đơn hàng</Text>
        <View style={{ width: 60 }} />
      </View>

      <FlatList
        data={orders}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={{ fontSize: 48, marginBottom: 12 }}>📦</Text>
            <Text style={styles.emptyText}>Bạn chưa có đơn hàng nào</Text>
          </View>
        }
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={styles.orderCard} 
            onPress={() => navigation.navigate('OrderDetail', { orderId: item.id })}
            activeOpacity={0.8}
          >
            <Text style={styles.orderId}>{item.id}</Text>
            <Text style={styles.orderDate}>{item.createdAt}</Text>
            <View style={styles.row}>
              <Text style={styles.price}>{item.totalAmount.toLocaleString('vi-VN')} VNĐ</Text>
              <Text style={[styles.status, { color: item.status === 'PAID' ? '#48BB78' : '#ED8936' }]}>
                {item.status}
              </Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFAFA' },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  backBtn: { paddingVertical: 4, width: 60 },
  backBtnText: { color: '#4F46E5', fontWeight: 'bold', fontSize: 14 },
  headerTitle: { fontSize: 17, fontWeight: 'bold', color: '#1A202C' },
  listContent: { padding: 16 },
  emptyContainer: { alignItems: 'center', justifyContent: 'center', paddingVertical: 60 },
  emptyText: { fontSize: 14, color: '#8E8E93' },
  orderCard: { backgroundColor: '#FFF', padding: 14, borderRadius: 10, marginBottom: 10, borderWidth: 1, borderColor: '#EAEAEA' },
  orderId: { fontWeight: 'bold', fontSize: 14, color: '#1A202C' },
  orderDate: { color: '#8E8E93', fontSize: 12, marginBottom: 8 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  price: { fontWeight: 'bold', color: '#FF424E' },
  status: { fontWeight: 'bold', fontSize: 13 },
});

export default OrdersScreen;
