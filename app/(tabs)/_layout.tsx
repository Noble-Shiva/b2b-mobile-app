import { Tabs } from 'expo-router';
import React from 'react';
import { Platform, Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import CartBadge from '@/components/cart/CartBadge';
import { useSelector } from 'react-redux';
import { selectTotalItems } from '@/store/cartSlice';
import { selectIsDark } from '@/store/themeSlice';
import { colors as themeColors } from '@/utils/theme';

// Import icons from lucide-react-native
import { 
  Home, 
  Search, 
  ShoppingBag, 
  MessageCircle, 
  User,
  Zap // Add icon for Quick Order
} from 'lucide-react-native';

// Simple icon component without complex animation to prevent errors
const SimpleIcon = ({ 
  Icon, 
  color, 
  size 
}: { 
  Icon: any; 
  color: string; 
  size: number 
}) => {
  // Safety check to prevent undefined icon error
  if (!Icon) {
    return null;
  }

  return <Icon size={size} color={color} />;
};

export default function TabLayout() {
  const isDark = useSelector(selectIsDark);
  const totalItems = useSelector(selectTotalItems);
  const colors = themeColors;
  const insets = useSafeAreaInsets();
  
  // Calculate proper tab bar height and padding for Android
  const getTabBarHeight = () => {
    if (Platform.OS === 'ios') {
      return 88; // iOS standard with safe area
    } else {
      // Android: base height + bottom safe area + extra padding for system navigation
      const baseHeight = 60;
      const safeAreaBottom = insets.bottom || 0;
      const systemNavPadding = safeAreaBottom === 0 ? 20 : 8; // More padding for devices without gesture nav
      return baseHeight + safeAreaBottom + systemNavPadding;
    }
  };
  
  const getTabBarPaddingBottom = () => {
    if (Platform.OS === 'ios') {
      return 28; // iOS safe area
    } else {
      // Android: safe area + additional padding for system navigation buttons
      const safeAreaBottom = insets.bottom || 0;
      const minPadding = safeAreaBottom === 0 ? 20 : 12; // More padding for traditional nav buttons
      return Math.max(safeAreaBottom, minPadding);
    }
  };

  return (
    <Tabs
      screenOptions={({ route }) => ({
        tabBarActiveTintColor: colors.primary[600],
        tabBarInactiveTintColor: isDark ? colors.neutral[400] : colors.neutral[500],
        tabBarStyle: {
          backgroundColor: isDark ? colors.neutral[900] : '#FFFFFF',
          borderTopColor: isDark ? colors.neutral[800] : colors.neutral[200],
          height: getTabBarHeight(),
          paddingBottom: getTabBarPaddingBottom(),
          paddingTop: 10,
          // Ensure tab bar stays above system navigation on Android
          ...(Platform.OS === 'android' && {
            elevation: 8,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: -2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
          }),
        },
        tabBarLabelStyle: {
          fontFamily: 'Poppins-Medium',
          fontSize: 12,
          marginTop: 0,
          paddingTop: 0,
        },
        headerShown: false, // Remove headers from all tab screens
        tabBarIcon: ({ color, size, focused }) => {
          let Icon;
          if (route.name === 'index') {
            Icon = Home;
          } else if (route.name === 'search') {
            Icon = Search;
          } else if (route.name === 'quick-order') {
            Icon = Zap;
          } else if (route.name === 'cart') {
            Icon = ShoppingBag;
          } else if (route.name === 'support') {
            Icon = MessageCircle;
          } else if (route.name === 'profile') {
            Icon = User;
          }
          
          // Safety check to prevent undefined icon error
          if (!Icon) {
            Icon = Home; // Fallback to Home icon
          }
          
          return (
            <SimpleIcon 
              Icon={Icon} 
              color={color} 
              size={size} 
            />
          );
        },
      })}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
        }}
      />
      {/* Quick Order Tab */}
      <Tabs.Screen
        name="quick-order"
        options={{
          title: 'Quick Order',
          tabBarIcon: ({ color, size }) => (
            <SimpleIcon Icon={Zap} color={color} size={size} />
          ),
        }}
      />
      {/* Hide search tab */}
      <Tabs.Screen
        name="search"
        options={{
          title: 'Search',
          // href: null, // This hides the tab
        }}
      />
      <Tabs.Screen
        name="cart"
        options={{
          title: 'Cart',
          tabBarIcon: ({ color, size, focused }) => (
            <>
              <SimpleIcon 
                Icon={ShoppingBag} 
                color={color} 
                size={size} 
              />
              {totalItems > 0 && <CartBadge />}
            </>
          ),
        }}
      />
      {/*
        The following tabs are hidden as per requirements:
        - Support (was: support)
        - B2B Home (was: b2b-home)
        To restore, uncomment these blocks.
      */}
      {/*
      <Tabs.Screen
        name="support"
        options={{
          title: 'Support',
        }}
      />
      <Tabs.Screen
        name="b2b-home"
        options={{
          title: 'B2B Home',
        }}
      />
      */}
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
        }}
      />
      {/* Hidden settings tab - functionality moved to profile page */}
      {/* <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
        }}
      /> */}
    </Tabs>
  );
}