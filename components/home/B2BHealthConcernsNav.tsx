import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { 
  Shield, 
  Zap, 
  Heart, 
  Users, 
  Brain, 
  Droplets,
  Thermometer,
  Activity,
  TrendingUp,
  Package
} from 'lucide-react-native';
import { useSelector } from 'react-redux';
import { selectIsDark } from '@/store/themeSlice';
import { Text } from '@/components/ui';
import { colors } from '@/utils/theme';

interface B2BHealthConcern {
  id: string;
  name: string;
  icon: string;
  iconColor: string;
  bgColor: string;
  productCount: number;
  avgMargin: number;
  demandTrend: 'up' | 'stable' | 'down';
  popularWith: string;
  fastMoving: boolean;
}

const healthConcerns: B2BHealthConcern[] = [
  {
    id: '1',
    name: 'Immunity',
    icon: 'shield',
    iconColor: '#4CAF50',
    bgColor: '#E8F5E9',
    productCount: 156,
    avgMargin: 32,
    demandTrend: 'up',
    popularWith: 'All retailers',
    fastMoving: true,
  },
  {
    id: '2',
    name: 'Digestion',
    icon: 'activity',
    iconColor: '#FF9800',
    bgColor: '#FFF3E0',
    productCount: 128,
    avgMargin: 28,
    demandTrend: 'stable',
    popularWith: 'Medical stores',
    fastMoving: true,
  },
  {
    id: '3',
    name: 'Joint Care',
    icon: 'zap',
    iconColor: '#2196F3',
    bgColor: '#E3F2FD',
    productCount: 89,
    avgMargin: 35,
    demandTrend: 'up',
    popularWith: 'Senior care',
    fastMoving: false,
  },
  {
    id: '4',
    name: 'Respiratory',
    icon: 'droplets',
    iconColor: '#00BCD4',
    bgColor: '#E0F2F1',
    productCount: 94,
    avgMargin: 30,
    demandTrend: 'up',
    popularWith: 'General stores',
    fastMoving: true,
  },
  {
    id: '5',
    name: 'Heart Health',
    icon: 'heart',
    iconColor: '#E91E63',
    bgColor: '#FCE4EC',
    productCount: 67,
    avgMargin: 38,
    demandTrend: 'stable',
    popularWith: 'Pharmacies',
    fastMoving: false,
  },
  {
    id: '6',
    name: 'Mental Wellness',
    icon: 'brain',
    iconColor: '#9C27B0',
    bgColor: '#F3E5F5',
    productCount: 45,
    avgMargin: 42,
    demandTrend: 'up',
    popularWith: 'Urban stores',
    fastMoving: false,
  },
  {
    id: '7',
    name: 'Women Health',
    icon: 'users',
    iconColor: '#FF5722',
    bgColor: '#FBE9E7',
    productCount: 78,
    avgMargin: 36,
    demandTrend: 'stable',
    popularWith: 'Women stores',
    fastMoving: true,
  },
  {
    id: '8',
    name: 'Fever & Pain',
    icon: 'thermometer',
    iconColor: '#607D8B',
    bgColor: '#ECEFF1',
    productCount: 112,
    avgMargin: 25,
    demandTrend: 'stable',
    popularWith: 'All retailers',
    fastMoving: true,
  },
];

interface B2BHealthConcernsNavProps {
  onConcernPress: (concern: B2BHealthConcern) => void;
}

