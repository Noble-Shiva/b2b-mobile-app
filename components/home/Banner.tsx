// components/home/Banner.tsx
import { View, Image, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { Text } from '@/components/ui';
import { selectIsDark } from '@/store/themeSlice';
import { useSelector } from 'react-redux';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const BANNER_WIDTH = SCREEN_WIDTH - 48; // Full width minus left and right padding and gap
const BANNER_HEIGHT = 150; // Reduced height for a more compact look

interface BannerProps {
  image: string;
  title?: string;
  subtitle?: string;
  onPress?: () => void;
  style?: any;
}

export default function Banner({ image, title, subtitle, onPress, style }: BannerProps) {
  const isDark = useSelector(selectIsDark);
  
  return (
    <TouchableOpacity 
      style={[styles.container, style]} 
      onPress={onPress}
      activeOpacity={0.9}
    >
      <View style={styles.imageContainer}>
        <Image 
          source={{ uri: image }} 
          style={styles.image}
          // resizeMode="contain"
        />
      </View>
      
      {/* Gradient overlay */}
      <View style={styles.overlay} />
      
      {/* Content */}
      {false && (title || subtitle) && (
        <View style={styles.content}>
          {title && (
            <Text variant="h3" weight="bold" color="inverse" style={styles.title}>
              {title}
            </Text>
          )}
          {subtitle && (
            <Text variant="body" color="inverse" style={styles.subtitle}>
              {subtitle}
            </Text>
          )}
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: BANNER_WIDTH,
    height: BANNER_HEIGHT,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#F5F5F5',
  },
  imageContainer: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    
  },
  image: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },
  content: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
  },
  title: {
    marginBottom: 4,
  },
  subtitle: {
    opacity: 0.9,
  },
});
