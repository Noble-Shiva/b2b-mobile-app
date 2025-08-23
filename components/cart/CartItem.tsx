import { View, Image, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Minus, Plus, Trash2, TrendingUp, Target } from 'lucide-react-native';
import { formatPrice, calculateDiscountedPrice } from '@/utils/helpers';
import { Text, Button } from '@/components/ui';
import { colors } from '@/utils/theme';
import { useSelector } from 'react-redux';
import { selectIsDark } from '@/store/themeSlice';
import * as Haptics from 'expo-haptics';

interface CartItemProps {
  item: {
    id: string;
    name: string;
    price: number;
    originalPrice: number;
    image: string;
    quantity: number;
    discount?: number;
    weight?: string; // Add weight property for displaying product weight
    unit?: string; // Unit of measurement (e.g., g, kg, ml)
    supplier: string;
    tierPricing: {
      tier: number;
      minQuantity: number;
      price: number;
      savings: number;
    }[];
  };
  onRemove: (id: string) => void;
  onUpdateQuantity: (id: string, quantity: number) => void;
}

export default function CartItem({ item, onRemove, onUpdateQuantity }: CartItemProps) {
  const isDark = useSelector(selectIsDark);
  
  // Handle undefined or null price values
  const safePrice = typeof item.price === 'number' ? item.price : 0;
  const safeDiscount = typeof item.discount === 'number' ? item.discount : 0;
  
  const discountedPrice = calculateDiscountedPrice(safePrice, safeDiscount);
  const totalPrice = discountedPrice * item.quantity;
  
  // Calculate current tier and next tier
  const currentTier = item.tierPricing.find(tier => 
    item.quantity >= tier.minQuantity
  ) || item.tierPricing[0];

  const nextTier = item.tierPricing.find(tier => 
    tier.minQuantity > item.quantity
  );

  const currentSavings = (item.originalPrice - item.price) * item.quantity;
  const nextTierSavings = nextTier ? 
    ((item.originalPrice - nextTier.price) * nextTier.minQuantity) - currentSavings : 0;

  const handleDecrement = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onUpdateQuantity(item.id, item.quantity - 1);
  };

  const handleIncrement = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onUpdateQuantity(item.id, item.quantity + 1);
  };

  const handleRemove = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onRemove(item.id);
  };

  const handleUpgradeToTier = () => {
    if (nextTier) {
      Alert.alert(
        "Upgrade to Next Tier",
        `Upgrade to ${nextTier.minQuantity} units and save ₹${nextTierSavings.toFixed(0)} more?`,
        [
          { text: "Cancel", style: "cancel" },
          { 
            text: "Upgrade", 
            onPress: () => onUpdateQuantity(item.id, nextTier.minQuantity)
          }
        ]
      );
    }
  };

  return (
    <View style={[
      styles.container, 
      { 
        backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF',
        borderColor: isDark ? '#333333' : '#EEEEEE'
      }
    ]}>
      {/* Product Info Section */}
      <View style={styles.productSection}>
        <Image source={{ uri: item.image }} style={styles.productImage} />
        
        <View style={styles.productInfo}>
          <Text variant="body" weight="semibold" numberOfLines={2}>
            {item.name}
          </Text>
          <Text variant="caption" color="secondary">
            by {item.supplier}
          </Text>
          
          {/* Current Pricing */}
          <View style={styles.priceRow}>
            <Text variant="body" weight="bold" color="accent">
              {formatPrice(item.price)}/{item.unit}
            </Text>
            <Text variant="caption" style={styles.originalPrice}>
              {formatPrice(item.originalPrice)}/{item.unit}
            </Text>
          </View>
          
          {/* Total Pricing */}
          <View style={styles.totalPriceRow}>
            <Text variant="body-sm" color="secondary">Total: </Text>
            <Text variant="body-sm" weight="bold" color="accent">
              {formatPrice(item.price * item.quantity)}
            </Text>
            <Text variant="caption" style={styles.totalOriginalPrice}>
              {formatPrice(item.originalPrice * item.quantity)}
            </Text>
            <Text variant="caption" color="success" weight="medium">
              (Save ₹{((item.originalPrice - item.price) * item.quantity).toFixed(0)})
            </Text>
          </View>
        </View>
      </View>

      {/* Next Tier Upgrade Card */}
      {nextTier && (
        <View style={[
          styles.tierCard,
          { 
            backgroundColor: isDark ? '#0D4A2D' : '#E8F5E8',
            borderColor: isDark ? '#16A249' : '#4CAF50'
          }
        ]}>
          <View style={styles.tierHeader}>
            <Target size={16} color="#4CAF50" />
            <Text variant="caption" weight="bold" color="#4CAF50">
              NEXT TIER: Order {nextTier.minQuantity}+ units
            </Text>
            <View style={styles.hotDealBadge}>
              <Text variant="caption" weight="bold" style={styles.hotDealText}>
                🔥 HOT DEAL
              </Text>
            </View>
          </View>
          
          <View style={styles.tierContent}>
            <Text variant="body-sm" weight="semibold">
              {formatPrice(nextTier.price)}/{item.unit} • Save ₹{nextTierSavings.toFixed(0)} more!
            </Text>
            
            <Button
              variant="secondary"
              size="sm"
              style={[styles.upgradeButton, { borderColor: '#4CAF50' }]}
              onPress={handleUpgradeToTier}
              rightIcon={<TrendingUp size={14} color="#4CAF50" />}
            >
              <Text variant="caption" weight="bold" style={{ color: '#4CAF50' }}>
                Upgrade to {nextTier.minQuantity} units
              </Text>
            </Button>
          </View>
          
          {/* Progress Bar */}
          <View style={styles.progressContainer}>
            <View style={[
              styles.progressBar,
              { backgroundColor: isDark ? '#333333' : '#DDDDDD' }
            ]}>
              <View style={[
                styles.progressFill,
                { 
                  width: `${(item.quantity / nextTier.minQuantity) * 100}%`,
                  backgroundColor: '#4CAF50'
                }
              ]} />
            </View>
            <Text variant="caption" color="secondary">
              {item.quantity}/{nextTier.minQuantity} units
            </Text>
          </View>
        </View>
      )}

      {/* Quantity Controls */}
      <View style={styles.quantitySection}>
        <View style={styles.quantityControls}>
          <TouchableOpacity
            style={[
              styles.quantityButton,
              { 
                backgroundColor: isDark ? '#333333' : '#F5F5F5',
                borderColor: isDark ? '#555555' : '#DDDDDD'
              }
            ]}
            onPress={handleDecrement}
          >
            <Minus size={16} color={isDark ? '#FFFFFF' : '#666666'} />
          </TouchableOpacity>
          
          <View style={[
            styles.quantityDisplay,
            { 
              backgroundColor: isDark ? '#2A2A2A' : '#FFFFFF',
              borderColor: isDark ? '#555555' : '#DDDDDD'
            }
          ]}>
            <Text variant="body" weight="semibold">{item.quantity}</Text>
          </View>
          
          <TouchableOpacity
            style={[
              styles.quantityButton,
              { 
                backgroundColor: isDark ? '#333333' : '#F5F5F5',
                borderColor: isDark ? '#555555' : '#DDDDDD'
              }
            ]}
            onPress={handleIncrement}
          >
            <Plus size={16} color={isDark ? '#FFFFFF' : '#666666'} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.removeButton}
          onPress={handleRemove}
        >
          <Trash2 size={18} color="#FF4444" />
          <Text variant="caption" color="#FF4444" weight="medium">
            Remove
          </Text>
        </TouchableOpacity>
      </View>

      {/* Total for this item */}
      <View style={styles.itemTotal}>
        <Text variant="body-sm" color="secondary">
          Item Total: 
        </Text>
        <Text variant="body" weight="bold">
          {formatPrice(item.price * item.quantity)}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  productSection: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  productImage: {
    width: 64,
    height: 64,
    borderRadius: 8,
    marginRight: 12,
  },
  productInfo: {
    flex: 1,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    flexWrap: 'wrap',
  },
  originalPrice: {
    textDecorationLine: 'line-through',
    marginLeft: 8,
    color: '#999999',
  },
  totalPriceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
    flexWrap: 'wrap',
  },
  totalOriginalPrice: {
    textDecorationLine: 'line-through',
    marginLeft: 8,
    color: '#999999',
  },
  tierCard: {
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 12,
  },
  tierHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  hotDealBadge: {
    backgroundColor: '#FF6B35',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginLeft: 'auto',
  },
  hotDealText: {
    color: '#FFFFFF',
    fontSize: 10,
  },
  tierContent: {
    marginBottom: 8,
  },
  upgradeButton: {
    marginTop: 6,
    backgroundColor: 'transparent',
  },
  progressContainer: {
    marginTop: 8,
  },
  progressBar: {
    height: 4,
    borderRadius: 2,
    marginBottom: 4,
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  quantitySection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityButton: {
    width: 32,
    height: 32,
    borderRadius: 6,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityDisplay: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 1,
    borderRadius: 6,
    marginHorizontal: 8,
    minWidth: 60,
    alignItems: 'center',
  },
  removeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  itemTotal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
  },
});