export default function B2BHealthConcernsNav({ onConcernPress }: B2BHealthConcernsNavProps) {
  const isDark = useSelector(selectIsDark);

  const getIcon = (iconName: string, color: string) => {
    const iconProps = { size: 24, color };
    
    switch (iconName) {
      case 'shield':
        return <Shield {...iconProps} />;
      case 'activity':
        return <Activity {...iconProps} />;
      case 'zap':
        return <Zap {...iconProps} />;
      case 'droplets':
        return <Droplets {...iconProps} />;
      case 'heart':
        return <Heart {...iconProps} />;
      case 'brain':
        return <Brain {...iconProps} />;
      case 'users':
        return <Users {...iconProps} />;
      case 'thermometer':
        return <Thermometer {...iconProps} />;
      default:
        return <Shield {...iconProps} />;
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp size={12} color="#4CAF50" />;
      case 'down':
        return <TrendingUp size={12} color="#F44336" style={{ transform: [{ rotate: '180deg' }] }} />;
      default:
        return <TrendingUp size={12} color="#FF9800" style={{ transform: [{ rotate: '90deg' }] }} />;
    }
  };

  return (
    <ScrollView 
      horizontal 
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {healthConcerns.map((concern) => (
        <TouchableOpacity
          key={concern.id}
          style={[
            styles.concernCard,
            { backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF' }
          ]}
          onPress={() => onConcernPress(concern)}
          activeOpacity={0.8}
        >
          {/* Header */}
          <View style={styles.header}>
            <View style={[styles.iconContainer, { backgroundColor: concern.bgColor }]}>
              {getIcon(concern.icon, concern.iconColor)}
            </View>
            
            <View style={styles.headerInfo}>
              <Text variant="body-sm" weight="bold" numberOfLines={1}>
                {concern.name}
              </Text>
              <Text variant="caption" color="secondary">
                {concern.productCount} products
              </Text>
            </View>
            
            {concern.fastMoving && (
              <View style={styles.fastMovingBadge}>
                <Package size={10} color="#FFFFFF" />
              </View>
            )}
          </View>

          {/* Stats Row */}
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text variant="body-sm" weight="bold" color="success">
                {concern.avgMargin}%
              </Text>
              <Text variant="caption" color="secondary" style={styles.statLabel}>
                Avg Margin
              </Text>
            </View>
            
            <View style={styles.trendContainer}>
              {getTrendIcon(concern.demandTrend)}
              <Text variant="caption" style={styles.trendText}>
                {concern.demandTrend === 'up' ? 'Rising' : 
                 concern.demandTrend === 'down' ? 'Falling' : 'Stable'}
              </Text>
            </View>
          </View>

          {/* Popular With */}
          <View style={styles.popularContainer}>
            <Text variant="caption" color="secondary" style={styles.popularLabel}>
              Popular with:
            </Text>
            <Text variant="caption" weight="semibold" style={styles.popularText}>
              {concern.popularWith}
            </Text>
          </View>

          {/* Business Insights */}
          <View style={styles.insightsContainer}>
            {concern.demandTrend === 'up' && (
              <View style={styles.insightBadge}>
                <Text variant="caption" style={styles.insightText}>
                  📈 High Demand
                </Text>
              </View>
            )}
            
            {concern.avgMargin > 35 && (
              <View style={[styles.insightBadge, { backgroundColor: '#E8F5E9' }]}>
                <Text variant="caption" style={[styles.insightText, { color: '#2E7D2E' }]}>
                  💰 High Margin
                </Text>
              </View>
            )}
            
            {concern.fastMoving && (
              <View style={[styles.insightBadge, { backgroundColor: '#E3F2FD' }]}>
                <Text variant="caption" style={[styles.insightText, { color: '#1976D2' }]}>
                  ⚡ Fast Moving
                </Text>
              </View>
            )}
          </View>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
  },
  concernCard: {
    width: 200,
    marginRight: 12,
    borderRadius: 12,
    padding: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  headerInfo: {
    flex: 1,
  },
  fastMovingBadge: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.primary[600],
    alignItems: 'center',
    justifyContent: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    paddingVertical: 6,
    paddingHorizontal: 8,
    backgroundColor: '#F8F9FA',
    borderRadius: 6,
  },
  statItem: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 10,
    marginTop: 2,
  },
  trendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  trendText: {
    fontSize: 11,
    fontWeight: '500',
  },
  popularContainer: {
    marginBottom: 8,
  },
  popularLabel: {
    fontSize: 10,
    marginBottom: 2,
  },
  popularText: {
    fontSize: 11,
    color: colors.primary[600],
  },
  insightsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
  },
  insightBadge: {
    backgroundColor: '#FFF3E0',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  insightText: {
    fontSize: 9,
    fontWeight: '500',
    color: '#F57C00',
  },
}); 