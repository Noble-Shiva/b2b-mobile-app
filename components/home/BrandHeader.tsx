import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { View, StyleSheet, TouchableOpacity, Image, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import { Search, Bell } from 'lucide-react-native';
import { Text } from '@/components/ui';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import { selectIsDark } from '@/store/themeSlice';

interface BrandHeaderProps {
  onNotificationPress?: () => void;
  notificationCount?: number;
}

// Static array outside component to prevent recreating on every render
const DYNAMIC_SEARCH_TEXTS = [
  "face care..",
  "hair care..", 
  "skin care..",
  "wellness products..",
  "ayurvedic medicines..",
  "immunity boosters..",
  "herbal supplements.."
];

// Move AnimatedSearchPlaceholder outside of BrandHeader to prevent useInsertionEffect issues
const AnimatedSearchPlaceholder = React.memo(() => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showText, setShowText] = useState(true);
  const slideAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(1)).current;
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Stable animation function using useCallback to prevent re-creation
  const animateToNext = useCallback(() => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    
    // Step 1: Slide current text out
    Animated.timing(slideAnim, {
      toValue: 1,
      duration: 350,
      useNativeDriver: true,
    }).start(() => {
      
      // Step 2: Brief pause with text hidden
      setShowText(false);
      
      setTimeout(() => {
        // Step 3: Calculate next index and update during invisible moment
        setCurrentIndex(prevIndex => (prevIndex + 1) % DYNAMIC_SEARCH_TEXTS.length);
        
        // Step 4: Reset animations for smooth entrance
        opacityAnim.setValue(0);
        slideAnim.setValue(0);
        
        // Step 5: Show new text and animate it in
        setShowText(true);
        
        // Gentle spring entrance animation
        Animated.parallel([
          Animated.spring(opacityAnim, {
            toValue: 1,
            tension: 100,
            friction: 9,
            useNativeDriver: true,
          }),
          // Subtle upward movement for entrance
          Animated.timing(slideAnim, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          })
        ]).start(() => {
          setIsAnimating(false);
        });
        
      }, 100); // 100ms pause - just enough to prevent flicker
    });
  }, [isAnimating, slideAnim, opacityAnim]);

  // Optimized useEffect with cleanup
  useEffect(() => {
    // Clear any existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    
    // Set new interval
    intervalRef.current = setInterval(animateToNext, 2800);
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [animateToNext]);

  return (
    <View style={styles.searchPlaceholder}>
      <Text variant="body" color="secondary" style={styles.staticText}>
        Search for
      </Text>
      <View style={styles.animatedTextContainer}>
        {showText && (
          <Animated.View style={[
            styles.animatedText,
            {
              opacity: opacityAnim,
              transform: [{
                translateY: slideAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, -25] // Start at baseline, then slide up and out on exit
                })
              }, {
                scale: opacityAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.98, 1] // Subtle scale effect for entrance
                })
              }]
            }
          ]}>
            <Text variant="body" color="secondary" style={styles.dynamicText}>
              {DYNAMIC_SEARCH_TEXTS[currentIndex]}
            </Text>
          </Animated.View>
        )}
      </View>
    </View>
  );
});

export default function BrandHeader({ onNotificationPress, notificationCount = 0 }: BrandHeaderProps) {
  const router = useRouter();
  const isDark = useSelector(selectIsDark);
  const insets = useSafeAreaInsets();

  return (
    <View style={[
      styles.brandHeader,
      { 
        backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF',
        paddingTop: insets.top + 8
      }
    ]}>
      {/* Logo Section */}
      <View style={styles.logoSection}>
        <Image 
          source={require('@/assets/srotas_logo_transparent.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      {/* Search Bar */}
      <TouchableOpacity 
        style={[
          styles.searchBar,
          { 
            backgroundColor: isDark ? '#2A2A2A' : '#F5F5F5',
            borderColor: isDark ? '#404040' : '#E0E0E0'
          }
        ]}
        onPress={() => router.push('/search' as any)}
        activeOpacity={0.7}
      >
        <Search size={20} color={isDark ? '#AAAAAA' : '#666666'} />
        <AnimatedSearchPlaceholder />
      </TouchableOpacity>
      
      {/* Notification Icon */}
      <TouchableOpacity 
        style={styles.actionButton}
        onPress={onNotificationPress}
      >
        <Bell size={24} color={isDark ? '#FFFFFF' : '#333333'} />
        {notificationCount > 0 && (
          <View style={styles.notificationBadge}>
            <Text variant="caption" color="inverse" style={styles.badgeText}>
              {notificationCount}
            </Text>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  brandHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  logoSection: {
    alignItems: 'center',
  },
  logo: {
    width: 100,
    height: 40,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    // marginHorizontal: 10,
    marginLeft: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
  },
  searchPlaceholder: {
    marginLeft: 8,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center', // This ensures both parts are centered on same line
  },
  animatedTextContainer: {
    height: 22, // Match the text line height
    overflow: 'hidden',
    position: 'relative',
    justifyContent: 'center', // Center content vertically
    alignItems: 'center', // Center content horizontally
    minWidth: 120, // Ensure minimum width for text
    marginLeft: 4, // More spacing between "Search for" and dynamic text
  },
  animatedText: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'flex-start', // Left align the text within container
    alignItems: 'center', // Vertically center the text
    flexDirection: 'row',
  },
  staticText: {
    lineHeight: 20, // Ensure consistent line height
  },
  dynamicText: {
    lineHeight: 20, // Match static text line height for perfect alignment
  },
  actionButton: {
    padding: 8,
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    top: 0,
    right: 3,
    backgroundColor: '#FF4500',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
}); 