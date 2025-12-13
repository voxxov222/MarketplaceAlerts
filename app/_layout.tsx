import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from '../hooks/useAuth';
import { AlertsProvider } from '../hooks/useAlerts';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <AlertsProvider>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="login" />
            <Stack.Screen
              name="create-alert"
              options={{
                headerShown: true,
                title: 'Create Alert',
                presentation: 'modal',
              }}
            />
          </Stack>
        </AlertsProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
