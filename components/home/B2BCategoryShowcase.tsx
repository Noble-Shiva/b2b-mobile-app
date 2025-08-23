import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Dimensions, Image } from 'react-native';
import { 
  Shield, 
  Heart, 
  Zap, 
  Droplets, 
  Users, 
  User, 
  Sparkles, 
  Activity,
  TrendingUp,
  Star,
  Package,
  Target,
  Award,
  Crown
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSelector } from 'react-redux';
import { selectIsDark } from '@/store/themeSlice';
import { Text } from '@/components/ui';

const { width } = Dimensions.get('window');

interface CategoryData {
  id: string;
  name: string;
  icon: string;
  iconColor: string;
  gradient: string[];
  productCount: number;
  avgMargin: number;
  demandTrend: 'high' | 'medium' | 'stable';
  designType: 'rounded' | 'elevated' | 'glassmorphism' | 'animated' | 'hexagonal' | 'diagonal' | 'floating' | 'minimalist' | 'perspective';
  bgImage?: string;
  specialBadge?: string;
  fastMoving?: boolean;
}

const categories: CategoryData[] = [
  {
    id: '1',
    name: 'Immunity Boosters',
    icon: 'shield',
    iconColor: '#10B981',
    gradient: ['#10B981', '#059669', '#047857'],
    productCount: 245,
    avgMargin: 35,
    demandTrend: 'high',
    designType: 'rounded',
    specialBadge: 'Trending',
    fastMoving: true
  },
  {
    id: '2',
    name: 'Digestive Health',
    icon: 'activity',
    iconColor: '#F59E0B',
    gradient: ['#F59E0B', '#D97706', '#B45309'],
    productCount: 189,
    avgMargin: 32,
    demandTrend: 'high',
    designType: 'elevated',
    specialBadge: 'Best Seller'
  },
  {
    id: '3',
    name: 'Joint & Bone Care',
    icon: 'zap',
    iconColor: '#3B82F6',
    gradient: ['#3B82F6', '#2563EB', '#1D4ED8'],
    productCount: 156,
    avgMargin: 38,
    demandTrend: 'medium',
    designType: 'glassmorphism',
    fastMoving: true
  },
  {
    id: '4',
    name: 'Respiratory Care',
    icon: 'droplets',
    iconColor: '#06B6D4',
    gradient: ['#06B6D4', '#0891B2', '#0E7490'],
    productCount: 134,
    avgMargin: 33,
    demandTrend: 'high',
    designType: 'animated',
    specialBadge: 'High Demand'
  },
  {
    id: '5',
    name: 'Women\'s Health',
    icon: 'users',
    iconColor: '#EC4899',
    gradient: ['#EC4899', '#DB2777', '#BE185D'],
    productCount: 198,
    avgMargin: 36,
    demandTrend: 'high',
    designType: 'hexagonal',
    specialBadge: 'Premium'
  },
  {
    id: '6',
    name: 'Men\'s Health',
    icon: 'user',
    iconColor: '#8B5CF6',
    gradient: ['#8B5CF6', '#7C3AED', '#6D28D9'],
    productCount: 167,
    avgMargin: 34,
    demandTrend: 'medium',
    designType: 'diagonal'
  },
  {
    id: '7',
    name: 'Skin & Hair Care',
    icon: 'sparkles',
    iconColor: '#F97316',
    gradient: ['#F97316', '#EA580C', '#C2410C'],
    productCount: 223,
    avgMargin: 42,
    demandTrend: 'high',
    designType: 'floating',
    specialBadge: 'High Margin',
    fastMoving: true
  },
  {
    id: '8',
    name: 'Heart Health',
    icon: 'heart',
    iconColor: '#EF4444',
    gradient: ['#EF4444', '#DC2626', '#B91C1C'],
    productCount: 145,
    avgMargin: 37,
    demandTrend: 'medium',
    designType: 'minimalist'
  },
  {
    id: '9',
    name: 'Diabetes Care',
    icon: 'target',
    iconColor: '#84CC16',
    gradient: ['#84CC16', '#65A30D', '#4D7C0F'],
    productCount: 178,
    avgMargin: 39,
    demandTrend: 'high',
    designType: 'perspective',
    specialBadge: 'Growing Market'
  }
];

