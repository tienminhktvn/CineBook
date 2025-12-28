import React from 'react';
import { 
  View, Text, StyleSheet, TouchableOpacity, ScrollView, 
  SafeAreaView, Dimensions, Image 
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

// --- MÀU SẮC ---
const Colors = {
  success: '#10B981', // Xanh lá cây (Thành công)
  primary: '#00ADEF', // Xanh dương (Nút lưu)
  bg: '#F3F4F6',      // Xám nền
  white: '#FFFFFF',
  text: '#1F2937',
  textGray: '#6B7280',
};

export default function SuccessScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  // Tạo mã đặt vé ngẫu nhiên (6 chữ số)
  const bookingId = Math.floor(100000 + Math.random() * 900000);

  // Parse lại dữ liệu để hiển thị
  const seats = params.seats || "E5, E6";
  const totalAmount = parseFloat(params.totalAmount || '0');
  
  // Helper lấy tên rạp/ngày
  const getCinemaName = (id) => {
    const map = { 'c1': 'CGV Vincom', 'c2': 'CGV Crescent Mall', 'c3': 'CGV Landmark 81' };
    return map[id] || 'CGV Vincom';
  };
  const getDateLabel = (id) => {
    const map = { '1': '18/11', '2': '19/11', '3': '20/11', '4': '21/11', '5': '22/11' };
    return map[id] || '20/11/2025';
  };

  const handleHome = () => {
    // Quan trọng: Quay về trang chủ và xóa lịch sử back để không back lại được trang này
    router.dismissAll(); 
    router.replace('/(tabs)');
  };

  return (
    <View style={styles.container}>
      
      <ScrollView contentContainerStyle={{ paddingBottom: 50 }} showsVerticalScrollIndicator={false}>
        
        {/* 1. HEADER XANH LÁ (BACKGROUND) */}
        <View style={styles.headerBg}>
          <SafeAreaView style={{ alignItems: 'center', marginTop: 40 }}>
            <View style={styles.iconCircle}>
               <Ionicons name="checkmark" size={40} color={Colors.success} />
            </View>
            <Text style={styles.headerTitle}>Đặt Vé Thành Công!</Text>
            <Text style={styles.headerSub}>Vé đã được gửi vào email của bạn</Text>
          </SafeAreaView>
        </View>

        {/* 2. TẤM VÉ (CARD NỔI) */}
        <View style={styles.ticketCard}>
          
          {/* Mã Đặt Vé */}
          <Text style={styles.labelId}>Mã đặt vé</Text>
          <Text style={styles.ticketId}>#{bookingId}</Text>

          {/* QR CODE (Dùng ảnh giả lập cho nhanh, thay bằng thư viện sau nếu cần) */}
          <View style={styles.qrContainer}>
             {/* Đây là link ảnh QR mẫu, bạn có thể thay bằng QR thật nếu muốn */}
             <Image 
               source={{ uri: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=' + bookingId }} 
               style={{ width: 160, height: 160 }} 
             />
          </View>
          <Text style={styles.qrNote}>Vui lòng xuất trình mã QR này tại quầy soát vé</Text>

          {/* Đường kẻ đứt đoạn */}
          <View style={styles.dashedLineContainer}>
             <View style={styles.halfCircleLeft} />
             <View style={styles.dashedLine} />
             <View style={styles.halfCircleRight} />
          </View>

          {/* Thông tin chi tiết */}
          <View style={styles.infoContainer}>
            <View style={styles.row}>
               <View style={{flex: 1}}>
                  <Text style={styles.label}>Phim</Text>
                  <Text style={styles.value} numberOfLines={1}>{params.movieName}</Text>
               </View>
               <View style={{flex: 1, alignItems: 'flex-end'}}>
                  <Text style={styles.label}>Rạp</Text>
                  <Text style={styles.value}>{getCinemaName(params.cinema)}</Text>
               </View>
            </View>

            <View style={[styles.row, {marginTop: 15}]}>
               <View style={{flex: 1}}>
                  <Text style={styles.label}>Suất chiếu</Text>
                  <Text style={styles.value}>{params.time} - {getDateLabel(params.date)}</Text>
               </View>
               <View style={{flex: 1, alignItems: 'flex-end'}}>
                  <Text style={styles.label}>Phòng</Text>
                  <Text style={styles.value}>Room 5</Text>
               </View>
            </View>

            <View style={[styles.row, {marginTop: 15}]}>
               <View style={{flex: 1}}>
                  <Text style={styles.label}>Ghế ngồi</Text>
                  <Text style={styles.valueLarge}>{seats}</Text>
               </View>
               <View style={{flex: 1, alignItems: 'flex-end'}}>
                  <Text style={styles.label}>Tổng tiền</Text>
                  <Text style={[styles.valueLarge, {color: Colors.primary}]}>
                    {totalAmount.toLocaleString()}đ
                  </Text>
               </View>
            </View>
          </View>

        </View>

        {/* 3. NÚT CHỨC NĂNG */}
        <View style={styles.actionContainer}>
           <TouchableOpacity style={styles.btnSave}>
              <Ionicons name="download-outline" size={20} color="white" style={{marginRight: 5}} />
              <Text style={styles.btnText}>LƯU ẢNH VÉ</Text>
           </TouchableOpacity>

           <TouchableOpacity style={styles.btnHome} onPress={handleHome}>
              <Ionicons name="home" size={20} color={Colors.text} style={{marginRight: 5}} />
              <Text style={[styles.btnText, {color: Colors.text}]}>VỀ TRANG CHỦ</Text>
           </TouchableOpacity>
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  
  // Header Green
  headerBg: {
    backgroundColor: Colors.success,
    height: 250, // Chiều cao phần màu xanh
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    alignItems: 'center',
    paddingHorizontal: 20
  },
  iconCircle: {
    width: 60, height: 60, borderRadius: 30, backgroundColor: 'white',
    alignItems: 'center', justifyContent: 'center', marginBottom: 15
  },
  headerTitle: { fontSize: 22, fontWeight: 'bold', color: 'white', marginBottom: 5 },
  headerSub: { fontSize: 14, color: '#D1FAE5' },

  // Ticket Card
  ticketCard: {
    backgroundColor: 'white',
    marginHorizontal: 20,
    marginTop: -60, // Kỹ thuật margin âm để đẩy card đè lên header xanh
    borderRadius: 20,
    paddingVertical: 30,
    alignItems: 'center',
    // Shadow
    elevation: 10, shadowColor: '#000', shadowOffset: {width: 0, height: 5}, shadowOpacity: 0.1
  },
  labelId: { fontSize: 14, color: Colors.textGray, letterSpacing: 1 },
  ticketId: { fontSize: 28, fontWeight: 'bold', color: Colors.primary, marginVertical: 5 },
  
  qrContainer: { 
    marginVertical: 20, padding: 10, 
    borderWidth: 2, borderColor: '#F3F4F6', borderRadius: 10 
  },
  qrNote: { fontSize: 12, color: Colors.textGray, textAlign: 'center', width: '70%' },

  // Dashed Line
  dashedLineContainer: { 
    width: '100%', height: 30, flexDirection: 'row', alignItems: 'center', 
    marginVertical: 20, justifyContent: 'space-between' 
  },
  halfCircleLeft: { 
    width: 20, height: 40, backgroundColor: Colors.bg, 
    borderTopRightRadius: 20, borderBottomRightRadius: 20, marginLeft: -1 
  },
  halfCircleRight: { 
    width: 20, height: 40, backgroundColor: Colors.bg, 
    borderTopLeftRadius: 20, borderBottomLeftRadius: 20, marginRight: -1 
  },
  dashedLine: { flex: 1, height: 1, borderWidth: 1, borderColor: '#E5E7EB', borderStyle: 'dashed', marginHorizontal: 10 },

  // Info
  infoContainer: { width: '100%', paddingHorizontal: 25 },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  label: { fontSize: 12, color: Colors.textGray, marginBottom: 3 },
  value: { fontSize: 15, fontWeight: 'bold', color: Colors.text },
  valueLarge: { fontSize: 18, fontWeight: 'bold', color: Colors.text },

  // Buttons
  actionContainer: { padding: 20, marginTop: 10 },
  btnSave: { 
    backgroundColor: Colors.primary, flexDirection: 'row', 
    paddingVertical: 15, borderRadius: 12, 
    alignItems: 'center', justifyContent: 'center', marginBottom: 15 
  },
  btnHome: { 
    backgroundColor: '#E5E7EB', flexDirection: 'row', 
    paddingVertical: 15, borderRadius: 12, 
    alignItems: 'center', justifyContent: 'center' 
  },
  btnText: { fontWeight: 'bold', fontSize: 16, color: 'white' }
});