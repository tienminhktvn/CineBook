// // import React, { useState } from 'react';
// // import { 
// //   View, Text, StyleSheet, TouchableOpacity, ScrollView, 
// //   SafeAreaView, Alert, Dimensions 
// // } from 'react-native';
// // import { useRouter, useLocalSearchParams } from 'expo-router';
// // import { Ionicons } from '@expo/vector-icons';

// // const { width } = Dimensions.get('window');

// // // --- MÀU SẮC THEO THIẾT KẾ ---
// // const Colors = {
// //   primary: '#00ADEF', // Xanh chủ đạo (Header + Button)
// //   red: '#EF4444',     // Đỏ (Ghế đang chọn)
// //   darkGray: '#4B5563',// Xám đậm (Ghế đã bán)
// //   lightGray: '#E5E7EB',// Xám nhạt (Ghế trống)
// //   vip: '#FCD34D',     // Màu VIP (nếu cần, nhưng thiết kế bạn đang để màu xám)
// //   white: '#FFFFFF',
// //   text: '#1F2937',
// // };

// // // --- DỮ LIỆU CẤU HÌNH GHẾ ---
// // // Chia làm 2 khu vực như trong ảnh
// // const SEATS_STANDARD = [
// //   ['A1', 'A2', 'A3', 'A4', 'A5', 'A6', 'A7', 'A8'],
// //   ['B1', 'B2', 'B3', 'B4', 'B5', 'B6', 'B7', 'B8'],
// // ];

// // const SEATS_VIP = [
// //   ['E1', 'E2', 'E3', 'E4', 'E5', 'E6', 'E7', 'E8'],
// //   ['F1', 'F2', 'F3', 'F4', 'F5', 'F6', 'F7', 'F8'],
// // ];

// // // Giả lập những ghế đã bị mua rồi (Để hiện màu xám đậm)
// // const BOOKED_SEATS = ['A2', 'A5', 'B3', 'B6', 'E2', 'F4', 'F7'];

// // export default function BookingScreen() {
// //   const router = useRouter();
// //   const params = useLocalSearchParams();

// //   // State lưu danh sách ghế đang chọn (Ví dụ: ['E5', 'E6'])
// //   const [selectedSeats, setSelectedSeats] = useState([]);

// //   // Hàm xử lý khi bấm vào ghế
// //   const handleToggleSeat = (seatId) => {
// //     if (BOOKED_SEATS.includes(seatId)) return; // Ghế đã bán thì không làm gì

// //     if (selectedSeats.includes(seatId)) {
// //       // Nếu đang chọn -> Bỏ chọn
// //       setSelectedSeats(selectedSeats.filter(id => id !== seatId));
// //     } else {
// //       // Nếu chưa chọn -> Thêm vào
// //       setSelectedSeats([...selectedSeats, seatId]);
// //     }
// //   };

// //   // Tính tổng tiền (Giả sử 90k/vé)
// //   const totalPrice = selectedSeats.length * 90000;

// //   // Component con: Vẽ 1 cái ghế
// //   const renderSeat = (seatId) => {
// //     const isBooked = BOOKED_SEATS.includes(seatId);
// //     const isSelected = selectedSeats.includes(seatId);

// //     // Xác định màu ghế
// //     let backgroundColor = Colors.lightGray; // Mặc định: Trống
// //     let textColor = '#000';

// //     if (isBooked) {
// //       backgroundColor = Colors.darkGray; // Đã bán
// //       textColor = '#fff';
// //     } else if (isSelected) {
// //       backgroundColor = Colors.red; // Đang chọn (Màu đỏ theo thiết kế)
// //       textColor = '#fff';
// //     }

// //     return (
// //       <TouchableOpacity
// //         key={seatId}
// //         disabled={isBooked}
// //         onPress={() => handleToggleSeat(seatId)}
// //         style={[styles.seatBox, { backgroundColor }]}
// //       >
// //         <Text style={[styles.seatText, { color: textColor }]}>{seatId}</Text>
// //       </TouchableOpacity>
// //     );
// //   };

