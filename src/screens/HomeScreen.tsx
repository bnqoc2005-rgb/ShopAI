// src/screens/HomeScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FlashList } from '@shopify/flash-list';
import ProductCard from '../components/ProductCard';
import LocationBadge from '@components/LocationBadge';
import { COLORS } from '../constants/theme';
import { useCartStore } from '../store/useCartStore';
import { MOCK_PRODUCTS, Product } from '../schemas/product';

interface HomeScreenProps {
  navigation: any;
  route: any;
  onLogout?: () => void;
}

export function HomeScreen({ navigation, route, onLogout }: HomeScreenProps) {
  // Lấy dữ liệu mã vạch trả về từ màn hình Scanner (nếu có)
  const scannedCode = route.params?.scannedCode;

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const cart = useCartStore((state) => state.cart);
  const totalQuantity = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);

  // Lọc sản phẩm theo tìm kiếm và danh mục
  const filteredProducts = MOCK_PRODUCTS.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === 'all' || product.category.toLowerCase().includes(selectedCategory.toLowerCase());
    return matchesSearch && matchesCategory;
  });

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.container}>
        {/* Header Bar */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>ShopAI</Text>

          {/* 3 Thanh công cụ cùng chung 1 giao diện gọn gàng, chia đều tỉ lệ */}
          <View style={styles.toolBar}>
            <TouchableOpacity
              style={[styles.toolBtn, styles.cartBtn]}
              onPress={() => navigation.navigate('CartTab')}
              activeOpacity={0.8}
            >
              <Text style={styles.toolIcon}>🛒</Text>
              <Text style={styles.cartText} numberOfLines={1}>
                Giỏ hàng ({totalQuantity})
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.toolBtn, styles.scannerBtn]}
              onPress={() => navigation.navigate('Scanner')}
              activeOpacity={0.8}
            >
              <Text style={styles.toolIcon}>📷</Text>
              <Text style={styles.scannerText} numberOfLines={1}>
                Quét Mã
              </Text>
            </TouchableOpacity>

            {onLogout && (
              <TouchableOpacity
                style={[styles.toolBtn, styles.logoutBtn]}
                onPress={onLogout}
                activeOpacity={0.8}
              >
                <Text style={styles.toolIcon}>🚪</Text>
                <Text style={styles.logoutText} numberOfLines={1}>
                  Thoát
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Thẻ vị trí & Kết quả quét mã */}
        <View style={styles.topSection}>
          <LocationBadge />

          {/* Báo cáo nếu quét thành công */}
          {scannedCode && (
            <TouchableOpacity
              style={styles.scannedCodeBanner}
              activeOpacity={0.8}
              onPress={() => {
                const found = MOCK_PRODUCTS.find(
                  (p) =>
                    p.code === scannedCode ||
                    p.id === scannedCode ||
                    (p.code && p.code.replace(/[^a-zA-Z0-9]/g, '') === scannedCode.replace(/[^a-zA-Z0-9]/g, ''))
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

        {/* Danh sách sản phẩm FlashList */}
        <View style={styles.listContainer}>
          <FlashList
            data={filteredProducts}
            numColumns={2}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
            renderItem={({ item }: { item: Product }) => (
              <View style={{ flex: 1, padding: 4 }}>
                <ProductCard
                  item={item}
                  onPress={() =>
                    navigation.navigate('ProductDetail', { product: item, productId: item.id })
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
        </View>
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
    marginBottom: 8,
  },
  toolBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  toolBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 36,
    borderRadius: 8,
    paddingHorizontal: 6,
    gap: 4,
  },
  toolIcon: {
    fontSize: 14,
  },
  cartBtn: {
    backgroundColor: '#FEF3C7',
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  cartText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#B45309',
  },
  scannerBtn: {
    backgroundColor: '#EEF2FF',
    borderWidth: 1,
    borderColor: '#C7D2FE',
  },
  scannerText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#4338CA',
  },
  logoutBtn: {
    backgroundColor: '#FEE2E2',
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  logoutText: {
    fontSize: 12,
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
    paddingBottom: 20,
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
});

export default HomeScreen;
