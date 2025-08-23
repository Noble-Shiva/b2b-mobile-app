import * as React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Image, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Text } from '@/components/ui';
import { useSelector } from 'react-redux';
import { selectIsDark } from '@/store/themeSlice';
import { useRouter } from 'expo-router';
import Animated, { FadeInDown, FadeInLeft, FadeInRight, FadeInUp } from 'react-native-reanimated';
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

const SpotlightDealsVariant1 = () => {
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
      entering={FadeInUp.duration(800).springify()}
      style={styles.outerContainer}
    >
      {/* Minimalist Header Badge */}
      <Animated.View 
        entering={FadeInDown.delay(100).duration(600).springify()}
        style={styles.headerBadge}
      >
        <LinearGradient
          colors={['#667eea', '#764ba2']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.badgeGradient}
        >
          <View style={styles.badgeContent}>
            <Text style={styles.badgeIcon}>⚡</Text>
            <Text style={styles.badgeText}>SPOTLIGHT</Text>
          </View>
        </LinearGradient>
      </Animated.View>

      <Animated.View 
        entering={FadeInDown.duration(800).springify()}
        style={styles.container}
      >
        <LinearGradient
          colors={['#1a1a2e', '#16213e', '#0f3460']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradientContainer}
        >
          {/* Geometric Background Pattern */}
          <View style={styles.backgroundPattern}>
            <Animated.View 
              entering={FadeInLeft.delay(200).duration(1200)}
              style={[styles.geometricShape, styles.shape1]}
            />
            <Animated.View 
              entering={FadeInRight.delay(400).duration(1200)}
              style={[styles.geometricShape, styles.shape2]}
            />
            <Animated.View 
              entering={FadeInLeft.delay(600).duration(1200)}
              style={[styles.geometricShape, styles.shape3]}
            />
          </View>

          {/* Header Section */}
          <Animated.View 
            entering={FadeInDown.delay(300).duration(800)}
            style={styles.headerSection}
          >
            <Text style={styles.discountText}>UP TO 45% OFF</Text>
            <Text style={styles.titleText}>Premium Organics</Text>
            <View style={styles.subtitleContainer}>
              <View style={styles.dotIndicator} />
              <Text style={styles.subtitleText}>Limited time only</Text>
              <View style={styles.dotIndicator} />
            </View>
          </Animated.View>

          {/* Product Cards */}
          <Animated.View entering={FadeInDown.delay(500).duration(800)}>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.productsScrollContent}
              style={styles.productsScroll}
            >
              {spotlightProducts.map((product, index) => (
                <Animated.View
                  key={product.id}
                  entering={FadeInDown.delay(600 + (index * 100)).springify()}
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

          {/* Minimal Footer CTA */}
          <Animated.View entering={FadeInDown.delay(800).duration(600)}>
            <TouchableOpacity style={styles.footerCTA} onPress={handleSeeAllPress}>
              <Text style={styles.footerText}>View All Deals</Text>
              <LinearGradient
                colors={['#667eea', '#764ba2']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.arrowContainer}
              >
                <Text style={styles.footerArrow}>→</Text>
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
    marginHorizontal: 16,
    marginVertical: 12,
    position: 'relative',
  },
  container: {
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 12,
  },
  gradientContainer: {
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 16,
    position: 'relative',
    overflow: 'hidden',
  },

  // Header Badge
  headerBadge: {
    position: 'absolute',
    top: -8,
    right: 16,
    zIndex: 10,
  },
  badgeGradient: {
    borderRadius: 16,
    shadowColor: '#667eea',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  badgeContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  badgeIcon: {
    fontSize: 12,
    marginRight: 4,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1,
  },

  // Background Pattern
  backgroundPattern: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  geometricShape: {
    position: 'absolute',
    backgroundColor: 'rgba(102, 126, 234, 0.1)',
    borderRadius: 20,
  },
  shape1: {
    width: 80,
    height: 80,
    top: '10%',
    left: -20,
    transform: [{ rotate: '45deg' }],
  },
  shape2: {
    width: 60,
    height: 60,
    top: '60%',
    right: -15,
    transform: [{ rotate: '30deg' }],
  },
  shape3: {
    width: 40,
    height: 40,
    top: '80%',
    left: '20%',
    transform: [{ rotate: '60deg' }],
  },

  // Header Section
  headerSection: {
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 20,
    zIndex: 1,
  },
  discountText: {
    color: '#667eea',
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  titleText: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '800',
    textAlign: 'center',
    letterSpacing: -0.5,
    marginBottom: 8,
    paddingTop: 4,
    lineHeight: 30,
  },
  subtitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dotIndicator: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#667eea',
    marginHorizontal: 8,
  },
  subtitleText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 11,
    fontWeight: '500',
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
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },

  // Footer CTA
  footerCTA: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 16,
    marginTop: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    zIndex: 1,
  },
  footerText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    marginRight: 10,
  },
  arrowContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  footerArrow: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },
});

export default SpotlightDealsVariant1; 