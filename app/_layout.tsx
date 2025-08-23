import React from 'react';
import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import { SplashScreen } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { Provider } from 'react-redux';
import { store } from '@/store/store';
import { PersistGate } from 'redux-persist/integration/react';
import { persistor } from '@/store/store';
import { useSelector, useDispatch } from 'react-redux';
import { selectIsDark } from '@/store/themeSlice';
import { selectUser, selectToken, fetchUserDetails } from '@/store/authSlice';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

declare global {
  interface Window {
    frameworkReady?: () => void;
  }
}

// Prevent the splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

// Font change: Now using DM Sans for the entire application.
// TODO: Ensure DMSans-Regular.ttf, DMSans-Medium.ttf, DMSans-Bold.ttf are present in assets/fonts/
function AppLayout() {
  const dispatch = useDispatch();
  const isDark = useSelector(selectIsDark);
  const user = useSelector(selectUser);
  const token = useSelector(selectToken);
  const isAuthenticated = !!(user && token);
  
  const [fontsLoaded] = useFonts({
    'DMSans-Regular': require('../assets/fonts/DMSans-Regular.ttf'),
    'DMSans-Medium': require('../assets/fonts/DMSans-Medium.ttf'),
    'DMSans-SemiBold': require('../assets/fonts/DMSans-SemiBold.ttf'),
    'DMSans-Bold': require('../assets/fonts/DMSans-Bold.ttf'),
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
      window.frameworkReady?.();
    }
  }, [fontsLoaded]);

  // Fetch user details when app starts and user is authenticated
  useEffect(() => {
    if (isAuthenticated && user?.id && fontsLoaded) {
      console.log('App initialized - fetching user details for user ID:', user.id);
      dispatch(fetchUserDetails(user.id) as any);
    }
  }, [isAuthenticated, user?.id, fontsLoaded, dispatch]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <>
      <Stack screenOptions={{ 
        headerShown: false,
        contentStyle: { 
          backgroundColor: isDark ? '#121212' : '#F8F8F8' 
        }
      }}>
        <Stack.Screen name="onboarding" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="product/[id]" options={{ presentation: 'card' }} />
        <Stack.Screen name="product/reviews" options={{ presentation: 'card' }} />
        <Stack.Screen name="checkout" options={{ presentation: 'card' }} />
        <Stack.Screen name="order-tracking/[id]" options={{ presentation: 'card' }} />
        <Stack.Screen name="notifications" options={{ presentation: 'card' }} />
        <Stack.Screen name="profile/orders" options={{ presentation: 'card' }} />
        <Stack.Screen name="profile/addresses" options={{ presentation: 'card' }} />
        <Stack.Screen name="profile/payment-methods" options={{ presentation: 'card' }} />
        <Stack.Screen name="profile/wishlist" options={{ presentation: 'card' }} />
        <Stack.Screen name="profile/edit-profile" options={{ presentation: 'card' }} />
        <Stack.Screen name="deploy" options={{ presentation: 'card' }} />
        <Stack.Screen name="address-selection" options={{ presentation: 'card' }} />
        <Stack.Screen name="+not-found" options={{ title: 'Oops!' }} />
      </Stack>
      <StatusBar style={isDark ? 'light' : 'dark'} />
    </>
  );
}

const queryClient = new QueryClient();

export default function RootLayout() {
  useFrameworkReady();
  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <AppLayout />
          </PersistGate>
        </Provider>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}