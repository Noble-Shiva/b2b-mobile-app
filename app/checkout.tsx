import React from 'react';
import { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { CreditCard, MapPin, Truck, ShoppingBag, Check } from 'lucide-react-native';
import { Text, BackButton, Button, Policies } from '@/components/ui';
import { formatPrice } from '@/utils/helpers';
import { colors } from '@/utils/theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSelector, useDispatch } from 'react-redux';
import { selectCartItems, selectSubtotal, selectDiscount, selectTotal, clearCart } from '@/store/cartSlice';
import { selectIsDark } from '@/store/themeSlice';
import { selectUser, selectToken, getAuthToken } from '@/store/authSlice';
import { selectAddresses, Address } from '@/store/addressSlice';
import { createOrder, confirmPayment } from '@/api/orders';
import { initializePayment, getDefaultRazorpayOptions } from '@/services/razorpay';
import RazorpayCheckout from 'react-native-razorpay';

// We'll use the addresses from the Redux store instead of these sample addresses
// const addresses = [ ... ];

// Sample payment methods
const paymentMethods = [
  {
    id: '1',
    type: 'visa',
    cardNumber: '**** **** **** 4242',
    expiryDate: '12/25',
    isDefault: true,
  },
  {
    id: '2',
    type: 'mastercard',
    cardNumber: '**** **** **** 5555',
    expiryDate: '10/24',
    isDefault: false,
  }
];

// Sample delivery options
const deliveryOptions = [
  {
    id: '1',
    name: 'Express Delivery',
    description: 'Delivery within 30 minutes',
    price: 2.99,
    estimatedTime: '30 min',
  },
  {
    id: '2',
    name: 'Standard Delivery',
    description: 'Delivery within 1 hour',
    price: 0,
    estimatedTime: '60 min',
  }
];

const RAZORPAY_KEY = 'rzp_test_CvW321YoY1P2pc';

export default function CheckoutScreen() {
  // ==================== ALL HOOKS FIRST ====================
  // Router and param hooks
  const router = useRouter();
  const params = useLocalSearchParams<{ authCompleted?: string }>();
  const justAuthenticated = params.authCompleted === 'true';
  
  // UI hooks
  const insets = useSafeAreaInsets();
  
  // Redux hooks
  const dispatch = useDispatch();
  const items = useSelector(selectCartItems);
  const subtotal = useSelector(selectSubtotal);
  const discount = useSelector(selectDiscount);
  const total = useSelector(selectTotal);
  const isDark = useSelector(selectIsDark);
  const user = useSelector(selectUser);
  const token = useSelector(selectToken);
  const addresses = useSelector(selectAddresses);
  
  // Auth state hooks
  const [isAuthChecked, setIsAuthChecked] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  // Order state hooks - initialize with default values
  const [selectedAddress, setSelectedAddress] = useState(
    addresses.find((addr: Address) => addr.isDefault)?.id || addresses[0]?.id || ''
  );
  const [selectedPayment, setSelectedPayment] = useState(
    paymentMethods.find(pm => pm.isDefault)?.id || ''
  );
  const [selectedDelivery, setSelectedDelivery] = useState(deliveryOptions[0].id);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isOrderPlaced, setIsOrderPlaced] = useState(false);
  
  // ==================== CALLBACKS ====================
  // Authentication check callback
  const checkAuthentication = useCallback(() => {
    // If we explicitly know we're authenticated from URL params, set authenticated immediately
    if (justAuthenticated) {
      console.log('Auth status from URL: authenticated=true');
      setIsAuthenticated(true);
      setIsAuthChecked(true);
      return;
    }
    
    // Otherwise check auth status async
    const verifyAuth = async () => {
      try {
        // Check Redux state first
        if (user && token) {
          console.log('User authenticated via Redux state');
          setIsAuthenticated(true);
          setIsAuthChecked(true);
          return;
        }
        
        // Then try secure storage
        const storedToken = await getAuthToken();
        
        if (storedToken) {
          console.log('User authenticated via secure storage token');
          setIsAuthenticated(true);
        } else {
          console.log('No authentication found, redirecting to login');
          setIsAuthenticated(false);
          
          // Navigate to login after a short delay
          setTimeout(() => {
            router.replace({
              pathname: '/(auth)/login',
              params: { returnTo: '/checkout' }
            });
          }, 300);
        }
      } catch (error) {
        console.error('Authentication error:', error);
        setIsAuthenticated(false);
      } finally {
        setIsAuthChecked(true);
      }
    };
    
    // Start async auth check
    verifyAuth();
  }, [user, token, router, justAuthenticated]);
  
  // ==================== EFFECTS ====================
  // Run authentication check on mount
  useEffect(() => {
    console.log('Checkout screen mounted, checking authentication...');
    checkAuthentication();
  }, [checkAuthentication]);

  // Auto-select address when addresses are loaded
  useEffect(() => {
    if (addresses.length > 0 && !selectedAddress) {
      const defaultAddress = addresses.find((addr: Address) => addr.isDefault);
      const addressToSelect = defaultAddress?.id || addresses[0]?.id || '';
      setSelectedAddress(addressToSelect);
      console.log('Auto-selected address:', addressToSelect);
    }
  }, [addresses, selectedAddress]);
  
  // Don't render the checkout page until auth check completes and user is authenticated
  if (!isAuthChecked || !isAuthenticated) {
    return (
      <View style={[styles.container, { backgroundColor: isDark ? '#121212' : '#F8F8F8' }, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#FF4500" />
        <Text style={{ marginTop: 16 }}>Checking authentication...</Text>
      </View>
    );
  }
  
  // Free delivery logic
  const freeDeliveryThreshold = 10000;
  const deliveryFee = subtotal >= freeDeliveryThreshold ? 0 : 50; // 50 rs delivery fee if below threshold
  const finalTotal = total + deliveryFee;

  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      Alert.alert('Error', 'Please select a delivery address');
      return;
    }
    
    if (!selectedPayment) {
      Alert.alert('Error', 'Please select a payment method');
      return;
    }

    try {
      setIsProcessing(true);
      
      // Prepare order items in the format required by the API
      const lineItems = items.map(item => ({
        product_id: parseInt(item.id), 
        quantity: item.quantity
      }));

      console.log('Cart Items', lineItems);
      
      // Get the selected address object
      const billingAddress = addresses.find((addr: Address) => addr.id === selectedAddress);
      
      // Create order through API with billing details
      const orderResponse = await createOrder({
        user_id: user?.id,
        line_items: lineItems,
        billing_first_name: billingAddress?.name || '',
        billing_last_name: billingAddress?.business_name || '',
        billing_address_1: billingAddress?.address || '',
        billing_city: billingAddress?.city || '',
        billing_state: billingAddress?.state || '',
        billing_postcode: billingAddress?.pincode || '',
        billing_country: billingAddress?.country || 'IN',
        billing_email: billingAddress?.email || user?.email || '',
        billing_phone: billingAddress?.mobile || user?.phone || '',
      });

      if (orderResponse.message !== "Order created successfully") {
        console.log('orderResponse', orderResponse);
        throw new Error(orderResponse.message || 'Failed to create order');
      }

      // Open Razorpay client with the order id from backend
      const razorpayOptions = {
        key: RAZORPAY_KEY,
        amount: orderResponse.amount,
        currency: orderResponse.currency || 'INR',
        name: 'Srotas',
        description: 'Order Payment',
        order_id: orderResponse.rzp_order_id,
        prefill: {
          email: billingAddress?.email || user?.email || '',
          contact: billingAddress?.mobile || user?.phone || '',
          name: billingAddress?.name || user?.first_name || '',
        },
        theme: { color: '#FF456A' }
      };

      RazorpayCheckout.open(razorpayOptions)
        .then(async (paymentResult: any) => {
          // On payment success, confirm payment with backend

          console.log('paymentResult', paymentResult);

          const confirmResponse = await confirmPayment({
            order_id: orderResponse.order_id,
            razorpay_payment_id: paymentResult.razorpay_payment_id,
            razorpay_order_id: paymentResult.razorpay_order_id || orderResponse.rzp_order_id,
            razorpay_signature: paymentResult.razorpay_signature
          });

          console.log('confirmResponse', confirmResponse);

          if (confirmResponse?.error) {
            throw new Error(confirmResponse.message || 'Failed to confirm payment');
          }

          setIsProcessing(false);
          setIsOrderPlaced(true);

          // Redirect to order success page after successful payment
          setTimeout(() => {
            dispatch(clearCart());
            router.replace({
              pathname: '/order-success',
              params: {
                orderId: orderResponse.order_id.toString(),
                amount: orderResponse.amount
              }
            });
          }, 2000);
        })
        .catch((error: any) => {
          console.log('Payment Error:', error);
          setIsProcessing(false);
          if (error && error.description) {
            Alert.alert('Payment Error', error.description);
          } else {
            Alert.alert('Payment Cancelled', 'The payment was failed.');
          }
        });
    } catch (error: any) {
      setIsProcessing(false);
      console.error('Error processing order:', error);
      Alert.alert(
        'Order Error',
        error.message || 'There was a problem processing your order. Please try again.'
      );
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: isDark ? '#121212' : '#F8F8F8' }]}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      
      <View style={[
        styles.header, 
        { 
          backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF',
          borderBottomColor: isDark ? '#333333' : '#EEEEEE',
          paddingTop: insets.top
        }
      ]}>
        <BackButton />
        <Text variant="h4" weight="semibold">Checkout</Text>
        <View style={styles.placeholder} />
      </View>
      
      {isOrderPlaced ? (
        <View style={styles.successContainer}>
          <View style={styles.successIconContainer}>
            <Check size={40} color="#FFFFFF" />
          </View>
          <Text variant="h3" weight="bold" style={styles.successTitle}>
            Payment Successful!
          </Text>
          <Text variant="body" color="secondary" style={styles.successText}>
            Your payment has been processed successfully. You will be redirected to the order tracking page.
          </Text>
        </View>
      ) : (
        <>
          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Delivery Address Section */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <View style={styles.sectionTitleContainer}>
                  <MapPin size={20} color={colors.primary[700]} />
                  <Text variant="h4" weight="semibold" style={styles.sectionTitle}>
                    Delivery Address
                  </Text>
                </View>
                <TouchableOpacity onPress={() => router.push('/profile/addresses')}>
                  <Text variant="body-sm" weight="medium" color="accent">
                    {addresses.length === 0 ? 'Add New' : 'Change'}
                  </Text>
                </TouchableOpacity>
              </View>
              
              <View style={[
                styles.sectionContent, 
                { backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF' }
              ]}>
                {addresses.length === 0 ? (
                  <View style={styles.noAddressContainer}>
                    <Text variant="body" color="secondary" style={styles.noAddressText}>
                      You don't have any saved delivery addresses yet.
                    </Text>
                    <TouchableOpacity 
                      style={styles.addNewAddressButton}
                      onPress={() => router.push('/profile/addresses')}
                    >
                      <Text variant="body-sm" weight="medium" style={styles.addNewAddressButtonText}>
                        Add New Address
                      </Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  (() => {
                    const selectedAddressData = addresses.find((addr: Address) => addr.id === selectedAddress);
                    if (!selectedAddressData) return null;
                    
                    return (
                      <View style={styles.selectedAddressContainer}>
                        <View style={styles.addressDetails}>
                          <View style={styles.addressHeader}>
                            <Text variant="body" weight="semibold">
                              {selectedAddressData.business_name} - {selectedAddressData.name}
                            </Text>
                            {selectedAddressData.isDefault && (
                              <View style={styles.defaultBadge}>
                                <Text variant="caption" weight="medium" color="accent">
                                  Default
                                </Text>
                              </View>
                            )}
                          </View>
                          
                          <Text variant="body-sm" color="secondary">
                            {selectedAddressData.address}
                          </Text>
                          <Text variant="body-sm" color="secondary">
                            {selectedAddressData.city}, {selectedAddressData.state} {selectedAddressData.pincode}
                          </Text>
                          <Text variant="body-sm" color="secondary">
                            {selectedAddressData.mobile}
                          </Text>
                        </View>
                      </View>
                    );
                  })()
                )}
              </View>
            </View>
            
            {/* Payment Method Section */}
            {/* <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <View style={styles.sectionTitleContainer}>
                  <CreditCard size={20} color={colors.primary[700]} />
                  <Text variant="h4" weight="semibold" style={styles.sectionTitle}>
                    Payment Method
                  </Text>
                </View>
                <TouchableOpacity onPress={() => router.push('/profile/payment-methods')}>
                  <Text variant="body-sm" weight="medium" color="accent">Add New</Text>
                </TouchableOpacity>
              </View>
              
              <View style={[
                styles.sectionContent, 
                { backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF' }
              ]}>
                {paymentMethods.map((payment) => (
                  <TouchableOpacity
                    key={payment.id}
                    style={[
                      styles.paymentItem,
                      selectedPayment === payment.id && { 
                        borderColor: colors.primary[700],
                        backgroundColor: isDark ? '#2A1A10' : '#FFF0EB' 
                      }
                    ]}
                    onPress={() => setSelectedPayment(payment.id)}
                  >
                    <View style={styles.paymentRadio}>
                      <View style={[
                        styles.radioOuter,
                        selectedPayment === payment.id && { borderColor: colors.primary[700] }
                      ]}>
                        {selectedPayment === payment.id && (
                          <View style={styles.radioInner} />
                        )}
                      </View>
                    </View>
                    
                    <View style={styles.paymentDetails}>
                      <View style={styles.paymentHeader}>
                        <Text variant="body" weight="semibold">
                          {payment.type.charAt(0).toUpperCase() + payment.type.slice(1)}
                        </Text>
                        {payment.isDefault && (
                          <View style={styles.defaultBadge}>
                            <Text variant="caption" weight="medium" color="accent">
                              Default
                            </Text>
                          </View>
                        )}
                      </View>
                      
                      <Text variant="body-sm" color="secondary">
                        {payment.cardNumber}
                      </Text>
                      <Text variant="body-sm" color="secondary">
                        Expires {payment.expiryDate}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </View> */}
            
            {/* Free Delivery Threshold Card */}
            <View style={styles.section}>
              {(() => {
                const freeDeliveryThreshold = 10000;
                const isEligibleForFreeDelivery = subtotal >= freeDeliveryThreshold;
                const amountNeeded = freeDeliveryThreshold - subtotal;
                
                return (
                  <View style={[
                    styles.freeDeliveryCard,
                    {
                      backgroundColor: isEligibleForFreeDelivery 
                        ? (isDark ? '#1B4332' : '#D1FAE5') 
                        : (isDark ? '#2A1A10' : '#FFF0EB'),
                      borderColor: isEligibleForFreeDelivery 
                        ? '#10B981' 
                        : colors.primary[300]
                    }
                  ]}>
                    <View style={styles.freeDeliveryContent}>
                      {isEligibleForFreeDelivery ? (
                        <>
                          <View style={styles.freeDeliveryIcon}>
                            <Check size={16} color="#10B981" />
                          </View>
                          <View style={styles.freeDeliveryText}>
                            <Text variant="body-sm" weight="semibold" style={{ color: '#10B981' }}>
                              Free Delivery Applied!
                            </Text>
                            <Text variant="caption" color="secondary">
                              You've qualified for free delivery
                            </Text>
                          </View>
                        </>
                      ) : (
                        <>
                          <View style={styles.freeDeliveryIcon}>
                            <Truck size={16} color={colors.primary[600]} />
                          </View>
                          <View style={styles.freeDeliveryText}>
                            <Text variant="body-sm" weight="semibold" color="primary">
                              Add {formatPrice(amountNeeded)} more for free delivery
                            </Text>
                            <Text variant="caption" color="secondary">
                              Free delivery on orders above {formatPrice(freeDeliveryThreshold)}
                            </Text>
                          </View>
                        </>
                      )}
                    </View>
                  </View>
                );
              })()}
            </View>
            
            {/* Order Summary Section */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <View style={styles.sectionTitleContainer}>
                  <ShoppingBag size={20} color={colors.primary[700]} />
                  <Text variant="h4" weight="semibold" style={styles.sectionTitle}>
                    Order Summary
                  </Text>
                </View>
                <TouchableOpacity onPress={() => router.push('/cart')}>
                  <Text variant="body-sm" weight="medium" color="accent">Edit</Text>
                </TouchableOpacity>
              </View>
              
              <View style={[
                styles.sectionContent, 
                { backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF' }
              ]}>
                {items.map((item) => (
                  <View key={item.id} style={styles.orderItem}>
                    <View style={styles.orderItemRow}>
                      <View style={styles.orderItemName}>
                        <Text variant="body" weight="medium">
                          {item.name}
                        </Text>
                      </View>
                      <View style={styles.priceColumn}>
                        <View style={styles.priceRow}>
                          <Text variant="body" weight="semibold" color="success">
                            {formatPrice(item.price * item.quantity)}
                          </Text>
                          {(() => {
                            // For demo purposes, let's create an original price if one doesn't exist
                            // In real app, this should come from the product data
                            const hasOriginalPrice = item.originalPrice && item.originalPrice > item.price;
                            const demoOriginalPrice = !hasOriginalPrice ? item.price * 1.25 : item.originalPrice; // 25% markup for demo
                            
                            return (
                              <Text variant="body-sm">
                                {formatPrice(demoOriginalPrice??0 * item.quantity)}
                              </Text>
                            );
                          })()}
                        </View>
                      </View>
                    </View>
                  </View>
                ))}
                
                <View style={[
                  styles.divider, 
                  { backgroundColor: isDark ? '#333333' : '#EEEEEE' }
                ]} />
                
                <View style={styles.summaryItem}>
                  <Text variant="body" color="secondary">
                    Subtotal
                  </Text>
                  <Text variant="body" weight="medium">
                    {formatPrice(subtotal)}
                  </Text>
                </View>
                
                <View style={styles.summaryItem}>
                  <Text variant="body" color="secondary">
                    Discount
                  </Text>
                  <Text variant="body" weight="medium" color="success">
                    -{formatPrice(discount)}
                  </Text>
                </View>
                
                <View style={styles.summaryItem}>
                  <Text variant="body" color="secondary">
                    Delivery Fee
                  </Text>
                  <Text variant="body" weight="medium" color={deliveryFee === 0 ? 'success' : 'primary'}>
                    {deliveryFee === 0 ? 'Free' : formatPrice(deliveryFee)}
                  </Text>
                </View>
                
                <View style={[
                  styles.divider, 
                  { backgroundColor: isDark ? '#333333' : '#EEEEEE' }
                ]} />
                
                <View style={styles.totalItem}>
                  <Text variant="body" weight="semibold">
                    Total
                  </Text>
                  <Text variant="h4" weight="bold" color="accent">
                    {formatPrice(finalTotal)}
                  </Text>
                </View>
              </View>
            </View>
            
            {/* Policies Section */}
            <Policies />
            
            <View style={styles.spacer} />
          </ScrollView>
          
          <View style={[
            styles.footer, 
            { 
              backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF',
              borderTopColor: isDark ? '#333333' : '#EEEEEE',
              paddingBottom: insets.bottom + 16
            }
          ]}>
            <View style={styles.footerContent}>
              <View style={styles.totalContainer}>
                <Text variant="body-sm" color="secondary">
                  Total
                </Text>
                <Text variant="h4" weight="bold" color="accent">
                  {formatPrice(finalTotal)}
                </Text>
              </View>
              
              <Button
                variant="primary"
                style={styles.placeOrderButton}
                onPress={handlePlaceOrder}
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <>
                    <ActivityIndicator size="small" color="#FFFFFF" style={{ marginRight: 8 }} />
                    Processing...
                  </>
                ) : (
                  'Place Order'
                )}
              </Button>
            </View>
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  noAddressContainer: {
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noAddressText: {
    marginBottom: 16,
    textAlign: 'center',
  },
  addNewAddressButton: {
    backgroundColor: colors.primary[50],
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.primary[500],
  },
  addNewAddressButtonText: {
    color: colors.primary[700],
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    zIndex: 10,
  },
  placeholder: {
    width: 40,
  },
  section: {
    marginTop: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  sectionTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionTitle: {
    marginLeft: 8,
  },
  sectionContent: {
    marginHorizontal: 16,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  addressItem: {
    flexDirection: 'row',
    padding: 16,
    borderWidth: 1,
    borderColor: 'transparent',
    borderRadius: 12,
  },
  selectedAddressContainer: {
    padding: 16,
  },
  addressRadio: {
    marginRight: 12,
    justifyContent: 'center',
  },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#CCCCCC',
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.primary[700],
  },
  addressDetails: {
    flex: 1,
  },
  addressHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  defaultBadge: {
    backgroundColor: '#FFF0EB',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    marginLeft: 8,
  },
  paymentItem: {
    flexDirection: 'row',
    padding: 16,
    borderWidth: 1,
    borderColor: 'transparent',
    borderRadius: 12,
  },
  paymentRadio: {
    marginRight: 12,
    justifyContent: 'center',
  },
  paymentDetails: {
    flex: 1,
  },
  paymentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  deliveryItem: {
    flexDirection: 'row',
    padding: 16,
    borderWidth: 1,
    borderColor: 'transparent',
    borderRadius: 12,
  },
  deliveryRadio: {
    marginRight: 12,
    justifyContent: 'center',
  },
  deliveryDetails: {
    flex: 1,
  },
  deliveryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  deliveryInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  orderItem: {
    padding: 16,
  },
  orderItemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  orderItemName: {
    flex: 1,
    marginRight: 12,
  },
  priceColumn: {
    alignItems: 'flex-end',
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  originalPrice: {
    textDecorationLine: 'line-through',
    textDecorationStyle: 'solid',
    opacity: 0.7,
    fontSize: 14,
  },
  divider: {
    height: 1,
    marginHorizontal: 16,
  },
  summaryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  totalItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  spacer: {
    height: 100,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopWidth: 1,
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  footerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  totalContainer: {
    flex: 1,
  },
  placeOrderButton: {
    width: 150,
  },
  successContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  successIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  successTitle: {
    marginBottom: 16,
  },
  successText: {
    textAlign: 'center',
  },
  freeDeliveryCard: {
    marginHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    padding: 12,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  freeDeliveryContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  freeDeliveryIcon: {
    marginRight: 12,
  },
  freeDeliveryText: {
    flex: 1,
  },
});