// //   return (
// //     <View style={styles.container}>
      
// //       {/* 1. HEADER (Màu xanh) */}
// //       <SafeAreaView style={styles.header}>
// //         <View style={styles.headerContent}>
// //           <TouchableOpacity onPress={() => router.back()}>
// //             <Ionicons name="arrow-back" size={24} color="white" />
// //           </TouchableOpacity>
// //           <View style={{ marginLeft: 15 }}>
// //             <Text style={styles.movieTitle}>{params.movieName || "Avengers: Endgame"}</Text>
// //             <Text style={styles.movieSub}>19:00, 20/11/2025</Text>
// //           </View>
// //         </View>
// //       </SafeAreaView>

// //       <ScrollView contentContainerStyle={styles.scrollBody}>
        
// //         {/* 2. MÀN HÌNH CONG (Screen) */}
// //         <View style={styles.screenContainer}>
// //            <View style={styles.screenCurve} />
// //            <Text style={styles.screenLabel}>SCREEN</Text>
// //         </View>

// //         {/* 3. CHÚ THÍCH (Legend) */}
// //         <View style={styles.legendContainer}>
// //           <View style={styles.legendItem}>
// //             <View style={[styles.legendBox, { backgroundColor: Colors.lightGray }]} />
// //             <Text style={styles.legendText}>Trống</Text>
// //           </View>
// //           <View style={styles.legendItem}>
// //             <View style={[styles.legendBox, { backgroundColor: Colors.darkGray }]} />
// //             <Text style={styles.legendText}>Đã bán</Text>
// //           </View>
// //           <View style={styles.legendItem}>
// //             <View style={[styles.legendBox, { backgroundColor: Colors.red }]} />
// //             <Text style={styles.legendText}>Đang chọn</Text>
// //           </View>
// //         </View>

// //         {/* 4. SƠ ĐỒ GHẾ */}
        
// //         {/* Khu vực Ghế Thường */}
// //         <Text style={styles.zoneTitle}>Ghế Thường</Text>
// //         <View style={styles.seatGrid}>
// //           {SEATS_STANDARD.map((row, rowIndex) => (
// //             <View key={rowIndex} style={styles.rowContainer}>
// //               {row.map(seatId => renderSeat(seatId))}
// //             </View>
// //           ))}
// //         </View>

// //         {/* Khu vực Ghế VIP */}
// //         <Text style={styles.zoneTitle}>Ghế VIP</Text>
// //         <View style={styles.seatGrid}>
// //           {SEATS_VIP.map((row, rowIndex) => (
// //             <View key={rowIndex} style={styles.rowContainer}>
// //               {row.map(seatId => renderSeat(seatId))}
// //             </View>
// //           ))}
// //         </View>

// //       </ScrollView>

// //       {/* 5. FOOTER (Trắng + Nút Xanh) */}
// //       <View style={styles.footer}>
// //         <View style={styles.footerInfo}>
// //           <Text style={styles.labelTotal}>
// //             {selectedSeats.length} Ghế: <Text style={{fontWeight: 'bold', color: '#333'}}>{selectedSeats.join(', ')}</Text>
// //           </Text>
// //           <Text style={styles.priceTotal}>
// //              {totalPrice.toLocaleString()}đ
// //           </Text>
// //         </View>

// //         <TouchableOpacity 
// //           style={styles.btnNext}
// //           onPress={() => {
// //             if (selectedSeats.length === 0) {
// //               Alert.alert("Thông báo", "Vui lòng chọn ít nhất 1 ghế!");
// //             } else {
// //               // Chuyển sang trang Thanh toán (bạn sẽ làm sau)
// //               Alert.alert("Thành công", "Chuyển sang bước chọn bắp nước...");
// //               // router.push('/movie/snacks'); 
// //             }
// //           }}
// //         >
// //           <Text style={styles.btnText}>TIẾP TỤC</Text>
// //         </TouchableOpacity>
// //       </View>

