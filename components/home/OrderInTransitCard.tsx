import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useSelector } from 'react-redux';
import { useRouter } from 'expo-router';
import { selectIsDark } from '@/store/themeSlice';
import { Text } from '@/components/ui';
import { Truck, Clock, MapPin, ChevronRight, Package, ShoppingBag, Shuffle, MessageCircle } from 'lucide-react-native';

interface TransitOrder {
  id: string;
  orderNumber: string;
  totalItems: number;
  orderValue: number;
  estimatedDelivery: string;
  currentStatus: string;
  deliveryPartner: string;
  trackingId: string;
  progress: number; // 0-100
  placedDate: string;
}

interface OrderStatus {
  status: string;
  progress: number;
  eta: string;
  partner: string;
  trackingId: string;
}

// Different status scenarios for simulation
const statusScenarios: OrderStatus[] = [
  {
    status: 'Order Confirmed',
    progress: 15,
    eta: 'Tomorrow by 8:00 PM',
    partner: 'BlueDart Express',
    trackingId: 'BD123456789'
  },
  {
    status: 'Shipped',
    progress: 40,
    eta: 'Tomorrow by 2:00 PM',
    partner: 'BlueDart Express',
    trackingId: 'BD123456789'
  },
  {
    status: 'In Transit',
    progress: 65,
    eta: 'Today by 8:00 PM',
    partner: 'BlueDart Express',
    trackingId: 'BD123456789'
  },
  {
    status: 'Out for Delivery',
    progress: 85,
    eta: 'Today by 6:00 PM',
    partner: 'BlueDart Express',
    trackingId: 'BD123456789'
  },
  {
    status: 'Delivered',
    progress: 100,
    eta: 'Delivered at 4:30 PM',
    partner: 'BlueDart Express',
    trackingId: 'BD123456789'
  }
];

// Base order data
const baseOrder: TransitOrder = {
  id: '1',
  orderNumber: 'ORD-2024-1205',
  totalItems: 25,
  orderValue: 45250,
  estimatedDelivery: 'Today by 6:00 PM',
  currentStatus: 'Out for Delivery',
  deliveryPartner: 'BlueDart Express',
  trackingId: 'BD123456789',
  progress: 85,
  placedDate: '2024-12-03'
};

