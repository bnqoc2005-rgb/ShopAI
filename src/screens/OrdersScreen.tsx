// src/screens/OrdersScreen.tsx
import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useOrderStore, Order } from '../store/useOrderStore';
import axiosClient from '@api/axiosClient';

export function OrdersScreen({ navigation }: any) {
  const localOrders = useOrderStore((state) => state.orders);
  const [loading, setLoading] = useState(false);
  const [combinedOrders, setCombinedOrders] = useState<Order[]>(localOrders);

  const fetchOrdersFromBackend = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axiosClient.get('/api/orders');
      if (Array.isArray(res.data) && res.data.length > 0) {
        const mappedBackendOrders: Order[] = res.data.map((item: any) => ({
          id: item.id,
          totalAmount: item.total ?? item.totalAmount ?? 0,
          status: item.status || 'PENDING',
          createdAt: item.createdAt ? new Date(item.createdAt).toLocaleDateString('vi-VN') : 'Gần đây',
          items: item.items || [],
        }));

        // Hợp nhất đơn hàng: đơn từ backend + đơn lưu cục bộ (không trùng id)
        const existingIds = new Set(mappedBackendOrders.map((o) => o.id));
        const nonDuplicateLocal = localOrders.filter((o) => !existingIds.has(o.id));
        setCombinedOrders([...mappedBackendOrders, ...nonDuplicateLocal]);
      } else {
        setCombinedOrders(localOrders);
      }
    } catch {
      // Nếu backend chưa bật hoặc gặp lỗi mạng, sử dụng danh sách đơn cục bộ
      setCombinedOrders(localOrders);
    } finally {
      setLoading(false);
    }
  }, [localOrders]);

  useEffect(() => {
    fetchOrdersFromBackend();
  }, [fetchOrdersFromBackend]);

  const canGoBack = navigation?.canGoBack ? navigation.canGoBack() : false;

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <View style={styles.headerBar}>
        {canGoBack ? (
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn} activeOpacity={0.7}>
            <Text style={styles.backBtnText}>← Quay lại</Text>
          </TouchableOpacity>
        ) : (
          <View style={{ width: 60 }} />
        )}
        <Text style={styles.headerTitle}>Lịch sử đơn hàng</Text>
        <TouchableOpacity onPress={fetchOrdersFromBackend} style={styles.refreshBtn} activeOpacity={0.7}>
          {loading ? (
            <ActivityIndicator size="small" color="#4F46E5" />
          ) : (
            <Text style={styles.refreshBtnText}>🔄 Làm mới</Text>
          )}
        </TouchableOpacity>
      </View>

      <FlatList
        data={combinedOrders}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={fetchOrdersFromBackend} colors={['#4F46E5']} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={{ fontSize: 48, marginBottom: 12 }}>📦</Text>
            <Text style={styles.emptyText}>Bạn chưa có đơn hàng nào</Text>
          </View>
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.orderCard}
            onPress={() => navigation.navigate('OrderDetail', { orderId: item.id, order: item })}
            activeOpacity={0.8}
          >
            <View style={styles.cardHeader}>
              <Text style={styles.orderId}>Mã đơn: {item.id}</Text>
              <Text style={[styles.status, { color: item.status === 'PAID' ? '#10B981' : '#F59E0B' }]}>
                ● {item.status === 'PAID' ? 'Đã thanh toán' : 'Chờ thanh toán'}
              </Text>
            </View>

            <Text style={styles.orderDate}>Ngày tạo: {item.createdAt}</Text>

            {item.items && item.items.length > 0 && (
              <View style={styles.itemsBox}>
                {item.items.map((prod: any, idx: number) => (
                  <Text key={idx} style={styles.itemText} numberOfLines={1}>
                    • {prod.name || prod.product?.name || `Mặt hàng #${idx + 1}`} (x{prod.quantity || 1})
                  </Text>
                ))}
              </View>
            )}

            <View style={styles.row}>
              <Text style={styles.totalLabel}>Tổng tiền:</Text>
              <Text style={styles.price}>{item.totalAmount.toLocaleString('vi-VN')} VNĐ</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  backBtn: { paddingVertical: 4, width: 70 },
  backBtnText: { color: '#4F46E5', fontWeight: 'bold', fontSize: 14 },
  refreshBtn: { paddingVertical: 4, width: 70, alignItems: 'flex-end' },
  refreshBtnText: { color: '#4F46E5', fontWeight: '700', fontSize: 12 },
  headerTitle: { fontSize: 17, fontWeight: 'bold', color: '#111827' },
  listContent: { padding: 16 },
  emptyContainer: { alignItems: 'center', justifyContent: 'center', paddingVertical: 80 },
  emptyText: { fontSize: 14, color: '#9CA3AF' },
  orderCard: {
    backgroundColor: '#FFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  orderId: { fontWeight: 'bold', fontSize: 14, color: '#111827' },
  orderDate: { color: '#6B7280', fontSize: 12, marginBottom: 8 },
  itemsBox: {
    backgroundColor: '#F9FAFB',
    padding: 8,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  itemText: { fontSize: 12, color: '#4B5563', marginBottom: 2 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderTopWidth: 1, borderColor: '#F3F4F6', paddingTop: 8 },
  totalLabel: { fontSize: 13, color: '#6B7280', fontWeight: '500' },
  price: { fontWeight: 'bold', color: '#FF424E', fontSize: 14 },
  status: { fontWeight: 'bold', fontSize: 12 },
});

export default OrdersScreen;
