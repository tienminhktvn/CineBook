import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView, Alert } from 'react-native';
import { useRouter } from 'expo-router';

// 1. CẤU HÌNH DỮ LIỆU GHẾ (Giả lập)
const ROWS = 8; // Số hàng
const COLS = 8; // Số ghế mỗi hàng
const GAP_COL = 4; // Vị trí lối đi ở giữa (Sau ghế số 4)

// Hàm tạo danh sách ghế
const generateSeats = () => {
  let seats = [];
  const rowLabels = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
  
  for (let r = 0; r < ROWS; r++) {
    let rowArray = [];
    for (let c = 1; c <= COLS; c++) {
       // Giả bộ: Ghế A3, B5 đã có người đặt
       const isBooked = (r === 0 && c === 3) || (r === 1 && c === 5);
       rowArray.push({
         id: `${rowLabels[r]}${c}`,
         status: isBooked ? 'booked' : 'available', // available | booked | selected
         type: r >= 5 ? 'vip' : 'standard' // 3 hàng cuối là VIP
       });
    }
    seats.push(rowArray);
  }
  return seats;
};

const SEAT_DATA = generateSeats();

export default function BookingScreen() {
  const router = useRouter();
  
  // State lưu các ghế đang chọn
  const [selectedSeats, setSelectedSeats] = useState([]);

  // Hàm xử lý chọn ghế
  const handleSelectSeat = (seatId) => {
    if (selectedSeats.includes(seatId)) {
      // Nếu đã chọn rồi -> Bỏ chọn (Xóa khỏi mảng)
      setSelectedSeats(selectedSeats.filter(id => id !== seatId));
    } else {
      // Nếu chưa chọn -> Thêm vào mảng
      setSelectedSeats([...selectedSeats, seatId]);
    }
  };

  // Tính tổng tiền
  const totalPrice = selectedSeats.length * 90000; // 90k/vé

  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.backText}>← Trở về</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Chọn Ghế</Text>
      </View>

      {/* MÀN HÌNH CHIẾU (SCREEN) */}
      <View style={styles.screenContainer}>
        <View style={styles.screenCurve} />
        <Text style={styles.screenText}>MÀN HÌNH</Text>
      </View>

      <ScrollView contentContainerStyle={styles.seatContainer}>
        {/* VẼ TỪNG HÀNG GHẾ */}
        {SEAT_DATA.map((row, rowIndex) => (
          <View key={rowIndex} style={styles.row}>
            {row.map((seat, colIndex) => {
              
              // Logic kiểm tra trạng thái
              const isSelected = selectedSeats.includes(seat.id);
              const isBooked = seat.status === 'booked';
              const isVip = seat.type === 'vip';

              // Logic tạo lối đi ở giữa
              const marginRight = (colIndex + 1) === GAP_COL ? 30 : 5;

              return (
                <TouchableOpacity
                  key={seat.id}
                  disabled={isBooked} // Nếu đã đặt thì không bấm được
                  onPress={() => handleSelectSeat(seat.id)}
                  style={[
                    styles.seat,
                    { marginRight: marginRight },
                    isBooked && styles.seatBooked,   // Màu xám
                    isSelected && styles.seatSelected, // Màu đỏ
                    !isBooked && !isSelected && isVip && styles.seatVip // Viền VIP
                  ]}
                >
                  <Text style={[
                    styles.seatText,
                    isSelected && { color: 'white' }
                  ]}>
                    {seat.id}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        ))}

        {/* CHÚ THÍCH */}
        <View style={styles.legendContainer}>
          <View style={styles.legendItem}>
             <View style={[styles.seatMini, styles.seatBooked]} />
             <Text>Đã bán</Text>
          </View>
          <View style={styles.legendItem}>
             <View style={[styles.seatMini, styles.seatSelected]} />
             <Text>Đang chọn</Text>
          </View>
           <View style={styles.legendItem}>
             <View style={[styles.seatMini, styles.seatVip]} />
             <Text>VIP</Text>
          </View>
        </View>

      </ScrollView>

      {/* FOOTER: THANH TOÁN */}
      <View style={styles.footer}>
        <View>
          <Text style={styles.infoText}>
             Ghế: {selectedSeats.join(', ')}
          </Text>
          <Text style={styles.priceText}>
             {totalPrice.toLocaleString()} VNĐ
          </Text>
        </View>
        
        <TouchableOpacity 
           style={styles.btnBuy}
           onPress={() => Alert.alert("Thanh toán", `Tổng tiền: ${totalPrice}đ`)}
        >
          <Text style={styles.btnBuyText}>Tiếp tục</Text>
        </TouchableOpacity>
      </View>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', paddingTop: 40 },
  header: { padding: 15, flexDirection: 'row', alignItems: 'center' },
  backText: { fontSize: 18, color: '#007AFF', marginRight: 15 },
  headerTitle: { fontSize: 20, fontWeight: 'bold' },
  
  // Màn hình cong
  screenContainer: { alignItems: 'center', marginVertical: 20 },
  screenCurve: { 
    width: '80%', height: 10, backgroundColor: '#ddd', borderRadius: 10,
    shadowColor: "#000", shadowOffset: {width: 0, height: 10}, shadowOpacity: 0.3, elevation: 10
  },
  screenText: { marginTop: 5, color: '#aaa', fontSize: 12 },

  // Lưới ghế
  seatContainer: { alignItems: 'center', paddingBottom: 100 },
  row: { flexDirection: 'row', marginBottom: 10 },
  seat: { 
    width: 35, height: 35, 
    borderRadius: 8, 
    justifyContent: 'center', alignItems: 'center',
    backgroundColor: '#E0E0E0', // Màu mặc định (Trắng xám)
  },
  seatBooked: { backgroundColor: '#4a4a4a' }, // Màu đã đặt (Đen xám)
  seatSelected: { backgroundColor: '#FF3B30' }, // Màu đang chọn (Đỏ)
  seatVip: { borderWidth: 2, borderColor: '#FFD700', backgroundColor: '#fff' }, // Viền vàng VIP
  
  seatText: { fontSize: 10, color: '#555' },
  seatMini: { width: 20, height: 20, borderRadius: 4, marginRight: 5 },

  // Chú thích
  legendContainer: { flexDirection: 'row', marginTop: 20, gap: 20 },
  legendItem: { flexDirection: 'row', alignItems: 'center' },

  // Footer
  footer: { 
    position: 'absolute', bottom: 0, left: 0, right: 0, 
    backgroundColor: 'white', padding: 20, 
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    borderTopWidth: 1, borderTopColor: '#ddd',
    elevation: 20
  },
  infoText: { fontSize: 14, color: 'gray' },
  priceText: { fontSize: 20, fontWeight: 'bold', color: '#007AFF' },
  btnBuy: { backgroundColor: '#007AFF', paddingHorizontal: 30, paddingVertical: 12, borderRadius: 8 },
  btnBuyText: { color: 'white', fontWeight: 'bold', fontSize: 16 }
});