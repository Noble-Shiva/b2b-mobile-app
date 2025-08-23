import { useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Alert,
  Modal,
  TextInput,
  ScrollView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable
} from 'react-native';

import { X, Plus, MapPin, Trash2, Check, Edit, ChevronLeft } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useDispatch } from 'react-redux';
import { useAppSelector } from '@/store/hooks';
import { selectUser } from '@/store/authSlice';
import { selectAddresses, addAddress, removeAddress, updateAddress, Address } from '@/store/addressSlice';
import { profileApi } from '@/api/profile';
import { Text, BackButton } from '@/components/ui';
import { StatusBar } from 'expo-status-bar';
import { colors } from '@/utils/theme';
import { selectIsDark } from '@/store/themeSlice';

// Main AddressesScreen Component
export default function AddressesScreen() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isDark = useAppSelector(selectIsDark);
  const user = useAppSelector(selectUser);
  const addresses = useAppSelector(selectAddresses);
  const dispatch = useDispatch();
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Form data state
  const [formData, setFormData] = useState<Address>({
    id: '',
    name: '',
    business_name: '',
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
    
    if (!formData.business_name?.trim()) {
      newErrors.business_name = 'Business name is required';
    }
    
    if (!formData.name?.trim()) {
      newErrors.name = 'Contact person name is required';
    }
    
    if (!formData.address?.trim()) {
      newErrors.address = 'Address is required';
    }
    
    if (!formData.mobile?.trim()) {
      newErrors.mobile = 'Phone number is required';
    } else if (!/^\d{10}$/.test(formData.mobile.trim())) {
      newErrors.mobile = 'Invalid phone number';
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
    if (!user?.id) {
      Alert.alert('Error', 'User information not available');
      return;
    }
    
    setIsSubmitting(true);
    try {
      // Create API request body in the required format
      const requestBody = {
        user_id: user.id,
        address_data: formData
      };
      
      // Always use the edit-profile endpoint for both add and update
      await profileApi.updateProfile(requestBody);
      
      if (formData.id) {
        // Update existing address in local state
        dispatch(updateAddress(formData));
        Alert.alert('Success', 'Address updated successfully');
      } else {
        // Add new address to local state
        dispatch(addAddress({ ...formData, id: Date.now().toString() }));
        Alert.alert('Success', 'Address added successfully');
      }
      
      // Reset form and close modal
      setIsModalVisible(false);
      setFormData({
        id: '',
        name: '',
        business_name: '',
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
    setFormData({
      ...address,
      name: address.name || user?.first_name || '',
      business_name: address.business_name || '',
      email: address.email || user?.email || '',
      mobile: address.mobile || user?.phone || '',
    });
    setIsModalVisible(true);
  };

  // Set default address
  const handleSetDefault = async (id: string) => {
    try {
      await profileApi.setDefaultAddress?.(id);
      
      // Update each address's isDefault property
      addresses.forEach((addr: Address) => {
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
    console.log('User:', user);
    const newFormData = {
      id: '',
      name: user?.first_name || '',
      business_name: '',
      address: '',
      city: '',
      state: '',
      pincode: '',
      country: '',
      email: user?.email || '',
      mobile: user?.phone || '',
      isDefault: false
    };
    console.log('New form data:', newFormData); // Debug log
    setFormData(newFormData);
    setIsModalVisible(true);
  };

  // Render address item
  const renderAddressItem = ({ item }: { item: Address }) => item && (
    <View style={[
      styles.addressCard, 
      { backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF' }
    ]}>
      <View style={styles.addressHeader}>
        <View style={styles.addressNameContainer}>
          <View style={[
            styles.iconContainer,
            { backgroundColor: isDark ? '#2A2A2A' : '#FFF0EB' }
          ]}>
            <MapPin size={20} color={colors.primary[600]} />
          </View>
          <Text 
            variant="body"
            weight="medium"
            numberOfLines={1}
          >
            {item.business_name} - {item.name}
          </Text>
          {item.isDefault && (
            <View style={styles.defaultBadge}>
              <Text variant="body-sm" weight="medium" color="accent">Default</Text>
            </View>
          )}
        </View>

        <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={[
              styles.actionButton,
              { backgroundColor: isDark ? '#2A2A2A' : '#F5F5F5' }
            ]}
            onPress={() => handleEdit(item)}
          >
            <Edit size={16} color={colors.primary[600]} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.actionButton,
              { backgroundColor: isDark ? '#2A2A2A' : '#F5F5F5' }
            ]}
            onPress={() => handleDelete(item.id || '')}
          >
            <Trash2 size={16} color={colors.error[500]} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.addressDetails}>
        <Text variant="body-sm" color="secondary">{item.address}</Text>
        <Text variant="body-sm" color="secondary">{item.city}, {item.state} {item.pincode}</Text>
        <Text variant="body-sm" color="secondary">{item.mobile}</Text>
        {item.email && (
          <Text variant="body-sm" color="tertiary">{item.email}</Text>
        )}
      </View>

      {!item.isDefault && (
        <TouchableOpacity
          style={styles.setDefaultButton}
          onPress={() => handleSetDefault(item.id || '')}
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
        <Text variant="h4" weight="semibold">My Addresses</Text>
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
            <Text variant="h3" weight="bold" style={styles.emptyTitle}>
              No addresses found
            </Text>
            <Text variant="body" color="secondary" style={styles.emptyText}>
              You haven't added any addresses yet.
            </Text>
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
          <View style={[
            styles.modalContent, 
            { backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF' }
          ]}>
            <View style={[
              styles.modalHeader,
              { borderBottomColor: isDark ? '#333333' : '#EEEEEE' }
            ]}>
              <Text variant="h4" weight="semibold">
                {formData.id ? 'Edit Address' : 'Add New Address'}
              </Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setIsModalVisible(false)}
              >
                <X color={isDark ? '#BBBBBB' : '#666666'} size={24} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.formContainer}>
              <View style={styles.inputContainer}>
                <Text variant="body-sm" weight="medium">Business Name</Text>
                <TextInput
                  style={[
                    styles.input,
                    { 
                      backgroundColor: isDark ? '#2A2A2A' : '#F5F5F5',
                      color: isDark ? '#FFFFFF' : '#333333',
                      borderColor: errors.business_name ? colors.error[500] : 'transparent'
                    }
                  ]}
                  value={formData.business_name}
                  onChangeText={(text) => setFormData(prev => ({ ...prev, business_name: text }))}
                  placeholder="Enter business name"
                  placeholderTextColor={isDark ? '#666666' : '#999999'}
                />
                {errors.business_name && (
                  <Text variant="body-sm" color="error" style={styles.errorText}>
                    {errors.business_name}
                  </Text>
                )}
              </View>

              <View style={styles.inputContainer}>
                <Text variant="body-sm" weight="medium">Contact Person Name</Text>
                <TextInput
                  style={[
                    styles.input,
                    { 
                      backgroundColor: isDark ? '#2A2A2A' : '#F5F5F5',
                      color: isDark ? '#FFFFFF' : '#333333',
                      borderColor: errors.name ? colors.error[500] : 'transparent'
                    }
                  ]}
                  value={formData.name}
                  onChangeText={(text) => setFormData(prev => ({ ...prev, name: text }))}
                  placeholder="Enter contact person name"
                  placeholderTextColor={isDark ? '#666666' : '#999999'}
                />
                {errors.name && (
                  <Text variant="body-sm" color="error" style={styles.errorText}>
                    {errors.name}
                  </Text>
                )}
              </View>

              <View style={styles.inputContainer}>
                <Text variant="body-sm" weight="medium">Phone Number</Text>
                <TextInput
                  style={[
                    styles.input,
                    { 
                      backgroundColor: isDark ? '#2A2A2A' : '#F5F5F5',
                      color: isDark ? '#FFFFFF' : '#333333',
                      borderColor: errors.mobile ? colors.error[500] : 'transparent'
                    }
                  ]}
                  value={formData.mobile}
                  onChangeText={(text) => setFormData(prev => ({ ...prev, mobile: text }))}
                  placeholder="Enter phone number"
                  placeholderTextColor={isDark ? '#666666' : '#999999'}
                  keyboardType="phone-pad"
                  maxLength={10}
                />
                {errors.mobile && (
                  <Text variant="body-sm" color="error" style={styles.errorText}>
                    {errors.mobile}
                  </Text>
                )}
              </View>

              <View style={styles.inputContainer}>
                <Text variant="body-sm" weight="medium">Address</Text>
                <TextInput
                  style={[
                    styles.input,
                    { 
                      backgroundColor: isDark ? '#2A2A2A' : '#F5F5F5',
                      color: isDark ? '#FFFFFF' : '#333333',
                      borderColor: errors.address ? colors.error[500] : 'transparent'
                    },
                    styles.textArea
                  ]}
                  value={formData.address}
                  onChangeText={(text) => setFormData({ ...formData, address: text })}
                  placeholder="Enter your address"
                  placeholderTextColor={isDark ? '#666666' : '#999999'}
                  multiline
                  numberOfLines={3}
                />
                {errors.address && (
                  <Text variant="body-sm" color="error" style={styles.errorText}>
                    {errors.address}
                  </Text>
                )}
              </View>

              <View style={styles.row}>
                <View style={[styles.inputContainer, styles.halfWidth]}>
                  <Text variant="body-sm" weight="medium">City</Text>
                  <TextInput
                    style={[
                      styles.input,
                      { 
                        backgroundColor: isDark ? '#2A2A2A' : '#F5F5F5',
                        color: isDark ? '#FFFFFF' : '#333333',
                        borderColor: errors.city ? colors.error[500] : 'transparent'
                      }
                    ]}
                    value={formData.city}
                    onChangeText={(text) => setFormData({ ...formData, city: text })}
                    placeholder="Enter city"
                    placeholderTextColor={isDark ? '#666666' : '#999999'}
                  />
                  {errors.city && (
                    <Text variant="body-sm" color="error" style={styles.errorText}>
                      {errors.city}
                    </Text>
                  )}
                </View>

                <View style={[styles.inputContainer, styles.halfWidth]}>
                  <Text variant="body-sm" weight="medium">State</Text>
                  <TextInput
                    style={[
                      styles.input,
                      { 
                        backgroundColor: isDark ? '#2A2A2A' : '#F5F5F5',
                        color: isDark ? '#FFFFFF' : '#333333',
                        borderColor: errors.state ? colors.error[500] : 'transparent'
                      }
                    ]}
                    value={formData.state}
                    onChangeText={(text) => setFormData({ ...formData, state: text })}
                    placeholder="Enter state"
                    placeholderTextColor={isDark ? '#666666' : '#999999'}
                  />
                  {errors.state && (
                    <Text variant="body-sm" color="error" style={styles.errorText}>
                      {errors.state}
                    </Text>
                  )}
                </View>
              </View>

              <View style={styles.inputContainer}>
                <Text variant="body-sm" weight="medium">Pincode</Text>
                <TextInput
                  style={[
                    styles.input,
                    { 
                      backgroundColor: isDark ? '#2A2A2A' : '#F5F5F5',
                      color: isDark ? '#FFFFFF' : '#333333',
                      borderColor: errors.pincode ? colors.error[500] : 'transparent'
                    }
                  ]}
                  value={formData.pincode}
                  onChangeText={(text) => setFormData({ ...formData, pincode: text })}
                  placeholder="Enter pincode"
                  placeholderTextColor={isDark ? '#666666' : '#999999'}
                  keyboardType="number-pad"
                  maxLength={6}
                />
                {errors.pincode && (
                  <Text variant="body-sm" color="error" style={styles.errorText}>
                    {errors.pincode}
                  </Text>
                )}
              </View>
            </ScrollView>

            <TouchableOpacity
              style={[
                styles.submitButton,
                { backgroundColor: colors.primary[600] },
                isSubmitting && styles.submitButtonDisabled
              ]}
              onPress={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text variant="body" weight="semibold" color="inverse">
                  {formData.id ? 'Update Address' : 'Save Address'}
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* Floating Add Button */}
      <TouchableOpacity
        style={[styles.floatingButton, { backgroundColor: colors.primary[600] }]}
        onPress={addNewAddress}
      >
        <Plus color="#FFFFFF" size={24} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 16,
    borderBottomWidth: 1
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
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
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
  setDefaultButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8
  },
  setDefaultText: {
    marginLeft: 8
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    marginTop: 32
  },
  emptyTitle: {
    marginTop: 16,
    marginBottom: 8
  },
  emptyText: {
    textAlign: 'center'
  },
  floatingButton: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000000',
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
    borderBottomWidth: 1
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
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginTop: 8
  },
  errorText: {
    marginTop: 4
  },
  submitButton: {
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 16,
    borderRadius: 8
  },
  submitButtonDisabled: {
    opacity: 0.7
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top'
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12
  },
  halfWidth: {
    flex: 1
  }
});
