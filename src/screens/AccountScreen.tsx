// src/screens/AccountScreen.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '../store/useAuthStore';

export function AccountScreen({ navigation }: any) {
  const { userInfo, logout } = useAuthStore();

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{userInfo?.name?.charAt(0) || 'U'}</Text>
        </View>
        <Text style={styles.userName}>{userInfo?.name || 'Người dùng'}</Text>
        <Text style={styles.userEmail}>{userInfo?.email}</Text>
      </View>

      <View style={styles.menuGroup}>
        <TouchableOpacity 
          style={styles.menuItem} 
          onPress={() => (navigation?.navigate ? navigation.navigate('HomeTab', { screen: 'Orders' }) : null)}
          activeOpacity={0.7}
        >
          <Text style={styles.menuText}>📦 Lịch sử đơn hàng</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.menuItem} 
          onPress={() => (navigation?.navigate ? navigation.navigate('ReduxDemo') : null)}
          activeOpacity={0.7}
        >
          <Text style={styles.menuText}>🧪 Redux Toolkit Demo (Đề cương)</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.logoutBtn} onPress={logout} activeOpacity={0.8}>
        <Text style={styles.logoutText}>Đăng xuất</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFAFA', padding: 16 },
  header: { alignItems: 'center', marginVertical: 20 },
  avatar: { width: 70, height: 70, borderRadius: 35, backgroundColor: '#FF424E', justifyContent: 'center', alignItems: 'center', marginBottom: 8 },
  avatarText: { color: '#FFF', fontSize: 28, fontWeight: 'bold' },
  userName: { fontSize: 18, fontWeight: 'bold', color: '#1A202C' },
  userEmail: { color: '#8E8E93', fontSize: 14 },
  menuGroup: { backgroundColor: '#FFF', borderRadius: 10, overflow: 'hidden', marginBottom: 20 },
  menuItem: { padding: 16, borderBottomWidth: 1, borderColor: '#F0F0F0' },
  menuText: { fontSize: 15, fontWeight: '500', color: '#333' },
  logoutBtn: { backgroundColor: '#FFF', padding: 14, borderRadius: 10, alignItems: 'center', borderWidth: 1, borderColor: '#FF424E' },
  logoutText: { color: '#FF424E', fontWeight: 'bold' },
});

export default AccountScreen;
