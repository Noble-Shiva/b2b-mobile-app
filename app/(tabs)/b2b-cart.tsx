import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, Image, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useRouter, useNavigation } from 'expo-router';
import { ArrowRight, Settings, Gift, TrendingUp, ArrowLeft, Wallet, CloudLightning, LockKeyhole, ArrowLeftRight } from 'lucide-react-native';
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

  // Tab state - Super Saver is default
  const [activeTab, setActiveTab] = useState<'mrp' | 'super-saver'>('super-saver');
  
  // Check if we should show back button (when not navigating from tabs)
  const [showBackButton, setShowBackButton] = useState(false);

  // Cart eligibility logic
  const eligibleCartValue = 4999;
  const totalAmount = items.reduce((total, item) => total + (item.originalPrice || item.price * 1.25) * item.quantity, 0);
  const isEligibleForRetailBilling = totalAmount >= eligibleCartValue;
  const amountNeededForEligibility = Math.max(0, eligibleCartValue - totalAmount);
  
  // Auto-select Retail Billing tab when eligible
  React.useEffect(() => {
    if (isEligibleForRetailBilling && activeTab === 'mrp') {
      setActiveTab('super-saver');
    }
  }, [isEligibleForRetailBilling, totalAmount]);
  
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
    // Enhanced item with B2B features (preserve scheme data)
    const enhancedItem = {
      ...item, // This includes all scheme properties from Redux store
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
      onUpdateQuantity: handleUpdateQuantity,
      tabType: activeTab
    };

    return <CartItemDesign3 key={item.id} {...props} />;
  };

  // Render MRP tab content
  const renderMRPTab = () => (
    <View style={styles.tabContent}>
      {/* <View style={styles.tabHeader}>
        <Text variant="h4" weight="semibold" color="secondary">
          MRP Pricing
        </Text>
        <Text variant="body" color="secondary">
          Standard pricing without bulk discounts
        </Text>
      </View> */}
      
      <View style={styles.cartList}>
        {items.map((item) => {
          // For MRP tab, create item with original price as main price
          const mrpItem = {
            ...item,
            price: item.originalPrice || item.price * 1.25, // Use original MRP
            originalPrice: item.originalPrice || item.price * 1.25, // Keep same for consistency
          };
          
          const enhancedItem = {
            ...mrpItem, // This includes all original item data including scheme properties
            supplier: 'Verified Supplier',
            unit: 'unit',
            tierPricing: [
              { tier: 1, minQuantity: 1, price: mrpItem.price, savings: 0 },
              { tier: 2, minQuantity: 10, price: mrpItem.price * 0.9, savings: mrpItem.price * 0.1 * 10 },
              { tier: 3, minQuantity: 25, price: mrpItem.price * 0.8, savings: mrpItem.price * 0.2 * 25 },
              { tier: 4, minQuantity: 50, price: mrpItem.price * 0.75, savings: mrpItem.price * 0.25 * 50 },
            ],
            relatedProducts: [
              { name: 'Recommended Product A', price: mrpItem.price * 0.8 },
              { name: 'Recommended Product B', price: mrpItem.price * 1.2 }
            ]
          };

          const props = {
            item: enhancedItem,
            onRemove: handleRemoveItem,
            onUpdateQuantity: handleUpdateQuantity,
            tabType: 'mrp' as const
          };

          return <CartItemDesign3 key={item.id} {...props} />;
        })}
      </View>

      {/* MRP Order Summary */}
      <View style={[
        styles.orderSummary,
        { 
          backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF',
          borderColor: isDark ? '#333333' : '#EEEEEE'
        }
      ]}>
        <Text variant="h4" weight="semibold" style={styles.summaryTitle}>
          MRP Order Summary
        </Text>
        
        <View style={styles.summaryRow}>
          <Text variant="body" color="secondary">Subtotal ({totalItems} items)</Text>
          <Text variant="body" weight="medium">
            {formatPrice(items.reduce((total, item) => total + (item.originalPrice || item.price * 1.25) * item.quantity, 0))}
          </Text>
        </View>
        
        <View style={styles.summaryRow}>
          <Text variant="body" color="secondary">GST (18%)</Text>
          <Text variant="body" weight="medium">
            {formatPrice(items.reduce((total, item) => total + (item.originalPrice || item.price * 1.25) * item.quantity, 0) * 0.18)}
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
            {formatPrice(items.reduce((total, item) => total + (item.originalPrice || item.price * 1.25) * item.quantity, 0) * 1.18)}
          </Text>
        </View>
      </View>
    </View>
  );

  // Render Super Saver tab content
  const renderSuperSaverTab = () => (
    <View>
      {/* <View style={styles.tabHeader}>
        <Text variant="h4" weight="semibold" color="success">
          Super Saver Pricing
        </Text>
        <Text variant="body" color="secondary">
          Bulk discounts and tier pricing applied
        </Text>
      </View> */}
      
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
        {items.map((item) => renderCartItem(item))}
      </View>

      {/* Super Saver Order Summary */}
      <View style={[
        styles.orderSummary,
        { 
          backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF',
          borderColor: isDark ? '#333333' : '#EEEEEE'
        }
      ]}>
        <Text variant="h4" weight="semibold" style={styles.summaryTitle}>
          Super Saver Summary
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
            {formatPrice((subtotal - totalSavings) * 0.18)}
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
    </View>
  );

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
          
          {/* Review Cart Title */}
          <View style={styles.headerTitleContainer}>
            <Text variant="h3" weight="bold">Review Cart</Text>
            {/* <Text variant="body-sm" color="secondary">
              {totalItems} {totalItems === 1 ? 'item' : 'items'} • Choose your pricing
            </Text> */}
            {/* Total Savings Banner */}
            {hasItems && totalSavings > 0 && !isEligibleForRetailBilling && (
              <View style={[
                styles.headerBanner,
                { 
                  backgroundColor: isDark ? '#0D4A2D' : colors.accent?.[50],
                  borderColor: isDark ? '#16A249' : colors.accent?.[500]
                }
              ]}>
                <View style={styles.savingsContent}>
                  <LockKeyhole size={20} color={`${colors.accent?.[500]}`} />
                  <View style={styles.savingsText}>
                    <Text variant="body" weight="bold" color="success" style={{ color: colors.accent?.[400], fontSize: 16 }}>
                      {/* You're saving ₹{totalSavings.toFixed(0)} on this order! */}

                      Add few more items worth ₹{amountNeededForEligibility.toFixed(0)} or more to unlock retail margin discounts & schemes.
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
          </View>
        </View>
      </View>

      {/* Tab Navigation */}
      {/* MRP Billing Tab - Only show when not eligible for Retail Billing */}
      {!isEligibleForRetailBilling && (
        <View style={[
          styles.tabContainer,
          { 
            backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF',
            borderBottomColor: isDark ? '#333333' : '#EEEEEE' 
          }
        ]}>
          <TouchableOpacity
            style={[
              styles.tab,
              activeTab === 'mrp' && styles.activeTab,
              { borderBottomColor: activeTab === 'mrp' ? colors.success?.[500] || '#FF4500' : 'transparent' }
            ]}
            onPress={() => setActiveTab('mrp')}
          >
            <Text 
              variant="h4" 
              weight={activeTab === 'mrp' ? 'semibold' : 'medium'}
              color={activeTab === 'mrp' ? 'accent' : 'secondary'}
            >
              MRP Billing
            </Text>
            <Text variant="body" color="secondary">
              (For orders below ₹4999)
            </Text>
          </TouchableOpacity>
        
        
          <TouchableOpacity
            style={[
              styles.tab,
              activeTab === 'super-saver' && styles.activeTab,
              { borderBottomColor: activeTab === 'super-saver' ? colors.success?.[500] || '#4CAF50' : 'transparent' }
            ]}
            onPress={() => setActiveTab('super-saver')}
          >
            <Text 
              variant="h4" 
              weight={activeTab === 'super-saver' ? 'semibold' : 'medium'}
              color={activeTab === 'super-saver' ? 'success' : 'secondary'}
            >
              Retail Billing
            </Text>
            <Text variant="body" color="secondary">
              (For orders above ₹4999)
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {hasItems ? (
        <>
          {/* Tab Content */}
          <ScrollView style={styles.cartContent} showsVerticalScrollIndicator={false}>
            {activeTab === 'mrp' ? renderMRPTab() : renderSuperSaverTab()}
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
                <Text variant="h4" color="secondary" weight='bold'>Total</Text>
                <Text variant="h2" weight="bold" color="accent">
                  {activeTab === 'super-saver' 
                    ? formatPrice((subtotal - totalSavings) * 1.18)
                    : formatPrice(items.reduce((total, item) => total + (item.originalPrice || item.price * 1.25) * item.quantity, 0) * 1.18)
                  }
                </Text>
                {/* {activeTab === 'super-saver' && totalSavings > 0 && (
                  <Text variant="body" color="success">
                    Saved ₹{totalSavings.toFixed(0)}
                  </Text>
                )} */}
              </View>
              
              {/* GST */}
              {/* <View style={styles.summaryRow}>
                <Text variant="body" color="secondary">GST (18%)</Text>
                <Text variant="body" weight="medium">
                  {formatPrice(items.reduce((total, item) => total + (item.originalPrice || item.price * 1.25) * item.quantity, 0) * 0.18)}
                </Text>
              </View> */}
              
              {/* Total */}
              {/* <View style={[styles.summaryRow, styles.totalRow]}>
                <Text variant="h4" weight="bold">Final Amount</Text>
                <Text variant="h4" weight="bold">
                  {activeTab === 'mrp' 
                    ? formatPrice(items.reduce((total, item) => total + (item.originalPrice || item.price * 1.25) * item.quantity, 0) * 1.18)
                    : formatPrice(items.reduce((total, item) => total + (item.price * item.quantity), 0) * 1.18)
                  }
                </Text>
              </View> */}
              {/* Conditional Action Buttons */}
              {!isEligibleForRetailBilling && activeTab === 'super-saver' ? (
                /* Two buttons when cart total < 4999 */
                <View style={styles.buttonContainer}>
                  <TouchableOpacity 
                    style={[styles.addMoreButton, { backgroundColor: colors.primary?.[100] || '#FF9800' }]}
                    onPress={() => {
                      // Navigate to search or add more items
                      router.push('/(tabs)/search');
                    }}
                  >
                    <View style={{flexDirection: 'row', alignItems: 'center', gap: 6}}>
                      {/* <LockKeyhole size={20} color={colors.primary?.[600]} style={{marginLeft: -4}} /> */}
                      <Text variant="body" weight="medium" color="white" align='center' style={{ fontSize: 16 , color: 'green'}}>
                        Add ₹{amountNeededForEligibility.toFixed(0)} more to {'\n'}
                        <Text variant="body" weight="medium" color="white" align='center' style={{ fontSize: 16 , color: 'green'}}>
                          unlock retail billing
                        </Text>
                      </Text>
                    </View>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={[styles.switchToMRPButton, { backgroundColor: colors.primary?.[600] || '#FF4500' }]}
                    onPress={() => setActiveTab('mrp')}
                  >
                    <View style={{flexDirection: 'row', alignItems: 'center', gap: 6}}>
                      {/* <ArrowLeftRight size={20} color="white" style={{marginLeft: -4}} /> */}
                      <Text variant="body" weight="me" color="white" align='center' style={{ fontSize: 16 , color: 'white'}}>
                        Proceed with  {'\n'}
                        <Text variant="body" weight="me" color="white" align='center' style={{ fontSize: 16 , color: 'white'}}>
                          mrp billing
                        </Text>
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
              ) : (
                /* Single button when cart total >= 4999 */
                <Button
                  variant="primary"
                  style={styles.checkoutButton}
                  onPress={handleCheckout}
                  textStyle={{fontSize: 18}}
                  rightIcon={<ArrowRight size={18} color="#FFFFFF" />}
                >
                  Proceed to Checkout
                </Button>
              )}
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
  // Tab styles
  tabContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    backgroundColor: '#FFFFFF',
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderBottomWidth: 3,
    borderBottomColor: 'transparent',
    gap: 4,
  },
  activeTab: {
    borderBottomWidth: 3,
  },
  tabContent: {
    paddingTop: 10, // Reduced from 16 for more compact layout
  },
  tabHeader: {
    paddingHorizontal: 16,
    paddingBottom: 12, // Reduced from 16 for more compact layout
    alignItems: 'center',
  },
  headerBanner: {
    marginTop: 10,
    padding: 10,
    borderRadius: 5,
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
    paddingHorizontal: 10,
    gap: 2, // Reduced gap for more compact layout
  },
  orderSummary: {
    margin: 10,
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
  checkoutButtonContainer: {
    flexDirection: 'row',
    gap: 16,
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
  eligibilityBanner: {
    marginTop: 8,
    padding: 8,
    borderRadius: 8,
    backgroundColor: colors.warning?.[100],
    borderWidth: 1,
    borderColor: colors.warning?.[500],
    alignSelf: 'center',
  },
  eligibilityBannerText: {
    textAlign: 'center',
    fontSize: 12,
  },
  buttonContainer: {
    flexDirection: 'row',
    // justifyContent: 'space-between',
    // marginTop: 16,
    // paddingHorizontal: 10,
  },
  addMoreButton: {
    // flex: 1,
    paddingVertical: 7,
    paddingHorizontal: 15,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    // marginRight: 8,
  },
  switchToMRPButton: {
    // flex: 1,
    paddingVertical: 7,
    paddingHorizontal: 15,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  totalRow: {
    marginTop: 16,
  },
});