import * as React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Image, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Text } from '@/components/ui';
import { useSelector } from 'react-redux';
import { selectIsDark } from '@/store/themeSlice';
import { useRouter } from 'expo-router';
import Animated, { FadeInDown, FadeInLeft, FadeInRight, FadeIn, SlideInUp } from 'react-native-reanimated';
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

const SpotlightDealsVariant3 = () => {
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
      entering={SlideInUp.duration(1000).springify()}
      style={styles.outerContainer}
    >
      {/* Elegant Crown Header */}
      <Animated.View 
        entering={FadeInDown.delay(200).duration(800).springify()}
        style={styles.crownContainer}
      >
        <LinearGradient
          colors={['#FFD700', '#FFA500', '#FF8C00']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.crownBadge}
        >
          <Text style={styles.crownIcon}>👑</Text>
          <Text style={styles.crownText}>PREMIUM</Text>
          <Text style={styles.crownIcon}>👑</Text>
        </LinearGradient>
        
                 {/* Decorative side elements */}
         <View style={styles.crownDecoration}>
           <Text style={styles.sparkle1}>✨</Text>
           <Text style={styles.sparkle2}>✨</Text>
         </View>
      </Animated.View>

      <Animated.View 
        entering={FadeIn.duration(1000).springify()}
        style={styles.container}
      >
        <LinearGradient
          colors={['#1a1a1a', '#2c2c2c', '#1a1a1a']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradientContainer}
        >
          {/* Luxury pattern overlay */}
          <View style={styles.luxuryPattern}>
            <View style={styles.patternOverlay} />
            {[...Array(12)].map((_, index) => (
              <Animated.View
                key={index}
                entering={FadeInLeft.delay(400 + (index * 50)).duration(800)}
                style={[
                  styles.goldDot,
                  {
                    top: `${(index % 4) * 25 + 10}%`,
                    left: `${Math.floor(index / 4) * 30 + 10}%`,
                  }
                ]}
              />
            ))}
          </View>

          {/* Elegant Border Frame */}
          <View style={styles.elegantFrame}>
            <LinearGradient
              colors={['#FFD700', 'transparent', '#FFD700']}
              style={styles.topBorder}
            />
            <LinearGradient
              colors={['#FFD700', 'transparent', '#FFD700']}
              style={styles.bottomBorder}
            />
          </View>

          {/* Header Section */}
          <Animated.View 
            entering={FadeInDown.delay(500).duration(800)}
            style={styles.headerSection}
          >
            <View style={styles.luxuryBadge}>
              <LinearGradient
                colors={['#FFD700', '#FFA500']}
                style={styles.badgeGradient}
              >
                <Text style={styles.exclusiveText}>EXCLUSIVE</Text>
              </LinearGradient>
            </View>
            
            <Text style={styles.mainTitle}>Luxury Collection</Text>
            <Text style={styles.subtitle}>Handpicked Premium Organics</Text>
            
            <View style={styles.discountBadge}>
              <Text style={styles.discountPrefix}>SAVE UP TO</Text>
              <Text style={styles.discountAmount}>50%</Text>
            </View>
          </Animated.View>

          {/* Product Cards */}
          <Animated.View entering={FadeInDown.delay(700).duration(800)}>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.productsScrollContent}
              style={styles.productsScroll}
            >
              {spotlightProducts.map((product, index) => (
                <Animated.View
                  key={product.id}
                  entering={FadeInDown.delay(800 + (index * 150)).springify()}
                  style={styles.productCardWrapper}
                >
                  <View style={styles.goldAccentFrame}>
                    <ProductCardPremium
                      product={product}
                      onPress={() => handleProductPress(product.id)}
                      onAddToCart={() => handleAddToCart(product.id)}
                    />
                  </View>
                </Animated.View>
              ))}
            </ScrollView>
          </Animated.View>

          {/* Elegant Footer */}
          <Animated.View entering={FadeInDown.delay(1000).duration(600)}>
            <TouchableOpacity style={styles.elegantFooter} onPress={handleSeeAllPress}>
              <LinearGradient
                colors={['#2c2c2c', '#1a1a1a', '#2c2c2c']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.footerGradient}
              >
                <View style={styles.footerContent}>
                  <Text style={styles.footerLabel}>Discover More Luxury</Text>
                  <View style={styles.footerArrowContainer}>
                    <LinearGradient
                      colors={['#FFD700', '#FFA500']}
                      style={styles.arrowGradient}
                    >
                      <Text style={styles.footerArrow}>→</Text>
                    </LinearGradient>
                  </View>
                </View>
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
    marginHorizontal: 14,
    marginVertical: 10,
    position: 'relative',
  },
  container: {
    borderRadius: 28,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.5,
    shadowRadius: 24,
    elevation: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.3)',
  },
  gradientContainer: {
    paddingHorizontal: 18,
    paddingTop: 28,
    paddingBottom: 18,
    position: 'relative',
    overflow: 'hidden',
  },

  // Crown Header
  crownContainer: {
    position: 'absolute',
    top: -14,
    left: 0,
    right: 0,
    zIndex: 10,
    alignItems: 'center',
  },
  crownBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  crownIcon: {
    fontSize: 14,
    marginHorizontal: 4,
  },
  crownText: {
    color: '#1a1a1a',
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 2,
  },
  crownDecoration: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 40,
  },
  sparkle1: {
    position: 'absolute',
    fontSize: 12,
    color: '#FFD700',
    top: 2,
    left: '20%',
  },
  sparkle2: {
    position: 'absolute',
    fontSize: 12,
    color: '#FFD700',
    top: 4,
    right: '20%',
  },

  // Luxury Pattern
  luxuryPattern: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  patternOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 215, 0, 0.02)',
  },
  goldDot: {
    position: 'absolute',
    width: 2,
    height: 2,
    borderRadius: 1,
    backgroundColor: 'rgba(255, 215, 0, 0.3)',
  },

  // Elegant Frame
  elegantFrame: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  topBorder: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 1,
  },
  bottomBorder: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 1,
  },

  // Header Section
  headerSection: {
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 24,
    paddingTop: 8,
    zIndex: 1,
  },
  luxuryBadge: {
    marginBottom: 12,
  },
  badgeGradient: {
    paddingHorizontal: 16,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.5)',
  },
  exclusiveText: {
    color: '#1a1a1a',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.5,
  },
  mainTitle: {
    color: '#FFD700',
    fontSize: 26,
    fontWeight: '300',
    textAlign: 'center',
    letterSpacing: 2,
    marginBottom: 4,
    fontFamily: 'serif',
    paddingTop: 6,
    lineHeight: 32,
  },
  subtitle: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
    fontWeight: '400',
    textAlign: 'center',
    letterSpacing: 0.5,
    marginBottom: 16,
    fontStyle: 'italic',
  },
  discountBadge: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.3)',
  },
  discountPrefix: {
    color: 'rgba(255, 215, 0, 0.8)',
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 1,
  },
  discountAmount: {
    color: '#FFD700',
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 1,
  },

  // Products Section
  productsScroll: {
    marginHorizontal: -18,
    zIndex: 1,
  },
  productsScrollContent: {
    paddingHorizontal: 18,
    paddingRight: 36,
  },
  productCardWrapper: {
    marginRight: 14,
  },
  goldAccentFrame: {
    padding: 2,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },

  // Elegant Footer
  elegantFooter: {
    marginTop: 20,
    zIndex: 1,
  },
  footerGradient: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.3)',
    overflow: 'hidden',
  },
  footerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  footerLabel: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 14,
    fontWeight: '500',
    letterSpacing: 0.5,
  },
  footerArrowContainer: {
    marginLeft: 12,
  },
  arrowGradient: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 4,
  },
  footerArrow: {
    color: '#1a1a1a',
    fontSize: 16,
    fontWeight: '900',
  },
});

export default SpotlightDealsVariant3; 