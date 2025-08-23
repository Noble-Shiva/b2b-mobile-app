import React, { useState, useEffect, useCallback, useRef } from 'react';
import { View, StyleSheet, Image, TouchableOpacity, ScrollView, Alert, TextStyle, Animated, Dimensions, Modal, TextInput, FlatList, Linking } from 'react-native';
import RenderHtml from 'react-native-render-html';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Star, Minus, Plus, ShoppingCart, Heart, MessageSquare, ChevronDown, Play } from 'lucide-react-native';
import { fetchProductById } from '@/api/products';
import { formatPrice, calculateDiscountedPrice } from '@/utils/helpers';
import { Text, BackButton, Policies } from '@/components/ui';
import { colors } from '@/utils/theme';
import { useSelector, useDispatch } from 'react-redux';
import { selectWishlistItems, addToWishlist, removeFromWishlist } from '@/store/wishlistSlice';
import { addToCart, updateQuantity, removeFromCart, selectCartItems, selectTieredTotal, selectTotalSavings } from '@/store/cartSlice';
import { selectIsDark } from '@/store/themeSlice';
import CartPreviewModal from '@/components/cart/CartPreviewModal';

// Interface for product variants
interface ProductVariant {
  id: string;
  name: string;
  price: number;
  regular_price?: number;
  sale_price?: number;
  discountedPrice?: number;
  originalPrice?: number;
  discount?: number;
  quantity?: string;
  stock_quantity?: number;
  inStock?: boolean;
  sku?: string;
  attributes?: {
    [key: string]: string;
  };
}

