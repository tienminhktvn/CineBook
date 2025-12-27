import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons'; // Thư viện icon của Expo
import { Colors } from '../../constants/theme';

export default function TabLayout() {
  return (
    <Tabs screenOptions={{ 
      headerShown: false, 
      tabBarActiveTintColor: Colors.primary, // Màu icon khi được chọn
      tabBarInactiveTintColor: Colors.textLight 
    }}>
      <Tabs.Screen 
        name="index" 
        options={{ 
          title: 'Trang chủ',
          tabBarIcon: ({ color }) => <Ionicons name="home" size={24} color={color} />
        }} 
      />
      <Tabs.Screen 
        name="ticket" 
        options={{ 
          title: 'Vé của tôi',
          tabBarIcon: ({ color }) => <Ionicons name="ticket" size={24} color={color} />
        }} 
      />
      <Tabs.Screen 
        name="profile" 
        options={{ 
          title: 'Cá nhân',
          tabBarIcon: ({ color }) => <Ionicons name="person" size={24} color={color} />
        }} 
      />
    </Tabs>
  );
}