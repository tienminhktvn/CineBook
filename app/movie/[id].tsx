import React from 'react';
import { 
  View, Text, Image, StyleSheet, ScrollView, 
  TouchableOpacity, Dimensions, StatusBar, SafeAreaView 
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

// Lấy chiều cao màn hình để chỉnh ảnh bìa
const { height, width } = Dimensions.get('window');

// --- MÀU SẮC THEO THIẾT KẾ ---
const Colors = {
  primary: '#00ADEF', // Màu xanh chủ đạo
  white: '#FFFFFF',
  text: '#000',
  textGray: '#666',
  overlay: 'rgba(0,0,0,0.6)', // Màu đen mờ để che lên ảnh
};

// --- DỮ LIỆU GIẢ (Để tìm phim theo ID) ---
// (Lưu ý: Sau này có API thì không cần cái này nữa)
const ALL_MOVIES = [
  { 
    id: 'banner_1', 
    name: 'Đất Rừng Phương Nam', 
    image: require('../../assets/imageThem/muaDo.jpg'),
    desc: 'Hành trình đi tìm cha của cậu bé An giữa thiên nhiên phương Nam hùng vĩ và những con người hào sảng, nghĩa tình.',
    time: '110 phút', year: '2023', rating: 9.5
  },
  { 
    id: '1', name: 'Zootopia 2', image: require('../../assets/imageThem/caotho.jpg'),
    desc: 'Zootopia 2 tiếp tục câu chuyện về bộ đôi thỏ cảnh sát Judy Hopps và cáo Nick Wilde trong những vụ án mới.',
    time: '100 phút', year: '2024', rating: 8.9
  },
  { 
    id: '2', name: 'Avengers: Endgame', image: require('../../assets/imageThem/Avengers.jpg'),
    desc: 'Sau sự kiện thảm khốc của Infinity War, vũ trụ đang trong tình trạng hỗn loạn. Các siêu anh hùng còn lại tập hợp để đảo ngược hành động của Thanos.',
    time: '181 phút', year: '2019', rating: 9.8
  },
  // ... Bạn có thể thêm các phim khác vào đây nếu muốn test
];

export default function MovieDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams(); // Lấy ID phim từ trang chủ gửi sang
  
  // Tìm thông tin phim dựa trên ID (Logic Lookup)
  // Nếu không tìm thấy (ví dụ phim chưa khai báo) thì lấy phim đầu tiên làm mặc định để không lỗi
  const movie = ALL_MOVIES.find(m => m.id === params.id) || ALL_MOVIES[2]; 

  return (
    <View style={styles.container}>
      {/* Ẩn thanh trạng thái để ảnh tràn lên trên cùng nhìn cho đẹp */}
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      <ScrollView contentContainerStyle={{ paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
        
        {/* --- PHẦN 1: POSTER & THÔNG TIN HEADER --- */}
        <View style={styles.headerContainer}>
          <Image source={movie.image} style={styles.posterImage} resizeMode="cover" />
          
          {/* Lớp phủ đen mờ để chữ trắng nổi bật */}
          <View style={styles.gradientOverlay} />

          {/* Nút Back */}
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={28} color="white" />
          </TouchableOpacity>

          {/* Thông tin đè lên ảnh */}
          <View style={styles.headerInfo}>
            <Text style={styles.movieTitle}>{movie.name}</Text>
            
            <View style={styles.metaInfo}>
              <View style={styles.badge}>
                 <Ionicons name="star" size={14} color="#FFD700" />
                 <Text style={styles.badgeText}>{movie.rating}</Text>
              </View>
              <Text style={styles.dot}>•</Text>
              <Text style={styles.metaText}>{movie.time}</Text>
              <Text style={styles.dot}>•</Text>
              <Text style={styles.metaText}>{movie.year}</Text>
            </View>
          </View>
        </View>

        {/* --- PHẦN 2: NỘI DUNG CHI TIẾT --- */}
        <View style={styles.bodyContainer}>
          
          {/* Nội dung phim */}
          <Text style={styles.sectionTitle}>Nội dung phim</Text>
          <Text style={styles.synopsis}>{movie.desc}</Text>

          {/* Trailer giả lập */}
          <Text style={styles.sectionTitle}>Trailer</Text>
          <View style={styles.trailerContainer}>
            {/* Giả lập khung video màu tím */}
            <View style={styles.videoPlaceholder}>
               <View style={styles.playButtonCircle}>
                  <Ionicons name="play" size={30} color={Colors.primary} style={{ marginLeft: 5 }} />
               </View>
            </View>
          </View>

        </View>
      </ScrollView>

      {/* --- PHẦN 3: FOOTER NÚT ĐẶT VÉ (Cố định ở đáy) --- */}
      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.btnBooking}
          onPress={() => {
            // SỬA THÀNH ĐƯỜNG DẪN NÀY:
            router.push({
              pathname: '/movie/select-showtime',
              params: { movieName: movie.name } // Truyền tên phim sang để hiển thị ở Header
            });
          }}
        >
          <Text style={styles.btnText}>ĐẶT VÉ NGAY</Text>
        </TouchableOpacity>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.white },

  // --- Header Styles ---
  headerContainer: {
    height: height * 0.55, // Chiếm 55% chiều cao màn hình
    position: 'relative',
  },
  posterImage: {
    width: '100%',
    height: '100%',
  },
  gradientOverlay: {
    ...StyleSheet.absoluteFillObject, // Phủ kín cha
    backgroundColor: 'rgba(0,0,0,0.3)', // Đen mờ 30% toàn ảnh
    justifyContent: 'flex-end', // Đẩy nội dung xuống đáy
  },
  backButton: {
    position: 'absolute',
    top: 50, // Cách đỉnh (tránh tai thỏ)
    left: 20,
    width: 40, height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.5)', // Nền tròn mờ sau nút back
    alignItems: 'center', justifyContent: 'center'
  },
  headerInfo: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '100%',
    padding: 20,
    // Tạo hiệu ứng đen dần ở dưới chân ảnh để chữ rõ hơn
    backgroundColor: 'rgba(0,0,0,0.4)', 
  },
  movieTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 10,
    textShadowColor: 'rgba(0, 0, 0, 0.75)', // Bóng chữ
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10
  },
  metaInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  badge: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 8, paddingVertical: 4,
    borderRadius: 5,
  },
  badgeText: { color: 'white', fontWeight: 'bold', marginLeft: 5 },
  dot: { color: 'white', marginHorizontal: 10 },
  metaText: { color: '#e0e0e0', fontSize: 14 },

  // --- Body Styles ---
  bodyContainer: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18, fontWeight: 'bold', color: Colors.text,
    marginBottom: 10, marginTop: 10
  },
  synopsis: {
    color: Colors.textGray,
    lineHeight: 22, // Giãn dòng cho dễ đọc
    fontSize: 15,
    textAlign: 'justify' // Căn đều 2 bên
  },
  
  // Trailer Styles
  trailerContainer: {
    marginTop: 10,
    borderRadius: 15,
    overflow: 'hidden',
    height: 200,
  },
  videoPlaceholder: {
    flex: 1,
    backgroundColor: '#7B61FF', // Màu tím giống thiết kế
    alignItems: 'center', justifyContent: 'center'
  },
  playButtonCircle: {
    width: 60, height: 60,
    borderRadius: 30,
    backgroundColor: 'white',
    alignItems: 'center', justifyContent: 'center',
    elevation: 5
  },

  // --- Footer Styles ---
  footer: {
    position: 'absolute',
    bottom: 0, left: 0, right: 0,
    padding: 20,
    backgroundColor: 'white',
    borderTopWidth: 1, borderTopColor: '#eee',
    // Đổ bóng cho footer nổi lên
    elevation: 20,
    shadowColor: "#000", shadowOffset: { width: 0, height: -3 }, shadowOpacity: 0.1,
  },
  btnBooking: {
    backgroundColor: Colors.primary, // Nút Xanh
    paddingVertical: 15,
    borderRadius: 30, // Bo tròn nhiều
    alignItems: 'center',
  },
  btnText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  }
});