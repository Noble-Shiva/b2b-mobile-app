import React, { useState } from 'react';
import { View, Image, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { ShoppingCart, Star, Heart, Plus, Minus, Truck, Shield } from 'lucide-react-native';
import { useSelector, useDispatch } from 'react-redux';
import { selectIsDark } from '@/store/themeSlice';
import { selectWishlistItems, addToWishlist, removeFromWishlist } from '@/store/wishlistSlice';
import { selectCartItems, addToCart, updateQuantity } from '@/store/cartSlice';
import { Text } from '@/components/ui';
import { formatPrice } from '@/utils/helpers';
import { colors } from '@/utils/theme';

interface B2BProduct {
  id: string;
  name: string;
  brand: string;
  price: number;
  image: string;
  rating: number;
  ratingCount: number;
  discount?: number;
  moq: number;
  margin: number;
  supplierVerified: boolean;
  deliveryTime: string;
  stockLevel: 'High' | 'Medium' | 'Low';
  category: string;
  bulkPricing: {
    '50+': number;
    '100+': number;
    '200+': number;
  };
}

interface B2BProductCardProps {
  product: B2BProduct;
  onPress: () => void;
}

export default function B2BProductCard({ product, onPress }: B2BProductCardProps) {
  const isDark = useSelector(selectIsDark);
  const wishlistItems = useSelector(selectWishlistItems);
  const cartItems = useSelector(selectCartItems);
  const dispatch = useDispatch();
  const [quantity, setQuantity] = useState(product.moq);
  
  const isFavorite = wishlistItems.some(item => item.id === product.id);
  const cartItem = cartItems.find(item => item.id === product.id);
  const itemQuantity = cartItem ? cartItem.quantity : 0;
  
  const discountedPrice = product.discount 
    ? product.price - (product.price * product.discount / 100) 
    : product.price;

  const handleToggleWishlist = (e: any) => {
    e.stopPropagation();
    if (isFavorite) {
      dispatch(removeFromWishlist(product.id));
    } else {
      dispatch(addToWishlist(product));
    }
  };

  const handleQuantityChange = (change: number) => {
    const newQuantity = Math.max(product.moq, quantity + change);
    setQuantity(newQuantity);
  };

  const handleAddToCart = (e: any) => {
    e.stopPropagation();
    if (quantity < product.moq) {
      Alert.alert(
        "Minimum Order Quantity",
        `Minimum order quantity is ${product.moq} units for this product.`
      );
      return;
    }
    
    dispatch(addToCart({
      id: product.id,
      name: product.name,
      price: discountedPrice,
      image: product.image,
      quantity: quantity,
      discount: product.discount || 0,
    }));
    
    Alert.alert("Added to Cart", `${quantity} units added to your cart.`);
  };

  const getStockColor = () => {
    switch (product.stockLevel) {
      case 'High': return '#4CAF50';
      case 'Medium': return '#FF9800';
      case 'Low': return '#F44336';
      default: return '#999';
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.container,
        { backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF' }
      ]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      {/* Header with badges */}
      <View style={styles.header}>
        {product.discount && product.discount > 0 && (
          <View style={styles.discountBadge}>
            <Text style={styles.discountText}>{product.discount}% OFF</Text>
          </View>
        )}
        
        {product.supplierVerified && (
          <View style={styles.verifiedBadge}>
            <Shield size={12} color="#FFFFFF" />
            <Text style={styles.verifiedText}>VERIFIED</Text>
          </View>
        )}
        
        <TouchableOpacity style={styles.wishlistButton} onPress={handleToggleWishlist}>
          <Heart 
            size={16} 
            color={isFavorite ? colors.primary[600] : '#999'} 
            fill={isFavorite ? colors.primary[600] : 'none'} 
          />
        </TouchableOpacity>
      </View>

      {/* Product Image */}
      <View style={styles.imageContainer}>
        <Image source={{ uri: product.image }} style={styles.image} resizeMode="contain" />
        
        {/* Stock Level Indicator */}
        <View style={[styles.stockIndicator, { backgroundColor: getStockColor() }]}>
          <Text style={styles.stockText}>{product.stockLevel} Stock</Text>
        </View>
      </View>

      {/* Product Info */}
      <View style={styles.productInfo}>
        <Text variant="caption" color="secondary" style={styles.brand}>
          {product.brand}
        </Text>
        
        <Text variant="body-sm" weight="semibold" numberOfLines={2} style={styles.productName}>
          {product.name}
        </Text>

        {/* Rating */}
        <View style={styles.ratingContainer}>
          <Star size={12} color="#FFB800" fill="#FFB800" />
          <Text variant="caption" style={styles.rating}>
            {product.rating} ({product.ratingCount})
          </Text>
        </View>

        {/* Pricing */}
        <View style={styles.pricingContainer}>
          <Text variant="body" weight="bold" color="accent">
            {formatPrice(discountedPrice)}/unit
          </Text>
          {product.discount && (
            <Text variant="caption" style={styles.originalPrice}>
              {formatPrice(product.price)}
            </Text>
          )}
        </View>

        {/* B2B Specific Info */}
        <View style={styles.b2bInfo}>
          <View style={styles.b2bRow}>
            <View style={styles.moqContainer}>
              <Text variant="caption" color="secondary">MOQ:</Text>
              <Text variant="caption" weight="semibold">{product.moq} units</Text>
            </View>
            <View style={styles.marginContainer}>
              <Text variant="caption" color="success" weight="semibold">
                {product.margin}% margin
              </Text>
            </View>
          </View>

          <View style={styles.deliveryContainer}>
            <Truck size={12} color={colors.primary[600]} />
            <Text variant="caption" color="secondary" style={styles.deliveryText}>
              {product.deliveryTime}
            </Text>
          </View>
        </View>

        {/* Bulk Pricing */}
        <View style={styles.bulkPricingContainer}>
          <Text variant="caption" weight="semibold" style={styles.bulkTitle}>
            Bulk Pricing:
          </Text>
          <View style={styles.bulkPriceRow}>
            <Text variant="caption" color="secondary">50+: {formatPrice(product.bulkPricing['50+'])}</Text>
            <Text variant="caption" color="secondary">100+: {formatPrice(product.bulkPricing['100+'])}</Text>
            <Text variant="caption" color="secondary">200+: {formatPrice(product.bulkPricing['200+'])}</Text>
          </View>
        </View>

        {/* Quantity Selector */}
        <View style={styles.quantityContainer}>
          <Text variant="caption" weight="semibold">Quantity:</Text>
          <View style={styles.quantityControls}>
            <TouchableOpacity 
              style={styles.quantityButton} 
              onPress={() => handleQuantityChange(-1)}
            >
              <Minus size={14} color={colors.primary[600]} />
            </TouchableOpacity>
            
            <Text variant="body-sm" weight="semibold" style={styles.quantityValue}>
              {quantity}
            </Text>
            
            <TouchableOpacity 
              style={styles.quantityButton} 
              onPress={() => handleQuantityChange(1)}
            >
              <Plus size={14} color={colors.primary[600]} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Add to Cart Button */}
        <TouchableOpacity 
          style={[styles.addToCartButton, { backgroundColor: colors.primary[600] }]} 
          onPress={handleAddToCart}
        >
          <ShoppingCart size={16} color="#FFFFFF" />
          <Text variant="body-sm" weight="semibold" color="inverse" style={styles.addToCartText}>
            Add to Cart • {formatPrice(discountedPrice * quantity)}
          </Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 280,
    marginRight: 16,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  header: {
    position: 'absolute',
    top: 8,
    left: 8,
    right: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    zIndex: 2,
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
  verifiedBadge: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  verifiedText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  wishlistButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageContainer: {
    position: 'relative',
    height: 160,
    backgroundColor: '#F5F5F5',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  stockIndicator: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  stockText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  productInfo: {
    padding: 12,
  },
  brand: {
    marginBottom: 4,
  },
  productName: {
    marginBottom: 6,
    minHeight: 34,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 4,
  },
  rating: {
    fontSize: 11,
  },
  pricingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  originalPrice: {
    textDecorationLine: 'line-through',
    color: '#999',
  },
  b2bInfo: {
    marginBottom: 8,
  },
  b2bRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  moqContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  marginContainer: {
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  deliveryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  deliveryText: {
    fontSize: 11,
  },
  bulkPricingContainer: {
    backgroundColor: '#F0F7FF',
    padding: 8,
    borderRadius: 6,
    marginBottom: 8,
  },
  bulkTitle: {
    marginBottom: 4,
    fontSize: 11,
  },
  bulkPriceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  quantityContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  quantityButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#F0F7FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantityValue: {
    minWidth: 24,
    textAlign: 'center',
  },
  addToCartButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 8,
    gap: 8,
  },
  addToCartText: {
    fontSize: 13,
  },
}); 