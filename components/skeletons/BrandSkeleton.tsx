import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Skeleton from '@/components/skeletons/Skeleton';

const { width } = Dimensions.get('window');
const cardWidth = width * 0.25;

export default function BrandSkeleton() {
  return (
    <View style={styles.container}>
      {[1, 2, 3, 4].map((index) => (
        <View key={index} style={styles.brandCard}>
          <Skeleton style={styles.imageContainer} />
          <Skeleton style={styles.textContainer} />
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingHorizontal: 12,
  },
  brandCard: {
    width: cardWidth,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  imageContainer: {
    width: cardWidth - 16,
    height: cardWidth - 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  textContainer: {
    width: cardWidth - 24,
    height: 16,
    borderRadius: 4,
  },
}); 