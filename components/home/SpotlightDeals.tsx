import * as React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Image, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Text } from '@/components/ui';
import { useSelector } from 'react-redux';
import { selectIsDark } from '@/store/themeSlice';
import { useRouter } from 'expo-router';
import Animated, { FadeInDown, FadeInLeft, FadeInRight } from 'react-native-reanimated';
import ProductCardPremium from './ProductCardPremium';
import { colors } from '@/utils/theme';

const { width } = Dimensions.get('window');

// Sample spotlight products data with real Ayurvedic products
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

const SpotlightDeals = () => {
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
    <View style={styles.outerContainer}>
      {/* Hexagonal Header - Outside main container */}
      <Animated.View 
        entering={FadeInDown.delay(100).duration(600).springify()}
        style={styles.hexagonContainer}
      >
        <View style={styles.hexagonShadow} />
        <View style={styles.hexagonWrapper}>
          {/* Left Triangle */}
          <View style={styles.leftTriangle} />
          
          {/* Main Banner */}
          <LinearGradient
            colors={['#A8E6A3', '#7DD87A']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.hexagonBanner}
          >
            <Text style={styles.hexagonText}>SPOTLIGHT DEALS</Text>
          </LinearGradient>
          
          {/* Right Triangle */}
          <View style={styles.rightTriangle} />
        </View>
      </Animated.View>

      <Animated.View 
        entering={FadeInDown.duration(800).springify()}
        style={styles.container}
      >
        <LinearGradient
          colors={[colors.primary[400], colors.primary[600], colors.primary[800]]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradientContainer}
        >
          {/* Decorative Images */}
          <Animated.View 
            entering={FadeInLeft.delay(200).duration(1000)}
            style={styles.leftDecorativeImage}
          >
            <Image
              source={{ uri: 'https://www.ayurcentralonline.com/wp-content/uploads/2023/10/Organic-India-Pure-Cow-Ghee-500ml.webp' }}
              style={styles.decorativeImage}
              resizeMode="contain"
            />
          </Animated.View>

          <Animated.View 
            entering={FadeInRight.delay(400).duration(1000)}
            style={styles.rightDecorativeImage}
          >
            <Image
              source={{ uri: 'https://www.ayurcentralonline.com/wp-content/uploads/2023/10/Tata-Sampann-Organic-Arhar-Dal-Unpolished-500g.webp' }}
              style={styles.decorativeImage}
              resizeMode="contain"
            />
          </Animated.View>

        {/* Transparent Hero Banner */}
        <Animated.View 
          entering={FadeInDown.delay(300).duration(800)}
          style={styles.heroBanner}
        >
          <Text style={styles.heroMainText}>Minimum 40% OFF on</Text>
          <Text style={styles.heroTitleText}>Organic Essentials</Text>
          <Text style={styles.heroSubText}>Valid only for today</Text>
          
          {/* Decorative Elements */}
          <View style={styles.decorativeContainer}>
            <Text style={styles.decorativeSpoon}>🥄</Text>
            <Text style={styles.decorativeHoney}>🍯</Text>
          </View>
        </Animated.View>

        {/* Product Cards using ProductCardPremium */}
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

        {/* Footer CTA */}
        <Animated.View entering={FadeInDown.delay(800).duration(600)}>
          <TouchableOpacity style={styles.footerCTA} onPress={handleSeeAllPress}>
            <View style={styles.footerIcons}>
              <Text style={styles.footerEmoji}>🧴</Text>
              <Text style={styles.footerEmoji}>🥫</Text>
              <Text style={styles.footerEmoji}>🍯</Text>
    </View>
            <Text style={styles.footerText}>See all products</Text>
            <Text style={styles.footerArrow}>→</Text>
          </TouchableOpacity>
        </Animated.View>
      </LinearGradient>
    </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    position: 'relative',
    marginHorizontal: 12,
    marginVertical: 10,
    paddingTop: 16, // Space for hexagonal header
  },
  container: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  gradientContainer: {
    paddingHorizontal: 14,
    paddingTop: 20, // Extra space for placard
    paddingBottom: 14,
    position: 'relative',
    overflow: 'hidden',
  },
  
  // Decorative Images
  leftDecorativeImage: {
    position: 'absolute',
    left: -20,
    top: '20%',
    opacity: 0.1,
    transform: [{ rotate: '-15deg' }],
    zIndex: 0,
  },
  rightDecorativeImage: {
    position: 'absolute',
    right: -20,
    top: '60%',
    opacity: 0.1,
    transform: [{ rotate: '15deg' }],
    zIndex: 0,
  },
  decorativeImage: {
    width: 50,
    height: 50,
  },

  // Hexagonal Header
  hexagonContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  hexagonShadow: {
    position: 'absolute',
    top: 3,
    left: '50%',
    transform: [{ translateX: -110 }], // Half of total width including triangles
    width: 220,
    height: 36,
    backgroundColor: 'rgba(0, 0, 0, 0.12)',
    borderRadius: 18,
  },
  hexagonWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  leftTriangle: {
    width: 0,
    height: 0,
    borderTopWidth: 18,
    borderBottomWidth: 18,
    borderRightWidth: 10,
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
    borderRightColor: '#A8E6A3',
    marginRight: -1,
  },
  rightTriangle: {
    width: 0,
    height: 0,
    borderTopWidth: 18,
    borderBottomWidth: 18,
    borderLeftWidth: 10,
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
    borderLeftColor: '#7DD87A',
    marginLeft: -1,
  },
  hexagonBanner: {
    paddingHorizontal: 32,
    paddingVertical: 9,
    borderRadius: 18,
    minWidth: 200,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 6,
  },
  hexagonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2D5A2D',
    letterSpacing: 1.5,
    textAlign: 'center',
    textTransform: 'uppercase',
  },

  // Hero Banner
  heroBanner: {
    alignItems: 'center',
    marginTop: 12,
    marginBottom: 16,
    paddingTop: 8,
    position: 'relative',
    zIndex: 1,
  },
  heroMainText: {
    color: 'rgba(255, 255, 255, 0.95)',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  heroTitleText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '800',
    textAlign: 'center',
    marginVertical: 4,
    paddingTop: 4,
    lineHeight: 26,
    textShadowColor: 'rgba(0, 0, 0, 0.4)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  heroSubText: {
    color: 'rgba(255, 255, 255, 0.85)',
    fontSize: 11,
    fontWeight: '500',
    textAlign: 'center',
    marginTop: 2,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  decorativeContainer: {
    position: 'absolute',
    right: 16,
    top: 6,
    flexDirection: 'row',
    alignItems: 'center',
  },
  decorativeSpoon: {
    fontSize: 16,
    marginRight: 3,
    transform: [{ rotate: '25deg' }],
  },
  decorativeHoney: {
    fontSize: 14,
  },

  // Products Section
  productsScroll: {
    marginHorizontal: -14,
    zIndex: 1,
  },
  productsScrollContent: {
    paddingHorizontal: 14,
    paddingRight: 28,
  },
  productCardWrapper: {
    marginRight: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
  },

  // Footer CTA
  footerCTA: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 14,
    marginTop: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    zIndex: 1,
  },
  footerIcons: {
    flexDirection: 'row',
    marginRight: 8,
  },
  footerEmoji: {
    fontSize: 14,
    marginRight: 3,
  },
  footerText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
    marginRight: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  footerArrow: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
});

export default SpotlightDeals;  