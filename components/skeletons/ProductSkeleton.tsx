import { selectIsDark } from '@/store/themeSlice';
import { View, StyleSheet } from 'react-native';
import Animated, { 
  useAnimatedStyle, 
  withRepeat, 
  withSequence,
  withTiming,
  useSharedValue,
  withDelay
} from 'react-native-reanimated';
import { useSelector } from 'react-redux';


export default function ProductSkeleton() {
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
    <View style={styles.container}>
      {[...Array(2)].map((_, index) => (
        <Animated.View
          key={index}
          style={[
            styles.productCard,
            { backgroundColor: isDark ? '#2A2A2A' : '#EEEEEE' },
            animatedStyle,
          ]}
        >
          <View 
            style={[
              styles.imagePlaceholder,
              { backgroundColor: isDark ? '#333333' : '#DDDDDD' }
            ]} 
          />
          <View style={styles.contentContainer}>
            <View 
              style={[
                styles.titlePlaceholder,
                { backgroundColor: isDark ? '#333333' : '#DDDDDD' }
              ]} 
            />
            <View 
              style={[
                styles.pricePlaceholder,
                { backgroundColor: isDark ? '#333333' : '#DDDDDD' }
              ]} 
            />
          </View>
        </Animated.View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 16,
    justifyContent: 'space-between',
  },
  productCard: {
    width: '48%',
    borderRadius: 12,
    overflow: 'hidden',
  },
  imagePlaceholder: {
    width: '100%',
    height: 150,
  },
  contentContainer: {
    padding: 12,
  },
  titlePlaceholder: {
    height: 16,
    borderRadius: 8,
    marginBottom: 8,
  },
  pricePlaceholder: {
    height: 14,
    width: '60%',
    borderRadius: 7,
  },
});