import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  ImageBackground,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
  Platform,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, Search, Share2 } from 'lucide-react-native';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
  useAnimatedStyle,
  interpolate,
  Extrapolate,
  withSpring,
} from 'react-native-reanimated';

import Text from '../components/ui/Text';
import ProductCard from '../components/search/ProductCard';
import { searchProducts, fetchProductsByCategorySlug, ProductApiResponse, PaginationOptions } from '../api/products';
import { fetchCategories } from '../api/categories';
import { colors } from '../utils/theme';

// Constants
const HEADER_HEIGHT = 100;
const HERO_TRIGGER_POINT = 200;
const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const HERO_HEIGHT = SCREEN_HEIGHT * 0.4; // 40% of screen height

// Function to get theme-based gradient colors
const getThemeGradient = () => ({
  colors: [colors.primary[700], colors.primary[600], colors.primary[500], colors.primary[400]],
  start: { x: 0, y: 0 },
  end: { x: 1, y: 1 },
});

// Types
interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  rating: number;
  ratingCount: number;
  discount?: number;
  weight?: string;
  volume?: string;
  quantity?: string;
  inStock?: boolean;
  featured?: boolean;
}

interface CategoryBrandData {
  id: string;
  name: string;
  brand_logo: string;
  type: 'category' | 'brand';
  description?: string;
  logo?: string;
  heroProducts: Product[];
  products: Product[];
  gradient?: {
    colors: string[];
    start?: { x: number; y: number };
    end?: { x: number; y: number };
  };
}

