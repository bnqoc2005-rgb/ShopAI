// src/screens/CheckoutScreen.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useCartStore } from '../store/useCartStore';
import { useOrderStore } from '../store/useOrderStore';
import { COLORS } from '../constants/theme';
import { hapticSuccess } from '../utils/haptics';

export function CheckoutScreen({ navigation }: any) {
  const { cart, getTotalPrice, clearCart } = useCartStore();
  const addOrder = useOrderStore((state) => state.addOrder);
  const payOrder = useOrderStore((state) => state.payOrder);

  const total = typeof getTotalPrice === 'function' ? getTotalPrice() : 0;
  const [step, setStep] = useState<'CONFIRM' | 'QR_PAY' | 'SUCCESS'>('CONFIRM');
  const [orderId, setOrderId] = useState('');
  const [countdown, setCountdown] = useState(900); // 15 phút = 900s
  const [isProcessing, setIsProcessing] = useState(false);

  // Đếm ngược thời gian hết hạn mã QR
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

  // 1. Khi bấm Xác nhận đặt hàng -> Tạo mã đơn & hiển thị mã QR
  const handleProceedToQR = () => {
    if (cart.length === 0 && total === 0) {
      Alert.alert('Giỏ hàng trống', 'Vui lòng chọn sản phẩm trước khi thanh toán.');
      return;
    }

    const generatedId = `ORD_${Date.now().toString().slice(-6)}`;
    setOrderId(generatedId);

    // Lưu đơn hàng vào kho dữ liệu với trạng thái PENDING
    addOrder({
      id: generatedId,
      items: [...cart],
      totalAmount: total,
      status: 'PENDING',
      createdAt: new Date().toLocaleDateString('vi-VN'),
    });

    hapticSuccess();
    setStep('QR_PAY');
  };

  // 2. Xác nhận đã chuyển khoản thành công
  const handleConfirmPaid = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      payOrder(orderId);
      clearCart();
      hapticSuccess();
      setStep('SUCCESS');
    }, 1000);
  };

  // Link mã QR chuẩn VietQR (Ngân hàng MB Bank mẫu)
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=2|99|0827003330|CAO LUU BAO NGOC|${orderId}|0|0|${total}`;
  const vietQrUrl = `https://img.vietqr.io/image/MB-0827003330-compact2.jpg?amount=${total}&addInfo=BAO NGOC%20${orderId}&accountName=BAONGOC%20STORE`;

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* ================= BƯỚC 1: XÁC NHẬN ================= */}
        {step === 'CONFIRM' && (
          <View style={styles.card}>
            <View style={styles.headerBox}>
              <Text style={styles.badge}>BƯỚC 1/2</Text>
              <Text style={styles.title}>Xác nhận thanh toán</Text>
              <Text style={styles.subtitle}>Kiểm tra thông tin đơn hàng của bạn</Text>
            </View>

            <View style={styles.infoCard}>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Số lượng hàng:</Text>
                <Text style={styles.infoValue}>{cart.length} sản phẩm</Text>
              </View>

              <View style={styles.divider} />

              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Phương thức:</Text>
                <Text style={[styles.infoValue, { color: COLORS.primary }]}>
                  QR Ngân hàng
                </Text>
              </View>

              <View style={styles.divider} />

              <View style={styles.infoRow}>
                <Text style={styles.totalLabel}>Tổng tiền:</Text>
                <Text style={styles.totalAmount}>{total.toLocaleString('vi-VN')} VNĐ</Text>
              </View>
            </View>

            <TouchableOpacity style={styles.primaryBtn} onPress={handleProceedToQR} activeOpacity={0.85}>
              <Text style={styles.primaryBtnText}>⚡ Xác nhận đặt hàng</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.secondaryBtn} onPress={() => navigation.goBack()} activeOpacity={0.7}>
              <Text style={styles.secondaryBtnText}>Quay lại giỏ hàng</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* ================= BƯỚC 2: MÃ QR CODE THANH TOÁN ================= */}
        {step === 'QR_PAY' && (
          <View style={styles.card}>
            <View style={styles.headerBox}>
              <View style={styles.qrHeaderTag}>
                <Text style={styles.qrHeaderTagText}>QUÉT MÃ THANH TOÁN</Text>
              </View>
              <Text style={styles.title}>Mã QR Đơn Hàng</Text>
              <Text style={styles.orderIdText}>Mã đơn: {orderId}</Text>
            </View>

            {/* Khung chứa ảnh mã QR */}
            <View style={styles.qrFrame}>
              <Image
                source={{ uri: vietQrUrl }}
                defaultSource={{ uri: qrUrl }}
                style={styles.qrImage}
                resizeMode="contain"
              />
              <View style={styles.timerBadge}>
                <Text style={styles.timerText}>⏱️ Hết hạn trong: {formatTime(countdown)}</Text>
              </View>
            </View>

            {/* Bảng chi tiết chuyển khoản */}
            <View style={styles.bankInfoBox}>
              <View style={styles.bankRow}>
                <Text style={styles.bankLabel}>Số tiền:</Text>
                <Text style={styles.bankAmount}>{total.toLocaleString('vi-VN')} VNĐ</Text>
              </View>
              <View style={styles.bankRow}>
                <Text style={styles.bankLabel}>Ngân hàng:</Text>
                <Text style={styles.bankValue}>MB Bank (Quân Đội)</Text>
              </View>
              <View style={styles.bankRow}>
                <Text style={styles.bankLabel}>Số tài khoản:</Text>
                <Text style={styles.bankValue}>082700330</Text>
              </View>
              <View style={styles.bankRow}>
                <Text style={styles.bankLabel}>Nội dung:</Text>
                <Text style={[styles.bankValue, { color: '#D97706', fontWeight: 'bold' }]}>BAO NGOC {orderId}</Text>
              </View>
            </View>

            {/* Các nút hành động sau khi quét */}
            {isProcessing ? (
              <ActivityIndicator size="large" color={COLORS.primary} style={{ marginVertical: 20 }} />
            ) : (
              <>
                <TouchableOpacity style={styles.successBtn} onPress={handleConfirmPaid} activeOpacity={0.85}>
                  <Text style={styles.successBtnText}>✅ Tôi đã chuyển khoản xong</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.secondaryBtn}
                  onPress={() => {
                    clearCart();
                    navigation.navigate('Orders');
                  }}
                  activeOpacity={0.7}
                >
                  <Text style={styles.secondaryBtnText}>Thanh toán sau / Xem đơn hàng</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        )}

        {/* ================= BƯỚC 3: HOÀN TẤT ================= */}
        {step === 'SUCCESS' && (
          <View style={[styles.card, { alignItems: 'center', paddingVertical: 32 }]}>
            <Text style={{ fontSize: 60, marginBottom: 12 }}>🎉</Text>
            <Text style={[styles.title, { color: '#059669', marginBottom: 6 }]}>Thanh toán thành công!</Text>
            <Text style={styles.orderIdText}>Mã đơn hàng: {orderId}</Text>
            <Text style={{ textAlign: 'center', color: '#6B7280', marginVertical: 14, lineHeight: 22, paddingHorizontal: 16 }}>
              Cảm ơn bạn đã mua hàng tại ShopAI. Đơn hàng của bạn đã được chuyển sang trạng thái ĐÃ THANH TOÁN.
            </Text>

            <TouchableOpacity
              style={styles.primaryBtn}
              onPress={() => {
                if (navigation?.navigate) {
                  navigation.navigate('Orders');
                } else if (navigation?.goBack) {
                  navigation.goBack();
                }
              }}
              activeOpacity={0.85}
            >
              <Text style={styles.primaryBtnText}>Xem danh sách đơn hàng</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 16,
    justifyContent: 'center',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  headerBox: {
    alignItems: 'center',
    marginBottom: 16,
  },
  badge: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.primary,
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginBottom: 6,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    color: '#6B7280',
  },
  orderIdText: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.primary,
    marginTop: 2,
  },
  infoCard: {
    backgroundColor: '#F9FAFB',
    borderRadius: 14,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
    gap: 8,
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: 4,
  },
  infoLabel: {
    fontSize: 14,
    color: '#4B5563',
    flexShrink: 0,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    flex: 1,
    textAlign: 'right',
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: '800',
    color: '#EF4444',
  },
  primaryBtn: {
    backgroundColor: '#EF4444',
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    width: '100%',
  },
  primaryBtnText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 15,
  },
  secondaryBtn: {
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
  },
  secondaryBtnText: {
    color: '#4B5563',
    fontWeight: '700',
    fontSize: 13,
  },
  qrHeaderTag: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 6,
  },
  qrHeaderTagText: {
    color: '#15803D',
    fontSize: 11,
    fontWeight: '800',
  },
  qrFrame: {
    alignItems: 'center',
    backgroundColor: '#FAFAFA',
    borderRadius: 16,
    padding: 16,
    borderWidth: 2,
    borderColor: '#E2E8F0',
    marginBottom: 16,
  },
  qrImage: {
    width: 230,
    height: 230,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
  },
  timerBadge: {
    marginTop: 10,
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
  },
  timerText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#B45309',
  },
  bankInfoBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
  },
  bankRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  bankLabel: {
    fontSize: 13,
    color: '#64748B',
  },
  bankValue: {
    fontSize: 13,
    fontWeight: '600',
    color: '#0F172A',
  },
  bankAmount: {
    fontSize: 15,
    fontWeight: '800',
    color: '#EF4444',
  },
  successBtn: {
    backgroundColor: '#10B981',
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    width: '100%',
  },
  successBtnText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 15,
  },
});

export default CheckoutScreen;
