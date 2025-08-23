import { useState } from 'react';
import { View, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { ShoppingCart, Star, Heart, Plus, Minus, Award, Truck } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
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
  featured?: boolean;
}

interface ProductCardPremiumProps {
  product: Product;
  onPress: () => void;
  onAddToCart: () => void;
}

export default function ProductCardPremium({ product, onPress, onAddToCart }: ProductCardPremiumProps) {
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
      activeOpacity={0.8}
    >
      {/* Image Section with Overlay */}
      <View style={styles.imageContainer}>
        <Image source={{ uri: product.image }} style={styles.image} />
        
        {/* Gradient Overlay */}
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.3)']}
          style={styles.gradientOverlay}
        />
        
        {/* Top Badges */}
        <View style={styles.topBadges}>
          {product.featured && (
            <View style={styles.featuredBadge}>
              <Award size={8} color="#FFD700" />
              <Text style={styles.featuredText}>Premium</Text>
            </View>
          )}
          
          {discount > 0 && (
            <View style={styles.discountBadge}>
              <Text style={styles.discountText}>-{discount}%</Text>
            </View>
          )}
        </View>
        
        {/* Wishlist Button */}
        <TouchableOpacity 
          style={[
            styles.wishlistButton,
            isFavorite && { backgroundColor: colors.primary[600] }
          ]}
          onPress={handleToggleWishlist}
        >
          <Heart 
            size={10} 
            color={isFavorite ? '#FFFFFF' : '#666'} 
            fill={isFavorite ? '#FFFFFF' : 'none'} 
          />
        </TouchableOpacity>
        
        {/* Delivery Info */}
        <View style={styles.deliveryInfo}>
          <Truck size={8} color="#FFFFFF" />
          <Text style={styles.deliveryText}>Free Delivery</Text>
        </View>
      </View>
      
      {/* Content Section */}
      <View style={styles.contentContainer}>
        <View style={styles.ratingContainer}>
          <View style={styles.ratingRow}>
            <Star size={8} color="#FFA726" fill="#FFA726" />
            <Text variant="body-sm" weight="semibold" style={styles.rating}>
              {product.rating}
            </Text>
          </View>
          <Text variant="caption" color="tertiary">
            ({product.ratingCount} reviews)
          </Text>
        </View>
        
        <Text 
          variant="body" 
          weight="semibold" 
          numberOfLines={2}
          style={styles.name}
        >
          {product.name}
        </Text>
        
        {displayInfo && (
          <View style={styles.weightContainer}>
            <Text variant="body-sm" color="secondary" style={styles.weightText}>
              {displayInfo}
            </Text>
          </View>
        )}
        
        <View style={styles.priceSection}>
          <View style={styles.priceRow}>
            <Text variant="h4" weight="bold" color="accent">
              {formatPrice(discountedPrice)}
            </Text>
            
            {discount > 0 && (
              <Text 
                variant="body-sm" 
                color="tertiary" 
                style={styles.originalPrice}
              >
                {formatPrice(product.price)}
              </Text>
            )}
          </View>
          
          {discount > 0 && (
            <Text variant="caption" style={styles.savingsText}>
              You save {formatPrice(product.price - discountedPrice)}
            </Text>
          )}
        </View>
        
        {product.inStock ? (
          <View style={styles.actionContainer}>
            {itemQuantity > 0 ? (
              <View style={styles.quantitySection}>
                <View style={styles.quantityContainer}>
                  <TouchableOpacity 
                    style={styles.quantityButton}
                    onPress={handleDecrement}
                  >
                    <Minus size={10} color="#FFFFFF" />
                  </TouchableOpacity>
                  
                  <Text variant="body-sm" weight="bold" style={styles.quantityText}>
                    {itemQuantity}
                  </Text>
                  
                  <TouchableOpacity 
                    style={styles.quantityButton}
                    onPress={handleIncrement}
                  >
                    <Plus size={10} color="#FFFFFF" />
                  </TouchableOpacity>
                </View>
                
                <Text variant="caption" color="secondary" style={styles.inCartText}>
                  Added to cart
                </Text>
              </View>
            ) : (
              <TouchableOpacity 
                style={styles.addButton}
                onPress={handleAddToCart}
              >
                <LinearGradient
                  colors={[colors.primary[600], colors.primary[700]]}
                  style={styles.addButtonGradient}
                >
                                      <ShoppingCart size={12} color="#FFFFFF" />
                  <Text variant="body-sm" weight="bold" style={styles.addButtonText}>
                    Add to Cart
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            )}
          </View>
        ) : (
          <View style={styles.outOfStockContainer}>
            <Text variant="body" weight="semibold" color="tertiary">
              Currently Unavailable
            </Text>
            <TouchableOpacity style={styles.notifyButton}>
              <Text variant="body-sm" weight="semibold" color="accent">
                Notify When Available
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 160,
    // marginRight: 16,
    borderRadius: 14,
    overflow: 'hidden',
    elevation: 6,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
  },
  imageContainer: {
    width: '100%',
    height: 120,
    backgroundColor: '#F9F9F9',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  gradientOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 40,
  },
  topBadges: {
    position: 'absolute',
    top: 8,
    left: 8,
    flexDirection: 'row',
    gap: 4,
  },
  featuredBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 3,
    gap: 3,
  },
  featuredText: {
    color: '#FFD700',
    fontSize: 8,
    fontWeight: 'bold',
  },
  discountBadge: {
    backgroundColor: '#FF4444',
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 3,
  },
  discountText: {
    color: '#FFFFFF',
    fontSize: 8,
    fontWeight: 'bold',
  },
  wishlistButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 3,
  },
  deliveryInfo: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  deliveryText: {
    color: '#FFFFFF',
    fontSize: 8,
    fontWeight: 'bold',
  },
  contentContainer: {
    padding: 10,
    gap: 8,
  },
  ratingContainer: {
    alignItems: 'flex-start',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    marginBottom: 1,
  },
  rating: {
    color: '#FFA726',
  },
  name: {
    lineHeight: 18,
    // minHeight: 20,
  },
  weightContainer: {
    backgroundColor: '#F0F8FF',
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 3,
    alignSelf: 'flex-start',
  },
  weightText: {
    fontSize: 9,
    fontWeight: '600',
  },
  priceSection: {
    gap: 3,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 6,
  },
  originalPrice: {
    textDecorationLine: 'line-through',
  },
  savingsText: {
    color: '#10B981',
    fontWeight: '600',
  },
  actionContainer: {
    marginTop: 3,
  },
  quantitySection: {
    alignItems: 'center',
    gap: 6,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary[600],
    borderRadius: 14,
    paddingHorizontal: 4,
    height: 26,
  },
  quantityButton: {
    width: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityText: {
    color: '#FFFFFF',
    marginHorizontal: 8,
    fontSize: 11,
    minWidth: 14,
    textAlign: 'center',
  },
  inCartText: {
    fontWeight: '600',
  },
  addButton: {
    borderRadius: 18,
    overflow: 'hidden',
  },
  addButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    gap: 4,
  },
  addButtonText: {
    color: '#FFFFFF',
  },
  outOfStockContainer: {
    alignItems: 'center',
    gap: 6,
  },
  notifyButton: {
    borderWidth: 1,
    borderColor: colors.primary[600],
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
}); 