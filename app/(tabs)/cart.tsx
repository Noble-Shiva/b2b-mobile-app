import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, Image, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useRouter, useNavigation } from 'expo-router';
import { ArrowRight, Settings, Gift, TrendingUp, ArrowLeft, Wallet } from 'lucide-react-native';
import { StatusBar } from 'expo-status-bar';
import CartItemDesign3 from '@/components/cart/CartItemDesign3';
import { formatPrice } from '@/utils/helpers';
import { Text, Button } from '@/components/ui';
import { colors } from '@/utils/theme';
import { useSelector, useDispatch } from 'react-redux';
import { selectCartItems, selectTotalItems, selectSubtotal, selectDiscount, selectTotal, removeFromCart, updateQuantity, addToCart, CartItem } from '@/store/cartSlice';
import { selectIsDark } from '@/store/themeSlice';
import { selectToken, getAuthToken } from '@/store/authSlice';



export default function CartScreen() {
  const router = useRouter();
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const items = useSelector(selectCartItems);
  const totalItems = useSelector(selectTotalItems);
  const subtotal = useSelector(selectSubtotal);
  const discount = useSelector(selectDiscount);
  const total = useSelector(selectTotal);
  const isDark = useSelector(selectIsDark);

  // Check if we should show back button (when not navigating from tabs)
  const [showBackButton, setShowBackButton] = useState(false);
  
  useEffect(() => {
    // Check if we can go back and if the previous route was not a tab
    const canGoBack = navigation.canGoBack();
    
    if (canGoBack) {
      const state = navigation.getState();
      
      if (state?.routes && state.routes.length > 1) {
        const currentRouteIndex = state.index;
        const previousRoute = state.routes[currentRouteIndex - 1];
        
        // Show back button if previous route is not a tab route
        const isFromTab = previousRoute?.name?.includes('(tabs)') || 
                         previousRoute?.name === 'index' ||
                         previousRoute?.name === 'search' ||
                         previousRoute?.name === 'profile' ||
                         previousRoute?.name === 'reorder';
        
        setShowBackButton(!isFromTab);
      } else {
        setShowBackButton(true);
      }
    }
  }, [navigation]);

  // Add sample B2B products for testing if cart is empty
  useEffect(() => {
    if (items.length === 0) {
      // Add sample products to demonstrate functionality
      const sampleProducts = [
        {
          id: 'ash-001',
          name: 'Ashwagandha Premium Capsules - 60 Count',
          price: 120,
          originalPrice: 150,
          quantity: 20,
          image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=300&auto=format&fit=crop',
          category: 'Immunity'
        },
        {
          id: 'tri-002',
          name: 'Triphala Digestive Tablets - 90 Count',
          price: 180,
          originalPrice: 220,
          quantity: 15,
          image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?q=80&w=300&auto=format&fit=crop',
          category: 'Digestion'
        }
      ];

      sampleProducts.forEach(product => {
        dispatch(addToCart(product));
      });
    }
  }, [dispatch, items.length]);
  
  // Using Design 3 (Expandable) for all cart items

  // Get token from Redux state
  const authToken = useSelector(selectToken);

  // Calculate total savings from Redux cart items
  const calculateTotalSavings = () => {
    const cartSavings = items.reduce((total, item) => {
      const originalPrice = item.originalPrice || item.price * 1.25; // Fallback if no original price
      return total + ((originalPrice - item.price) * item.quantity);
    }, 0);
    return cartSavings + discount;
  };

  // Calculate potential additional savings if user upgrades to next tiers
  const calculatePotentialSavings = () => {
    return items.reduce((total, item) => {
      // Create tier pricing for each item
      const tierPricing = [
        { tier: 1, minQuantity: 1, price: item.price, savings: 0 },
        { tier: 2, minQuantity: 10, price: item.price * 0.9, savings: item.price * 0.1 * 10 },
        { tier: 3, minQuantity: 25, price: item.price * 0.8, savings: item.price * 0.2 * 25 },
      ];
      
      const nextTier = tierPricing.find((tier: any) => 
        tier.minQuantity > item.quantity
      );
      if (nextTier) {
        const additionalSavingsPerUnit = item.price - nextTier.price;
        return total + (additionalSavingsPerUnit * nextTier.minQuantity);
      }
      return total;
    }, 0);
  };

  const totalSavings = calculateTotalSavings();
  const potentialSavings = calculatePotentialSavings();

  // Handle checkout navigation
  const handleCheckout = () => {
    console.log('Checkout button pressed!');
    console.log('Items in cart:', items.length);
    
    if (items.length === 0) {
      console.log('Cart is empty, not navigating');
      Alert.alert('Cart Empty', 'Please add items to your cart before proceeding to checkout.');
      return;
    }
    
    console.log('Navigating to checkout with items:', items);
    
    try {
      router.push('/checkout');
      console.log('Navigation successful');
    } catch (error) {
      console.error('Navigation error:', error);
      Alert.alert('Navigation Error', 'Unable to navigate to checkout. Please try again.');
    }
  };

  const handleRemoveItem = (id: string) => {
    Alert.alert(
      "Remove Item",
      "Are you sure you want to remove this item from your cart?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        { 
          text: "Remove", 
          onPress: () => dispatch(removeFromCart(id)),
          style: "destructive"
        }
      ]
    );
  };

  const handleUpdateQuantity = (id: string, quantity: number) => {
    dispatch(updateQuantity({ id, quantity }));
  };

  const hasItems = items.length > 0;

  // Use Design 3 for all cart items with enhanced B2B data
  const renderCartItem = (item: CartItem) => {
    // Enhanced item with B2B features
    const enhancedItem = {
      ...item,
      originalPrice: item.originalPrice || item.price * 1.25,
      supplier: 'Verified Supplier',
      unit: 'unit',
      tierPricing: [
        { tier: 1, minQuantity: 1, price: item.price, savings: 0 },
        { tier: 2, minQuantity: 10, price: item.price * 0.9, savings: item.price * 0.1 * 10 },
        { tier: 3, minQuantity: 25, price: item.price * 0.8, savings: item.price * 0.2 * 25 },
        { tier: 4, minQuantity: 50, price: item.price * 0.75, savings: item.price * 0.25 * 50 },
      ],
      relatedProducts: [
        { name: 'Recommended Product A', price: item.price * 0.8 },
        { name: 'Recommended Product B', price: item.price * 1.2 }
      ]
    };

    const props = {
      item: enhancedItem,
      onRemove: handleRemoveItem,
      onUpdateQuantity: handleUpdateQuantity
    };

    return <CartItemDesign3 key={item.id} {...props} />;
  };

  return (
    <View style={[styles.container, { backgroundColor: isDark ? '#121212' : '#F8F8F8' }]}> 
      <StatusBar style={isDark ? 'light' : 'dark'} />
      
      {/* Enhanced Header */}
      <View style={[
        styles.header, 
        { 
          backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF',
          borderBottomColor: isDark ? '#333333' : '#EEEEEE' 
        }
      ]}>
        <View style={styles.headerContent}>
          {showBackButton && (
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <ArrowLeft size={24} color={isDark ? '#FFFFFF' : '#000000'} />
            </TouchableOpacity>
          )}
          
          <View style={[styles.headerTitleContainer, { marginLeft: showBackButton ? 16 : 0 }]}>
            <Text variant="h3" weight="bold">Cart</Text>
            {/* <Text variant="body-sm" color="secondary">
              {totalItems} {totalItems === 1 ? 'item' : 'items'} • Bulk pricing applied
            </Text> */}
          </View>
          
          {/* <View style={styles.headerActions}>
            <TouchableOpacity style={styles.settingsButton}>
              <Settings size={20} color={isDark ? '#FFFFFF' : '#666666'} />
            </TouchableOpacity>
          </View> */}
        </View>
      </View>

      {hasItems ? (
        <>
          {/* Cart Items List */}
          <ScrollView style={styles.cartContent} showsVerticalScrollIndicator={false}>
            
            {/* Total Savings Banner */}
            {hasItems && totalSavings > 0 && (
              <View style={[
                styles.savingsBanner,
                { 
                  backgroundColor: isDark ? '#0D4A2D' : '#E8F5E8',
                  borderColor: isDark ? '#16A249' : '#4CAF50'
                }
              ]}>
                <View style={styles.savingsContent}>
                  <Wallet size={25} color="#4CAF50" />
                  <View style={styles.savingsText}>
                    <Text variant="h4" weight="bold" color="success">
                      You're saving ₹{totalSavings.toFixed(0)} on this order!
                    </Text>
                    {/* {potentialSavings > 0 && (
                      <Text variant="caption" color="secondary">
                        Upgrade quantities to save ₹{potentialSavings.toFixed(0)} more
                      </Text>
                    )} */}
                  </View>
                </View>
                
                {/* {potentialSavings > 0 && (
                  <TouchableOpacity style={styles.savingsButton}>
                    <TrendingUp size={14} color="#4CAF50" />
                    <Text variant="caption" weight="bold" style={{ color: '#4CAF50' }}>
                      Optimize
                    </Text>
                  </TouchableOpacity>
                )} */}
              </View>
            )}
            
            <View style={styles.cartList}>
              {/* Cart Items from Redux Store */}
              {items.map((item) => renderCartItem(item))}
            </View>

            {/* Order Summary Preview */}
            <View style={[
              styles.orderSummary,
              { 
                backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF',
                borderColor: isDark ? '#333333' : '#EEEEEE'
              }
            ]}>
              <Text variant="h4" weight="semibold" style={styles.summaryTitle}>
                Order Summary
              </Text>
              
              <View style={styles.summaryRow}>
                <Text variant="body" color="secondary">Subtotal ({totalItems} items)</Text>
                <Text variant="body" weight="medium">
                  {formatPrice(subtotal)}
                </Text>
              </View>
              
              <View style={styles.summaryRow}>
                <Text variant="body" color="secondary">Bulk Discount</Text>
                <Text variant="body" weight="medium" color="success">
                  -{formatPrice(totalSavings)}
                </Text>
              </View>
              
              <View style={styles.summaryRow}>
                <Text variant="body" color="secondary">GST (18%)</Text>
                <Text variant="body" weight="medium">
                  {formatPrice(subtotal * 0.18)}
                </Text>
              </View>
              
              <View style={styles.summaryRow}>
                <Text variant="body" color="secondary">Shipping</Text>
                <Text variant="body" weight="medium" color="success">
                  Free
                </Text>
              </View>
              
              <View style={[styles.divider, { backgroundColor: isDark ? '#333333' : '#EEEEEE' }]} />
              
              <View style={styles.summaryRow}>
                <Text variant="h4" weight="bold">Total Amount</Text>
                <Text variant="h4" weight="bold" color="accent">
                  {formatPrice((subtotal - totalSavings) * 1.18)}
                </Text>
              </View>
            </View>
          </ScrollView>

          {/* Enhanced Checkout Section */}
          <View style={[
            styles.checkoutContainer, 
            { 
              backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF',
              borderTopColor: isDark ? '#333333' : '#EEEEEE' 
            }
          ]}>
            <View style={styles.checkoutContent}>
              <View style={styles.totalSection}>
                <Text variant="body" color="secondary">Total Amount</Text>
                <Text variant="h2" weight="bold" color="accent">
                  {formatPrice((subtotal - totalSavings) * 1.18)}
                </Text>
                <Text variant="body" color="success">
                  Saved ₹{totalSavings.toFixed(0)}
                </Text>
              </View>
              
              <Button
                variant="primary"
                style={styles.checkoutButton}
                onPress={handleCheckout}
                rightIcon={<ArrowRight size={18} color="#FFFFFF" />}
              >
                Proceed to Checkout
              </Button>
            </View>
          </View>
        </>
      ) : (
        <View style={styles.emptyContainer}>
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1586769852044-692d6e3703f2?q=80&w=300&auto=format&fit=crop' }}
            style={styles.emptyImage}
          />
          <Text variant="h3" weight="bold" style={styles.emptyTitle}>
            Your B2B cart is empty
          </Text>
          <Text variant="body" color="secondary" style={styles.emptyText}>
            Explore our extensive catalog of Ayurvedic products with bulk pricing and MOQ benefits.
          </Text>
          <Button
            variant="primary"
            style={styles.shopButton}
            onPress={() => router.push('/(tabs)')}
          >
            Browse Products
          </Button>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 64, // Increased for better status bar clearance
    paddingBottom: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
  },
  headerTitleContainer: {
    flex: 1,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  settingsButton: {
    padding: 8,
    borderRadius: 8, // Added border radius for better touch target
  },
  savingsBanner: {
    margin: 14,
    padding: 10,
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  savingsContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  savingsText: {
    flex: 1,
  },
  savingsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 8, // Increased from 6 to follow 8px grid
    borderRadius: 8, // Increased from 6 for consistency
    borderWidth: 1,
    borderColor: colors.success?.[500] || '#4CAF50',
  },
  cartContent: {
    flex: 1,
  },
  cartList: {
    paddingHorizontal: 16,
    paddingTop: 5,
    gap: 5, // Added consistent gap between cart items
  },
  orderSummary: {
    margin: 16,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  summaryTitle: {
    marginBottom: 16, // Increased from 12 to follow 8px grid
    color: colors.success?.[600] || '#4CAF50',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center', // Added for better alignment
    marginBottom: 8,
    minHeight: 24, // Added minimum height for consistency
  },
  divider: {
    height: 1,
    marginVertical: 16, // Increased from 12 to follow 8px grid
  },
  checkoutContainer: {
    borderTopWidth: 1,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  checkoutContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    gap: 16,
  },
  totalSection: {
    flex: 1,
    // gap: 4, // Added gap between total text elements
  },
  checkoutButton: {
    height: 48,
    borderRadius: 12, // Added consistent border radius
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    gap: 16, // Added consistent gap between elements
  },
  emptyImage: {
    width: 200,
    height: 200,
    borderRadius: 100,
    marginBottom: 8, // Reduced since we're using gap
  },
  emptyTitle: {
    marginBottom: 8, // Reduced since we're using gap
    textAlign: 'center',
  },
  emptyText: {
    textAlign: 'center',
    marginBottom: 16, // Reduced since we're using gap
    maxWidth: 280, // Added max width for better readability
    lineHeight: 22, // Added line height for better readability
  },
  shopButton: {
    paddingHorizontal: 32,
    height: 48, // Reduced from 56 for consistency
    borderRadius: 12, // Added consistent border radius
    minWidth: 200, // Added minimum width
  },
});