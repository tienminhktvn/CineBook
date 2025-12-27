// import { useRouter } from 'expo-router';
// import React from 'react';
// import { FlatList, Image, SafeAreaView, StyleSheet, Text, TouchableOpacity, View, StatusBar } from 'react-native';

// // 1. IMPORT MÀU SẮC TỪ FILE CONSTANTS
// // Dấu ../../ nghĩa là lùi ra 2 cấp thư mục để tìm folder constants
// import { Colors } from '../../constants/theme'; 

// // 2. DỮ LIỆU GIẢ
// const DANH_SACH_PHIM = [
//   {
//     id: '1',
//     name: 'Fast & Furious X',
//     image: 'https://image.tmdb.org/t/p/w500/1E5baAaEse26fej7uHcjOgEE2t2.jpg',
//     rating: '7.5',
//     desc: 'Dom Toretto và gia đình phải đối mặt với kẻ thù nguy hiểm nhất từ trước đến nay.'
//   },
//   {
//     id: '2',
//     name: 'Avatar: Dòng Chảy Của Nước',
//     image: 'https://image.tmdb.org/t/p/w500/t6HIqrRAclMCA60NsSmeqe9RmNV.jpg',
//     rating: '8.0',
//     desc: 'Jake Sully sống cùng gia đình mới của mình trên hành tinh Pandora.'
//   },
//   {
//     id: '3',
//     name: 'Người Nhện: Du Hành Vũ Trụ',
//     image: 'https://image.tmdb.org/t/p/w500/8Vt6mWEReuy4Of61Lnj5Xj704m8.jpg',
//     rating: '9.0',
//     desc: 'Miles Morales tái xuất trong chương tiếp theo của saga Spider-Verse.'
//   },
//   {
//     id: '4',
//     name: 'Doraemon: Nobita và vùng đất lý tưởng',
//     image: 'https://image.tmdb.org/t/p/w500/qjGrUmKW78MCFG8zUzoVj8qXm8r.jpg',
//     rating: '8.5',
//     desc: 'Doraemon và Nobita bay đến một hòn đảo hình lưỡi liềm trên bầu trời.'
//   }
// ];

// export default function HomeScreen() {
//   const router = useRouter();

//   const renderMovieItem = ({ item }) => (
//     <View style={styles.cardContainer}>
//       <Image source={{ uri: item.image }} style={styles.poster} />

//       <View style={styles.infoContainer}>
//         <Text style={styles.movieTitle}>{item.name}</Text>
//         <Text style={styles.rating}>⭐ {item.rating}/10</Text>
//         <Text numberOfLines={2} style={styles.desc}>{item.desc}</Text>
        
//         <TouchableOpacity 
//           style={styles.buttonBuy}
//           onPress={() => {
//             // 3. ĐIỀU HƯỚNG MỚI (QUAN TRỌNG)
//             // Vì bạn đã tạo thư mục movie/[id].tsx nên đường dẫn sẽ là:
//             router.push({
//               pathname: "/movie/[id]", // Đường dẫn dynamic
//               params: { id: item.id, name: item.name } // Truyền ID và Tên
//             });
//           }}
//         >
//            <Text style={styles.textButton}>ĐẶT VÉ</Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   );

//   return (
//     <SafeAreaView style={styles.container}>
//       <StatusBar barStyle="dark-content" />
//       <Text style={styles.headerTitle}>Phim Đang Chiếu</Text>
      
//       <FlatList
//         data={DANH_SACH_PHIM}
//         renderItem={renderMovieItem}
//         keyExtractor={item => item.id}
//         contentContainerStyle={{ paddingBottom: 20 }}
//         showsVerticalScrollIndicator={false}
//       />
//     </SafeAreaView>
//   );
// }

