import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';

export function RegisterScreen({ navigation }: any) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Tạo tài khoản</Text>
        <Text style={styles.subtitle}>Đăng ký để mua sắm trên ShopAI</Text>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Họ tên</Text>
          <TextInput style={styles.input} value={fullName} onChangeText={setFullName} placeholder="Cao Luu Bao Ngoc" />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Email</Text>
          <TextInput style={styles.input} value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" placeholder="baongoc@gmail.com" />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Mật khẩu</Text>
          <TextInput style={styles.input} value={password} onChangeText={setPassword} secureTextEntry placeholder="•••" />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Xác nhận mật khẩu</Text>
          <TextInput style={styles.input} value={confirmPassword} onChangeText={setConfirmPassword} secureTextEntry placeholder="•••" />
        </View>

        <TouchableOpacity style={styles.primaryBtn}>
          <Text style={styles.primaryBtnText}>Đăng ký ngay</Text>
        </TouchableOpacity>

        <View style={styles.footerRow}>
          <Text style={styles.footerText}>Đã có tài khoản? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.linkText}>Đăng nhập</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFAFA' },
  content: { flex: 1, paddingHorizontal: 24, justifyContent: 'center' },
  title: { fontSize: 26, fontWeight: 'bold', color: '#FF424E', textAlign: 'center', marginBottom: 6 },
  subtitle: { fontSize: 13, color: '#787878', textAlign: 'center', marginBottom: 24 },
  inputGroup: { marginBottom: 14 },
  label: { fontSize: 12, color: '#555', marginBottom: 6 },
  input: { backgroundColor: '#FFF', borderRadius: 10, paddingHorizontal: 14, height: 44, borderWidth: 1, borderColor: '#EAEAEA', fontSize: 14, color: '#333' },
  primaryBtn: { backgroundColor: '#FF424E', borderRadius: 10, height: 44, justifyContent: 'center', alignItems: 'center', marginTop: 12, marginBottom: 16 },
  primaryBtnText: { color: '#FFF', fontWeight: 'bold', fontSize: 15 },
  footerRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  footerText: { color: '#787878', fontSize: 13 },
  linkText: { color: '#FF424E', fontWeight: 'bold', fontSize: 13 },
});

export default RegisterScreen;
