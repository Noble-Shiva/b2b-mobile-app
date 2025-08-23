import * as React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Image, Dimensions, ImageBackground } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Text } from '@/components/ui';
import { useSelector } from 'react-redux';
import { selectIsDark } from '@/store/themeSlice';
import { useRouter } from 'expo-router';
import Animated, { 
  FadeInDown, 
  FadeInUp, 
  FadeIn, 
  SlideInLeft,
  SlideInRight,
  SlideInUp,
  withRepeat,
  withTiming,
  useSharedValue,
  useAnimatedStyle,
  interpolate
} from 'react-native-reanimated';
import ProductCardPremium from './ProductCardPremium';

const { width, height } = Dimensions.get('window');

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

const SpotlightDealsVariant4 = () => {
  const isDark = useSelector(selectIsDark);
  const router = useRouter();
  
  // Animated values for floating effect
  const floatingAnim = useSharedValue(0);
  
  React.useEffect(() => {
    floatingAnim.value = withRepeat(
      withTiming(1, { duration: 3000 }),
      -1,
      true
    );
  }, []);

  const floatingStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateY: interpolate(floatingAnim.value, [0, 1], [0, -8]) }
      ]
    };
  });

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
      entering={FadeIn.duration(1200).springify()}
      style={styles.outerContainer}
    >
      {/* Background Gradient */}
      <LinearGradient
        colors={['rgba(139, 69, 19, 0.1)', 'rgba(255, 255, 255, 0.05)', 'rgba(139, 69, 19, 0.1)']}
        style={styles.backgroundGradient}
      />

      {/* Floating Glass Header */}
      <Animated.View 
        entering={SlideInUp.delay(200).duration(1000).springify()}
        style={[styles.glassHeader, floatingStyle]}
      >
        <BlurView intensity={20} style={styles.blurContainer}>
          <LinearGradient
            colors={['rgba(255, 255, 255, 0.25)', 'rgba(255, 255, 255, 0.1)']}
            style={styles.glassGradient}
          >
            <View style={styles.headerContent}>
              <View style={styles.iconContainer}>
                <Text style={styles.headerIcon}>💎</Text>
              </View>
              <View style={styles.headerTextContainer}>
                <Text style={styles.headerTitle}>PREMIUM DEALS</Text>
                <Text style={styles.headerSubtitle}>Curated Collection</Text>
              </View>
              <View style={styles.discountBubble}>
                <Text style={styles.discountText}>50%</Text>
                <Text style={styles.offText}>OFF</Text>
              </View>
            </View>
          </LinearGradient>
        </BlurView>
      </Animated.View>

      {/* Main Content Card */}
      <Animated.View 
        entering={FadeInUp.delay(400).duration(1000).springify()}
        style={styles.mainCard}
      >
        <BlurView intensity={15} style={styles.mainBlurContainer}>
          <LinearGradient
            colors={['rgba(255, 255, 255, 0.15)', 'rgba(255, 255, 255, 0.05)']}
            style={styles.mainGradient}
          >
            {/* Floating Decorative Elements */}
            <View style={styles.decorativeElements}>
              {[...Array(6)].map((_, index) => (
                <Animated.View
                  key={index}
                  entering={FadeIn.delay(600 + (index * 100)).duration(800)}
                  style={[
                    styles.floatingDot,
                    {
                      top: `${15 + (index % 3) * 25}%`,
                      left: `${10 + (index % 2) * 80}%`,
                      opacity: 0.6 - (index * 0.1),
                    }
                  ]}
                />
              ))}
            </View>

            {/* Hero Section */}
            <Animated.View 
              entering={FadeInDown.delay(600).duration(800)}
              style={styles.heroSection}
            >
              <View style={styles.heroTextContainer}>
                <Text style={styles.heroTitle}>Organic Essentials</Text>
                <Text style={styles.heroDescription}>
                  Handpicked premium products for your healthy lifestyle
                </Text>
              </View>
              
              <View style={styles.statsContainer}>
                <View style={styles.statItem}>
                  <Text style={styles.statNumber}>50+</Text>
                  <Text style={styles.statLabel}>Products</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                  <Text style={styles.statNumber}>4.8★</Text>
                  <Text style={styles.statLabel}>Rating</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                  <Text style={styles.statNumber}>24h</Text>
                  <Text style={styles.statLabel}>Delivery</Text>
                </View>
              </View>
            </Animated.View>

            {/* Modern Product Grid */}
            <Animated.View entering={FadeInUp.delay(800).duration(800)}>
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.productsScrollContent}
                style={styles.productsScroll}
              >
                {spotlightProducts.map((product, index) => (
                  <Animated.View
                    key={product.id}
                    entering={SlideInRight.delay(900 + (index * 150)).springify()}
                    style={styles.modernProductCard}
                  >
                    <BlurView intensity={10} style={styles.productBlurContainer}>
                      <LinearGradient
                        colors={['rgba(255, 255, 255, 0.2)', 'rgba(255, 255, 255, 0.1)']}
                        style={styles.productCardGradient}
                      >
                        <ProductCardPremium
                          product={product}
                          onPress={() => handleProductPress(product.id)}
                          onAddToCart={() => handleAddToCart(product.id)}
                        />
                      </LinearGradient>
                    </BlurView>
                  </Animated.View>
                ))}
              </ScrollView>
            </Animated.View>

            {/* Modern CTA */}
            <Animated.View entering={FadeInUp.delay(1200).duration(600)}>
              <TouchableOpacity style={styles.modernCTA} onPress={handleSeeAllPress}>
                <BlurView intensity={20} style={styles.ctaBlurContainer}>
                  <LinearGradient
                    colors={['rgba(139, 69, 19, 0.8)', 'rgba(160, 82, 45, 0.8)']}
                    style={styles.ctaGradient}
                  >
                    <View style={styles.ctaContent}>
                      <View style={styles.ctaTextContainer}>
                        <Text style={styles.ctaTitle}>Explore More</Text>
                        <Text style={styles.ctaSubtitle}>Discover our full collection</Text>
                      </View>
                      <View style={styles.ctaArrowContainer}>
                        <Text style={styles.ctaArrow}>→</Text>
                      </View>
                    </View>
                  </LinearGradient>
                </BlurView>
              </TouchableOpacity>
            </Animated.View>
          </LinearGradient>
        </BlurView>
      </Animated.View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    marginHorizontal: 16,
    marginVertical: 20,
    position: 'relative',
  },
  backgroundGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 24,
  },

  // Glass Header
  glassHeader: {
    marginBottom: 16,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  blurContainer: {
    borderRadius: 20,
  },
  glassGradient: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  headerIcon: {
    fontSize: 24,
  },
  headerTextContainer: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2D2D2D',
    marginBottom: 2,
    letterSpacing: 0.5,
  },
  headerSubtitle: {
    fontSize: 12,
    color: 'rgba(45, 45, 45, 0.7)',
    fontWeight: '500',
  },
  discountBubble: {
    backgroundColor: 'rgba(139, 69, 19, 0.9)',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
    alignItems: 'center',
    shadowColor: '#8B4513',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  discountText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
    lineHeight: 18,
  },
  offText: {
    color: '#FFFFFF',
    fontSize: 8,
    fontWeight: '600',
    letterSpacing: 1,
  },

  // Main Card
  mainCard: {
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 12,
  },
  mainBlurContainer: {
    borderRadius: 24,
  },
  mainGradient: {
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    paddingHorizontal: 20,
    paddingVertical: 24,
    position: 'relative',
  },

  // Decorative Elements
  decorativeElements: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  floatingDot: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(139, 69, 19, 0.4)',
  },

  // Hero Section
  heroSection: {
    marginBottom: 24,
  },
  heroTextContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: '300',
    color: '#2D2D2D',
    textAlign: 'center',
    marginBottom: 8,
    letterSpacing: 1,
    lineHeight: 34,
    paddingTop: 6,
  },
  heroDescription: {
    fontSize: 14,
    color: 'rgba(45, 45, 45, 0.8)',
    textAlign: 'center',
    lineHeight: 20,
    maxWidth: 280,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2D2D2D',
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 10,
    color: 'rgba(45, 45, 45, 0.6)',
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  statDivider: {
    width: 1,
    height: 32,
    backgroundColor: 'rgba(45, 45, 45, 0.2)',
    marginHorizontal: 16,
  },

  // Products Section
  productsScroll: {
    marginHorizontal: -20,
  },
  productsScrollContent: {
    paddingHorizontal: 20,
    paddingRight: 40,
  },
  modernProductCard: {
    marginRight: 16,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
  },
  productBlurContainer: {
    borderRadius: 20,
  },
  productCardGradient: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },

  // Modern CTA
  modernCTA: {
    marginTop: 24,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#8B4513',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  ctaBlurContainer: {
    borderRadius: 20,
  },
  ctaGradient: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  ctaContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  ctaTextContainer: {
    flex: 1,
  },
  ctaTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
    letterSpacing: 0.5,
  },
  ctaSubtitle: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '400',
  },
  ctaArrowContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  ctaArrow: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: '600',
  },
});

export default SpotlightDealsVariant4; 