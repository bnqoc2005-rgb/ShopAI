import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, ActivityIndicator } from 'react-native';
import axiosClient from '@api/axiosClient';
import { useAuthStore } from '../store/useAuthStore';
import { COLORS, SIZES } from '../constants/theme';

export function LoginScreen({ navigation }: any) {
  const [email, setEmail] = useState('demo@shopai.com');
  const [password, setPassword] = useState('123456');
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [clientError, setClientError] = useState<string | null>(null);

  const login = useAuthStore((state) => state.login);

  const validate = () => {
    if (!email || !email.includes('@')) {
      setClientError('Email không đúng định dạng');
      return false;
    }
    if (!password || password.length < 6) {
      setClientError('Mật khẩu phải từ 6 ký tự');
      return false;
    }
    setClientError(null);
    return true;
  };

  const handleLogin = async () => {
    if (!validate()) return; // Validate phía Client: chặn sớm trước khi tốn 1 request
    setLoading(true);
    setServerError(null);

    try {
      const response = await axiosClient.post('/api/auth/login', { email, password });
      const token = response.data.access_token || response.data.accessToken;
      login(token, response.data.user);
    } catch (error: any) {
      // 401 từ AuthService: "Email hoặc mật khẩu không đúng"
      setServerError(error?.response?.data?.message ?? 'Đăng nhập thất bại, vui lòng thử lại');
    } finally {
      setLoading(false);
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
            onChangeText={(text) => {
              setEmail(text);
              setClientError(null);
            }}
            placeholder="demo@shopai.com"
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
            onChangeText={(text) => {
              setPassword(text);
              setClientError(null);
            }}
            placeholder="Mật khẩu từ 6 ký tự"
            placeholderTextColor="#A0AEC0"
            secureTextEntry
          />
        </View>

        {clientError && <Text style={styles.errorText}>⚠️ {clientError}</Text>}
        {serverError && <Text style={styles.errorText}>⚠️ {serverError}</Text>}

        <TouchableOpacity
          style={[styles.primaryBtn, loading && { opacity: 0.7 }]}
          onPress={handleLogin}
          disabled={loading}
          activeOpacity={0.8}
        >
          {loading ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <Text style={styles.primaryBtnText}>Đăng nhập ngay</Text>
          )}
        </TouchableOpacity>

        <View style={styles.footerRow}>
          <Text style={styles.footerText}>Chưa có tài khoản? </Text>
          <TouchableOpacity onPress={() => navigation?.navigate('Register')}>
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
  title: { fontSize: 30, fontWeight: 'bold', color: COLORS.primary || '#FF424E', textAlign: 'center', marginBottom: 6 },
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
  errorText: {
    color: COLORS.danger || '#EF4444',
    fontSize: SIZES.body2 || 13,
    textAlign: 'center',
    marginBottom: 10,
  },
  primaryBtn: {
    backgroundColor: COLORS.primary || '#FF424E',
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
  linkText: { color: COLORS.primary || '#FF424E', fontWeight: 'bold', fontSize: 13 },
});

export default LoginScreen;