// //     </View>
// //   );
// // }

// // const styles = StyleSheet.create({
// //   container: { flex: 1, backgroundColor: Colors.white },

// //   // Header
// //   header: { backgroundColor: Colors.primary, paddingTop: 30, paddingBottom: 15 },
// //   headerContent: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20 },
// //   movieTitle: { fontSize: 18, fontWeight: 'bold', color: 'white' },
// //   movieSub: { fontSize: 13, color: '#E0F2FE', marginTop: 2 },

// //   scrollBody: { paddingBottom: 120 },

// //   // Screen Curve
// //   screenContainer: { alignItems: 'center', marginTop: 20, marginBottom: 10 },
// //   screenCurve: {
// //     width: width * 0.8, height: 8,
// //     backgroundColor: '#E5E7EB',
// //     borderRadius: 10,
// //     // Tạo hiệu ứng đổ bóng để nhìn nổi lên
// //     shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, elevation: 5
// //   },
// //   screenLabel: { fontSize: 10, color: '#9CA3AF', marginTop: 8, letterSpacing: 2, fontWeight: 'bold' },

// //   // Legend
// //   legendContainer: { flexDirection: 'row', justifyContent: 'center', gap: 20, marginBottom: 30 },
// //   legendItem: { flexDirection: 'row', alignItems: 'center' },
// //   legendBox: { width: 20, height: 20, borderRadius: 4, marginRight: 8 },
// //   legendText: { fontSize: 12, color: '#4B5563' },

// //   // Seats
// //   zoneTitle: { textAlign: 'center', color: '#9CA3AF', fontSize: 12, marginBottom: 10, marginTop: 10 },
// //   seatGrid: { alignItems: 'center' },
// //   rowContainer: { flexDirection: 'row', marginBottom: 8, gap: 6 }, // Khoảng cách giữa các ghế
// //   seatBox: {
// //     width: 32, height: 32, borderRadius: 6,
// //     justifyContent: 'center', alignItems: 'center',
// //   },
// //   seatText: { fontSize: 10, fontWeight: '600' },

// //   // Footer
// //   footer: {
// //     position: 'absolute', bottom: 0, left: 0, right: 0,
// //     backgroundColor: 'white',
// //     padding: 20,
// //     borderTopWidth: 1, borderTopColor: '#F3F4F6',
// //     elevation: 20, // Bóng đổ trên Android
// //     shadowColor: "#000", shadowOffset: { width: 0, height: -2 }, shadowOpacity: 0.1, // Bóng đổ trên iOS
// //   },
// //   footerInfo: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
// //   labelTotal: { fontSize: 15, color: '#333' },
// //   priceTotal: { fontSize: 20, fontWeight: 'bold', color: Colors.primary },
  
// //   btnNext: {
// //     backgroundColor: Colors.primary,
// //     paddingVertical: 14,
// //     borderRadius: 10,
// //     alignItems: 'center',
// //   },
// //   btnText: { color: 'white', fontWeight: 'bold', fontSize: 16 }
// // });

// import React, { useState } from 'react';
// import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView, Alert } from 'react-native';
// import { useRouter } from 'expo-router';

// // 1. CẤU HÌNH DỮ LIỆU GHẾ (Giả lập)
// const ROWS = 8; // Số hàng
// const COLS = 8; // Số ghế mỗi hàng
// const GAP_COL = 4; // Vị trí lối đi ở giữa (Sau ghế số 4)

// // Hàm tạo danh sách ghế
// const generateSeats = () => {
//   let seats = [];
//   const rowLabels = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
  
//   for (let r = 0; r < ROWS; r++) {
//     let rowArray = [];
//     for (let c = 1; c <= COLS; c++) {
//        // Giả bộ: Ghế A3, B5 đã có người đặt
//        const isBooked = (r === 0 && c === 3) || (r === 1 && c === 5);
//        rowArray.push({
//          id: `${rowLabels[r]}${c}`,
//          status: isBooked ? 'booked' : 'available', // available | booked | selected
//          type: r >= 5 ? 'vip' : 'standard' // 3 hàng cuối là VIP
//        });
//     }
//     seats.push(rowArray);
//   }
//   return seats;
// };

