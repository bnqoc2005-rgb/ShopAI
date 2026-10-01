import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { useAuthStore } from '../store/useAuthStore';

export function LoginScreen({ navigation, onLogin }: any) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const login = useAuthStore((state) => state.login);

  const handleLogin = () => {
    if (onLogin) {
      onLogin();
    } else {
      login(email || 'baongoc@gmail.com');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>ShopAI</Text>
        <Text style={styles.subtitle}>Vui lòng đăng nhập để tiếp tục</Text>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="you@example.com"
            placeholderTextColor="#A0AEC0"
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Mật khẩu</Text>
          <TextInput
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            placeholder="Ít nhất 6 ký tự"
            placeholderTextColor="#A0AEC0"
            secureTextEntry
          />
        </View>

        <TouchableOpacity style={styles.primaryBtn} onPress={handleLogin} activeOpacity={0.8}>
          <Text style={styles.primaryBtnText}>Đăng nhập ngay</Text>
        </TouchableOpacity>

        <View style={styles.footerRow}>
          <Text style={styles.footerText}>Chưa có tài khoản? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Register')}>
            <Text style={styles.linkText}>Đăng ký</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFAFA' },
  content: { flex: 1, paddingHorizontal: 24, justifyContent: 'center' },
  title: { fontSize: 30, fontWeight: 'bold', color: '#FF424E', textAlign: 'center', marginBottom: 6 },
  subtitle: { fontSize: 13, color: '#787878', textAlign: 'center', marginBottom: 28 },
  inputGroup: { marginBottom: 14 },
  label: { fontSize: 12, color: '#555', marginBottom: 6 },
  input: {
    backgroundColor: '#FFF',
    borderRadius: 10,
    paddingHorizontal: 14,
    height: 44,
    borderWidth: 1,
    borderColor: '#EAEAEA',
    fontSize: 14,
    color: '#333',
  },
  primaryBtn: {
    backgroundColor: '#FF424E',
    borderRadius: 10,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
    marginBottom: 16,
  },
  primaryBtnText: { color: '#FFF', fontWeight: 'bold', fontSize: 15 },
  footerRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  footerText: { color: '#787878', fontSize: 13 },
  linkText: { color: '#FF424E', fontWeight: 'bold', fontSize: 13 },
});

export default LoginScreen;
