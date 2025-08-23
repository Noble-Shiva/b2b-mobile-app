import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';
import { router } from 'expo-router';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import BrandSkeleton from '@/components/skeletons/BrandSkeleton';

interface Brand {
  id: number;
  name: string;
  slug: string;
  description: string;
  count: number;
  brand_logo: string | null;
}

// Custom hook for fetching brands
const useBrands = () => {
  return useQuery<Brand[]>({
    queryKey: ['brands'],
    queryFn: async () => {
      const response = await axios.get('https://b2b.ayurcentralonline.com/wp-json/b2b/v1/brands?client_id=ac_0123');
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes cache
  });
};

export default function BrandList() {
  const { data: brands, isLoading, isError, error, refetch } = useBrands();

  const renderContent = () => {
    if (isLoading) {
      return <BrandSkeleton />;
    }
    
    if (isError) {
      return (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Failed to load brands</Text>
          <TouchableOpacity 
            style={styles.retryButton}
            onPress={() => refetch()}
          >
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      );
    }

    if (!brands || brands.length === 0) {
      return <Text style={styles.noDataText}>No brands available</Text>;
    }

    return (
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {brands.map((brand) => (
          <TouchableOpacity
            key={brand.id}
            style={styles.brandCard}
            onPress={() => handleBrandPress(brand)}
          >
            <View style={styles.imageContainer}>
              {brand.brand_logo ? (
                <Image
                  source={{ uri: brand.brand_logo }}
                  style={styles.brandImage}
                  resizeMode="contain"
                />
              ) : (
                <View style={styles.placeholderContainer}>
                  <Text style={styles.placeholderText}>
                    {brand.name.charAt(0)}
                  </Text>
                </View>
              )}
            </View>
            <Text style={styles.brandName} numberOfLines={2}>
              {brand.name.replace(/&amp;/g, '&')}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    );
  };

  const handleBrandPress = (brand: Brand) => {
    console.log('brand', brand);
    // Navigate to brand details page
    router.push({
      pathname: '/category-brand-details',
      params: { 
        id: brand.id.toString(),
        name: brand.name.replace(/&amp;/g, '&'),
        type: 'brand',
        slug: brand.slug,
        brand_logo: brand.brand_logo
      }
    });
  };

  return (
    <View style={styles.brandsSection}>
      <View style={styles.sectionHeader}>
        <Text style={styles.title}>Shop by Brands</Text>
        <TouchableOpacity onPress={() => router.push('/search?view=brands')}>
          <Text style={styles.seeAllText}>See All</Text>
        </TouchableOpacity>
      </View>
      {renderContent()}
    </View>
  );
}

const { width } = Dimensions.get('window');
const cardWidth = width * 0.25;

const styles = StyleSheet.create({
  brandsSection: {
    marginVertical: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    color: '#333333',
  },
  seeAllText: {
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
    color: '#FF4500',
  },
  scrollContent: {
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
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    overflow: 'hidden',
  },
  brandImage: {
    width: '100%',
    height: '100%',
  },
  placeholderContainer: {
    width: '100%',
    height: '100%',
    backgroundColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 24,
    fontFamily: 'Poppins-Bold',
    color: '#666666',
  },
  brandName: {
    fontSize: 12,
    fontFamily: 'Poppins-Medium',
    color: '#333333',
    textAlign: 'center',
    width: cardWidth - 16,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  errorText: {
    color: '#FF3B30',
    fontFamily: 'Poppins-Regular',
  },
  retryButton: {
    marginLeft: 12,
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: '#FFF0EB',
    borderRadius: 4,
  },
  retryText: {
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
    color: '#FF4500',
  },
  noDataText: {
    textAlign: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    color: '#666666',
    fontFamily: 'Poppins-Regular',
  },
}); 