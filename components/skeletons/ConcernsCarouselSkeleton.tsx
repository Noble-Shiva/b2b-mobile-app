import { View, StyleSheet, Dimensions } from 'react-native';
import { useSelector } from 'react-redux';
import { selectIsDark } from '@/store/themeSlice';
import Skeleton from './Skeleton';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function ConcernsCarouselSkeleton() {
  const isDark = useSelector(selectIsDark);

  return (
    <View style={styles.container}>
      <View style={styles.carouselContainer}>
        {/* First item */}
        <View style={styles.itemContainer}>
          <Skeleton
            style={{
              width: (SCREEN_WIDTH - 48) / 2,
              height: 150,
              borderRadius: 8,
            }}
          />
        </View>
        {/* Second item */}
        <View style={styles.itemContainer}>
          <Skeleton
            style={{
              width: (SCREEN_WIDTH - 48) / 2,
              height: 150,
              borderRadius: 8,
            }}
          />
        </View>
      </View>
      {/* Pagination skeleton */}
      <View style={styles.paginationContainer}>
        <Skeleton
          style={{
            width: 24,
            height: 8,
            borderRadius: 4,
          }}
        />
        <Skeleton
          style={{
            width: 8,
            height: 8,
            borderRadius: 4,
            marginHorizontal: 4,
          }}
        />
        <Skeleton
          style={{
            width: 8,
            height: 8,
            borderRadius: 4,
            marginHorizontal: 4,
          }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
  },
  carouselContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  itemContainer: {
    marginHorizontal: 4,
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
}); 