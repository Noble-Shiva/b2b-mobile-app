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


export default function SectionHeaderSkeleton() {
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
      <Animated.View 
        style={[
          styles.titlePlaceholder,
          { backgroundColor: isDark ? '#333333' : '#DDDDDD' },
          animatedStyle,
        ]} 
      />
      <Animated.View 
        style={[
          styles.buttonPlaceholder,
          { backgroundColor: isDark ? '#333333' : '#DDDDDD' },
          animatedStyle,
        ]} 
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  titlePlaceholder: {
    width: 120,
    height: 24,
    borderRadius: 12,
  },
  buttonPlaceholder: {
    width: 60,
    height: 20,
    borderRadius: 10,
  },
});