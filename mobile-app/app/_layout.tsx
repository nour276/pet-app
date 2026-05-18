import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { PetProvider } from './context/PetContext';

export default function RootLayout() {
  return (
    <PetProvider>
      <>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="splash" />
          <Stack.Screen name="onboarding" />
          <Stack.Screen name="login" />
          <Stack.Screen name="choose-role" />
          <Stack.Screen name="register-owner" />
          <Stack.Screen name="register-vet" />
          <Stack.Screen name="book-appointment" />
          <Stack.Screen name="add-pet" />
          <Stack.Screen name="pair-device" />
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="chat-vet" />
          <Stack.Screen name="vet-login" />
          <Stack.Screen name="(vet-tabs)" />
          <Stack.Screen name="secretary" />
          <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
        </Stack>
        <StatusBar style="dark" />
      </>
    </PetProvider>
  );
}