export default function OrderInTransitCard() {
  const isDark = useSelector(selectIsDark);
  const router = useRouter();
  const [currentStatusIndex, setCurrentStatusIndex] = useState(3); // Start with "Out for Delivery"

  // Current order state with simulated status
  const currentStatus = statusScenarios[currentStatusIndex];
  const transitOrder: TransitOrder = {
    ...baseOrder,
    currentStatus: currentStatus.status,
    progress: currentStatus.progress,
    estimatedDelivery: currentStatus.eta,
    deliveryPartner: currentStatus.partner,
    trackingId: currentStatus.trackingId
  };

  const handleTrackOrder = () => {
    router.push(`/order-details?orderId=${transitOrder.orderNumber}` as any);
  };

  const handleGetSupport = () => {
    router.push('/(tabs)/support' as any);
  };

  const simulateStatusChange = () => {
    setCurrentStatusIndex((prev) => (prev + 1) % statusScenarios.length);
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'order confirmed':
        return '#9C27B0';
      case 'shipped':
        return '#4CAF50';
      case 'in transit':
        return '#2196F3';
      case 'out for delivery':
        return '#FF9800';
      case 'delivered':
        return '#00C853';
      default:
        return '#9E9E9E';
    }
  };

  const formatProgress = (progress: number) => {
    if (progress >= 80) return 'Almost there!';
    if (progress >= 60) return 'On the way';
    if (progress >= 40) return 'In transit';
    return 'Processing';
  };

  return (
    <View style={[styles.container, { backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF' }]}>
      {/* Header with icon and title */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={[styles.iconContainer, { backgroundColor: '#E3F2FD' }]}>
            <Truck size={20} color="#2196F3" />
          </View>
          <Text variant="h4" weight="semibold" style={styles.headerTitle}>
            Order in Transit
          </Text>
        </View>
        <TouchableOpacity onPress={handleTrackOrder} style={styles.viewAllButton}>
          <Text variant="caption" weight="medium" style={{ color: '#2196F3' }}>
            View All
          </Text>
        </TouchableOpacity>
      </View>

      {/* Main Transit Card */}
      <TouchableOpacity 
        style={[
          styles.transitCard,
          { 
            backgroundColor: isDark ? '#2A2A2A' : '#FFFFFF',
            borderColor: getStatusColor(transitOrder.currentStatus)
          }
        ]}
        onPress={handleTrackOrder}
        activeOpacity={0.8}
      >
        {/* Status Badge */}
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(transitOrder.currentStatus) }]}>
          <Text variant="caption" weight="bold" color="inverse">
            {transitOrder.currentStatus.toUpperCase()}
          </Text>
        </View>

        {/* Card Content */}
        <View style={styles.cardContent}>
                    {/* Order Info */}
          <View style={styles.productSection}>
            <View style={styles.orderIconContainer}>
              <View style={[styles.orderIconBackground, { backgroundColor: getStatusColor(transitOrder.currentStatus) + '20' }]}>
                <ShoppingBag size={28} color={getStatusColor(transitOrder.currentStatus)} />
              </View>
            </View>
            
            <View style={styles.productInfo}>
              <Text variant="body" weight="semibold" numberOfLines={1}>
                Order #{transitOrder.orderNumber}
              </Text>
              <Text variant="caption" color="secondary">
                {transitOrder.totalItems} items • ₹{transitOrder.orderValue.toLocaleString('en-IN')}
              </Text>
              <Text variant="caption" color="secondary" style={{ fontSize: 11 }}>
                Placed on {new Date(transitOrder.placedDate).toLocaleDateString('en-IN', { 
                  day: 'numeric', 
                  month: 'short' 
                })}
              </Text>
              
              {/* Progress Indicator */}
              <View style={styles.progressSection}>
                <View style={styles.progressBar}>
                  <View 
                    style={[
                      styles.progressFill, 
                      { 
                        width: `${transitOrder.progress}%`,
                        backgroundColor: getStatusColor(transitOrder.currentStatus)
                      }
                    ]} 
                  />
                </View>
                <Text variant="caption" style={[styles.progressText, { color: getStatusColor(transitOrder.currentStatus) }] as any}>
                  {formatProgress(transitOrder.progress)}
                </Text>
              </View>
            </View>
          </View>

          {/* Delivery Info */}
          <View style={styles.deliverySection}>
            <View style={styles.deliveryRow}>
              <View style={styles.deliveryInfo}>
                <Clock size={14} color={isDark ? '#CCCCCC' : '#666666'} />
                <Text variant="caption" color="secondary" style={styles.deliveryText}>
                  ETA: {transitOrder.estimatedDelivery}
                </Text>
              </View>
              <ChevronRight size={16} color={isDark ? '#CCCCCC' : '#999999'} />
            </View>
            
            <View style={styles.deliveryRow}>
              <View style={styles.deliveryInfo}>
                <MapPin size={14} color={isDark ? '#CCCCCC' : '#666666'} />
                <Text variant="caption" color="secondary" style={styles.deliveryText}>
                  via {transitOrder.deliveryPartner}
                </Text>
              </View>
              <Text variant="caption" color="secondary" style={styles.trackingId}>
                {transitOrder.trackingId}
              </Text>
            </View>
          </View>
        </View>

        {/* Animated highlight effect */}
        <View style={[styles.highlightOverlay, { borderColor: getStatusColor(transitOrder.currentStatus) }]} />
        
        {/* Simulate Button - Bottom Right Corner */}
        <TouchableOpacity 
          style={[styles.simulateButton, { backgroundColor: isDark ? '#404040' : '#F5F5F5' }]}
          onPress={simulateStatusChange}
        >
          <Shuffle size={16} color={isDark ? '#CCCCCC' : '#666666'} />
        </TouchableOpacity>
      </TouchableOpacity>

      {/* Quick Actions */}
      <View style={styles.actionButtons}>
        <TouchableOpacity 
          style={[styles.actionButton, styles.trackButton]} 
          onPress={handleTrackOrder}
        >
          <Truck size={16} color="#FFFFFF" />
          <Text variant="body-sm" weight="semibold" color="inverse" style={styles.actionButtonText}>
            Track Order
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[
            styles.actionButton, 
            styles.detailsButton,
            { borderColor: isDark ? '#404040' : '#E0E0E0' }
          ]} 
          onPress={handleGetSupport}
        >
          <MessageCircle size={16} color={isDark ? '#FFFFFF' : '#333333'} />
          <Text variant="body-sm" weight="semibold" style={[styles.actionButtonText, { color: isDark ? '#FFFFFF' : '#333333' }] as any}>
            Get Support
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 12,
    marginHorizontal: 16,
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  headerTitle: {
    color: '#2196F3',
  },
  viewAllButton: {
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  transitCard: {
    borderRadius: 12,
    borderWidth: 2,
    borderStyle: 'solid',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    position: 'relative',
    overflow: 'hidden',
    marginBottom: 16,
  },
  statusBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderBottomLeftRadius: 8,
    zIndex: 1,
  },
  cardContent: {
    padding: 16,
  },
  productSection: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  orderIconContainer: {
    marginRight: 12,
  },
  orderIconBackground: {
    width: 60,
    height: 60,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  productImageContainer: {
    marginRight: 12,
  },
  productImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
  },
  productImagePlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  productInfo: {
    flex: 1,
    justifyContent: 'space-between',
  },
  progressSection: {
    marginTop: 8,
  },
  progressBar: {
    height: 4,
    backgroundColor: '#E0E0E0',
    borderRadius: 2,
    marginBottom: 4,
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  progressText: {
    fontSize: 11,
    fontWeight: '600',
  },
  deliverySection: {
    gap: 8,
  },
  deliveryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  deliveryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  deliveryText: {
    marginLeft: 8,
  },
  trackingId: {
    fontFamily: 'monospace',
    fontSize: 11,
  },
  highlightOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 12,
    borderWidth: 1,
    borderStyle: 'dashed',
    opacity: 0.3,
    pointerEvents: 'none',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  trackButton: {
    backgroundColor: '#2196F3',
  },
  detailsButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
  },
  actionButtonText: {
    marginLeft: 8,
  },
  simulateButton: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
}); 