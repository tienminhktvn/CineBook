import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, Image } from 'react-native';

export default function TicketScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.headerTitle}>Vé Của Tôi</Text>
      
      <View style={styles.emptyState}>
        <Image 
          source={{ uri: 'https://cdn-icons-png.flaticon.com/512/1452/1452419.png' }} 
          style={{ width: 100, height: 100, opacity: 0.5, marginBottom: 20 }}
        />
        <Text style={styles.emptyText}>Bạn chưa có vé nào</Text>
        <Text style={styles.subText}>Hãy đặt vé ngay để trải nghiệm!</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 20 },
  headerTitle: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, color: '#00ADEF' },
  emptyState: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyText: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  subText: { color: '#888', marginTop: 10 }
});