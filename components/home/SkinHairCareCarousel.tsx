import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Dimensions, ScrollView, Animated } from 'react-native';
import { 
  ChevronLeft, 
  ChevronRight, 
  Award, 
  Star,
  TrendingUp,
  Crown,
  Zap,
  Shield,
  Sparkles,
  Heart,
  Package
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSelector } from 'react-redux';
import { selectIsDark } from '@/store/themeSlice';
import { Text } from '@/components/ui';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.75;
const CARD_SPACING = 16;
const CAROUSEL_WIDTH = CARD_WIDTH + CARD_SPACING;

interface SkinHairCareCard {
  id: string;
  name: string;
  icon: string;
  iconColor: string;
  gradient: string[];
  productCount: number;
  avgMargin: number;
  demandTrend: 'high' | 'medium' | 'stable';
  specialBadge?: string;
  fastMoving?: boolean;
  description: string;
  topBrands: string[];
  seasonalDemand: string;
}

const skinHairCareCards: SkinHairCareCard[] = [
  {
    id: '1',
    name: 'Ayurvedic Face Care',
    icon: 'sparkles',
    iconColor: '#F97316',
    gradient: ['#F97316', '#EA580C', '#C2410C'],
    productCount: 89,
    avgMargin: 45,
    demandTrend: 'high',
    specialBadge: 'Premium',
    fastMoving: true,
    description: 'Natural face cleansers, serums & treatments',
    topBrands: ['Himalaya', 'Patanjali', 'Kama Ayurveda'],
    seasonalDemand: 'Year Round'
  },
  {
    id: '2',
    name: 'Herbal Hair Oils',
    icon: 'droplets',
    iconColor: '#10B981',
    gradient: ['#10B981', '#059669', '#047857'],
    productCount: 124,
    avgMargin: 38,
    demandTrend: 'high',
    specialBadge: 'Best Seller',
    fastMoving: true,
    description: 'Traditional hair oils for growth & nourishment',
    topBrands: ['Dabur', 'Parachute', 'Bajaj'],
    seasonalDemand: 'Peak: Winter'
  },
  {
    id: '3',
    name: 'Natural Soaps & Cleansers',
    icon: 'shield',
    iconColor: '#8B5CF6',
    gradient: ['#8B5CF6', '#7C3AED', '#6D28D9'],
    productCount: 67,
    avgMargin: 42,
    demandTrend: 'medium',
    specialBadge: 'Organic',
    description: 'Chemical-free soaps with herbal ingredients',
    topBrands: ['Medimix', 'Chandrika', 'Mysore Sandal'],
    seasonalDemand: 'Consistent'
  },
  {
    id: '4',
    name: 'Anti-Aging Formulations',
    icon: 'star',
    iconColor: '#EF4444',
    gradient: ['#EF4444', '#DC2626', '#B91C1C'],
    productCount: 45,
    avgMargin: 52,
    demandTrend: 'high',
    specialBadge: 'High Margin',
    description: 'Premium anti-aging creams & serums',
    topBrands: ['Forest Essentials', 'Biotique', 'Lotus'],
    seasonalDemand: 'Peak: Pre-Wedding Season'
  },
  {
    id: '5',
    name: 'Hair Growth Solutions',
    icon: 'trending-up',
    iconColor: '#06B6D4',
    gradient: ['#06B6D4', '#0891B2', '#0E7490'],
    productCount: 78,
    avgMargin: 41,
    demandTrend: 'high',
    specialBadge: 'Trending',
    fastMoving: true,
    description: 'Supplements & treatments for hair growth',
    topBrands: ['Kesh King', 'Indulekha', 'Scalpe+'],
    seasonalDemand: 'Peak: Monsoon'
  },
  {
    id: '6',
    name: 'Ayurvedic Skincare Sets',
    icon: 'package',
    iconColor: '#F59E0B',
    gradient: ['#F59E0B', '#D97706', '#B45309'],
    productCount: 34,
    avgMargin: 48,
    demandTrend: 'medium',
    specialBadge: 'Gift Sets',
    description: 'Complete skincare regimen packages',
    topBrands: ['Kama Ayurveda', 'Forest Essentials', 'Just Herbs'],
    seasonalDemand: 'Peak: Festivals & Gifting'
  },
  {
    id: '7',
    name: 'Acne & Blemish Care',
    icon: 'zap',
    iconColor: '#84CC16',
    gradient: ['#84CC16', '#65A30D', '#4D7C0F'],
    productCount: 56,
    avgMargin: 44,
    demandTrend: 'high',
    specialBadge: 'Youth Focused',
    fastMoving: true,
    description: 'Targeted solutions for acne-prone skin',
    topBrands: ['Himalaya', 'Patanjali', 'Vicco'],
    seasonalDemand: 'Peak: Summer'
  },
  {
    id: '8',
    name: 'Hair Styling Products',
    icon: 'crown',
    iconColor: '#EC4899',
    gradient: ['#EC4899', '#DB2777', '#BE185D'],
    productCount: 42,
    avgMargin: 46,
    demandTrend: 'medium',
    specialBadge: 'Salon Quality',
    description: 'Natural hair gels, creams & styling aids',
    topBrands: ['Set Wet', 'Livon', 'Tresemme Naturals'],
    seasonalDemand: 'Peak: Wedding Season'
  },
  {
    id: '9',
    name: 'Body Care Essentials',
    icon: 'heart',
    iconColor: '#8B5CF6',
    gradient: ['#8B5CF6', '#7C3AED', '#6D28D9'],
    productCount: 91,
    avgMargin: 39,
    demandTrend: 'stable',
    specialBadge: 'Essential',
    description: 'Lotions, oils & body care products',
    topBrands: ['Vaseline', 'Nivea Naturals', 'Lakme'],
    seasonalDemand: 'Peak: Winter'
  }
];