// const SEAT_DATA = generateSeats();

// export default function BookingScreen() {
//   const router = useRouter();
  
//   // State lưu các ghế đang chọn
//   const [selectedSeats, setSelectedSeats] = useState([]);

//   // Hàm xử lý chọn ghế
//   const handleSelectSeat = (seatId) => {
//     if (selectedSeats.includes(seatId)) {
//       // Nếu đã chọn rồi -> Bỏ chọn (Xóa khỏi mảng)
//       setSelectedSeats(selectedSeats.filter(id => id !== seatId));
//     } else {
//       // Nếu chưa chọn -> Thêm vào mảng
//       setSelectedSeats([...selectedSeats, seatId]);
//     }
//   };

//   // Tính tổng tiền
//   const totalPrice = selectedSeats.length * 90000; // 90k/vé

//   return (
//     <SafeAreaView style={styles.container}>
//       {/* HEADER */}
//       <View style={styles.header}>
//         <TouchableOpacity onPress={() => router.back()}>
//             <Text style={styles.backText}>← Trở về</Text>
//         </TouchableOpacity>
//         <Text style={styles.headerTitle}>Chọn Ghế</Text>
//       </View>

//       {/* MÀN HÌNH CHIẾU (SCREEN) */}
//       <View style={styles.screenContainer}>
//         <View style={styles.screenCurve} />
//         <Text style={styles.screenText}>MÀN HÌNH</Text>
//       </View>

//       <ScrollView contentContainerStyle={styles.seatContainer}>
//         {/* VẼ TỪNG HÀNG GHẾ */}
//         {SEAT_DATA.map((row, rowIndex) => (
//           <View key={rowIndex} style={styles.row}>
//             {row.map((seat, colIndex) => {
              
//               // Logic kiểm tra trạng thái
//               const isSelected = selectedSeats.includes(seat.id);
//               const isBooked = seat.status === 'booked';
//               const isVip = seat.type === 'vip';

//               // Logic tạo lối đi ở giữa
//               const marginRight = (colIndex + 1) === GAP_COL ? 30 : 5;

//               return (
//                 <TouchableOpacity
//                   key={seat.id}
//                   disabled={isBooked} // Nếu đã đặt thì không bấm được
//                   onPress={() => handleSelectSeat(seat.id)}
//                   style={[
//                     styles.seat,
//                     { marginRight: marginRight },
//                     isBooked && styles.seatBooked,   // Màu xám
//                     isSelected && styles.seatSelected, // Màu đỏ
//                     !isBooked && !isSelected && isVip && styles.seatVip // Viền VIP
//                   ]}
//                 >
//                   <Text style={[
//                     styles.seatText,
//                     isSelected && { color: 'white' }
//                   ]}>
//                     {seat.id}
//                   </Text>
//                 </TouchableOpacity>
//               );
//             })}
//           </View>
//         ))}

//         {/* CHÚ THÍCH */}
//         <View style={styles.legendContainer}>
//           <View style={styles.legendItem}>
//              <View style={[styles.seatMini, styles.seatBooked]} />
//              <Text>Đã bán</Text>
//           </View>
//           <View style={styles.legendItem}>
//              <View style={[styles.seatMini, styles.seatSelected]} />
//              <Text>Đang chọn</Text>
//           </View>
//            <View style={styles.legendItem}>
//              <View style={[styles.seatMini, styles.seatVip]} />
//              <Text>VIP</Text>
//           </View>
//         </View>

//       </ScrollView>

//       {/* FOOTER: THANH TOÁN */}
//       <View style={styles.footer}>
//         <View>
//           <Text style={styles.infoText}>
//              Ghế: {selectedSeats.join(', ')}
//           </Text>
//           <Text style={styles.priceText}>
//              {totalPrice.toLocaleString()} VNĐ
//           </Text>
//         </View>
        
