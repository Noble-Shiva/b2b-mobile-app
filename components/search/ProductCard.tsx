import React, { useState, memo } from 'react';
import { View, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { ShoppingCart, Star, Heart, Plus, Minus } from 'lucide-react-native';
import { useSelector, useDispatch } from 'react-redux';
import { selectIsDark } from '@/store/themeSlice';
import { selectWishlistItems, addToWishlist, removeFromWishlist } from '@/store/wishlistSlice';
import { selectCartItems, addToCart, updateQuantity, removeFromCart, CartItem } from '@/store/cartSlice';
import { Text, Badge } from '@/components/ui';
import { formatPrice } from '@/utils/helpers';

// Helper function to ensure a value is a number
const ensureNumber = (value: any, defaultValue = 0): number => {
  if (typeof value === 'number') return value;
  if (typeof value === 'string') {
    // Remove currency symbols and other non-numeric characters
    const sanitized = value.replace(/[^0-9.]/g, '');
    const parsed = parseFloat(sanitized);
    return isNaN(parsed) ? defaultValue : parsed;
  }
  return defaultValue;
};

// Helper function to ensure a value is a valid image URI
const getValidImageUri = (imageValue: any): string | null => {
  if (typeof imageValue === 'string' && imageValue.trim() !== '') {
    // Check if it's a valid URL format
    if (imageValue.startsWith('http') || imageValue.startsWith('https') || imageValue.startsWith('data:')) {
      return imageValue.trim();
    }
  }
  return null;
};
import { colors } from '@/utils/theme';
import ProductOptionsSheet from '../home/ProductOptionsSheet';

interface ProductVariant {
  id: string;
  name: string;
  price: number;
  discountedPrice: number;
  originalPrice: number;
  discount: number;
  quantity: string;
  inStock: boolean;
}

interface Product {
  id: string;
  name: string;
  price?: number; // Make price optional since API might use different property names
  image: string;
  rating?: number;
  ratingCount?: number;
  discount?: number;
  weight?: string;
  volume?: string;
  quantity?: string;
  variants?: ProductVariant[];
  hasOptions?: boolean;
  // Add API response fields
  regular_price?: string | number;
  sale_price?: string | number;
  images?: string;
  description?: string;
  // Allow additional properties
  [key: string]: any;
}

interface ProductCardProps {
  product: Product;
  onPress: () => void;
  onAddToCart: () => void;
}

// Using React.memo to prevent unnecessary re-renders
const ProductCard = memo(({ 
  product, 
  onPress, 
  onAddToCart = () => {} 
}: ProductCardProps) => {
  const isDark = useSelector(selectIsDark);
  const wishlistItems = useSelector(selectWishlistItems);
  const cartItems = useSelector(selectCartItems);
  const dispatch = useDispatch();
  const [optionsVisible, setOptionsVisible] = useState(false);
  
  // Ensure price is a number with fallback to 0
  const price = ensureNumber(product.price || product.regular_price, 0);
               
  // Safely get discount percentage (if available)
  const discountPercentage = ensureNumber(product.discount, 5);
  
  // Calculate discounted price safely
  const discountedPrice = discountPercentage > 0
    ? price - (price * discountPercentage / 100) 
    : ensureNumber(product.sale_price, price);
  
  // Format the prices for display
  const priceDisplay = formatPrice(price);
  const discountedPriceDisplay = formatPrice(discountedPrice);
  
  const isFavorite = wishlistItems.some(item => item.id === product.id);
  
  // Check if product is in cart and get its quantity
  const cartItem = cartItems.find(item => item.id === product.id);
  const itemQuantity = cartItem ? cartItem.quantity : 0;
  
  // Sample variants for demonstration
  const productVariants: ProductVariant[] = product.variants || [
    {
      id: `${product.id}-1`,
      name: "1 pack (6 x 50 g)",
      price: price,
      discountedPrice: discountedPrice,
      originalPrice: price,
      discount: discountPercentage,
      quantity: "300g",
      inStock: true
    },
    {
      id: `${product.id}-2`,
      name: "2 x 6 x 50 g",
      price: price * 1.9,
      discountedPrice: (price * 1.9) * (1 - discountPercentage / 100),
      originalPrice: price * 2,
      discount: discountPercentage > 0 ? discountPercentage + 1 : 5,
      quantity: "600g",
      inStock: true
    },
    {
      id: `${product.id}-3`,
      name: "3 x 6 x 50 g",
      price: price * 2.8,
      discountedPrice: (price * 2.8) * (1 - discountPercentage / 100),
      originalPrice: price * 3,
      discount: discountPercentage > 0 ? discountPercentage + 2 : 7,
      quantity: "900g",
      inStock: true
    }
  ];
  
  const handleToggleWishlist = (e: any) => {
    e.stopPropagation();
    if (isFavorite) {
      dispatch(removeFromWishlist(product.id));
    } else {
      // Create a wishlist item with normalized properties
      const wishlistItem = {
        ...product,
        price: price, // Use the normalized price
        rating: ensureNumber(product.rating, 0),
        ratingCount: ensureNumber(product.ratingCount, 0)
      };
      dispatch(addToWishlist(wishlistItem));
    }
  };
  
  const handleAddToCart = (e: any) => {
    e.stopPropagation();
    
    // Check if product has actual variations from the API
    const hasVariations = Array.isArray(product.variants) && product.variants.length > 0;
    
    // If product is already in cart, increment quantity instead
    if (itemQuantity > 0) {
      handleIncrement(e);
      return;
    }
    
    if (product.hasOptions || hasVariations) {
      // Only show options sheet if the product actually has variants from the API
      setOptionsVisible(true);
    } else {
      // Create a properly typed cart item from the product
      const cartItem: CartItem = {
        id: product.id,
        name: product.name,
        // Use discounted price if available
        price: discountedPrice,  
        originalPrice: price, // Keep track of original price for displaying savings
        image: product.images || product.image,
        quantity: 1, // Initial quantity for cart
        totalPrice: discountedPrice, // Total price starts as the discounted price for 1 item
        // Include any other required properties
        discount: discountPercentage,
        weight: product.weight || '',
        volume: product.volume || '',
        quantity_info: displayInfo, // Add the displayed quantity info
        // Add any category info if needed
        category: product.category || ''
      };
      
      // Add to cart directly
      dispatch(addToCart(cartItem));
      
      // Call the onAddToCart callback from the parent
      onAddToCart();
    }
  };
  
  const handleIncrement = (e: any) => {
    e.stopPropagation();
    
    // Since the reducer will automatically increment quantity for existing items,
    // we only need to provide the item ID to increment
    dispatch(addToCart({
      id: product.id,
      name: product.name,
      price: discountedPrice,
      originalPrice: price,
      image: product.images || product.image,
      quantity: 1, // Keep quantity as 1, the reducer will handle incrementing
      totalPrice: discountedPrice
    } as CartItem));
  };
  
  const handleDecrement = (e: any) => {
    e.stopPropagation();
    if (itemQuantity === 1) {
      dispatch(removeFromCart(product.id));
    } else {
      dispatch(updateQuantity({ id: product.id, quantity: itemQuantity - 1 }));
    }
  };
  
  const handleSelectVariant = (variant: ProductVariant) => {
    // Create a variant-specific cart item
    const cartItem = {
      id: variant.id, // Use the variant ID for unique identification
      parentProductId: product.id, // Keep reference to the parent product
      name: `${product.name} - ${variant.name}`,
      price: variant.discountedPrice,
      originalPrice: variant.originalPrice,
      image: product.images || product.image,
      quantity: 1,
      totalPrice: variant.discountedPrice,
      discount: variant.discount,
      weight: product.weight || '',
      volume: product.volume || '',
      quantity_info: variant.quantity || displayInfo,
      variantName: variant.name
    };
    
    // Add the selected variant to cart
    dispatch(addToCart(cartItem));
    
    // Call the onAddToCart callback from the parent
    onAddToCart();
    
    // Close the modal
    setOptionsVisible(false);
  };
  
  // Display weight/volume/quantity info
  const displayInfo = product.weight || product.volume || product.quantity || '';
  
  return (
    <>
      <TouchableOpacity 
        style={[
          styles.container, 
          { backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF' }
        ]} 
        onPress={onPress}
        activeOpacity={0.7}
      >
        {/* Discount badge */}
        {discountPercentage > 0 && (
          <View style={styles.discountBadgeContainer}>
            <View style={styles.discountBadge}>
              <Text style={styles.discountText}>{Math.round(discountPercentage)}% off</Text>
            </View>
            {/* <View style={styles.discountBadgeTear} /> */}
          </View>
        )}



        {/* Product image */}
        <View style={styles.imageContainer}>
          {(() => {
            const validImageUri = getValidImageUri(product.images) || getValidImageUri(product.image);
            if (validImageUri) {
              return <Image source={{ uri: validImageUri }} style={styles.image} />;
            } else {
              // Fallback placeholder when no valid image is available
              return (
                <View style={[styles.image, styles.placeholderImage]}>
                  <Text style={styles.placeholderText}>No Image</Text>
                </View>
              );
            }
          })()}
        </View>

        {/* Product details */}
        <View style={styles.contentContainer}>
          {/* Product name */}
          <Text
            variant="body-sm"
            weight="medium"
            numberOfLines={2}
            style={styles.name}
          >
            {product.name}
          </Text>

          {/* Rating Display */}
          {/* {product.rating && product.rating > 0 && ( */}
            <View style={styles.ratingContainer}>
              <View style={styles.starContainer}>
                {[1, 2, 3, 4, 5].map((star, i) => (
                  <Star
                    key={star + i}
                    size={12}
                    color={star <= (product.rating || 0) ? '#FFD700' : '#E0E0E0'}
                    fill={star <= (product.rating || 0) ? '#FFD700' : 'none'}
                  />
                ))}
              </View>
              <Text variant="caption" color="tertiary" style={styles.ratingText}>
                ({product.ratingCount || 0})
              </Text>
            </View>
          {/* )} */}

          {/* Weight/volume info */}
          {/* {displayInfo && ( */}
            <Text variant="caption" color="secondary" style={styles.weightInfo}>
              {'100 g'}
            </Text>
          {/* )} */}

          {/* Price section */}
          <View style={styles.priceRow}>
            <View style={styles.priceContainer}>
              <View style={styles.priceRowInner}>
              
                <View style={styles.priceWithDiscountContainer}>                
                   {/* {discountPercentage > 0 && ( */}
                    <Text
                      variant="caption"
                      color="tertiary"
                      style={styles.originalPrice}
                    >
                      {formatPrice(price)}
                    </Text>
                  {/* )} */}
                   
                   {/* {discountPercentage > 0 && ( */}
                     <Text variant="caption" weight="semibold" style={styles.discountPercentageText}>
                       {Math.round(discountPercentage)} %
                     </Text>
                   {/* )} */}
                </View>

                <Text variant="body" weight="semibold">
                  {formatPrice(discountedPrice)}
                </Text>
              </View>
            </View>

            {/* Add button or quantity controls */}
            {itemQuantity > 0 ? (
              <View style={styles.quantityContainer}>
                <TouchableOpacity
                  style={styles.quantityButton}
                  onPress={handleDecrement}
                >
                  <Minus size={14} color="#FFFFFF" />
                </TouchableOpacity>
                
                <Text variant="body-sm" weight="semibold" style={styles.quantityText}>
                  {itemQuantity}
                </Text>
                
                <TouchableOpacity 
                  style={styles.quantityButton}
                  onPress={handleIncrement}
                >
                  <Plus size={14} color="#FFFFFF" />
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
        
        {/* Wishlist button */}
        <TouchableOpacity 
          style={[
            styles.wishlistButton, 
            isFavorite && { backgroundColor: colors.primary[700] }
          ]}
          onPress={handleToggleWishlist}
        >
          <Heart 
            size={16} 
            color={isFavorite ? '#FFFFFF' : colors.primary[700]} 
            fill={isFavorite ? '#FFFFFF' : 'none'} 
          />
        </TouchableOpacity>
      </TouchableOpacity>
      
      {/* Product Options Bottom Sheet */}
      <ProductOptionsSheet
        visible={optionsVisible}
        onClose={() => setOptionsVisible(false)}
        product={product}
        variants={productVariants}
        onSelectVariant={handleSelectVariant}
      />
    </>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 8,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    position: 'relative',
  },
  discountBadgeContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 10,
  },
  discountBadge: {
    backgroundColor: '#0066FF',
    paddingHorizontal: 5,
    paddingVertical: 4,
    borderTopLeftRadius: 4,
    borderBottomRightRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 50,
  },
  discountBadgeTear: {
    position: 'absolute',
    bottom: -5,
    right: 0,
    width: 10,
    height: 5,
    backgroundColor: '#0055CC', // Darker shade for the tear effect
    borderBottomLeftRadius: 5,
  },
  discountText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontFamily: 'Poppins-Bold',
  },

  imageContainer: {
    width: '100%',
    height: 140,
    backgroundColor: '#F9F9F9',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  contentContainer: {
    flex: 1,
    padding: 12,
  },
  name: {
    height: 36,
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    gap: 5,
  },
  starContainer: {
    flexDirection: 'row',
    gap: 1,
  },
  ratingText: {
    fontSize: 10,
  },
  weightInfo: {
    marginBottom: 8,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 'auto',
  },
  priceContainer: {
    flexDirection: 'column',
  },
  priceRowInner: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: 2,
  },
  priceWithDiscountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  discountPercentageText: {
    color: '#10B981',
    fontSize: 10,
    // backgroundColor: '#F0FDF4',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  originalPrice: {
    textDecorationLine: 'line-through',
  },
  productInfoContainer: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
    justifyContent: 'space-between',
  },
  productPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 2,
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
    backgroundColor: '#37C871',
    borderRadius: 8,
    paddingHorizontal: 2,
    height: 28,
  },
  quantityButton: {
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityText: {
    color: '#FFFFFF',
    marginHorizontal: 2,
    minWidth: 16,
    textAlign: 'center',
  },
  wishlistButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
    zIndex: 5,
  },
  placeholderImage: {
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 12,
    color: '#999999',
    fontFamily: 'Poppins-Regular',
  },
});

export default ProductCard;