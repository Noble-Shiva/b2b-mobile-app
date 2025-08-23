import { useCallback } from 'react';
import { View, StyleSheet, TouchableOpacity, FlatList, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Plus, CreditCard, Check, CreditCard as Edit, Trash } from 'lucide-react-native';
import { Text, BackButton } from '@/components/ui';
import { colors } from '@/utils/theme';
import { useSelector, useDispatch } from 'react-redux';
import { selectIsDark } from '@/store/themeSlice';
import {
  selectPaymentMethods,
  addPaymentMethod,
  removePaymentMethod,
  updatePaymentMethod,
} from '@/store/paymentSlice';

export default function PaymentMethodsScreen() {
  const router = useRouter();
  const isDark = useSelector(selectIsDark);
  const dispatch = useDispatch();
  const paymentMethods = useSelector(selectPaymentMethods);

  // Set default payment method by updating isDefault on all methods
  const setDefaultPaymentMethod = useCallback((id: string) => {
    paymentMethods.forEach(method => {
      dispatch(updatePaymentMethod({ ...method, isDefault: method.id === id }));
    });
  }, [paymentMethods, dispatch]);

  // Remove payment method
  const deletePaymentMethod = (id: string, cardNumber: string) => {
    Alert.alert(
      "Delete Payment Method",
      `Are you sure you want to remove card ending in ${cardNumber.slice(-4)}?`,
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Delete",
          onPress: () => {
            // If deleting default, set another as default
            const toDelete = paymentMethods.find(m => m.id === id);
            dispatch(removePaymentMethod(id));
            if (toDelete?.isDefault) {
              const remaining = paymentMethods.filter(m => m.id !== id);
              if (remaining.length > 0) {
                dispatch(updatePaymentMethod({ ...remaining[0], isDefault: true }));
              }
            }
          },
          style: "destructive"
        }
      ]
    );
  };

  // Add new payment method (simulate)
  const addNewPaymentMethod = () => {
    const newId = (Math.random() * 100000).toFixed(0);
    dispatch(addPaymentMethod({
      id: newId,
      type: 'visa',
      cardNumber: '**** **** **** ' + newId.slice(-4),
      cardHolder: 'John Doe',
      expiryDate: '12/30',
      isDefault: paymentMethods.length === 0, // First is default
    }));
  };

  const getCardLogo = (type: string) => {
    switch (type.toLowerCase()) {
      case 'visa':
        return '💳';
      case 'mastercard':
        return '💳';
      case 'amex':
        return '💳';
      default:
        return '💳';
    }
  };

  const renderPaymentMethodItem = ({ item }: { item: any }) => (
    <View style={[
      styles.cardContainer,
      { backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF' }
    ]}>
      <View style={styles.cardHeader}>
        <View style={styles.cardTypeContainer}>
          <Text style={styles.cardLogo}>{getCardLogo(item.type)}</Text>
          <Text variant="body" weight="semibold" style={styles.cardType}>
            {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
          </Text>
          {item.isDefault && (
            <View style={styles.defaultBadge}>
              <Text variant="caption" weight="medium" color="accent">Default</Text>
            </View>
          )}
        </View>

        <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={[
              styles.actionButton,
              { backgroundColor: isDark ? '#2A2A2A' : '#F5F5F5' }
            ]}
            onPress={() => console.log('Edit payment method', item.id)}
          >
            <Edit size={16} color={colors.primary[600]} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.actionButton,
              { backgroundColor: isDark ? '#2A2A2A' : '#F5F5F5' }
            ]}
            onPress={() => deletePaymentMethod(item.id, item.cardNumber)}
          >
            <Trash size={16} color="#F44336" />
          </TouchableOpacity>
        </View>
      </View>

      <Text variant="h4" weight="semibold" style={styles.cardNumber}>
        {item.cardNumber}
      </Text>

      <View style={styles.cardDetails}>
        <View>
          <Text variant="caption" color="tertiary">Card Holder</Text>
          <Text variant="body-sm" weight="medium">
            {item.cardHolder}
          </Text>
        </View>

        <View>
          <Text variant="caption" color="tertiary">Expires</Text>
          <Text variant="body-sm" weight="medium">
            {item.expiryDate}
          </Text>
        </View>
      </View>

      {!item.isDefault && (
        <TouchableOpacity
          style={styles.setDefaultButton}
          onPress={() => setDefaultPaymentMethod(item.id)}
        >
          <Check size={16} color={colors.primary[600]} />
          <Text variant="body-sm" weight="medium" color="accent" style={styles.setDefaultText}>
            Set as Default
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );

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
        <BackButton />
        <Text variant="h4" weight="semibold">Payment Methods</Text>
        <View style={styles.placeholder} />
      </View>

      <FlatList
        data={paymentMethods}
        renderItem={renderPaymentMethodItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.paymentMethodsList}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <CreditCard size={80} color={isDark ? '#333333' : '#EEEEEE'} />
            <Text variant="h3" weight="bold" style={styles.emptyTitle}>
              No payment methods found
            </Text>
            <Text variant="body" color="secondary" style={styles.emptyText}>
              You haven't added any payment methods yet.
            </Text>
          </View>
        }
      />

      <TouchableOpacity
        style={[styles.addButton, { backgroundColor: colors.primary[600] }]}
        onPress={addNewPaymentMethod}
      >
        <Plus size={24} color="#FFFFFF" />
        <Text variant="body" weight="semibold" color="inverse" style={styles.addButtonText}>
          Add New Payment Method
        </Text>
      </TouchableOpacity>
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
  paymentMethodsList: {
    padding: 16,
    paddingBottom: 80,
  },
  cardContainer: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardTypeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardLogo: {
    fontSize: 20,
    marginRight: 8,
  },
  cardType: {
    marginRight: 8,
  },
  defaultBadge: {
    backgroundColor: '#FFF0EB',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  actionsContainer: {
    flexDirection: 'row',
  },
  actionButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  cardNumber: {
    marginBottom: 16,
  },
  cardDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  setDefaultButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
  setDefaultText: {
    marginLeft: 8,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyTitle: {
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    textAlign: 'center',
  },
  addButton: {
    position: 'absolute',
    bottom: 24,
    left: 16,
    right: 16,
    height: 56,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonText: {
    marginLeft: 8,
  },
});