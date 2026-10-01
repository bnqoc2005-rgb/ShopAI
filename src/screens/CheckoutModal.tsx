// src/screens/CheckoutModal.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, ScrollView } from 'react-native';
import { useOrderStore } from '../store/useOrderStore';
import { COLORS } from '../constants/theme';
import { hapticSuccess } from '../utils/haptics';

export function CheckoutModal({ route, navigation }: any) {
  const { product, quantity = 1 } = route.params || {};
  const [step, setStep] = useState<'FORM' | 'QR_PAY' | 'SUCCESS'>('FORM');
  const [orderId, setOrderId] = useState('');
  const [countdown, setCountdown] = useState(900);
  const addOrder = useOrderStore((state) => state.addOrder);
  const payOrder = useOrderStore((state) => state.payOrder);

  useEffect(() => {
    if (step !== 'QR_PAY') return;
    const timer = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [step]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  if (!product) {
    return (
      <View style={styles.overlay}>
        <View style={styles.modalCard}>
          <Text style={styles.modalTitle}>Không có thông tin sản phẩm</Text>
          <TouchableOpacity style={styles.fullBtn} onPress={() => navigation?.goBack()}>
            <Text style={{ color: '#FFF', fontWeight: 'bold' }}>Đóng</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const priceNum =
    typeof product.price === 'number'
      ? product.price
      : parseFloat(String(product.price).replace(/[^0-9.-]+/g, '')) || 0;
  const total = priceNum * quantity;

  const handleConfirmOrder = () => {
    const generatedId = `ORD_${Math.floor(100000 + Math.random() * 900000)}`;
    setOrderId(generatedId);

    addOrder({
      id: generatedId,
      items: [{ ...product, quantity }],
      totalAmount: total,
      status: 'PENDING',
      createdAt: new Date().toLocaleDateString('vi-VN'),
    });

    hapticSuccess();
    setStep('QR_PAY');
  };

  const handleFinishPayment = () => {
    payOrder(orderId);
    hapticSuccess();
    setStep('SUCCESS');
  };

  const vietQrUrl = `https://img.vietqr.io/image/MB-0827003330-compact2.jpg?amount=${total}&addInfo=BAO NGOC%20${orderId}&accountName=BAO NGOC%20STORE`;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=2|99|027003330|BAO NGOC|${orderId}|0|0|${total}`;

  return (
    <View style={styles.overlay}>
      <View style={styles.modalCard}>
        {step === 'FORM' && (
          <>
            <Text style={styles.modalTitle}>⚡ Xác nhận đơn hàng</Text>
            <View style={styles.itemSummary}>
              <Text style={{ fontWeight: '600', color: '#1E293B' }}>{product.name}</Text>
              <Text style={{ color: '#4F46E5', marginTop: 4, fontWeight: '600' }}>
                {priceNum.toLocaleString('vi-VN')} đ x {quantity}
              </Text>
            </View>

            <Text style={styles.totalText}>Tổng thanh toán: {total.toLocaleString('vi-VN')} đ</Text>

            <TextInput
              style={styles.input}
              defaultValue="Người dùng Thử nghiệm"
              placeholder="Tên người nhận"
              placeholderTextColor="#94A3B8"
            />
            <TextInput
              style={styles.input}
              defaultValue="0912345678"
              placeholder="Số điện thoại"
              keyboardType="phone-pad"
              placeholderTextColor="#94A3B8"
            />
            <TextInput
              style={styles.input}
              defaultValue="12 Nguyễn Văn Bảo, Q. Gò Vấp, TP.HCM"
              placeholder="Địa chỉ giao hàng"
              multiline
              placeholderTextColor="#94A3B8"
            />

            <View style={styles.actionRow}>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => navigation?.goBack()} activeOpacity={0.7}>
                <Text style={{ color: '#64748B', fontWeight: '600' }}>Để sau</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.submitBtn} onPress={handleConfirmOrder} activeOpacity={0.8}>
                <Text style={{ color: '#FFF', fontWeight: 'bold' }}>Thanh toán QR</Text>
              </TouchableOpacity>
            </View>
          </>
        )}

        {step === 'QR_PAY' && (
          <ScrollView contentContainerStyle={{ alignItems: 'center', paddingVertical: 6 }} showsVerticalScrollIndicator={false}>
            <Text style={styles.modalTitle}>📱 Quét mã thanh toán</Text>
            <Text style={{ fontSize: 13, color: COLORS.primary, fontWeight: '700', marginBottom: 10 }}>
              Đơn hàng: {orderId} · {total.toLocaleString('vi-VN')} VNĐ
            </Text>

            <View style={styles.qrFrame}>
              <Image source={{ uri: vietQrUrl }} defaultSource={{ uri: qrUrl }} style={styles.qrImage} resizeMode="contain" />
              <Text style={styles.timerText}>⏱️ Hết hạn sau: {formatTime(countdown)}</Text>
            </View>

            <View style={styles.bankDetail}>
              <Text style={styles.bankText}>MB Bank · STK: <Text style={{ fontWeight: 'bold' }}>0827003330</Text></Text>
              <Text style={styles.bankText}>Nội dung: <Text style={{ fontWeight: 'bold', color: '#D97706' }}>SHOPAI {orderId}</Text></Text>
            </View>

            <TouchableOpacity style={[styles.fullBtn, { backgroundColor: '#10B981', marginBottom: 8 }]} onPress={handleFinishPayment}>
              <Text style={{ color: '#FFF', fontWeight: 'bold' }}>✅ Đã chuyển khoản</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.cancelBtn} onPress={() => { navigation?.goBack(); navigation?.navigate('Orders'); }}>
              <Text style={{ color: '#64748B', fontWeight: '600' }}>Để sau (COD)</Text>
            </TouchableOpacity>
          </ScrollView>
        )}

        {step === 'SUCCESS' && (
          <View style={{ alignItems: 'center', paddingVertical: 12 }}>
            <Text style={{ fontSize: 44, marginBottom: 8 }}>🎉</Text>
            <Text style={styles.successTitle}>Đặt hàng & Thanh toán thành công!</Text>
            <Text style={{ color: '#4F46E5', fontWeight: 'bold', marginVertical: 6 }}>Mã đơn: {orderId}</Text>
            <Text style={{ color: '#64748B', textAlign: 'center', marginBottom: 16 }}>
              Đơn hàng của bạn đã được ghi nhận vào hệ thống.
            </Text>

            <TouchableOpacity
              style={styles.fullBtn}
              onPress={() => {
                navigation?.goBack();
                if (navigation?.navigate) {
                  navigation.navigate('Orders');
                }
              }}
              activeOpacity={0.8}
            >
              <Text style={{ color: '#FFF', fontWeight: 'bold' }}>Xem đơn hàng của tôi</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 20 },
  modalCard: { backgroundColor: '#FFF', borderRadius: 20, padding: 20, maxHeight: '90%' },
  modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 12, color: '#0F172A', textAlign: 'center' },
  itemSummary: { backgroundColor: '#F8FAFC', padding: 10, borderRadius: 8, marginBottom: 10 },
  totalText: { fontSize: 16, fontWeight: 'bold', color: '#4F46E5', marginBottom: 12 },
  input: { borderWidth: 1, borderColor: '#CBD5E1', borderRadius: 8, padding: 10, marginBottom: 10, fontSize: 14, color: '#1E293B' },
  actionRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
  cancelBtn: { flex: 1, height: 44, justifyContent: 'center', alignItems: 'center', marginRight: 8, borderRadius: 8, backgroundColor: '#F1F5F9' },
  submitBtn: { flex: 1.5, height: 44, justifyContent: 'center', alignItems: 'center', borderRadius: 8, backgroundColor: '#4F46E5' },
  successTitle: { fontSize: 18, fontWeight: 'bold', color: '#16A34A' },
  fullBtn: { backgroundColor: '#4F46E5', height: 44, width: '100%', borderRadius: 8, justifyContent: 'center', alignItems: 'center' },
  qrFrame: { alignItems: 'center', backgroundColor: '#F8FAFC', padding: 12, borderRadius: 12, borderWidth: 1, borderColor: '#E2E8F0', marginBottom: 10 },
  qrImage: { width: 190, height: 190, borderRadius: 8 },
  timerText: { fontSize: 11, fontWeight: '700', color: '#B45309', marginTop: 6 },
  bankDetail: { backgroundColor: '#F1F5F9', padding: 8, borderRadius: 8, width: '100%', marginBottom: 12 },
  bankText: { fontSize: 12, color: '#334155', textAlign: 'center', marginVertical: 1 },
});

export default CheckoutModal;
