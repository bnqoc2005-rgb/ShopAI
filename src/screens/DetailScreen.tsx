// src/screens/DetailScreen.tsx
import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, SafeAreaView, Alert } from 'react-native';
import { useCart } from '../context/CartContext';

export function DetailScreen({ route, navigation }: any) {
  const { addToCart } = useCart();

  const { product } = route.params || {
    product: {
      id: 'prod_1',
      name: 'Tai nghe Bluetooth Pro 1',
      price: '1.500.000 VNĐ',
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=80',
    },
  };

  const handleAddToCart = () => {
    addToCart(product);
    Alert.alert('Thành công', 'Đã thêm sản phẩm vào giỏ hàng! 🛒');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Chi tiết sản phẩm</Text>
      </View>

      <View style={styles.content}>
        <Image source={{ uri: product.image }} style={styles.productImg} resizeMode="cover" />
        <Text style={styles.title}>{product.name}</Text>
        <Text style={styles.price}>{product.price}</Text>
        <Text style={styles.sku}>Mã sản phẩm: {product.id}</Text>

        <TouchableOpacity style={styles.primaryBtn} onPress={handleAddToCart} activeOpacity={0.8}>
          <Text style={styles.primaryBtnText}>Thêm vào giỏ hàng</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFAFA' },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, height: 48 },
  backBtn: { paddingRight: 12 },
  backText: { fontSize: 22, color: '#000' },
  headerTitle: { fontSize: 16, fontWeight: 'bold', color: '#1A202C' },
  content: { padding: 16 },
  productImg: { width: '100%', height: 220, borderRadius: 12, marginBottom: 16 },
  title: { fontSize: 16, fontWeight: 'bold', color: '#1A202C', marginBottom: 6 },
  price: { fontSize: 18, color: '#FF424E', fontWeight: 'bold', marginBottom: 4 },
  sku: { fontSize: 12, color: '#8E8E93', marginBottom: 20 },
  primaryBtn: { backgroundColor: '#FF424E', borderRadius: 10, height: 44, justifyContent: 'center', alignItems: 'center' },
  primaryBtnText: { color: '#FFF', fontWeight: 'bold', fontSize: 15 },
});

export default DetailScreen;
