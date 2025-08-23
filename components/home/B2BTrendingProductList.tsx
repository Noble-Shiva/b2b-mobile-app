import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useSelector } from 'react-redux';
import { selectIsDark } from '@/store/themeSlice';
import { Text } from '@/components/ui';
import B2BProductCard from './B2BProductCard';

interface TrendingProduct {
  id: string;
  name: string;
  brand: string;
  price: number;
  image: string;
  rating: number;
  ratingCount: number;
  discount?: number;
  moq: number;
  margin: number;
  supplierVerified: boolean;
  deliveryTime: string;
  stockLevel: 'High' | 'Medium' | 'Low';
  category: string;
  bulkPricing: {
    '50+': number;
    '100+': number;
    '200+': number;
  };
  velocity: number; // Units sold per week
  trending: boolean;
}

const trendingProducts: TrendingProduct[] = [
  {
    id: 'trend-1',
    name: 'Chyawanprash Premium 1kg',
    brand: 'Patanjali',
    price: 450,
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=300&fit=crop',
    rating: 4.5,
    ratingCount: 2340,
    discount: 15,
    moq: 24,
    margin: 35,
    supplierVerified: true,
    deliveryTime: '2-3 days',
    stockLevel: 'High',
    category: 'Immunity',
    bulkPricing: {
      '50+': 420,
      '100+': 400,
      '200+': 380,
    },
    velocity: 180,
    trending: true,
  },
  {
    id: 'trend-2',
    name: 'Triphala Churna 100g',
    brand: 'Himalaya',
    price: 85,
    image: 'https://images.unsplash.com/photo-1587222608950-94515da33294?w=300&h=300&fit=crop',
    rating: 4.3,
    ratingCount: 1850,
    discount: 12,
    moq: 50,
    margin: 42,
    supplierVerified: true,
    deliveryTime: '1-2 days',
    stockLevel: 'Medium',
    category: 'Digestion',
    bulkPricing: {
      '50+': 78,
      '100+': 75,
      '200+': 72,
    },
    velocity: 220,
    trending: true,
  },
  {
    id: 'trend-3',
    name: 'Ashwagandha Capsules 60',
    brand: 'Baidyanath',
    price: 280,
    image: 'https://images.unsplash.com/photo-1550572017-ad9cbdcb6ee3?w=300&h=300&fit=crop',
    rating: 4.6,
    ratingCount: 1520,
    discount: 20,
    moq: 30,
    margin: 38,
    supplierVerified: true,
    deliveryTime: '3-4 days',
    stockLevel: 'High',
    category: 'Mental Wellness',
    bulkPricing: {
      '50+': 260,
      '100+': 245,
      '200+': 230,
    },
    velocity: 145,
    trending: true,
  },
  {
    id: 'trend-4',
    name: 'Giloy Juice 500ml',
    brand: 'Dabur',
    price: 195,
    image: 'https://images.unsplash.com/photo-1515706767693-83211b58b7b7?w=300&h=300&fit=crop',
    rating: 4.4,
    ratingCount: 980,
    discount: 18,
    moq: 36,
    margin: 32,
    supplierVerified: true,
    deliveryTime: '2-3 days',
    stockLevel: 'High',
    category: 'Immunity',
    bulkPricing: {
      '50+': 180,
      '100+': 170,
      '200+': 160,
    },
    velocity: 165,
    trending: true,
  },
  {
    id: 'trend-5',
    name: 'Arjuna Bark Extract 250mg',
    brand: 'Organic India',
    price: 340,
    image: 'https://images.unsplash.com/photo-1584308972272-9e4e7685e80f?w=300&h=300&fit=crop',
    rating: 4.7,
    ratingCount: 760,
    discount: 25,
    moq: 40,
    margin: 45,
    supplierVerified: true,
    deliveryTime: '3-5 days',
    stockLevel: 'Medium',
    category: 'Heart Health',
    bulkPricing: {
      '50+': 315,
      '100+': 295,
      '200+': 275,
    },
    velocity: 95,
    trending: true,
  },
];

interface B2BTrendingProductListProps {
  onProductPress: (product: TrendingProduct) => void;
}

export default function B2BTrendingProductList({ onProductPress }: B2BTrendingProductListProps) {
  const isDark = useSelector(selectIsDark);

  return (
    <View style={styles.container}>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
      >
        {trendingProducts.map((product) => (
          <B2BProductCard
            key={product.id}
            product={product}
            onPress={() => onProductPress(product)}
          />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 8,
  },
  scrollContainer: {
    paddingHorizontal: 16,
  },
}); 