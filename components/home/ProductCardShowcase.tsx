import { View, ScrollView, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import { selectIsDark } from '@/store/themeSlice';
import { Text } from '@/components/ui';
import ProductCardCompact from './ProductCardCompact';
import ProductCardPremium from './ProductCardPremium';
import ProductCardMinimal from './ProductCardMinimal';

// Sample product data
const sampleProducts = [
  {
    id: '1',
    name: 'Ashwagandha Capsules - Premium Quality',
    price: 299,
    image: 'https://images.unsplash.com/photo-1584362917165-526a968579e8?w=500',
    rating: 4.5,
    ratingCount: 128,
    discount: 15,
    weight: '60 capsules',
    inStock: true,
    featured: true,
  },
  {
    id: '2',
    name: 'Triphala Powder - Organic',
    price: 199,
    image: 'https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?w=500',
    rating: 4.3,
    ratingCount: 89,
    discount: 10,
    weight: '100g',
    inStock: true,
  },
  {
    id: '3',
    name: 'Giloy Tablets - Immunity Booster',
    price: 249,
    image: 'https://images.unsplash.com/photo-1628771065518-0d82f1938462?w=500',
    rating: 4.7,
    ratingCount: 203,
    discount: 20,
    weight: '30 tablets',
    inStock: true,
  },
  {
    id: '4',
    name: 'Brahmi Oil - Hair & Brain Health',
    price: 179,
    image: 'https://images.unsplash.com/photo-1616401784845-180882ba9ba8?w=500',
    rating: 4.2,
    ratingCount: 56,
    volume: '100ml',
    inStock: false,
  },
  {
    id: '5',
    name: 'Neem Capsules - Skin Care',
    price: 129,
    image: 'https://images.unsplash.com/photo-1559181567-c3190ca9959b?w=500',
    rating: 4.0,
    ratingCount: 74,
    discount: 5,
    weight: '60 capsules',
    inStock: true,
  },
];

export default function ProductCardShowcase() {
  const isDark = useSelector(selectIsDark);
  
  const handleProductPress = (productId: string) => {
    console.log('Product pressed:', productId);
  };
  
  const handleAddToCart = (productId: string) => {
    console.log('Add to cart:', productId);
  };
  
  return (
    <View style={[styles.container, { backgroundColor: isDark ? '#000000' : '#F8F9FA' }]}>
      {/* Compact Horizontal Cards Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text variant="h3" weight="bold" style={styles.sectionTitle}>
            Compact Cards
          </Text>
          <Text variant="body-sm" color="secondary">
            Space-efficient horizontal layout
          </Text>
        </View>
        
        <View style={styles.compactContainer}>
          {sampleProducts.slice(0, 3).map((product) => (
            <ProductCardCompact
              key={product.id}
              product={product}
              onPress={() => handleProductPress(product.id)}
              onAddToCart={() => handleAddToCart(product.id)}
            />
          ))}
        </View>
      </View>
      
      {/* Premium Vertical Cards Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text variant="h3" weight="bold" style={styles.sectionTitle}>
            Premium Cards
          </Text>
          <Text variant="body-sm" color="secondary">
            Elegant design with enhanced features
          </Text>
        </View>
        
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.horizontalScroll}
        >
          {sampleProducts.map((product) => (
            <ProductCardPremium
              key={product.id}
              product={product}
              onPress={() => handleProductPress(product.id)}
              onAddToCart={() => handleAddToCart(product.id)}
            />
          ))}
        </ScrollView>
      </View>
      
      {/* Minimal Cards Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text variant="h3" weight="bold" style={styles.sectionTitle}>
            Minimal Cards
          </Text>
          <Text variant="body-sm" color="secondary">
            Clean and simple design
          </Text>
        </View>
        
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.horizontalScroll}
        >
          {sampleProducts.map((product) => (
            <ProductCardMinimal
              key={product.id}
              product={product}
              onPress={() => handleProductPress(product.id)}
              onAddToCart={() => handleAddToCart(product.id)}
            />
          ))}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 20,
  },
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    marginBottom: 4,
  },
  compactContainer: {
    gap: 0,
  },
  horizontalScroll: {
    paddingHorizontal: 16,
  },
}); 