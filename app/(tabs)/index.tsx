import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, RefreshControl, ActivityIndicator, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { fetchFeaturedProducts, Product } from '@/api/products';
import CategoryList from '@/components/home/CategoryList';
import ConcernsCarousel from '@/components/home/ConcernsCarousel';
// Import React Query to handle automatic refreshing of data
import { useQueryClient } from '@tanstack/react-query';
import { categoriesQueryKey } from '@/hooks/useCategories';
import FeaturedProductList from '@/components/home/FeaturedProductList';
import OrderCard from '@/components/home/OrderCard';
import NotificationBadge from '@/components/home/NotificationBadge';
import LocationHeader from '@/components/home/LocationHeader';
import BannerCarousel from '@/components/home/BannerCarousel';
import BrandList from '@/components/home/BrandList';
import BrandHeader from '@/components/home/BrandHeader';
import { Text } from '@/components/ui';
import { useSelector, useDispatch } from 'react-redux';
import { selectUser } from '@/store/authSlice';
import { selectIsDark } from '@/store/themeSlice';
import { addToCart } from '@/store/cartSlice';
import { selectOrders, selectOrdersLoading, fetchUserOrders } from '@/store/ordersSlice';
import OrderSkeleton from '@/components/skeletons/OrderSkeleton';
import SpotlightDeals from '@/components/home/SpotlightDeals';
import SpotlightDealsVariant1 from '@/components/home/SpotlightDealsVariant1';
import SpotlightDealsVariant2 from '@/components/home/SpotlightDealsVariant2';
import SpotlightDealsVariant3 from '@/components/home/SpotlightDealsVariant3';
import SpotlightDealsVariant4 from '@/components/home/SpotlightDealsVariant4';
import SpotlightDealsVariant5 from '@/components/home/SpotlightDealsVariant5';
import { Zap } from 'lucide-react-native';
import Animated, { FadeInRight } from 'react-native-reanimated';

