import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { 
  MoreHorizontal, 
  Grid, 
  Layers, 
  Play, 
  Folder, 
  Diamond 
} from 'lucide-react-native';
import { useSelector } from 'react-redux';
import { selectIsDark } from '@/store/themeSlice';
import { Text } from '@/components/ui';
import {
  HorizontalScrollLayout,
  FeaturedGridLayout,
  MasonryLayout,
  CarouselLayout,
  TabbedLayout,
  DiagonalGridLayout
} from './B2BCategoryLayouts';

// Sample category data for demo
const sampleCategories = [
  {
    id: '1', name: 'Immunity Boosters', icon: 'shield', iconColor: '#10B981',
    gradient: ['#10B981', '#059669', '#047857'], productCount: 245, avgMargin: 35,
    demandTrend: 'high', designType: 'rounded', specialBadge: 'Trending', fastMoving: true
  },
  {
    id: '2', name: 'Digestive Health', icon: 'activity', iconColor: '#F59E0B',
    gradient: ['#F59E0B', '#D97706', '#B45309'], productCount: 189, avgMargin: 32,
    demandTrend: 'high', designType: 'elevated', specialBadge: 'Best Seller'
  },
  {
    id: '3', name: 'Joint & Bone Care', icon: 'zap', iconColor: '#3B82F6',
    gradient: ['#3B82F6', '#2563EB', '#1D4ED8'], productCount: 156, avgMargin: 38,
    demandTrend: 'medium', designType: 'glassmorphism', fastMoving: true
  },
  {
    id: '4', name: 'Respiratory Care', icon: 'droplets', iconColor: '#06B6D4',
    gradient: ['#06B6D4', '#0891B2', '#0E7490'], productCount: 134, avgMargin: 33,
    demandTrend: 'high', designType: 'animated', specialBadge: 'High Demand'
  },
  {
    id: '5', name: 'Women\'s Health', icon: 'users', iconColor: '#EC4899',
    gradient: ['#EC4899', '#DB2777', '#BE185D'], productCount: 198, avgMargin: 36,
    demandTrend: 'high', designType: 'hexagonal', specialBadge: 'Premium'
  },
  {
    id: '6', name: 'Men\'s Health', icon: 'user', iconColor: '#8B5CF6',
    gradient: ['#8B5CF6', '#7C3AED', '#6D28D9'], productCount: 167, avgMargin: 34,
    demandTrend: 'medium', designType: 'diagonal'
  },
  {
    id: '7', name: 'Skin & Hair Care', icon: 'sparkles', iconColor: '#F97316',
    gradient: ['#F97316', '#EA580C', '#C2410C'], productCount: 223, avgMargin: 42,
    demandTrend: 'high', designType: 'floating', specialBadge: 'High Margin', fastMoving: true
  },
  {
    id: '8', name: 'Heart Health', icon: 'heart', iconColor: '#EF4444',
    gradient: ['#EF4444', '#DC2626', '#B91C1C'], productCount: 145, avgMargin: 37,
    demandTrend: 'medium', designType: 'minimalist'
  },
  {
    id: '9', name: 'Diabetes Care', icon: 'target', iconColor: '#84CC16',
    gradient: ['#84CC16', '#65A30D', '#4D7C0F'], productCount: 178, avgMargin: 39,
    demandTrend: 'high', designType: 'perspective', specialBadge: 'Growing Market'
  }
];

const layoutOptions = [
  {
    id: 'horizontal',
    name: 'Horizontal Scroll',
    icon: MoreHorizontal,
    description: 'Classic horizontal scrolling cards with diverse designs',
    component: HorizontalScrollLayout
  },
  {
    id: 'featured',
    name: 'Featured + Grid',
    icon: Grid,
    description: 'Large featured card with supporting grid layout',
    component: FeaturedGridLayout
  },
  {
    id: 'masonry',
    name: 'Masonry Gallery',
    icon: Layers,
    description: 'Pinterest-style staggered height cards',
    component: MasonryLayout
  },
  {
    id: 'carousel',
    name: 'Full-screen Carousel',
    icon: Play,
    description: 'Immersive full-screen cards with pagination',
    component: CarouselLayout
  },
  {
    id: 'tabbed',
    name: 'Tabbed Categories',
    icon: Folder,
    description: 'Organized tabs with filtered grid views',
    component: TabbedLayout
  },
  {
    id: 'diagonal',
    name: 'Diagonal Showcase',
    icon: Diamond,
    description: 'Rotated cards with dynamic positioning',
    component: DiagonalGridLayout
  }
];

interface CategoryLayoutDemoProps {
  onCategoryPress: (category: any) => void;
}

