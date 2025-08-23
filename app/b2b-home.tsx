import { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, RefreshControl, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { fetchFeaturedProducts, fetchRecentOrders, Product, Order } from '@/api/products';
import { useQueryClient } from '@tanstack/react-query';
import { categoriesQueryKey } from '@/hooks/useCategories';
import { Text } from '@/components/ui';
import { useSelector, useDispatch } from 'react-redux';
import { selectUser } from '@/store/authSlice';
import { selectIsDark } from '@/store/themeSlice';
import { addToCart } from '@/store/cartSlice';

// Import existing components
import LocationHeader from '@/components/home/LocationHeader';
import BrandHeader from '@/components/home/BrandHeader';
import BannerCarousel from '@/components/home/BannerCarousel';
import CategoryList from '@/components/home/CategoryList';
import FeaturedProductList from '@/components/home/FeaturedProductList';
import BrandList from '@/components/home/BrandList';

import OrderCard from '@/components/home/OrderCard';
import OrderSkeleton from '@/components/skeletons/OrderSkeleton';

// Import new B2B components
import QuickActionPanel from '@/components/home/QuickActionPanel';
import OrderInTransitCard from '@/components/home/OrderInTransitCard';
import SpecialOffersGrid from '@/components/home/SpecialOffersGrid';
import B2BSpecialOffersGrid from '@/components/home/B2BSpecialOffersGrid';
import HealthConcernsNav from '@/components/home/HealthConcernsNav';
import B2BHealthConcernsNav from '@/components/home/B2BHealthConcernsNav';
import B2BTrendingProductList from '@/components/home/B2BTrendingProductList';
import VerifiedSuppliersList from '@/components/home/VerifiedSuppliersList';
import B2BCategoryShowcase from '@/components/home/B2BCategoryShowcase';
import CategoryLayoutDemo from '@/components/home/CategoryLayoutDemo';
import SkinHairCareCarousel from '@/components/home/SkinHairCareCarousel';
import ProductCardShowcase from '@/components/home/ProductCardShowcase';

export default function B2BHomeScreen() {
  const router = useRouter();
  const dispatch = useDispatch();
  const isDark = useSelector(selectIsDark);
  const user = useSelector(selectUser);
  
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [trendingProducts, setTrendingProducts] = useState<Product[]>([]);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [notificationCount] = useState(3);
  
  const queryClient = useQueryClient();

  // B2B-focused banner content
  const b2bBanners = [
    {
      id: '1',
      image: 'https://www.ayurcentralonline.com/wp-content/uploads/webp_images/web-sm-1-bn-1.webp',
      title: 'Stock Up & Save Big',
      subtitle: 'Bulk orders get extra 10% off + Free shipping'
    },
    {
      id: '2',
      image: 'https://www.ayurcentralonline.com/wp-content/uploads/webp_images/2-1-3.webp',
      title: 'New Immunity Range',
      subtitle: 'MOQ as low as 5 units • High margins'
    },
    {
      id: '3',
      image: 'https://www.ayurcentralonline.com/wp-content/uploads/webp_images/1-1-3.webp',
      title: 'Festival Season Stock',
      subtitle: 'Pre-order now • Deliver when you need'
    }
  ];

  const promotionalBanners = [
    {
      id: '4',
      image: 'https://www.ayurcentralonline.com/wp-content/uploads/2024/09/Diabetes-mobile-1.webp',
      title: 'Diabetes Care Range',
      subtitle: 'Complete solutions for retailers'
    },
    {
      id: '5',
      image: 'https://www.ayurcentralonline.com/wp-content/uploads/webp_images/summer-heat.webp',
      title: 'Summer Wellness',
      subtitle: 'Stock heat-relief products'
    }
  ];
  
  useEffect(() => {
    loadData();
  }, []);
  
  const loadData = async () => {
    try {
      setIsLoading(true);
      const [productsData, ordersData] = await Promise.all([
        fetchFeaturedProducts(),
        fetchRecentOrders()
      ]);
      setFeaturedProducts(productsData);
      setTrendingProducts(productsData.slice(0, 6)); // Use subset for trending
      setRecentOrders(ordersData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const onRefresh = async () => {
    setRefreshing(true);
    queryClient.invalidateQueries({ queryKey: categoriesQueryKey });
    await loadData();
    setRefreshing(false);
  };
  
  const handleProductPress = (productId: string) => {
    router.push(`/product/${productId}`);
  };
  
  const handleOrderPress = (orderId: string) => {
    router.push(`/order-tracking/${orderId}`);
  };
  
  const handleCategoryPress = (categoryId: string) => {
    router.push({
      pathname: '/search',
      params: { category: categoryId }
    });
  };

  const handleAddToCart = (product: Product) => {
    const cartItem = {
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1,
      discount: product.discount,
    };
    dispatch(addToCart(cartItem));
  };

  const handleNotificationPress = () => {
    router.push('/notifications' as any);
  };

  return (
    <View style={[styles.container, { backgroundColor: isDark ? '#121212' : '#F8F8F8' }]}> 
      <StatusBar style={isDark ? 'light' : 'dark'} />
      
      {/* Brand Header with Logo */}
      <BrandHeader 
        onNotificationPress={handleNotificationPress}
        notificationCount={notificationCount}
      />
      
      {/* Enhanced Location Header with B2B messaging */}
      {/* <LocationHeader currentAddress="📍 Mumbai Central • 🚚 Free delivery on ₹500+" /> */}
      
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >

        {/* Hero Banner with B2B messaging */}
        <BannerCarousel 
          data={b2bBanners} 
          style={styles.heroBanner}
          isLoading={isLoading}
        />

        {/* Quick Actions Panel */}
        <QuickActionPanel />
        
        {/* Order in Transit Card */}
        <OrderInTransitCard />

        <CategoryList
          onCategoryPress={handleCategoryPress}
        />
        
        {/* B2B Category Showcase with 9 Different Card Designs */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text variant="h4" weight="semibold">🌟 Premium B2B Categories</Text>
            <TouchableOpacity onPress={() => router.push('/categories' as any)}>
              <Text variant="body-sm" weight="medium" color="accent">Explore All</Text>
            </TouchableOpacity>
          </View>
          <B2BCategoryShowcase
            onCategoryPress={(category) => {
              console.log('Category pressed:', category);
              handleCategoryPress(category.id);
            }}
          />
        </View>
        
        {/* Skin & Hair Care Carousel - 9 Cards with Same Design */}
        <SkinHairCareCarousel
          onCardPress={(card) => {
            console.log('Skin & Hair Care card pressed:', card);
            // Navigate to the specific category or product listing
            router.push({
              pathname: '/search',
              params: { category: 'skin-hair-care', subcategory: card.id }
            });
          }}
        />
        
        {/* Special Offers Grid */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text variant="h4" weight="semibold">🎯 Special B2B Offers</Text>
            <TouchableOpacity onPress={() => router.push('/offers' as any)}>
              <Text variant="body-sm" weight="medium" color="accent">See All</Text>
            </TouchableOpacity>
          </View>
          <B2BSpecialOffersGrid 
            onOfferPress={(offer) => console.log('Offer pressed:', offer)} 
          />
        </View>
        
        {/* Categories with B2B enhancements */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text variant="h4" weight="semibold">🛍️ Shop by Category</Text>
            <TouchableOpacity onPress={() => router.push('/categories' as any)}>
              <Text variant="body-sm" weight="medium" color="accent">See All</Text>
            </TouchableOpacity>
          </View>
          
          <CategoryList 
            onCategoryPress={handleCategoryPress}
          />
        </View>
        
        {/* Trending Products with B2B indicators */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text variant="h4" weight="semibold">🔥 Trending This Week</Text>
            <TouchableOpacity onPress={() => router.push('/trending' as any)}>
              <Text variant="body-sm" weight="medium" color="accent">See All</Text>
            </TouchableOpacity>
          </View>
          
          {isLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#FF4500" />
            </View>
          ) : (
            <B2BTrendingProductList 
              onProductPress={(product) => handleProductPress(product.id)}
            />
          )}
        </View>
        
        {/* Health Concerns Navigation */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text variant="h4" weight="semibold">🏥 Shop by Health Concerns</Text>
            <TouchableOpacity onPress={() => router.push('/health-concerns' as any)}>
              <Text variant="body-sm" weight="medium" color="accent">See All</Text>
            </TouchableOpacity>
          </View>
          <B2BHealthConcernsNav 
            onConcernPress={(concern) => console.log('Health concern pressed:', concern)} 
          />
        </View>
        
        {/* Verified Suppliers Section */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text variant="h4" weight="semibold">🏆 Verified Suppliers</Text>
            <TouchableOpacity onPress={() => router.push('/suppliers' as any)}>
              <Text variant="body-sm" weight="medium" color="accent">See All</Text>
            </TouchableOpacity>
          </View>
          
          {isLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#FF4500" />
            </View>
          ) : (
            <VerifiedSuppliersList 
              onSupplierPress={(supplier) => console.log('Supplier pressed:', supplier)} 
            />
          )}
        </View>
        
        {/* Promotional Banners */}
        <BannerCarousel 
          data={promotionalBanners} 
          style={styles.promotionalBanner}
          isLoading={isLoading}
        />
        
        {/* Featured Products */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text variant="h4" weight="semibold">⭐ Featured Products</Text>
            <TouchableOpacity onPress={() => router.push('/featured' as any)}>
              <Text variant="body-sm" weight="medium" color="accent">See All</Text>
            </TouchableOpacity>
          </View>
          
          <FeaturedProductList 
            products={featuredProducts} 
            onProductPress={handleProductPress}
            onAddToCart={handleAddToCart}
            isLoading={isLoading}
          />
        </View>

        {/* Product Card Design Showcase */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text variant="h4" weight="semibold">🎨 Product Card Designs</Text>
            <TouchableOpacity onPress={() => router.push('/design-gallery' as any)}>
              <Text variant="body-sm" weight="medium" color="accent">Gallery</Text>
            </TouchableOpacity>
          </View>
          
          <ProductCardShowcase />
        </View>
        
        {/* Quick Reorder Section */}
        {recentOrders.length > 0 && (
          <View style={styles.sectionContainer}>
            <View style={styles.sectionHeader}>
              <Text variant="h4" weight="semibold">⚡ Quick Reorder</Text>
              <TouchableOpacity onPress={() => router.push('/profile/orders' as any)}>
                <Text variant="body-sm" weight="medium" color="accent">See All</Text>
              </TouchableOpacity>
            </View>
            
            {isLoading ? (
              <OrderSkeleton />
            ) : (
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.ordersList}
              >
                {recentOrders.slice(0, 3).map((order) => (
                  <OrderCard 
                    key={order.id}
                    order={order}
                    onPress={() => handleOrderPress(order.id)}
                  />
                ))}
              </ScrollView>
            )}
          </View>
        )}
        
        {/* Business Support Section */}
        <View style={[
          styles.businessSupportSection,
          { backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF' }
        ]}>
          <Text variant="h4" weight="semibold" style={styles.supportTitle}>
            📞 Need Business Support?
          </Text>
          <Text variant="body" color="secondary" style={styles.supportDescription}>
            Get dedicated support for bulk orders, custom pricing, and business solutions.
          </Text>
          
          <View style={styles.supportActions}>
            <TouchableOpacity 
              style={[styles.supportButton, styles.primaryButton]}
              onPress={() => router.push('/support' as any)}
            >
              <Text variant="body-sm" weight="semibold" color="inverse">
                Contact Support
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.supportButton, styles.secondaryButton]}
              onPress={() => router.push('/catalog' as any)}
            >
              <Text variant="body-sm" weight="semibold" color="accent">
                View Catalog
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        
        {/* Footer Spacing */}
        <View style={styles.footerSpacing} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  sectionContainer: {
    marginVertical: 8,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  heroBanner: {
    marginTop: 8,
    marginBottom: 16,
  },
  promotionalBanner: {
    marginVertical: 16,
  },
  loadingContainer: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ordersList: {
    paddingHorizontal: 16,
  },
  businessSupportSection: {
    marginHorizontal: 16,
    marginVertical: 20,
    padding: 20,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  supportTitle: {
    marginBottom: 8,
  },
  supportDescription: {
    marginBottom: 16,
    lineHeight: 20,
  },
  supportActions: {
    flexDirection: 'row',
    gap: 12,
  },
  supportButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  primaryButton: {
    backgroundColor: '#FF4500',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#FF4500',
  },
  footerSpacing: {
    height: 20,
  },
}); 