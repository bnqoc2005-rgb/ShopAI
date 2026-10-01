import React, { useCallback, useEffect, useRef, useState } from 'react';
import { AppState, Alert, Linking, StyleSheet, Text, View } from 'react-native';
import { Camera, useCameraDevice, useCodeScanner } from 'react-native-vision-camera';
import { useIsFocused } from '@react-navigation/native';
import ShopButton from '@components/ShopButton';
import { COLORS } from '@constants/theme';
import { hapticSuccess } from '@utils/haptics';
import { MOCK_PRODUCTS } from '../schemas/product';

type PermissionState = 'checking' | 'granted' | 'denied';

const ScannerScreen = ({ navigation }: any) => {
  const [permission, setPermission] = useState<PermissionState>('checking');
  const device = useCameraDevice('back');
  const isFocused = useIsFocused();

  // "CÁI KHÓA" chống quét lặp — dùng useRef vì đổi giá trị không cần re-render lại UI
  const isScanning = useRef(false);

  // Reset khóa quét mỗi khi màn hình được focus lại
  useEffect(() => {
    if (isFocused) {
      isScanning.current = false;
    }
  }, [isFocused]);

  // 1. Hàm xin/kiểm tra quyền — tách riêng để AppState gọi lại được
  const requestPermission = useCallback(async () => {
    const current = Camera.getCameraPermissionStatus();
    if (current === 'granted') {
      setPermission('granted');
      return;
    }

    const status = await Camera.requestCameraPermission();
    setPermission(status === 'granted' ? 'granted' : 'denied');
  }, []);

  // 2. Xin quyền ở Runtime khi màn hình vừa Mount
  useEffect(() => {
    requestPermission();
  }, [requestPermission]);

  // 3. Khi user rời app sang Settings bật quyền rồi quay lại -> dò lại quyền
  useEffect(() => {
    const sub = AppState.addEventListener('change', (nextState) => {
      if (nextState === 'active') requestPermission();
    });
    return () => sub.remove();
  }, [requestPermission]);

  // 4. Mở thẳng trang Cài đặt của chính app ShopAI trong Settings hệ thống
  const openAppSettings = () => {
    Alert.alert(
      'Cần quyền Camera',
      'Bạn đã từ chối quyền Camera nên ShopAI không thể quét mã vạch. Hãy vào Cài đặt > ShopAI và bật lại quyền Camera nhé.',
      [
        { text: 'Để sau', style: 'cancel' },
        { text: 'Mở Cài đặt', onPress: () => Linking.openSettings() },
      ],
    );
  };

  // 5. Hàm tìm kiếm sản phẩm và chuyển sang màn hình Chi tiết sản phẩm
  const handleCodeDetected = (value: string) => {
    if (isScanning.current) return;
    if (!value) return;

    isScanning.current = true;
    console.log('Phát hiện mã:', value);

    // 📳 Rung phản hồi thành công
    hapticSuccess();

    const cleanScanned = value.trim();
    const cleanNoSpecial = cleanScanned.toLowerCase().replace(/[^a-z0-9]/g, '');

    // Tìm kiếm trong danh mục sản phẩm (theo ID, Code, hoặc mã trong URL/chuỗi)
    const foundProduct = MOCK_PRODUCTS.find((p) => {
      const pId = p.id.toLowerCase().replace(/[^a-z0-9]/g, '');
      const pCode = p.code ? p.code.toLowerCase().replace(/[^a-z0-9]/g, '') : '';

      return (
        p.id === cleanScanned ||
        p.code === cleanScanned ||
        (cleanNoSpecial && (pId === cleanNoSpecial || pCode === cleanNoSpecial)) ||
        cleanScanned.includes(p.id) ||
        (p.code && cleanScanned.includes(p.code))
      );
    });

    if (foundProduct) {
      // ✅ Chuyển thẳng sang giao diện Chi tiết sản phẩm
      navigation.navigate('ProductDetail', {
        product: foundProduct,
        productId: foundProduct.id,
      });
    } else {
      Alert.alert(
        'Không tìm thấy sản phẩm',
        `Mã vừa quét: "${cleanScanned}" chưa có trong cơ sở dữ liệu.`,
        [
          {
            text: 'Quét lại',
            onPress: () => {
              isScanning.current = false;
            },
          },
          {
            text: 'Về trang chủ',
            onPress: () => {
              navigation.navigate('Home', { scannedCode: cleanScanned });
            },
            style: 'cancel',
          },
        ],
      );
    }
  };

  // 6. Logic Máy Quét (Vision Scanner JSI) — có khóa Debounce + rung phản hồi
  const codeScanner = useCodeScanner({
    codeTypes: ['qr', 'ean-13', 'code-128', 'code-39', 'upc-a', 'upc-e'],
    onCodeScanned: (codes) => {
      if (isScanning.current) return;
      if (codes.length === 0) return;

      const val = codes[0].value;
      if (!val) return;

      handleCodeDetected(val);
    },
  });

  // ---------- Các trạng thái giao diện ----------

  // A. Đang hỏi hệ điều hành
  if (permission === 'checking') {
    return (
      <View style={styles.center}>
        <Text style={styles.stateText}>Đang kiểm tra quyền Camera...</Text>
      </View>
    );
  }

  // B. Bị từ chối -> KHÔNG để user kẹt ở màn hình trắng, phải cho lối thoát rõ ràng
  if (permission === 'denied') {
    return (
      <View style={styles.center}>
        <Text style={styles.deniedTitle}>Chưa có quyền Camera</Text>
        <Text style={styles.deniedDesc}>
          ShopAI cần Camera để quét mã vạch sản phẩm. Ảnh chỉ được xử lý ngay trên máy
          của bạn và không bao giờ được gửi đi đâu cả.
        </Text>
        <ShopButton
          title="Mở Cài đặt"
          onPress={openAppSettings}
          style={{ width: 200, marginBottom: 12 }}
        />
        <ShopButton
          title="Quay lại"
          onPress={() => navigation.goBack()}
          style={{ width: 200, backgroundColor: COLORS.secondary }}
        />
      </View>
    );
  }

  // C. Có quyền nhưng máy không có ống kính sau (rất hiếm, nhưng Simulator hay dính)
  if (device == null) {
    return (
      <View style={styles.center}>
        <Text style={styles.stateText}>Thiết bị không có Camera sau!</Text>
        <Text style={styles.deniedDesc}>
          Bạn có đang chạy trên máy ảo (Simulator/Emulator) không? Camera bắt buộc phải
          chạy trên điện thoại thật.
        </Text>
        <ShopButton title="Quay lại" onPress={() => navigation.goBack()} style={{ width: 200 }} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Component C++ vẽ luồng Video 60FPS thẳng lên màn hình và giải mã barcode thời gian thực */}
      <Camera
        style={StyleSheet.absoluteFill}
        device={device}
        isActive={isFocused}
        codeScanner={codeScanner}
      />

      {/* Khung ngắm giúp user biết đưa mã vào đâu — thuần UI */}
      <View style={styles.frameWrapper} pointerEvents="none">
        <View style={styles.frame} />
      </View>

      <View style={styles.overlay}>
        <Text style={styles.instruction}>Đưa mã QR / mã vạch vào khung hình</Text>

        {/* Hỗ trợ mô phỏng quét thử nghiệm */}
        <View style={styles.mockActions}>
          <Text style={styles.mockHint}>Mô phỏng quét mã (nhấn để thử):</Text>
          <View style={styles.tagRow}>
            <Text style={styles.tag} onPress={() => handleCodeDetected('123456')}>
              📖 123456
            </Text>
            <Text style={styles.tag} onPress={() => handleCodeDetected('123-001')}>
              🎧 123-001
            </Text>
            <Text style={styles.tag} onPress={() => handleCodeDetected('123-003')}>
              ⌨️ 123-003
            </Text>
            <Text style={styles.tag} onPress={() => handleCodeDetected('123-006')}>
              ⌚ 123-006
            </Text>
          </View>
        </View>

        <ShopButton
          title="Hủy bỏ"
          onPress={() => navigation.goBack()}
          style={{ width: 150, backgroundColor: COLORS.error }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'black' },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: COLORS.background,
  },
  stateText: { fontSize: 16, marginBottom: 12, textAlign: 'center' },
  deniedTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 10, color: COLORS.error },
  deniedDesc: { fontSize: 14, textAlign: 'center', marginBottom: 24, lineHeight: 20 },
  frameWrapper: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  frame: {
    width: 250,
    height: 250,
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.8)',
    borderRadius: 16,
  },
  overlay: {
    position: 'absolute',
    bottom: 40,
    alignSelf: 'center',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 20,
  },
  instruction: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 16,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  mockActions: {
    alignItems: 'center',
    marginBottom: 16,
  },
  mockHint: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12,
    marginBottom: 8,
  },
  tagRow: {
    flexDirection: 'row',
    gap: 10,
  },
  tag: {
    backgroundColor: 'rgba(255,255,255,0.9)',
    color: '#111827',
    fontWeight: '700',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    fontSize: 13,
    overflow: 'hidden',
  },
});

export default ScannerScreen;
