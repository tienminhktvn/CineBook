import React, { useState } from 'react';
import { 
  View, Text, StyleSheet, TouchableOpacity, ScrollView, 
  SafeAreaView, Alert, Dimensions 
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

// --- MÀU SẮC ---
const Colors = {
  primary: '#00ADEF',
  bg: '#FFFFFF',
  cardBg: '#F9FAFB', // Màu xám rất nhạt cho các khung thông tin
  text: '#1F2937',
  textGray: '#6B7280',
  border: '#E5E7EB',
};

export default function PaymentScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  // --- XỬ LÝ DỮ LIỆU TỪ TRANG TRƯỚC ---
  // Lấy các thông số, nếu không có thì để mặc định 0 hoặc chuỗi rỗng
  const totalAmount = parseFloat(params.totalAmount || '0');
  const snackTotal = parseFloat(params.snackTotal || '0');
  const ticketTotal = totalAmount - snackTotal; // Tính ngược lại tiền vé
  
  // Xử lý danh sách ghế (đang là chuỗi 'A1,A2')
  const seatList = params.seats ? params.seats.split(',') : [];
  
  // Helper để hiển thị tên rạp/ngày đẹp hơn (Copy lại từ trang trước)
  const getCinemaName = (id) => {
    const map = { 'c1': 'CGV Vincom', 'c2': 'CGV Crescent Mall', 'c3': 'CGV Landmark 81' };
    return map[id] || 'CGV Vincom';
  };
  const getDateLabel = (id) => {
    const map = { '1': '18/11', '2': '19/11', '3': '20/11', '4': '21/11', '5': '22/11' };
    return map[id] || '20/11/2025';
  };

  // --- STATE CHỌN PHƯƠNG THỨC THANH TOÁN ---
  const [method, setMethod] = useState('wallet'); // 'wallet' | 'card'

  const handlePayment = () => {
    Alert.alert(
      "Xác nhận thanh toán", 
      `Bạn có chắc muốn thanh toán ${totalAmount.toLocaleString()}đ?`,
      [
        { text: "Hủy", style: "cancel" },
        { 
          text: "Đồng ý", 
          onPress: () => {
            // Chuyển sang màn hình Thành công / Vé QR
            router.push({
              pathname: '/payment/success', // Chúng ta sẽ tạo file này ở bước cuối
              params: params // Truyền tiếp dữ liệu để in vé
            });
          } 
        }
      ]
    );
  };

  // Component hiển thị 1 dòng phương thức thanh toán
  const renderPaymentMethod = (id, iconName, title, subTitle) => {
    const isSelected = method === id;
    return (
      <TouchableOpacity 
        activeOpacity={0.9}
        onPress={() => setMethod(id)}
        style={[
          styles.methodCard, 
          isSelected && { borderColor: Colors.primary, borderWidth: 1.5, backgroundColor: '#F0F9FF' }
        ]}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          {/* Nút tròn Radio */}
          <View style={[styles.radioCircle, isSelected && { borderColor: Colors.primary }]}>
             {isSelected && <View style={styles.radioDot} />}
          </View>
          
          {/* Icon phương thức */}
          <View style={styles.iconBox}>
             <Ionicons name={iconName} size={24} color={isSelected ? Colors.primary : '#666'} />
          </View>
          
          {/* Text */}
          <View>
            <Text style={[styles.methodTitle, isSelected && { color: Colors.primary }]}>{title}</Text>
            <Text style={styles.methodSub}>{subTitle}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      
      {/* 1. HEADER */}
      <SafeAreaView style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <View style={{ marginLeft: 15 }}>
            <Text style={styles.headerTitle}>Thanh Toán</Text>
            <Text style={styles.headerSub}>Xác nhận thông tin đơn hàng</Text>
          </View>
        </View>
      </SafeAreaView>

      <ScrollView contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        
        {/* 2. THẺ THÔNG TIN PHIM */}
        <View style={styles.infoCard}>
          {/* Tên phim */}
          <View style={styles.movieRow}>
            <View style={styles.movieIcon}>
              <Ionicons name="videocam" size={20} color="white" />
            </View>
            <View>
              <Text style={styles.movieName}>{params.movieName}</Text>
              <Text style={styles.movieType}>Phim hành động - 181 phút</Text>
            </View>
          </View>
          
          <View style={styles.divider} />

          {/* Chi tiết Rạp/Giờ */}
          <View style={styles.detailRow}>
            <Ionicons name="business" size={18} color="#9CA3AF" style={{width: 25}} />
            <Text style={styles.detailText}>
              {getCinemaName(params.cinema)} - Phòng 5
            </Text>
          </View>
          <View style={styles.detailRow}>
            <Ionicons name="calendar" size={18} color="#9CA3AF" style={{width: 25}} />
            <Text style={styles.detailText}>
              {params.time} - {getDateLabel(params.date)}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <Ionicons name="grid" size={18} color="#9CA3AF" style={{width: 25}} />
            <Text style={styles.detailText}>
              Ghế: <Text style={{fontWeight: 'bold', color: '#000'}}>{params.seats}</Text>
            </Text>
          </View>
        </View>

        {/* 3. CHI TIẾT GIÁ TIỀN */}
        <View style={styles.infoCard}>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Vé ({seatList.length}x 90.000đ)</Text>
            <Text style={styles.priceValue}>{ticketTotal.toLocaleString()}đ</Text>
          </View>
          
          {snackTotal > 0 && (
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>Bắp nước</Text>
              <Text style={styles.priceValue}>{snackTotal.toLocaleString()}đ</Text>
            </View>
          )}

          <View style={[styles.divider, { marginVertical: 10 }]} />

          <View style={styles.priceRow}>
            <Text style={styles.totalLabel}>Tổng cộng</Text>
            <Text style={styles.totalValue}>{totalAmount.toLocaleString()}đ</Text>
          </View>
        </View>

        {/* 4. PHƯƠNG THỨC THANH TOÁN */}
        <Text style={styles.sectionTitle}>Phương thức thanh toán</Text>
        
        {renderPaymentMethod('wallet', 'wallet', 'Ví điện tử', 'Momo / ZaloPay')}
        {renderPaymentMethod('card', 'card', 'Thẻ ngân hàng', 'ATM / Visa / Mastercard')}

      </ScrollView>

      {/* 5. FOOTER BUTTON */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.btnPay} onPress={handlePayment}>
          <Ionicons name="shield-checkmark" size={20} color="white" style={{marginRight: 8}} />
          <Text style={styles.btnText}>THANH TOÁN NGAY</Text>
        </TouchableOpacity>
        <Text style={styles.secureText}>Giao dịch được bảo mật và mã hóa</Text>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  
  header: { backgroundColor: Colors.primary, paddingTop: 40, paddingBottom: 20 },
  headerContent: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20 },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: 'white' },
  headerSub: { fontSize: 13, color: '#E0F2FE', marginTop: 2 },

  body: { padding: 20, paddingBottom: 120 },

  // Card Style chung
  infoCard: {
    backgroundColor: Colors.cardBg,
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
  },
  divider: { height: 1, backgroundColor: Colors.border, marginVertical: 12 },

  // Movie Info
  movieRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 5 },
  movieIcon: { 
    width: 40, height: 40, borderRadius: 8, backgroundColor: Colors.primary, 
    alignItems: 'center', justifyContent: 'center', marginRight: 12 
  },
  movieName: { fontSize: 16, fontWeight: 'bold', color: Colors.text },
  movieType: { fontSize: 13, color: Colors.textGray },
  
  detailRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  detailText: { fontSize: 14, color: '#374151' },

  // Price Info
  priceRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  priceLabel: { fontSize: 14, color: Colors.textGray },
  priceValue: { fontSize: 14, fontWeight: '600', color: Colors.text },
  totalLabel: { fontSize: 16, fontWeight: 'bold', color: Colors.text },
  totalValue: { fontSize: 20, fontWeight: 'bold', color: Colors.primary },

  // Payment Methods
  sectionTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 15, color: Colors.text },
  methodCard: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: Colors.cardBg, padding: 15, borderRadius: 12, marginBottom: 12,
    borderWidth: 1, borderColor: 'transparent'
  },
  radioCircle: {
    width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: '#D1D5DB',
    alignItems: 'center', justifyContent: 'center', marginRight: 15, backgroundColor: 'white'
  },
  radioDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: Colors.primary },
  iconBox: { marginRight: 15 },
  methodTitle: { fontSize: 15, fontWeight: '600', color: Colors.text },
  methodSub: { fontSize: 12, color: Colors.textGray },

  // Footer
  footer: {
    position: 'absolute', bottom: 0, width: '100%',
    backgroundColor: 'white', padding: 20,
    borderTopWidth: 1, borderTopColor: '#F3F4F6', elevation: 20
  },
  btnPay: {
    backgroundColor: Colors.primary, flexDirection: 'row',
    paddingVertical: 15, borderRadius: 10, alignItems: 'center', justifyContent: 'center',
    marginBottom: 10
  },
  btnText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
  secureText: { textAlign: 'center', fontSize: 12, color: '#9CA3AF' }
});