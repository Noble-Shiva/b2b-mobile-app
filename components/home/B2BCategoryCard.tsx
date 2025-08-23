import React from 'react';
import { View, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useSelector } from 'react-redux';
import { selectIsDark } from '@/store/themeSlice';
import { Text } from '@/components/ui';
import { colors } from '@/utils/theme';
import { formatPrice } from '@/utils/helpers';

interface B2BCategory {
  id: string;
  name: string;
  image: string;
  productCount: number;
  startingPrice: number;
  moq: number;
  averageMargin?: number;
}

interface B2BCategoryCardProps {
  category: B2BCategory;
  onPress: () => void;
}

export default function B2BCategoryCard({ category, onPress }: B2BCategoryCardProps) {
  const isDark = useSelector(selectIsDark);

  return (
    <TouchableOpacity
      style={[
        styles.container,
        { backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF' }
      ]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.imageContainer}>
        <Image source={{ uri: category.image }} style={styles.image} resizeMode="cover" />
        {category.averageMargin && (
          <View style={styles.marginBadge}>
            <Text style={styles.marginText}>{category.averageMargin}% margin</Text>
          </View>
        )}
      </View>
      
      <View style={styles.content}>
        <Text variant="body" weight="semibold" numberOfLines={2} style={styles.title}>
          {category.name}
        </Text>
        
        <View style={styles.statsContainer}>
          <Text variant="caption" color="secondary" style={styles.productCount}>
            {category.productCount}+ products
          </Text>
          
          <View style={styles.pricingInfo}>
            <Text variant="caption" color="secondary">Starting from</Text>
            <Text variant="body-sm" weight="semibold" color="accent">
              {formatPrice(category.startingPrice)}/unit
            </Text>
          </View>
          
          <View style={styles.moqContainer}>
            <View style={[styles.moqBadge, { backgroundColor: colors.primary[100] }]}>
              <Text variant="caption" weight="semibold" color="primary" style={styles.moqText}>
                MOQ: {category.moq} units
              </Text>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 180,
    marginRight: 12,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  imageContainer: {
    position: 'relative',
    height: 120,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  marginBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(76, 175, 80, 0.9)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  marginText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: 'bold',
  },
  content: {
    padding: 12,
  },
  title: {
    marginBottom: 8,
    minHeight: 40,
  },
  statsContainer: {
    gap: 6,
  },
  productCount: {
    fontSize: 12,
  },
  pricingInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  moqContainer: {
    marginTop: 4,
  },
  moqBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  moqText: {
    fontSize: 11,
  },
}); 