// src/screens/OrderDetailScreen.tsx
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useOrderStore } from '../store/useOrderStore';
import axiosClient from '@api/axiosClient';

export function OrderDetailScreen({ route, navigation }: any) {
  const { orderId, order: paramOrder } = route.params || {};
  const { orders, payOrder } = useOrderStore();
  const order = orders.find((o) => o.id === orderId) || paramOrder;

  const [currentStatus, setCurrentStatus] = useState(order?.status || 'PENDING');

  if (!order) {
    return (
      <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
        <Text style={styles.title}>Không tìm thấy đơn hàng</Text>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation?.goBack()}>
          <Text style={{ color: '#4F46E5', fontWeight: 'bold' }}>← Quay lại</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const handlePay = async () => {
    payOrder(order.id);
    setCurrentStatus('PAID');
    try {
      await axiosClient.post(`/api/orders/${order.id}/pay`);
    } catch {
      // Offline fallback
    }
    Alert.alert('Thành công', 'Đơn hàng đã được thanh toán thành công (PAID)!');
  };

  const isPaid = currentStatus === 'PAID' || order.status === 'PAID';
  const total = order.totalAmount ?? order.total ?? 0;

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation?.goBack()} activeOpacity={0.7}>
          <Text style={{ color: '#4F46E5', fontWeight: 'bold', fontSize: 15 }}>← Quay lại</Text>
        </TouchableOpacity>

        <View style={styles.card}>
          <Text style={styles.headerTag}>CHI TIẾT HÓA ĐƠN</Text>
          <Text style={styles.title}>{order.id}</Text>

          <View style={styles.statusRow}>
            <Text style={styles.label}>Trạng thái:</Text>
            <View style={[styles.badge, isPaid ? styles.paidBadge : styles.pendingBadge]}>
              <Text style={[styles.badgeText, isPaid ? styles.paidText : styles.pendingText]}>
                {isPaid ? 'ĐÃ THANH TOÁN (PAID)' : 'CHỜ THANH TOÁN (PENDING)'}
              </Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.row}>
            <Text style={styles.label}>Ngày đặt:</Text>
            <Text style={styles.value}>{order.createdAt}</Text>
          </View>

          {order.items && order.items.length > 0 && (
            <View style={{ marginTop: 14 }}>
              <Text style={[styles.label, { marginBottom: 8 }]}>Danh sách sản phẩm:</Text>
              <View style={styles.itemsList}>
                {order.items.map((it: any, index: number) => (
                  <View key={index} style={styles.itemRow}>
                    <Text style={styles.itemName}>
                      {it.name || it.product?.name || `Mặt hàng #${index + 1}`}
                    </Text>
                    <Text style={styles.itemQty}>x{it.quantity || 1}</Text>
                    <Text style={styles.itemPrice}>
                      {((it.price || 0) * (it.quantity || 1)).toLocaleString('vi-VN')} đ
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          <View style={styles.divider} />

          <View style={styles.row}>
            <Text style={styles.totalLabel}>Tổng thanh toán:</Text>
            <Text style={styles.totalAmount}>{total.toLocaleString('vi-VN')} VNĐ</Text>
          </View>
        </View>

        {!isPaid && (
          <TouchableOpacity style={styles.payBtn} onPress={handlePay} activeOpacity={0.8}>
            <Text style={styles.payBtnText}>💳 Xác nhận thanh toán ngay (PAID)</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#F9FAFB' },
  backBtn: { marginBottom: 12, paddingVertical: 4 },
  card: {
    backgroundColor: '#FFF',
    padding: 18,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 16,
  },
  headerTag: { fontSize: 11, fontWeight: '800', color: '#6B7280', letterSpacing: 0.5, marginBottom: 4 },
  title: { fontSize: 20, fontWeight: '900', marginBottom: 14, color: '#111827' },
  statusRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 },
  label: { fontSize: 13, color: '#6B7280', fontWeight: '500' },
  value: { fontSize: 13, color: '#111827', fontWeight: '600' },
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  pendingBadge: { backgroundColor: '#FEF3C7' },
  paidBadge: { backgroundColor: '#D1FAE5' },
  badgeText: { fontSize: 11, fontWeight: '800' },
  pendingText: { color: '#B45309' },
  paidText: { color: '#065F46' },
  divider: { height: 1, backgroundColor: '#F3F4F6', marginVertical: 12 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  itemsList: { backgroundColor: '#F9FAFB', borderRadius: 8, padding: 10 },
  itemRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  itemName: { flex: 1, fontSize: 13, color: '#374151' },
  itemQty: { width: 35, fontSize: 13, color: '#6B7280', textAlign: 'center' },
  itemPrice: { width: 90, fontSize: 13, color: '#111827', fontWeight: '600', textAlign: 'right' },
  totalLabel: { fontSize: 15, fontWeight: '700', color: '#111827' },
  totalAmount: { fontSize: 16, fontWeight: 'bold', color: '#FF424E' },
  payBtn: {
    backgroundColor: '#10B981',
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
  },
  payBtnText: { color: '#FFF', fontWeight: 'bold', fontSize: 14 },
});

export default OrderDetailScreen;
