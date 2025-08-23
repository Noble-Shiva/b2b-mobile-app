import * as React from 'react';
import { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, FlatList, ScrollView, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Filter, Package } from 'lucide-react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring,
  FadeInDown,
  SlideInRight
} from 'react-native-reanimated';
import { Text, BackButton, Button } from '@/components/ui';
import OrderItem from '@/components/profile/OrderItem';
import { colors as themeColors } from '@/utils/theme';
import { useSelector, useDispatch } from 'react-redux';
import { selectIsDark } from '@/store/themeSlice';
import { selectUser } from '@/store/authSlice';
import { selectOrders, selectOrdersLoading, selectOrdersError, fetchUserOrders } from '@/store/ordersSlice';

type FilterType = 'all' | 'delivered' | 'processing' | 'cancelled';

export default function OrdersScreen() {
  const router = useRouter();
  const isDark = useSelector(selectIsDark);
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const orders = useSelector(selectOrders);
  const isLoading = useSelector(selectOrdersLoading);
  const error = useSelector(selectOrdersError);

  const [activeFilter, setActiveFilter] = useState<FilterType>('all');

  // Animation values for filter selection
  const filterAnimation = useSharedValue(0);

  // Fetch orders when component mounts
  useEffect(() => {
    if (user?.id) {
      console.log('Fetching orders for user:', user.id);
      const userId = typeof user.id === 'string' ? parseInt(user.id) : user.id;
      dispatch(fetchUserOrders(userId) as any);
    }
  }, [dispatch, user?.id]);

  // Animate filter changes
  useEffect(() => {
    filterAnimation.value = withSpring(1, {
      damping: 20,
      stiffness: 300,
    });
  }, [activeFilter]);

  const filteredOrders = activeFilter === 'all'
    ? orders
    : orders.filter(order => order.status === activeFilter);

  const handleOrderPress = (orderId: number) => {
    router.push(`/order-details?id=${orderId}`);
  };

  const handleFilterChange = (newFilter: FilterType) => {
    if (newFilter !== activeFilter) {
      filterAnimation.value = 0;
      setActiveFilter(newFilter);
    }
  };

  const filterAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: filterAnimation.value,
      transform: [
        {
          scale: 0.95 + (filterAnimation.value * 0.05),
        },
      ],
    };
  });

  return (
    <View style={[styles.container, { backgroundColor: isDark ? '#121212' : '#F8F8F8' }]}> 
      <StatusBar style={isDark ? 'light' : 'dark'} />

      {/* Header */}
      <View style={[
        styles.header,
        {
          backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF',
          borderBottomColor: isDark ? '#333333' : '#EEEEEE'
        }
      ]}>
        <BackButton />
        <Text variant="h3" weight="bold">My Orders</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Filters Container */}
      <View style={[
        styles.filtersContainer,
        {
          backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF',
          borderBottomColor: isDark ? '#333333' : '#EEEEEE'
        }
      ]}>
        <Animated.View style={filterAnimatedStyle}>
          <ScrollableFilter
            options={[
              { value: 'all', label: 'All Orders' },
              { value: 'delivered', label: 'Delivered' },
              { value: 'processing', label: 'Processing' },
              { value: 'cancelled', label: 'Cancelled' }
            ]}
            activeValue={activeFilter}
            onChange={handleFilterChange}
            isDark={isDark}
          />
        </Animated.View>
      </View>

      {/* Content */}
      {isLoading ? (
        <Animated.View 
          entering={FadeInDown.duration(400)}
          style={styles.loadingContainer}
        >
          <ActivityIndicator size="large" color={themeColors.primary[600]} />
          <Text variant="body" color="secondary" style={styles.loadingText}>
            Loading your orders...
          </Text>
        </Animated.View>
      ) : error ? (
        <Animated.View 
          entering={SlideInRight.duration(400)}
          style={styles.errorContainer}
        >
          <Package size={64} color={isDark ? '#666666' : '#CCCCCC'} />
          <Text variant="h3" weight="bold" style={styles.errorTitle}>
            Unable to load orders
          </Text>
          <Text variant="body" color="secondary" style={styles.errorText}>
            {error}
          </Text>
          <Button
            variant="primary"
            style={styles.retryButton}
            onPress={() => {
              if (user?.id) {
                const userId = typeof user.id === 'string' ? parseInt(user.id) : user.id;
                dispatch(fetchUserOrders(userId) as any);
              }
            }}
          >
            Try Again
          </Button>
        </Animated.View>
      ) : filteredOrders.length > 0 ? (
        <FlatList
          data={filteredOrders}
          renderItem={({ item, index }) => (
            <Animated.View entering={FadeInDown.delay(index * 100)}>
              <OrderItem
                order={item}
                onPress={() => handleOrderPress(item.order_id)}
                isDark={isDark}
              />
            </Animated.View>
          )}
          keyExtractor={(item) => item.order_id.toString()}
          contentContainerStyle={styles.ordersList}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <Animated.View 
          entering={SlideInRight.duration(600)}
          style={styles.emptyContainer}
        >
          <View style={[
            styles.emptyIconContainer,
            { backgroundColor: isDark ? '#2A2A2A' : '#F5F5F5' }
          ]}>
            <Package size={48} color={isDark ? '#666666' : '#CCCCCC'} />
          </View>
          <Text variant="h2" weight="bold" style={styles.emptyTitle}>
            No {activeFilter !== 'all' ? activeFilter : ''} orders found
          </Text>
          <Text variant="body" color="secondary" style={styles.emptyText}>
            {activeFilter !== 'all'
              ? `You don't have any ${activeFilter} orders yet.`
              : 'You haven\'t placed any orders yet. Start shopping to see your orders here.'}
          </Text>
          <Button
            variant="primary"
            style={styles.shopButton}
            onPress={() => router.push('/(tabs)')}
          >
            Start Shopping
          </Button>
        </Animated.View>
      )}
    </View>
  );
}

