import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import crashlytics from '@react-native-firebase/crashlytics';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FlashList } from '@shopify/flash-list';
import { useQuery } from '@tanstack/react-query';
import ProductCard from '../components/ProductCard';
import ShopButton from '@components/ShopButton';
import LocationBadge from '@components/LocationBadge';
import { COLORS } from '../constants/theme';
import { useCartStore } from '../store/useCartStore';
import { useAuthStore } from '../store/useAuthStore';
import { API_BASE_URL } from '../constants/api';
import { Product, ProductListSchema } from '../types/product.schema';
import { MOCK_PRODUCTS } from '../schemas/product';

interface HomeScreenProps {
  navigation: any;
  route: any;
  onLogout?: () => void;
}

const fetchProducts = async (): Promise<Product[]> => {
  const url = `${API_BASE_URL}/api/products`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }
  const raw = await response.json();
  const result = ProductListSchema.safeParse(raw);
  if (!result.success) {
    console.warn('Zod validation warning:', result.error);
    return raw as Product[];
  }
  return result.data;
};

export function HomeScreen({ navigation, route, onLogout }: HomeScreenProps) {
  // Lấy dữ liệu mã vạch trả về từ màn hình Scanner (nếu có)
  const scannedCode = route.params?.scannedCode;

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Thử nghiệm gửi log Crashlytics (Kiểm tra kết nối)
  useEffect(() => {
    // Bật thu thập Crashlytics ngay cả trong chế độ debug/dev
    crashlytics().setCrashlyticsCollectionEnabled(true);

    try {
      // Ghi vết hành vi người dùng (Breadcrumbs)
      crashlytics().log('User opened ShopAI Home Screen');
    } catch (error: any) {
      // Gửi lỗi về Firebase Dashboard (Non-fatal error)
      crashlytics().recordError(error);
    }
  }, []);

  const cart = useCartStore((state) => state.cart);
  const totalQuantity = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
  const storeLogout = useAuthStore((state) => state.logout);

  const handleLogout = async () => {
    if (onLogout) {
      onLogout();
    } else {
      await storeLogout();
    }
  };

  // React Query fetch danh sách sản phẩm từ NestJS Server
  const {
    data: products = [],
    isLoading,
    isRefetching,
    refetch,
  } = useQuery<Product[]>({
    queryKey: ['productsList'],
    queryFn: fetchProducts,
    placeholderData: MOCK_PRODUCTS,
    staleTime: 0,
    refetchOnMount: true,
  });

  const displayList = products.length > 0 ? products : MOCK_PRODUCTS;

  // Lọc sản phẩm theo tìm kiếm và danh mục
  const filteredProducts = displayList.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === 'all' ||
      !product.category ||
      product.category.toLowerCase().includes(selectedCategory.toLowerCase());
    return matchesSearch && matchesCategory;
  });

  const isServerData = displayList.some((p) => p.name.includes('NestJS Server'));

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.container}>
        {/* Header Bar */}
        <View style={styles.header}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
            <Text style={styles.headerTitle}>Khám phá</Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('Orders')}
              style={styles.ordersHeaderBtn}
              activeOpacity={0.7}
            >
              <Text style={{ fontSize: 13, marginRight: 4 }}>📦</Text>
              <Text style={styles.ordersHeaderBtnText}>Lịch sử đơn</Text>
            </TouchableOpacity>
          </View>
          <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }}>
            <ShopButton
              title="Hỏi AI"
              onPress={() => navigation.navigate('AIChat')}
              style={{ flex: 1, height: 34, backgroundColor: COLORS.primary }}
            />
            <ShopButton
              title="Quét Mã"
              onPress={() => navigation.navigate('Scanner')}
              style={{ flex: 1, height: 34, backgroundColor: COLORS.secondary }}
            />
            <ShopButton
              title="Thoát"
              onPress={handleLogout}
              style={{ width: 75, height: 34, backgroundColor: '#6B7280' }}
            />
          </View>
        </View>

        {/* Thẻ vị trí & Kết quả quét mã */}
        <View style={styles.topSection}>
          <LocationBadge />

          {/* Banner trạng thái kết nối nguồn dữ liệu */}
          <View style={styles.dataSourceRow}>
            <View style={[styles.sourceBadge, isServerData ? styles.serverBadge : styles.mockBadge]}>
              <Text style={styles.sourceBadgeText}>
                {isServerData ? '🟢 Đang tải từ Backend NestJS (SQLite)' : '🟡 Dữ liệu Mock cục bộ'}
              </Text>
            </View>
            <TouchableOpacity
              style={styles.refreshButton}
              onPress={() => refetch()}
              activeOpacity={0.7}
            >
              {isRefetching ? (
                <ActivityIndicator size="small" color={COLORS.primary} />
              ) : (
                <Text style={styles.refreshButtonText}>🔄 Làm mới</Text>
              )}
            </TouchableOpacity>
          </View>

          {/* Báo cáo nếu quét thành công */}
          {scannedCode && (
            <TouchableOpacity
              style={styles.scannedCodeBanner}
              activeOpacity={0.8}
              onPress={() => {
                const found = displayList.find(
                  (p) =>
                    (p as any).code === scannedCode ||
                    p.id === scannedCode ||
                    ((p as any).code && (p as any).code.replace(/[^a-zA-Z0-9]/g, '') === scannedCode.replace(/[^a-zA-Z0-9]/g, ''))
                );
                if (found) {
                  navigation.navigate('ProductDetail', { product: found, productId: found.id });
                }
              }}
            >
              <Text style={styles.scannedCodeIcon}>⚡</Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.scannedCodeTitle}>Mã vừa quét (Nhấn để xem chi tiết):</Text>
                <Text style={styles.scannedCodeValue}>{scannedCode}</Text>
              </View>
              <Text style={{ color: '#854D0E', fontWeight: 'bold', fontSize: 16 }}>→</Text>
            </TouchableOpacity>
          )}

          {/* Thanh tìm kiếm */}
          <View style={styles.searchBar}>
            <Text style={{ fontSize: 15, marginRight: 8 }}>🔍</Text>
            <TextInput
              placeholder="Tìm kiếm sản phẩm công nghệ, AI..."
              placeholderTextColor="#9CA3AF"
              value={searchQuery}
              onChangeText={setSearchQuery}
              style={styles.searchInput}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <Text style={{ color: '#9CA3AF', fontWeight: 'bold' }}>✕</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Danh sách sản phẩm FlashList với Pull-to-Refresh */}
        <View style={styles.listContainer}>
          {isLoading && products.length === 0 ? (
            <ActivityIndicator size="large" color={COLORS.primary} style={{ marginTop: 40 }} />
          ) : (
            <FlashList
              data={filteredProducts}
              numColumns={2}
              keyExtractor={(item) => item.id}
              estimatedItemSize={240}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.listContent}
              refreshing={isRefetching}
              onRefresh={() => refetch()}
              renderItem={({ item }: { item: Product }) => (
                <View style={{ flex: 1, padding: 4 }}>
                  <ProductCard
                    item={item}
                    onPress={() =>
                      navigation.navigate('ProductDetail', { product: item, productId: item.id })
                    }
                    onBuyNow={() =>
                      navigation.navigate('Checkout', { product: item, quantity: 1 })
                    }
                  />
                </View>
              )}
              ListEmptyComponent={
                <View style={styles.emptyContainer}>
                  <Text style={{ fontSize: 40, marginBottom: 10 }}>📦</Text>
                  <Text style={styles.emptyText}>Không tìm thấy sản phẩm nào phù hợp.</Text>
                </View>
              }
            />
          )}
        </View>

        {/* Nút Trợ lý AI nổi (Floating Chatbot Button 🤖) */}
        <TouchableOpacity
          style={styles.floatingAiBtn}
          onPress={() => navigation.navigate('AIChat')}
          activeOpacity={0.85}
        >
          <View style={styles.floatingAiIconBox}>
            <Text style={styles.floatingAiIcon}>🤖</Text>
          </View>
          <Text style={styles.floatingAiLabel}>Chat AI</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    position: 'relative',
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 10,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: COLORS.primary,
    letterSpacing: -0.5,
  },
  ordersHeaderBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#C7D2FE',
  },
  ordersHeaderBtnText: {
    color: '#4F46E5',
    fontSize: 13,
    fontWeight: '700',
  },
  toolBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  toolBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 36,
    borderRadius: 8,
    paddingHorizontal: 4,
    gap: 3,
  },
  toolIcon: {
    fontSize: 14,
  },
  aiBtn: {
    backgroundColor: '#EEF2FF',
    borderWidth: 1,
    borderColor: '#C7D2FE',
  },
  aiText: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.primary || '#4F46E5',
  },
  cartBtn: {
    backgroundColor: '#FEF3C7',
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  cartText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#B45309',
  },
  scannerBtn: {
    backgroundColor: '#F3E8FF',
    borderWidth: 1,
    borderColor: '#E9D5FF',
  },
  scannerText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#7E22CE',
  },
  logoutBtn: {
    backgroundColor: '#FEE2E2',
    borderWidth: 1,
    borderColor: '#FECACA',
    flex: 0.8,
  },
  logoutText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#DC2626',
  },
  topSection: {
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  dataSourceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 6,
    marginBottom: 2,
  },
  sourceBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  serverBadge: {
    backgroundColor: '#DCFCE7',
  },
  mockBadge: {
    backgroundColor: '#FEF3C7',
  },
  sourceBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#166534',
  },
  refreshButton: {
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  refreshButtonText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.primary,
  },
  scannedCodeBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF9C3',
    borderColor: '#FDE047',
    borderWidth: 1,
    padding: 10,
    borderRadius: 8,
    marginVertical: 8,
    gap: 8,
  },
  scannedCodeIcon: {
    fontSize: 20,
  },
  scannedCodeTitle: {
    fontSize: 11,
    color: '#854D0E',
    fontWeight: '600',
  },
  scannedCodeValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#713F12',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 38,
    marginTop: 6,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: '#1F2937',
    paddingVertical: 0,
  },
  listContainer: {
    flex: 1,
    paddingHorizontal: 8,
  },
  listContent: {
    paddingTop: 10,
    paddingBottom: 70, // Chừa khoảng trống cho nút nổi
  },
  emptyContainer: {
    paddingVertical: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    color: '#6B7280',
    fontSize: 14,
  },
  floatingAiBtn: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary || '#4F46E5',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 25,
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 8,
    gap: 8,
  },
  floatingAiIconBox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  floatingAiIcon: {
    fontSize: 14,
  },
  floatingAiLabel: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
});

export default HomeScreen;