interface B2BCategoryShowcaseProps {
  onCategoryPress: (category: CategoryData) => void;
}

export default function B2BCategoryShowcase({ onCategoryPress }: B2BCategoryShowcaseProps) {
  const isDark = useSelector(selectIsDark);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const getIcon = (iconName: string, color: string, size: number = 24) => {
    const props = { size, color };
    switch (iconName) {
      case 'shield': return <Shield {...props} />;
      case 'activity': return <Activity {...props} />;
      case 'zap': return <Zap {...props} />;
      case 'droplets': return <Droplets {...props} />;
      case 'users': return <Users {...props} />;
      case 'user': return <User {...props} />;
      case 'sparkles': return <Sparkles {...props} />;
      case 'heart': return <Heart {...props} />;
      case 'target': return <Target {...props} />;
      default: return <Package {...props} />;
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'high': return <TrendingUp size={12} color="#10B981" />;
      case 'medium': return <Star size={12} color="#F59E0B" />;
      default: return <Activity size={12} color="#6B7280" />;
    }
  };

  const renderRoundedCard = (category: CategoryData) => (
    <TouchableOpacity
      key={category.id}
      style={[styles.roundedCard, { backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF' }]}
      onPress={() => onCategoryPress(category)}
      activeOpacity={0.8}
    >
      <LinearGradient
        colors={category.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.roundedGradient}
      >
        <View style={styles.roundedContent}>
          {getIcon(category.icon, '#FFFFFF', 32)}
          {category.specialBadge && (
            <View style={styles.trendingBadge}>
              <Text variant="caption" weight="bold" style={styles.badgeText}>
                {category.specialBadge}
              </Text>
            </View>
          )}
        </View>
      </LinearGradient>
      
      <View style={styles.roundedInfo}>
        <Text variant="body-sm" weight="bold" numberOfLines={2} style={styles.categoryName}>
          {category.name}
        </Text>
        <Text variant="caption" color="secondary">
          {category.productCount} products
        </Text>
        <View style={styles.marginRow}>
          <Text variant="caption" weight="semibold" style={{ color: category.iconColor }}>
            {category.avgMargin}% margin
          </Text>
          {getTrendIcon(category.demandTrend)}
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderElevatedCard = (category: CategoryData) => (
    <TouchableOpacity
      key={category.id}
      style={[
        styles.elevatedCard,
        { 
          backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF',
          shadowColor: category.iconColor
        }
      ]}
      onPress={() => onCategoryPress(category)}
      activeOpacity={0.8}
    >
      <View style={[styles.elevatedIcon, { backgroundColor: category.iconColor + '20' }]}>
        {getIcon(category.icon, category.iconColor, 28)}
      </View>
      
      <View style={styles.elevatedContent}>
        <Text variant="body-sm" weight="bold" numberOfLines={1}>
          {category.name}
        </Text>
        <Text variant="caption" color="secondary">
          {category.productCount} products
        </Text>
        
        <View style={styles.elevatedMetrics}>
          <View style={styles.metricChip}>
            <Text variant="caption" weight="semibold" style={{ color: category.iconColor }}>
              {category.avgMargin}%
            </Text>
          </View>
          {category.specialBadge && (
            <View style={[styles.specialChip, { backgroundColor: category.iconColor + '20' }]}>
              <Text variant="caption" weight="bold" style={{ color: category.iconColor }}>
                {category.specialBadge}
              </Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderGlassmorphismCard = (category: CategoryData) => (
    <TouchableOpacity
      key={category.id}
      style={[
        styles.glassCard,
        { 
          backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.7)',
          borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.3)'
        }
      ]}
      onPress={() => onCategoryPress(category)}
      activeOpacity={0.8}
    >
      <LinearGradient
        colors={[category.iconColor + '40', category.iconColor + '20']}
        style={styles.glassBackground}
      >
        <View style={styles.glassContent}>
          <View style={styles.glassIconContainer}>
            {getIcon(category.icon, category.iconColor, 30)}
          </View>
          
          <Text variant="body-sm" weight="bold" numberOfLines={1} style={styles.glassTitle}>
            {category.name}
          </Text>
          
          <View style={styles.glassMetrics}>
            <Text variant="caption" color="secondary">
              {category.productCount} products
            </Text>
            <View style={styles.glassDivider} />
            <Text variant="caption" weight="semibold" style={{ color: category.iconColor }}>
              {category.avgMargin}% margin
            </Text>
          </View>
          
          {category.fastMoving && (
            <View style={styles.fastMovingIndicator}>
              <Zap size={10} color="#FFFFFF" />
              <Text variant="caption" weight="bold" style={styles.fastMovingText}>
                Fast Moving
              </Text>
            </View>
          )}
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );

  const renderAnimatedCard = (category: CategoryData) => (
    <TouchableOpacity
      key={category.id}
      style={[
        styles.animatedCard,
        { backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF' }
      ]}
      onPress={() => onCategoryPress(category)}
      activeOpacity={0.8}
    >
      <View style={styles.animatedHeader}>
        <LinearGradient
          colors={category.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.animatedGradientBar}
        />
        
        <View style={styles.animatedIconArea}>
          <View style={[styles.animatedIconBg, { backgroundColor: category.iconColor + '20' }]}>
            {getIcon(category.icon, category.iconColor, 26)}
          </View>
          
          {category.specialBadge && (
            <View style={[styles.animatedBadge, { backgroundColor: category.iconColor }]}>
              <Text variant="caption" weight="bold" style={styles.animatedBadgeText}>
                {category.specialBadge}
              </Text>
            </View>
          )}
        </View>
      </View>
      
      <View style={styles.animatedBody}>
        <Text variant="body-sm" weight="bold" numberOfLines={1}>
          {category.name}
        </Text>
        
        <View style={styles.animatedStats}>
          <View style={styles.animatedStat}>
            <Text variant="caption" color="secondary">Products</Text>
            <Text variant="body-sm" weight="bold">{category.productCount}</Text>
          </View>
          
          <View style={styles.animatedStat}>
            <Text variant="caption" color="secondary">Margin</Text>
            <Text variant="body-sm" weight="bold" style={{ color: category.iconColor }}>
              {category.avgMargin}%
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderHexagonalCard = (category: CategoryData) => (
    <TouchableOpacity
      key={category.id}
      style={styles.hexagonalCard}
      onPress={() => onCategoryPress(category)}
      activeOpacity={0.8}
    >
      <LinearGradient
        colors={category.gradient}
        style={styles.hexagonalGradient}
      >
        <View style={styles.hexagonalContent}>
          {getIcon(category.icon, '#FFFFFF', 28)}
          
          <Text variant="body-sm" weight="bold" numberOfLines={1} style={styles.hexagonalTitle}>
            {category.name}
          </Text>
          
          <View style={styles.hexagonalMetrics}>
            <Text variant="caption" style={styles.hexagonalMetricText}>
              {category.productCount} products
            </Text>
            <Text variant="caption" weight="bold" style={styles.hexagonalMargin}>
              {category.avgMargin}% margin
            </Text>
          </View>
          
          {category.specialBadge && (
            <View style={styles.hexagonalBadge}>
              <Crown size={8} color="#FFD700" />
              <Text variant="caption" weight="bold" style={styles.hexagonalBadgeText}>
                {category.specialBadge}
              </Text>
            </View>
          )}
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );

  const renderDiagonalCard = (category: CategoryData) => (
    <TouchableOpacity
      key={category.id}
      style={[
        styles.diagonalCard,
        { backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF' }
      ]}
      onPress={() => onCategoryPress(category)}
      activeOpacity={0.8}
    >
      <LinearGradient
        colors={[category.iconColor + '40', category.iconColor + '20']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.diagonalGradient}
      />
      
      <View style={styles.diagonalContent}>
        <View style={styles.diagonalIconContainer}>
          {getIcon(category.icon, category.iconColor, 30)}
        </View>
        
        <View style={styles.diagonalInfo}>
          <Text variant="body-sm" weight="bold" numberOfLines={1}>
            {category.name}
          </Text>
          <Text variant="caption" color="secondary">
            {category.productCount} products
          </Text>
          <Text variant="caption" weight="bold" style={{ color: category.iconColor }}>
            {category.avgMargin}% margin
          </Text>
        </View>
      </View>
      
      <View style={[styles.diagonalCut, { backgroundColor: category.iconColor }]} />
    </TouchableOpacity>
  );

  const renderFloatingCard = (category: CategoryData) => (
    <TouchableOpacity
      key={category.id}
      style={styles.floatingCard}
      onPress={() => onCategoryPress(category)}
      activeOpacity={0.8}
    >
      <LinearGradient
        colors={category.gradient}
        style={styles.floatingGradient}
      >
        <View style={styles.floatingMainContent}>
          <View style={styles.floatingIconArea}>
            {getIcon(category.icon, '#FFFFFF', 32)}
          </View>
          
          <Text variant="body-sm" weight="bold" numberOfLines={1} style={styles.floatingTitle}>
            {category.name}
          </Text>
          
          <View style={styles.floatingMetrics}>
            <Text variant="caption" style={styles.floatingMetricText}>
              {category.productCount} products
            </Text>
            <Text variant="caption" weight="bold" style={styles.floatingMargin}>
              {category.avgMargin}% margin
            </Text>
          </View>
        </View>
        
        {category.specialBadge && (
          <View style={styles.floatingBadge}>
            <Award size={10} color="#FFD700" />
            <Text variant="caption" weight="bold" style={styles.floatingBadgeText}>
              {category.specialBadge}
            </Text>
          </View>
        )}
      </LinearGradient>
    </TouchableOpacity>
  );

  const renderMinimalistCard = (category: CategoryData) => (
    <TouchableOpacity
      key={category.id}
      style={[
        styles.minimalistCard,
        { 
          backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF',
          borderLeftColor: category.iconColor
        }
      ]}
      onPress={() => onCategoryPress(category)}
      activeOpacity={0.8}
    >
      <View style={styles.minimalistContent}>
        <View style={styles.minimalistHeader}>
          <View style={[styles.minimalistIcon, { backgroundColor: category.iconColor + '20' }]}>
            {getIcon(category.icon, category.iconColor, 20)}
          </View>
          
          <View style={styles.minimalistTitle}>
            <Text variant="body-sm" weight="bold" numberOfLines={1}>
              {category.name}
            </Text>
            <Text variant="caption" color="secondary">
              {category.productCount} products
            </Text>
          </View>
        </View>
        
        <View style={styles.minimalistMetrics}>
          <View style={styles.minimalistMetric}>
            <Text variant="caption" color="secondary">Margin</Text>
            <Text variant="body-sm" weight="bold" style={{ color: category.iconColor }}>
              {category.avgMargin}%
            </Text>
          </View>
          
          <View style={styles.minimalistTrend}>
            {getTrendIcon(category.demandTrend)}
            <Text variant="caption" color="secondary" style={{ textTransform: 'capitalize' }}>
              {category.demandTrend}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderPerspectiveCard = (category: CategoryData) => (
    <TouchableOpacity
      key={category.id}
      style={styles.perspectiveCard}
      onPress={() => onCategoryPress(category)}
      activeOpacity={0.8}
    >
      <LinearGradient
        colors={category.gradient}
        style={styles.perspectiveGradient}
      >
        <View style={styles.perspectiveContent}>
          <View style={styles.perspectiveIconContainer}>
            {getIcon(category.icon, '#FFFFFF', 36)}
          </View>
          
          <Text variant="body" weight="bold" numberOfLines={1} style={styles.perspectiveTitle}>
            {category.name}
          </Text>
          
          <View style={styles.perspectiveMetrics}>
            <View style={styles.perspectiveMetric}>
              <Text variant="caption" style={styles.perspectiveMetricLabel}>
                Products
              </Text>
              <Text variant="body-sm" weight="bold" style={styles.perspectiveMetricValue}>
                {category.productCount}
              </Text>
            </View>
            
            <View style={styles.perspectiveMetric}>
              <Text variant="caption" style={styles.perspectiveMetricLabel}>
                Margin
              </Text>
              <Text variant="body-sm" weight="bold" style={styles.perspectiveMetricValue}>
                {category.avgMargin}%
              </Text>
            </View>
          </View>
          
          {category.specialBadge && (
            <View style={styles.perspectiveBadge}>
              <Star size={12} color="#FFD700" />
              <Text variant="caption" weight="bold" style={styles.perspectiveBadgeText}>
                {category.specialBadge}
              </Text>
            </View>
          )}
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );

  const renderCategoryCard = (category: CategoryData) => {
    switch (category.designType) {
      case 'rounded': return renderRoundedCard(category);
      case 'elevated': return renderElevatedCard(category);
      case 'glassmorphism': return renderGlassmorphismCard(category);
      case 'animated': return renderAnimatedCard(category);
      case 'hexagonal': return renderHexagonalCard(category);
      case 'diagonal': return renderDiagonalCard(category);
      case 'floating': return renderFloatingCard(category);
      case 'minimalist': return renderMinimalistCard(category);
      case 'perspective': return renderPerspectiveCard(category);
      default: return renderRoundedCard(category);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        snapToInterval={width * 0.45}
        decelerationRate="fast"
      >
        {categories.map(renderCategoryCard)}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingRight: 32,
  },
  
  // Rounded Card Styles
  roundedCard: {
    width: width * 0.42,
    marginRight: 16,
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  roundedGradient: {
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },
  roundedContent: {
    alignItems: 'center',
    position: 'relative',
  },
  trendingBadge: {
    position: 'absolute',
    top: -40,
    right: -20,
    backgroundColor: '#FF4500',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    transform: [{ rotate: '15deg' }],
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 10,
  },
  roundedInfo: {
    padding: 12,
    gap: 4,
  },
  categoryName: {
    textAlign: 'center',
  },
  marginRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  
  // Elevated Card Styles
  elevatedCard: {
    width: width * 0.42,
    marginRight: 16,
    borderRadius: 16,
    padding: 16,
    elevation: 8,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
  },
  elevatedIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  elevatedContent: {
    gap: 6,
  },
  elevatedMetrics: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
  },
  metricChip: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  specialChip: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  
  // Glassmorphism Card Styles
  glassCard: {
    width: width * 0.42,
    marginRight: 16,
    borderRadius: 20,
    borderWidth: 1,
    overflow: 'hidden',
  },
  glassBackground: {
    padding: 16,
    height: 160,
  },
  glassContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  glassIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  glassTitle: {
    textAlign: 'center',
    color: '#FFFFFF',
  },
  glassMetrics: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  glassDivider: {
    width: 1,
    height: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  fastMovingIndicator: {
    position: 'absolute',
    top: 8,
    right: 8,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF4500',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    gap: 2,
  },
  fastMovingText: {
    color: '#FFFFFF',
    fontSize: 9,
  },
  
  // Animated Card Styles
  animatedCard: {
    width: width * 0.42,
    marginRight: 16,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.18,
    shadowRadius: 10,
  },
  animatedHeader: {
    height: 80,
    position: 'relative',
  },
  animatedGradientBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 4,
  },
  animatedIconArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  animatedIconBg: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  animatedBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  animatedBadgeText: {
    color: '#FFFFFF',
    fontSize: 9,
  },
  animatedBody: {
    padding: 16,
    gap: 8,
  },
  animatedStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  animatedStat: {
    alignItems: 'center',
  },
  
  // Hexagonal Card Styles
  hexagonalCard: {
    width: width * 0.42,
    marginRight: 16,
    height: 160,
    borderRadius: 12,
    transform: [{ rotate: '5deg' }],
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.25,
    shadowRadius: 15,
  },
  hexagonalGradient: {
    flex: 1,
    borderRadius: 12,
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  hexagonalContent: {
    alignItems: 'center',
    gap: 8,
  },
  hexagonalTitle: {
    color: '#FFFFFF',
    textAlign: 'center',
  },
  hexagonalMetrics: {
    alignItems: 'center',
    gap: 4,
  },
  hexagonalMetricText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 11,
  },
  hexagonalMargin: {
    color: '#FFFFFF',
    fontSize: 12,
  },
  hexagonalBadge: {
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
  hexagonalBadgeText: {
    color: '#FFD700',
    fontSize: 9,
  },
  
  // Diagonal Card Styles
  diagonalCard: {
    width: width * 0.42,
    marginRight: 16,
    height: 140,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.18,
    shadowRadius: 10,
    position: 'relative',
  },
  diagonalGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.3,
  },
  diagonalContent: {
    flex: 1,
    padding: 16,
    justifyContent: 'space-between',
  },
  diagonalIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  diagonalInfo: {
    gap: 2,
  },
  diagonalCut: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 40,
    height: 40,
    transform: [{ rotate: '45deg' }],
    marginBottom: -20,
    marginRight: -20,
  },
  
  // Floating Card Styles
  floatingCard: {
    width: width * 0.42,
    marginRight: 16,
    height: 160,
    borderRadius: 20,
    elevation: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 18,
  },
  floatingGradient: {
    flex: 1,
    borderRadius: 20,
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  floatingMainContent: {
    alignItems: 'center',
    gap: 8,
  },
  floatingIconArea: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  floatingTitle: {
    color: '#FFFFFF',
    textAlign: 'center',
    fontSize: 14,
  },
  floatingMetrics: {
    alignItems: 'center',
    gap: 2,
  },
  floatingMetricText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 11,
  },
  floatingMargin: {
    color: '#FFFFFF',
    fontSize: 13,
  },
  floatingBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    gap: 2,
  },
  floatingBadgeText: {
    color: '#FFD700',
    fontSize: 9,
  },
  
  // Minimalist Card Styles
  minimalistCard: {
    width: width * 0.42,
    marginRight: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  minimalistContent: {
    gap: 12,
  },
  minimalistHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  minimalistIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  minimalistTitle: {
    flex: 1,
    gap: 2,
  },
  minimalistMetrics: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  minimalistMetric: {
    alignItems: 'center',
  },
  minimalistTrend: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  
  // Perspective Card Styles
  perspectiveCard: {
    width: width * 0.42,
    marginRight: 16,
    height: 180,
    borderRadius: 16,
    transform: [{ perspective: 1000 }, { rotateX: '5deg' }],
    elevation: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 20,
  },
  perspectiveGradient: {
    flex: 1,
    borderRadius: 16,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  perspectiveContent: {
    alignItems: 'center',
    gap: 12,
  },
  perspectiveIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  perspectiveTitle: {
    color: '#FFFFFF',
    textAlign: 'center',
    fontSize: 15,
  },
  perspectiveMetrics: {
    flexDirection: 'row',
    gap: 20,
  },
  perspectiveMetric: {
    alignItems: 'center',
  },
  perspectiveMetricLabel: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 11,
  },
  perspectiveMetricValue: {
    color: '#FFFFFF',
    fontSize: 14,
  },
  perspectiveBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    gap: 4,
  },
  perspectiveBadgeText: {
    color: '#FFD700',
    fontSize: 10,
  },
}); 