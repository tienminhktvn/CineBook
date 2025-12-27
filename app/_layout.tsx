import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* Mặc định vào màn hình Auth trước */}
      <Stack.Screen name="(auth)" />
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="movie" options={{ presentation: 'modal' }} /> 
    </Stack>
  );
}