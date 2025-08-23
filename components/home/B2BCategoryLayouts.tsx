import React, { useState, useRef } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Dimensions, FlatList, Animated } from 'react-native';
import { 
  ChevronLeft, 
  ChevronRight, 
  Grid, 
  MoreHorizontal,
  Star,
  TrendingUp,
  Layers
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSelector } from 'react-redux';
import { selectIsDark } from '@/store/themeSlice';
import { Text } from '@/components/ui';
import B2BCategoryShowcase from './B2BCategoryShowcase';

const { width, height } = Dimensions.get('window');

interface LayoutProps {
  onCategoryPress: (category: any) => void;
  categories: any[];
}

// Layout 1: Classic Horizontal Scroll (Current)
export const HorizontalScrollLayout = ({ onCategoryPress, categories }: LayoutProps) => {
  const isDark = useSelector(selectIsDark);
  
  return (
    <View style={styles.layoutContainer}>
      <View style={styles.layoutHeader}>
        <Text variant="h4" weight="semibold">🌟 Premium Categories</Text>
        <View style={styles.layoutIndicator}>
          <MoreHorizontal size={20} color={isDark ? '#FFFFFF' : '#666666'} />
        </View>
      </View>
      <B2BCategoryShowcase onCategoryPress={onCategoryPress} />
    </View>
  );
};