export default function CategoryBrandDetailsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  
  // Animation values
  const scrollY = useSharedValue(0);
  const headerOpacity = useSharedValue(0);
  
  // Pagination state
  const [paginationParams, setPaginationParams] = useState<PaginationOptions>({
    offset: 0,
    limit: 20
  });
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [allProducts, setAllProducts] = useState<Product[]>([]);

  // Initialize with params data
  const [data, setData] = useState<CategoryBrandData>({
    id: params.id as string || '1',
    name: params.name as string || 'Brand',
    brand_logo: params.brand_logo as string || '',
    type: (params.type as 'category' | 'brand') || 'brand',
    description: `Premium ${params.name} products`,
    logo: undefined,
    heroProducts: [],
    products: [],
    gradient: {
      colors: ['#4C1D95', '#7C3AED', '#A855F7', '#C084FC'],
      start: { x: 0, y: 0 },
      end: { x: 1, y: 1 },
    },
  });

  // Function to get appropriate gradient based on brand name or type
  const getBrandGradient = () => {
    if (!data.brand_logo || data.brand_logo.length === 0) {
      return data.gradient || getThemeGradient();
    }

    // When brand logo exists, use neutral grey/black overlay to let the logo show through
    return {
      colors: [
        'rgba(0, 0, 0, 0.5)',      // Semi-transparent black at top
        'rgba(0, 0, 0, 0.3)',      // Lighter in middle
        'rgba(40, 40, 40, 0.6)',   // Slightly grey at bottom
        'rgba(0, 0, 0, 0.7)'       // Darker black at very bottom for text readability
      ],
      start: { x: 0, y: 0 },
      end: { x: 0, y: 1 },
    };
  };

  // Render hero section with conditional background
  const renderHeroSection = () => {
    const gradient = getBrandGradient();
    const hasBrandLogo = data.brand_logo && data.brand_logo.length > 0;

    if (hasBrandLogo) {
      // Hero with brand logo background
      return (
        <ImageBackground
          source={{ uri: data.brand_logo }}
          style={styles.heroSection}
          resizeMode="cover"
        >
          {/* Gradient overlay for text readability */}
          <LinearGradient
            colors={gradient.colors}
            start={gradient.start}
            end={gradient.end}
            style={styles.heroGradientOverlay}
          >
            {renderHeroContent()}
          </LinearGradient>
        </ImageBackground>
      );
    } else {
      // Hero with gradient only (original behavior)
      const themeGradient = getThemeGradient();
      return (
        <LinearGradient
          colors={data.gradient?.colors || themeGradient.colors}
          start={data.gradient?.start || themeGradient.start}
          end={data.gradient?.end || themeGradient.end}
          style={styles.heroSection}
        >
          {renderHeroContent()}
        </LinearGradient>
      );
    }
  };

  // Render hero content (title, description, products, ad indicator)
  const renderHeroContent = () => (
    <>
      {/* Title & Description in Hero */}
      <View style={styles.heroTitleContainer}>
        <Text variant="h1" weight="bold" style={styles.heroTitle}>
          {data.name}
        </Text>
        {data.description && (
          <Text variant="body" style={styles.heroDescription}>
            {data.description}
          </Text>
        )}
      </View>

      {/* Hero Products */}
      {renderHeroProducts()}
      
      {/* Ad Indicator */}
      <View style={styles.adIndicator}>
        <Text variant="caption" style={styles.adText}>
          Ad
        </Text>
      </View>
    </>
  );

  // Categories from API for category lookups
  const {
    data: categories = [],
    isLoading: isCategoriesLoading,
  } = useQuery({
    queryKey: ['categories'],
    queryFn: () => fetchCategories(true),
    staleTime: 5 * 60 * 1000,
  });

  // Products from the selected category or brand using same API as search.tsx
  const {
    data: productsData,
    isLoading: isProductsLoading,
    isError: isProductsError,
  } = useQuery<ProductApiResponse>({
    queryKey: ['categoryBrandProducts', params.type, params.slug, params.id],
    queryFn: async () => {
      if (params.type === 'category' && params.slug) {
        // For categories, use the category slug directly
        return await fetchProductsByCategorySlug(params.slug as string, paginationParams);
      } else if (params.type === 'brand' && params.slug) {
        // For brands, use the same API call as search.tsx
        try {
          const response = await axios.get(
            `https://b2b.ayurcentralonline.com/wp-json/b2b/v1/brands/${params.slug}`,
            {
              params: {
                offset: paginationParams.offset || 0,
                limit: paginationParams.limit || 20
              }
            }
          );

          return {
            count: response.data.count || 0,
            products: response.data.products || [],
            hasMore: response.data.hasMore || false,
            nextOffset: (paginationParams.offset || 0) + (paginationParams.limit || 20)
          };
        } catch (error) {
          console.error('Error fetching brand products:', error);
          throw error;
        }
      }
      
      return { 
        count: 0, 
        products: [], 
        hasMore: false,
        nextOffset: 0 
      };
    },
    enabled: !!(params.slug && (params.type === 'category' || params.type === 'brand')),
    staleTime: 2 * 60 * 1000
  });

  // Update data when products are loaded
  useEffect(() => {
    if (productsData && productsData.products) {
      if (paginationParams.offset === 0) {
        // First load - replace products
        setAllProducts(productsData.products);
        setData(prev => ({
          ...prev,
          products: productsData.products,
          heroProducts: productsData.products.slice(0, 2),
        }));
      } else {
        // Load more - append products
        setAllProducts(prev => [...prev, ...productsData.products]);
        setData(prev => ({
          ...prev,
          products: [...prev.products, ...productsData.products],
        }));
      }
      setIsLoadingMore(false);
    }
  }, [productsData, paginationParams.offset]);

  // Scroll handler
  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
      
      // Update header opacity based on scroll position
      const opacity = interpolate(
        scrollY.value,
        [0, HERO_TRIGGER_POINT],
        [0, 1],
        Extrapolate.CLAMP
      );
      headerOpacity.value = withSpring(opacity, {
        damping: 15,
        stiffness: 150,
      });
    },
  });

  // Animated styles
  const heroHeaderStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      scrollY.value,
      [0, HERO_TRIGGER_POINT],
      [1, 0],
      Extrapolate.CLAMP
    );
    
    const translateY = interpolate(
      scrollY.value,
      [0, HERO_TRIGGER_POINT],
      [0, -50],
      Extrapolate.CLAMP
    );

    return {
      opacity,
      transform: [{ translateY }],
    };
  });

  const fixedHeaderStyle = useAnimatedStyle(() => {
    const opacity = headerOpacity.value;
    const translateY = interpolate(
      headerOpacity.value,
      [0, 1],
      [-HEADER_HEIGHT, 0],
      Extrapolate.CLAMP
    );

    return {
      opacity,
      transform: [{ translateY }],
    };
  });

  const handleBack = () => {
    router.back();
  };

  const handleSearch = () => {
    router.push('/search');
  };

  const handleShare = () => {
    // Implement share functionality
    console.log('Share pressed');
  };

  const handleProductPress = (product: Product) => {
    router.push(`/product/${product.id}`);
  };

  const handleAddToCart = (product: Product) => {
    // Implement add to cart functionality
    console.log('Add to cart:', product.name);
  };

  const loadMoreProducts = async () => {
    if (isLoadingMore || !productsData?.hasMore) return;
    
    setIsLoadingMore(true);
    const newOffset = (paginationParams.offset || 0) + (paginationParams.limit || 20);
    setPaginationParams(prev => ({ ...prev, offset: newOffset }));
  };

  const renderHeroProducts = () => {
    if (data.heroProducts.length === 0) return null;

    return (
      <View style={styles.heroProductsContainer}>
        {data.heroProducts.slice(0, 2).map((product, index) => (
          <View key={product.id} style={styles.heroProduct}>
            <Image 
              source={product.image ? { uri: product.image } : require('../assets/logo.png')} 
              style={styles.heroProductImage}
            />
          </View>
        ))}
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: '#F8F8F8' }]}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      
      {/* Hero Header - Animated */}
      <Animated.View style={[styles.heroHeader, heroHeaderStyle]}>
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.heroHeaderContent}>
            <TouchableOpacity style={styles.heroHeaderButton} onPress={handleBack}>
              <ArrowLeft size={24} color="#FFFFFF" />
            </TouchableOpacity>
            
            <View style={styles.heroHeaderActions}>
              <TouchableOpacity style={styles.heroHeaderButton} onPress={handleSearch}>
                <Search size={24} color="#FFFFFF" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.heroHeaderButton} onPress={handleShare}>
                <Share2 size={24} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>
      </Animated.View>

      {/* Fixed Header - Animated */}
      <Animated.View style={[styles.fixedHeader, fixedHeaderStyle]}>
        <LinearGradient
          colors={data.gradient?.colors || ['#4C1D95', '#7C3AED']}
          start={data.gradient?.start}
          end={data.gradient?.end}
          style={styles.fixedHeaderGradient}
        >
          <SafeAreaView style={styles.safeArea}>
            <View style={styles.fixedHeaderContent}>
              <TouchableOpacity style={styles.fixedHeaderButton} onPress={handleBack}>
                <ArrowLeft size={20} color="#FFFFFF" />
              </TouchableOpacity>
              
              <Text variant="h3" weight="semibold" style={styles.fixedHeaderTitle}>
                {data.name}
              </Text>
              
              <View style={styles.fixedHeaderActions}>
                <TouchableOpacity style={styles.fixedHeaderButton} onPress={handleSearch}>
                  <Search size={20} color="#FFFFFF" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.fixedHeaderButton} onPress={handleShare}>
                  <Share2 size={20} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
            </View>
          </SafeAreaView>
        </LinearGradient>
      </Animated.View>

      <Animated.ScrollView 
        style={styles.scrollView} 
        showsVerticalScrollIndicator={false}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
      >
        {/* Hero Section */}
        {renderHeroSection()}

        {/* Floating Brand Logo Circle - Only for Brands */}
        {data.type === 'brand' && (
          <View style={styles.floatingLogoContainer}>
            <View style={styles.floatingLogo}>
              <Image 
                source={
                  data.brand_logo && data.brand_logo.length > 0 
                    ? { uri: data.brand_logo } 
                    : data.logo 
                      ? { uri: data.logo } 
                      : require('../assets/logo.png')
                } 
                style={styles.floatingLogoImage}
              />
            </View>
          </View>
        )}

        {/* Spacer Section - Conditional spacing */}
        {/* <View style={[styles.spacerSection, { height: data.type === 'brand' ? 70 : 30 }]} /> */}

        {/* Products List */}
        <View style={styles.productsSection}>
          <View style={styles.productsSectionHeader}>
            <Text variant="h2" weight="bold" style={styles.productsSectionTitle}>
              Products
            </Text>
            {productsData && productsData.count > 0 && (
              <Text variant="body" color="secondary" style={styles.productsCount}>
                {productsData.count} items
              </Text>
            )}
          </View>
          
          {isProductsLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={colors.primary[600]} />
              <Text variant="body" color="secondary" style={styles.loadingText}>
                Loading {data.name} products...
              </Text>
            </View>
          ) : data.products.length > 0 ? (
            <View style={styles.productsGrid}>
              {data.products.map((product) => (
                <View key={product.id} style={styles.productCardContainer}>
                  <ProductCard
                    product={product}
                    onPress={() => handleProductPress(product)}
                    onAddToCart={() => handleAddToCart(product)}
                  />
                </View>
              ))}
              
              {/* Load More Button */}
              {productsData?.hasMore && (
                <View style={styles.loadMoreContainer}>
                  <TouchableOpacity 
                    style={[styles.loadMoreButton, isLoadingMore && styles.loadMoreButtonDisabled]}
                    onPress={loadMoreProducts}
                    disabled={isLoadingMore}
                  >
                    {isLoadingMore ? (
                      <ActivityIndicator size="small" color="#FFFFFF" />
                    ) : (
                      <Text variant="body" weight="semibold" style={styles.loadMoreText}>
                        Load More Products
                      </Text>
                    )}
                  </TouchableOpacity>
                </View>
              )}
            </View>
          ) : (
            <View style={styles.emptyContainer}>
              <Text variant="h3" color="secondary" style={styles.emptyTitle}>
                No Products Found
              </Text>
              <Text variant="body" color="secondary" style={styles.emptyDescription}>
                We couldn't find any products in this {data.type}.
              </Text>
            </View>
          )}
        </View>
      </Animated.ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8', // Match search.tsx background
  },
  safeArea: {
    flex: 1,
  },
  // Hero Header (appears over gradient)
  heroHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 20,
  },
  heroHeaderContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 50 : 16,
    paddingBottom: 16,
  },
  heroHeaderButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    backdropFilter: 'blur(10px)',
  },
  heroHeaderActions: {
    flexDirection: 'row',
    gap: 12,
  },
  // Fixed Header (appears on scroll)
  fixedHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 30,
    height: HEADER_HEIGHT,
  },
  fixedHeaderGradient: {
    flex: 1,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  fixedHeaderContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 8 : 16,
    paddingBottom: 16,
  },
  fixedHeaderButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fixedHeaderTitle: {
    color: '#FFFFFF',
    maxWidth: 200,
    textAlign: 'center',
  },
  fixedHeaderActions: {
    flexDirection: 'row',
    gap: 8,
  },
  scrollView: {
    flex: 1,
  },
  heroSection: {
    height: HERO_HEIGHT,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: Platform.OS === 'ios' ? 80 : 60,
    paddingBottom: 20,
  },
  heroGradientOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  heroTitleContainer: {
    alignItems: 'center',
    marginTop: 50,
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  heroTitle: {
    color: '#FFFFFF',
    textAlign: 'center',
    // marginBottom: 6,
    fontSize: 25, // Reduced from default h1 size
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  heroDescription: {
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    lineHeight: 18,
    fontSize: 14, // Reduced font size
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  heroProductsContainer: {
    flexDirection: 'row',
    gap: 15,
    alignItems: 'center',
    marginBottom: 15,
  },
  heroProduct: {
    width: 90, // Reduced from 120
    height: 120, // Reduced from 160
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  heroProductImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  floatingLogoContainer: {
    position: 'absolute',
    top: HERO_HEIGHT - 50, // Position exactly at the end of hero section minus half logo height
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 10,
  },
  floatingLogo: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 12,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    borderWidth: 4,
    borderColor: '#FFFFFF',
  },
  floatingLogoImage: {
    width: 70,
    height: 70,
    borderRadius: 35,
    resizeMode: 'contain',
  },
  adIndicator: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 90 : 70,
    right: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  adText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  spacerSection: {
    backgroundColor: '#F8F8F8', // Match search.tsx background
  },
  productsSection: {
    marginTop: 20,
    paddingHorizontal: 16,
    paddingBottom: 100,
  },
  productsSectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingHorizontal: 4,
  },
  productsSectionTitle: {
    color: colors.neutral[900],
  },
  productsCount: {
    fontSize: 14,
  },
  productsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  productCardContainer: {
    width: '48%', // Two columns with gap
    marginBottom: 16,
  },
  loadingContainer: {
    paddingVertical: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 12,
    textAlign: 'center',
  },
  emptyContainer: {
    paddingVertical: 60,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyTitle: {
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyDescription: {
    textAlign: 'center',
    lineHeight: 20,
  },
  loadMoreContainer: {
    width: '100%',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 10,
  },
  loadMoreButton: {
    backgroundColor: colors.primary[600],
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 12,
    minWidth: 200,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  loadMoreButtonDisabled: {
    backgroundColor: colors.neutral[400],
    opacity: 0.6,
  },
  loadMoreText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
}); 