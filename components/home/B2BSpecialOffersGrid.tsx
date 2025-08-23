import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { 
  Package, 
  TrendingUp, 
  Clock, 
  Gift, 
  Percent, 
  Users, 
  Star,
  Calendar,
  Target
} from 'lucide-react-native';
import { useSelector } from 'react-redux';
import { selectIsDark } from '@/store/themeSlice';
import { Text } from '@/components/ui';
import { colors } from '@/utils/theme';

interface B2BSpecialOffer {
  id: string;
  title: string;
  description: string;
  icon: string;
  iconColor: string;
  bgColor: string;
  minOrder?: number;
  discount: number;
  validUntil: string;
  categoryFocus: string;
  image?: string;
  featured?: boolean;
}

const specialOffers: B2BSpecialOffer[] = [
  {
    id: '1',
    title: 'Bulk Immunity Boost',
    description: 'Get 25% off on immunity products when you order 100+ units',
    icon: 'package',
    iconColor: '#4CAF50',
    bgColor: '#E8F5E9',
    minOrder: 100,
    discount: 25,
    validUntil: '2024-12-31',
    categoryFocus: 'Immunity',
    featured: true,
  },
  {
    id: '2',
    title: 'New Retailer Bonus',
    description: 'Extra 15% margin on your first order above ₹25,000',
    icon: 'gift',
    iconColor: '#FF9800',
    bgColor: '#FFF3E0',
    discount: 15,
    validUntil: '2024-12-15',
    categoryFocus: 'All Categories',
  },
  {
    id: '3',
    title: 'Fast Moving Stock',
    description: 'Limited time: Top 20 products with express delivery',
    icon: 'trending-up',
    iconColor: '#2196F3',
    bgColor: '#E3F2FD',
    discount: 20,
    validUntil: '2024-11-30',
    categoryFocus: 'Trending',
  },
  {
    id: '4',
    title: 'Seasonal Pre-Order',
    description: 'Winter collection now available for pre-booking',
    icon: 'calendar',
    iconColor: '#9C27B0',
    bgColor: '#F3E5F5',
    discount: 30,
    validUntil: '2024-12-01',
    categoryFocus: 'Seasonal',
  },
  {
    id: '5',
    title: 'Group Buying',
    description: 'Join with 5+ retailers for wholesale pricing',
    icon: 'users',
    iconColor: '#FF5722',
    bgColor: '#FBE9E7',
    discount: 35,
    validUntil: '2024-12-31',
    categoryFocus: 'Wholesale',
  },
  {
    id: '6',
    title: 'Flash Sale',
    description: 'Next 24 hours only: Selected Ayurvedic medicines',
    icon: 'clock',
    iconColor: '#E91E63',
    bgColor: '#FCE4EC',
    discount: 40,
    validUntil: '2024-11-20',
    categoryFocus: 'Medicines',
  },
];

interface B2BSpecialOffersGridProps {
  onOfferPress: (offer: B2BSpecialOffer) => void;
}

