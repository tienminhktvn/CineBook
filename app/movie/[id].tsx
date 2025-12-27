import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function DetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams(); // Nhận dữ liệu phim

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Chi tiết phim</Text>
      
      {/* Hiển thị tên phim nhận được */}
      <Text style={styles.movieName}>{params.name}</Text>
      
      <Text style={styles.desc}>Nội dung: Cuộc đua xe gay cấn nhất lịch sử...</Text>

      {/* Nút quay lại */}
      <TouchableOpacity onPress={() => router.back()} style={styles.btnBack}>
        <Text style={styles.textBack}>Quay lại trang chủ</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  movieName: { fontSize: 30, color: 'blue', fontWeight: 'bold', marginBottom: 20 },
  desc: { fontSize: 16, color: 'gray', marginBottom: 20 },
  btnBack: { padding: 15, backgroundColor: '#ddd', borderRadius: 8 },
  textBack: { fontWeight: 'bold' }
});