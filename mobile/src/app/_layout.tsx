import { QueryClientProvider } from '@tanstack/react-query'
import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { colors } from '@/constants/theme'
import { queryClient } from '@/lib/queryClient'

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <QueryClientProvider client={queryClient}>
          <StatusBar style="light" />
          <Stack
            screenOptions={{
              headerShown: false,
              contentStyle: { backgroundColor: colors.background },
              animation: 'fade_from_bottom',
            }}
          >
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="title/[id]" options={{ animation: 'slide_from_right' }} />
            <Stack.Screen name="watch/[id]/[ep]" options={{ animation: 'fade' }} />
            <Stack.Screen name="reels" options={{ animation: 'slide_from_bottom' }} />
            <Stack.Screen name="settings" options={{ animation: 'slide_from_right' }} />
            <Stack.Screen name="profile" options={{ animation: 'slide_from_right' }} />
            <Stack.Screen name="pricing" options={{ animation: 'slide_from_right' }} />
            <Stack.Screen name="about" options={{ animation: 'slide_from_right' }} />
            <Stack.Screen name="help" options={{ animation: 'slide_from_right' }} />
            <Stack.Screen name="contact" options={{ animation: 'slide_from_right' }} />
            <Stack.Screen name="legal" options={{ animation: 'slide_from_right' }} />
            <Stack.Screen name="sign-in" options={{ animation: 'slide_from_bottom' }} />
            <Stack.Screen name="sign-up" options={{ animation: 'slide_from_bottom' }} />
            <Stack.Screen name="landing" options={{ animation: 'fade' }} />
          </Stack>
        </QueryClientProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  )
}
