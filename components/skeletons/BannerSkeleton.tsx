// components/skeletons/BannerSkeleton.tsx
import { selectIsDark } from '@/store/themeSlice';
import { View, StyleSheet, Dimensions } from 'react-native';
import Animated, { 
  useAnimatedStyle, 
  withRepeat, 
  withSequence,
  withTiming,
  useSharedValue,
  withDelay
} from 'react-native-reanimated';
import { useSelector } from 'react-redux';


const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function BannerSkeleton({ style }: { style?: any }) {
  const isDark = useSelector(selectIsDark);
  const opacity = useSharedValue(0.5);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  opacity.value = withRepeat(
    withSequence(
      withDelay(500, withTiming(1, { duration: 1000 })),
      withTiming(0.5, { duration: 1000 })
    ),
    -1,
    true
  );

  return (
    <View style={[styles.container, style]}>
      <Animated.View
        style={[
          styles.banner,
          { backgroundColor: isDark ? '#2A2A2A' : '#EEEEEE' },
          animatedStyle,
        ]}
      >
        <View style={styles.contentContainer}>
          <View 
            style={[
              styles.titlePlaceholder,
              { backgroundColor: isDark ? '#333333' : '#DDDDDD' }
            ]} 
          />
          <View 
            style={[
              styles.subtitlePlaceholder,
              { backgroundColor: isDark ? '#333333' : '#DDDDDD' }
            ]} 
          />
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
  },
  banner: {
    width: SCREEN_WIDTH - 32,
    height: 180,
    borderRadius: 16,
    overflow: 'hidden',
    justifyContent: 'flex-end',
  },
  contentContainer: {
    padding: 20,
  },
  titlePlaceholder: {
    width: '60%',
    height: 24,
    borderRadius: 12,
    marginBottom: 8,
  },
  subtitlePlaceholder: {
    width: '40%',
    height: 16,
    borderRadius: 8,
  },
});
