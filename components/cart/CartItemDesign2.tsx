import { View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Trash2, Plus, Minus } from 'lucide-react-native';
import { Text, Button } from '@/components/ui';
import { formatPrice } from '@/utils/helpers';
import { useSelector } from 'react-redux';
import { selectIsDark } from '@/store/themeSlice';

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
  };
  onRemove: (id: string) => void;
  onUpdateQuantity: (id: string, quantity: number) => void;
}

export default function CartItemDesign2({ item, onRemove, onUpdateQuantity }: CartItemProps) {
  const isDark = useSelector(selectIsDark);

  // Calculate current tier and next tier
  const currentTier = item.tierPricing.find(tier => 
    item.quantity >= tier.minQuantity
  ) || item.tierPricing[0];

  const nextTier = item.tierPricing.find(tier => 
    tier.minQuantity > item.quantity
  );

  const currentSavingsPercentage = ((item.originalPrice - item.price) / item.originalPrice) * 100;
  const nextTierSavingsPercentage = nextTier ? 
    ((item.originalPrice - nextTier.price) / item.originalPrice) * 100 : 0;

  const handleQuickAdd = (amount: number) => {
    onUpdateQuantity(item.id, item.quantity + amount);
  };

  return (
    <View style={[
      styles.container, 
      { 
        backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF',
        borderColor: isDark ? '#333333' : '#EEEEEE'
      }
    ]}>
      {/* Main Product Section */}
      <View style={styles.productSection}>
        <Image source={{ uri: item.image }} style={styles.productImage} />
        
        <View style={styles.productInfo}>
          <Text variant="body" weight="semibold" numberOfLines={2}>
            {item.name}
          </Text>
          <Text variant="caption" color="secondary">
            by {item.supplier}
          </Text>
          
          {/* Pricing Row */}
          <View style={styles.priceRow}>
            <Text variant="body" weight="bold" color="accent">
              {formatPrice(item.price)}/{item.unit}
            </Text>
            <Text variant="caption" style={styles.originalPrice}>
              was {formatPrice(item.originalPrice)}/{item.unit}
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

      {/* Tier Comparison Ribbon */}
      {nextTier && (
        <View style={[
          styles.tierRibbon,
          { 
            backgroundColor: isDark ? '#1A1A1A' : '#F8F8F8',
            borderColor: isDark ? '#333333' : '#DDDDDD'
          }
        ]}>
          <View style={styles.tierComparison}>
            {/* Current Tier */}
            <View style={[
              styles.tierSection,
              { 
                backgroundColor: isDark ? '#2A2A2A' : '#FFFFFF',
                borderColor: isDark ? '#444444' : '#CCCCCC'
              }
            ]}>
              <Text variant="caption" weight="bold" color="accent">
                NOW
              </Text>
              <Text variant="body-sm" weight="semibold">
                {formatPrice(item.price)}
              </Text>
              <View style={styles.savingsPercentageBadge}>
                <Text variant="caption" weight="bold" style={styles.savingsPercentageText}>
                  {currentSavingsPercentage.toFixed(0)}% OFF
                </Text>
              </View>
            </View>

            {/* Next Tier */}
            <View style={[
              styles.tierSection,
              { 
                backgroundColor: isDark ? '#0D3818' : '#E8F5E8',
                borderColor: '#4CAF50'
              }
            ]}>
              <Text variant="caption" weight="bold" color="#4CAF50">
                NEXT TIER ({nextTier.minQuantity}+ units)
              </Text>
              <Text variant="body-sm" weight="semibold">
                {formatPrice(nextTier.price)}
              </Text>
              <View style={[styles.savingsPercentageBadge, { backgroundColor: '#4CAF50' }]}>
                <Text variant="caption" weight="bold" style={styles.savingsPercentageText}>
                  💰 Save {(nextTierSavingsPercentage - currentSavingsPercentage).toFixed(0)}% more
                </Text>
              </View>
              
              {/* Quick upgrade button */}
              <TouchableOpacity
                style={styles.quickUpgradeButton}
                onPress={() => onUpdateQuantity(item.id, nextTier.minQuantity)}
              >
                <Text variant="caption" weight="bold" style={{ color: '#4CAF50' }}>
                  +{nextTier.minQuantity - item.quantity} units
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}

      {/* Quantity Controls with Quick Add */}
      <View style={styles.quantitySection}>
        <View style={styles.quantityControls}>
          <Text variant="caption" color="secondary" style={styles.quantityLabel}>
            Quantity:
          </Text>
          
          <View style={styles.quantityInputGroup}>
            <TouchableOpacity
              style={[
                styles.quantityButton,
                { 
                  backgroundColor: isDark ? '#333333' : '#F5F5F5',
                  borderColor: isDark ? '#555555' : '#DDDDDD'
                }
              ]}
              onPress={() => onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))}
            >
              <Minus size={14} color={isDark ? '#FFFFFF' : '#666666'} />
            </TouchableOpacity>
            
            <View style={[
              styles.quantityDisplay,
              { 
                backgroundColor: isDark ? '#2A2A2A' : '#FFFFFF',
                borderColor: isDark ? '#555555' : '#DDDDDD'
              }
            ]}>
              <Text variant="body-sm" weight="semibold">{item.quantity}</Text>
            </View>
            
            <TouchableOpacity
              style={[
                styles.quantityButton,
                { 
                  backgroundColor: isDark ? '#333333' : '#F5F5F5',
                  borderColor: isDark ? '#555555' : '#DDDDDD'
                }
              ]}
              onPress={() => onUpdateQuantity(item.id, item.quantity + 1)}
            >
              <Plus size={14} color={isDark ? '#FFFFFF' : '#666666'} />
            </TouchableOpacity>
          </View>

          {/* Quick Add Buttons */}
          <View style={styles.quickAddGroup}>
            <TouchableOpacity
              style={[styles.quickAddButton, { borderColor: '#4CAF50' }]}
              onPress={() => handleQuickAdd(10)}
            >
              <Text variant="caption" weight="medium" style={{ color: '#4CAF50' }}>
                +10
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.quickAddButton, { borderColor: '#4CAF50' }]}
              onPress={() => handleQuickAdd(25)}
            >
              <Text variant="caption" weight="medium" style={{ color: '#4CAF50' }}>
                +25
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.quickAddButton, { borderColor: '#4CAF50' }]}
              onPress={() => handleQuickAdd(50)}
            >
              <Text variant="caption" weight="medium" style={{ color: '#4CAF50' }}>
                +50
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity
          style={styles.removeButton}
          onPress={() => onRemove(item.id)}
        >
          <Trash2 size={16} color="#FF4444" />
        </TouchableOpacity>
      </View>

      {/* Item Total */}
      <View style={[
        styles.itemTotal,
        { borderTopColor: isDark ? '#333333' : '#EEEEEE' }
      ]}>
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
    marginBottom: 12,
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  productSection: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  productImage: {
    width: 56,
    height: 56,
    borderRadius: 6,
    marginRight: 12,
  },
  productInfo: {
    flex: 1,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
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
  tierRibbon: {
    borderRadius: 6,
    borderWidth: 1,
    marginBottom: 12,
    overflow: 'hidden',
  },
  tierComparison: {
    flexDirection: 'row',
  },
  tierSection: {
    flex: 1,
    padding: 8,
    borderWidth: 1,
    alignItems: 'center',
  },
  savingsPercentageBadge: {
    backgroundColor: '#FF6B35',
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 3,
    marginTop: 2,
  },
  savingsPercentageText: {
    color: '#FFFFFF',
    fontSize: 9,
  },
  quickUpgradeButton: {
    marginTop: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#4CAF50',
  },
  quantitySection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  quantityControls: {
    flex: 1,
  },
  quantityLabel: {
    marginBottom: 4,
  },
  quantityInputGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  quantityButton: {
    width: 28,
    height: 28,
    borderRadius: 4,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityDisplay: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderRadius: 4,
    marginHorizontal: 6,
    minWidth: 50,
    alignItems: 'center',
  },
  quickAddGroup: {
    flexDirection: 'row',
    gap: 6,
  },
  quickAddButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    borderWidth: 1,
    backgroundColor: 'transparent',
  },
  removeButton: {
    padding: 8,
  },
  itemTotal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: 1,
  },
}); 