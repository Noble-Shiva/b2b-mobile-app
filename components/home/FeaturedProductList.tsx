import React from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Text } from '@/components/ui';
import ProductCard from '@/components/home/ProductCard';
import ProductSkeleton from '@/components/skeletons/ProductSkeleton';
import SectionHeaderSkeleton from '@/components/skeletons/SectionHeaderSkeleton';
import { useSelector } from 'react-redux';
import { selectIsDark } from '@/store/themeSlice';
import { Product } from '@/api/products';

interface FeaturedProductListProps {
  products: Product[];
  onProductPress: (productId: string) => void;
  onAddToCart: (product: Product) => void;
  isLoading?: boolean;
}

export default function FeaturedProductList({ products, onProductPress, onAddToCart, isLoading }: FeaturedProductListProps) {
  const isDark = useSelector(selectIsDark);
  
  if (isLoading) {
    return (
      <View style={styles.featuredSection}>
        <SectionHeaderSkeleton />
        <ProductSkeleton />
      </View>
    );
  }

  return (
    <View style={styles.featuredSection}>
      <View style={styles.sectionHeader}>
        <Text variant="h4" weight="semibold">Featured Products</Text>
        <TouchableOpacity onPress={() => onProductPress('')}>
          <Text variant="body-sm" weight="medium" color="accent">See All</Text>
        </TouchableOpacity>
      </View>
      
      <FlatList
        data={products}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.productCardContainer}>
            <ProductCard 
              product={item} 
              onPress={() => onProductPress(item.id)}
              onAddToCart={() => onAddToCart(item)}
            />
          </View>
        )}
        contentContainerStyle={styles.productsList}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  featuredSection: {
    marginTop: 20,
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  productsList: {
    paddingLeft: 10,
    paddingRight: 4,
  },
  productCardContainer: {
    width: 160,
    marginRight: 0,
  },
});