import React from 'react';
import { View, Image, Text, StyleSheet } from 'react-native';

function ImageDemo() {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>1) Ảnh từ mạng (URI)</Text>
      {/* BẮT BUỘC có width + height (hoặc flex) — nếu không, ảnh mạng thường không hiện */}
      <Image
        source={{ uri: 'https://picsum.photos/id/1/400/300' }}
        style={styles.remote}
        resizeMode="cover"
        onError={() => console.log('Tải ảnh lỗi — kiểm tra mạng / URL')}
      />

      <Text style={styles.label}>2) Ảnh local (require)</Text>
      <Image source={require('../../assets/logo.png')} style={styles.local} />
      <Text style={styles.hint}>Đã có file logo.png tại src/assets/logo.png</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  label: { marginTop: 16, marginBottom: 8, fontWeight: '600' },
  remote: { width: '100%', height: 200, borderRadius: 12, backgroundColor: '#EEE' },
  local: { width: 80, height: 80 },
  hint: { color: '#95A5A6', fontSize: 12 },
});

export default ImageDemo;
