import { useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Alert,
  useColorScheme,
  Modal,
  TextInput,
  ScrollView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable
} from 'react-native';

import { X, Plus, MapPin, Trash, Check, Edit, ChevronLeft } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useDispatch } from 'react-redux';
import { selectUser } from '@/store/authSlice';
import { selectAddresses, addAddress, removeAddress, updateAddress, Address } from '@/store/addressSlice';
import { profileApi } from '@/api/profile';
import Text from '@/components/ui/Text';
import { StatusBar } from 'expo-status-bar';
import { useAppSelector } from '@/store/hooks';

// Define colors for theming
const colors = {
  primary: {
    600: '#4F46E5',
    700: '#4338CA'
  },
  error: '#EF4444',
  white: '#FFFFFF',
  black: '#000000',
  gray: {
    300: '#D1D5DB'
  },
  neutral: {
    500: '#6B7280'
  },
  dark: '#121212',
  light: '#F8F8F8',
  darkBackground: '#1E1E1E',
  lightBackground: '#FFFFFF',
  darkBorder: '#333333',
  lightBorder: '#EEEEEE',
  lightShadow: '#DDDDDD',
  darkShadow: '#111111'
};

// BackButton component
const BackButton = () => {
  const router = useRouter();
  const isDark = useColorScheme() === 'dark';
  
  return (
    <Pressable 
      onPress={() => router.back()}
      style={{
        padding: 8,
        borderRadius: 20,
        backgroundColor: isDark ? '#333333' : '#F5F5F5'
      }}
    >
      <ChevronLeft size={24} color={isDark ? '#FFFFFF' : '#333333'} />
    </Pressable>
  );
};

