import React from "react";
import { View, Text, StyleSheet, Button } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import crashlytics from '@react-native-firebase/crashlytics';
import { COLORS, SIZES } from "@constants/theme";

export const ProfileScreen = ({ onLogout }: { onLogout?: () => void }) => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.emoji}>👤</Text>
        <Text style={styles.title}>Hồ sơ của tôi</Text>
        <Text style={styles.subtitle}>Bài tập Drawer Navigator — Phần 5.5</Text>

        <View style={{ marginTop: 24, width: '80%' }}>
          <Button
            title="Test Crashlytics"
            color="#DC2626"
            onPress={() => {
              // Ghi vết hành vi trước khi crash
              crashlytics().log('User bấm nút Test Crash');

              // Cố ý gây ra lỗi để làm sập app
              crashlytics().crash();
            }}
          />
        </View>

        {onLogout && (
          <View style={{ marginTop: 16 }}>
            <Button title="Đăng Xuất" color="red" onPress={onLogout} />
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.background },
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  emoji: { fontSize: 48, marginBottom: 12 },
  title: { fontSize: SIZES.h2, fontWeight: "bold", color: COLORS.text },
  subtitle: { fontSize: SIZES.body2, color: COLORS.textLight, marginTop: 4 },
});

export default ProfileScreen;
