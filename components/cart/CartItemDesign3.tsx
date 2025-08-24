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
    image: string;
    quantity: number;
    supplier?: string;
    unit?: string;
    tierPricing?: Array<{
      tier: number;
      minQuantity: number;
      price: number;
      savings: number;
    }>;
    relatedProducts?: Array<{
      name: string;
      price: number;
    }>;
    schemeType?: string;
    schemeApplied?: boolean;
    schemeQuantity?: number;
    schemeSavings?: number;
  };
  onRemove: (id: string) => void;
  onUpdateQuantity: (id: string, quantity: number) => void;
  tabType?: 'mrp' | 'super-saver';
}

export default function CartItemDesign3({ 
  item, 
  onRemove, 
  onUpdateQuantity, 
  tabType = 'super-saver'
}: CartItemProps) {
  const isDark = useSelector(selectIsDark);
  const currentSavings = (item.originalPrice - item.price) * item.quantity;

  // Calculate scheme extra products based on quantity and scheme type
  const calculateSchemeExtraProducts = () => {
    if (!item.schemeType || !item.quantity) return 0;
    
    // Parse scheme like "4+1" to get baseQuantity and additionalQuantity
    const schemeMatch = item.schemeType.match(/(\d+)\+(\d+)/);
    if (!schemeMatch) return 0;
    
    const baseQuantity = parseInt(schemeMatch[1]);
    const additionalQuantity = parseInt(schemeMatch[2]);
    
    // Calculate how many sets of the scheme are completed
    const schemeSets = Math.floor(item.quantity / baseQuantity);
    return schemeSets * additionalQuantity;
  };

  const extraProducts = calculateSchemeExtraProducts();

  return (
    <View style={[
      styles.ultraCompactContainer,
      { 
        backgroundColor: isDark ? '#2A2A2A' : '#FFFFFF',
        borderColor: isDark ? '#444444' : '#EEEEEE'
      }
    ]}>
      {/* Single Line Layout - Ultra Compact */}
      <View style={styles.ultraCompactRow}>
        {/* Product Image - Tiny */}
        <View style={{flexDirection: 'column', alignItems: 'center', gap: 5}}>
          <Image source={{ uri: item.image }} style={styles.ultraCompactImage} />
          {/* Remove Button - Minimal */}
          <TouchableOpacity 
            style={styles.ultraCompactRemove}
            onPress={() => onRemove(item.id)}
          >
            <Trash2 size={10} color="#FF4444" />
            <Text variant="body" weight="regular" style={styles.deleteText}>
              Delete
            </Text>
          </TouchableOpacity>
        </View>
        
        {/* Product Info - Minimal */}
        <View style={styles.ultraCompactInfo}>
          <Text variant="body" weight="medium" numberOfLines={2} style={styles.ultraCompactName}>
            {item.name}
          </Text>
          {/* <Text variant="caption" color="secondary" numberOfLines={1}>
            MRP: 250 | Sale Price: 200 
            Retail Margin: 15% | Scheme: 4+1
          </Text> */}
          <Text variant="body" weight="medium" color="secondary" 
            style={[styles.ultraCompactPriceText, {
              fontSize: tabType === 'super-saver' ? 13 : 16,
              lineHeight: tabType === 'super-saver' ? 15 : 18,
              paddingTop: tabType === 'super-saver' ? 0 : 5,
            }]  }>
            MRP: 
            <Text variant="body" weight="bold" color="secondary" 
              style={[styles.ultraCompactPriceText, {
                fontSize: tabType === 'super-saver' ? 13 : 16,
                lineHeight: tabType === 'super-saver' ? 15 : 18
              }]}>
              {' '}{formatPrice(item.originalPrice)}
            </Text>
            {(tabType === 'super-saver' && (currentSavings > 0 || (item.schemeQuantity && item.schemeQuantity > 0))) && (
              <Text variant="body" weight="medium" color="secondary" style={styles.ultraCompactPriceText}>
                {' • '}Sale Price: 
                <Text variant="body" weight="bold" color="secondary" style={styles.ultraCompactPriceText}>
                  {' '}{formatPrice(item.price)}
                </Text>
              </Text>
            )}
          </Text>
          {(tabType === 'super-saver' && (currentSavings > 0 || extraProducts > 0)) && (
            <Text variant="body" weight="medium" color="secondary" style={styles.ultraCompactPriceText}>
              Margin: 
              <Text variant="body" weight="bold" color="secondary" style={styles.ultraCompactPriceText}>
                {' '}15% 
              </Text>
              {' '}• Scheme: 
              <Text variant="body" weight="bold" color="secondary" style={styles.ultraCompactPriceText}>
                {' '}{item.schemeType || '4+1'}
              </Text>
            </Text>
          )}

          {/* Quantity and Extra Products Info */}
          {/* {tabType === 'super-saver' && extraProducts > 0 && (
            <Text variant="caption" color="success" weight="medium" style={styles.ultraCompactSchemeInfo}>
              Qty: {item.quantity} • Free: {extraProducts}
            </Text>
          )} */}
          {/* <Text variant="caption" color="secondary" numberOfLines={1}>
            Qty: {item.quantity} • Free: {item.schemeQuantity}
          </Text> */}
          {/* <View style={{flexDirection: 'row', alignItems: 'center', gap: 8}}>
            <TouchableOpacity 
              onPress={() => onRemove(item.id)}
            >
              <Text variant="caption" weight="bold" style={styles.deletetextt}>
                Move to Wishlist
              </Text>
            </TouchableOpacity>
          </View> */}
        </View>

        <View style={{flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12}}>
          <View style={{flexDirection: 'row', alignItems: 'center', gap: 10}}>
            {/* Quantity */}
            <View style={styles.ultraCompactQuantity}>
              <TouchableOpacity 
                style={[styles.ultraCompactQtyBtn, { backgroundColor: isDark ? '#444444' : '#F0F0F0' }]}
                onPress={() => onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))}
              >
                <Minus size={18} color={isDark ? '#FFFFFF' : '#333333'} />
              </TouchableOpacity>
              
              <Text variant="caption" weight="semibold" style={styles.ultraCompactQtyText}>
                {item.quantity}
              </Text>
              
              <TouchableOpacity 
                style={[styles.ultraCompactQtyBtn, { backgroundColor: isDark ? '#444444' : '#F0F0F0' }]}
                onPress={() => onUpdateQuantity(item.id, item.quantity + 1)}
              >
                <Plus size={18} color={isDark ? '#FFFFFF' : '#333333'} />
              </TouchableOpacity>
            </View>
            
            {/* Remove Button - Minimal */}
            {/* <TouchableOpacity 
              style={styles.ultraCompactRemove}
              onPress={() => onRemove(item.id)}
            >
              <Trash2 size={14} color="#FF4444" />
            </TouchableOpacity> */}
          </View>

          <View style={{flexDirection: 'row', alignItems: 'center', gap: 8}}>
            {/* <View style={styles.ultraCompactPrice}>
              <Text variant="caption" weight="bold" style={styles.ultraCompactPriceText}>
                {formatPrice(item.price)}
              </Text>
              {tabType === 'super-saver' && item.originalPrice > item.price && (
                <Text variant="caption" color="secondary" style={styles.ultraCompactOriginalPrice}>
                  {formatPrice(item.originalPrice)}
                </Text>
              )}
            </View> */}
            <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 2}}>
              <Text variant="caption" weight="regular" style={[styles.ultraCompactTotal, {marginTop: 5}]}>{'Total :'}</Text>
              <Text variant="body" weight="bold" style={[styles.ultraCompactTotal, {fontSize: 16}]}>
                {formatPrice(item.price * item.quantity)}
              </Text>
            </View>
          </View>
        </View>
      </View>
      
      {/* Micro Info Bar - Only if needed */}
      {/* {(tabType === 'super-saver' && (currentSavings > 0 || extraProducts > 0)) && (
        <View style={styles.ultraCompactInfoBar}>
          {currentSavings > 0 && (
            <Text variant="caption" color="success" style={styles.ultraCompactBadge}>
              Save ₹{currentSavings.toFixed(0)}
            </Text>
          )}
          {extraProducts > 0 && (
            <Text variant="caption" color="success" style={styles.ultraCompactBadge}>
              🎁 {extraProducts} free
            </Text>
          )}
        </View>
      )} */}

      {/* Scheme Extra Products Bar - Only for Retail Billing */}
      {tabType === 'super-saver' && extraProducts > 0 && (
        <View style={styles.schemeExtraProductsBar}>
          <View style={styles.schemeExtraProductsContent}>
            <Text variant="caption" color="success" weight="medium" style={styles.schemeExtraProductsText}>
              {extraProducts} free product(s) from {item.schemeType || '4+1'} scheme will be dispatched with your order.
            </Text>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  ultraCompactContainer: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 8, // Reduced padding for ultra-compact
    marginBottom: 6, // Reduced margin
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  ultraCompactRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8, // Reduced gap for ultra-compact
  },
  ultraCompactImage: {
    width: 45, // Smaller image for ultra-compact
    height: 45,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  ultraCompactInfo: {
    flex: 1,
    gap: 4, // Reduced gap
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  ultraCompactName: {
    // lineHeight: 16, // Reduced line height
    // flex: 1,
    fontSize: 16,
  },
  ultraCompactPrice: {
    flexDirection: 'row', // Stacked for ultra-compact
    alignItems: 'flex-end',
    gap: 2,
  },
  ultraCompactPriceText: {
    // color: colors.primary[700],
    // fontSize: 13,
    // lineHeight: 15,
  },
  ultraCompactOriginalPrice: {
    textDecorationLine: 'line-through',
    fontSize: 10, // Smaller font
  },
  ultraCompactQuantity: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    borderRadius: 6, // Smaller radius
    // padding: 1, // Reduced padding
  },
  ultraCompactQtyBtn: {
    width: 24, // Smaller buttons
    height: 24,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ultraCompactQtyText: {
    minWidth: 24, // Reduced width
    textAlign: 'center',
    fontSize: 16, // Smaller font
    paddingTop: 5,
  },
  ultraCompactTotal: {
    marginTop: 3,
    color: colors.primary[700],
    fontSize: 13, // Smaller font
  },
  deleteText: {
    color: colors.error[700],
    fontSize: 12, // Smaller font
    textDecorationLine: 'underline',
    textDecorationStyle: 'dotted',
  },
  ultraCompactRemove: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  ultraCompactInfoBar: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    // marginTop: 6, // Reduced margin
    // paddingTop: 6, // Reduced padding
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.1)',
  },
  ultraCompactBadge: {
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
    paddingHorizontal: 6, // Reduced padding
    paddingVertical: 1, // Reduced padding
    borderRadius: 3, // Smaller radius
    fontSize: 10, // Smaller font
  },
  schemeExtraProductsBar: {
    backgroundColor: 'rgba(76, 175, 80, 0.05)', // Lighter green background
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
    marginTop: 6,
    borderWidth: 1,
    borderColor: 'rgba(76, 175, 80, 0.2)',
  },
  schemeExtraProductsContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  schemeExtraProductsText: {
    color: colors.success[700],
    fontSize: 12,
  },
  ultraCompactSchemeInfo: {
    marginTop: 2,
    fontSize: 12,
  },
}); 