// Main AddressesScreen Component
export default function AddressesScreen() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isDark = useColorScheme() === 'dark';
  const user = useAppSelector(selectUser);
  const addresses = useAppSelector(selectAddresses);
  const dispatch = useDispatch();
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Form data state
  const [formData, setFormData] = useState<Address>({
    id: '',
    name: '',
    last_name: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    country: '',
    email: '',
    mobile: '',
    isDefault: false
  });

  // Form validation
  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    
    if (!formData.name?.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.address?.trim()) {
      newErrors.address = 'Address is required';
    }
    
    if (!formData.mobile?.trim()) {
      newErrors.mobile = 'Mobile number is required';
    } else if (!/^\d{10}$/.test(formData.mobile.trim())) {
      newErrors.mobile = 'Invalid mobile number';
    }
    
    if (!formData.city?.trim()) {
      newErrors.city = 'City is required';
    }
    
    if (!formData.state?.trim()) {
      newErrors.state = 'State is required';
    }
    
    if (!formData.pincode?.trim()) {
      newErrors.pincode = 'Pincode is required';
    } else if (!/^\d{6}$/.test(formData.pincode.trim())) {
      newErrors.pincode = 'Invalid pincode';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    try {
      // Create address object to send to API
      const addressData = {
        ...formData,
        user_id: user?.id
      };

      // console.log(addressData);
      
      if (formData.id) {
        // Update existing address
        await profileApi.updateAddress?.(addressData);
        dispatch(updateAddress(formData));
        Alert.alert('Success', 'Address updated successfully');
      } else {
        // Add new address
        await profileApi.addAddress(addressData);
        dispatch(addAddress({ ...formData, id: Date.now().toString() }));
        Alert.alert('Success', 'Address added successfully');
      }
      
      // Reset form and close modal
      setIsModalVisible(false);
      setFormData({
        id: '',
        name: '',
        last_name: '',
        address: '',
        city: '',
        state: '',
        pincode: '',
        country: '',
        email: '',
        mobile: '',
        isDefault: false
      });
    } catch (error) {
      console.error('Error with address:', error);
      Alert.alert('Error', error instanceof Error ? error.message : 'Failed to process address');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete address
  const handleDelete = (id: string) => {
    Alert.alert(
      "Delete Address",
      "Are you sure you want to delete this address?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await profileApi.deleteAddress(id);
              dispatch(removeAddress(id));
              Alert.alert('Success', 'Address deleted successfully');
            } catch (error) {
              Alert.alert('Error', 'Failed to delete address');
            }
          }
        }
      ]
    );
  };

  // Edit address
  const handleEdit = (address: Address) => {
    setFormData(address);
    setIsModalVisible(true);
  };

  // Set default address
  const handleSetDefault = async (id: string) => {
    try {
      await profileApi.setDefaultAddress?.(id);
      
      // Update each address's isDefault property
      addresses.forEach((addr) => {
        dispatch(updateAddress({
          ...addr,
          isDefault: addr.id === id
        }));
      });
      
      Alert.alert('Success', 'Default address updated');
    } catch (error) {
      Alert.alert('Error', 'Failed to update default address');
    }
  };

  // Add new address
  const addNewAddress = () => {
    setFormData({
      id: '',
      name: '',
      last_name: '',
      address: '',
      city: '',
      state: '',
      pincode: '',
      country: '',
      email: '',
      mobile: '',
      isDefault: false
    });
    setIsModalVisible(true);
  };

  // Render address item
  const renderAddressItem = ({ item }: { item: Address }) => (
    <View style={[styles.addressCard, { backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF' }]}>
      <View style={styles.addressHeader}>
        <View style={styles.addressNameContainer}>
          <View style={styles.iconContainer}>
            <MapPin size={20} color={colors.primary[700]} />
          </View>
          <Text style={styles.addressName}>
            {item.name} {item.last_name}
          </Text>
          {item.isDefault && (
            <View style={styles.defaultBadge}>
              <Text style={styles.defaultText}>Default</Text>
            </View>
          )}
        </View>

        <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: isDark ? '#2A2A2A' : '#F5F5F5' }]}
            onPress={() => handleEdit(item)}
          >
            <Edit size={16} color={colors.primary[600]} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: isDark ? '#2A2A2A' : '#F5F5F5' }]}
            onPress={() => handleDelete(item.id || '')}
          >
            <Trash size={16} color="#F44336" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.addressDetails}>
        <Text style={styles.addressText}>{item.address}</Text>
        <Text style={styles.addressText}>{item.city}, {item.state} {item.pincode}</Text>
        <Text style={styles.addressText}>{item.mobile}</Text>
        {item.email && (
          <Text style={styles.emailText}>{item.email}</Text>
        )}
      </View>

      {!item.isDefault && (
        <TouchableOpacity
          style={styles.setDefaultButton}
          onPress={() => handleSetDefault(item.id || '')}
        >
          <Check size={16} color={colors.primary[600]} />
          <Text style={styles.setDefaultText}>Set as Default</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  // Main render
  return (
    <View style={[styles.container, { backgroundColor: isDark ? colors.dark : colors.light }]}>
      <StatusBar style={isDark ? 'light' : 'dark'} />

      <View style={[styles.header, {
        backgroundColor: isDark ? colors.darkBackground : colors.lightBackground,
        borderBottomColor: isDark ? colors.darkBorder : colors.lightBorder
      }]}>
        <BackButton />
        <Text style={styles.headerTitle}>My Addresses</Text>
        <View style={styles.placeholder} />
      </View>

      <FlatList
        data={addresses}
        renderItem={renderAddressItem}
        keyExtractor={(item) => item.id || Math.random().toString()}
        contentContainerStyle={styles.addressesList}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <MapPin size={80} color={isDark ? '#333333' : '#EEEEEE'} />
            <Text style={styles.emptyTitle}>No addresses found</Text>
            <Text style={styles.emptyText}>You haven't added any addresses yet.</Text>
          </View>
        }
      />

      {/* Add/Edit Address Modal */}
      <Modal
        visible={isModalVisible}
        animationType="slide"
        transparent={true}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalContainer}
        >
          <View style={[styles.modalContent, {
            backgroundColor: isDark ? colors.darkBackground : colors.lightBackground
          }]}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {formData.id ? 'Edit Address' : 'Add New Address'}
              </Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setIsModalVisible(false)}
              >
                <X color={colors.neutral[500]} size={24} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.formContainer}>
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Full Name</Text>
                <TextInput
                  style={[styles.input, errors.name && styles.inputError]}
                  value={formData.name}
                  onChangeText={(text) => setFormData({ ...formData, name: text })}
                  placeholder="Enter your full name"
                  placeholderTextColor={isDark ? '#666666' : '#999999'}
                />
                {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Mobile Number</Text>
                <TextInput
                  style={[styles.input, errors.mobile && styles.inputError]}
                  value={formData.mobile}
                  onChangeText={(text) => setFormData({ ...formData, mobile: text })}
                  placeholder="Enter mobile number"
                  placeholderTextColor={isDark ? '#666666' : '#999999'}
                  keyboardType="phone-pad"
                  maxLength={10}
                />
                {errors.mobile && <Text style={styles.errorText}>{errors.mobile}</Text>}
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Address</Text>
                <TextInput
                  style={[styles.input, styles.textArea, errors.address && styles.inputError]}
                  value={formData.address}
                  onChangeText={(text) => setFormData({ ...formData, address: text })}
                  placeholder="Enter your address"
                  placeholderTextColor={isDark ? '#666666' : '#999999'}
                  multiline
                  numberOfLines={3}
                />
                {errors.address && <Text style={styles.errorText}>{errors.address}</Text>}
              </View>

              <View style={styles.row}>
                <View style={[styles.inputContainer, styles.halfWidth]}>
                  <Text style={styles.inputLabel}>City</Text>
                  <TextInput
                    style={[styles.input, errors.city && styles.inputError]}
                    value={formData.city}
                    onChangeText={(text) => setFormData({ ...formData, city: text })}
                    placeholder="Enter city"
                    placeholderTextColor={isDark ? '#666666' : '#999999'}
                  />
                  {errors.city && <Text style={styles.errorText}>{errors.city}</Text>}
                </View>

                <View style={[styles.inputContainer, styles.halfWidth]}>
                  <Text style={styles.inputLabel}>State</Text>
                  <TextInput
                    style={[styles.input, errors.state && styles.inputError]}
                    value={formData.state}
                    onChangeText={(text) => setFormData({ ...formData, state: text })}
                    placeholder="Enter state"
                    placeholderTextColor={isDark ? '#666666' : '#999999'}
                  />
                  {errors.state && <Text style={styles.errorText}>{errors.state}</Text>}
                </View>
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Pincode</Text>
                <TextInput
                  style={[styles.input, errors.pincode && styles.inputError]}
                  value={formData.pincode}
                  onChangeText={(text) => setFormData({ ...formData, pincode: text })}
                  placeholder="Enter pincode"
                  placeholderTextColor={isDark ? '#666666' : '#999999'}
                  keyboardType="number-pad"
                  maxLength={6}
                />
                {errors.pincode && <Text style={styles.errorText}>{errors.pincode}</Text>}
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Email (Optional)</Text>
                <TextInput
                  style={styles.input}
                  value={formData.email}
                  onChangeText={(text) => setFormData({ ...formData, email: text })}
                  placeholder="Enter email address"
                  placeholderTextColor={isDark ? '#666666' : '#999999'}
                  keyboardType="email-address"
                />
              </View>
            </ScrollView>

            <TouchableOpacity
              style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]}
              onPress={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <ActivityIndicator color={colors.white} />
              ) : (
                <Text style={styles.submitButtonText}>
                  {formData.id ? 'Update Address' : 'Save Address'}
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* Floating Add Button */}
      <TouchableOpacity
        style={styles.floatingButton}
        onPress={addNewAddress}
      >
        <Plus color={colors.white} size={24} />
      </TouchableOpacity>
    </View>
  );
}

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 50 : 16,
    paddingBottom: 16,
    borderBottomWidth: 1
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold'
  },
  placeholder: {
    width: 40
  },
  addressesList: {
    padding: 16,
    paddingBottom: 80
  },
  addressCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2
  },
  addressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12
  },
  addressNameContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  addressName: {
    fontWeight: '600',
    fontSize: 16
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFF0EB',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12
  },
  defaultBadge: {
    backgroundColor: '#FFF0EB',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    marginLeft: 8
  },
  defaultText: {
    color: colors.primary[700],
    fontSize: 12,
    fontWeight: '500'
  },
  actionsContainer: {
    flexDirection: 'row'
  },
  actionButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8
  },
  addressDetails: {
    marginBottom: 12
  },
  addressText: {
    color: '#666666',
    marginBottom: 4,
    fontSize: 14
  },
  emailText: {
    color: '#666666',
    fontSize: 12
  },
  setDefaultButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8
  },
  setDefaultText: {
    color: colors.primary[600],
    marginLeft: 8,
    fontWeight: '500'
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    marginTop: 32
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8
  },
  emptyText: {
    color: '#666666',
    textAlign: 'center'
  },
  floatingButton: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    backgroundColor: colors.primary[600],
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)'
  },
  modalContent: {
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    maxHeight: '90%'
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE'
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold'
  },
  closeButton: {
    padding: 4
  },
  formContainer: {
    padding: 16
  },
  inputContainer: {
    marginBottom: 16
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8
  },
  input: {
    borderWidth: 1,
    borderColor: colors.gray[300],
    borderRadius: 8,
    padding: 12,
    fontSize: 16
  },
  inputError: {
    borderColor: colors.error
  },
  errorText: {
    color: colors.error,
    fontSize: 12,
    marginTop: 4
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top'
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  halfWidth: {
    width: '48%'
  },
  submitButton: {
    backgroundColor: colors.primary[600],
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 16,
    borderRadius: 8
  },
  submitButtonDisabled: {
    opacity: 0.7
  },
  submitButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600'
  }
});
