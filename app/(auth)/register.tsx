import React, { useState } from 'react';
import { 
  View, Text, TextInput, TouchableOpacity, 
  StyleSheet, SafeAreaView, ScrollView, Alert, StatusBar 
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

// --- MÀU SẮC ---
const Colors = {
  primary: '#00ADEF', // Xanh chủ đạo
  bg: '#FFFFFF',
  text: '#1F2937',
  textGray: '#9CA3AF',
  inputBg: '#F3F4F6',
};

export default function RegisterScreen() {
  const router = useRouter();
  
  // State quản lý dữ liệu nhập vào
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Ẩn/Hiện mật khẩu
  const [showPass, setShowPass] = useState(false);

  const handleRegister = () => {
    // 1. Kiểm tra dữ liệu trống
    if (!fullName || !phone || !email || !password) {
      Alert.alert("Lỗi", "Vui lòng điền đầy đủ thông tin!");
      return;
    }

    // 2. Kiểm tra mật khẩu trùng khớp
    if (password !== confirmPassword) {
      Alert.alert("Lỗi", "Mật khẩu nhập lại không khớp!");
      return;
    }

    // 3. Giả lập đăng ký thành công
    Alert.alert(
      "Thành công", 
      "Tài khoản đã được tạo. Vui lòng đăng nhập.",
      [
        { text: "OK", onPress: () => router.back() } // Quay lại trang Login
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* Nút Back nhỏ ở góc trên */}
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={24} color={Colors.text} />
      </TouchableOpacity>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* HEADER */}
        <View style={styles.header}>
          <Text style={styles.title}>Tạo tài khoản</Text>
          <Text style={styles.subTitle}>Đăng ký thành viên CineBook ngay</Text>
        </View>

        {/* FORM */}
        <View style={styles.form}>
          
          <Text style={styles.label}>Họ và tên</Text>
          <TextInput 
            style={styles.input} 
            placeholder="Nguyễn Văn A" 
            placeholderTextColor={Colors.textGray}
            value={fullName}
            onChangeText={setFullName}
          />

          <Text style={styles.label}>Số điện thoại</Text>
          <TextInput 
            style={styles.input} 
            placeholder="0912xxxxxx" 
            keyboardType="phone-pad"
            placeholderTextColor={Colors.textGray}
            value={phone}
            onChangeText={setPhone}
          />

          <Text style={styles.label}>Email</Text>
          <TextInput 
            style={styles.input} 
            placeholder="email@example.com" 
            keyboardType="email-address"
            placeholderTextColor={Colors.textGray}
            value={email}
            onChangeText={setEmail}
          />

          <Text style={styles.label}>Mật khẩu</Text>
          <View style={styles.passwordContainer}>
            <TextInput 
              style={styles.inputPass} 
              placeholder="Nhập mật khẩu" 
              secureTextEntry={!showPass}
              placeholderTextColor={Colors.textGray}
              value={password}
              onChangeText={setPassword}
            />
            <TouchableOpacity onPress={() => setShowPass(!showPass)} style={styles.eyeIcon}>
               <Ionicons name={showPass ? "eye-off" : "eye"} size={20} color={Colors.textGray} />
            </TouchableOpacity>
          </View>

          <Text style={styles.label}>Xác nhận mật khẩu</Text>
          <TextInput 
            style={styles.input} 
            placeholder="Nhập lại mật khẩu" 
            secureTextEntry={!showPass}
            placeholderTextColor={Colors.textGray}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />

          {/* NÚT ĐĂNG KÝ */}
          <TouchableOpacity style={styles.btnRegister} onPress={handleRegister}>
            <Text style={styles.btnText}>ĐĂNG KÝ</Text>
          </TouchableOpacity>

        </View>

        {/* FOOTER */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Đã có tài khoản? </Text>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.loginLink}>Đăng nhập ngay</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  backButton: { padding: 20 },
  
  scrollContent: { paddingHorizontal: 25, paddingBottom: 40 },
  
  header: { marginBottom: 30, marginTop: 10 },
  title: { fontSize: 30, fontWeight: 'bold', color: Colors.primary, marginBottom: 5 },
  subTitle: { fontSize: 16, color: Colors.textGray },

  form: { width: '100%' },
  label: { fontSize: 14, fontWeight: '600', color: Colors.text, marginBottom: 8, marginLeft: 2 },
  
  input: { 
    backgroundColor: Colors.inputBg, 
    padding: 15, borderRadius: 12, marginBottom: 20, 
    fontSize: 16, color: Colors.text 
  },
  
  // Input password có icon mắt
  passwordContainer: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: Colors.inputBg,
    borderRadius: 12, marginBottom: 20,
  },
  inputPass: { flex: 1, padding: 15, fontSize: 16, color: Colors.text },
  eyeIcon: { padding: 15 },

  btnRegister: { 
    backgroundColor: Colors.primary, 
    padding: 16, borderRadius: 12, 
    alignItems: 'center', marginTop: 10,
    shadowColor: Colors.primary, shadowOpacity: 0.3, shadowRadius: 10, elevation: 5
  },
  btnText: { color: 'white', fontWeight: 'bold', fontSize: 16 },

  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 30 },
  footerText: { color: Colors.textGray, fontSize: 15 },
  loginLink: { color: Colors.primary, fontWeight: 'bold', fontSize: 15 }
});