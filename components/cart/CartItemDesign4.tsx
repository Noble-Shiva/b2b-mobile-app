import { useState, useEffect } from 'react';
import { View, StyleSheet, Image, TouchableOpacity, Animated, Dimensions } from 'react-native';
import { Trash2, Plus, Minus, Zap, Crown, Star, TrendingUp, Target, Clock, Award } from 'lucide-react-native';
import { Text, Button } from '@/components/ui';
import { formatPrice } from '@/utils/helpers';
import { useSelector } from 'react-redux';
import { selectIsDark } from '@/store/themeSlice';

const { width } = Dimensions.get('window');

interface CartItemProps {
  item: {
    id: string;
    name: string;
    price: number;
    originalPrice: number;
    quantity: number;
    image: string;
    supplier: string;
    unit: string;
    tierPricing: {
      tier: number;
      minQuantity: number;
      price: number;
      savings: number;
    }[];
    category?: string;
    rating?: number;
    deliveryTime?: string;
  };
  onRemove: (id: string) => void;
  onUpdateQuantity: (id: string, quantity: number) => void;
}

export default function CartItemDesign4({ item, onRemove, onUpdateQuantity }: CartItemProps) {
  const isDark = useSelector(selectIsDark);
  const [isExpanded, setIsExpanded] = useState(false);
  const [pulseAnim] = useState(new Animated.Value(1));
  const [slideAnim] = useState(new Animated.Value(0));
  const [scaleAnim] = useState(new Animated.Value(1));

  useEffect(() => {
    // Pulse animation for savings indicator
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Slide in animation for tier cards
    Animated.timing(slideAnim, {
      toValue: isExpanded ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [isExpanded]);

  const currentTier = item.tierPricing.find(tier => 
    item.quantity >= tier.minQuantity
  ) || item.tierPricing[0];

  const nextTier = item.tierPricing.find(tier => 
    tier.minQuantity > item.quantity
  );

  const totalSavings = (item.originalPrice - item.price) * item.quantity;
  const savingsPercentage = ((item.originalPrice - item.price) / item.originalPrice) * 100;
  const progressToNextTier = nextTier ? (item.quantity / nextTier.minQuantity) * 100 : 100;

  const handleQuantityChange = (delta: number) => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1.1,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    onUpdateQuantity(item.id, Math.max(1, item.quantity + delta));
  };

  return (
    <View style={[
      styles.container,
      {
        backgroundColor: isDark ? '#1A1A2E' : '#FFFFFF',
        borderColor: isDark ? '#16213E' : '#E0E7FF',
      }
    ]}>
      {/* Floating Header Card */}
      <View style={[
        styles.floatingHeader,
        {
          backgroundColor: isDark ? '#0F3460' : '#EEF2FF',
          shadowColor: isDark ? '#4F46E5' : '#6366F1',
        }
      ]}>
        <View style={styles.headerLeft}>
          <View style={[
            styles.categoryBadge,
            { backgroundColor: isDark ? '#7C3AED' : '#8B5CF6' }
          ]}>
            <Award size={12} color="#FFFFFF" />
            <Text variant="caption" weight="bold" style={styles.categoryText}>
              {item.category || 'Premium'}
            </Text>
          </View>
          
          <View style={styles.ratingContainer}>
            <Star size={12} color="#FFD700" fill="#FFD700" />
            <Text variant="caption" weight="semibold" style={{ color: '#FFD700' }}>
              {item.rating || 4.8}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.removeFloating}
          onPress={() => onRemove(item.id)}
        >
          <Trash2 size={16} color="#EF4444" />
        </TouchableOpacity>
      </View>

      {/* Main Content Card */}
      <View style={styles.mainContent}>
        {/* Product Showcase */}
        <View style={styles.productShowcase}>
          <View style={[
            styles.imageContainer,
            { borderColor: isDark ? '#4F46E5' : '#8B5CF6' }
          ]}>
            <Image source={{ uri: item.image }} style={styles.productImage} />
            <View style={[
              styles.tierBadge,
              { backgroundColor: isDark ? '#059669' : '#10B981' }
            ]}>
              <Crown size={10} color="#FFFFFF" />
              <Text variant="caption" weight="bold" style={styles.tierText}>
                T{currentTier.tier}
              </Text>
            </View>
          </View>

          <View style={styles.productDetails}>
            <Text variant="body" weight="bold" numberOfLines={2} style={styles.productName}>
              {item.name}
            </Text>
            
            <View style={styles.supplierRow}>
              <Text variant="caption" color="secondary">by </Text>
              <Text variant="caption" weight="semibold" style={{ color: '#8B5CF6' }}>
                {item.supplier}
              </Text>
              <View style={styles.verifiedBadge}>
                <Text variant="caption" weight="bold" style={styles.verifiedText}>
                  ✓ VERIFIED
                </Text>
              </View>
            </View>

            <View style={styles.deliveryInfo}>
              <Clock size={12} color="#059669" />
              <Text variant="caption" color="success" weight="medium">
                {item.deliveryTime || '2-3 days delivery'}
              </Text>
            </View>
          </View>
        </View>

        {/* Revolutionary Pricing Dashboard */}
        <View style={styles.pricingDashboard}>
          {/* Unit Price Card */}
          <View style={[
            styles.priceCard,
            {
              backgroundColor: isDark ? '#1E293B' : '#F8FAFC',
              borderColor: isDark ? '#334155' : '#E2E8F0',
            }
          ]}>
            <Text variant="caption" color="secondary" style={styles.priceLabel}>
              UNIT PRICE
            </Text>
            <View style={styles.priceValues}>
              <Text variant="h4" weight="bold" color="accent">
                {formatPrice(item.price)}
              </Text>
              <Text variant="caption" style={styles.unitOriginalPrice}>
                {formatPrice(item.originalPrice)}
              </Text>
            </View>
            <Text variant="caption" color="secondary">
              per {item.unit}
            </Text>
          </View>

          {/* Total Price Card */}
          <View style={[
            styles.priceCard,
            styles.totalPriceCard,
            {
              backgroundColor: isDark ? '#0F172A' : '#F1F5F9',
              borderColor: isDark ? '#1E293B' : '#CBD5E1',
            }
          ]}>
            <Text variant="caption" color="secondary" style={styles.priceLabel}>
              TOTAL AMOUNT
            </Text>
            <View style={styles.priceValues}>
              <Text variant="h3" weight="bold" color="accent">
                {formatPrice(item.price * item.quantity)}
              </Text>
              <Text variant="body-sm" style={styles.totalOriginalPrice}>
                {formatPrice(item.originalPrice * item.quantity)}
              </Text>
            </View>
            <Animated.View 
              style={[
                styles.savingsIndicator,
                { 
                  transform: [{ scale: pulseAnim }],
                  backgroundColor: '#10B981'
                }
              ]}
            >
              <Zap size={10} color="#FFFFFF" />
              <Text variant="caption" weight="bold" style={styles.savingsText}>
                Save ₹{totalSavings.toFixed(0)} ({savingsPercentage.toFixed(0)}% OFF)
              </Text>
            </Animated.View>
          </View>
        </View>

        {/* Circular Progress Quantity Selector */}
        <View style={styles.quantitySection}>
          <View style={styles.quantityLeft}>
            <Text variant="body-sm" weight="semibold" style={styles.quantityLabel}>
              Quantity
            </Text>
            {nextTier && (
              <View style={styles.progressContainer}>
                <View style={[
                  styles.progressTrack,
                  { backgroundColor: isDark ? '#374151' : '#E5E7EB' }
                ]}>
                  <View style={[
                    styles.progressFill,
                    { 
                      width: `${Math.min(progressToNextTier, 100)}%`,
                      backgroundColor: '#8B5CF6'
                    }
                  ]} />
                </View>
                <Text variant="caption" color="secondary">
                  {Math.min(progressToNextTier, 100).toFixed(0)}% to Tier {nextTier.tier}
                </Text>
              </View>
            )}
          </View>

          <View style={styles.quantityControls}>
            <TouchableOpacity
              style={[
                styles.quantityBtn,
                { 
                  backgroundColor: isDark ? '#374151' : '#F3F4F6',
                  borderColor: isDark ? '#4B5563' : '#D1D5DB'
                }
              ]}
              onPress={() => handleQuantityChange(-1)}
            >
              <Minus size={18} color={isDark ? '#F3F4F6' : '#374151'} />
            </TouchableOpacity>

            <Animated.View 
              style={[
                styles.quantityDisplay,
                {
                  backgroundColor: isDark ? '#4F46E5' : '#8B5CF6',
                  transform: [{ scale: scaleAnim }]
                }
              ]}
            >
              <Text variant="h4" weight="bold" style={styles.quantityText}>
                {item.quantity}
              </Text>
            </Animated.View>

            <TouchableOpacity
              style={[
                styles.quantityBtn,
                { 
                  backgroundColor: isDark ? '#374151' : '#F3F4F6',
                  borderColor: isDark ? '#4B5563' : '#D1D5DB'
                }
              ]}
              onPress={() => handleQuantityChange(1)}
            >
              <Plus size={18} color={isDark ? '#F3F4F6' : '#374151'} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Tier Upgrade Portal */}
        {nextTier && (
          <TouchableOpacity
            style={[
              styles.tierPortal,
              {
                backgroundColor: isDark ? '#1E1B4B' : '#EEF2FF',
                borderColor: isDark ? '#3730A3' : '#8B5CF6',
              }
            ]}
            onPress={() => setIsExpanded(!isExpanded)}
          >
            <View style={styles.portalContent}>
              <View style={styles.portalIcon}>
                <Target size={16} color="#8B5CF6" />
              </View>
              
              <View style={styles.portalText}>
                <Text variant="body-sm" weight="bold" style={{ color: '#8B5CF6' }}>
                  Unlock Tier {nextTier.tier} Pricing
                </Text>
                <Text variant="caption" color="secondary">
                  Add {nextTier.minQuantity - item.quantity} more for {formatPrice(nextTier.price)}/{item.unit}
                </Text>
              </View>

              <View style={[
                styles.portalButton,
                { backgroundColor: '#8B5CF6' }
              ]}>
                <TrendingUp size={14} color="#FFFFFF" />
                <Text variant="caption" weight="bold" style={styles.portalButtonText}>
                  UPGRADE
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        )}

        {/* Animated Tier Details */}
        {isExpanded && nextTier && (
          <Animated.View
            style={[
              styles.tierDetails,
              {
                backgroundColor: isDark ? '#0F172A' : '#F8FAFC',
                borderColor: isDark ? '#1E293B' : '#E2E8F0',
                transform: [{ translateY: slideAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [-20, 0]
                }) }],
                opacity: slideAnim
              }
            ]}
          >
            <View style={styles.tierComparison}>
              <View style={[
                styles.tierOption,
                { backgroundColor: isDark ? '#1E293B' : '#FFFFFF' }
              ]}>
                <Text variant="caption" weight="bold" color="secondary">
                  CURRENT
                </Text>
                <Text variant="body" weight="bold">
                  {formatPrice(item.price * item.quantity)}
                </Text>
                <Text variant="caption" color="secondary">
                  {item.quantity} units
                </Text>
              </View>

              <View style={styles.arrowContainer}>
                <View style={[
                  styles.arrow,
                  { backgroundColor: '#8B5CF6' }
                ]}>
                  <TrendingUp size={12} color="#FFFFFF" />
                </View>
              </View>

              <View style={[
                styles.tierOption,
                styles.tierOptionHighlight,
                { 
                  backgroundColor: isDark ? '#1E1B4B' : '#EEF2FF',
                  borderColor: '#8B5CF6'
                }
              ]}>
                <Text variant="caption" weight="bold" style={{ color: '#8B5CF6' }}>
                  TIER {nextTier.tier}
                </Text>
                <Text variant="body" weight="bold" style={{ color: '#8B5CF6' }}>
                  {formatPrice(nextTier.price * nextTier.minQuantity)}
                </Text>
                <Text variant="caption" color="secondary">
                  {nextTier.minQuantity} units
                </Text>
              </View>
            </View>

            <Button
              variant="primary"
              style={[
                styles.upgradeButton,
                { backgroundColor: '#8B5CF6' }
              ]}
              onPress={() => onUpdateQuantity(item.id, nextTier.minQuantity)}
            >
              <Text variant="body-sm" weight="bold" style={{ color: '#FFFFFF' }}>
                Upgrade to {nextTier.minQuantity} units & Save ₹{((item.price - nextTier.price) * nextTier.minQuantity).toFixed(0)}
              </Text>
            </Button>
          </Animated.View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
    borderRadius: 20,
    borderWidth: 2,
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 12,
    overflow: 'hidden',
  },
  floatingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  categoryText: {
    color: '#FFFFFF',
    fontSize: 10,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  removeFloating: {
    padding: 8,
    borderRadius: 12,
    backgroundColor: '#FEE2E2',
  },
  mainContent: {
    padding: 16,
  },
  productShowcase: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  imageContainer: {
    position: 'relative',
    marginRight: 12,
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 16,
    borderWidth: 3,
  },
  tierBadge: {
    position: 'absolute',
    top: -6,
    right: -6,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    gap: 2,
  },
  tierText: {
    color: '#FFFFFF',
    fontSize: 10,
  },
  productDetails: {
    flex: 1,
    justifyContent: 'space-between',
  },
  productName: {
    marginBottom: 4,
  },
  supplierRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  verifiedBadge: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 4,
    marginLeft: 6,
  },
  verifiedText: {
    color: '#166534',
    fontSize: 8,
  },
  deliveryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  pricingDashboard: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  priceCard: {
    flex: 1,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
  },
  totalPriceCard: {
    flex: 1.2,
  },
  priceLabel: {
    fontSize: 10,
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  priceValues: {
    alignItems: 'center',
    marginBottom: 4,
  },
  unitOriginalPrice: {
    textDecorationLine: 'line-through',
    color: '#9CA3AF',
    fontSize: 12,
  },
  totalOriginalPrice: {
    textDecorationLine: 'line-through',
    color: '#9CA3AF',
    fontSize: 14,
  },
  savingsIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
  },
  savingsText: {
    color: '#FFFFFF',
    fontSize: 10,
  },
  quantitySection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  quantityLeft: {
    flex: 1,
  },
  quantityLabel: {
    marginBottom: 4,
  },
  progressContainer: {
    marginTop: 4,
  },
  progressTrack: {
    height: 4,
    borderRadius: 2,
    marginBottom: 2,
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  quantityBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityDisplay: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityText: {
    color: '#FFFFFF',
  },
  tierPortal: {
    borderRadius: 16,
    borderWidth: 2,
    padding: 16,
    marginBottom: 12,
  },
  portalContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  portalIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  portalText: {
    flex: 1,
  },
  portalButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 4,
  },
  portalButtonText: {
    color: '#FFFFFF',
    fontSize: 10,
  },
  tierDetails: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
  },
  tierComparison: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 12,
  },
  tierOption: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  tierOptionHighlight: {
    borderWidth: 2,
  },
  arrowContainer: {
    alignItems: 'center',
  },
  arrow: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  upgradeButton: {
    borderRadius: 12,
    paddingVertical: 12,
  },
}); 