export default function B2BSpecialOffersGrid({ onOfferPress }: B2BSpecialOffersGridProps) {
  const isDark = useSelector(selectIsDark);

  const getIcon = (iconName: string, color: string) => {
    const iconProps = { size: 24, color };
    
    switch (iconName) {
      case 'package':
        return <Package {...iconProps} />;
      case 'gift':
        return <Gift {...iconProps} />;
      case 'trending-up':
        return <TrendingUp {...iconProps} />;
      case 'calendar':
        return <Calendar {...iconProps} />;
      case 'users':
        return <Users {...iconProps} />;
      case 'clock':
        return <Clock {...iconProps} />;
      default:
        return <Star {...iconProps} />;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', { 
      day: 'numeric', 
      month: 'short' 
    });
  };

  const renderFeaturedOffer = (offer: B2BSpecialOffer) => (
    <TouchableOpacity
      key={offer.id}
      style={[
        styles.featuredCard,
        { backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF' }
      ]}
      onPress={() => onOfferPress(offer)}
      activeOpacity={0.8}
    >
      <View style={styles.featuredHeader}>
        <View style={[styles.featuredIconContainer, { backgroundColor: offer.bgColor }]}>
          {getIcon(offer.icon, offer.iconColor)}
        </View>
        
        <View style={styles.featuredInfo}>
          <View style={styles.featuredTitleRow}>
            <Text variant="body" weight="bold" numberOfLines={1}>
              {offer.title}
            </Text>
            <View style={styles.discountBadge}>
              <Text variant="caption" style={styles.discountText}>
                {offer.discount}% OFF
              </Text>
            </View>
          </View>
          
          <Text variant="caption" color="secondary" numberOfLines={2} style={styles.featuredDescription}>
            {offer.description}
          </Text>
        </View>
      </View>
      
      <View style={styles.featuredFooter}>
        <View style={styles.categoryTag}>
          <Target size={12} color={offer.iconColor} />
          <Text variant="caption" style={[styles.categoryText, { color: offer.iconColor }]}>
            {offer.categoryFocus}
          </Text>
        </View>
        
        <View style={styles.validityContainer}>
          <Clock size={12} color="#666" />
          <Text variant="caption" color="secondary" style={styles.validityText}>
            Valid till {formatDate(offer.validUntil)}
          </Text>
        </View>
      </View>
      
      {offer.minOrder && (
        <View style={styles.moqContainer}>
          <Text variant="caption" style={styles.moqText}>
            Min order: {offer.minOrder} units
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );

  const renderRegularOffer = (offer: B2BSpecialOffer) => (
    <TouchableOpacity
      key={offer.id}
      style={[
        styles.regularCard,
        { backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF' }
      ]}
      onPress={() => onOfferPress(offer)}
      activeOpacity={0.8}
    >
      <View style={[styles.iconContainer, { backgroundColor: offer.bgColor }]}>
        {getIcon(offer.icon, offer.iconColor)}
      </View>
      
      <View style={styles.cardContent}>
        <View style={styles.titleRow}>
          <Text variant="body-sm" weight="bold" numberOfLines={1} style={styles.title}>
            {offer.title}
          </Text>
          <View style={styles.smallDiscountBadge}>
            <Percent size={10} color="#FFFFFF" />
            <Text variant="caption" style={styles.smallDiscountText}>
              {offer.discount}
            </Text>
          </View>
        </View>
        
        <Text variant="caption" color="secondary" numberOfLines={2} style={styles.description}>
          {offer.description}
        </Text>
        
        <View style={styles.cardFooter}>
          <Text variant="caption" style={[styles.category, { color: offer.iconColor }]}>
            {offer.categoryFocus}
          </Text>
          <Text variant="caption" color="secondary" style={styles.validity}>
            Till {formatDate(offer.validUntil)}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const featuredOffers = specialOffers.filter(offer => offer.featured);
  const regularOffers = specialOffers.filter(offer => !offer.featured);

  return (
    <View style={styles.container}>
      {/* Featured Offers */}
      {featuredOffers.length > 0 && (
        <View style={styles.section}>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.featuredContainer}
          >
            {featuredOffers.map(renderFeaturedOffer)}
          </ScrollView>
        </View>
      )}
      
      {/* Regular Offers Grid */}
      <View style={styles.gridContainer}>
        {regularOffers.map(renderRegularOffer)}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 8,
  },
  section: {
    marginBottom: 16,
  },
  featuredContainer: {
    paddingHorizontal: 16,
  },
  featuredCard: {
    width: 300,
    marginRight: 16,
    borderRadius: 12,
    padding: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  featuredHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  featuredIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  featuredInfo: {
    flex: 1,
  },
  featuredTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  discountBadge: {
    backgroundColor: '#E53935',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  discountText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: 'bold',
  },
  featuredDescription: {
    lineHeight: 16,
  },
  featuredFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
  },
  categoryText: {
    fontSize: 11,
    fontWeight: '500',
  },
  validityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  validityText: {
    fontSize: 11,
  },
  moqContainer: {
    backgroundColor: '#FFF3E0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  moqText: {
    fontSize: 10,
    color: '#F57C00',
    fontWeight: '500',
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    gap: 12,
  },
  regularCard: {
    width: '47%',
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
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  cardContent: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  title: {
    flex: 1,
    marginRight: 8,
  },
  smallDiscountBadge: {
    backgroundColor: '#E53935',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    gap: 2,
  },
  smallDiscountText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  description: {
    marginBottom: 8,
    lineHeight: 14,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  category: {
    fontSize: 10,
    fontWeight: '600',
  },
  validity: {
    fontSize: 10,
  },
}); 