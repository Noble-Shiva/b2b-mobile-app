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
const CATEGORY_WIDTH = 80;

export default function CategorySkeleton() {
  const isDark = useSelector(selectIsDark);
  const opacity = useSharedValue(0.5);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  // Start the animation when component mounts
  opacity.value = withRepeat(
    withSequence(
      withDelay(500, withTiming(1, { duration: 1000 })),
      withTiming(0.5, { duration: 1000 })
    ),
    -1,
    true
  );

  return (
    <View style={styles.container}>
      {[...Array(5)].map((_, index) => (
        <Animated.View
          key={index}
          style={[
            styles.categoryCard,
            { backgroundColor: isDark ? '#2A2A2A' : '#EEEEEE' },
            animatedStyle,
          ]}
        >
          <View 
            style={[
              styles.iconPlaceholder,
              { backgroundColor: isDark ? '#333333' : '#DDDDDD' }
            ]} 
          />
          <View 
            style={[
              styles.textPlaceholder,
              { backgroundColor: isDark ? '#333333' : '#DDDDDD' }
            ]} 
          />
        </Animated.View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  categoryCard: {
    width: CATEGORY_WIDTH,
    height: 100,
    marginRight: 12,
    borderRadius: 12,
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconPlaceholder: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginBottom: 8,
  },
  textPlaceholder: {
    width: '80%',
    height: 12,
    borderRadius: 6,
  },
});