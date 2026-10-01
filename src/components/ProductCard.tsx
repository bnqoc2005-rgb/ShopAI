// src/components/ProductCard.tsx
import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useCartStore } from '../store/useCartStore';
import { ProductSchema, Product } from '../schemas/product';

export function ProductCard({ item, onPress }: { item: Product; onPress?: () => void }) {
  const addToCart = useCartStore((state) => state.addToCart);

  // Trạm kiểm soát Zod dữ liệu
  const validation = ProductSchema.safeParse(item);
  if (!validation.success) {
    return null;
  }

  const displayPrice =
    typeof item.price === 'number'
      ? `${item.price.toLocaleString('vi-VN')} VNĐ`
      : item.price;

  const productCode = item.code || `123-${item.id}`;

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.9}>
      <View style={styles.imageWrapper}>
        <Image source={{ uri: item.image }} style={styles.cardImage} resizeMode="cover" />
        <View style={styles.codeBadge}>
          <Text style={styles.codeBadgeText}>Mã: {productCode}</Text>
        </View>
      </View>
      <Text style={styles.cardTitle} numberOfLines={1}>
        {item.name}
      </Text>
      <Text style={styles.cardCategory}>{item.category}</Text>
      <Text style={styles.cardPrice}>{displayPrice}</Text>
      <TouchableOpacity style={styles.buyBtn} onPress={() => addToCart(item)} activeOpacity={0.8}>
        <Text style={styles.buyBtnText}>Mua ngay</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  imageWrapper: {
    position: 'relative',
    width: '100%',
    aspectRatio: 1,
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 8,
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
  codeBadge: {
    position: 'absolute',
    top: 6,
    left: 6,
    backgroundColor: 'rgba(17, 24, 39, 0.85)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  codeBadgeText: {
    color: '#F9FAFB',
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  cardTitle: {
    fontSize: 12,
    color: '#333',
    fontWeight: '600',
    marginBottom: 4,
  },
  cardCategory: {
    fontSize: 10,
    color: '#8E8E93',
    marginBottom: 6,
  },
  cardPrice: {
    fontSize: 12,
    color: '#FF424E',
    fontWeight: 'bold',
    marginBottom: 8,
  },
  buyBtn: {
    backgroundColor: '#FF424E',
    borderRadius: 8,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buyBtnText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default ProductCard;
