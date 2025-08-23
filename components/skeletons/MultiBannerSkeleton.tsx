import { selectIsDark } from '@/store/themeSlice';
import React, { useRef, useEffect } from 'react';
import { View, StyleSheet, Animated, Dimensions } from 'react-native';
import { useSelector } from 'react-redux';


const { width } = Dimensions.get('window');
const ITEM_WIDTH = width * 0.4;
const ITEM_HEIGHT = 140;

export default function MultiBannerSkeleton() {
  const isDark = useSelector(selectIsDark);
  const opacity = useRef(new Animated.Value(0.3)).current;
  
  // Animation for loading effect
  useEffect(() => {
    const pulseAnimation = Animated.sequence([
      Animated.timing(opacity, {
        toValue: 0.6,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 0.3,
        duration: 800,
        useNativeDriver: true,
      }),
    ]);
    
    Animated.loop(pulseAnimation).start();
    
    return () => {
      opacity.stopAnimation();
    };
  }, []);

  const renderBannerItem = (index: number) => (
    <Animated.View 
      key={index}
      style={[
        styles.bannerItem, 
        { 
          backgroundColor: isDark ? '#333333' : '#E0E0E0',
          opacity: opacity,
          marginLeft: index === 0 ? 16 : 0
        }
      ]} 
    />
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Animated.View 
          style={[
            styles.titleSkeleton, 
            { 
              backgroundColor: isDark ? '#333333' : '#E0E0E0',
              opacity: opacity
            }
          ]} 
        />
        <Animated.View 
          style={[
            styles.actionSkeleton, 
            { 
              backgroundColor: isDark ? '#333333' : '#E0E0E0',
              opacity: opacity
            }
          ]} 
        />
      </View>
      
      <View style={styles.itemsContainer}>
        {[0, 1, 2].map((index) => renderBannerItem(index))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 16,
    marginBottom: 12,
  },
  titleSkeleton: {
    width: 120,
    height: 24,
    borderRadius: 4,
  },
  actionSkeleton: {
    width: 60,
    height: 16,
    borderRadius: 4,
  },
  itemsContainer: {
    flexDirection: 'row',
    paddingRight: 16,
  },
  bannerItem: {
    width: ITEM_WIDTH,
    height: ITEM_HEIGHT,
    borderRadius: 12,
    marginRight: 12,
  },
});
