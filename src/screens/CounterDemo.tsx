import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';

export default function CounterDemo() {
  const [countWrong, setCountWrong] = useState(0);
  const [countCorrect, setCountCorrect] = useState(0);

  // ❌ CÁCH SAI: Dùng trực tiếp giá trị biến count
  // Do closure trong JS, cả 3 lệnh setCount đều đọc cùng giá trị count tại thời điểm render
  const handlePressWrong = () => {
    setCountWrong(countWrong + 1); // 0 + 1
    setCountWrong(countWrong + 1); // 0 + 1
    setCountWrong(countWrong + 1); // 0 + 1 => Kết quả cuối chỉ tăng 1!
  };

  // ✅ CÁCH ĐÚNG: Dùng Updater Function (prev) => prev + 1
  // React sẽ xếp các updater vào hàng đợi (queue) và truyền state mới nhất vào prev
  const handlePressCorrect = () => {
    setCountCorrect((prev) => prev + 1); // prev là 0 => trả về 1
    setCountCorrect((prev) => prev + 1); // prev là 1 => trả về 2
    setCountCorrect((prev) => prev + 1); // prev là 2 => trả về 3 (Kết quả = +3!)
  };

  const handleReset = () => {
    setCountWrong(0);
    setCountCorrect(0);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>React State Updater Function Demo</Text>
      <Text style={styles.subTitle}>
        So sánh giữa setCount(count + 1) và setCount((prev) =&gt; prev + 1)
      </Text>

      {/* Thẻ 1: Cách sai */}
      <View style={[styles.card, styles.cardWrong]}>
        <Text style={styles.cardTag}>❌ Cách chưa fix (count + 1)</Text>
        <Text style={styles.countText}>Số lần bấm: {countWrong}</Text>
        <Pressable style={styles.btnWrong} onPress={handlePressWrong}>
          <Text style={styles.btnText}>Cộng 3 lần (Trực tiếp)</Text>
        </Pressable>
        <Text style={styles.explainText}>
          Mặc dù gọi setCount 3 lần, nhưng chỉ tăng +1 do cả 3 lệnh đều dùng cùng 1 giá trị count cũ.
        </Text>
      </View>

      {/* Thẻ 2: Cách đúng */}
      <View style={[styles.card, styles.cardCorrect]}>
        <Text style={styles.cardTag}>✅ Cách đã fix (prev =&gt; prev + 1)</Text>
        <Text style={styles.countText}>Số lần bấm: {countCorrect}</Text>
        <Pressable style={styles.btnCorrect} onPress={handlePressCorrect}>
          <Text style={styles.btnText}>Cộng 3 lần (Dùng Updater prev)</Text>
        </Pressable>
        <Text style={styles.explainText}>
          React lấy giá trị mới nhất qua tham số `prev`, giúp tăng đúng +3 sau 1 lần bấm!
        </Text>
      </View>

      {/* Nút đặt lại */}
      <Pressable style={styles.btnReset} onPress={handleReset}>
        <Text style={styles.resetText}>Đặt lại về 0</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0F172A',
    textAlign: 'center',
    marginBottom: 6,
  },
  subTitle: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 20,
  },
  card: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  cardWrong: {
    borderColor: '#FECACA',
  },
  cardCorrect: {
    borderColor: '#BBF7D0',
  },
  cardTag: {
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 8,
    color: '#334155',
  },
  countText: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1E293B',
    marginBottom: 12,
  },
  btnWrong: {
    backgroundColor: '#EF4444',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 8,
  },
  btnCorrect: {
    backgroundColor: '#22C55E',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 8,
  },
  btnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
  explainText: {
    fontSize: 12,
    color: '#64748B',
    lineHeight: 16,
  },
  btnReset: {
    marginTop: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    backgroundColor: '#E2E8F0',
  },
  resetText: {
    color: '#475569',
    fontWeight: '600',
    fontSize: 13,
  },
});
