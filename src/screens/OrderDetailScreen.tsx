// src/screens/OrderDetailScreen.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useOrderStore } from '../store/useOrderStore';

export function OrderDetailScreen({ route, navigation }: any) {
  const { orderId } = route.params || {};
  const { orders, payOrder } = useOrderStore();
  const order = orders.find((o) => o.id === orderId);

  if (!order) {
    return (
      <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
        <Text style={styles.title}>Không tìm thấy đơn hàng</Text>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={{ color: '#007AFF', fontWeight: 'bold' }}>← Quay lại</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const handlePay = () => {
    payOrder(order.id);
    Alert.alert('Thành công', 'Đã chuyển trạng thái sang PAID!');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
        <Text style={{ color: '#007AFF', fontWeight: 'bold', fontSize: 16 }}>← Quay lại</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Chi tiết đơn: {order.id}</Text>
      <Text style={styles.info}>
        Trạng thái:{' '}
        <Text style={{ fontWeight: 'bold', color: order.status === 'PAID' ? '#48BB78' : '#ED8936' }}>
          {order.status}
        </Text>
      </Text>
      <Text style={styles.info}>Ngày tạo: {order.createdAt}</Text>
      <Text style={styles.info}>
        Tổng tiền:{' '}
        <Text style={{ fontWeight: 'bold', color: '#FF424E' }}>
          {order.totalAmount.toLocaleString('vi-VN')} VNĐ
        </Text>
      </Text>

      {order.status === 'PENDING' && (
        <TouchableOpacity style={styles.payBtn} onPress={handlePay} activeOpacity={0.8}>
          <Text style={styles.payBtnText}>Thanh toán (PENDING ➔ PAID)</Text>
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#FFF' },
  backBtn: { marginBottom: 16, paddingVertical: 4 },
  title: { fontSize: 18, fontWeight: 'bold', marginBottom: 12, color: '#1A202C' },
  info: { fontSize: 15, marginBottom: 8, color: '#333' },
  payBtn: { backgroundColor: '#48BB78', height: 44, borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginTop: 20 },
  payBtnText: { color: '#FFF', fontWeight: 'bold' },
});

export default OrderDetailScreen;
