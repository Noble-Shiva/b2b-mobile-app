import { useState, useEffect } from 'react';
import { 
  View, 
  StyleSheet, 
  ScrollView, 
  KeyboardAvoidingView, 
  Platform,
  TouchableOpacity,
  Alert 
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ArrowLeft, Save, Check } from 'lucide-react-native';
import { selectUser, selectIsLoading, selectAuthError, editProfile } from '@/store/authSlice';
import { selectIsDark } from '@/store/themeSlice';
import { Text, Input, Button } from '@/components/ui';
import { colors } from '@/utils/theme';
import { AnyAction } from '@reduxjs/toolkit';

export default function EditProfileScreen() {
  const router = useRouter();
  const dispatch = useDispatch();
  
  const user = useSelector(selectUser);
  const isLoading = useSelector(selectIsLoading);
  const error = useSelector(selectAuthError);
  const isDark = useSelector(selectIsDark);
  
  // Form state
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [selectedRole, setSelectedRole] = useState<'Retailer' | 'Doctor'>('Retailer');
  
  // Validation state
  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  
  // Success message state
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  // Pre-populate form with existing user data
  useEffect(() => {
    if (user) {
      setDisplayName(user.name || `${user.first_name || ''} ${user.last_name || ''}`.trim() || user.username || '');
      setEmail(user.email || '');
      setPhoneNumber(user.phone || '');
      // Pre-populate role if available, default to 'Retailer'
      setSelectedRole((user as any).role === 'Doctor' ? 'Doctor' : 'Retailer');
    }
  }, [user]);

  // Validation functions
  const validateName = (name: string) => {
    if (!name.trim()) {
      setNameError('Name is required');
      return false;
    }
    if (name.trim().length < 2) {
      setNameError('Name must be at least 2 characters');
      return false;
    }
    setNameError('');
    return true;
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      setEmailError('Email is required');
      return false;
    }
    if (!emailRegex.test(email)) {
      setEmailError('Please enter a valid email address');
      return false;
    }
    setEmailError('');
    return true;
  };

  const validatePhone = (phone: string) => {
    const phoneRegex = /^\d{10}$/;
    if (!phone.trim()) {
      setPhoneError('Phone number is required');
      return false;
    }
    if (!phoneRegex.test(phone.replace(/\D/g, ''))) {
      setPhoneError('Please enter a valid 10-digit phone number');
      return false;
    }
    setPhoneError('');
    return true;
  };

  const handleSave = async () => {
    // Validate all fields
    const isNameValid = validateName(displayName);
    const isEmailValid = validateEmail(email);
    const isPhoneValid = true; //validatePhone(phoneNumber);

    if (!isNameValid || !isEmailValid || !isPhoneValid) {
      return;
    }

    try {
      const result = await dispatch(editProfile({
        user_id: user?.id || '',
        display_name: displayName.trim(),
        email: email.trim(),
        phone_number: phoneNumber.trim(),
        role: selectedRole
      }) as unknown as AnyAction);

      if (result?.payload) {
        // Show green success message
        // setShowSuccessMessage(true);
        
        // Navigate back after 1 second delay
        setTimeout(() => {
          setShowSuccessMessage(false);
          router.back();
        }, 1000);
      } else {
        Alert.alert('Error', result?.payload || error || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Profile update error:', error);
      Alert.alert('Error', 'Failed to update profile. Please try again.');
    }
  };

  const hasChanges = () => {
    if (!user) return false;
    
    const currentName = user.name || `${user.first_name || ''} ${user.last_name || ''}`.trim() || user.username || '';
    const currentEmail = user.email || '';
    const currentPhone = user.phone || '';
    const currentRole = (user as any).role || 'Retailer';
    
    return (
      displayName.trim() !== currentName ||
      email.trim() !== currentEmail ||
      phoneNumber.trim() !== currentPhone ||
      selectedRole !== currentRole
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: isDark ? '#121212' : '#F8F8F8' }]}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      
      {/* Header */}
      <View style={[styles.header, { backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF' }]}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color={isDark ? '#FFFFFF' : '#000000'} />
        </TouchableOpacity>
        
        <Text variant="h3" weight="bold" style={styles.headerTitle}>
          Edit Profile
        </Text>
        
        <TouchableOpacity 
          style={[
            styles.saveButton, 
            !hasChanges() && styles.saveButtonDisabled
          ]}
          onPress={handleSave}
          disabled={!hasChanges() || isLoading}
        >
          <Save size={24} color={hasChanges() ? colors.primary[600] : '#CCCCCC'} />
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Profile Form */}
          <View style={[styles.formCard, { backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF' }]}>
            <Text variant="h4" weight="semibold" style={styles.formTitle}>
              Personal Information
            </Text>
            
            {/* Display Name Field */}
            <View style={styles.fieldContainer}>
              <Text variant="body-sm" weight="medium" style={styles.fieldLabel}>
                Full Name *
              </Text>
              <Input
                value={displayName}
                onChangeText={(text) => {
                  setDisplayName(text);
                  if (nameError) validateName(text);
                }}
                placeholder="Enter your full name"
                error={nameError}
                style={styles.input}
              />
            </View>

            {/* Email Field */}
            <View style={styles.fieldContainer}>
              <Text variant="body-sm" weight="medium" style={styles.fieldLabel}>
                Email Address *
              </Text>
              <Input
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  if (emailError) validateEmail(text);
                }}
                placeholder="Enter your email address"
                keyboardType="email-address"
                autoCapitalize="none"
                error={emailError}
                style={styles.input}
              />
            </View>

            {/* Role Selection */}
            <View style={styles.fieldContainer}>
              <Text variant="body-sm" weight="medium" style={styles.fieldLabel}>
                Role *
              </Text>
              <View style={styles.radioGroup}>
                {/* Retailer Option */}
                <TouchableOpacity
                  style={styles.radioOption}
                  onPress={() => setSelectedRole('Retailer')}
                >
                  <View style={[styles.radioButton, selectedRole === 'Retailer' && styles.radioButtonSelected]}>
                    {selectedRole === 'Retailer' && (
                      <Check size={16} color="#FFFFFF" />
                    )}
                  </View>
                  <Text style={styles.radioLabel}>Retailer</Text>
                </TouchableOpacity>

                {/* Doctor Option */}
                <TouchableOpacity
                  style={styles.radioOption}
                  onPress={() => setSelectedRole('Doctor')}
                >
                  <View style={[styles.radioButton, selectedRole === 'Doctor' && styles.radioButtonSelected]}>
                    {selectedRole === 'Doctor' && (
                      <Check size={16} color="#FFFFFF" />
                    )}
                  </View>
                  <Text style={styles.radioLabel}>Doctor</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Phone Number Field */}
            {/* <View style={styles.fieldContainer}>
              <Text variant="body-sm" weight="medium" style={styles.fieldLabel}>
                Phone Number *
              </Text>
              <Input
                value={phoneNumber}
                onChangeText={(text) => {
                  const cleaned = text.replace(/\D/g, '');
                  setPhoneNumber(cleaned);
                  if (phoneError) validatePhone(cleaned);
                }}
                placeholder="Enter your phone number"
                keyboardType="phone-pad"
                maxLength={10}
                error={phoneError}
                style={styles.input}
              />
            </View> */}

            {/* Error Display */}
            {error && (
              <View style={styles.errorContainer}>
                <Text variant="body-sm" color="error">
                  {error}
                </Text>
              </View>
            )}
          </View>

          {/* Save Button */}
          <Button
            variant="primary"
            size="large"
            fullWidth
            onPress={handleSave}
            disabled={!hasChanges() || isLoading}
            isLoading={isLoading}
            style={[
              styles.saveButtonLarge,
              !hasChanges() && styles.saveButtonLargeDisabled
            ]}
          >
            Save Changes
          </Button>

          {/* Info Text */}
          <Text variant="caption" color="secondary" style={styles.infoText}>
            * Required fields. Changes will be updated immediately after saving.
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
      
      {/* Success Message Overlay */}
      {showSuccessMessage && (
        <View style={styles.successOverlay}>
          <View style={styles.successContainer}>
            <Text style={styles.successText}>Profile updated successfully</Text>
          </View>
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 60,
    paddingBottom: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 16,
  },
  saveButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveButtonDisabled: {
    opacity: 0.5,
  },
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  formCard: {
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  formTitle: {
    marginBottom: 24,
  },
  fieldContainer: {
    marginBottom: 20,
  },
  fieldLabel: {
    marginBottom: 8,
    color: '#374151',
  },
  input: {
    marginBottom: 0,
  },
  errorContainer: {
    marginTop: 12,
    padding: 12,
    backgroundColor: '#FEF2F2',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  saveButtonLarge: {
    marginBottom: 16,
  },
  saveButtonLargeDisabled: {
    opacity: 0.5,
  },
  infoText: {
    textAlign: 'center',
    marginBottom: 32,
  },
  radioGroup: {
    flexDirection: 'row',
    gap: 20,
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  radioButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    marginRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  radioButtonSelected: {
    borderColor: colors.primary[600],
    backgroundColor: colors.primary[600],
  },
  radioLabel: {
    fontSize: 16,
    color: '#374151',
    fontWeight: '500',
  },
  successOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  successContainer: {
    backgroundColor: '#10B981', // Green color
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  successText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
}); 