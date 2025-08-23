import { View, StyleSheet, FlatList, TouchableOpacity } from 'react-native';

import { Text } from '@/components/ui';
import ProductCard from '@/components/home/ProductCard';
import { useSelector } from 'react-redux';
import { selectIsDark } from '@/store/themeSlice';

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  rating: number;
  ratingCount: number;
  discount?: number;
  variants?: Array<{
    id: string;
    name: string;
    price: number;
    discountedPrice: number;
    originalPrice: number;
    discount: number;
    quantity: string;
    inStock: boolean;
  }>;
  hasOptions?: boolean;
}

interface TrendingProductListProps {
  products: Product[];
  onProductPress: (productId: string) => void;
  onAddToCart: (product: Product) => void;
}

export default function TrendingProductList({ products, onProductPress, onAddToCart }: TrendingProductListProps) {
  const isDark = useSelector(selectIsDark);
  
  return (
    <View style={styles.trendingSection}>
      <View style={styles.sectionHeader}>
        <Text variant="h4" weight="semibold">Trending Now</Text>
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
  trendingSection: {
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
    paddingLeft: 16,
    paddingRight: 8,
  },
  productCardContainer: {
    width: 160,
    marginRight: 12,
  },
});