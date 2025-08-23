import React, { useState } from 'react';
import { View, StyleSheet, Image, TouchableOpacity, TextInput } from 'react-native';
import { Trash2, Plus, Minus, ChevronDown, ChevronUp, Calculator, CircleX } from 'lucide-react-native';
import { Text, Button } from '@/components/ui';
import { formatPrice } from '@/utils/helpers';
import { useSelector } from 'react-redux';
import { selectIsDark } from '@/store/themeSlice';
import { colors } from '@/utils/theme';

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
    relatedProducts?: {
      name: string;
      price: number;
    }[];
  };
  onRemove: (id: string) => void;
  onUpdateQuantity: (id: string, quantity: number) => void;
}

export default function CartItemDesign3({ item, onRemove, onUpdateQuantity }: CartItemProps) {
  const isDark = useSelector(selectIsDark);
  const [isExpanded, setIsExpanded] = useState(false);
  const [calculatorQuantity, setCalculatorQuantity] = useState(item.quantity.toString());

  const currentSavings = (item.originalPrice - item.price) * item.quantity;

  const calculateTotalPrice = (quantity: number, tiers: typeof item.tierPricing) => {
    const applicableTier = tiers.find(tier => quantity >= tier.minQuantity) || tiers[0];
    return applicableTier.price * quantity;
  };

  const handleCalculatorUpdate = () => {
    const newQuantity = parseInt(calculatorQuantity);
    if (!isNaN(newQuantity) && newQuantity > 0) {
      onUpdateQuantity(item.id, newQuantity);
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
      {/* Single Line Product Section */}
      <View style={styles.productSection}>
        {/* Product Image */}
        <Image source={{ uri: item.image }} style={styles.productImage} />
        
        {/* Product Info */}
        <View style={styles.productInfo}>
          <Text weight="semibold" numberOfLines={2} style={{ fontSize: 16 }}>
            {item.name}
          </Text>
          {/* <Text variant="caption" color="secondary">
            by {item.supplier}
          </Text> */}
          <View style={styles.priceContainer}>
            {item.originalPrice > item.price ? (
              <View style={styles.priceColumn}>
                <View style={styles.mrpRow}>
                  <Text variant="body-sm" color="secondary" style={styles.mrpLabel}>
                    MRP
                  </Text>
                  <Text variant="body-sm" color="tertiary" style={styles.originalPrice}>
                    {formatPrice(item.originalPrice)}
                  </Text>
                </View>
                  <View style={styles.saleRow}>
                   <Text variant="body" weight="bold" style={{ ...styles.salePrice, color: colors.primary[700] }}>
                     {formatPrice(item.price)}
                   </Text>
                   <Text
                     variant="body-sm"
                     weight="bold"
                     style={{
                       ...styles.discountBadge,
                       color: colors.primary[900],
                       backgroundColor: colors.primary[100],
                     }}
                   >
                     {Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100)}% OFF
                   </Text>
                 </View>
               </View>
             ) : (
               <View style={styles.saleRow}>
                 <Text variant="body" weight="bold" style={{ ...styles.salePrice, color: colors.primary[700] }}>
                   {formatPrice(item.price)}
                 </Text>
              </View>
            )}
            {/* Quantity Controls */}
            <View style={styles.quantityContainer}>
              <TouchableOpacity
                style={styles.quantityButton}
                onPress={() => onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))}
              >
                <Minus size={14} color="#FFFFFF" />
              </TouchableOpacity>
              
              <Text variant="body-sm" weight="semibold" style={styles.quantityText}>
                {item.quantity}
              </Text>
              
              <TouchableOpacity
                style={styles.quantityButton}
                onPress={() => onUpdateQuantity(item.id, item.quantity + 1)}
              >
                <Plus size={14} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </View>

        </View>
      </View>

      {/* Remove Button - Positioned at top right of card */}
      <TouchableOpacity
        style={styles.removeButton}
        onPress={() => onRemove(item.id)}
      >
        <CircleX size={24} color="#FF4444" />
      </TouchableOpacity>

      {/* Expandable Tier Section */}
      <TouchableOpacity
        style={[
          styles.expandableHeader,
          { 
            backgroundColor: isDark ? '#2A2A2A' : '#F8F8F8',
            borderColor: isDark ? '#444444' : '#DDDDDD'
          }
        ]}
        onPress={() => setIsExpanded(!isExpanded)}
      >
        <Text variant="body" weight="medium" color="accent">
          {isExpanded ? '▼' : '▶'} View Tier Pricing & Save More
        </Text>
        {isExpanded ? (
          <ChevronUp size={16} color={isDark ? '#FFFFFF' : '#666666'} />
        ) : (
          <ChevronDown size={16} color={isDark ? '#FFFFFF' : '#666666'} />
        )}
      </TouchableOpacity>

      {/* Expanded Tier Details */}
      {isExpanded && (
        <View style={[
          styles.expandedContent,
          { 
            backgroundColor: isDark ? '#1A1A1A' : '#FAFAFA',
            borderColor: isDark ? '#333333' : '#EEEEEE'
          }
        ]}>
          {/* Tier Breakdown */}
          <View style={styles.tierBreakdown}>
            <Text variant="body" weight="semibold" style={styles.sectionTitle}>
              Pricing Tiers
            </Text>
            
            {item.tierPricing.map((tier, index) => {
              const isCurrentTier = item.quantity >= tier.minQuantity;
              const tierSavings = (item.originalPrice - tier.price) * tier.minQuantity;
              
              return (
                <View
                  key={tier.tier}
                  style={[
                    styles.tierRow,
                    { 
                      backgroundColor: isCurrentTier 
                        ? (isDark ? '#0D3818' : '#E8F5E8')
                        : (isDark ? '#2A2A2A' : '#FFFFFF'),
                      borderColor: isCurrentTier ? '#4CAF50' : (isDark ? '#444444' : '#DDDDDD')
                    }
                  ]}
                >
                  <View style={styles.tierInfo}>
                    <Text variant="body" weight="semibold">
                      Tier {tier.tier}: {tier.minQuantity}+ units
                      {isCurrentTier && ' (current)'}
                    </Text>
                    <Text variant="body-sm" weight="bold">
                      {formatPrice(tier.price)}/{item.unit}
                    </Text>
                  </View>
                  
                  <View style={styles.tierSavings}>
                    <View style={[
                      styles.savingsChip,
                      { backgroundColor: isCurrentTier ? '#4CAF50' : '#FF6B35' }
                    ]}>
                      <Text variant="body" weight="bold" style={styles.savingsChipText}>
                        💰 ₹{tierSavings.toFixed(0)}
                      </Text>
                    </View>
                  </View>
                </View>
              );
            })}
          </View>

          {/* Bulk Calculator */}
          <View style={styles.calculatorSection}>
            <View style={styles.calculatorHeader}>
              <Calculator size={20} color="#4CAF50" />
              <Text variant="body" weight="semibold" style={styles.sectionTitle}>
                Bulk Calculator
              </Text>
            </View>
            
            <View style={styles.calculatorRow}>
              <View style={styles.calculatorInput}>
                <TextInput
                  style={[
                    styles.input,
                    { 
                      backgroundColor: isDark ? '#2A2A2A' : '#FFFFFF',
                      borderColor: isDark ? '#555555' : '#DDDDDD',
                      color: isDark ? '#FFFFFF' : '#000000'
                    }
                  ]}
                  value={calculatorQuantity}
                  onChangeText={setCalculatorQuantity}
                  keyboardType="numeric"
                  placeholder="Enter quantity"
                  placeholderTextColor={isDark ? '#999999' : '#666666'}
                />
                <Text variant="body" color="secondary">units</Text>
              </View>
              
              <Text variant="body-sm" weight="medium">=</Text>
              
              <View style={styles.calculatorResult}>
                <Text variant="h4" weight="bold" color="accent">
                  {formatPrice(calculateTotalPrice(parseInt(calculatorQuantity) || 0, item.tierPricing))}
                </Text>
              </View>
              
              <Button
                variant="secondary"
                size="medium"
                style={styles.applyButton}
                onPress={handleCalculatorUpdate}
              >
                <Text variant="body-sm" weight="bold" color="accent">Apply</Text>
              </Button>
            </View>
          </View>

          {/* Related Products */}
          {item.relatedProducts && item.relatedProducts.length > 0 && (
            <View style={styles.relatedSection}>
              <Text variant="body" weight="semibold" style={styles.sectionTitle}>
                Related Products
              </Text>
              
              {item.relatedProducts.slice(0, 2).map((product, index) => (
                <View key={index} style={styles.relatedItem}>
                  <Text variant="body" numberOfLines={1} style={styles.relatedName}>
                    {product.name}
                  </Text>
                  <Text variant="body" weight="medium">
                    {formatPrice(product.price)}
                  </Text>
                  <TouchableOpacity style={styles.addRelatedButton}>
                    <Plus size={12} color="#4CAF50" />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}
        </View>
      )}

      

      {/* Item Total */}
      <View style={[
        styles.itemTotal,
        { borderTopColor: isDark ? '#333333' : '#EEEEEE' }
      ]}>
        <Text variant="h4" color="secondary">
          Item Total:
        </Text>
        <Text variant="h4" weight="bold">
          {formatPrice(item.price * item.quantity)}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    borderRadius: 12,
    borderWidth: 1,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
    position: 'relative',
  },
  productSection: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 12,
  },
  productImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
  },
  productInfo: {
    flex: 1,
  },
  priceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  priceColumn: {
    gap: 2,
  },
  mrpRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  mrpLabel: {
    marginRight: 4,
  },
  originalPrice: {
    textDecorationLine: 'line-through',
    marginLeft: 0,
    marginRight: 8,
  },
  saleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  salePrice: {
    marginRight: 8,
  },
  discountBadge: {
    borderRadius: 4,
    paddingHorizontal: 4,
    paddingVertical: 2,
    fontSize: 12,
    fontWeight: 'bold',
    alignSelf: 'center',
  },
  quantityLayout: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'flex-end'
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#37C871',
    borderRadius: 8,
    paddingHorizontal: 4,
    height: 30,
  },
  expandableHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderTopWidth: 1,
  },
  expandedContent: {
    padding: 16,
    borderTopWidth: 1,
  },
  tierBreakdown: {
    marginBottom: 16,
  },
  sectionTitle: {
    // marginBottom: 8,
    color: '#4CAF50',
  },
  tierRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 8,
    borderRadius: 6,
    borderWidth: 1,
    marginBottom: 4,
    marginTop: 4,
  },
  tierInfo: {
    flex: 1,
  },
  tierSavings: {
    alignItems: 'flex-end',
  },
  savingsChip: {
    paddingHorizontal: 6,
    paddingVertical: 4,
    borderRadius: 7,
  },
  savingsChipText: {
    color: '#FFFFFF',
    // fontSize: 10,
  },
  calculatorSection: {
    marginBottom: 16,
  },
  calculatorHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 4,
  },
  calculatorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  calculatorInput: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 6,
    borderColor: colors.primary[500],
    paddingHorizontal: 8,
    paddingVertical: 8,
    fontSize: 15,
  },
  calculatorResult: {
    minWidth: 80,
    alignItems: 'center',
  },
  applyButton: {
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.primary[500],
    backgroundColor: colors.primary[50],
  },
  relatedSection: {
    marginBottom: 8,
  },
  relatedItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    gap: 8,
  },
  relatedName: {
    flex: 1,
  },
  addRelatedButton: {
    padding: 4,
  },
  quantityButton: {
    width: 28,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityText: {
    color: '#FFFFFF',
    // marginHorizontal: 8,
    minWidth: 20,
    textAlign: 'center',
  },
  removeButton: {
    position: 'absolute',
    top: -15,
    right: -10,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: 30,
    padding: 2,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 3,
    zIndex: 999,
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  itemTotal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderTopWidth: 1,
  },
}); 