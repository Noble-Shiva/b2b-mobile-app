// components/home/BannerCarousel.tsx
import { useState, useRef, useCallback } from 'react';
import { View, FlatList, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import Banner from './Banner';
import BannerSkeleton from '@/components/skeletons/BannerSkeleton';
import { selectIsDark } from '@/store/themeSlice';
import { useSelector } from 'react-redux';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const BANNER_WIDTH = SCREEN_WIDTH - 48; // Full width minus left and right padding and gap
const BANNER_HEIGHT = 180; // Reduced height for a more compact look
const ITEM_GAP = 16; // Gap between items

interface BannerItem {
  id: string;
  image: string;
  title?: string;
  subtitle?: string;
}

interface BannerCarouselProps {
  data: BannerItem[];
  autoPlay?: boolean;
  autoPlayInterval?: number;
  style?: any;
  isLoading?: boolean;
}

export default function BannerCarousel({ 
  data, 
  autoPlay = true, 
  autoPlayInterval = 5000,
  style,
  isLoading = false
}: BannerCarouselProps) {
  const isDark = useSelector(selectIsDark);
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  
  // Auto-play functionality
  const autoPlayRef = useRef<NodeJS.Timeout>();
  
  const startAutoPlay = useCallback(() => {
    if (autoPlay && data.length > 1) {
      autoPlayRef.current = setInterval(() => {
        const nextIndex = (activeIndex + 1) % data.length;
        flatListRef.current?.scrollToIndex({
          index: nextIndex,
          animated: true
        });
        setActiveIndex(nextIndex);
      }, autoPlayInterval);
    }
  }, [activeIndex, autoPlay, autoPlayInterval, data.length]);
  
  const stopAutoPlay = useCallback(() => {
    if (autoPlayRef.current) {
      clearInterval(autoPlayRef.current);
    }
  }, []);
  
  // Handle scroll events
  const handleScroll = useCallback((event: any) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollPosition / (BANNER_WIDTH + ITEM_GAP));
    setActiveIndex(index);
  }, []);
  
  const handleMomentumScrollEnd = useCallback(() => {
    stopAutoPlay();
    startAutoPlay();
  }, [stopAutoPlay, startAutoPlay]);

  if (isLoading) {
    return <BannerSkeleton style={style} />;
  }
  
  return (
    <View style={[styles.container, style]}>
      <FlatList
        ref={flatListRef}
        data={data}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        onMomentumScrollEnd={handleMomentumScrollEnd}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Banner
            image={item.image}
            title={item.title}
            subtitle={item.subtitle}
          />
        )}
        getItemLayout={(_, index) => ({
          length: BANNER_WIDTH + ITEM_GAP,
          offset: (BANNER_WIDTH + ITEM_GAP) * index,
          index,
        })}
        contentContainerStyle={styles.carouselContent}
        ItemSeparatorComponent={() => <View style={{ width: ITEM_GAP }} />}
      />
      
      {data.length > 1 && (
        <View style={styles.pagination}>
          {data.map((_, index) => (
            <View
              key={index}
              style={[
                styles.paginationDot,
                { 
                  width: index === activeIndex ? 24 : 8,
                  backgroundColor: index === activeIndex 
                    ? '#FFFFFF' 
                    : 'rgba(255, 255, 255, 0.5)'
                }
              ]}
            />
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    marginVertical: 16,
  },
  carouselContent: {
    paddingHorizontal: 16,
  },
  pagination: {
    position: 'absolute',
    bottom: 10,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  paginationDot: {
    height: 5,
    borderRadius: 4,
    marginHorizontal: 4,
    opacity: 0.8,
  },
});