interface FilterOption {
  value: string;
  label: string;
}

interface ScrollableFilterProps {
  options: FilterOption[];
  activeValue: string;
  onChange: (value: FilterType) => void;
  isDark: boolean;
}

function ScrollableFilter({ options, activeValue, onChange, isDark }: ScrollableFilterProps) {
  return (
    <ScrollView 
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.filterScrollContainer}
    >
      {options.map((option, index) => {
        const isActive = activeValue === option.value;
        return (
          <Animated.View
            key={option.value}
            entering={FadeInDown.delay(index * 50)}
          >
            <TouchableOpacity
              style={[
                styles.filterOption,
                { 
                  backgroundColor: isActive 
                    ? themeColors.primary[600] 
                    : (isDark ? '#2A2A2A' : '#F5F5F5'),
                  borderColor: isActive 
                    ? themeColors.primary[600] 
                    : 'transparent',
                  shadowColor: isActive ? themeColors.primary[600] : 'transparent',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: isActive ? 0.2 : 0,
                  shadowRadius: 4,
                  elevation: isActive ? 3 : 0,
                }
              ]}
              onPress={() => onChange(option.value as FilterType)}
              activeOpacity={0.7}
            >
              <Text
                variant="body-sm"
                weight={isActive ? "semibold" : "medium"}
                color={isActive ? 'inverse' : 'secondary'}
              >
                {option.label}
              </Text>
            </TouchableOpacity>
          </Animated.View>
        );
      })}
    </ScrollView>
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
  filtersContainer: {
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  filterScrollContainer: {
    paddingHorizontal: 16,
    gap: 8,
  },
  filterOption: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 24,
    borderWidth: 1,
    minWidth: 80,
    alignItems: 'center',
  },
  ordersList: {
    padding: 16,
    paddingBottom: 32,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingVertical: 48,
  },
  emptyIconContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  emptyTitle: {
    textAlign: 'center',
    marginBottom: 12,
    paddingHorizontal: 16,
  },
  emptyText: {
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 22,
    paddingHorizontal: 16,
  },
  shopButton: {
    paddingHorizontal: 32,
    height: 48,
    borderRadius: 12,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  loadingText: {
    marginTop: 16,
    textAlign: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  errorTitle: {
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 12,
  },
  errorText: {
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 22,
  },
  retryButton: {
    paddingHorizontal: 24,
    height: 48,
    borderRadius: 12,
  },
});