// // 4. STYLE DÙNG BIẾN MÀU TỪ CONSTANTS
// const styles = StyleSheet.create({
//   container: { 
//     flex: 1, 
//     backgroundColor: Colors.background, // Dùng màu từ file Colors
//     padding: 20, 
//   },
//   headerTitle: { 
//     fontSize: 26, 
//     fontWeight: '800', 
//     marginBottom: 20, 
//     color: Colors.text, // Chữ màu đen xám
//     marginTop: 10
//   },
//   cardContainer: { 
//     flexDirection: 'row', 
//     backgroundColor: Colors.white, // Nền trắng
//     borderRadius: 16, 
//     padding: 12, 
//     marginBottom: 15,
//     // Shadow
//     shadowColor: '#000', 
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.05,
//     shadowRadius: 10,
//     elevation: 4 
//   },
//   poster: { 
//     width: 100, 
//     height: 150, 
//     borderRadius: 12,
//     backgroundColor: '#eee'
//   },
//   infoContainer: { 
//     marginLeft: 15, 
//     flex: 1, 
//     justifyContent: 'space-between', 
//     paddingVertical: 5
//   },
//   movieTitle: { 
//     fontSize: 18, 
//     fontWeight: 'bold', 
//     marginBottom: 5,
//     color: Colors.text 
//   },
//   rating: { 
//     color: '#FFD700', 
//     fontWeight: 'bold', 
//     fontSize: 14,
//     marginBottom: 5 
//   },
//   desc: { 
//     color: Colors.textLight, // Chữ màu nhạt
//     fontSize: 13, 
//     marginBottom: 10,
//     lineHeight: 18 
//   },
//   buttonBuy: { 
//     backgroundColor: Colors.primary, // MÀU XANH CHỦ ĐẠO
//     paddingVertical: 10, 
//     borderRadius: 8, 
//     alignItems: 'center', 
//     width: '100%', 
//     marginTop: 5
//   },
//   textButton: { 
//     color: Colors.white, 
//     fontWeight: 'bold',
//     fontSize: 14
//   }
// });

