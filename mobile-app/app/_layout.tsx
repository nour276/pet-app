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
          <Stack.Screen name="add-pet" />
          <Stack.Screen name="pair-device" />
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="chat-vet" />
        </Stack>
        <StatusBar style="dark" />
      </>
    </PetProvider>
  );
}