//         <TouchableOpacity 
//            style={styles.btnBuy}
//            onPress={() => Alert.alert("Thanh toán", `Tổng tiền: ${totalPrice}đ`)}
//         >
//           <Text style={styles.btnBuyText}>Tiếp tục</Text>
//         </TouchableOpacity>
//       </View>

//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: '#fff', paddingTop: 40 },
//   header: { padding: 15, flexDirection: 'row', alignItems: 'center' },
//   backText: { fontSize: 18, color: '#007AFF', marginRight: 15 },
//   headerTitle: { fontSize: 20, fontWeight: 'bold' },
  
//   // Màn hình cong
//   screenContainer: { alignItems: 'center', marginVertical: 20 },
//   screenCurve: { 
//     width: '80%', height: 10, backgroundColor: '#ddd', borderRadius: 10,
//     shadowColor: "#000", shadowOffset: {width: 0, height: 10}, shadowOpacity: 0.3, elevation: 10
//   },
//   screenText: { marginTop: 5, color: '#aaa', fontSize: 12 },

//   // Lưới ghế
//   seatContainer: { alignItems: 'center', paddingBottom: 100 },
//   row: { flexDirection: 'row', marginBottom: 10 },
//   seat: { 
//     width: 35, height: 35, 
//     borderRadius: 8, 
//     justifyContent: 'center', alignItems: 'center',
//     backgroundColor: '#E0E0E0', // Màu mặc định (Trắng xám)
//   },
//   seatBooked: { backgroundColor: '#4a4a4a' }, // Màu đã đặt (Đen xám)
//   seatSelected: { backgroundColor: '#FF3B30' }, // Màu đang chọn (Đỏ)
//   seatVip: { borderWidth: 2, borderColor: '#FFD700', backgroundColor: '#fff' }, // Viền vàng VIP
  
//   seatText: { fontSize: 10, color: '#555' },
//   seatMini: { width: 20, height: 20, borderRadius: 4, marginRight: 5 },

//   // Chú thích
//   legendContainer: { flexDirection: 'row', marginTop: 20, gap: 20 },
//   legendItem: { flexDirection: 'row', alignItems: 'center' },

//   // Footer
//   footer: { 
//     position: 'absolute', bottom: 0, left: 0, right: 0, 
//     backgroundColor: 'white', padding: 20, 
//     flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
//     borderTopWidth: 1, borderTopColor: '#ddd',
//     elevation: 20
//   },
//   infoText: { fontSize: 14, color: 'gray' },
//   priceText: { fontSize: 20, fontWeight: 'bold', color: '#007AFF' },
//   btnBuy: { backgroundColor: '#007AFF', paddingHorizontal: 30, paddingVertical: 12, borderRadius: 8 },
//   btnBuyText: { color: 'white', fontWeight: 'bold', fontSize: 16 }
// });

import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  Dimensions,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

const { width } = Dimensions.get('window');

// --- CẤU HÌNH MÀU SẮC ---
const Colors = {
  primary: '#00ADEF',
  selected: '#EF4444',
  booked: '#4B5563',
  empty: '#E5E7EB',
  white: '#FFFFFF',
};

// --- DỮ LIỆU GHẾ ---
const SEAT_ROWS = [
  ['A1', 'A2', 'A3', 'A4', 'A5', 'A6', 'A7', 'A8'],
  ['B1', 'B2', 'B3', 'B4', 'B5', 'B6', 'B7', 'B8'],
  ['C1', 'C2', 'C3', 'C4', 'C5', 'C6', 'C7', 'C8'],
  ['D1', 'D2', 'D3', 'D4', 'D5', 'D6', 'D7', 'D8'],
  ['E1', 'E2', 'E3', 'E4', 'E5', 'E6', 'E7', 'E8'],
  ['F1', 'F2', 'F3', 'F4', 'F5', 'F6', 'F7', 'F8'],
];

