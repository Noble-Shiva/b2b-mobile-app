import React from 'react';
import { View, StyleSheet, Image, ScrollView } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Check, Package, ShoppingCart, RefreshCw } from 'lucide-react-native';
import { Text, Button } from '@/components/ui';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import { selectIsDark } from '@/store/themeSlice';
import { colors } from '@/utils/theme';

export default function OrderSuccessScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const isDark = useSelector(selectIsDark);
  const { orderId, amount } = useLocalSearchParams<{ orderId: string; amount: string }>();
  
  return (
    <View style={[styles.container, { 
      backgroundColor: isDark ? '#121212' : '#F8F8F8',
      paddingTop: insets.top,
      paddingBottom: insets.bottom
    }]}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      
      <ScrollView 
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.successIconContainer}>
          <Check size={40} color="#FFFFFF" />
        </View>
        
        <Text variant="h2" weight="bold" style={styles.successTitle}>
          Thank You!
        </Text>
        
        <Text variant="h4" weight="semibold" style={styles.successSubtitle}>
          Your order has been confirmed
        </Text>
        
        <Text variant="body" color="secondary" style={styles.successText}>
          We've received your order and are processing it right now. You'll receive a confirmation email shortly.
        </Text>
        
        <View style={[styles.orderInfoCard, { backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF' }]}>
          <Text variant="h4" weight="semibold" style={styles.orderInfoTitle}>
            Order Information
          </Text>
          
          <View style={styles.orderInfoRow}>
            <Text variant="body" color="secondary">Order ID</Text>
            <Text variant="body" weight="medium">{orderId || 'N/A'}</Text>
          </View>
          
          {amount && (
            <View style={styles.orderInfoRow}>
              <Text variant="body" color="secondary">Amount Paid</Text>
              <Text variant="body" weight="medium">₹{amount}</Text>
            </View>
          )}
          
          <View style={styles.orderInfoRow}>
            <Text variant="body" color="secondary">Payment Status</Text>
            <View style={styles.statusBadge}>
              <Text variant="caption" weight="medium" style={{ color: '#FFFFFF' }}>
                PAID
              </Text>
            </View>
          </View>
        </View>
        
        <View style={styles.stepsContainer}>
          <View style={styles.stepItem}>
            <View style={[styles.stepIconContainer, { backgroundColor: colors.primary[100] }]}>
              <ShoppingCart size={24} color={colors.primary[700]} />
            </View>
            <View style={styles.stepContent}>
              <Text variant="body" weight="semibold">Order Confirmed</Text>
              <Text variant="body-sm" color="secondary">Your order has been confirmed</Text>
            </View>
          </View>
          
          <View style={[styles.stepConnector, { backgroundColor: isDark ? '#333333' : '#EEEEEE' }]} />
          
          <View style={styles.stepItem}>
            <View style={[styles.stepIconContainer, { backgroundColor: '#F0F0F0' }]}>
              <Package size={24} color="#999999" />
            </View>
            <View style={styles.stepContent}>
              <Text variant="body" weight="semibold" color="secondary">Processing Order</Text>
              <Text variant="body-sm" color="secondary">We're preparing your items</Text>
            </View>
          </View>
          
          <View style={[styles.stepConnector, { backgroundColor: isDark ? '#333333' : '#EEEEEE' }]} />
          
          <View style={styles.stepItem}>
            <View style={[styles.stepIconContainer, { backgroundColor: '#F0F0F0' }]}>
              <RefreshCw size={24} color="#999999" />
            </View>
            <View style={styles.stepContent}>
              <Text variant="body" weight="semibold" color="secondary">On the Way</Text>
              <Text variant="body-sm" color="secondary">Your package is on the way</Text>
            </View>
          </View>
        </View>
      </ScrollView>
      
      <View style={styles.footer}>
        <Button 
          variant="primary"
          style={{ flex: 1, marginRight: 8 }}
          // onPress={() => router.replace(`/order-tracking/${orderId || ''}`)}
          onPress={() => router.replace(`/order-details?id=${orderId || ''}`)}
        >
          Track Order
        </Button>
        
        <Button 
          variant="secondary"
          style={{ flex: 1, marginLeft: 8 }}
          onPress={() => router.replace('/(tabs)')}
        >
          Continue Shopping
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
    alignItems: 'center',
  },
  successIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primary[700],
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    marginTop: 40,
  },
  successTitle: {
    marginBottom: 8,
    textAlign: 'center',
  },
  successSubtitle: {
    marginBottom: 16,
    textAlign: 'center',
  },
  successText: {
    textAlign: 'center',
    marginBottom: 32,
    paddingHorizontal: 20,
  },
  orderInfoCard: {
    width: '100%',
    borderRadius: 12,
    padding: 20,
    marginBottom: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  orderInfoTitle: {
    marginBottom: 16,
  },
  orderInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.05)',
  },
  statusBadge: {
    backgroundColor: '#4CAF50',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  stepsContainer: {
    width: '100%',
    marginBottom: 24,
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
  stepIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  stepContent: {
    flex: 1,
  },
  stepConnector: {
    width: 2,
    height: 24,
    marginLeft: 24,
  },
  footer: {
    flexDirection: 'row',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.05)',
  },
});
