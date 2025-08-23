import * as React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Image, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Text } from '@/components/ui';
import { useSelector } from 'react-redux';
import { selectIsDark } from '@/store/themeSlice';
import { useRouter } from 'expo-router';
import Animated, { FadeInDown, FadeInLeft, FadeInRight, FadeIn, withTiming, useSharedValue, useAnimatedStyle, interpolate } from 'react-native-reanimated';
import ProductCardPremium from './ProductCardPremium';

const { width } = Dimensions.get('window');

// Sample spotlight products data
const spotlightProducts = [
  {
    id: '1',
    name: 'Organic India Pure Cow Ghee',
    price: 849,
    image: 'https://www.ayurcentralonline.com/wp-content/uploads/2023/10/Organic-India-Pure-Cow-Ghee-500ml.webp',
    rating: 4.5,
    ratingCount: 1839,
    discount: 40,
    weight: '500 ml',
    inStock: true,
    featured: true,
  },
  {
    id: '2',
    name: 'Organic Tattva Wheat Organic Atta',
    price: 449,
    image: 'https://www.ayurcentralonline.com/wp-content/uploads/2023/10/Organic-Tattva-Wheat-Organic-Atta-5-kg.webp',
    rating: 4.4,
    ratingCount: 2120,
    discount: 43,
    weight: '5 kg',
    inStock: true,
    featured: true,
  },
  {
    id: '3',
    name: 'Tata Sampann Organic Arhar Dal',
    price: 140,
    image: 'https://www.ayurcentralonline.com/wp-content/uploads/2023/10/Tata-Sampann-Organic-Arhar-Dal-Unpolished-500g.webp',
    rating: 4.6,
    ratingCount: 2545,
    discount: 40,
    weight: '500 g',
    inStock: true,
    featured: true,
  },
  {
    id: '4',
    name: 'Organic Wheat Atta Premium',
    price: 95,
    image: 'https://www.ayurcentralonline.com/wp-content/uploads/2023/10/Organic-Wheat-Atta-1kg.webp',
    rating: 4.3,
    ratingCount: 892,
    discount: 42,
    weight: '1 kg',
    inStock: true,
    featured: true,
  },
  {
    id: '5',
    name: 'Ashwagandha Capsules Premium',
    price: 299,
    image: 'https://images.unsplash.com/photo-1584362917165-526a968579e8?w=500',
    rating: 4.5,
    ratingCount: 1287,
    discount: 35,
    weight: '60 capsules',
    inStock: true,
    featured: true,
  }
];

