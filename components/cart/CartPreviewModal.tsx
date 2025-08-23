import React, { useState, useEffect } from 'react';
import { Modal, View, Text, TouchableOpacity, Image, FlatList, StyleSheet, ActivityIndicator, Animated } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { selectCartItems, updateQuantity, selectTotal, selectSubtotal } from '@/store/cartSlice';
import { selectIsDark } from '@/store/themeSlice';
import { colors } from '@/utils/theme';
import { formatPrice } from '@/utils/helpers';

export default function CartPreviewModal({ visible, onClose }: { visible: boolean, onClose: () => void }) {
  const cartItems = useSelector(selectCartItems);
  const cartTotal = useSelector(selectTotal);
  const cartSubtotal = useSelector(selectSubtotal);
  const isDark = useSelector(selectIsDark);
  const dispatch = useDispatch();
  const [loadingItemId, setLoadingItemId] = useState<string | null>(null);
  
  // Animation values for fade effect
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(50));
  const [scaleAnim] = useState(new Animated.Value(0.95));

  // Calculate tiered pricing based on quantity
  const calculateTieredPrice = (basePrice: number, quantity: number) => {
    if (quantity >= 20) {
      return basePrice * 0.9; // 10% discount
    } else if (quantity >= 10) {
      return basePrice * 0.95; // 5% discount
    }
    return basePrice;
  };

  // Calculate total with tiered pricing
  const calculateTotalWithTieredPricing = () => {
    const tieredTotal = cartItems.reduce((total, item) => {
      const tieredPrice = calculateTieredPrice(item.price, item.quantity);
      return total + (tieredPrice * item.quantity);
    }, 0);
    return tieredTotal;
  };

  // Calculate total savings from original prices and tiered pricing
  const calculateTotalSavings = () => {
    const originalTotal = cartItems.reduce((total, item) => {
      const originalPrice = item.originalPrice || item.price * 1.25; // Fallback if no original price
      return total + (originalPrice * item.quantity);
    }, 0);
    const tieredTotal = calculateTotalWithTieredPricing();
    return originalTotal - tieredTotal;
  };

  const tieredTotal = calculateTotalWithTieredPricing();
  const totalSavings = calculateTotalSavings();
  const regularTotal = cartItems.reduce((total, item) => {
    const originalPrice = item.originalPrice || item.price * 1.25;
    return total + (originalPrice * item.quantity);
  }, 0);

  const handleQtyChange = (item: any, change: number) => {
    setLoadingItemId(item.id);
    dispatch(updateQuantity({ id: item.id, quantity: item.quantity + change }));
    setTimeout(() => setLoadingItemId(null), 400); // Simulate async update
  };

  // Handle animation when modal visibility changes
  useEffect(() => {
    if (visible) {
      // Reset animation values first
      fadeAnim.setValue(0);
      slideAnim.setValue(50);
      scaleAnim.setValue(0.95);
      
      // Fade in, slide up, and scale up with spring physics
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(slideAnim, {
          toValue: 0,
          useNativeDriver: true,
          tension: 100,
          friction: 8,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          useNativeDriver: true,
          tension: 100,
          friction: 8,
        }),
      ]).start();
    } else {
      // Fade out, slide down, and scale down
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 50,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 0.95,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible, fadeAnim, slideAnim, scaleAnim]);

  // Handle close with animation delay
  const handleClose = () => {
    // Start close animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 50,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      // Call the original onClose after animation completes
      onClose();
    });
  };

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={handleClose}>
      <Animated.View 
        style={[
          styles.overlay, 
          { opacity: fadeAnim }
        ]}
      >
        <TouchableOpacity 
          style={styles.overlayTouchable} 
          activeOpacity={1} 
          onPress={handleClose}
        >
          <View style={styles.overlayTouchableInner} />
        </TouchableOpacity>
        <Animated.View 
          style={[
            styles.modalContent, 
            { 
              backgroundColor: isDark ? '#1E1E1E' : '#fff',
              transform: [
                { translateY: slideAnim },
                { scale: scaleAnim }
              ]
            }
          ]}
          onStartShouldSetResponder={() => true}
        >
          <View style={styles.header}>
            <Text style={[styles.title, { color: isDark ? '#FFFFFF' : '#333' }]}>Cart Preview</Text>
            <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
              <Text style={[styles.closeText, { color: isDark ? '#FFFFFF' : '#333' }]}>✕</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={cartItems}
            keyExtractor={item => item.id}
            renderItem={({ item }) => {
              const tieredPrice = calculateTieredPrice(item.price, item.quantity);
              const itemTotal = tieredPrice * item.quantity;
              const originalPrice = item.originalPrice || item.price * 1.25;
              const originalItemTotal = originalPrice * item.quantity;
              const itemSavings = originalItemTotal - itemTotal;
              
              return (
                <View style={[styles.itemRow, { borderBottomColor: isDark ? '#333' : '#f0f0f0' }]}>
                  <Image source={{ uri: item.image }} style={styles.itemImage} />
                  <View style={styles.itemInfo}>
                    <Text style={[styles.itemName, { color: isDark ? '#FFFFFF' : '#333' }]} numberOfLines={2}>
                      {item.name}
                    </Text>
                    <View style={styles.priceRow}>
                      <Text style={[styles.itemPrice, { color: colors.primary[700] }]}>
                        {formatPrice(tieredPrice)}/unit
                      </Text>
                      {tieredPrice < item.price && (
                        <Text style={[styles.originalUnitPrice, { color: isDark ? '#888' : '#666' }]}>
                          {formatPrice(item.price)}
                        </Text>
                      )}
                    </View>
                    <View style={styles.totalRow}>
                      <Text style={[styles.itemTotalPrice, { color: colors.primary[700] }]}>
                        {formatPrice(itemTotal)}
                      </Text>
                      {itemSavings > 0 && (
                        <>
                          <Text style={[styles.originalTotalPrice, { color: isDark ? '#888' : '#666' }]}>
                            {formatPrice(originalItemTotal)}
                          </Text>
                          <Text style={[styles.savingsText, { color: '#43a047' }]}>
                            Save {formatPrice(itemSavings)}
                          </Text>
                        </>
                      )}
                    </View>
                  </View>
                  <View style={styles.qtyControls}>
                    <TouchableOpacity
                      style={styles.qtyButton}
                      onPress={() => handleQtyChange(item, -1)}
                      disabled={loadingItemId === item.id}
                    >
                      {loadingItemId === item.id ? (
                        <ActivityIndicator size="small" color={colors.primary[600]} />
                      ) : (
                        <Text style={styles.qtyButtonText}>-</Text>
                      )}
                    </TouchableOpacity>
                    <Text style={[styles.qtyValue, { color: isDark ? '#FFFFFF' : '#333' }]}>
                      {item.quantity}
                    </Text>
                    <TouchableOpacity
                      style={styles.qtyButton}
                      onPress={() => handleQtyChange(item, 1)}
                      disabled={loadingItemId === item.id}
                    >
                      {loadingItemId === item.id ? (
                        <ActivityIndicator size="small" color={colors.primary[600]} />
                      ) : (
                        <Text style={styles.qtyButtonText}>+</Text>
                      )}
                    </TouchableOpacity>
                  </View>
                </View>
              );
            }}
            ListEmptyComponent={
              <Text style={[styles.emptyText, { color: isDark ? '#888' : '#888' }]}>
                Your cart is empty.
              </Text>
            }
          />
          {/* Cart Total at the bottom */}
          <View style={[styles.totalSection, { borderTopColor: isDark ? '#333' : '#eee' }]}>
            <View style={styles.totalRowFooter}>
              <Text style={[styles.totalLabel, { color: isDark ? '#FFFFFF' : '#333' }]}>Total</Text>
              <View style={styles.totalPrices}>
                <Text style={[styles.totalValue, { color: colors.primary[700] }]}>
                  {formatPrice(tieredTotal)}
                </Text>
                {totalSavings > 0 && (
                  <Text style={[styles.originalTotalValue, { color: isDark ? '#888' : '#666' }]}>
                    {formatPrice(regularTotal)}
                  </Text>
                )}
              </View>
            </View>
            {totalSavings > 0 && (
              <View style={styles.savingsRow}>
                <Text style={[styles.savingsLabel, { color: '#43a047' }]}>
                  You save {formatPrice(totalSavings)} with bulk pricing!
                </Text>
              </View>
            )}
          </View>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  overlayTouchable: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
  },
  overlayTouchableInner: {
    flex: 1,
  },
  modalContent: {
    width: '100%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '80%',
    paddingBottom: 32,
    zIndex: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 8,
  },
  closeText: {
    fontSize: 20,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
  },
  itemImage: {
    width: 48,
    height: 48,
    borderRadius: 8,
    marginRight: 12,
    backgroundColor: '#f0f0f0',
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 15,
    fontWeight: '500',
    marginBottom: 4,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: '600',
  },
  originalUnitPrice: {
    fontSize: 12,
    textDecorationLine: 'line-through',
    marginLeft: 6,
  },
  totalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  totalRowFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  itemTotalPrice: {
    fontSize: 15,
    fontWeight: 'bold',
    marginRight: 6,
  },
  originalTotalPrice: {
    fontSize: 13,
    textDecorationLine: 'line-through',
    marginRight: 6,
  },
  savingsText: {
    fontSize: 11,
    fontWeight: '600',
  },
  qtyControls: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  qtyButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.primary[600],
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 2,
  },
  qtyButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  qtyValue: {
    fontSize: 16,
    fontWeight: 'bold',
    marginHorizontal: 8,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 40,
    fontSize: 16,
  },
  totalSection: {
    marginTop: 16,
    paddingTop: 12,
    borderTopWidth: 1,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  totalPrices: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  totalValue: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  originalTotalValue: {
    fontSize: 15,
    textDecorationLine: 'line-through',
    marginTop: 2,
  },
  savingsRow: {
    marginTop: 8,
    alignItems: 'center',
  },
  savingsLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
}); 