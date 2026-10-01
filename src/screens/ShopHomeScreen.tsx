import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  Image,
  Pressable,
  StyleSheet,
  StatusBar,
  Dimensions,
  Alert,
} from 'react-native';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 44) / 2;

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  originalPrice: number;
  rating: number;
  soldCount: number;
  aiMatch: number;
  image: string;
  isHot?: boolean;
}

const CATEGORIES = [
  { id: 'all', name: 'Tất cả', icon: '✨' },
  { id: 'smart_device', name: 'Thiết bị AI', icon: '🤖' },
  { id: 'audio', name: 'Âm thanh', icon: '🎧' },
  { id: 'wearable', name: 'Smartwatch', icon: '⌚' },
  { id: 'fashion', name: 'Thời trang Tech', icon: '🕶️' },
  { id: 'smarthome', name: 'Nhà thông minh', icon: '🏠' },
];

const PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Kính thực tế AI Vision Pro Gen 2',
    category: 'smart_device',
    price: 4990000,
    originalPrice: 6500000,
    rating: 4.9,
    soldCount: 1240,
    aiMatch: 99,
    image: 'https://images.unsplash.com/photo-1593508512255-86ab42a8e620?w=600&auto=format&fit=crop&q=80',
    isHot: true,
  },
  {
    id: '2',
    name: 'Tai nghe Chống ồn AI NoiseCancel Max',
    category: 'audio',
    price: 2490000,
    originalPrice: 3200000,
    rating: 4.8,
    soldCount: 3820,
    aiMatch: 96,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80',
    isHot: true,
  },
  {
    id: '3',
    name: 'Đồng hồ AI Health Watch Series X',
    category: 'wearable',
    price: 3890000,
    originalPrice: 4500000,
    rating: 4.9,
    soldCount: 950,
    aiMatch: 95,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: '4',
    name: 'Loa thông minh Trợ lý ảo AI Assistant',
    category: 'smarthome',
    price: 1590000,
    originalPrice: 1990000,
    rating: 4.7,
    soldCount: 2100,
    aiMatch: 92,
    image: 'https://images.unsplash.com/photo-1543512214-318c7553f230?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: '5',
    name: 'Mắt kính thông minh Smart Audio Lens',
    category: 'fashion',
    price: 1890000,
    originalPrice: 2400000,
    rating: 4.6,
    soldCount: 630,
    aiMatch: 88,
    image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: '6',
    name: 'Đèn bàn học AI Tự điều chỉnh ánh sáng',
    category: 'smarthome',
    price: 890000,
    originalPrice: 1200000,
    rating: 4.8,
    soldCount: 1580,
    aiMatch: 94,
    image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600&auto=format&fit=crop&q=80',
  },
];

