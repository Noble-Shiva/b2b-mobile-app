import { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Phone, MessageCircle, MapPin, Package, Check, Clock } from 'lucide-react-native';
import { Text, BackButton } from '@/components/ui';
import { colors } from '@/utils/theme';
import { useSelector } from 'react-redux';
import { selectIsDark } from '@/store/themeSlice';

export default function OrderTrackingScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const isDark = useSelector(selectIsDark);
  
  const [currentStep, setCurrentStep] = useState(1);
  const [estimatedTime, setEstimatedTime] = useState(25);
  
  // Simulate order progress
  useEffect(() => {
    const timer = setTimeout(() => {
      if (currentStep < 4) {
        setCurrentStep(currentStep + 1);
        setEstimatedTime(Math.max(5, estimatedTime - 10));
      }
    }, 10000); // Progress every 10 seconds for demo purposes
    
    return () => clearTimeout(timer);
  }, [currentStep, estimatedTime]);
  
  const steps = [
    {
      id: 1,
      title: 'Order Confirmed',
      description: 'Your order has been received',
      time: '10:30 AM',
      icon: <Check size={20} color="#FFFFFF" />,
    },
    {
      id: 2,
      title: 'Preparing Order',
      description: 'Your items are being prepared',
      time: '10:35 AM',
      icon: <Package size={20} color="#FFFFFF" />,
    },
    {
      id: 3,
      title: 'Out for Delivery',
      description: 'Your order is on the way',
      time: '10:45 AM',
      icon: <MapPin size={20} color="#FFFFFF" />,
    },
    {
      id: 4,
      title: 'Delivered',
      description: 'Your order has been delivered',
      time: '10:55 AM',
      icon: <Check size={20} color="#FFFFFF" />,
    },
  ];
  
  const getStepStatus = (stepId) => {
    if (stepId < currentStep) return 'completed';
    if (stepId === currentStep) return 'current';
    return 'upcoming';
  };

  return (
    <View style={[styles.container, { backgroundColor: isDark ? '#121212' : '#F8F8F8' }]}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      
      <View style={[
        styles.header, 
        { 
          backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF',
          borderBottomColor: isDark ? '#333333' : '#EEEEEE' 
        }
      ]}>
        <BackButton onPress={() => router.replace('/(tabs)')} />
        <Text variant="h4" weight="semibold">Order #{id}</Text>
        <View style={styles.placeholder} />
      </View>
      
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={[
          styles.mapContainer, 
          { 
            backgroundColor: isDark ? '#1E1E1E' : '#F0F0F0',
            borderBottomColor: isDark ? '#333333' : '#EEEEEE' 
          }
        ]}>
          <View style={styles.mapPlaceholder}>
            <Text variant="body" color="tertiary">Map View</Text>
          </View>
          
          <View style={styles.deliveryInfoOverlay}>
            <View style={[
              styles.deliveryInfoCard, 
              { backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF' }
            ]}>
              <View style={styles.deliveryTimeContainer}>
                <Clock size={20} color={colors.primary[600]} />
                <Text variant="body" weight="semibold" style={styles.deliveryTimeText}>
                  Estimated Delivery: {estimatedTime} min
                </Text>
              </View>
              
              <View style={[
                styles.divider, 
                { backgroundColor: isDark ? '#333333' : '#EEEEEE' }
              ]} />
              
              <View style={styles.courierContainer}>
                <View style={styles.courierImagePlaceholder}>
                  <Text variant="caption" color="tertiary">Photo</Text>
                </View>
                
                <View style={styles.courierInfo}>
                  <Text variant="body" weight="semibold">
                    Michael Rodriguez
                  </Text>
                  <Text variant="body-sm" color="secondary">
                    Delivery Partner
                  </Text>
                </View>
                
                <View style={styles.contactButtons}>
                  <TouchableOpacity style={[
                    styles.contactButton,
                    { backgroundColor: isDark ? '#2A2A2A' : '#FFF0EB' }
                  ]}>
                    <Phone size={20} color={colors.primary[600]} />
                  </TouchableOpacity>
                  
                  <TouchableOpacity style={[
                    styles.contactButton,
                    { backgroundColor: isDark ? '#2A2A2A' : '#FFF0EB' }
                  ]}>
                    <MessageCircle size={20} color={colors.primary[600]} />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </View>
        
        <View style={styles.trackingSection}>
          <Text variant="h4" weight="semibold" style={styles.sectionTitle}>
            Order Status
          </Text>
          
          <View style={[
            styles.trackingCard, 
            { backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF' }
          ]}>
            {steps.map((step, index) => {
              const status = getStepStatus(step.id);
              const isLast = index === steps.length - 1;
              
              return (
                <View key={step.id} style={styles.stepContainer}>
                  <View style={styles.stepIconLine}>
                    <View 
                      style={[
                        styles.stepIconContainer,
                        status === 'completed' && { backgroundColor: '#4CAF50' },
                        status === 'current' && { backgroundColor: colors.primary[600] },
                        status === 'upcoming' && { 
                          backgroundColor: isDark ? '#444444' : '#CCCCCC' 
                        },
                      ]}
                    >
                      {step.icon}
                    </View>
                    
                    {!isLast && (
                      <View 
                        style={[
                          styles.stepLine,
                          status === 'completed' && { backgroundColor: '#4CAF50' },
                          status === 'current' && { 
                            backgroundColor: isDark ? '#444444' : '#CCCCCC' 
                          },
                          status === 'upcoming' && { 
                            backgroundColor: isDark ? '#444444' : '#CCCCCC' 
                          },
                        ]}
                      />
                    )}
                  </View>
                  
                  <View style={styles.stepDetails}>
                    <View style={styles.stepHeader}>
                      <Text 
                        variant="body"
                        weight="semibold"
                        color={
                          status === 'completed' ? 'success' : 
                          status === 'current' ? 'accent' : 
                          'tertiary'
                        }
                      >
                        {step.title}
                      </Text>
                      <Text variant="caption" color="tertiary">{step.time}</Text>
                    </View>
                    
                    <Text variant="body-sm" color="secondary">
                      {step.description}
                    </Text>
                  </View>
                </View>
              );
            })}
          </View>
        </View>
        
        <View style={styles.orderDetailsSection}>
          <Text variant="h4" weight="semibold" style={styles.sectionTitle}>
            Order Details
          </Text>
          
          <View style={[
            styles.orderDetailsCard, 
            { backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF' }
          ]}>
            <View style={styles.orderItem}>
              <View style={styles.orderItemImagePlaceholder}>
                <Text variant="caption" color="tertiary">Image</Text>
              </View>
              
              <View style={styles.orderItemDetails}>
                <Text variant="body" weight="medium">
                  Organic Avocado
                </Text>
                <Text variant="body-sm" color="secondary">
                  Qty: 2
                </Text>
              </View>
              
              <Text variant="body" weight="semibold">
                ₹5.98
              </Text>
            </View>
            
            <View style={[
              styles.divider, 
              { backgroundColor: isDark ? '#333333' : '#EEEEEE' }
            ]} />
            
            <View style={styles.orderItem}>
              <View style={styles.orderItemImagePlaceholder}>
                <Text variant="caption" color="tertiary">Image</Text>
              </View>
              
              <View style={styles.orderItemDetails}>
                <Text variant="body" weight="medium">
                  Potato Chips Variety Pack
                </Text>
                <Text variant="body-sm" color="secondary">
                  Qty: 1
                </Text>
              </View>
              
              <Text variant="body" weight="semibold">
                ₹8.99
              </Text>
            </View>
            
            <View style={[
              styles.divider, 
              { backgroundColor: isDark ? '#333333' : '#EEEEEE' }
            ]} />
            
            <View style={styles.orderItem}>
              <View style={styles.orderItemImagePlaceholder}>
                <Text variant="caption" color="tertiary">Image</Text>
              </View>
              
              <View style={styles.orderItemDetails}>
                <Text variant="body" weight="medium">
                  Sparkling Water 12-Pack
                </Text>
                <Text variant="body-sm" color="secondary">
                  Qty: 1
                </Text>
              </View>
              
              <Text variant="body" weight="semibold">
                ₹9.99
              </Text>
            </View>
            
            <View style={[
              styles.divider, 
              { backgroundColor: isDark ? '#333333' : '#EEEEEE' }
            ]} />
            
            <View style={styles.orderSummary}>
              <View style={styles.summaryRow}>
                <Text variant="body" color="secondary">
                  Subtotal
                </Text>
                <Text variant="body" weight="medium">
                  ₹24.96
                </Text>
              </View>
              
              <View style={styles.summaryRow}>
                <Text variant="body" color="secondary">
                  Delivery Fee
                </Text>
                <Text variant="body" weight="medium">
                  Free
                </Text>
              </View>
              
              <View style={styles.summaryRow}>
                <Text variant="body" weight="semibold">
                  Total
                </Text>
                <Text variant="h4" weight="bold" color="accent">
                  ₹24.96
                </Text>
              </View>
            </View>
          </View>
        </View>
        
        <View style={styles.spacer} />
      </ScrollView>
      
      <View style={[
        styles.footer, 
        { 
          backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF',
          borderTopColor: isDark ? '#333333' : '#EEEEEE' 
        }
      ]}>
        <TouchableOpacity 
          style={[styles.supportButton, { backgroundColor: colors.primary[600] }]}
          onPress={() => router.push('/support')}
        >
          <Text variant="body" weight="semibold" color="inverse">
            Need Help?
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 16,
    borderBottomWidth: 1,
  },
  placeholder: {
    width: 40,
  },
  mapContainer: {
    height: 250,
    position: 'relative',
    borderBottomWidth: 1,
  },
  mapPlaceholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  deliveryInfoOverlay: {
    position: 'absolute',
    bottom: -50,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
  },
  deliveryInfoCard: {
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  deliveryTimeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  deliveryTimeText: {
    marginLeft: 8,
  },
  divider: {
    height: 1,
    marginVertical: 12,
  },
  courierContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  courierImagePlaceholder: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  courierInfo: {
    flex: 1,
    marginLeft: 12,
  },
  contactButtons: {
    flexDirection: 'row',
  },
  contactButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  trackingSection: {
    marginTop: 60,
    marginBottom: 24,
  },
  sectionTitle: {
    marginLeft: 16,
    marginBottom: 12,
  },
  trackingCard: {
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  stepContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  stepIconLine: {
    alignItems: 'center',
    marginRight: 16,
  },
  stepIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  stepLine: {
    width: 2,
    flex: 1,
    marginTop: 4,
    marginBottom: 4,
  },
  stepDetails: {
    flex: 1,
  },
  stepHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  orderDetailsSection: {
    marginBottom: 24,
  },
  orderDetailsCard: {
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  orderItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
  orderItemImagePlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  orderItemDetails: {
    flex: 1,
    marginLeft: 12,
  },
  orderSummary: {
    marginTop: 8,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
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
    padding: 16,
    paddingBottom: 32,
  },
  supportButton: {
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
});