export default function HomeScreen() {
  const router = useRouter();
  const dispatch = useDispatch();
  const isDark = useSelector(selectIsDark);
  
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [notificationCount, setNotificationCount] = useState(3);
  
  // Get React Query client for manual data invalidation
  const queryClient = useQueryClient();

  const user = useSelector(selectUser);
  const orders = useSelector(selectOrders);
  const ordersLoading = useSelector(selectOrdersLoading);
  
  // Transform Redux orders to match OrderCard expected format
  const transformedOrders = orders.map(order => ({
    id: order.order_id.toString(),
    date: order.date_created,
    status: order.status,
    total: parseFloat(order.total),
    items: order.items.map(item => ({
      id: item.product_id.toString(),
      name: item.name,
      quantity: item.quantity,
      price: parseFloat(item.total)
    }))
  }));
  
  // Get recent orders (first 3 orders)
  const recentOrders = transformedOrders.slice(0, 3);

  const topBanners = [
    {
      id: '1',
      image: 'https://www.ayurcentralonline.com/wp-content/uploads/webp_images/web-sm-1-bn-1.webp',
      title: 'Fresh Groceries',
      subtitle: 'Get 20% off on your first order'
    },
    {
      id: '2',
      image: 'https://www.ayurcentralonline.com/wp-content/uploads/webp_images/2-1-3.webp',
      title: 'Organic Produce',
      subtitle: 'Farm fresh vegetables delivered daily'
    },
    {
      id: '3',
      image: 'https://www.ayurcentralonline.com/wp-content/uploads/webp_images/1-1-3.webp',
      title: 'Premium Meats',
      subtitle: 'Quality cuts at great prices'
    }
  ];

  const middleBanners = [
    {
      id: '4',
      image: 'https://images.pexels.com/photos/1435904/pexels-photo-1435904.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      title: 'Healthy Snacks',
      subtitle: 'Buy 2 Get 1 Free'
    },
    {
      id: '5',
      image: 'https://images.pexels.com/photos/2449665/pexels-photo-2449665.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      title: 'Dairy Products',
      subtitle: 'Fresh from local farms'
    }
  ];

  const bottomBanners = [
    {
      id: '6',
      image: 'https://www.ayurcentralonline.com/wp-content/uploads/2024/09/Diabetes-mobile-1.webp',
      title: 'Weekend Special',
      subtitle: 'Up to 40% off on fresh fruits'
    },
    {
      id: '7',
      image: 'https://www.ayurcentralonline.com/wp-content/uploads/webp_images/summer-heat.webp',
      title: 'Bakery Items',
      subtitle: 'Freshly baked everyday'
    }
  ];
  
  useEffect(() => {
    loadData();
    // Fetch orders if user is logged in
    if (user?.id) {
      const userId = typeof user.id === 'string' ? parseInt(user.id) : user.id;
      dispatch(fetchUserOrders(userId) as any);
    }
  }, [dispatch, user?.id]);
  
  const loadData = async () => {
    try {
      setIsLoading(true);
      const productsData = await fetchFeaturedProducts();
      setFeaturedProducts(productsData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const onRefresh = async () => {
    setRefreshing(true);
    // Invalidate and refetch categories
    queryClient.invalidateQueries({ queryKey: categoriesQueryKey });
    await loadData();
    // Refresh orders if user is logged in
    if (user?.id) {
      const userId = typeof user.id === 'string' ? parseInt(user.id) : user.id;
      dispatch(fetchUserOrders(userId) as any);
    }
    setRefreshing(false);
  };
  
  const handleProductPress = (productId: string) => {
    router.push(`/product/${productId}`);
  };
  
  const handleOrderPress = (orderId: number) => {
    router.push(`/order-details?id=${orderId}`);
  };
  
  const handleNotificationPress = () => {
    router.push('/notifications');
  };
  
  const handleCategoryPress = (categoryId: string) => {
    router.push({
      pathname: '/search',
      params: { category: categoryId }
    });
  };

  const handleQuickOrderPress = () => {
    router.push('/(tabs)/quick-order');
  };

    const handleAddToCart = (product: Product) => {
    // Transform the Product into a CartItem by adding quantity
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

  return (
    <View style={[styles.container, { backgroundColor: isDark ? '#121212' : '#F8F8F8' }]}> 
      <StatusBar style={isDark ? 'light' : 'dark'} />
      
      {/* Brand Header with Logo */}
      <BrandHeader 
        onNotificationPress={handleNotificationPress}
        notificationCount={notificationCount}
      />
      
      {/* Location Header */}
      {/* <LocationHeader currentAddress="123 Main Street, Apt 4B" /> */}
      
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <BannerCarousel 
          data={topBanners} 
          style={styles.topBanner}
          isLoading={isLoading}
        />
        <CategoryList 
          onCategoryPress={handleCategoryPress}
        />
        
        {/* Quick Order Button */}
        <Animated.View entering={FadeInRight.delay(300)} style={styles.quickOrderContainer}>
          <TouchableOpacity 
            style={[styles.quickOrderButton, { backgroundColor: isDark ? '#FF6B35' : '#FF4500' }]}
            onPress={handleQuickOrderPress}
            activeOpacity={0.9}
          >
            <Zap size={20} color="#FFF" />
            <Text variant="body" weight="semibold" style={styles.quickOrderText}>Quick Order</Text>
            <Text variant="caption" style={styles.quickOrderSubtext}>Add items instantly</Text>
          </TouchableOpacity>
        </Animated.View>
        
        <SpotlightDeals/>
        <SpotlightDealsVariant1/>
        <SpotlightDealsVariant2/>
        <SpotlightDealsVariant3/>
        <SpotlightDealsVariant4/>
        <SpotlightDealsVariant5/>
        <ConcernsCarousel isLoading={isLoading} />
        {/* <BannerCarousel 
          data={middleBanners} 
          style={styles.middleBanner}
          isLoading={isLoading}
        /> */}
        {/* Replace MultiBanner with BrandList */}
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#FF4500" />
          </View>
        ) : (
          <BrandList />
        )}
        <FeaturedProductList 
          products={featuredProducts} 
          onProductPress={handleProductPress}
          onAddToCart={handleAddToCart}
          isLoading={isLoading}
        />
        <BannerCarousel 
          data={bottomBanners} 
          style={styles.bottomBanner}
          isLoading={isLoading}
        />
        {/* Recent Orders Section */}
        {user?.id && (
          ordersLoading ? (
            <View style={styles.recentOrdersSection}>
              <View style={styles.sectionHeader}>
                <Text variant="h4" weight="semibold">Recent Orders</Text>
                <TouchableOpacity onPress={() => router.push('/profile/orders')}>
                  <Text variant="body-sm" weight="medium" color="accent">See All</Text>
                </TouchableOpacity>
              </View>
              <OrderSkeleton />
            </View>
          ) : recentOrders.length > 0 && (
            <View style={styles.recentOrdersSection}>
              <View style={styles.sectionHeader}>
                <Text variant="h4" weight="semibold">Recent Orders</Text>
                <TouchableOpacity onPress={() => router.push('/profile/orders')}>
                  <Text variant="body-sm" weight="medium" color="accent">See All</Text>
                </TouchableOpacity>
              </View>
              {recentOrders.map((order, index) => (
                <OrderCard 
                  key={order.id} 
                  order={order} 
                  onPress={() => handleOrderPress(parseInt(order.id))}
                />
              ))}
            </View>
          )
        )}
        <View style={styles.bottomSection}>
          <View style={styles.promoImageContainer}>
            <Image 
              source={{ uri: 'https://www.ayurcentralonline.com/wp-content/uploads/2024/09/final-mobile-versions-3-1.webp' }}
              style={styles.promoImage}
              resizeMode="contain"
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  recentOrdersSection: {
    marginBottom: 24,
  },
  spacer: {
    height: 100,
  },
  // Add missing styles for banners
  topBanner: {
    marginBottom: 16,
  },
  middleBanner: {
    marginVertical: 16,
  },
  bottomBanner: {
    marginVertical: 16,
  },
  loadingContainer: {
    padding: 20,
    alignItems: 'center',
  },
  bottomSection: {
    backgroundColor: '#fb6b3b',
    width: '100%',
    marginTop: 16,
  },
  promoImageContainer: {
    width: '100%',
  },
  promoImage: {
    width: '100%',
    height: 200,
  },
  promoContainer: {
    paddingHorizontal: 16,
    paddingVertical: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  promoText: {
    textAlign: 'center',
    color: '#FF4500',
    fontSize: 24,
    lineHeight: 32,
  },
  quickOrderContainer: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  quickOrderButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  quickOrderText: {
    color: '#FFF',
    marginLeft: 8,
    marginRight: 8,
  },
  quickOrderSubtext: {
    color: '#FFE4E1',
    fontSize: 12,
  },

});