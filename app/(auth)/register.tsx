import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '../../constants/theme'; // Import màu đã định nghĩa

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = () => {
    // Logic giả lập đăng nhập
    if(email && password) {
      router.replace('/(auth)/login'); // Đăng nhập xong thì bay vào login
    } else {    
      alert("Vui lòng nhập Email và Pass!");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Logo hoặc Tên App */}
      <View style={styles.header}>
        <Text style={styles.appName}>CINEBOOK</Text>
        <Text style={styles.subTitle}>Đặt vé phim online</Text>
      </View>

      {/* Form Nhập liệu */}
      <View style={styles.form}>
        <TextInput 
          placeholder="Email hoặc số điện thoại" 
          style={styles.input} 
          placeholderTextColor={Colors.textLight}
          value={email}
          onChangeText={setEmail}
        />
        <TextInput 
          placeholder="Mật khẩu" 
          secureTextEntry 
          style={styles.input} 
          placeholderTextColor={Colors.textLight}
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity style={styles.btnPrimary} onPress={handleLogin}>
          <Text style={styles.btnText}>Đăng nhập</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push('/(auth)/register')}>
           <Text style={styles.linkText}>Chưa có tài khoản? <Text style={{color: Colors.primary, fontWeight: 'bold'}}>Đăng ký</Text></Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background, justifyContent: 'center', padding: 20 },
  header: { alignItems: 'center', marginBottom: 50 },
  appName: { fontSize: 40, fontWeight: '900', color: Colors.primary, letterSpacing: 2 },
  subTitle: { fontSize: 16, color: Colors.textLight, marginTop: 10 },
  form: { width: '100%' },
  input: { 
    backgroundColor: Colors.gray, 
    padding: 15, borderRadius: 10, marginBottom: 15, 
    fontSize: 16, color: Colors.text 
  },
  btnPrimary: { 
    backgroundColor: Colors.primary, 
    padding: 15, borderRadius: 10, alignItems: 'center', marginTop: 10 
  },
  btnText: { color: Colors.white, fontWeight: 'bold', fontSize: 18 },
  linkText: { textAlign: 'center', marginTop: 20, color: Colors.textLight }
});