const ROW_LABELS = ['A', 'B', 'C', 'D', 'E', 'F'];
const BOOKED_SEATS = ['A2', 'B3', 'E2', 'F4']; 

export default function BookingScreen() {
  const router = useRouter();
  const params = useLocalSearchParams(); 

  // --- 1. HÀM XỬ LÝ DỮ LIỆU TỪ TRANG TRƯỚC ---
  // Dịch ID rạp sang Tên rạp
  const getCinemaName = (id) => {
    const map = {
      'c1': 'CGV Vincom',
      'c2': 'CGV Crescent Mall',
      'c3': 'CGV Landmark 81'
    };
    return map[id] || 'CGV Vincom';
  };

  // Dịch ID ngày sang Ngày/Tháng (Giả sử khớp với dữ liệu trang trước)
  const getDateLabel = (id) => {
    // Vì trang trước bạn truyền ID (1,2,3...), ta map tạm sang ngày
    const map = { '1': '18/11', '2': '19/11', '3': '20/11', '4': '21/11', '5': '22/11' };
    return map[id] || '20/11';
  };

  const [selectedSeats, setSelectedSeats] = useState([]);

  const handleToggleSeat = (seatId) => {
    if (BOOKED_SEATS.includes(seatId)) return;
    if (selectedSeats.includes(seatId)) {
      setSelectedSeats(selectedSeats.filter(id => id !== seatId));
    } else {
      setSelectedSeats([...selectedSeats, seatId]);
    }
  };

  const totalPrice = selectedSeats.length * 90000;

  const renderSeat = (seatId) => {
    const isBooked = BOOKED_SEATS.includes(seatId);
    const isSelected = selectedSeats.includes(seatId);

    let backgroundColor = Colors.empty;
    let textColor = '#333';

    if (isBooked) {
      backgroundColor = Colors.booked;
      textColor = '#fff';
    } else if (isSelected) {
      backgroundColor = Colors.selected;
      textColor = '#fff';
    }

    return (
      <TouchableOpacity
        key={seatId}
        disabled={isBooked}
        onPress={() => handleToggleSeat(seatId)}
        style={[styles.seatBox, { backgroundColor }]}
      >
        <Text style={[styles.seatText, { color: textColor }]}>{seatId}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      
      {/* 2. HEADER: ĐÃ CẬP NHẬT HIỂN THỊ ĐÚNG DỮ LIỆU */}
      <SafeAreaView style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <View style={{ marginLeft: 15 }}>
            {/* Tên phim */}
            <Text style={styles.movieTitle}>{params.movieName || "Tên Phim"}</Text>
            
            {/* Thông tin chi tiết: Giờ • Ngày • Rạp */}
            <Text style={styles.movieSub}>
               {params.time || "09:00"} • {getDateLabel(params.date)} • {getCinemaName(params.cinema)}
            </Text>
          </View>
        </View>
      </SafeAreaView>

      <ScrollView contentContainerStyle={styles.scrollBody} showsVerticalScrollIndicator={false}>
        <View style={styles.screenContainer}>
           <View style={styles.screenCurve} />
           <Text style={styles.screenLabel}>MÀN HÌNH</Text>
        </View>

        <View style={styles.legendContainer}>
          <View style={styles.legendItem}><View style={[styles.legendBox, { backgroundColor: Colors.empty }]} /><Text style={styles.legendText}>Trống</Text></View>
          <View style={styles.legendItem}><View style={[styles.legendBox, { backgroundColor: Colors.booked }]} /><Text style={styles.legendText}>Đã bán</Text></View>
          <View style={styles.legendItem}><View style={[styles.legendBox, { backgroundColor: Colors.selected }]} /><Text style={styles.legendText}>Đang chọn</Text></View>
        </View>

        <View style={styles.seatGrid}>
          {SEAT_ROWS.map((row, rowIndex) => (
            <View key={rowIndex} style={styles.rowContainer}>
              <View style={styles.rowLabelContainer}>
                <Text style={styles.rowLabelText}>{ROW_LABELS[rowIndex]}</Text>
              </View>
              <View style={styles.seatsRow}>
                {row.map((seatId) => renderSeat(seatId))}
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* FOOTER */}
      <View style={styles.footer}>
        <View style={styles.footerInfo}>
          <View style={{ flex: 1 }}>
            <Text style={styles.labelTotal}>{selectedSeats.length} Ghế</Text>
            <Text style={styles.selectedSeatsText} numberOfLines={1}>
                {selectedSeats.length > 0 ? selectedSeats.join(', ') : 'Chưa chọn'}
            </Text>
          </View>
          <Text style={styles.priceTotal}>{totalPrice.toLocaleString()}đ</Text>
        </View>

        <TouchableOpacity 
          style={[styles.btnNext, { backgroundColor: selectedSeats.length > 0 ? Colors.primary : '#ccc' }]}
          disabled={selectedSeats.length === 0}
          onPress={() => {
            // CODE MỚI: Chuyển sang trang Bắp Nước và gửi kèm danh sách ghế
            router.push({
                pathname: '/movie/snacks',
                params: {
                ...params, // Truyền tiếp tên phim, rạp, ngày, giờ
                seats: selectedSeats.join(','), // Truyền ghế dạng chuỗi "E5,E6"
                }
            });
        }}
        >
          <Text style={styles.btnText}>TIẾP TỤC</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white' },
  header: { backgroundColor: Colors.primary, paddingTop: 45, paddingBottom: 15 },
  headerContent: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20 },
  movieTitle: { fontSize: 18, fontWeight: 'bold', color: 'white' },
  movieSub: { fontSize: 13, color: '#E0F2FE', marginTop: 4 }, // Tăng khoảng cách nhẹ
  scrollBody: { paddingBottom: 150 },
  
  screenContainer: { alignItems: 'center', marginTop: 30, marginBottom: 40 },
  screenCurve: { width: width * 0.8, height: 4, backgroundColor: '#DDD', borderRadius: 2 },
  screenLabel: { fontSize: 12, color: '#AAA', marginTop: 10, letterSpacing: 3 },

  legendContainer: { flexDirection: 'row', justifyContent: 'center', gap: 15, marginBottom: 40 },
  legendItem: { flexDirection: 'row', alignItems: 'center' },
  legendBox: { width: 16, height: 16, borderRadius: 4, marginRight: 6 },
  legendText: { fontSize: 12, color: '#666' },

  seatGrid: { 
    alignItems: 'center', 
    width: '100%',
    paddingHorizontal: 20 
  },
  rowContainer: { 
    flexDirection: 'row', 
    marginBottom: 8, 
    alignItems: 'center',
    justifyContent: 'center' 
  },
  rowLabelContainer: { 
    width: 20, 
    alignItems: 'center', 
    marginRight: 8 
  },
  rowLabelText: { fontSize: 14, fontWeight: 'bold', color: '#999' },
  
  seatsRow: {
    flexDirection: 'row',
    justifyContent: 'center'
  },
  seatBox: { 
    width: 34, 
    height: 34, 
    borderRadius: 6, 
    justifyContent: 'center', 
    alignItems: 'center',
    marginHorizontal: 3 
  },
  seatText: { fontSize: 10, fontWeight: '700' },

  footer: { 
    position: 'absolute', bottom: 0, width: '100%', 
    backgroundColor: 'white', padding: 20, 
    borderTopWidth: 1, borderTopColor: '#EEE', elevation: 10 
  },
  footerInfo: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15, alignItems: 'center' },
  labelTotal: { fontSize: 12, color: '#888' },
  selectedSeatsText: { fontSize: 15, fontWeight: 'bold', color: '#333' },
  priceTotal: { fontSize: 22, fontWeight: 'bold', color: Colors.primary },
  btnNext: { paddingVertical: 15, borderRadius: 12, alignItems: 'center' },
  btnText: { color: 'white', fontWeight: 'bold', fontSize: 16 }
});