export default function ShopHomeScreen() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [cartCount, setCartCount] = useState(0);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState('home');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2000);
  };

  const handleAddToCart = (product: Product) => {
    setCartCount((prev) => prev + 1);
    showToast(`🛒 Đã thêm "${product.name.slice(0, 20)}..." vào giỏ`);
  };

  const toggleFavorite = (productId: string) => {
    if (favorites.includes(productId)) {
      setFavorites(favorites.filter((id) => id !== productId));
      showToast('Đã xóa khỏi danh sách yêu thích');
    } else {
      setFavorites([...favorites, productId]);
      showToast('❤️ Đã thêm vào mục Yêu thích');
    }
  };

  const filteredProducts = PRODUCTS.filter((item) => {
    const matchCategory =
      selectedCategory === 'all' || item.category === selectedCategory;
    const matchSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchSearch;
  });

  const formatPrice = (num: number) => {
    return num.toLocaleString('vi-VN') + ' đ';
  };

  return (
    <View style={styles.screen}>
      <StatusBar barStyle="light-content" />

      {/* Top Header */}
      <View style={styles.header}>
        <View style={styles.topRow}>
          <View>
            <View style={styles.brandRow}>
              <Text style={styles.brandText}>ShopAI</Text>
              <View style={styles.aiBadge}>
                <Text style={styles.aiBadgeText}>PRO 4.0</Text>
              </View>
            </View>
            <Text style={styles.greetingText}>Khám phá công nghệ tương lai ✨</Text>
          </View>

          <View style={styles.headerRightActions}>
            <Pressable
              style={styles.iconButton}
              onPress={() => Alert.alert('Thông báo', 'Bạn có 2 gợi ý AI mới cho ngày hôm nay!')}
            >
              <Text style={styles.actionIcon}>🔔</Text>
              <View style={styles.notifDot} />
            </Pressable>

            <Pressable
              style={[styles.iconButton, styles.cartButton]}
              onPress={() => Alert.alert('Giỏ hàng', `Hiện có ${cartCount} sản phẩm trong giỏ hàng`)}
            >
              <Text style={styles.actionIcon}>🛒</Text>
              {cartCount > 0 && (
                <View style={styles.cartBadge}>
                  <Text style={styles.cartBadgeText}>{cartCount}</Text>
                </View>
              )}
            </Pressable>
          </View>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Tìm kiếm bằng AI (vd: kính, tai nghe...)"
            placeholderTextColor="#94A3B8"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <Pressable onPress={() => setSearchQuery('')}>
              <Text style={styles.clearSearch}>✕</Text>
            </Pressable>
          )}
          <Pressable
            style={styles.aiSearchFilter}
            onPress={() => Alert.alert('AI Assistant', 'AI Đang tối ưu hóa bộ lọc tìm kiếm cho bạn!')}
          >
            <Text style={styles.aiFilterText}>✨ Lọc AI</Text>
          </Pressable>
        </View>
      </View>

      {/* Content ScrollView */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* AI Banner */}
        <View style={styles.aiBanner}>
          <View style={styles.aiBannerContent}>
            <View style={styles.aiBannerTag}>
              <Text style={styles.aiBannerTagText}>💡 AI GỢI Ý RIÊNG BẠN</Text>
            </View>
            <Text style={styles.aiBannerTitle}>Smart Lifestyle 2026</Text>
            <Text style={styles.aiBannerDesc}>
              AI đã phân tích phong cách sống và tìm ra 6 sản phẩm tương thích 98% với bạn.
            </Text>
            <Pressable
              style={styles.aiBannerBtn}
              onPress={() => Alert.alert('AI Assistant', 'Đang cập nhật phân tích AI thời gian thực!')}
            >
              <Text style={styles.aiBannerBtnText}>Khám phá ngay ➔</Text>
            </Pressable>
          </View>
          <View style={styles.aiBannerDecor}>
            <Text style={styles.aiBannerEmoji}>⚡</Text>
          </View>
        </View>

        {/* Categories Carousel */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Danh mục nổi bật</Text>
          <Text style={styles.sectionMore}>Xem tất cả</Text>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryList}
        >
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <Pressable
                key={cat.id}
                style={[
                  styles.categoryChip,
                  isSelected && styles.categoryChipSelected,
                ]}
                onPress={() => setSelectedCategory(cat.id)}
              >
                <Text style={styles.categoryIcon}>{cat.icon}</Text>
                <Text
                  style={[
                    styles.categoryName,
                    isSelected && styles.categoryNameSelected,
                  ]}
                >
                  {cat.name}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>

        {/* Flash Sale / AI Recommendation Section */}
        <View style={styles.flashSection}>
          <View style={styles.flashHeader}>
            <View style={styles.flashTitleGroup}>
              <Text style={styles.flashIcon}>🔥</Text>
              <Text style={styles.flashTitle}>AI Hot Deals</Text>
            </View>
            <View style={styles.timerBadge}>
              <Text style={styles.timerText}>⏳ 02 : 45 : 18</Text>
            </View>
          </View>
        </View>

        {/* Products Grid */}
        <View style={styles.productsGrid}>
          {filteredProducts.map((product) => {
            const isFav = favorites.includes(product.id);
            const discountPercent = Math.round(
              ((product.originalPrice - product.price) / product.originalPrice) * 100,
            );

            return (
              <View key={product.id} style={styles.productCard}>
                {/* Product Image */}
                <View style={styles.imageWrapper}>
                  <Image
                    source={{ uri: product.image }}
                    style={styles.productImage}
                    resizeMode="cover"
                  />
                  {/* AI Match Badge */}
                  <View style={styles.aiMatchBadge}>
                    <Text style={styles.aiMatchText}>⚡ {product.aiMatch}% Match</Text>
                  </View>

                  {/* Discount Badge */}
                  <View style={styles.discountBadge}>
                    <Text style={styles.discountText}>-{discountPercent}%</Text>
                  </View>

                  {/* Favorite Button */}
                  <Pressable
                    style={styles.favButton}
                    onPress={() => toggleFavorite(product.id)}
                  >
                    <Text style={styles.favIcon}>{isFav ? '❤️' : '🤍'}</Text>
                  </Pressable>
                </View>

                {/* Details */}
                <View style={styles.cardDetails}>
                  <Text style={styles.productName} numberOfLines={2}>
                    {product.name}
                  </Text>

                  <View style={styles.ratingRow}>
                    <Text style={styles.ratingStar}>⭐ {product.rating}</Text>
                    <Text style={styles.soldText}>• Đã bán {product.soldCount}</Text>
                  </View>

                  <View style={styles.priceRow}>
                    <Text style={styles.currentPrice}>{formatPrice(product.price)}</Text>
                    <Text style={styles.originalPrice}>
                      {formatPrice(product.originalPrice)}
                    </Text>
                  </View>

                  {/* Add to Cart Button */}
                  <Pressable
                    style={styles.addCartBtn}
                    onPress={() => handleAddToCart(product)}
                  >
                    <Text style={styles.addCartText}>+ Thêm vào giỏ</Text>
                  </Pressable>
                </View>
              </View>
            );
          })}
        </View>

        {filteredProducts.length === 0 && (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyEmoji}>🔎</Text>
            <Text style={styles.emptyTitle}>Không tìm thấy sản phẩm</Text>
            <Text style={styles.emptySubtitle}>
              Thử từ khóa khác hoặc chọn danh mục "Tất cả"
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Toast Notification */}
      {toastMessage && (
        <View style={styles.toastContainer}>
          <Text style={styles.toastText}>{toastMessage}</Text>
        </View>
      )}

      {/* Bottom Navigation Bar */}
      <View style={styles.bottomNav}>
        <Pressable
          style={styles.navItem}
          onPress={() => setActiveTab('home')}
        >
          <Text style={styles.navIcon}>{activeTab === 'home' ? '🏠' : '🛖'}</Text>
          <Text style={[styles.navLabel, activeTab === 'home' && styles.navLabelActive]}>
            Trang chủ
          </Text>
        </Pressable>

        <Pressable
          style={styles.navItem}
          onPress={() => setActiveTab('ai')}
        >
          <View style={styles.aiNavCircle}>
            <Text style={styles.aiNavCircleIcon}>✨</Text>
          </View>
          <Text style={[styles.navLabel, activeTab === 'ai' && styles.navLabelActive]}>
            AI Stylist
          </Text>
        </Pressable>

        <Pressable
          style={styles.navItem}
          onPress={() => setActiveTab('cart')}
        >
          <View>
            <Text style={styles.navIcon}>🛍️</Text>
            {cartCount > 0 && (
              <View style={styles.navCartBadge}>
                <Text style={styles.navCartBadgeText}>{cartCount}</Text>
              </View>
            )}
          </View>
          <Text style={[styles.navLabel, activeTab === 'cart' && styles.navLabelActive]}>
            Giỏ hàng
          </Text>
        </Pressable>

        <Pressable
          style={styles.navItem}
          onPress={() => setActiveTab('profile')}
        >
          <Text style={styles.navIcon}>{activeTab === 'profile' ? '👤' : '👥'}</Text>
          <Text style={[styles.navLabel, activeTab === 'profile' && styles.navLabelActive]}>
            Tài khoản
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F1F5F9',
  },
  header: {
    backgroundColor: '#4338CA',
    paddingTop: 12,
    paddingBottom: 18,
    paddingHorizontal: 16,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    elevation: 8,
    shadowColor: '#4338CA',
    shadowOpacity: 0.3,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  brandText: {
    fontSize: 24,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  aiBadge: {
    backgroundColor: '#818CF8',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  aiBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  greetingText: {
    fontSize: 12,
    color: '#C7D2FE',
    marginTop: 2,
  },
  headerRightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  cartButton: {
    backgroundColor: '#F59E0B',
  },
  actionIcon: {
    fontSize: 18,
  },
  notifDot: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#EF4444',
  },
  cartBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#EF4444',
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  cartBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingHorizontal: 12,
    height: 46,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: '100%',
    fontSize: 14,
    color: '#1E293B',
  },
  clearSearch: {
    paddingHorizontal: 8,
    color: '#94A3B8',
    fontSize: 14,
    fontWeight: '700',
  },
  aiSearchFilter: {
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#C7D2FE',
  },
  aiFilterText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#4F46E5',
  },
  scrollContent: {
    paddingBottom: 100,
  },
  aiBanner: {
    margin: 16,
    borderRadius: 18,
    backgroundColor: '#1E1B4B',
    padding: 18,
    flexDirection: 'row',
    overflow: 'hidden',
    position: 'relative',
    elevation: 4,
  },
  aiBannerContent: {
    flex: 1,
    zIndex: 2,
  },
  aiBannerTag: {
    backgroundColor: '#4338CA',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginBottom: 8,
  },
  aiBannerTagText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#A5B4FC',
  },
  aiBannerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 6,
  },
  aiBannerDesc: {
    fontSize: 12,
    color: '#CBD5E1',
    lineHeight: 18,
    marginBottom: 14,
  },
  aiBannerBtn: {
    backgroundColor: '#6366F1',
    alignSelf: 'flex-start',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
  },
  aiBannerBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  aiBannerDecor: {
    position: 'absolute',
    right: -10,
    bottom: -15,
    opacity: 0.25,
  },
  aiBannerEmoji: {
    fontSize: 90,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 10,
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },
  sectionMore: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4F46E5',
  },
  categoryList: {
    paddingHorizontal: 16,
    gap: 8,
    paddingBottom: 8,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    gap: 6,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    elevation: 1,
  },
  categoryChipSelected: {
    backgroundColor: '#4F46E5',
    borderColor: '#4F46E5',
  },
  categoryIcon: {
    fontSize: 15,
  },
  categoryName: {
    fontSize: 13,
    fontWeight: '600',
    color: '#475569',
  },
  categoryNameSelected: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  flashSection: {
    paddingHorizontal: 16,
    marginTop: 14,
    marginBottom: 10,
  },
  flashHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FEF2F2',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FEE2E2',
  },
  flashTitleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  flashIcon: {
    fontSize: 18,
  },
  flashTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#DC2626',
  },
  timerBadge: {
    backgroundColor: '#DC2626',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  timerText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  productsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    justifyContent: 'space-between',
    gap: 12,
  },
  productCard: {
    width: CARD_WIDTH,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  imageWrapper: {
    width: '100%',
    height: 150,
    backgroundColor: '#CBD5E1',
    position: 'relative',
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
  aiMatchBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: 'rgba(15, 23, 42, 0.85)',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 6,
  },
  aiMatchText: {
    color: '#38BDF8',
    fontSize: 10,
    fontWeight: '800',
  },
  discountBadge: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    backgroundColor: '#DC2626',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  discountText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
  },
  favButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  favIcon: {
    fontSize: 13,
  },
  cardDetails: {
    padding: 10,
  },
  productName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1E293B',
    lineHeight: 18,
    minHeight: 36,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    gap: 4,
  },
  ratingStar: {
    fontSize: 11,
    fontWeight: '700',
    color: '#D97706',
  },
  soldText: {
    fontSize: 10,
    color: '#94A3B8',
  },
  priceRow: {
    marginTop: 6,
    marginBottom: 8,
  },
  currentPrice: {
    fontSize: 14,
    fontWeight: '800',
    color: '#4F46E5',
  },
  originalPrice: {
    fontSize: 10,
    color: '#94A3B8',
    textDecorationLine: 'line-through',
  },
  addCartBtn: {
    backgroundColor: '#EEF2FF',
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#C7D2FE',
  },
  addCartText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#4338CA',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyEmoji: {
    fontSize: 40,
    marginBottom: 8,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#334155',
  },
  emptySubtitle: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 4,
  },
  toastContainer: {
    position: 'absolute',
    bottom: 80,
    alignSelf: 'center',
    backgroundColor: '#0F172A',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    elevation: 10,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  toastText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    elevation: 12,
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 60,
  },
  navIcon: {
    fontSize: 20,
  },
  navLabel: {
    fontSize: 10,
    color: '#94A3B8',
    fontWeight: '600',
    marginTop: 2,
  },
  navLabelActive: {
    color: '#4F46E5',
    fontWeight: '800',
  },
  aiNavCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#4F46E5',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -14,
    elevation: 4,
    shadowColor: '#4F46E5',
    shadowOpacity: 0.4,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
  aiNavCircleIcon: {
    fontSize: 18,
    color: '#FFFFFF',
  },
  navCartBadge: {
    position: 'absolute',
    top: -4,
    right: -10,
    backgroundColor: '#EF4444',
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 3,
  },
  navCartBadgeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '800',
  },
});
