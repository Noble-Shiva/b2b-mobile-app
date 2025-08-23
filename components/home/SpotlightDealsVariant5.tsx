import * as React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
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
  withRepeat,
  withTiming,
  useSharedValue,
  useAnimatedStyle,
  interpolate,
  withSequence
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

const SpotlightDealsVariant5 = () => {
  const isDark = useSelector(selectIsDark);
  const router = useRouter();
  
  // Animated values for neon glow effects
  const glowAnim = useSharedValue(0);
  const pulseAnim = useSharedValue(0);
  const scanLineAnim = useSharedValue(0);
  
  React.useEffect(() => {
    // Continuous glow animation
    glowAnim.value = withRepeat(
      withTiming(1, { duration: 2000 }),
      -1,
      true
    );
    
    // Pulse animation for accent elements
    pulseAnim.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 1000 }),
        withTiming(0.7, { duration: 1000 })
      ),
      -1,
      false
    );
    
    // Scanning line effect
    scanLineAnim.value = withRepeat(
      withTiming(1, { duration: 4000 }),
      -1,
      false
    );
  }, []);

  const glowStyle = useAnimatedStyle(() => {
    return {
      shadowOpacity: interpolate(glowAnim.value, [0, 1], [0.3, 0.8]),
    };
  });

  const pulseStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(pulseAnim.value, [0, 1], [0.7, 1]),
      transform: [
        { scale: interpolate(pulseAnim.value, [0, 1], [0.95, 1.05]) }
      ]
    };
  });

  const scanLineStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: interpolate(scanLineAnim.value, [0, 1], [-width, width]) }
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
      entering={FadeIn.duration(1000).springify()}
      style={styles.outerContainer}
    >
      {/* Cyberpunk Background */}
      <LinearGradient
        colors={['#0a0a0f', '#1a1a2e', '#16213e', '#0a0a0f']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.cyberpunkBackground}
      >
        {/* Grid Pattern Overlay */}
        <View style={styles.gridPattern}>
          {[...Array(20)].map((_, index) => (
            <View
              key={index}
              style={[
                styles.gridLine,
                index % 2 === 0 ? styles.verticalGrid : styles.horizontalGrid,
                { opacity: 0.1 + (index % 3) * 0.05 }
              ]}
            />
          ))}
        </View>

        {/* Scanning Line Effect */}
        <Animated.View style={[styles.scanLine, scanLineStyle]} />

        {/* Neon Header Terminal */}
        <Animated.View 
          entering={FadeInDown.delay(200).duration(800).springify()}
          style={[styles.terminalHeader, glowStyle]}
        >
          <LinearGradient
            colors={['rgba(0, 255, 255, 0.2)', 'rgba(0, 255, 255, 0.1)', 'rgba(0, 255, 255, 0.2)']}
            style={styles.terminalGradient}
          >
            <View style={styles.terminalTop}>
              <View style={styles.terminalButtons}>
                <View style={[styles.terminalButton, styles.redButton]} />
                <View style={[styles.terminalButton, styles.yellowButton]} />
                <View style={[styles.terminalButton, styles.greenButton]} />
              </View>
              <Text style={styles.terminalTitle}>CYBER_DEALS.EXE</Text>
              <View style={styles.terminalClose}>
                <Text style={styles.closeText}>×</Text>
              </View>
            </View>
            
            <View style={styles.terminalContent}>
              <Text style={styles.promptText}>user@ayurcentral:~$ </Text>
              <Text style={styles.commandText}>execute spotlight_deals --premium</Text>
            </View>
            
            <View style={styles.statusBar}>
              <Animated.View style={[styles.statusIndicator, pulseStyle]}>
                <Text style={styles.statusText}>ONLINE</Text>
              </Animated.View>
              <Text style={styles.discountChip}>⚡ 50% BOOST ⚡</Text>
            </View>
          </LinearGradient>
        </Animated.View>

        {/* Main Neon Container */}
        <Animated.View 
          entering={FadeInUp.delay(400).duration(1000).springify()}
          style={styles.neonContainer}
        >
          <LinearGradient
            colors={['rgba(0, 0, 0, 0.8)', 'rgba(26, 26, 46, 0.9)', 'rgba(0, 0, 0, 0.8)']}
            style={styles.neonGradient}
          >
            {/* Neon Border Effect */}
            <View style={styles.neonBorder}>
              <LinearGradient
                colors={['#00ffff', '#ff00ff', '#ffff00', '#00ffff']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.neonBorderGradient}
              />
            </View>

            {/* HUD-style Header */}
            <Animated.View 
              entering={FadeInDown.delay(600).duration(800)}
              style={styles.hudHeader}
            >
              <View style={styles.hudLeft}>
                <View style={styles.hudBracket}>
                  <Text style={styles.bracketText}>{'['}</Text>
                </View>
                <View style={styles.hudInfo}>
                  <Text style={styles.hudTitle}>ORGANIC_MATRIX</Text>
                  <Text style={styles.hudSubtitle}>PREMIUM_COLLECTION.v2.1</Text>
                </View>
                <View style={styles.hudBracket}>
                  <Text style={styles.bracketText}>{']'}</Text>
                </View>
              </View>
              
              <View style={styles.hudRight}>
                <View style={styles.hudMetrics}>
                  <Text style={styles.metricLabel}>ITEMS:</Text>
                  <Text style={styles.metricValue}>50+</Text>
                </View>
                <View style={styles.hudMetrics}>
                  <Text style={styles.metricLabel}>RATING:</Text>
                  <Text style={styles.metricValue}>4.8★</Text>
                </View>
              </View>
            </Animated.View>

            {/* Holographic Product Display */}
            <Animated.View entering={FadeInUp.delay(800).duration(800)}>
              <Text style={styles.sectionLabel}>// AVAILABLE_PRODUCTS</Text>
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.holoProductsScrollContent}
                style={styles.holoProductsScroll}
              >
                {spotlightProducts.map((product, index) => (
                  <Animated.View
                    key={product.id}
                    entering={SlideInLeft.delay(1000 + (index * 150)).springify()}
                    style={styles.holoProductCard}
                  >
                    <LinearGradient
                      colors={[
                        'rgba(0, 255, 255, 0.1)', 
                        'rgba(255, 0, 255, 0.05)', 
                        'rgba(0, 255, 255, 0.1)'
                      ]}
                      style={styles.holoCardGradient}
                    >
                      <View style={styles.holoCardBorder}>
                        <ProductCardPremium
                          product={product}
                          onPress={() => handleProductPress(product.id)}
                          onAddToCart={() => handleAddToCart(product.id)}
                        />
                      </View>
                      
                                             {/* Holographic Overlay */}
                       <View style={styles.holoOverlay}>
                         <Text style={styles.holoText}>PRODUCT_{String(index + 1).padStart(3, '0')}</Text>
                       </View>
                    </LinearGradient>
                  </Animated.View>
                ))}
              </ScrollView>
            </Animated.View>

            {/* Cyber CTA */}
            <Animated.View entering={FadeInUp.delay(1400).duration(600)}>
              <TouchableOpacity style={styles.cyberCTA} onPress={handleSeeAllPress}>
                <LinearGradient
                  colors={['rgba(0, 255, 255, 0.8)', 'rgba(255, 0, 255, 0.8)', 'rgba(0, 255, 255, 0.8)']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.cyberGradient}
                >
                  <View style={styles.cyberContent}>
                    <View style={styles.cyberIcon}>
                      <Text style={styles.cyberIconText}>{'⟩⟩'}</Text>
                    </View>
                    <View style={styles.cyberTextContainer}>
                      <Text style={styles.cyberTitle}>EXECUTE_FULL_SCAN</Text>
                      <Text style={styles.cyberSubtitle}>./load_all_products --matrix</Text>
                    </View>
                    <View style={styles.cyberBadge}>
                      <Text style={styles.cyberBadgeText}>ENTER</Text>
                    </View>
                  </View>
                </LinearGradient>
              </TouchableOpacity>
            </Animated.View>
          </LinearGradient>
        </Animated.View>
      </LinearGradient>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    marginHorizontal: 8,
    marginVertical: 16,
    position: 'relative',
  },
  cyberpunkBackground: {
    borderRadius: 16,
    padding: 16,
    position: 'relative',
    overflow: 'hidden',
    minHeight: 400,
  },

  // Grid Pattern
  gridPattern: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  gridLine: {
    position: 'absolute',
    backgroundColor: '#00ffff',
  },
  verticalGrid: {
    width: 1,
    height: '100%',
    left: '20%',
  },
  horizontalGrid: {
    height: 1,
    width: '100%',
    top: '25%',
  },
  scanLine: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 2,
    backgroundColor: '#00ffff',
    opacity: 0.6,
    shadowColor: '#00ffff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 10,
  },

  // Terminal Header
  terminalHeader: {
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(0, 255, 255, 0.3)',
    shadowColor: '#00ffff',
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 20,
    elevation: 10,
  },
  terminalGradient: {
    borderRadius: 12,
  },
  terminalTop: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 255, 255, 0.2)',
  },
  terminalButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  terminalButton: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 6,
  },
  redButton: {
    backgroundColor: '#ff4757',
  },
  yellowButton: {
    backgroundColor: '#ffa502',
  },
  greenButton: {
    backgroundColor: '#2ed573',
  },
  terminalTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '600',
    color: '#00ffff',
    fontFamily: 'monospace',
  },
  terminalClose: {
    width: 20,
    alignItems: 'center',
  },
  closeText: {
    color: '#ff4757',
    fontSize: 14,
    fontWeight: 'bold',
  },
  terminalContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  promptText: {
    color: '#2ed573',
    fontSize: 11,
    fontFamily: 'monospace',
    fontWeight: '600',
  },
  commandText: {
    color: '#00ffff',
    fontSize: 11,
    fontFamily: 'monospace',
    flex: 1,
  },
  statusBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 6,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  statusIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusText: {
    color: '#2ed573',
    fontSize: 10,
    fontWeight: '700',
    fontFamily: 'monospace',
  },
  discountChip: {
    color: '#ffff00',
    fontSize: 10,
    fontWeight: '700',
    paddingHorizontal: 8,
    paddingVertical: 2,
    backgroundColor: 'rgba(255, 255, 0, 0.1)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 0, 0.3)',
  },

  // Neon Container
  neonContainer: {
    borderRadius: 16,
    overflow: 'hidden',
    position: 'relative',
  },
  neonGradient: {
    borderRadius: 16,
    padding: 20,
    position: 'relative',
  },
  neonBorder: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    padding: 2,
    borderRadius: 16,
  },
  neonBorderGradient: {
    flex: 1,
    borderRadius: 14,
    opacity: 0.6,
  },

  // HUD Header
  hudHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 255, 255, 0.2)',
  },
  hudLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  hudBracket: {
    marginHorizontal: 4,
  },
  bracketText: {
    color: '#00ffff',
    fontSize: 18,
    fontWeight: '300',
    fontFamily: 'monospace',
  },
  hudInfo: {
    marginHorizontal: 8,
  },
  hudTitle: {
    color: '#00ffff',
    fontSize: 16,
    fontWeight: '700',
    fontFamily: 'monospace',
    letterSpacing: 1,
    lineHeight: 20,
    paddingTop: 4,
  },
  hudSubtitle: {
    color: 'rgba(0, 255, 255, 0.7)',
    fontSize: 10,
    fontFamily: 'monospace',
    letterSpacing: 0.5,
  },
  hudRight: {
    alignItems: 'flex-end',
  },
  hudMetrics: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  metricLabel: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 9,
    fontFamily: 'monospace',
    marginRight: 4,
  },
  metricValue: {
    color: '#ffff00',
    fontSize: 10,
    fontWeight: '700',
    fontFamily: 'monospace',
  },

  // Products Section
  sectionLabel: {
    color: 'rgba(0, 255, 255, 0.8)',
    fontSize: 12,
    fontFamily: 'monospace',
    marginBottom: 16,
    fontStyle: 'italic',
  },
  holoProductsScroll: {
    marginHorizontal: -20,
  },
  holoProductsScrollContent: {
    paddingHorizontal: 20,
    paddingRight: 40,
  },
  holoProductCard: {
    marginRight: 16,
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
  },
  holoCardGradient: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(0, 255, 255, 0.3)',
    position: 'relative',
  },
  holoCardBorder: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  holoOverlay: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: 'rgba(0, 255, 255, 0.5)',
  },
  holoText: {
    color: '#00ffff',
    fontSize: 8,
    fontFamily: 'monospace',
    fontWeight: '600',
  },

  // Cyber CTA
  cyberCTA: {
    marginTop: 20,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#00ffff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 15,
    elevation: 10,
  },
  cyberGradient: {
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  cyberContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  cyberIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  cyberIconText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: '900',
    fontFamily: 'monospace',
  },
  cyberTextContainer: {
    flex: 1,
  },
  cyberTitle: {
    color: '#000000',
    fontSize: 16,
    fontWeight: '800',
    fontFamily: 'monospace',
    letterSpacing: 1,
    marginBottom: 2,
  },
  cyberSubtitle: {
    color: 'rgba(0, 0, 0, 0.8)',
    fontSize: 11,
    fontFamily: 'monospace',
    fontStyle: 'italic',
  },
  cyberBadge: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  cyberBadgeText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '700',
    fontFamily: 'monospace',
  },
});

export default SpotlightDealsVariant5; 