interface SkinHairCareCarouselProps {
  onCardPress: (card: SkinHairCareCard) => void;
}

export default function SkinHairCareCarousel({ onCardPress }: SkinHairCareCarouselProps) {
  const isDark = useSelector(selectIsDark);
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const autoPlayInterval = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (isAutoPlay) {
      autoPlayInterval.current = setInterval(() => {
        const nextIndex = (currentIndex + 1) % skinHairCareCards.length;
        scrollToIndex(nextIndex);
      }, 4000);
    }

    return () => {
      if (autoPlayInterval.current) {
        clearInterval(autoPlayInterval.current);
      }
    };
  }, [currentIndex, isAutoPlay]);

  const scrollToIndex = (index: number) => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({
        x: index * CAROUSEL_WIDTH,
        animated: true
      });
      setCurrentIndex(index);
    }
  };

  const handlePrevious = () => {
    const prevIndex = currentIndex === 0 ? skinHairCareCards.length - 1 : currentIndex - 1;
    scrollToIndex(prevIndex);
    setIsAutoPlay(false);
  };

  const handleNext = () => {
    const nextIndex = (currentIndex + 1) % skinHairCareCards.length;
    scrollToIndex(nextIndex);
    setIsAutoPlay(false);
  };

  const onScroll = (event: any) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffsetX / CAROUSEL_WIDTH);
    if (index !== currentIndex && index >= 0 && index < skinHairCareCards.length) {
      setCurrentIndex(index);
    }
  };

  const getIcon = (iconName: string, color: string, size: number = 32) => {
    const props = { size, color };
    switch (iconName) {
      case 'sparkles': return <Sparkles {...props} />;
      case 'droplets': return <Sparkles {...props} />;
      case 'shield': return <Shield {...props} />;
      case 'star': return <Star {...props} />;
      case 'trending-up': return <TrendingUp {...props} />;
      case 'package': return <Package {...props} />;
      case 'zap': return <Zap {...props} />;
      case 'crown': return <Crown {...props} />;
      case 'heart': return <Heart {...props} />;
      default: return <Sparkles {...props} />;
    }
  };

  const renderFloatingCard = (card: SkinHairCareCard, index: number) => {
    const isActive = index === currentIndex;
    
    return (
      <TouchableOpacity
        key={card.id}
        style={[
          styles.floatingCard,
          {
            transform: [{ scale: isActive ? 1.02 : 0.98 }],
            opacity: isActive ? 1 : 0.85
          }
        ]}
        onPress={() => onCardPress(card)}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={card.gradient}
          style={styles.floatingGradient}
        >
          <View style={styles.floatingMainContent}>
            <View style={styles.floatingIconArea}>
              {getIcon(card.icon, '#FFFFFF', 36)}
            </View>
            
            <Text variant="h4" weight="bold" numberOfLines={2} style={styles.floatingTitle}>
              {card.name}
            </Text>
            
            <Text variant="body-sm" style={styles.floatingDescription} numberOfLines={2}>
              {card.description}
            </Text>
            
            <View style={styles.floatingMetrics}>
              <View style={styles.floatingMetric}>
                <Text variant="body" weight="bold" style={styles.floatingMetricValue}>
                  {card.productCount}
                </Text>
                <Text variant="caption" style={styles.floatingMetricLabel}>
                  Products
                </Text>
              </View>
              
              <View style={styles.floatingMetric}>
                <Text variant="body" weight="bold" style={styles.floatingMetricValue}>
                  {card.avgMargin}%
                </Text>
                <Text variant="caption" style={styles.floatingMetricLabel}>
                  Avg Margin
                </Text>
              </View>
              
              <View style={styles.floatingMetric}>
                <TrendingUp size={16} color="#FFFFFF" />
                <Text variant="caption" style={styles.floatingMetricLabel}>
                  {card.demandTrend.charAt(0).toUpperCase() + card.demandTrend.slice(1)}
                </Text>
              </View>
            </View>
            
            <View style={styles.floatingBrands}>
              <Text variant="caption" style={styles.floatingBrandsLabel}>
                Top Brands: {card.topBrands.slice(0, 2).join(', ')}
              </Text>
            </View>
            
            <View style={styles.floatingSeasonalInfo}>
              <Text variant="caption" style={styles.floatingSeasonalText}>
                📅 {card.seasonalDemand}
              </Text>
            </View>
          </View>
          
          {card.specialBadge && (
            <View style={styles.floatingBadge}>
              <Award size={12} color="#FFD700" />
              <Text variant="caption" weight="bold" style={styles.floatingBadgeText}>
                {card.specialBadge}
              </Text>
            </View>
          )}
          
          {card.fastMoving && (
            <View style={styles.fastMovingIndicator}>
              <Zap size={10} color="#FFFFFF" />
              <Text variant="caption" weight="bold" style={styles.fastMovingText}>
                Fast Moving
              </Text>
            </View>
          )}
        </LinearGradient>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text variant="h3" weight="bold">
            🌟 Skin & Hair Care Collection
          </Text>
          <Text variant="body-sm" color="secondary">
            Premium Ayurvedic Beauty & Personal Care
          </Text>
        </View>
        
        <View style={styles.headerControls}>
          <TouchableOpacity
            style={[
              styles.autoPlayButton,
              { 
                backgroundColor: isAutoPlay ? '#10B981' : (isDark ? '#333' : '#F0F0F0'),
              }
            ]}
            onPress={() => setIsAutoPlay(!isAutoPlay)}
          >
            <Text variant="caption" weight="semibold" style={{
              color: isAutoPlay ? '#FFFFFF' : (isDark ? '#FFFFFF' : '#666666')
            }}>
              {isAutoPlay ? 'Auto' : 'Manual'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Carousel Controls */}
      <View style={styles.carouselControls}>
        <TouchableOpacity
          style={[
            styles.carouselButton,
            { backgroundColor: isDark ? '#333' : '#F0F0F0' }
          ]}
          onPress={handlePrevious}
        >
          <ChevronLeft size={24} color={isDark ? '#FFFFFF' : '#666666'} />
        </TouchableOpacity>
        
        <View style={styles.carouselInfo}>
          <Text variant="body-sm" weight="semibold">
            {currentIndex + 1} of {skinHairCareCards.length}
          </Text>
          <Text variant="caption" color="secondary">
            {skinHairCareCards[currentIndex].name}
          </Text>
        </View>
        
        <TouchableOpacity
          style={[
            styles.carouselButton,
            { backgroundColor: isDark ? '#333' : '#F0F0F0' }
          ]}
          onPress={handleNext}
        >
          <ChevronRight size={24} color={isDark ? '#FFFFFF' : '#666666'} />
        </TouchableOpacity>
      </View>

      {/* Carousel */}
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled={false}
        showsHorizontalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={16}
        snapToInterval={CAROUSEL_WIDTH}
        decelerationRate="fast"
        contentContainerStyle={styles.scrollContent}
        onScrollBeginDrag={() => setIsAutoPlay(false)}
      >
        {skinHairCareCards.map((card, index) => renderFloatingCard(card, index))}
      </ScrollView>

      {/* Pagination Dots */}
      <View style={styles.pagination}>
        {skinHairCareCards.map((_, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.paginationDot,
              {
                backgroundColor: currentIndex === index 
                  ? '#F97316' 
                  : (isDark ? '#555' : '#CCC'),
                width: currentIndex === index ? 24 : 8,
              }
            ]}
            onPress={() => {
              scrollToIndex(index);
              setIsAutoPlay(false);
            }}
          />
        ))}
      </View>

      {/* Current Card Details */}
      <View style={[
        styles.cardDetails,
        { backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF' }
      ]}>
        <View style={styles.cardDetailsHeader}>
          <Text variant="h4" weight="semibold">
            {skinHairCareCards[currentIndex].name}
          </Text>
          <View style={[
            styles.demandBadge,
            { backgroundColor: skinHairCareCards[currentIndex].gradient[0] + '20' }
          ]}>
            <Text variant="caption" weight="bold" style={{ 
              color: skinHairCareCards[currentIndex].gradient[0] 
            }}>
              {skinHairCareCards[currentIndex].demandTrend.toUpperCase()} DEMAND
            </Text>
          </View>
        </View>
        
        <Text variant="body-sm" color="secondary" style={styles.cardDetailsDescription}>
          {skinHairCareCards[currentIndex].description}
        </Text>
        
        <View style={styles.cardDetailsMetrics}>
          <View style={styles.cardDetailsMetric}>
            <Text variant="body" weight="bold" color="accent">
              {skinHairCareCards[currentIndex].productCount}
            </Text>
            <Text variant="caption" color="secondary">Products Available</Text>
          </View>
          
          <View style={styles.cardDetailsMetric}>
            <Text variant="body" weight="bold" color="accent">
              {skinHairCareCards[currentIndex].avgMargin}%
            </Text>
            <Text variant="caption" color="secondary">Average Margin</Text>
          </View>
          
          <View style={styles.cardDetailsMetric}>
            <Text variant="body-sm" weight="semibold">
              {skinHairCareCards[currentIndex].topBrands.length}+
            </Text>
            <Text variant="caption" color="secondary">Top Brands</Text>
          </View>
        </View>
        
        <View style={styles.cardDetailsBrands}>
          <Text variant="caption" weight="semibold" color="secondary">
            Featured Brands: 
          </Text>
          <Text variant="caption" color="accent">
            {skinHairCareCards[currentIndex].topBrands.join(' • ')}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  headerLeft: {
    flex: 1,
  },
  headerControls: {
    alignItems: 'flex-end',
  },
  autoPlayButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  carouselControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  carouselButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  carouselInfo: {
    alignItems: 'center',
    flex: 1,
    paddingHorizontal: 20,
  },
  scrollContent: {
    paddingHorizontal: (width - CARD_WIDTH) / 2,
  },
  
  // Floating Card Styles (Same as showcase)
  floatingCard: {
    width: CARD_WIDTH,
    height: 320,
    marginRight: CARD_SPACING,
    borderRadius: 24,
    elevation: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
  },
  floatingGradient: {
    flex: 1,
    borderRadius: 24,
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  floatingMainContent: {
    alignItems: 'center',
    gap: 12,
    flex: 1,
    justifyContent: 'center',
  },
  floatingIconArea: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  floatingTitle: {
    color: '#FFFFFF',
    textAlign: 'center',
    fontSize: 18,
    lineHeight: 24,
  },
  floatingDescription: {
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    fontSize: 13,
    lineHeight: 18,
  },
  floatingMetrics: {
    flexDirection: 'row',
    gap: 20,
    marginTop: 8,
  },
  floatingMetric: {
    alignItems: 'center',
    gap: 4,
  },
  floatingMetricValue: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  floatingMetricLabel: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 11,
  },
  floatingBrands: {
    marginTop: 8,
    paddingHorizontal: 16,
    paddingVertical: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 12,
  },
  floatingBrandsLabel: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 11,
    textAlign: 'center',
  },
  floatingSeasonalInfo: {
    marginTop: 4,
  },
  floatingSeasonalText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 10,
    textAlign: 'center',
  },
  floatingBadge: {
    position: 'absolute',
    top: 16,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  floatingBadgeText: {
    color: '#FFD700',
    fontSize: 10,
  },
  fastMovingIndicator: {
    position: 'absolute',
    top: 16,
    left: 16,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF4500',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 8,
    gap: 2,
  },
  fastMovingText: {
    color: '#FFFFFF',
    fontSize: 9,
  },
  
  // Pagination Styles
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    marginTop: 24,
    marginBottom: 20,
  },
  paginationDot: {
    height: 8,
    borderRadius: 4,
    transition: 'all 0.3s ease',
  },
  
  // Card Details Styles
  cardDetails: {
    marginHorizontal: 20,
    padding: 20,
    borderRadius: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  cardDetailsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  demandBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  cardDetailsDescription: {
    marginBottom: 16,
    lineHeight: 20,
  },
  cardDetailsMetrics: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderTopColor: 'rgba(255, 151, 22, 0.1)',
    borderBottomColor: 'rgba(255, 151, 22, 0.1)',
  },
  cardDetailsMetric: {
    alignItems: 'center',
    gap: 4,
  },
  cardDetailsBrands: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
    alignItems: 'center',
  },
}); 