export default function CategoryLayoutDemo({ onCategoryPress }: CategoryLayoutDemoProps) {
  const isDark = useSelector(selectIsDark);
  const [activeLayout, setActiveLayout] = useState('horizontal');

  const getCurrentLayout = () => {
    const layout = layoutOptions.find(option => option.id === activeLayout);
    return layout?.component || HorizontalScrollLayout;
  };

  const CurrentLayoutComponent = getCurrentLayout();

  return (
    <View style={[styles.container, { backgroundColor: isDark ? '#0A0A0A' : '#F5F5F5' }]}>
      {/* Layout Selector */}
      <View style={styles.selectorContainer}>
        <Text variant="h4" weight="bold" style={styles.selectorTitle}>
          🎨 Category Layout Showcase
        </Text>
        
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.selectorScrollView}
        >
          {layoutOptions.map((option) => {
            const IconComponent = option.icon;
            const isActive = activeLayout === option.id;
            
            return (
              <TouchableOpacity
                key={option.id}
                style={[
                  styles.layoutOption,
                  {
                    backgroundColor: isActive 
                      ? '#FF4500' 
                      : (isDark ? '#1E1E1E' : '#FFFFFF'),
                    borderColor: isActive ? '#FF4500' : (isDark ? '#333' : '#E0E0E0')
                  }
                ]}
                onPress={() => setActiveLayout(option.id)}
                activeOpacity={0.8}
              >
                <View style={[
                  styles.layoutIconContainer,
                  { backgroundColor: isActive ? 'rgba(255, 255, 255, 0.2)' : (isDark ? '#333' : '#F0F0F0') }
                ]}>
                  <IconComponent 
                    size={18} 
                    color={isActive ? '#FFFFFF' : (isDark ? '#FFFFFF' : '#666666')} 
                  />
                </View>
                
                <Text 
                  variant="caption" 
                  weight="semibold"
                  style={{
                    color: isActive ? '#FFFFFF' : (isDark ? '#FFFFFF' : '#333333'),
                    textAlign: 'center'
                  }}
                  numberOfLines={2}
                >
                  {option.name}
                </Text>
                
                <Text 
                  variant="caption" 
                  style={{
                    color: isActive ? 'rgba(255, 255, 255, 0.8)' : (isDark ? '#AAAAAA' : '#666666'),
                    textAlign: 'center',
                    fontSize: 10
                  }}
                  numberOfLines={3}
                >
                  {option.description}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Active Layout Display */}
      <View style={styles.layoutDisplay}>
        <CurrentLayoutComponent 
          onCategoryPress={onCategoryPress}
          categories={sampleCategories}
        />
      </View>

      {/* Layout Info */}
      <View style={[
        styles.layoutInfo,
        { backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF' }
      ]}>
        <View style={styles.layoutInfoHeader}>
          <Text variant="body" weight="semibold">
            Currently Viewing: {layoutOptions.find(l => l.id === activeLayout)?.name}
          </Text>
          <View style={[
            styles.layoutInfoBadge,
            { backgroundColor: isDark ? '#333' : '#F0F0F0' }
          ]}>
            <Text variant="caption" weight="semibold" color="accent">
              Interactive Demo
            </Text>
          </View>
        </View>
        
        <Text variant="body-sm" color="secondary" style={styles.layoutInfoDescription}>
          {layoutOptions.find(l => l.id === activeLayout)?.description}
        </Text>
        
        <View style={styles.layoutFeatures}>
          <View style={styles.layoutFeature}>
            <Text variant="caption" weight="semibold" color="accent">9</Text>
            <Text variant="caption" color="secondary">Card Designs</Text>
          </View>
          
          <View style={styles.layoutFeature}>
            <Text variant="caption" weight="semibold" color="accent">6</Text>
            <Text variant="caption" color="secondary">Layout Options</Text>
          </View>
          
          <View style={styles.layoutFeature}>
            <Text variant="caption" weight="semibold" color="accent">B2B</Text>
            <Text variant="caption" color="secondary">Optimized</Text>
          </View>
          
          <View style={styles.layoutFeature}>
            <Text variant="caption" weight="semibold" color="accent">100%</Text>
            <Text variant="caption" color="secondary">Responsive</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
  },
  selectorContainer: {
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 69, 0, 0.1)',
  },
  selectorTitle: {
    textAlign: 'center',
    marginBottom: 16,
    paddingHorizontal: 20,
  },
  selectorScrollView: {
    paddingHorizontal: 20,
    gap: 12,
  },
  layoutOption: {
    width: 120,
    padding: 12,
    borderRadius: 16,
    borderWidth: 2,
    alignItems: 'center',
    gap: 8,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  layoutIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  layoutDisplay: {
    flex: 1,
    paddingVertical: 10,
  },
  layoutInfo: {
    margin: 20,
    padding: 16,
    borderRadius: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  layoutInfoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  layoutInfoBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  layoutInfoDescription: {
    marginBottom: 12,
    lineHeight: 18,
  },
  layoutFeatures: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 69, 0, 0.1)',
  },
  layoutFeature: {
    alignItems: 'center',
    gap: 2,
  },
}); 