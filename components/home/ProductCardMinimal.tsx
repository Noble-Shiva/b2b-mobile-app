import { useState } from 'react';
import { View, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Plus, Minus } from 'lucide-react-native';
import { useSelector, useDispatch } from 'react-redux';
import { selectIsDark } from '@/store/themeSlice';
import { selectCartItems, addToCart, updateQuantity, removeFromCart } from '@/store/cartSlice';
import { Text } from '@/components/ui';
import { formatPrice } from '@/utils/helpers';
import { colors } from '@/utils/theme';

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  rating?: number;
  ratingCount?: number;
  discount?: number;
  weight?: string;
  volume?: string;
  quantity?: string;
  inStock?: boolean;
}

interface ProductCardMinimalProps {
  product: Product;
  onPress: () => void;
  onAddToCart: () => void;
}

export default function ProductCardMinimal({ product, onPress, onAddToCart }: ProductCardMinimalProps) {
  const isDark = useSelector(selectIsDark);
  const cartItems = useSelector(selectCartItems);
  const dispatch = useDispatch();
  
  const discount = product.discount || 0;
  const discountedPrice = discount 
    ? product.price - (product.price * discount / 100) 
    : product.price;
  
  const cartItem = cartItems.find(item => item.id === product.id);
  const itemQuantity = cartItem ? cartItem.quantity : 0;
  
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
      activeOpacity={0.9}
    >
      {/* Discount Badge */}
      {discount > 0 && (
        <View style={styles.discountBadge}>
          <Text style={styles.discountText}>{discount}%</Text>
        </View>
      )}
      
      {/* Image */}
      <View style={styles.imageContainer}>
        <Image source={{ uri: product.image }} style={styles.image} />
      </View>
      
      {/* Content */}
      <View style={styles.contentContainer}>
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
        
        <View style={styles.bottomSection}>
          <View style={styles.priceContainer}>
            <Text variant="body" weight="bold">
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
          
          {itemQuantity > 0 ? (
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
              <Plus size={16} color="#FFFFFF" />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 140,
    marginRight: 12,
    borderRadius: 8,
    overflow: 'hidden',
    elevation: 1,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    position: 'relative',
  },
  discountBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#FF4444',
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
    zIndex: 10,
  },
  discountText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: 'bold',
  },
  imageContainer: {
    width: '100%',
    height: 100,
    backgroundColor: '#F8F8F8',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  contentContainer: {
    padding: 10,
    gap: 6,
  },
  name: {
    lineHeight: 16,
    height: 32,
  },
  weightInfo: {
    fontSize: 10,
  },
  bottomSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 2,
  },
  priceContainer: {
    flex: 1,
  },
  originalPrice: {
    textDecorationLine: 'line-through',
    fontSize: 9,
  },
  addButton: {
    backgroundColor: colors.primary[600],
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary[600],
    borderRadius: 12,
    paddingHorizontal: 3,
    height: 24,
  },
  quantityButton: {
    width: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityText: {
    color: '#FFFFFF',
    marginHorizontal: 6,
    fontSize: 10,
    minWidth: 12,
    textAlign: 'center',
  },
}); 