import { useRouter } from 'expo-router';
import React from 'react';
import { 
  Image, 
  SafeAreaView, 
  ScrollView, 
  StyleSheet, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  View, 
  Dimensions 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Để lấy icon kính lúp


// Lấy chiều rộng màn hình để chia cột cho đẹp
const { width } = Dimensions.get('window');
const COLUMN_COUNT = 3;
const ITEM_WIDTH = (width - 40) / COLUMN_COUNT - 10; // Trừ padding 2 bên và khoảng cách giữa các ảnh

// --- MÀU SẮC THEO THIẾT KẾ ---
const Colors = {
  headerBg: '#00ADEF', // Màu xanh nền header
  background: '#FFFFFF',
  text: '#000000',
  redBtn: '#E50914', // Màu đỏ nút Đặt ngay
  grayInput: '#E0E0E0',
};

// --- DỮ LIỆU GIẢ (MOCK DATA) ---
const BANNER_MOVIE = {
  id: 'banner_1',
  name: 'Mưa đỏ',
  image: require('../../assets/imageThem/muaDo.jpg'), // Link ảnh mẫu
};

const MOVIES = [
  { id: '1', name: 'Zootopia 2', image: require('../../assets/imageThem/caotho.jpg') }, // Đã đổi tên bỏ dấu &
  { id: '2', name: 'End Game', image: require('../../assets/imageThem/Avengers.jpg') },
  { id: '3', name: 'Avatar 2', image: require('../../assets/imageThem/avata.jpg') },
  { id: '4', name: 'Doraemon', image: require('../../assets/imageThem/Doraemon.png') }, // Sửa lỗi chính tả Draemon
  { id: '5', name: 'Conan', image: require('../../assets/imageThem/Conan.png') },
  { id: '6', name: 'One Piece', image: require('../../assets/imageThem/onepiece.png') },
];

export default function HomeScreen() {
  const router = useRouter();

  // Hàm chuyển trang khi bấm vào phim
  const goToDetail = (movie) => {
    router.push({
      pathname: "/movie/[id]",
      params: { id: movie.id, name: movie.name }
    });
  };

  return (
    <View style={styles.container}>
      
      {/* --- PHẦN 1: HEADER (MÀU XANH) --- */}
      <SafeAreaView style={styles.headerContainer}>
        <View style={styles.headerContent}>
          {/* Logo */}
          <Text style={styles.logoText}>CINEBOOK</Text>
          
          {/* Thanh tìm kiếm */}
          <View style={styles.searchBar}>
            <Text style={styles.searchText}>Search</Text>
            <Ionicons name="search" size={20} color="black" />
          </View>

          {/* Nút Đăng nhập */}
          <TouchableOpacity 
            style={styles.loginBtn}
            onPress={() => router.push('/(auth)/login')} // Bấm vào thì sang trang Login
          >
            <Text style={styles.loginText}>Đăng nhập</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      {/* --- PHẦN THÂN TRANG (Cuộn được) --- */}
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 20 }}>
        
        {/* --- PHẦN 2: BANNER --- */}
        <View style={styles.bannerContainer}>
          <Image source={BANNER_MOVIE.image} style={styles.bannerImage} />
          {/* Nút Đặt Ngay màu đỏ đè lên ảnh */}
          <TouchableOpacity style={styles.bookingBtn} onPress={() => goToDetail(BANNER_MOVIE)}>
            <Text style={styles.bookingText}>Đặt ngay</Text>
          </TouchableOpacity>
        </View>

        {/* --- PHẦN 3: DANH SÁCH PHIM --- */}
        <View style={styles.listSection}>
          <Text style={styles.sectionTitle}>Đang chiếu</Text>
          
          {/* Grid Layout (Xếp lưới) */}
          <View style={styles.gridContainer}>
            {MOVIES.map((item) => (
              <TouchableOpacity 
                key={item.id} 
                style={styles.movieItem}
                onPress={() => goToDetail(item)}
              >
                <Image source={item.image} style={styles.moviePoster} />
                <Text style={styles.movieName} numberOfLines={1}>{item.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },

  // --- Style Header ---
  headerContainer: {
    backgroundColor: Colors.headerBg, // Màu xanh
    paddingTop: 30, // Tránh tai thỏ (nếu SafeAreaView không tự nhận)
    paddingBottom: 10,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    height: 50,
  },
  logoText: {
    fontSize: 20,
    fontWeight: '900', // Siêu đậm
    color: 'black',
  },
  searchBar: {
    flex: 1, // Tự co giãn chiếm chỗ trống
    flexDirection: 'row',
    backgroundColor: Colors.grayInput,
    borderRadius: 5,
    paddingHorizontal: 10,
    height: 35,
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 10, // Cách logo và nút login ra
  },
  searchText: { color: 'gray' },
  loginBtn: {
    backgroundColor: Colors.grayInput,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  loginText: { fontSize: 12, fontWeight: 'bold' },

  // --- Style Banner ---
  bannerContainer: {
    margin: 15,
    borderRadius: 15,
    overflow: 'hidden', // Để bo góc ảnh
    position: 'relative', // Để đặt nút Đặt ngay đè lên
  },
  bannerImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  bookingBtn: {
    position: 'absolute', // Đè lên ảnh
    bottom: 10,
    right: 10,
    backgroundColor: Colors.redBtn,
    paddingVertical: 6,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  bookingText: { color: 'white', fontWeight: 'bold', fontSize: 12 },

  // --- Style List ---
  listSection: { paddingHorizontal: 15 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 15, textAlign: 'center' },
  
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap', // Tự xuống dòng khi hết chỗ
    justifyContent: 'space-between', // Dãn đều
  },
  movieItem: {
    width: ITEM_WIDTH, // Độ rộng tính toán theo màn hình
    marginBottom: 20,
    alignItems: 'center',
  },
  moviePoster: {
    width: '100%',
    height: 140,
    borderRadius: 10,
    marginBottom: 5,
    resizeMode: 'cover',
  },
  movieName: {
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
  }
});