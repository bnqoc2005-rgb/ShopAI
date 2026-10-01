// src/screens/ProductDetailScreen.tsx
import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useCartStore } from '../store/useCartStore';
import { MOCK_PRODUCTS } from '../schemas/product';

export function ProductDetailScreen({ route, navigation }: any) {
  const productId = route?.params?.productId;
  const productParam = route?.params?.product;
  const product =
    productParam ||
    (productId
      ? MOCK_PRODUCTS.find(
          (p) =>
            p.id === productId ||
            p.code === productId ||
            (p.code && p.code.replace(/[^a-zA-Z0-9]/g, '') === String(productId).replace(/[^a-zA-Z0-9]/g, ''))
        )
      : null) ||
    MOCK_PRODUCTS[0];
  const [quantity, setQuantity] = useState(1);
  const addToCart = useCartStore((state) => state.addToCart);

  const handleAddToCart = () => {
    addToCart({ ...product, quantity });
    Alert.alert('Thành công', `Đã thêm ${quantity} sản phẩm vào giỏ hàng!`);
  };

  const handleBuyNow = () => {
    addToCart({ ...product, quantity });
    if (navigation?.navigate) {
      navigation.navigate('CheckoutModal', { product, quantity });
    }
  };

  const displayPrice =
    typeof product.price === 'number'
      ? `${product.price.toLocaleString('vi-VN')} đ`
      : product.price;

  const productCode = product.code || `123-${product.id}`;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FFF' }} edges={['top', 'left', 'right']}>
      {/* Header quay lại */}
      <View style={styles.headerBar}>
        <TouchableOpacity onPress={() => navigation?.goBack()} style={styles.backBtn} activeOpacity={0.7}>
          <Text style={styles.backBtnText}>← Quay lại</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>{product.name}</Text>
        <View style={{ width: 60 }} />
      </View>

      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <Image source={{ uri: product.image }} style={styles.detailImage} resizeMode="cover" />
        
        {/* Mã sản phẩm */}
        <View style={styles.codeTag}>
          <Text style={styles.codeTagText}>Mã SP: {productCode}</Text>
        </View>

        <Text style={styles.title}>{product.name}</Text>
        <Text style={styles.price}>{displayPrice}</Text>
        
        {/* Bộ chọn số lượng */}
        <View style={styles.quantityRow}>
          <Text style={styles.label}>Số lượng:</Text>
          <View style={styles.counter}>
            <TouchableOpacity onPress={() => setQuantity(Math.max(1, quantity - 1))} style={styles.countBtn}>
              <Text style={styles.countText}>-</Text>
            </TouchableOpacity>
            <Text style={styles.quantityVal}>{quantity}</Text>
            <TouchableOpacity onPress={() => setQuantity(quantity + 1)} style={styles.countBtn}>
              <Text style={styles.countText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>

        <Text style={styles.sectionHeader}>Mô tả sản phẩm</Text>
        <Text style={styles.description}>{product.description || 'Chưa có thông tin mô tả chi tiết.'}</Text>
      </ScrollView>

      {/* Thanh tác vụ dưới cùng */}
      <View style={styles.bottomBar}>
        <TouchableOpacity 
          style={styles.addCartBtn} 
          onPress={handleAddToCart}
          activeOpacity={0.8}
        >
          <Text style={styles.addCartText}>Thêm vào giỏ</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.buyNowBtn} onPress={handleBuyNow} activeOpacity={0.8}>
          <Text style={styles.buyNowText}>⚡ Mua ngay</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  headerBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, height: 48, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  backBtn: { paddingVertical: 6, paddingRight: 10 },
  backBtnText: { color: '#4F46E5', fontWeight: 'bold', fontSize: 15 },
  headerTitle: { fontSize: 16, fontWeight: 'bold', color: '#1E293B', maxWidth: 200 },
  detailImage: { width: '100%', height: 260, borderRadius: 12, marginBottom: 12 },
  codeTag: { alignSelf: 'flex-start', backgroundColor: '#EEF2FF', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, marginBottom: 8 },
  codeTagText: { color: '#4F46E5', fontSize: 12, fontWeight: '700' },
  title: { fontSize: 20, fontWeight: 'bold', color: '#0F172A' },
  price: { fontSize: 22, color: '#4F46E5', fontWeight: 'bold', marginVertical: 10 },
  quantityRow: { flexDirection: 'row', alignItems: 'center', marginVertical: 12 },
  label: { fontSize: 15, color: '#475569', marginRight: 16 },
  counter: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F1F5F9', borderRadius: 8 },
  countBtn: { width: 36, height: 36, justifyContent: 'center', alignItems: 'center' },
  countText: { fontSize: 18, fontWeight: 'bold', color: '#1E293B' },
  quantityVal: { paddingHorizontal: 12, fontSize: 16, fontWeight: '600', color: '#1E293B' },
  sectionHeader: { fontSize: 16, fontWeight: 'bold', marginTop: 16, marginBottom: 8, color: '#0F172A' },
  description: { color: '#64748B', lineHeight: 22 },
  bottomBar: { flexDirection: 'row', padding: 12, borderTopWidth: 1, borderColor: '#E2E8F0', backgroundColor: '#FFF' },
  addCartBtn: { flex: 1, borderWidth: 1.5, borderColor: '#4F46E5', borderRadius: 10, justifyContent: 'center', alignItems: 'center', height: 46, marginRight: 8 },
  addCartText: { color: '#4F46E5', fontWeight: 'bold' },
  buyNowBtn: { flex: 1, backgroundColor: '#4F46E5', borderRadius: 10, justifyContent: 'center', alignItems: 'center', height: 46 },
  buyNowText: { color: '#FFF', fontWeight: 'bold' },
});

export default ProductDetailScreen;
