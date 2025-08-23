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

export default function OrderSkeleton() {
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
      {[...Array(2)].map((_, idx) => (
        <Animated.View
          key={idx}
          style={[
            styles.skeletonCard,
            { backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF' },
            animatedStyle,
          ]}
        >
          <View style={[
            styles.iconContainer,
            { backgroundColor: isDark ? '#333333' : '#FFF0EB' }
          ]} />
          <View style={styles.contentContainer}>
            <View style={[
              styles.headerRow,
            ]}>
              <View style={[
                styles.titlePlaceholder,
                { backgroundColor: isDark ? '#333333' : '#DDDDDD' }
              ]} />
              <View style={[
                styles.datePlaceholder,
                { backgroundColor: isDark ? '#333333' : '#DDDDDD' }
              ]} />
            </View>
            <View style={[
              styles.itemsPlaceholder,
              { backgroundColor: isDark ? '#333333' : '#DDDDDD' }
            ]} />
            <View style={styles.footerRow}>
              <View style={styles.statusContainer}>
                <View style={[
                  styles.statusDot,
                  { backgroundColor: isDark ? '#333333' : '#DDDDDD' }
                ]} />
                <View style={[
                  styles.statusTextPlaceholder,
                  { backgroundColor: isDark ? '#333333' : '#DDDDDD' }
                ]} />
              </View>
              <View style={[
                styles.totalPlaceholder,
                { backgroundColor: isDark ? '#333333' : '#DDDDDD' }
              ]} />
            </View>
          </View>
          <View style={[
            styles.chevronPlaceholder,
            { backgroundColor: isDark ? '#333333' : '#DDDDDD' }
          ]} />
        </Animated.View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
  },
  skeletonCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 12,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 16,
  },
  contentContainer: {
    flex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  titlePlaceholder: {
    width: 80,
    height: 16,
    borderRadius: 8,
  },
  datePlaceholder: {
    width: 60,
    height: 12,
    borderRadius: 6,
  },
  itemsPlaceholder: {
    width: 100,
    height: 12,
    borderRadius: 6,
    marginBottom: 8,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusTextPlaceholder: {
    width: 60,
    height: 12,
    borderRadius: 6,
  },
  totalPlaceholder: {
    width: 40,
    height: 14,
    borderRadius: 7,
  },
  chevronPlaceholder: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginLeft: 8,
  },
}); 