const SpotlightDealsVariant2 = () => {
  const isDark = useSelector(selectIsDark);
  const router = useRouter();

  const handleProductPress = (productId: string) => {
    router.push(`/product/${productId}`);
  };

  const handleSeeAllPress = () => {
    router.push('/search?spotlight=true');
  };

  const handleAddToCart = (productId: string) => {
    console.log('Add to cart:', productId);
  };

  return (
    <Animated.View 
      entering={FadeIn.duration(1000).springify()}
      style={styles.outerContainer}
    >
      {/* Fire Banner Header */}
      <Animated.View 
        entering={FadeInDown.delay(100).duration(800).springify()}
        style={styles.fireBannerContainer}
      >
        <LinearGradient
          colors={['#ff6b35', '#f7931e', '#ffcc02']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.fireBanner}
        >
          <View style={styles.fireContent}>
            <Text style={styles.fireIcon}>🔥</Text>
            <Text style={styles.fireTitle}>HOT DEALS</Text>
            <Text style={styles.fireIcon}>🔥</Text>
          </View>
          
          {/* Flame decorations */}
          <View style={styles.flameContainer}>
            <Text style={[styles.flame, styles.flame1]}>🔥</Text>
            <Text style={[styles.flame, styles.flame2]}>🔥</Text>
            <Text style={[styles.flame, styles.flame3]}>🔥</Text>
          </View>
        </LinearGradient>
      </Animated.View>

      <Animated.View 
        entering={FadeInDown.duration(800).springify()}
        style={styles.container}
      >
        <LinearGradient
          colors={['#ff8a50', '#ff6b35', '#e85a4f']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradientContainer}
        >
          {/* Sun rays background */}
          <View style={styles.sunRaysContainer}>
            {[...Array(8)].map((_, index) => (
              <Animated.View
                key={index}
                entering={FadeInLeft.delay(300 + (index * 50)).duration(1000)}
                style={[
                  styles.sunRay,
                  { transform: [{ rotate: `${index * 45}deg` }] }
                ]}
              />
            ))}
          </View>

          {/* Header Section */}
          <Animated.View 
            entering={FadeInDown.delay(400).duration(800)}
            style={styles.headerSection}
          >
            <View style={styles.sunIconContainer}>
              <LinearGradient
                colors={['#ffcc02', '#ff6b35']}
                style={styles.sunIcon}
              >
                <Text style={styles.sunEmoji}>☀️</Text>
              </LinearGradient>
            </View>
            <Text style={styles.heroText}>SIZZLING SUMMER SALE</Text>
            <Text style={styles.discountText}>Save Big on Organic Products</Text>
            <View style={styles.timerContainer}>
              <Text style={styles.timerText}>⏰ Limited Time Only!</Text>
            </View>
          </Animated.View>

          {/* Product Cards */}
          <Animated.View entering={FadeInDown.delay(600).duration(800)}>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.productsScrollContent}
              style={styles.productsScroll}
            >
              {spotlightProducts.map((product, index) => (
                <Animated.View
                  key={product.id}
                  entering={FadeInDown.delay(700 + (index * 120)).springify()}
                  style={styles.productCardWrapper}
                >
                  <ProductCardPremium
                    product={product}
                    onPress={() => handleProductPress(product.id)}
                    onAddToCart={() => handleAddToCart(product.id)}
                  />
                </Animated.View>
              ))}
            </ScrollView>
          </Animated.View>

          {/* Action Footer */}
          <Animated.View entering={FadeInDown.delay(900).duration(600)}>
            <TouchableOpacity style={styles.actionFooter} onPress={handleSeeAllPress}>
              <LinearGradient
                colors={['#ffcc02', '#ff8a50']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.actionButton}
              >
                <Text style={styles.actionIcon}>🛒</Text>
                <Text style={styles.actionText}>SHOP ALL DEALS</Text>
                <Text style={styles.actionArrow}>→</Text>
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>
        </LinearGradient>
      </Animated.View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    marginHorizontal: 12,
    marginVertical: 8,
    position: 'relative',
  },
  container: {
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#ff6b35',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 15,
  },
  gradientContainer: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 16,
    position: 'relative',
    overflow: 'hidden',
  },

  // Fire Banner
  fireBannerContainer: {
    position: 'absolute',
    top: -12,
    left: 0,
    right: 0,
    zIndex: 10,
    alignItems: 'center',
  },
  fireBanner: {
    paddingHorizontal: 24,
    paddingVertical: 8,
    borderRadius: 20,
    shadowColor: '#ff6b35',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
    position: 'relative',
  },
  fireContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  fireIcon: {
    fontSize: 16,
    marginHorizontal: 4,
  },
  fireTitle: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: 2,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  flameContainer: {
    position: 'absolute',
    top: -8,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  flame: {
    fontSize: 8,
    opacity: 0.7,
  },
  flame1: {
    left: 10,
  },
  flame2: {
    transform: [{ rotate: '15deg' }],
  },
  flame3: {
    right: 10,
  },

  // Sun rays background
  sunRaysContainer: {
    position: 'absolute',
    top: '30%',
    left: '50%',
    width: 200,
    height: 200,
    marginLeft: -100,
    marginTop: -100,
  },
  sunRay: {
    position: 'absolute',
    top: '50%',
    left: '60%',
    width: 2,
    height: 60,
    backgroundColor: 'rgba(255, 204, 2, 0.2)',
    transformOrigin: '1px 0px',
    borderRadius: 1,
  },

  // Header Section
  headerSection: {
    alignItems: 'center',
    // marginTop: 24,
    marginBottom: 20,
    paddingTop: 10,
    zIndex: 1,
  },
  sunIconContainer: {
    marginBottom: 8,
  },
  sunIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#ffcc02',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },
  sunEmoji: {
    fontSize: 24,
  },
  heroText: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '900',
    textAlign: 'center',
    letterSpacing: 1,
    textShadowColor: 'rgba(0, 0, 0, 0.4)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
    marginVertical: 4,
    // paddingTop: 6,
    lineHeight: 28,
  },
  discountText: {
    color: 'rgba(255, 255, 255, 0.95)',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 8,
  },
  timerContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  timerText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },

  // Products Section
  productsScroll: {
    marginHorizontal: -16,
    zIndex: 1,
  },
  productsScrollContent: {
    paddingHorizontal: 16,
    paddingRight: 32,
  },
  productCardWrapper: {
    marginRight: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
    borderWidth: 2,
    borderColor: 'rgba(255, 204, 2, 0.3)',
  },

  // Action Footer
  actionFooter: {
    marginTop: 18,
    zIndex: 1,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 18,
    shadowColor: '#ffcc02',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  actionIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  actionText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 1,
    marginRight: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  actionArrow: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '900',
  },
});

export default SpotlightDealsVariant2; 