// Layout 2: Featured Card + Grid
export const FeaturedGridLayout = ({ onCategoryPress, categories }: LayoutProps) => {
  const isDark = useSelector(selectIsDark);
  const [featuredCategory] = useState(categories[0]);
  const gridCategories = categories.slice(1, 5);
  
  return (
    <View style={styles.layoutContainer}>
      <View style={styles.layoutHeader}>
        <Text variant="h4" weight="semibold">🎯 Featured Categories</Text>
        <TouchableOpacity style={styles.viewAllButton}>
          <Text variant="body-sm" weight="medium" color="accent">View All</Text>
        </TouchableOpacity>
      </View>
      
      {/* Featured Large Card */}
      <TouchableOpacity
        style={[
          styles.featuredCard,
          { backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF' }
        ]}
        onPress={() => onCategoryPress(featuredCategory)}
      >
        <LinearGradient
          colors={featuredCategory?.gradient || ['#10B981', '#059669']}
          style={styles.featuredGradient}
        >
          <View style={styles.featuredContent}>
            <View style={styles.featuredBadge}>
              <Star size={12} color="#FFD700" />
              <Text variant="caption" weight="bold" style={styles.featuredBadgeText}>
                FEATURED
              </Text>
            </View>
            
            <Text variant="h3" weight="bold" style={styles.featuredTitle}>
              {featuredCategory?.name}
            </Text>
            
            <View style={styles.featuredMetrics}>
              <View style={styles.featuredMetric}>
                <Text variant="body" weight="bold" style={styles.featuredMetricValue}>
                  {featuredCategory?.productCount}+
                </Text>
                <Text variant="caption" style={styles.featuredMetricLabel}>
                  Products
                </Text>
              </View>
              
              <View style={styles.featuredMetric}>
                <Text variant="body" weight="bold" style={styles.featuredMetricValue}>
                  {featuredCategory?.avgMargin}%
                </Text>
                <Text variant="caption" style={styles.featuredMetricLabel}>
                  Avg Margin
                </Text>
              </View>
              
              <View style={styles.featuredMetric}>
                <TrendingUp size={16} color="#FFFFFF" />
                <Text variant="caption" style={styles.featuredMetricLabel}>
                  High Demand
                </Text>
              </View>
            </View>
          </View>
        </LinearGradient>
      </TouchableOpacity>
      
      {/* Grid of Smaller Cards */}
      <View style={styles.gridContainer}>
        {gridCategories.map((category, index) => (
          <TouchableOpacity
            key={category.id}
            style={[
              styles.gridCard,
              { backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF' }
            ]}
            onPress={() => onCategoryPress(category)}
          >
            <LinearGradient
              colors={[category.gradient[0] + '40', category.gradient[0] + '20']}
              style={styles.gridGradient}
            >
              <View style={[styles.gridIcon, { backgroundColor: category.gradient[0] + '30' }]}>
                <Text style={{ fontSize: 20 }}>
                  {['🛡️', '⚡', '💧', '👥'][index]}
                </Text>
              </View>
              
              <Text variant="body-sm" weight="semibold" numberOfLines={2} style={styles.gridTitle}>
                {category.name}
              </Text>
              
              <Text variant="caption" color="secondary">
                {category.productCount} products
              </Text>
              
              <Text variant="caption" weight="bold" style={{ color: category.gradient[0] }}>
                {category.avgMargin}% margin
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

// Layout 3: Staggered Masonry Grid
export const MasonryLayout = ({ onCategoryPress, categories }: LayoutProps) => {
  const isDark = useSelector(selectIsDark);
  const leftColumn = categories.filter((_, index) => index % 2 === 0);
  const rightColumn = categories.filter((_, index) => index % 2 === 1);
  
  const renderMasonryCard = (category: any, index: number) => {
    const heights = [140, 160, 120, 180, 150];
    const cardHeight = heights[index % heights.length];
    
    return (
      <TouchableOpacity
        key={category.id}
        style={[
          styles.masonryCard,
          { 
            height: cardHeight,
            backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF' 
          }
        ]}
        onPress={() => onCategoryPress(category)}
      >
        <LinearGradient
          colors={category.gradient}
          style={styles.masonryGradient}
        >
          <View style={styles.masonryContent}>
            <Text style={{ fontSize: 24, marginBottom: 8 }}>
              {['🛡️', '⚡', '💧', '👥', '✨', '❤️', '🎯', '🌿', '🧘'][parseInt(category.id) - 1]}
            </Text>
            
            <Text variant="body-sm" weight="bold" numberOfLines={2} style={styles.masonryTitle}>
              {category.name}
            </Text>
            
            <View style={styles.masonryMetrics}>
              <Text variant="caption" style={styles.masonryMetricText}>
                {category.productCount} products
              </Text>
              <Text variant="caption" weight="bold" style={styles.masonryMargin}>
                {category.avgMargin}% margin
              </Text>
            </View>
            
            {category.specialBadge && (
              <View style={styles.masonryBadge}>
                <Text variant="caption" weight="bold" style={styles.masonryBadgeText}>
                  {category.specialBadge}
                </Text>
              </View>
            )}
          </View>
        </LinearGradient>
      </TouchableOpacity>
    );
  };
  
  return (
    <View style={styles.layoutContainer}>
      <View style={styles.layoutHeader}>
        <Text variant="h4" weight="semibold">🎨 Category Gallery</Text>
        <View style={styles.layoutIndicator}>
          <Layers size={20} color={isDark ? '#FFFFFF' : '#666666'} />
        </View>
      </View>
      
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.masonryContainer}>
          <View style={styles.masonryColumn}>
            {leftColumn.map((category, index) => renderMasonryCard(category, index))}
          </View>
          
          <View style={styles.masonryColumn}>
            {rightColumn.map((category, index) => renderMasonryCard(category, index))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

// Layout 4: Carousel with Pagination Dots
export const CarouselLayout = ({ onCategoryPress, categories }: LayoutProps) => {
  const isDark = useSelector(selectIsDark);
  const [currentPage, setCurrentPage] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);
  
  const onScroll = (event: any) => {
    const page = Math.round(event.nativeEvent.contentOffset.x / width);
    setCurrentPage(page);
  };
  
  return (
    <View style={styles.layoutContainer}>
      <View style={styles.layoutHeader}>
        <Text variant="h4" weight="semibold">📱 Category Spotlight</Text>
        <View style={styles.carouselControls}>
          <TouchableOpacity
            style={[styles.carouselButton, { backgroundColor: isDark ? '#333' : '#F0F0F0' }]}
            onPress={() => {
              const prevPage = Math.max(0, currentPage - 1);
              scrollViewRef.current?.scrollTo({ x: prevPage * width, animated: true });
            }}
          >
            <ChevronLeft size={20} color={isDark ? '#FFFFFF' : '#666666'} />
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.carouselButton, { backgroundColor: isDark ? '#333' : '#F0F0F0' }]}
            onPress={() => {
              const nextPage = Math.min(categories.length - 1, currentPage + 1);
              scrollViewRef.current?.scrollTo({ x: nextPage * width, animated: true });
            }}
          >
            <ChevronRight size={20} color={isDark ? '#FFFFFF' : '#666666'} />
          </TouchableOpacity>
        </View>
      </View>
      
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={16}
      >
        {categories.map((category, index) => (
          <TouchableOpacity
            key={category.id}
            style={styles.carouselSlide}
            onPress={() => onCategoryPress(category)}
            activeOpacity={0.9}
          >
            <LinearGradient
              colors={category.gradient}
              style={styles.carouselGradient}
            >
              <View style={styles.carouselContent}>
                <View style={styles.carouselIconContainer}>
                  <Text style={{ fontSize: 48 }}>
                    {['🛡️', '⚡', '💧', '👥', '✨', '❤️', '🎯', '🌿', '🧘'][index]}
                  </Text>
                </View>
                
                <Text variant="h2" weight="bold" style={styles.carouselTitle}>
                  {category.name}
                </Text>
                
                <View style={styles.carouselMetrics}>
                  <View style={styles.carouselMetric}>
                    <Text variant="h3" weight="bold" style={styles.carouselMetricValue}>
                      {category.productCount}
                    </Text>
                    <Text variant="body" style={styles.carouselMetricLabel}>
                      Products Available
                    </Text>
                  </View>
                  
                  <View style={styles.carouselMetric}>
                    <Text variant="h3" weight="bold" style={styles.carouselMetricValue}>
                      {category.avgMargin}%
                    </Text>
                    <Text variant="body" style={styles.carouselMetricLabel}>
                      Average Margin
                    </Text>
                  </View>
                </View>
                
                {category.specialBadge && (
                  <View style={styles.carouselBadge}>
                    <Star size={16} color="#FFD700" />
                    <Text variant="body" weight="bold" style={styles.carouselBadgeText}>
                      {category.specialBadge}
                    </Text>
                  </View>
                )}
              </View>
            </LinearGradient>
          </TouchableOpacity>
        ))}
      </ScrollView>
      
      {/* Pagination Dots */}
      <View style={styles.pagination}>
        {categories.map((_, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.paginationDot,
              {
                backgroundColor: currentPage === index 
                  ? '#FF4500' 
                  : (isDark ? '#555' : '#CCC')
              }
            ]}
            onPress={() => {
              scrollViewRef.current?.scrollTo({ x: index * width, animated: true });
            }}
          />
        ))}
      </View>
    </View>
  );
};

// Layout 5: Tabbed Categories
export const TabbedLayout = ({ onCategoryPress, categories }: LayoutProps) => {
  const isDark = useSelector(selectIsDark);
  const [activeTab, setActiveTab] = useState(0);
  
  const tabs = [
    { name: 'Popular', categories: categories.slice(0, 3) },
    { name: 'High Margin', categories: categories.slice(3, 6) },
    { name: 'Trending', categories: categories.slice(6, 9) }
  ];
  
  return (
    <View style={styles.layoutContainer}>
      <View style={styles.layoutHeader}>
        <Text variant="h4" weight="semibold">📂 Organized Categories</Text>
      </View>
      
      {/* Tab Headers */}
      <View style={styles.tabHeaders}>
        {tabs.map((tab, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.tabHeader,
              {
                backgroundColor: activeTab === index 
                  ? '#FF4500' 
                  : (isDark ? '#333' : '#F0F0F0'),
                borderBottomColor: activeTab === index ? '#FF4500' : 'transparent'
              }
            ]}
            onPress={() => setActiveTab(index)}
          >
            <Text
              variant="body-sm"
              weight="semibold"
              style={{
                color: activeTab === index 
                  ? '#FFFFFF' 
                  : (isDark ? '#FFFFFF' : '#666666')
              }}
            >
              {tab.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      
      {/* Tab Content */}
      <View style={styles.tabContent}>
        <View style={styles.tabGrid}>
          {tabs[activeTab].categories.map((category, index) => (
            <TouchableOpacity
              key={category.id}
              style={[
                styles.tabCard,
                { backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF' }
              ]}
              onPress={() => onCategoryPress(category)}
            >
              <LinearGradient
                colors={[category.gradient[0] + '30', category.gradient[0] + '10']}
                style={styles.tabCardGradient}
              >
                <View style={styles.tabCardContent}>
                  <View style={[styles.tabIcon, { backgroundColor: category.gradient[0] + '20' }]}>
                    <Text style={{ fontSize: 24 }}>
                      {['🛡️', '⚡', '💧', '👥', '✨', '❤️', '🎯', '🌿', '🧘'][parseInt(category.id) - 1]}
                    </Text>
                  </View>
                  
                  <Text variant="body-sm" weight="bold" numberOfLines={2} style={styles.tabCardTitle}>
                    {category.name}
                  </Text>
                  
                  <View style={styles.tabCardMetrics}>
                    <Text variant="caption" color="secondary">
                      {category.productCount} products
                    </Text>
                    <Text variant="caption" weight="bold" style={{ color: category.gradient[0] }}>
                      {category.avgMargin}% margin
                    </Text>
                  </View>
                  
                  {category.specialBadge && (
                    <View style={[styles.tabCardBadge, { backgroundColor: category.gradient[0] + '20' }]}>
                      <Text variant="caption" weight="bold" style={{ color: category.gradient[0] }}>
                        {category.specialBadge}
                      </Text>
                    </View>
                  )}
                </View>
              </LinearGradient>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );
};

// Layout 6: Diagonal Grid
export const DiagonalGridLayout = ({ onCategoryPress, categories }: LayoutProps) => {
  const isDark = useSelector(selectIsDark);
  
  return (
    <View style={styles.layoutContainer}>
      <View style={styles.layoutHeader}>
        <Text variant="h4" weight="semibold">💎 Premium Showcase</Text>
        <View style={styles.layoutIndicator}>
          <Grid size={20} color={isDark ? '#FFFFFF' : '#666666'} />
        </View>
      </View>
      
      <View style={styles.diagonalGrid}>
        {categories.slice(0, 6).map((category, index) => (
          <TouchableOpacity
            key={category.id}
            style={[
              styles.diagonalCard,
              {
                transform: [
                  { rotate: `${(index % 2 === 0 ? 5 : -5)}deg` },
                  { scale: index === 0 ? 1.1 : 1 }
                ],
                zIndex: index === 0 ? 10 : 1,
                marginTop: index === 0 ? 0 : -20
              }
            ]}
            onPress={() => onCategoryPress(category)}
          >
            <LinearGradient
              colors={category.gradient}
              style={styles.diagonalCardGradient}
            >
              <View style={styles.diagonalCardContent}>
                <Text style={{ fontSize: 28, marginBottom: 8 }}>
                  {['🛡️', '⚡', '💧', '👥', '✨', '❤️'][index]}
                </Text>
                
                <Text variant="body-sm" weight="bold" numberOfLines={1} style={styles.diagonalCardTitle}>
                  {category.name}
                </Text>
                
                <Text variant="caption" style={styles.diagonalCardMetric}>
                  {category.productCount} products
                </Text>
                
                <Text variant="caption" weight="bold" style={styles.diagonalCardMargin}>
                  {category.avgMargin}% margin
                </Text>
                
                {index === 0 && (
                  <View style={styles.featuredDiagonalBadge}>
                    <Star size={12} color="#FFD700" />
                    <Text variant="caption" weight="bold" style={styles.featuredDiagonalText}>
                      FEATURED
                    </Text>
                  </View>
                )}
              </View>
            </LinearGradient>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  layoutContainer: {
    marginVertical: 16,
  },
  layoutHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  layoutIndicator: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 69, 0, 0.1)',
  },
  viewAllButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 69, 0, 0.1)',
  },
  
  // Featured Grid Layout Styles
  featuredCard: {
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
  },
  featuredGradient: {
    padding: 24,
    minHeight: 160,
    justifyContent: 'center',
  },
  featuredContent: {
    alignItems: 'center',
  },
  featuredBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 12,
    gap: 4,
  },
  featuredBadgeText: {
    color: '#FFD700',
    fontSize: 10,
  },
  featuredTitle: {
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 16,
  },
  featuredMetrics: {
    flexDirection: 'row',
    gap: 24,
  },
  featuredMetric: {
    alignItems: 'center',
  },
  featuredMetricValue: {
    color: '#FFFFFF',
    fontSize: 18,
  },
  featuredMetricLabel: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 11,
  },
  
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    gap: 12,
  },
  gridCard: {
    width: (width - 56) / 2,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  gridGradient: {
    padding: 16,
    minHeight: 140,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gridIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  gridTitle: {
    textAlign: 'center',
    marginBottom: 4,
  },
  
  // Masonry Layout Styles
  masonryContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 12,
  },
  masonryColumn: {
    flex: 1,
    gap: 12,
  },
  masonryCard: {
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
  },
  masonryGradient: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
  },
  masonryContent: {
    alignItems: 'center',
  },
  masonryTitle: {
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 8,
  },
  masonryMetrics: {
    alignItems: 'center',
    gap: 2,
  },
  masonryMetricText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 11,
  },
  masonryMargin: {
    color: '#FFFFFF',
    fontSize: 12,
  },
  masonryBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  masonryBadgeText: {
    color: '#FFFFFF',
    fontSize: 9,
  },
  
  // Carousel Layout Styles
  carouselControls: {
    flexDirection: 'row',
    gap: 8,
  },
  carouselButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  carouselSlide: {
    width: width,
    paddingHorizontal: 16,
  },
  carouselGradient: {
    borderRadius: 24,
    padding: 32,
    minHeight: 300,
    justifyContent: 'center',
    alignItems: 'center',
  },
  carouselContent: {
    alignItems: 'center',
    gap: 16,
  },
  carouselIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  carouselTitle: {
    color: '#FFFFFF',
    textAlign: 'center',
  },
  carouselMetrics: {
    flexDirection: 'row',
    gap: 32,
  },
  carouselMetric: {
    alignItems: 'center',
  },
  carouselMetricValue: {
    color: '#FFFFFF',
  },
  carouselMetricLabel: {
    color: 'rgba(255, 255, 255, 0.8)',
  },
  carouselBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    gap: 8,
  },
  carouselBadgeText: {
    color: '#FFD700',
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    marginTop: 16,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  
  // Tabbed Layout Styles
  tabHeaders: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    overflow: 'hidden',
  },
  tabHeader: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderBottomWidth: 2,
  },
  tabContent: {
    paddingHorizontal: 16,
  },
  tabGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  tabCard: {
    width: (width - 56) / 2,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  tabCardGradient: {
    padding: 16,
    minHeight: 160,
  },
  tabCardContent: {
    alignItems: 'center',
    gap: 8,
  },
  tabIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabCardTitle: {
    textAlign: 'center',
  },
  tabCardMetrics: {
    alignItems: 'center',
    gap: 2,
  },
  tabCardBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  
  // Diagonal Grid Layout Styles
  diagonalGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    gap: 16,
    justifyContent: 'center',
  },
  diagonalCard: {
    width: (width - 64) / 2,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
  },
  diagonalCardGradient: {
    borderRadius: 16,
    padding: 20,
    minHeight: 140,
    justifyContent: 'center',
    alignItems: 'center',
  },
  diagonalCardContent: {
    alignItems: 'center',
    gap: 4,
  },
  diagonalCardTitle: {
    color: '#FFFFFF',
    textAlign: 'center',
  },
  diagonalCardMetric: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 11,
  },
  diagonalCardMargin: {
    color: '#FFFFFF',
    fontSize: 12,
  },
  featuredDiagonalBadge: {
    position: 'absolute',
    top: -8,
    right: -8,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    gap: 2,
  },
  featuredDiagonalText: {
    color: '#FFD700',
    fontSize: 9,
  },
}); 