// Sample reviews data
const sampleReviews = [
  {
    id: '1',
    userName: 'John Doe',
    rating: 5,
    comment: 'Excellent product! The quality is outstanding and it arrived earlier than expected.',
    date: '2023-06-15T14:30:00Z',
  },
  {
    id: '2',
    userName: 'Sarah Smith',
    rating: 4,
    comment: 'Very good product. The only reason I\'m not giving 5 stars is because the packaging was slightly damaged.',
    date: '2023-06-10T11:15:00Z',
  },
];

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const isDark = useSelector(selectIsDark);
  const cartTotal = useSelector(selectTieredTotal);
  const cartSavings = useSelector(selectTotalSavings);
  const [showCartPreview, setShowCartPreview] = useState(false);
  
  const [product, setProduct] = useState<any>(null);
  const [quantity, setQuantity] = useState(5); // Always start with MOQ
  const [showQuantityControls, setShowQuantityControls] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [reviews] = useState(sampleReviews);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [variants, setVariants] = useState<ProductVariant[]>([]);
  const [productPrice, setProductPrice] = useState<number | null>(null);
  const [discountedPrice, setDiscountedPrice] = useState<number | null>(null);
  const [productImage, setProductImage] = useState<string>('');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imageGallery, setImageGallery] = useState<string[]>([]);
  const [lightboxVisible, setLightboxVisible] = useState(false);
  const [lightboxImageIndex, setLightboxImageIndex] = useState(0);
  const [productsSold, setProductsSold] = useState(0);
  const [showPriceBreakup, setShowPriceBreakup] = useState(false);
  const [showGst, setShowGst] = useState(false);
  const lightboxScrollViewRef = useRef<ScrollView>(null);
  const [pincode, setPincode] = useState('');
  const [submittedPincode, setSubmittedPincode] = useState('');
  const [deliveryDate, setDeliveryDate] = useState<string | null>(null);
  const [arrivalDate, setArrivalDate] = useState<string | null>(null);
  const scrollX = useRef(new Animated.Value(0)).current;
  const imagesPerPage = 2;
  const imageWidth = Dimensions.get('window').width * 0.5;
  const numPages = Math.ceil(imageGallery.length / imagesPerPage);

  const recommendedProducts = [
    {
      id: '101',
      name: 'Classical Medicine A',
      brand: 'BrandX',
      image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80',
      price: 99,
      moq: 5,
      margin: 15,
      tieredPricing: {
        '1-9': 99,
        '10-19': 95,
        '20+': 90
      }
    },
    {
      id: '102',
      name: 'Classical Medicine A',
      brand: 'BrandY',
      image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80',
      price: 120,
      moq: 10,
      margin: 18,
      tieredPricing: {
        '1-9': 120,
        '10-19': 115,
        '20+': 110
      }
    },
    {
      id: '103',
      name: 'Classical Medicine A',
      brand: 'BrandZ',
      image: 'https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80',
      price: 90,
      moq: 3,
      margin: 12,
      tieredPricing: {
        '1-9': 90,
        '10-19': 85,
        '20+': 80
      }
    },
    {
      id: '104',
      name: 'Classical Medicine A',
      brand: 'BrandA',
      image: 'https://images.unsplash.com/photo-1576671081837-49000212a370?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80',
      price: 105,
      moq: 8,
      margin: 20,
      tieredPricing: {
        '1-9': 105,
        '10-19': 100,
        '20+': 95
      }
    },
  ];

  const dispatch = useDispatch();
  const wishlistItems = useSelector(selectWishlistItems);
  const cartItems = useSelector(selectCartItems);
  
  // Memoize the isInWishlist function to avoid recreating it on every render
  const checkIsInWishlist = useCallback((productId: string) => {
    return wishlistItems.some(item => item.id === productId);
  }, [wishlistItems]);
  
  // Load product data only once when the component mounts or when ID changes
  useEffect(() => {
    let isMounted = true;
    
    const loadProduct = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const productData = await fetchProductById(id as string);
        
        console.log('API Response - Product Data:', JSON.stringify(productData, null, 2));
        
        if (isMounted) {
          setProduct(productData);
          
          // console.log('Product image data:', {
          //   'product.image': productData.image,
          //   'product.images': productData.images,
          //   'product.gallery': productData.gallery,
          //   'product.imageUrl': productData.imageUrl,
          //   'product.imageUrls': productData.imageUrls,
          //   'product.featuredImage': productData.featuredImage
          // });
          
          console.log('Checking product variations:', { 
            hasVariations: !!productData.variations,
            isArray: Array.isArray(productData.variations),
            length: productData.variations?.length,
            variations: productData.variations
          });
          
          if (productData.variations && Array.isArray(productData.variations) && productData.variations.length > 0) {
            console.log('Product has variations:', productData.variations);
            
            const normalizedVariations = productData.variations.map((variant: any) => {
              console.log('Processing variant:', variant);
              
              return {
                ...variant,
                id: String(variant.id),
                price: parseFloat(variant.price || '0'),
                regular_price: parseFloat(variant.regular_price || '0'),
                sale_price: parseFloat(variant.sale_price || variant.price || '0'),
                stock_quantity: parseInt(variant.stock_quantity || '0')
              };
            });
            
            console.log('Normalized variations:', normalizedVariations);
            setVariants(normalizedVariations);
            setSelectedVariant(normalizedVariations[0]);
            console.log('Selected variant:', normalizedVariations[0]);
            
            const firstVariant = normalizedVariations[0];
            setProductPrice(firstVariant.regular_price || firstVariant.price);
            setDiscountedPrice(firstVariant.sale_price || firstVariant.price);
          } else {
            console.log('No variations found for product');
            setVariants([]);
            setSelectedVariant(null);
            
            setProductPrice(parseFloat(productData.price || '0'));
            
            if (productData.discount) {
              setDiscountedPrice(parseFloat(productData.price) * (1 - productData.discount/100));
            } else {
              setDiscountedPrice(parseFloat(productData.price || '0'));
            }
          }
          
          const baseImage = productData.images || productData.image || '';
          if (baseImage) {
            const gallery = Array(5).fill(baseImage);
            setImageGallery(gallery);
            setProductImage(baseImage);
          }
          
          const randomSold = Math.floor(Math.random() * (50 - 20 + 1)) + 20;
          setProductsSold(randomSold);
          
          setIsFavorite(checkIsInWishlist(id as string));
          setLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          setError('Failed to load product details');
          console.error(err);
          setLoading(false);
        }
      }
    };
    
    loadProduct();
    
    return () => {
      isMounted = false;
    };
  }, [id, checkIsInWishlist]);
  
  // Calculate tiered pricing based on quantity
  const calculateTieredPrice = (basePrice: number, quantity: number) => {
    if (quantity >= 20) {
      return basePrice * 0.9; // 10% discount
    } else if (quantity >= 10) {
      return basePrice * 0.95; // 5% discount
    }
    return basePrice;
  };

  // B2B Quantity Change Handler - Enforces MOQ and updates cart
  const handleQuantityChange = (change: number) => {
    const newQuantity = quantity + change;
    const itemId = selectedVariant ? String(selectedVariant.id) : String(product?.id);
    
    if (newQuantity < 5) {
      // Below MOQ - remove from cart entirely
      dispatch(removeFromCart(itemId));
    } else {
      // Valid quantity - update cart
      dispatch(updateQuantity({ id: itemId, quantity: newQuantity }));
    }
  };

  // Calculate final prices with tiered pricing
  const unitPrice = calculateTieredPrice(discountedPrice || 0, quantity);
  const subtotal = unitPrice * quantity;
  const gstAmount = showGst ? subtotal * 0.18 : 0;
  const totalPrice = subtotal + gstAmount;
  
  // B2B Add to Cart Handler - Adds with MOQ
  const handleAddToCart = () => {
    if (!product) return;
    
    const itemId = selectedVariant ? String(selectedVariant.id) : String(product.id);
    const cartItem = cartItems.find(item => item.id === itemId);
    
    if (cartItem && cartItem.quantity >= 5) {
      // Already in cart with valid quantity - do nothing
      return;
    }
    
    const safeDiscountedPrice = typeof discountedPrice === 'number' ? discountedPrice : 0;
    const safeOriginalPrice = typeof productPrice === 'number' ? productPrice : 0;
    
    if (selectedVariant) {
      const attributeKey = Object.keys(selectedVariant.attributes || {})[0];
      const attributeValue = selectedVariant.attributes?.[attributeKey] || '';
      const variantDisplay = attributeValue.toString().toUpperCase();
      
      dispatch(addToCart({
        id: String(selectedVariant.id),
        name: `${product.name} - ${variantDisplay}`,
        price: safeDiscountedPrice,
        originalPrice: safeOriginalPrice,
        image: productImage || product.images || product.image || '',
        quantity: 5, // Always add with MOQ
        discount: safeOriginalPrice > safeDiscountedPrice ? 
          Math.round((safeOriginalPrice - safeDiscountedPrice) / safeOriginalPrice * 100) : 0
      }));
    } else {
      dispatch(addToCart({
        id: String(product.id),
        name: product.name,
        price: safeDiscountedPrice,
        originalPrice: safeOriginalPrice,
        image: productImage || product.images || product.image || '',
        quantity: 5, // Always add with MOQ
        discount: safeOriginalPrice > safeDiscountedPrice ? 
          Math.round((safeOriginalPrice - safeDiscountedPrice) / safeOriginalPrice * 100) : 0
      }));
    }
  };
  
  const toggleFavorite = () => {
    if (product) {
      if (isFavorite) {
        dispatch(removeFromWishlist(product.id));
        Alert.alert("Removed from Wishlist", `${product.name} has been removed from your wishlist.`);
      } else {
        dispatch(addToWishlist(product));
        Alert.alert("Added to Wishlist", `${product.name} has been added to your wishlist.`);
      }
      setIsFavorite(!isFavorite);
    }
  };
  
  const navigateToReviews = () => {
    router.push('/product/reviews');
  };

  // Skeleton loader animation
  const [fadeAnim] = useState(new Animated.Value(0.3));
  
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0.3,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [fadeAnim]);
  
  const SkeletonPlaceholder = ({ width, height, style }: { width: number | string, height: number, style?: any }) => {
    return (
      <Animated.View
        style={[
          { width, height, backgroundColor: isDark ? '#333' : '#E1E9EE', opacity: fadeAnim, borderRadius: 4 },
          style,
        ]}
      />
    );
  };
  
  const handlePincodeSubmit = () => {
    if (pincode.length === 6) {
      setSubmittedPincode(pincode);
      const dispatchDate = new Date();
      dispatchDate.setDate(dispatchDate.getDate() + 2);
      const formattedDispatch = dispatchDate.toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' });
      setDeliveryDate(formattedDispatch);
      const arrival = new Date(dispatchDate);
      arrival.setDate(arrival.getDate() + 1);
      const formattedArrival = arrival.toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' });
      setArrivalDate(formattedArrival);
    }
  };

  const minPrice = Math.min(...recommendedProducts.map(p => p.price));

  const renderDetailedCard = (item: any, isBest: boolean, priceDiff: number) => {
    const mainProductPrice = discountedPrice || 0;
    const percentageSavings = mainProductPrice > 0 ? 
      Math.round(((mainProductPrice - item.price) / mainProductPrice) * 100) : 0;
    
          return (
        <View style={[styles.detailedCard, { backgroundColor: isDark ? '#333' : '#FFF', borderColor: isBest ? '#43a047' : '#E0E0E0' }]}>
          {isBest && (
            <View style={{
              position: 'absolute',
              top: -8,
              left: 16,
              right: 16,
              backgroundColor: '#43a047',
              paddingVertical: 4,
              borderRadius: 8,
              alignItems: 'center',
            }}>
              <Text style={{
                color: '#fff',
                fontSize: 11,
                fontWeight: 'bold',
              }}>RECOMMENDED</Text>
            </View>
          )}
          
          {percentageSavings > 0 && !isBest && (
            <View style={styles.savingsPercentageBadge}>
              <Text style={styles.savingsPercentageText}>{percentageSavings}% cheaper</Text>
            </View>
          )}
          {percentageSavings < 0 && !isBest && (
            <View style={styles.expensivePercentageBadge}>
              <Text style={styles.expensivePercentageText}>{Math.abs(percentageSavings)}% more</Text>
            </View>
          )}
          
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 16,
            marginTop: isBest ? 8 : 0,
          }}>
            <Image 
              source={{ uri: item.image }} 
              style={{
                width: 60,
                height: 60,
                marginRight: 12,
              }}
              resizeMode="contain"
              onError={() => console.log('Image failed to load:', item.image)}
            />
            <View style={{ flex: 1 }}>
              <Text style={styles.detailedBrand}>{item.brand}</Text>
              <Text style={styles.detailedPrice}>{formatPrice(item.price)}</Text>
              {priceDiff > 0 && <Text style={{ fontSize: 12, color: '#e53935' }}>+{formatPrice(priceDiff)}</Text>}
              {isBest && <Text style={{ fontSize: 12, color: '#43a047', fontWeight: 'bold' }}>Best Price</Text>}
            </View>
          </View>
        
        {mainProductPrice > 0 && percentageSavings !== 0 && (
          <View style={styles.comparisonSection}>
            <Text style={styles.comparisonLabel}>vs Original:</Text>
            <Text style={{
              fontSize: 14,
              fontWeight: 'bold',
              color: '#999',
              textDecorationLine: 'line-through',
            }}>
              {formatPrice(mainProductPrice)}
            </Text>
            {percentageSavings > 0 ? (
              <Text style={styles.savingsAmount}>Save {formatPrice(mainProductPrice - item.price)}</Text>
            ) : (
              <Text style={styles.extraAmount}>+{formatPrice(item.price - mainProductPrice)}</Text>
            )}
          </View>
        )}
        
        <View style={styles.infoSection}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>MOQ:</Text>
            <Text style={styles.infoValue}>{item.moq} units</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Margin:</Text>
            <Text style={styles.infoValue}>{item.margin}%</Text>
          </View>
        </View>
        
        <View style={styles.tieredSection}>
          <Text style={styles.tieredTitle}>Tiered Pricing:</Text>
          <Text style={styles.tieredDetail}>10-19: {formatPrice(item.tieredPricing['10-19'])}</Text>
          <Text style={styles.tieredDetail}>20+: {formatPrice(item.tieredPricing['20+'])}</Text>
        </View>
        
        <TouchableOpacity 
          style={[styles.detailedButton, { backgroundColor: isBest ? '#43a047' : colors.primary[600] }]}
          onPress={() => router.push(`/product/${item.id}`)}
        >
          <Text style={styles.buttonText}>Select Brand</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const handleCheckout = () => {
    router.push('/cart');
  };

  // Cart sync effect - Single source of truth for UI state
  useEffect(() => {
    const itemId = selectedVariant ? String(selectedVariant.id) : (product ? String(product.id) : null);
    if (!itemId) return;
    
    const cartItem = cartItems.find(item => item.id === itemId);
    
    if (cartItem && cartItem.quantity >= 5) {
      setShowQuantityControls(true);
      setQuantity(cartItem.quantity);
    } else {
      setShowQuantityControls(false);
      setQuantity(5); // Always show MOQ when not in cart
    }
  }, [cartItems, selectedVariant, product]);

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: isDark ? '#121212' : '#F8F8F8' }]}>
        <StatusBar style={isDark ? 'light' : 'dark'} />
        
        <View style={styles.header}>
          <View style={{ width: 40, height: 40, borderRadius: 20 }}>
            <SkeletonPlaceholder width={40} height={40} style={{ borderRadius: 20 }} />
          </View>
        </View>
        
        <ScrollView showsVerticalScrollIndicator={false}>
          <SkeletonPlaceholder width="100%" height={300} style={{ marginBottom: 20 }} />
          
          <View style={[styles.detailsContainer, { backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF', paddingHorizontal: 16 }]}>
            <SkeletonPlaceholder width="70%" height={28} style={{ marginBottom: 8 }} />
            <SkeletonPlaceholder width="50%" height={20} style={{ marginBottom: 16 }} />
            
            <View style={{ flexDirection: 'row', marginBottom: 16 }}>
              <SkeletonPlaceholder width={100} height={24} style={{ marginRight: 12 }} />
              <SkeletonPlaceholder width={80} height={24} />
            </View>
            
            <SkeletonPlaceholder width="100%" height={1} style={{ marginVertical: 16 }} />
            
            <SkeletonPlaceholder width="40%" height={24} style={{ marginBottom: 12 }} />
            
            <SkeletonPlaceholder width="100%" height={16} style={{ marginBottom: 8 }} />
            <SkeletonPlaceholder width="100%" height={16} style={{ marginBottom: 8 }} />
            <SkeletonPlaceholder width="100%" height={16} style={{ marginBottom: 8 }} />
            <SkeletonPlaceholder width="70%" height={16} style={{ marginBottom: 16 }} />
            
            <SkeletonPlaceholder width="100%" height={1} style={{ marginVertical: 16 }} />
            
            <SkeletonPlaceholder width="50%" height={24} style={{ marginBottom: 12 }} />
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
              <SkeletonPlaceholder width={40} height={40} style={{ marginRight: 12, borderRadius: 20 }} />
              <SkeletonPlaceholder width={50} height={30} style={{ marginRight: 12 }} />
              <SkeletonPlaceholder width={40} height={40} style={{ borderRadius: 20 }} />
            </View>
            
            <SkeletonPlaceholder width="60%" height={24} style={{ marginBottom: 12 }} />
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginBottom: 16 }}>
              <SkeletonPlaceholder width={100} height={60} style={{ marginRight: 8, marginBottom: 8, borderRadius: 8 }} />
              <SkeletonPlaceholder width={100} height={60} style={{ marginRight: 8, marginBottom: 8, borderRadius: 8 }} />
              <SkeletonPlaceholder width={100} height={60} style={{ borderRadius: 8, marginBottom: 8 }} />
            </View>
            
            <SkeletonPlaceholder width="100%" height={54} style={{ borderRadius: 8, marginBottom: 16 }} />
          </View>
        </ScrollView>
      </View>
    );
  }
  
  if (error || !product) {
    return (
      <View style={[styles.errorContainer, { backgroundColor: isDark ? '#121212' : '#F8F8F8' }]}>
        <Text variant="body" color="error">
          {error || 'Product not found'}
        </Text>
        <TouchableOpacity 
          style={[styles.errorButton, { backgroundColor: colors.primary[600] }]}
          onPress={() => router.back()}
        >
          <Text variant="body-sm" weight="semibold" color="inverse">Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: isDark ? '#121212' : '#F8F8F8' }]}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <View style={[styles.header, { backgroundColor: isDark ? 'rgba(18, 18, 18, 0.7)' : 'rgba(248, 248, 248, 0.7)' }]}>
        <BackButton />
      </View>
      <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollContainer}>
        {/* Product Images Gallery */}
        <View style={styles.imageGalleryContainer}>
          <Animated.ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            decelerationRate="fast"
            snapToInterval={imageWidth}
            snapToAlignment="start"
            style={styles.imageGallery}
            contentContainerStyle={styles.imageScrollContent}
            onScroll={Animated.event(
              [{ nativeEvent: { contentOffset: { x: scrollX } } }],
              { useNativeDriver: false }
            )}
            scrollEventThrottle={16}
            onMomentumScrollEnd={(event) => {
              const index = Math.round(event.nativeEvent.contentOffset.x / imageWidth);
              setCurrentImageIndex(index);
            }}
          >
            {imageGallery.map((imageUri, index) => (
              <TouchableOpacity 
                key={`image-${index}`} 
                style={styles.imageContainer}
                onPress={() => {
                  setLightboxImageIndex(index);
                  setLightboxVisible(true);
                }}
                activeOpacity={0.8}
              >
                <Image
                  source={{ uri: imageUri }}
                  style={styles.galleryImage}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            ))}
          </Animated.ScrollView>
          {numPages > 1 && (
            <View style={styles.imageDots}>
              {Array.from({ length: numPages }).map((_, i) => {
                const inputRange = [
                  (i - 1) * imageWidth * imagesPerPage,
                  i * imageWidth * imagesPerPage,
                  (i + 1) * imageWidth * imagesPerPage,
                ];
                const scale = scrollX.interpolate({
                  inputRange,
                  outputRange: [1, 1.5, 1],
                  extrapolate: 'clamp',
                });
                const backgroundColor = scrollX.interpolate({
                  inputRange,
                  outputRange: [isDark ? '#444' : '#DDD', colors.primary[600], isDark ? '#444' : '#DDD'],
                  extrapolate: 'clamp',
                });
                return (
                  <Animated.View
                    key={i}
                  style={[
                    styles.imageDot,
                    {
                        transform: [{ scale }],
                        backgroundColor,
                      },
                  ]}
                />
                );
              })}
            </View>
          )}
        </View>
        
        <View style={[
          styles.detailsContainer, 
          { backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF' }
        ]}>
          <Text variant="h3" weight="bold">
            {product.name}
          </Text>
          {selectedVariant && (
            <Text variant="h4" weight="medium" color="secondary" style={{ marginTop: 2, marginBottom: 4 }}>
              {(() => {
                const attributeKey = Object.keys(selectedVariant.attributes || {})[0];
                const attributeValue = selectedVariant.attributes?.[attributeKey] || '';
                return attributeValue ? `Variant: ${attributeValue.toString().toUpperCase()}` : '';
              })()}
            </Text>
          )}
          {product.brand && (
            <Text variant="body" color="secondary" style={styles.brandText}>
              {product.brand}
            </Text>
          )}
          
          {/* Ratings Display */}
          <View style={styles.ratingsContainer}>
            <TouchableOpacity 
              style={styles.ratingContainer}
              onPress={navigateToReviews}
            >
              <View style={styles.starsContainer}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star 
                    key={star}
                    size={16} 
                    color="#FFB800" 
                    fill={star <= (product.rating || 4) ? "#FFB800" : "none"}
                    style={styles.starIcon}
                  />
                ))}
              </View>
              <Text variant="body" color="secondary" style={styles.ratingText}>
                {typeof product.rating === 'number' ? product.rating.toFixed(1) : '0.0'} ({product.ratingCount || 0} reviews)
              </Text>
              <ChevronRight size={16} color={isDark ? '#BBBBBB' : '#666666'} />
            </TouchableOpacity>
          </View>
          
          {/* Sales Banner */}
          <View style={[styles.salesBanner, { backgroundColor: isDark ? '#2A5D31' : '#E8F5E9' }]}>
            <View style={styles.salesBannerContent}>
              <Text variant="body" weight="semibold" style={{ ...styles.salesText, color: isDark ? '#4CAF50' : '#2E7D32' }}>
                🔥 {productsSold}+ items sold recently!
               </Text>
            </View>
          </View>
          
          {/* PRODUCT VARIANTS SECTION */}
          {variants && variants.length > 0 && (
            <View style={{marginVertical: 16, padding: 16, borderRadius: 8, borderWidth: 1, borderColor: isDark ? '#333' : '#E0E0E0'}}>
              <Text variant="h4" weight="bold" style={styles.sectionTitle}>
                Select Variant
              </Text>
              {variants && variants.length > 0 ? (
                <>
                  <FlatList
                    data={variants}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    keyExtractor={(variant, index) => `variant-${variant.id || index}`}
                    contentContainerStyle={{paddingVertical: 8}}
                    renderItem={({ item: variant, index }) => {
                      const attributeKey = Object.keys(variant.attributes || {})[0];
                      const attributeValue = variant.attributes?.[attributeKey] || '';
                      const displayValue = attributeValue.toString().toUpperCase();
                      const regularPrice = parseFloat(String(variant.regular_price || 0));
                      const salePrice = parseFloat(String(variant.sale_price || variant.price || 0));
                      const discountPercent = regularPrice > 0 ? Math.round((regularPrice - salePrice) / regularPrice * 100) : 0;
                      const isSelected = selectedVariant?.id === variant.id;
                      const stockQuantity = variant.stock_quantity || 0;
                      
                      return (
                        <TouchableOpacity
                          key={`variant-${variant.id || index}`}
                          style={{
                            minWidth: 100,
                            marginRight: 8,
                            padding: 8,
                            borderWidth: isSelected ? 1 : 0.5,
                            borderColor: isSelected ? colors.primary[500] : '#ddd',
                            borderRadius: 8,
                            backgroundColor: isSelected ? (isDark ? '#2a3b4d' : '#f0f7ff') : (isDark ? '#333' : '#fff'),
                            position: 'relative',
                          }}
                          onPress={() => {
                            setSelectedVariant(variant);
                            setProductPrice(
                              variant.regular_price != null && !isNaN(Number(variant.regular_price))
                                ? Number(variant.regular_price)
                                : Number(variant.price)
                            );
                            setDiscountedPrice(
                              variant.sale_price != null && !isNaN(Number(variant.sale_price))
                                ? Number(variant.sale_price)
                                : Number(variant.price)
                            );
                          }}
                        >
                          <Text variant='body' weight='bold' style={{ color: isSelected ? colors.primary[700] : isDark ? '#fff' : '#333', marginBottom: 4}}>
                            {displayValue || `Option ${index + 1}`}
                          </Text>
                          <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 2}}>
                            <Text variant='body' weight='bold' style={{color: colors.primary[700]}}>
                              {formatPrice(salePrice)}
                            </Text>
                            {regularPrice > salePrice && (
                              <Text style={{fontSize: 11, textDecorationLine: 'line-through', color: '#888', marginLeft: 4}}>
                                {formatPrice(regularPrice)}
                              </Text>
                            )}
                          </View>
                          <View style={{flexDirection: 'row', alignItems: 'center', marginTop: 1}}>
                            <View style={{paddingHorizontal: 4, paddingVertical: 1, borderRadius: 3, backgroundColor: stockQuantity > 0 ? '#E8F5E9' : '#FFEBEE'}}>
                              <Text variant='body-sm' style={{color: stockQuantity > 0 ? '#2E7D32' : '#C62828'}}>
                                {stockQuantity > 0 ? 'In Stock' : 'Out of Stock'}
                              </Text>
                            </View>
                          </View>
                          {isSelected && (
                            <View style={{position: 'absolute', top: -6, right: -6, width: 16, height: 16, borderRadius: 8, backgroundColor: colors.primary[500], alignItems: 'center', justifyContent: 'center'}}>
                              <Text style={{color: 'white', fontSize: 10, fontWeight: 'bold'}}>✓</Text>
                            </View>
                          )}
                        </TouchableOpacity>
                      );
                    }}
                  />
                </>
              ) : (
                <View style={{padding: 16, backgroundColor: isDark ? '#333' : '#fff3f3', borderRadius: 8}}>
                  <Text style={{fontSize: 16, textAlign: 'center', color: '#ff4500'}}>
                    No variants found for this product.
                  </Text>
                </View>
              )}
            </View>
          )}
          
          {/* Price Section */}
          <View style={[styles.priceContainer, { backgroundColor: isDark ? '#222' : '#f5f5f5' }]}> 
            {productPrice !== null && discountedPrice !== null ? (
              productPrice > discountedPrice ? (
                <View style={{gap: 5, marginRight: 10}}>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text variant="body-sm" color="secondary" style={{ marginRight: 4 }}>
                      MRP
                    </Text>
                    <Text variant="body-sm" color="tertiary" style={{ textDecorationLine: 'line-through', marginLeft: 0, marginRight: 8 }}> 
                      {formatPrice(productPrice)}
                    </Text>
                  </View>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text variant="h4" weight="bold" style={{ marginRight: 8, color: colors.primary[700] }}>
                      {formatPrice(discountedPrice)}
                    </Text>
                    <Text
                      variant="body-sm"
                      weight="bold"
                      style={{
                        color: colors.primary[900],
                        backgroundColor: colors.primary[100],
                        borderRadius: 4,
                        paddingHorizontal: 4,
                        paddingVertical: 2,
                        fontSize: 12,
                        fontWeight: 'bold',
                        alignSelf: 'center',
                      }}
                    >
                      {Math.round(((productPrice - discountedPrice) / productPrice) * 100)}% OFF
                    </Text>
                  </View>
                </View>
              ) : (
                <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 10 }}>
                  <Text variant="h4" weight="bold" style={{ color: colors.primary[700] }}>
                    MRP: {formatPrice(discountedPrice)}
                  </Text>
                </View>
              )
            ) : null}

          <View style={{width: 1, height: '90%', backgroundColor: isDark ? '#333' : '#E0E0E0', marginHorizontal: 5}} />
          
          {showQuantityControls ? <View style={[styles.quantitySection]}>
            <View style={styles.quantityHeader}>
                <View style={{gap: 2}}>
                  <Text variant="body" weight="semibold">Quantity</Text>
                  <Text variant="body" weight="semibold" color="secondary">MOQ: 5 units</Text>
                </View>
              <View style={styles.quantityControls}>
                <TouchableOpacity 
                  style={[styles.modernQuantityButton, { backgroundColor: colors.primary[600] }]} 
                  onPress={() => handleQuantityChange(-1)}
                >
                  <Minus size={16} color="#FFFFFF" />
                </TouchableOpacity>
                
                  <Text variant="h4" weight="semibold" style={styles.quantityValue}>
                  {quantity}
                </Text>
                
                <TouchableOpacity 
                  style={[styles.modernQuantityButton, { backgroundColor: colors.primary[600] }]} 
                  onPress={() => handleQuantityChange(1)}
                >
                  <Plus size={16} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
            </View>
            </View> : 
              <TouchableOpacity
              style={{
                backgroundColor: colors.primary[600],
                borderRadius: 8,
                paddingHorizontal: 40,
                paddingVertical: 10,
                alignItems: 'center',
                justifyContent: 'center',
              }}
              onPress={handleAddToCart}
            >
              <Text variant="h4" weight="bold" color="inverse">Add</Text>
            </TouchableOpacity>
            }
          </View>
          
          {/* B2B Pricing Section */}
          <View style={[
            styles.b2bPricingContainer,
            { backgroundColor: isDark ? '#222' : '#f5f5f5' }
          ]}>
            <Text variant="h4" weight="semibold" style={styles.sectionTitle}>
              Bulk Order Pricing
            </Text>
            
            <View style={[
              styles.tieredPricingContainer,
              { borderBottomColor: isDark ? '#333' : '#E0E0E0' }
            ]}>
              <View style={styles.tierRow}>
                <Text variant="h4">1-9 units</Text>
                <Text variant="h4" weight="semibold">{formatPrice(discountedPrice || 0)}/unit</Text>
              </View>
              <View style={styles.tierRow}>
                <Text variant="h4">10-19 units</Text>
                <Text variant="h4" weight="semibold">
                  {formatPrice((discountedPrice || 0) * 0.95)}/unit
                  <Text variant="h4" weight="semibold" color="success"> (5% off)</Text>
                </Text>
              </View>
              <View style={styles.tierRow}>
                <Text variant="h4">20+ units</Text>
                <Text variant="h4" weight="semibold">
                  {formatPrice((discountedPrice || 0) * 0.9)}/unit
                  <Text variant="h4" weight="semibold" color="success"> (10% off)</Text>
                </Text>
              </View>
            </View>

            <View style={[
              styles.marginContainer,
              { borderBottomColor: isDark ? '#333' : '#E0E0E0' }
            ]}>
              <Text variant="body-sm" color="secondary">Retailer Margin</Text>
              <Text variant="body" weight="semibold" color="success">15%</Text>
            </View>

            <View style={styles.gstContainer}>
              <View style={styles.gstToggleRow}>
                <Text variant="body-sm" color="secondary">Show Prices with GST</Text>
                <TouchableOpacity 
                  style={[
                    styles.gstToggle,
                    { backgroundColor: showGst ? colors.primary[600] : (isDark ? '#333' : '#E0E0E0') }
                  ]}
                  onPress={() => setShowGst(!showGst)}
                >
                  <View style={[
                    styles.gstToggleKnob,
                    { transform: [{ translateX: showGst ? 20 : 0 }] }
                  ]} />
                </TouchableOpacity>
              </View>
              {showGst && (
                <Text variant="caption" color="secondary" style={styles.gstNote}>
                  All prices shown include 18% GST
                </Text>
              )}
            </View>
          </View>
          
          {/* Delivery Estimate Section */}
          <View style={[styles.deliverySection, { backgroundColor: isDark ? '#222' : '#f5f5f5' }]}> 
            <Text variant="h4" weight="semibold" style={styles.sectionTitle}>
              Estimated Delivery
            </Text>
              <View style={styles.pincodeInputRow}>
                <Text variant="body">Enter your pincode to check delivery date:</Text>
                <View style={styles.pincodeInputContainer}>
                  <TextInput
                    style={styles.pincodeInput}
                    value={pincode}
                    onChangeText={setPincode}
                    placeholder="Pincode"
                    keyboardType="number-pad"
                    maxLength={6}
                    placeholderTextColor={isDark ? '#888' : '#AAA'}
                  />
                  <TouchableOpacity
                    style={[styles.pincodeButton, { backgroundColor: colors.primary[600] }]}
                    onPress={handlePincodeSubmit}
                    disabled={pincode.length !== 6}
                  >
                  <Text variant="body" weight="semibold" color="inverse">Check</Text>
                  </TouchableOpacity>
                </View>
              </View>
            {deliveryDate && arrivalDate && <View style={styles.deliveryInfoRow}>
              <Text variant="body">
                Your order will be dispatched on 
                <Text weight="bold" color="success">{` ${deliveryDate}`}</Text> and it will reach you on 
                <Text weight="bold" color="success">{` ${arrivalDate}`}</Text>.
              </Text>
            </View>}
          </View>
          
          <View style={[styles.divider, { backgroundColor: isDark ? '#333333' : '#EEEEEE' }]} />
          
          {/* Product Description */}
          <View style={styles.descriptionContainer}>
            <Text variant="h4" weight="semibold" style={styles.sectionTitle}>
              Product Description
            </Text>
            {product.description ? (
              <RenderHtml
                contentWidth={screenWidth - 48}
                source={{ html: product.description }}
                tagsStyles={{
                  body: {
                    color: isDark ? '#FFFFFF' : '#333333',
                    fontSize: 15,
                    lineHeight: 18,
                    fontFamily: 'System',
                  },
                  ol: {
                    paddingLeft: 16,
                    marginVertical: 8,
                    alignItems: 'flex-start',
                  },
                  ul: {
                    paddingLeft: 16,
                    marginVertical: 8,
                    alignItems: 'flex-start',
                  },
                  li: {
                    color: isDark ? '#FFFFFF' : '#333333',
                    fontSize: 14,
                    lineHeight: 18,
                    marginBottom: 4,
                    textAlign: 'left',
                    alignItems: 'flex-start',
                    flexDirection: 'row',
                  },
                  p: {
                    color: isDark ? '#FFFFFF' : '#333333',
                    fontSize: 14,
                    lineHeight: 18,
                    marginBottom: 8,
                    textAlign: 'left',
                  },
                  strong: {
                    fontWeight: 'bold',
                    color: isDark ? '#FFFFFF' : '#333333',
                    fontSize: 14,
                  },
                  em: {
                    fontStyle: 'italic',
                    color: isDark ? '#FFFFFF' : '#333333',
                    fontSize: 16,
                  },
                }}
                renderersProps={{
                  ol: {
                    enableExperimentalRtl: false,
                  },
                  ul: {
                    enableExperimentalRtl: false,
                  },
                }}
              />
            ) : (
              <Text variant="body" style={styles.description}>
                No description available for this product.
              </Text>
            )}
          </View>

          {/* Product Details Section */}
          <View style={[styles.productDetailsSection, { backgroundColor: isDark ? '#222' : '#f5f5f5' }]}> 
            <Text variant="h4" weight="semibold" style={styles.sectionTitle}>
              Product Details
            </Text>
            <View style={styles.productDetailsList}>
              <View style={styles.productDetailsRow}>
                <Text variant="body" color="secondary">Manufacturer Name & Address</Text>
                <Text variant="body" weight="semibold">{product.manufacturer || 'N/A'}</Text>
              </View>
              <View style={styles.productDetailsRow}>
                <Text variant="body" color="secondary">Batch No#</Text>
                <Text variant="body" weight="semibold">{product.batchNo || 'N/A'}</Text>
              </View>
              <View style={styles.productDetailsRow}>
                <Text variant="body" color="secondary">Storage Instructions</Text>
                <Text variant="body" weight="semibold">{product.storageInstructions || 'Store in a cool, dry place'}</Text>
              </View>
              <View style={styles.productDetailsRow}>
                <Text variant="body" color="secondary">Product Weight</Text>
                <Text variant="body" weight="semibold">{product.weight || 'N/A'}</Text>
              </View>
              <View style={styles.productDetailsRow}>
                <Text variant="body" color="secondary">Pack Size</Text>
                <Text variant="body" weight="semibold">{product.packSize || '1,2,3-10'}</Text>
              </View>
              <View style={styles.productDetailsRow}>
                <Text variant="body" color="secondary">Expiry Date</Text>
                <Text variant="body" weight="semibold">{product.expiryDate || 'N/A'}</Text>
              </View>
            </View>
          </View>
          
          {/* Recommended Products Section */}
          <View style={[styles.recommendedSection, { backgroundColor: isDark ? '#222' : '#f5f5f5' }]}> 
            <Text variant="h4" weight="semibold" style={styles.sectionTitle}>
              Alternative Brands
            </Text>
            <FlatList
              data={recommendedProducts}
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.recommendedList}
              renderItem={({ item }) => {
                const isBest = item.price === minPrice;
                const priceDiff = item.price - minPrice;
                return renderDetailedCard(item, isBest, priceDiff);
              }}
            />
          </View>

          {/* Bundle Products Section */}
          <View style={[styles.bundleSection, { backgroundColor: isDark ? '#222' : '#f5f5f5' }]}> 
            <View style={styles.bundleHeader}>
              <Text variant="h4" weight="semibold" style={styles.sectionTitle}>
                Frequently Bought Together
              </Text>
              <View style={styles.bundleSubtitle}>
                <Text variant="body-sm" color="secondary">Save more when you buy as a bundle</Text>
              </View>
            </View>

            <View style={[styles.bundleCard, { backgroundColor: isDark ? '#333' : '#fff' }]}>
              <View style={styles.bundleCardHeader}>
                <View style={styles.bundleBadge}>
                  <Text style={styles.bundleBadgeText}>BUNDLE DEAL</Text>
                </View>
                <View style={styles.bundleDiscount}>
                  <Text style={styles.bundleDiscountText}>Save 15%</Text>
                </View>
              </View>

              <View style={styles.bundleProducts}>
                <View style={styles.bundleProductItem}>
                  <Image 
                    source={{ uri: product.images || product.image }} 
                    style={styles.bundleProductImage}
                    resizeMode="contain"
                  />
                  <Text style={styles.bundleProductName} numberOfLines={2}>{product.name}</Text>
                  <Text style={styles.bundleProductBrand}>{product.brand || 'Original Brand'}</Text>
                  <Text style={styles.bundleProductDetails}>30 Tablets • Pack of 1</Text>
                  <Text style={styles.bundleProductPrice}>{formatPrice(discountedPrice || 0)}</Text>
                  <View style={styles.bundleProductBadge}>
                    <Text style={styles.bundleProductBadgeText}>Main</Text>
                  </View>
                </View>

                <View style={styles.bundlePlusIcon}>
                  <Text style={styles.bundlePlusText}>+</Text>
                </View>

                <View style={styles.bundleProductItem}>
                  <Image 
                    source={{ uri: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=200&q=80' }} 
                    style={styles.bundleProductImage}
                    resizeMode="contain"
                  />
                  <Text style={styles.bundleProductName} numberOfLines={2}>Vitamin C 1000mg</Text>
                  <Text style={styles.bundleProductBrand}>WellnessCorp</Text>
                  <Text style={styles.bundleProductDetails}>60 Tablets • Immunity Booster</Text>
                  <Text style={styles.bundleProductPrice}>₹129</Text>
                  <View style={styles.bundleComplementBadge}>
                    <Text style={styles.bundleComplementBadgeText}>Complement</Text>
                  </View>
                </View>
              </View>

              <View style={styles.bundleBenefits}>
                <Text style={styles.bundleBenefitsTitle}>Why buy together?</Text>
                <View style={styles.bundleBenefitItem}>
                  <Text style={styles.bundleBenefitIcon}>🔥</Text>
                  <Text style={styles.bundleBenefitText}>Enhanced therapeutic effect when combined</Text>
                </View>
                <View style={styles.bundleBenefitItem}>
                  <Text style={styles.bundleBenefitIcon}>💰</Text>
                  <Text style={styles.bundleBenefitText}>Save ₹{(((discountedPrice || 0) + 129) * 0.15).toFixed(0)} compared to buying separately</Text>
                </View>
                <View style={styles.bundleBenefitItem}>
                  <Text style={styles.bundleBenefitIcon}>📦</Text>
                  <Text style={styles.bundleBenefitText}>Single delivery • Convenience guaranteed</Text>
                </View>
              </View>

              <View style={styles.bundlePricing}>
                <View style={styles.bundlePriceRow}>
                  <Text style={styles.bundlePriceLabel}>Individual Price:</Text>
                  <Text style={{ 
                    fontSize: 14,
                    textDecorationLine: 'line-through', 
                    color: '#999' 
                  }}>
                    ₹{((discountedPrice || 0) + 129).toFixed(0)}
                  </Text>
                </View>
                <View style={styles.bundlePriceRow}>
                  <Text style={styles.bundlePriceLabelMain}>Bundle Price:</Text>
                  <Text style={styles.bundlePriceValueMain}>
                    ₹{(((discountedPrice || 0) + 129) * 0.85).toFixed(0)}
                  </Text>
                </View>
                <View style={styles.bundleSavings}>
                  <Text style={styles.bundleSavingsText}>
                    You save ₹{(((discountedPrice || 0) + 129) * 0.15).toFixed(0)} (15% OFF)
                  </Text>
                </View>
              </View>

              <TouchableOpacity style={styles.bundleAddButton}>
                <Text style={styles.bundleAddButtonText}>Add Bundle to Cart</Text>
              </TouchableOpacity>
            </View>
          </View>
          
          <View style={[styles.divider, { backgroundColor: isDark ? '#333333' : '#EEEEEE' }]} />
          
          {/* Product Highlights */}
          {product.highlights && (
            <View style={styles.highlightsContainer}>
              <Text variant="h4" weight="semibold" style={styles.sectionTitle}>
                Highlights
              </Text>
              <View style={styles.highlightsList}>
                {Array.isArray(product.highlights) ? (
                  product.highlights.map((highlight: string, index: number) => (
                    <View key={`highlight-${index}`} style={styles.highlightItem}>
                      <Text variant="body" style={styles.highlightText}>• {highlight}</Text>
                    </View>
                  ))
                ) : (
                  <Text variant="body" style={styles.description}>{product.highlights}</Text>
                )}
              </View>
            </View>
          )}
          
          {/* Policies Section */}
          <Policies />
          
          {/* Brand Section */}
          <View style={{
            marginTop: 20,
            backgroundColor: isDark ? '#1C1C1E' : '#FFFFFF',
            borderRadius: 16,
            overflow: 'hidden',
            elevation: 3,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 8,
            marginBottom: 16
          }}>
            <View style={{
              backgroundColor: isDark ? '#2C2C2E' : '#F8F9FA',
              paddingHorizontal: 20,
              paddingVertical: 16,
              borderBottomWidth: 1,
              borderBottomColor: isDark ? '#3A3A3C' : '#E5E5EA',
              gap: 15
            }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <View style={{
                  backgroundColor: colors.primary[500],
                  paddingHorizontal: 12,
                  paddingVertical: 6,
                  borderRadius: 20,
                  flexDirection: 'row',
                  alignItems: 'center'
                }}>
                  <View style={{
                    width: 6,
                    height: 6,
                    borderRadius: 3,
                    backgroundColor: '#FFFFFF',
                    marginRight: 6
                  }} />
                  <Text style={{ 
                    color: '#FFFFFF', 
                    fontSize: 12, 
                    fontWeight: '600' 
                  }}>
                    ABOUT US
                  </Text>
                </View>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <View>
                  <Text style={{ 
                    fontSize: 20, 
                    fontWeight: '700', 
                    color: isDark ? '#FFFFFF' : '#1D1D1F',
                    letterSpacing: -0.5 
                  }}>
                    Sarvahitha Ayurvedalaya Pvt. Ltd.
                  </Text>
                </View>
              </View>
            </View>

            <View style={{ 
              paddingHorizontal: 20,
              paddingVertical: 20,
              borderLeftWidth: 1,
              borderRightWidth: 1,
              borderColor: isDark ? '#3A3A3C' : '#E5E5EA',
              backgroundColor: isDark ? '#1C1C1E' : '#FFFFFF',
            }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <View style={{ alignItems: 'center', flex: 1 }}>
                  <Text weight='bold' style={{ 
                    fontSize: 24, 
                    fontWeight: '900', 
                    color: colors.primary[700],
                    lineHeight: 28
                  }}>
                    10K+
                  </Text>
                  <Text style={{ 
                    fontSize: 15,
                    lineHeight: 20,
                    color: isDark ? '#8E8E93' : '#6D6D70',
                  }}>
                    Products
                  </Text>
                </View>
                
                <View style={{
                  width: 1,
                  height: 40,
                  backgroundColor: isDark ? '#3A3A3C' : '#E5E5EA',
                  marginHorizontal: 16
                }} />
                
                <View style={{ alignItems: 'center', flex: 1 }}>
                  <Text weight='bold' style={{ 
                    fontSize: 24, 
                    fontWeight: '900', 
                    color: colors.primary[700],
                    lineHeight: 28
                  }}>
                    20K+
                  </Text>
                  <Text style={{ 
                    fontSize: 15,
                    lineHeight: 20,
                    color: isDark ? '#8E8E93' : '#6D6D70',
                  }}>
                    Pincodes
                  </Text>
                </View>
                
                <View style={{
                  width: 1,
                  height: 40,
                  backgroundColor: isDark ? '#3A3A3C' : '#E5E5EA',
                  marginHorizontal: 16
                }} />
                
                <View style={{ alignItems: 'center', flex: 1 }}>
                  <Text weight='bold' style={{ 
                    fontSize: 24, 
                    fontWeight: '900', 
                    color: colors.primary[700],
                    lineHeight: 28
                  }}>
                    5K+
                  </Text>
                  <Text style={{ 
                    fontSize: 15,
                    lineHeight: 20,
                    color: isDark ? '#8E8E93' : '#6D6D70',
                  }}>
                    Partners
                  </Text>
                </View>
              </View>
            </View>

            <View style={{
              backgroundColor: isDark ? '#1C1C1E' : '#F8F9FA',
              paddingHorizontal: 20,
              paddingVertical: 16,
              borderTopWidth: 1,
              borderTopColor: isDark ? '#3A3A3C' : '#E5E5EA'
            }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
                <View style={{ alignItems: 'center', flex: 1 }}>
                  <View style={{
                    width: 40,
                    height: 40,
                    borderRadius: 16,
                    backgroundColor: colors.primary[100],
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: 8
                  }}>
                    <Text style={{ fontSize: 16 }}>🏆</Text>
                  </View>
                  <Text style={{ 
                    fontSize: 15,
                    lineHeight: 20,
                    color: isDark ? '#8E8E93' : '#6D6D70',
                    textAlign: 'center'
                  }}>
                    ISO Certified
                  </Text>
                </View>
                
                <View style={{ alignItems: 'center', flex: 1 }}>
                  <View style={{
                    width: 40,
                    height: 40,
                    borderRadius: 16,
                    backgroundColor: colors.primary[100],
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: 8
                  }}>
                    <Text style={{ fontSize: 16 }}>⚡</Text>
                  </View>
                  <Text style={{ 
                    fontSize: 15,
                    lineHeight: 20,
                    color: isDark ? '#8E8E93' : '#6D6D70',
                    textAlign: 'center'
                  }}>
                    Fast Delivery
                  </Text>
                </View>
                
                <View style={{ alignItems: 'center', flex: 1 }}>
                  <View style={{
                    width: 40,
                    height: 40,
                    borderRadius: 16,
                    backgroundColor: colors.primary[100],
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: 8
                  }}>
                    <Text style={{ fontSize: 16 }}>🔒</Text>
                  </View>
                  <Text style={{ 
                    fontSize: 15,
                    lineHeight: 20,
                    color: isDark ? '#8E8E93' : '#6D6D70',
                    textAlign: 'center'
                  }}>
                    Secure
                  </Text>
                </View>
                
                <View style={{ alignItems: 'center', flex: 1 }}>
                  <View style={{
                    width: 40,
                    height: 40,
                    borderRadius: 16,
                    backgroundColor: colors.primary[100],
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: 8
                  }}>
                    <Text style={{ fontSize: 16 }}>✓</Text>
                  </View>
                  <Text style={{ 
                    fontSize: 15,
                    lineHeight: 20,
                    color: isDark ? '#8E8E93' : '#6D6D70',
                    textAlign: 'center'
                  }}>
                    Genuine
                  </Text>
                </View>
              </View>
            </View>

            <View style={{
              backgroundColor: isDark ? '#1C1C1E' : '#FFFFFF',
              paddingHorizontal: 5,
              paddingVertical: 20,
              borderTopWidth: 1,
              borderTopColor: isDark ? '#3A3A3C' : '#E5E5EA'
            }}>
              <Text style={{ 
                fontSize: 16, 
                fontWeight: '600',
                color: isDark ? '#FFFFFF' : '#1D1D1F',
                marginBottom: 12
              }}>
                About Sarvahitha
              </Text>
              
              <Text style={{
                fontSize: 15,
                lineHeight: 20,
                color: isDark ? '#8E8E93' : '#6D6D70',
                marginBottom: 16
              }}>
                Founded in 2015, Sarvahitha has emerged as India's leading B2B pharmaceutical distributor, committed to bridging the gap between manufacturers and healthcare providers. We specialize in authentic Ayurvedic medicines, ensuring quality assurance through rigorous testing protocols and maintaining cold chain logistics across 20,000+ pincodes nationwide. Our dedicated team of pharmaceutical experts works round-the-clock to provide seamless order fulfillment and timely delivery. With ISO certification and government approvals, we serve over 5,000 trusted partners including hospitals, clinics, and retail pharmacies, making healthcare accessible to millions across India.
              </Text>

              <TouchableOpacity 
                style={{
                  width: '100%',
                  height: 200,
                  backgroundColor: '#000',
                  borderRadius: 12,
                  overflow: 'hidden',
                  position: 'relative',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
                onPress={() => {
                  Linking.openURL('https://www.youtube.com/watch?v=FoRB3WPYsjw');
                }}
              >
                <Image
                  source={{ uri: 'https://img.youtube.com/vi/FoRB3WPYsjw/maxresdefault.jpg' }}
                  style={{
                    width: '100%',
                    height: '100%',
                    position: 'absolute'
                  }}
                  resizeMode="cover"
                />
                
                <View style={{
                  width: 60,
                  height: 60,
                  borderRadius: 30,
                  backgroundColor: colors.primary[500],
                  alignItems: 'center',
                  justifyContent: 'center',
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.3,
                  shadowRadius: 4,
                  elevation: 5
                }}>
                  <Text style={{ 
                    color: 'white',
                    marginLeft: 4 
                  }}>
                    <Play size={24} color="white" />
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
      
      {/* Footer Section */}
      <View style={[
        styles.footer, 
        { 
          backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF',
          borderTopColor: isDark ? '#333333' : '#EEEEEE' 
        }
      ]}>
        <View style={styles.totalContainer}>
          <Text variant="body-sm" color="secondary">
            Cart Total
          </Text>
          <View style={styles.totalPriceRow}>
            <Text variant="h4" weight="bold" color="accent">
              {formatPrice(cartTotal)}
            </Text>
            {cartSavings > 0 && (
              <Text variant="body" style={{ textDecorationLine: 'line-through', color: isDark ? '#888' : '#666' }}>
                {formatPrice(cartTotal + cartSavings)}
              </Text>
            )}
          </View>
        </View>
        <TouchableOpacity
          style={[styles.addToCartButton, { marginRight: 10, backgroundColor: colors.primary[100] } ]}
          onPress={() => setShowCartPreview(true)}
        >
          <Text variant="body" weight="semibold">Preview</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.addToCartButton, { backgroundColor: colors.primary[600] }]} 
          onPress={handleCheckout}
        >
          <ShoppingCart size={18} color="#FFFFFF" />
          <Text variant="body" weight="semibold" color="inverse" style={styles.addToCartButtonText}>
            Checkout
          </Text>
        </TouchableOpacity>
        
      </View>
      <CartPreviewModal visible={showCartPreview} onClose={() => setShowCartPreview(false)} />

      {/* Price Breakup Bottom Sheet */}
      <Modal
        visible={showPriceBreakup}
        transparent
        animationType="slide"
        onRequestClose={() => setShowPriceBreakup(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay} 
          activeOpacity={1} 
          onPress={() => setShowPriceBreakup(false)}
        >
          <View 
            style={[
              styles.breakupSheet,
              { backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF' }
            ]}
          >
            <View style={styles.breakupHandle} />
            
            <Text variant="h4" weight="semibold" style={styles.breakupTitle}>
              Price Breakup
            </Text>
            
            <View style={styles.breakupContent}>
              <View style={styles.breakupRow}>
                <Text variant="body">Unit Price</Text>
                <Text variant="body" weight="semibold">{formatPrice(unitPrice)}</Text>
              </View>
              
              <View style={styles.breakupRow}>
                <Text variant="body">Quantity</Text>
                <Text variant="body" weight="semibold">× {quantity}</Text>
              </View>
              
              <View style={[styles.breakupRow, styles.subtotalRow]}>
                <Text variant="body">Subtotal</Text>
                <Text variant="body" weight="semibold">{formatPrice(subtotal)}</Text>
              </View>
              
              {showGst && (
                <View style={styles.breakupRow}>
                  <Text variant="body">GST (18%)</Text>
                  <Text variant="body" weight="semibold">{formatPrice(gstAmount)}</Text>
                </View>
              )}
              
              <View style={[styles.breakupRow, styles.totalRow]}>
                <Text variant="h4" weight="semibold">Total</Text>
                <Text variant="h4" weight="bold" color="accent">
                  {formatPrice(totalPrice)}
                </Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>

    {/* Lightbox Modal */}
    <Modal
      visible={lightboxVisible}
      transparent={true}
      animationType="fade"
      onRequestClose={() => setLightboxVisible(false)}
    >
      <View style={styles.lightboxContainer}>
        <TouchableOpacity 
          style={styles.lightboxBackground} 
          onPress={() => setLightboxVisible(false)}
          activeOpacity={1}
        />
        
        <View style={styles.lightboxContent}>
          <ScrollView
            ref={lightboxScrollViewRef}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            contentOffset={{ x: lightboxImageIndex * screenWidth, y: 0 }}
            onMomentumScrollEnd={(event) => {
              const index = Math.round(event.nativeEvent.contentOffset.x / screenWidth);
              setLightboxImageIndex(index);
            }}
            style={styles.lightboxScrollView}
          >
            {imageGallery.map((imageUri, index) => (
              <TouchableOpacity 
                key={`lightbox-${index}`} 
                style={styles.lightboxImageContainer}
                activeOpacity={1}
                onPress={() => {}}
              >
                <Image
                  source={{ uri: imageUri }}
                  style={styles.lightboxImage}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            ))}
          </ScrollView>
          
          <TouchableOpacity 
            style={styles.lightboxCloseButton}
            onPress={() => setLightboxVisible(false)}
          >
            <Text style={styles.lightboxCloseText}>✕</Text>
          </TouchableOpacity>
          
          {imageGallery.length > 1 && (
            <View style={styles.lightboxThumbnails}>
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.thumbnailsContainer}
              >
                {imageGallery.map((imageUri, index) => (
                  <TouchableOpacity
                    key={`thumbnail-${index}`}
                    style={[
                      styles.lightboxThumbnail,
                      {
                        borderColor: index === lightboxImageIndex
                          ? '#FFFFFF'
                          : 'rgba(255, 255, 255, 0.3)',
                        borderWidth: index === lightboxImageIndex ? 2 : 1,
                      }
                    ]}
                                         onPress={() => {
                       setLightboxImageIndex(index);
                       lightboxScrollViewRef.current?.scrollTo({
                         x: index * screenWidth,
                         y: 0,
                         animated: true
                       });
                     }}
                  >
                    <Image
                      source={{ uri: imageUri }}
                      style={styles.thumbnailImage}
                      resizeMode="cover"
                    />
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}
        </View>
      </View>
    </Modal>
  </View>
);
}

function ChevronRight({ size, color }: { size: number, color: string }) {
  return (
    <View style={{ width: size, height: size, marginLeft: 4 }}>
      <View style={{ transform: [{ rotate: '-45deg' }], width: size/2, height: size/2, borderBottomWidth: 2, borderRightWidth: 2, borderColor: color, position: 'absolute', bottom: size/4, right: size/4 }} />
    </View>
  );
}

const screenWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flex: 1,
  },
  imageGalleryContainer: {},
  imageGallery: {
    height: 250,
  },
  imageScrollContent: {
    flexDirection: 'row',
    paddingHorizontal: 16,
  },
  imageContainer: {
    width: screenWidth * 0.5,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    paddingVertical: 5,
  },
  galleryImage: {
    width: '100%',
    height: '100%',
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    objectFit: 'cover',
  },
  imageDots: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 35,
    left: 0,
    right: 0,
    zIndex: 100,
  },
  imageDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 3,
  },
  specificationsContainer: {
    marginTop: 24,
  },
  attributesContainer: {
    marginTop: 8,
    marginBottom: 16,
  },
  attributeItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  descriptionContainer: {
    marginTop: 16,
    marginBottom: 16,
  },
  highlightsContainer: {
    marginTop: 8,
    marginBottom: 16,
  },
  highlightsList: {
    marginTop: 8,
  },
  highlightItem: {
    marginBottom: 4,
  },
  highlightText: {
    lineHeight: 22,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  errorButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    marginTop: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 12,
    paddingTop: 50,
    height: 95,
  },
  favoriteButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  discountBadge: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: '#FF4500',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  discountText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: 'Poppins-Bold',
  },
  detailsContainer: {
    flex: 1,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: -24,
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 100,
  },
  brandText: {
    marginTop: 4,
    marginBottom: 8,
    fontStyle: 'italic',
  },
  ratingsContainer: {
    marginBottom: 16,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  starsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 8,
  },
  starIcon: {
    marginRight: 2,
  },
  salesBanner: {
    width: '100%',
    borderRadius: 8,
    padding: 12,
    marginVertical: 14,
    borderWidth: 1,
    borderColor: 'rgba(76, 175, 80, 0.3)',
  },
  salesBannerContent: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  salesText: {
    flex: 1,
    textAlign: 'center',
  },
  salesSubtext: {
    fontStyle: 'italic',
  },
  variationsContainer: {
    marginTop: 24,
    marginBottom: 16,
  },
  sectionTitle: {
    marginBottom: 12,
  },
  variantsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -4,
  },
  variantItem: {
    borderRadius: 8,
    padding: 12,
    marginHorizontal: 4,
    marginBottom: 8,
    minWidth: 100,
    alignItems: 'center',
  },
  selectedVariant: {
    borderWidth: 2,
    borderColor: colors.primary[600],
  },
  ratingText: {
    marginLeft: 8,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: 12,
  },
  originalPrice: {
    textDecorationLine: 'line-through',
    marginLeft: 12,
  },
  divider: {
    height: 1,
    marginVertical: 16,
  },
  description: {
    marginTop: 8,
    lineHeight: 24,
  },
  reviewsSection: {
    marginVertical: 8,
  },
  reviewsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  reviewItem: {
    marginBottom: 16,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  reviewRating: {
    flexDirection: 'row',
  },
  noReviewsText: {
    fontStyle: 'italic',
    marginBottom: 16,
  },
  writeReviewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    paddingVertical: 12,
    marginTop: 8,
  },
  writeReviewText: {
    marginLeft: 8,
  },
  quantityContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 15,
  },
  quantityButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityValue: {
    marginHorizontal: 10,
    minWidth: 24,
    textAlign: 'center',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
    paddingBottom: 32,
  },
  totalContainer: {
    flex: 1,
  },
  addToCartButton: {
    flexDirection: 'row',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addToCartButtonText: {
    marginLeft: 8,
  },
  lightboxContainer: {
    flex: 1,
    position: 'relative',
  },
  lightboxBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
  },
  lightboxContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  lightboxScrollView: {
    flex: 1,
  },
  lightboxImageContainer: {
    width: screenWidth,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  lightboxImage: {
    width: '100%',
    height: '70%',
    maxHeight: 500,
  },
  lightboxCloseButton: {
    position: 'absolute',
    top: 60,
    right: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  lightboxCloseText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  lightboxThumbnails: {
    position: 'absolute',
    bottom: 60,
    left: 0,
    right: 0,
    height: 80,
  },
  thumbnailsContainer: {
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  lightboxThumbnail: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginHorizontal: 4,
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  thumbnailImage: {
    width: '100%',
    height: '100%',
  },
  b2bPricingContainer: {
    marginTop: 16,
    padding: 16,
    borderRadius: 12,
  },
  moqContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
  },
  tieredPricingContainer: {
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
  },
  tieredPricingTitle: {
    marginBottom: 8,
  },
  tierRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  marginContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
  },
  gstContainer: {
    marginBottom: 8,
  },
  gstToggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  gstToggle: {
    width: 44,
    height: 24,
    borderRadius: 12,
    padding: 2,
  },
  gstToggleKnob: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
  },
  gstNote: {
    marginTop: 4,
  },
  quantitySection: {},
  quantityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  modernQuantityButton: {
    width: 24,
    height: 24,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  totalPriceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  chevronIcon: {
    marginLeft: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  breakupSheet: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingTop: 12,
  },
  breakupHandle: {
    width: 40,
    height: 4,
    backgroundColor: '#E0E0E0',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 16,
  },
  breakupTitle: {
    marginBottom: 24,
  },
  breakupContent: {
    paddingBottom: 24,
  },
  breakupRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  subtotalRow: {
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  totalRow: {
    marginTop: 8,
  },
  deliverySection: {
    marginTop: 16,
    padding: 16,
    borderRadius: 12,
  },
  deliveryInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  pincodeInputRow: {
    marginTop: 8,
  },
  pincodeInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  pincodeInput: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
    backgroundColor: '#FFF',
    marginRight: 8,
    color: '#222',
  },
  pincodeButton: {
    paddingHorizontal: 20,
    height: 40,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  productDetailsSection: {
    marginTop: 16,
    padding: 16,
    borderRadius: 12,
  },
  productDetailsList: {
    marginTop: 8,
  },
  productDetailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  recommendedSection: {
    marginTop: 16,
    padding: 16,
    borderRadius: 12,
  },
  recommendedList: {
    flexDirection: 'row',
    marginTop: 12,
  },
  recommendedCard: {
    width: 160,
    marginRight: 16,
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
    position: 'relative',
  },
  bestOfferBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: '#43a047',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    zIndex: 2,
  },
  bestOfferText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: 'bold',
  },
  recommendedImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: '#f5f5f5',
  },
  recommendedName: {
    marginBottom: 2,
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 14,
  },
  recommendedBrand: {
    marginBottom: 4,
    textAlign: 'center',
    fontSize: 12,
  },
  recommendedPrice: {
    marginBottom: 2,
    fontSize: 16,
  },
  savingsText: {
    color: '#43a047',
    fontSize: 12,
    marginBottom: 4,
  },
  extraText: {
    color: '#e53935',
    fontSize: 12,
    marginBottom: 4,
  },
  selectButton: {
    marginTop: 8,
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  designPicker: {
    marginTop: 16,
    padding: 16,
    borderRadius: 12,
  },
  pickerTitle: {
    marginBottom: 12,
  },
  designButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  designButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    marginRight: 8,
    marginBottom: 8,
  },
  designButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  hidePickerButton: {
    alignSelf: 'center',
  },
  hidePickerText: {
    color: colors.primary[600],
    fontSize: 14,
  },
  showPickerText: {
    color: colors.primary[600],
    fontSize: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  
  compactCard: {
    width: 140,
    marginRight: 12,
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    borderWidth: 2,
    position: 'relative',
  },
  moqBadgeCompact: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#ff9800',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  moqText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  compactImage: {
    width: 60,
    height: 60,
    marginBottom: 8,
  },
  compactBrand: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  compactPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.primary[600],
    marginBottom: 4,
  },
  marginText: {
    fontSize: 11,
    color: '#43a047',
    marginBottom: 8,
  },
  compactButton: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  
  badgeCard: {
    width: 160,
    marginRight: 12,
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  badgeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8,
    justifyContent: 'center',
  },
  bestBadge: {
    backgroundColor: '#43a047',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    margin: 2,
  },
  moqBadge: {
    backgroundColor: '#ff9800',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    margin: 2,
  },
  marginBadge: {
    backgroundColor: '#2196f3',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    margin: 2,
  },
  badgeText: {
    color: '#fff',
    fontSize: 9,
    fontWeight: 'bold',
  },
  badgeImage: {
    width: 70,
    height: 70,
    marginBottom: 8,
  },
  badgeBrand: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  badgePrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.primary[600],
    marginBottom: 4,
  },
  tieredInfo: {
    alignItems: 'center',
    marginBottom: 8,
  },
  tieredText: {
    fontSize: 10,
    color: '#666',
  },
  badgeButton: {
    backgroundColor: colors.primary[600],
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 6,
  },
  
  detailedCard: {
    width: 180,
    marginRight: 12,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 2,
    position: 'relative',
  },
  detailedImage: {
    width: 80,
    height: 80,
    marginBottom: 12,
  },
  detailedBrand: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  detailedPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary[600],
    marginBottom: 12,
  },
  infoSection: {
    width: '100%',
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  infoLabel: {
    fontSize: 12,
    color: '#666',
  },
  infoValue: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  tieredSection: {
    width: '100%',
    marginBottom: 12,
  },
  tieredTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  tieredDetail: {
    fontSize: 11,
    color: '#666',
    marginBottom: 2,
  },
  detailedButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 8,
  },
  
  savingsPercentageBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: '#43a047',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    zIndex: 1,
  },
  savingsPercentageText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  expensivePercentageBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: '#e53935',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    zIndex: 1,
  },
  expensivePercentageText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  comparisonSection: {
    alignItems: 'center',
    marginVertical: 8,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    width: '100%',
  },
  comparisonLabel: {
    fontSize: 10,
    color: '#666',
    marginBottom: 2,
  },
  comparisonPrice: {
    fontSize: 12,
    color: '#999',
    marginBottom: 2,
  },
  savingsAmount: {
    fontSize: 11,
    color: '#43a047',
    fontWeight: 'bold',
  },
  extraAmount: {
    fontSize: 11,
    color: '#e53935',
    fontWeight: 'bold',
  },

  bundleSection: {
    marginTop: 16,
    padding: 16,
    borderRadius: 12,
  },
  bundleHeader: {
    marginBottom: 16,
  },
  bundleSubtitle: {
    marginTop: 4,
  },
  
  bundleCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  bundleCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  bundleBadge: {
    backgroundColor: '#43a047',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  bundleBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  bundleDiscount: {
    backgroundColor: '#ff5722',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  bundleDiscountText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  bundleProducts: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  bundleProductItem: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  bundleProductImage: {
    width: 60,
    height: 60,
    marginBottom: 8,
    borderRadius: 8,
  },
  bundleProductName: {
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 4,
  },
  bundleProductPrice: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.primary[600],
  },
  bundlePlusIcon: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 8,
  },
  bundlePlusText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#666',
  },
  bundlePricing: {
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    paddingTop: 16,
    marginBottom: 16,
  },
  bundlePriceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  bundlePriceLabel: {
    fontSize: 14,
    color: '#666',
  },
  bundlePriceLabelMain: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  bundlePriceValue: {
    fontSize: 14,
  },
  bundlePriceValueMain: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary[600],
  },
  bundleSavings: {
    alignItems: 'center',
    marginTop: 8,
  },
  bundleSavingsText: {
    fontSize: 14,
    color: '#43a047',
    fontWeight: 'bold',
  },
  bundleAddButton: {
    backgroundColor: colors.primary[600],
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  bundleAddButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },

  bundleProductBrand: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  bundleProductDetails: {
    fontSize: 11,
    color: '#888',
    marginBottom: 4,
  },
  bundleProductBadge: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: '#007AFF',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  bundleProductBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '600',
  },
  bundleComplementBadge: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: '#34C759',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  bundleComplementBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '600',
  },
  bundleBenefits: {
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  bundleBenefitsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  bundleBenefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  bundleBenefitIcon: {
    fontSize: 16,
    marginRight: 8,
    width: 20,
  },
  bundleBenefitText: {
    fontSize: 12,
    color: '#555',
    flex: 1,
  },
});