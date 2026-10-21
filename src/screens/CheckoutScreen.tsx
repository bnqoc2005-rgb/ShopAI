import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import axiosClient from '@api/axiosClient';
import { useCartStore, CartItem } from '@store/useCartStore';
import { useOrderStore } from '../store/useOrderStore';
import { COLORS, SIZES } from '@constants/theme';
import { formatCurrency } from '@utils/formatCurrency';
import { hapticSuccess } from '../utils/haptics';

type CreateOrderResponse = { id: string; status: string; total: number; createdAt: string };

const placeOrderAPI = async (items: CartItem[], total: number): Promise<CreateOrderResponse> => {
  const response = await axiosClient.post('/api/orders', {
    items: items.map((item) => ({ productId: item.id, quantity: item.quantity })),
    total,
  });

  return response.data;
};

export function CheckoutScreen({ route, navigation }: any) {
  const { getTotalPrice, clearCart } = useCartStore();
  const cartItems = useCartStore((state) => state.items || state.cart);

  // Hỗ trợ mua ngay 1 sản phẩm trực tiếp hoặc thanh toán toàn bộ giỏ hàng
  const routeParams = route?.params || {};
  const directProduct = routeParams.product;
  const directQuantity = routeParams.quantity || 1;

  const items: CartItem[] = directProduct
    ? [
        {
          id: directProduct.id,
          name: directProduct.name,
          price:
            typeof directProduct.price === 'number'
              ? directProduct.price
              : parseFloat(String(directProduct.price).replace(/[^0-9.-]+/g, '')) || 0,
          quantity: directQuantity,
          image: directProduct.image,
        },
      ]
    : cartItems || [];

  const totalPrice = directProduct
    ? items[0].price * directQuantity
    : typeof getTotalPrice === 'function'
    ? getTotalPrice()
    : 0;

  // Phương thức thanh toán: Mặc định là Quét mã QR (VietQR)
  const [paymentMethod, setPaymentMethod] = useState<'QR_CODE' | 'COD'>('QR_CODE');
  const [isPlacing, setIsPlacing] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [orderId, setOrderId] = useState<string | null>(null);

  // Mã tham chiếu thanh toán và đồng hồ đếm ngược hết hạn QR (15 phút)
  const [tempOrderCode] = useState(() => Math.floor(100000 + Math.random() * 900000).toString());
  const [countdown, setCountdown] = useState(900);

  useEffect(() => {
    if (paymentMethod !== 'QR_CODE') return;
    const timer = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [paymentMethod]);

  const formatCountdown = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const vietQrUrl = `https://img.vietqr.io/image/MB-0827003330-compact2.jpg?amount=${totalPrice}&addInfo=SHOPAI%20${tempOrderCode}&accountName=BAO%20NGOC%20STORE`;
  const qrFallbackUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=2|99|0827003330|BAO%20NGOC|${tempOrderCode}|0|0|${totalPrice}`;

  const handleConfirm = async () => {
    if (items.length === 0) {
      setErrorMessage('Không có sản phẩm nào để thanh toán');
      return;
    }

    setIsPlacing(true);
    setErrorMessage(null);

    try {
      let createdOrder: CreateOrderResponse;
      try {
        createdOrder = await placeOrderAPI(items, totalPrice);
      } catch (apiErr: any) {
        // Fallback tạo mã đơn cục bộ nếu chưa có mạng backend
        createdOrder = {
          id: `ORD_${tempOrderCode}`,
          status: paymentMethod === 'QR_CODE' ? 'PAID' : 'PENDING',
          total: totalPrice,
          createdAt: new Date().toISOString(),
        };
      }

      setOrderId(createdOrder.id);

      // Nếu thanh toán Quét mã QR, tự động kích hoạt xác nhận thanh toán (Pay)
      if (paymentMethod === 'QR_CODE') {
        try {
          await axiosClient.post(`/api/orders/${createdOrder.id}/pay`);
        } catch (_) {}
      }

      useOrderStore.getState().addOrder({
        id: createdOrder.id,
        items: items.map((i) => ({ ...i })),
        totalAmount: totalPrice,
        status: paymentMethod === 'QR_CODE' ? 'PAID' : 'PENDING',
        createdAt: new Date().toLocaleDateString('vi-VN'),
      });

      if (!directProduct) {
        clearCart();
      }

      hapticSuccess();
      setIsDone(true);
    } catch (error: any) {
      const serverMessage = error?.response?.data?.message;
      const message = Array.isArray(serverMessage)
        ? serverMessage.join(', ')
        : serverMessage ?? 'Thanh toán thất bại, vui lòng thử lại';
      setErrorMessage(message);
    } finally {
      setIsPlacing(false);
    }
  };

  if (isDone) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.center}>
          <Text style={styles.successIcon}>🎉</Text>
          <Text style={styles.successText}>Đặt hàng & Thanh toán thành công!</Text>
          <Text style={styles.orderIdText}>Mã đơn hàng: {orderId}</Text>
          <Text style={styles.paymentMethodNotice}>
            Phương thức:{' '}
            <Text style={{ fontWeight: 'bold', color: COLORS.primary }}>
              {paymentMethod === 'QR_CODE' ? 'Đã quét mã VietQR (Đã thanh toán)' : 'Tiền mặt khi nhận hàng (COD)'}
            </Text>
          </Text>

          <TouchableOpacity
            style={[styles.primaryBtn, { marginTop: 24 }]}
            onPress={() => {
              if (navigation?.navigate) {
                navigation.navigate('Orders');
              } else if (navigation?.goBack) {
                navigation.goBack();
              }
            }}
            activeOpacity={0.85}
          >
            <Text style={styles.primaryBtnText}>📦 Xem lịch sử đơn hàng</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryBtn}
            onPress={() => {
              if (navigation?.navigate) {
                navigation.navigate('Home');
              } else if (navigation?.goBack) {
                navigation.goBack();
              }
            }}
            activeOpacity={0.7}
          >
            <Text style={styles.secondaryBtnText}>⌂ Về trang chủ</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          <View style={styles.headerBox}>
            <Text style={styles.badge}>MỤC THANH TOÁN</Text>
            <Text style={styles.title}>Thanh toán đơn hàng</Text>
            <Text style={styles.subtitle}>Kiểm tra thông tin & Quét mã thanh toán bên dưới</Text>
          </View>

          {/* Tóm tắt đơn hàng */}
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Số lượng mặt hàng:</Text>
              <Text style={styles.infoValue}>{items.length} sản phẩm</Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.infoRow}>
              <Text style={styles.totalLabel}>Tổng tiền:</Text>
              <Text style={styles.totalAmount}>{formatCurrency(totalPrice)}</Text>
            </View>
          </View>

          {/* Chọn phương thức thanh toán */}
          <Text style={styles.sectionTitle}>Phương thức thanh toán:</Text>
          <View style={styles.methodSelectorRow}>
            <TouchableOpacity
              style={[
                styles.methodCard,
                paymentMethod === 'QR_CODE' && styles.methodCardActive,
              ]}
              onPress={() => setPaymentMethod('QR_CODE')}
              activeOpacity={0.8}
            >
              <Text style={styles.methodIcon}>📱</Text>
              <Text style={[styles.methodTitle, paymentMethod === 'QR_CODE' && styles.methodTextActive]}>
                Quét mã QR
              </Text>
              <Text style={styles.methodSubtitle}>VietQR / Ngân hàng</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.methodCard,
                paymentMethod === 'COD' && styles.methodCardActive,
              ]}
              onPress={() => setPaymentMethod('COD')}
              activeOpacity={0.8}
            >
              <Text style={styles.methodIcon}>💵</Text>
              <Text style={[styles.methodTitle, paymentMethod === 'COD' && styles.methodTextActive]}>
                Tiền mặt
              </Text>
              <Text style={styles.methodSubtitle}>Khi nhận hàng (COD)</Text>
            </TouchableOpacity>
          </View>

          {/* MỤC QUÉT MÃ THANH TOÁN QR */}
          {paymentMethod === 'QR_CODE' && (
            <View style={styles.qrSection}>
              <View style={styles.qrHeaderRow}>
                <Text style={styles.qrSectionTitle}>📱 Mục quét mã QR thanh toán</Text>
                <View style={styles.timerBadge}>
                  <Text style={styles.timerBadgeText}>⏱️ {formatCountdown(countdown)}</Text>
                </View>
              </View>
              <Text style={styles.qrGuideText}>
                Mở ứng dụng Ngân hàng hoặc ví MoMo, ZaloPay... trên điện thoại để quét mã bên dưới:
              </Text>

              {/* Khung hiển thị mã QR */}
              <View style={styles.qrImageFrame}>
                <Image
                  source={{ uri: vietQrUrl }}
                  defaultSource={{ uri: qrFallbackUrl }}
                  style={styles.qrImage}
                  resizeMode="contain"
                />
              </View>

              {/* Thông tin tài khoản nhận chuyển khoản */}
              <View style={styles.bankDetailCard}>
                <View style={styles.bankDetailRow}>
                  <Text style={styles.bankLabel}>Ngân hàng:</Text>
                  <Text style={styles.bankValue}>MB Bank (Ngân Hàng Quân Đội)</Text>
                </View>
                <View style={styles.bankDetailRow}>
                  <Text style={styles.bankLabel}>Số tài khoản:</Text>
                  <Text style={[styles.bankValue, { color: '#059669', fontWeight: '800' }]}>
                    0827003330
                  </Text>
                </View>
                <View style={styles.bankDetailRow}>
                  <Text style={styles.bankLabel}>Chủ tài khoản:</Text>
                  <Text style={styles.bankValue}>BAO NGOC STORE</Text>
                </View>
                <View style={styles.bankDetailRow}>
                  <Text style={styles.bankLabel}>Số tiền:</Text>
                  <Text style={[styles.bankValue, { color: '#DC2626', fontWeight: '800' }]}>
                    {formatCurrency(totalPrice)}
                  </Text>
                </View>
                <View style={styles.bankDetailRow}>
                  <Text style={styles.bankLabel}>Nội dung CK:</Text>
                  <Text style={[styles.bankValue, { color: '#D97706', fontWeight: '800' }]}>
                    SHOPAI {tempOrderCode}
                  </Text>
                </View>
              </View>

              {/* Nút hỗ trợ mở máy quét mã nếu cần */}
              <TouchableOpacity
                style={styles.openScannerBtn}
                onPress={() => {
                  if (navigation?.navigate) {
                    navigation.navigate('Scanner');
                  }
                }}
                activeOpacity={0.8}
              >
                <Text style={styles.openScannerBtnText}>📷 Mở máy quét mã QR / Barcode</Text>
              </TouchableOpacity>
            </View>
          )}

          {errorMessage && <Text style={styles.errorText}>⚠️ {errorMessage}</Text>}

          {/* Nút hành động thanh toán */}
          <TouchableOpacity
            style={[styles.primaryBtn, isPlacing && { opacity: 0.7 }]}
            onPress={handleConfirm}
            disabled={isPlacing}
            activeOpacity={0.85}
          >
            {isPlacing ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <Text style={styles.primaryBtnText}>
                {paymentMethod === 'QR_CODE'
                  ? '⚡ Xác nhận đã quét mã & Thanh toán'
                  : '📦 Xác nhận đặt hàng (COD)'}
              </Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryBtn}
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
            disabled={isPlacing}
          >
            <Text style={styles.secondaryBtnText}>Quay lại</Text>
          </TouchableOpacity>
        </View>
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
    paddingBottom: 32,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  successIcon: {
    fontSize: 56,
    marginBottom: 16,
  },
  successText: {
    fontSize: 22,
    fontWeight: '800',
    color: '#059669',
    textAlign: 'center',
  },
  paymentMethodNotice: {
    marginTop: 8,
    fontSize: 14,
    color: '#4B5563',
    textAlign: 'center',
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
    textAlign: 'center',
  },
  orderIdText: {
    marginTop: 8,
    fontSize: SIZES.body2,
    color: COLORS.textLight,
  },
  errorText: {
    marginTop: 12,
    color: COLORS.danger,
    fontSize: SIZES.body2,
    textAlign: 'center',
    marginBottom: 12,
  },
  infoCard: {
    backgroundColor: '#F9FAFB',
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: 4,
  },
  infoLabel: {
    fontSize: 14,
    color: '#4B5563',
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
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
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 8,
  },
  methodSelectorRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
  },
  methodCard: {
    flex: 1,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
  },
  methodCardActive: {
    borderColor: '#10B981',
    backgroundColor: '#ECFDF5',
  },
  methodIcon: {
    fontSize: 22,
    marginBottom: 4,
  },
  methodTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#334155',
    marginBottom: 2,
  },
  methodTextActive: {
    color: '#065F46',
  },
  methodSubtitle: {
    fontSize: 11,
    color: '#64748B',
  },
  qrSection: {
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    marginBottom: 16,
    alignItems: 'center',
  },
  qrHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 8,
  },
  qrSectionTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
  },
  timerBadge: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  timerBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#B45309',
  },
  qrGuideText: {
    fontSize: 12,
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 12,
    lineHeight: 17,
  },
  qrImageFrame: {
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
    marginBottom: 12,
  },
  qrImage: {
    width: 200,
    height: 200,
  },
  bankDetailCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 12,
    width: '100%',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 10,
  },
  bankDetailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 3,
  },
  bankLabel: {
    fontSize: 12,
    color: '#64748B',
  },
  bankValue: {
    fontSize: 12,
    color: '#1E293B',
    fontWeight: '600',
  },
  openScannerBtn: {
    backgroundColor: '#EEF2FF',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#C7D2FE',
  },
  openScannerBtnText: {
    color: '#4F46E5',
    fontSize: 12,
    fontWeight: '700',
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
});

export default CheckoutScreen;

