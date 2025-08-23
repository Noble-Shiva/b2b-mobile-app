import { useState } from 'react';
import { View, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { ShoppingCart, Star, Heart, Plus, Minus, Clock } from 'lucide-react-native';
import { useSelector, useDispatch } from 'react-redux';
import { selectIsDark } from '@/store/themeSlice';
import { selectWishlistItems, addToWishlist, removeFromWishlist } from '@/store/wishlistSlice';
import { selectCartItems, addToCart, updateQuantity, removeFromCart } from '@/store/cartSlice';
import { Text, Badge } from '@/components/ui';
import { formatPrice } from '@/utils/helpers';
import { colors } from '@/utils/theme';

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  rating: number;
  ratingCount: number;
  discount?: number;
  weight?: string;
  volume?: string;
  quantity?: string;
  inStock?: boolean;
}

interface ProductCardCompactProps {
  product: Product;
  onPress: () => void;
  onAddToCart: () => void;
}

export default function ProductCardCompact({ product, onPress, onAddToCart }: ProductCardCompactProps) {
  const isDark = useSelector(selectIsDark);
  const wishlistItems = useSelector(selectWishlistItems);
  const cartItems = useSelector(selectCartItems);
  const dispatch = useDispatch();
  
  const discount = product.discount || 0;
  const discountedPrice = discount 
    ? product.price - (product.price * discount / 100) 
    : product.price;
  
  const isFavorite = wishlistItems.some(item => item.id === product.id);
  const cartItem = cartItems.find(item => item.id === product.id);
  const itemQuantity = cartItem ? cartItem.quantity : 0;
  
  const handleToggleWishlist = (e: any) => {
    e.stopPropagation();
    if (isFavorite) {
      dispatch(removeFromWishlist(product.id));
    } else {
      dispatch(addToWishlist(product));
    }
  };
  
  const handleAddToCart = (e: any) => {
    e.stopPropagation();
    dispatch(addToCart({
      ...product,
      quantity: 1
    }));
  };
  
  const handleIncrement = (e: any) => {
    e.stopPropagation();
    dispatch(addToCart({
      ...product,
      quantity: 1
    }));
  };
  
  const handleDecrement = (e: any) => {
    e.stopPropagation();
    if (itemQuantity === 1) {
      dispatch(removeFromCart(product.id));
    } else {
      dispatch(updateQuantity({ id: product.id, quantity: itemQuantity - 1 }));
    }
  };
  
  const displayInfo = product.weight || product.volume || product.quantity || '';
  
  return (
    <TouchableOpacity 
      style={[
        styles.container, 
        { backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF' }
      ]} 
      onPress={onPress}
      activeOpacity={0.7}
    >
      {/* Image Section */}
      <View style={styles.imageContainer}>
        <Image source={{ uri: product.image }} style={styles.image} />
        
        {discount > 0 && (
          <View style={styles.discountBadge}>
            <Text style={styles.discountText}>{discount}%</Text>
          </View>
        )}
        
        {!product.inStock && (
          <View style={styles.outOfStockOverlay}>
            <Text style={styles.outOfStockText}>Out of Stock</Text>
          </View>
        )}
      </View>
      
      {/* Content Section */}
      <View style={styles.contentContainer}>
        <View style={styles.headerRow}>
          <View style={styles.deliveryBadge}>
            <Clock size={10} color="#10B981" />
            <Text variant="caption" style={styles.deliveryText}>15 min</Text>
          </View>
          
          <TouchableOpacity 
            style={[
              styles.wishlistIcon,
              isFavorite && { backgroundColor: colors.primary[100] }
            ]}
            onPress={handleToggleWishlist}
          >
            <Heart 
              size={14} 
              color={isFavorite ? colors.primary[600] : '#999'} 
              fill={isFavorite ? colors.primary[600] : 'none'} 
            />
          </TouchableOpacity>
        </View>
        
        <Text 
          variant="body-sm" 
          weight="medium" 
          numberOfLines={2}
          style={styles.name}
        >
          {product.name}
        </Text>
        
        {displayInfo && (
          <Text variant="caption" color="secondary" style={styles.weightInfo}>
            {displayInfo}
          </Text>
        )}
        
        <View style={styles.ratingRow}>
          <Star size={12} color="#FFA726" fill="#FFA726" />
          <Text variant="caption" style={styles.rating}>
            {product.rating}
          </Text>
          <Text variant="caption" color="tertiary">
            ({product.ratingCount})
          </Text>
        </View>
        
        <View style={styles.bottomRow}>
          <View style={styles.priceContainer}>
            <Text variant="body-sm" weight="bold" color="accent">
              {formatPrice(discountedPrice)}
            </Text>
            
            {discount > 0 && (
              <Text 
                variant="caption" 
                color="tertiary" 
                style={styles.originalPrice}
              >
                {formatPrice(product.price)}
              </Text>
            )}
          </View>
          
          {product.inStock ? (
            itemQuantity > 0 ? (
              <View style={styles.quantityContainer}>
                <TouchableOpacity 
                  style={styles.quantityButton}
                  onPress={handleDecrement}
                >
                  <Minus size={12} color="#FFFFFF" />
                </TouchableOpacity>
                
                <Text variant="caption" weight="bold" style={styles.quantityText}>
                  {itemQuantity}
                </Text>
                
                <TouchableOpacity 
                  style={styles.quantityButton}
                  onPress={handleIncrement}
                >
                  <Plus size={12} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity 
                style={styles.addButton}
                onPress={handleAddToCart}
              >
                <Plus size={14} color="#FFFFFF" />
              </TouchableOpacity>
            )
          ) : (
            <View style={styles.outOfStockButton}>
              <Text variant="caption" color="tertiary">
                Notify Me
              </Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginVertical: 6,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    height: 120,
  },
  imageContainer: {
    width: 100,
    height: '100%',
    backgroundColor: '#F9F9F9',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  discountBadge: {
    position: 'absolute',
    top: 6,
    left: 6,
    backgroundColor: '#FF4444',
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  discountText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: 'bold',
  },
  outOfStockOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingVertical: 4,
    alignItems: 'center',
  },
  outOfStockText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: 'bold',
  },
  contentContainer: {
    flex: 1,
    padding: 12,
    justifyContent: 'space-between',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  deliveryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E8',
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  deliveryText: {
    color: '#10B981',
    fontSize: 9,
    fontWeight: '600',
    marginLeft: 2,
  },
  wishlistIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  name: {
    flex: 1,
    marginBottom: 2,
    lineHeight: 16,
  },
  weightInfo: {
    marginBottom: 4,
    fontSize: 10,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  rating: {
    marginLeft: 2,
    marginRight: 4,
    fontSize: 10,
    fontWeight: '600',
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceContainer: {
    flex: 1,
  },
  originalPrice: {
    textDecorationLine: 'line-through',
    fontSize: 10,
  },
  addButton: {
    backgroundColor: colors.primary[600],
    borderRadius: 16,
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary[600],
    borderRadius: 16,
    paddingHorizontal: 4,
    height: 32,
  },
  quantityButton: {
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityText: {
    color: '#FFFFFF',
    marginHorizontal: 8,
    fontSize: 12,
    minWidth: 16,
    textAlign: 'center',
  },
  outOfStockButton: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
}); 