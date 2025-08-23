import React, { useState, useRef } from 'react';
import { View, StyleSheet, FlatList, useWindowDimensions, Image, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ArrowRight } from 'lucide-react-native';
import { Text, Button } from '@/components/ui';
import { useSelector } from 'react-redux';
import { selectIsDark } from '@/store/themeSlice';

const slides = [
  {
    id: '1',
    title: 'Quick Delivery at Your Doorstep',
    description: 'Get your favorite items delivered in 30 minutes or less. Fresh groceries, daily essentials, and more!',
    image: 'https://images.unsplash.com/photo-1617347454431-f49d7ff5c3b1?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: '2',
    title: 'Wide Selection of Products',
    description: 'Choose from thousands of products across multiple categories. Quality items at great prices.',
    image: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: '3',
    title: 'Safe & Secure Payments',
    description: 'Multiple payment options available. Shop with confidence using our secure payment system.',
    image: 'https://images.unsplash.com/photo-1556742393-d75f468bfcb0?q=80&w=800&auto=format&fit=crop'
  }
];

export default function OnboardingScreen() {
  const router = useRouter();
  const isDark = useSelector(selectIsDark);
  const { width } = useWindowDimensions();
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  
  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      flatListRef.current?.scrollToIndex({
        index: currentIndex + 1,
        animated: true
      });
    } else {
      router.replace('/(auth)/login');
    }
  };
  
  const handleSkip = () => {
    router.replace('/(tabs)');
  };
  
  const renderSlide = ({ item }: { item: typeof slides[0] }) => (
    <View style={[styles.slide, { width }]}>
      <View style={styles.imageContainer}>
        <Image 
          source={{ uri: item.image }} 
          style={styles.image}
          resizeMode="cover"
        />
        <View style={[
          styles.imageOverlay,
          { backgroundColor: isDark ? 'rgba(0,0,0,0.4)' : 'rgba(255,255,255,0.2)' }
        ]} />
      </View>
      
      <View style={styles.content}>
        <Text variant="h2" weight="bold" style={styles.title}>
          {item.title}
        </Text>
        <Text variant="body" color="secondary" style={styles.description}>
          {item.description}
        </Text>
      </View>
    </View>
  );
  
  const Pagination = () => (
    <View style={styles.pagination}>
      {slides.map((_, index) => (
        <View
          key={index}
          style={[
            styles.paginationDot,
            { 
              width: currentIndex === index ? 20 : 8,
              backgroundColor: currentIndex === index 
                ? (isDark ? '#FFFFFF' : '#FF4500')
                : (isDark ? '#666666' : '#CCCCCC')
            }
          ]}
        />
      ))}
    </View>
  );

  return (
    <View style={[
      styles.container,
      { backgroundColor: isDark ? '#121212' : '#FFFFFF' }
    ]}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      
      {currentIndex < slides.length - 1 && (
        <TouchableOpacity 
          style={styles.skipButton} 
          onPress={handleSkip}
        >
          <Text variant="body" weight="medium" color="accent">
            Skip
          </Text>
        </TouchableOpacity>
      )}
      
      <FlatList
        ref={flatListRef}
        data={slides}
        renderItem={renderSlide}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(event) => {
          const newIndex = Math.round(
            event.nativeEvent.contentOffset.x / width
          );
          setCurrentIndex(newIndex);
        }}
      />
      
      <View style={styles.footer}>
        <Pagination />
        
        <Button
          variant="primary"
          style={styles.nextButton}
          onPress={handleNext}
          rightIcon={<ArrowRight size={20} color="#FFFFFF" />}
        >
          {currentIndex === slides.length - 1 ? 'Get Started' : 'Next'}
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  skipButton: {
    position: 'absolute',
    top: 60,
    right: 20,
    zIndex: 10,
    padding: 8,
  },
  slide: {
    flex: 1,
  },
  imageContainer: {
    height: '60%',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  content: {
    flex: 1,
    paddingHorizontal: 40,
    paddingTop: 40,
    alignItems: 'center',
  },
  title: {
    textAlign: 'center',
    marginBottom: 16,
  },
  description: {
    textAlign: 'center',
    lineHeight: 24,
  },
  footer: {
    padding: 40,
    paddingBottom: 50,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
  },
  paginationDot: {
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  nextButton: {
    height: 56,
  },
});