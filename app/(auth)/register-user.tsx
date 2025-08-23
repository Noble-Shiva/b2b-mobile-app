import React, { useState, useEffect } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { router, useLocalSearchParams } from 'expo-router';
import { ArrowRight, ArrowLeft, User, Mail, Building2 } from 'lucide-react-native';
import { StatusBar } from 'expo-status-bar';
import {
  registerUser,
  selectIsLoading,
  selectAuthError,
  selectPhone,
  clearError,
} from '@/store/authSlice';
import { AnyAction } from '@reduxjs/toolkit';
import { Text, BackButton } from '@/components/ui';
import { colors, commonStyles } from '@/utils/theme';
import { useSelector as useThemeSelector } from 'react-redux';
import { selectIsDark } from '@/store/themeSlice';

// Create a way to handle navigation after successful registration
export const handleRegistrationSuccess = (returnTo?: string) => {
  if (returnTo) {
    console.log('Registration successful, redirecting to:', returnTo);
    router.replace(returnTo as any);
  } else {
    router.replace('/(tabs)');
  }
};

export default function RegisterUserScreen() {
  const [name, setName] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [email, setEmail] = useState('');
  const [userType, setUserType] = useState<'doctor' | 'retailer'>('retailer');
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [errors, setErrors] = useState<{
    name?: string;
    businessName?: string;
    email?: string;
    phone?: string;
  }>({});

  const dispatch = useDispatch();
  const isLoading = useSelector(selectIsLoading);
  const apiError = useSelector(selectAuthError);
  const phone = useSelector(selectPhone);
  const isDark = useThemeSelector(selectIsDark);
  
  // Get the returnTo parameter from URL
  const params = useLocalSearchParams<{ returnTo?: string }>();
  const returnTo = params.returnTo;
  
  console.log('Registration with returnTo:', returnTo);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  // If no phone number is set, go back to login
  useEffect(() => {
    if (!phone) {
      router.replace('/login');
    }
  }, [phone]);

  const validateInputs = () => {
    const newErrors: { name?: string; businessName?: string; email?: string; phone?: string } = {};
    let isValid = true;

    // Validate name
    if (!name.trim()) {
      newErrors.name = 'Your name is required';
      isValid = false;
    }

    // Validate business name
    if (!businessName.trim()) {
      newErrors.businessName = 'Business name is required';
      isValid = false;
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      newErrors.email = 'Email address is required';
      isValid = false;
    } else if (!emailRegex.test(email)) {
      newErrors.email = 'Please enter a valid email address';
      isValid = false;
    }
    
    // Validate phone number (should be available from OTP verification)
    if (!phone) {
      newErrors.phone = 'Phone number is required';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleRegister = () => {
    if (validateInputs() && phone) {
      console.log('Registering user with:', { name, businessName, email, phone, userType });
      dispatch(registerUser({ 
        name, 
        email, 
        phone: phone,
        businessName,
        userType
      }) as unknown as AnyAction)
        .then((result: any) => {
          // Check if registration was successful
          if (result.meta.requestStatus === 'fulfilled') {
            console.log('Registration successful, returnTo:', returnTo);
            setRegistrationSuccess(true);
            
            // Add a small delay before navigation to show success message
            setTimeout(() => {
              try {
                // Navigate to the original returnTo path if it exists
                if (returnTo) {
                  console.log('Attempting to navigate to:', returnTo);
                  
                  // Format the returnTo path properly
                  const formattedPath = returnTo.startsWith('/') ? returnTo : `/${returnTo}`;
                  console.log('Formatted path:', formattedPath);
                  
                  // Try multiple navigation approaches
                  try {
                    // First attempt: direct replace
                    router.replace(formattedPath as any);
                  } catch (firstError) {
                    console.log('First navigation attempt failed, trying alternative...');
                    try {
                      // Second attempt: with params
                      router.replace({
                        pathname: formattedPath as any,
                        params: { authCompleted: 'true' }
                      } as any);
                    } catch (secondError) {
                      console.log('Second navigation attempt failed, trying final approach...');
                      // Final attempt: using push
                      router.push(formattedPath as any);
                    }
                  }
                } else {
                  console.log('No returnTo path, navigating to tabs');
                  router.replace('/(tabs)' as any);
                }
              } catch (navError) {
                console.error('All navigation attempts failed:', navError);
                // Final fallback to tabs
                console.log('Falling back to tabs navigation');
                router.replace('/(tabs)' as any);
              }
            }, 1000);
          } else {
            console.log('Registration not fulfilled:', result);
          }
        })
        .catch((error: any) => {
          console.error('Registration error:', error);
        });
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: isDark ? '#121212' : '#F8F8F8' }]}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardContainer}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <BackButton />
          </View>

          {/* Title Section */}
          <View style={styles.titleContainer}>
            <Text variant="h2" weight="bold" style={styles.title}>
              Complete Registration
            </Text>
            <Text variant="body" color="secondary" style={styles.subtitle}>
              Please provide your details to complete the setup
            </Text>
          </View>

          {/* Success/Error Messages */}
          {registrationSuccess && (
            <View style={[styles.messageContainer, styles.successContainer]}>
              <Text variant="body" style={styles.successText}>
                ✓ Registration completed successfully!
              </Text>
            </View>
          )}
          
          {apiError && (
            <View style={[styles.messageContainer, styles.errorContainer]}>
              <Text variant="body" style={styles.errorText}>
                {apiError}
              </Text>
            </View>
          )}

          {/* Form Container */}
          <View style={[
            styles.formContainer,
            { backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF' }
          ]}>
            {/* Your Name Field */}
            <View style={styles.inputContainer}>
              <Text variant="body" weight="medium" style={styles.label}>
                Name *
              </Text>
              <View style={[
                styles.iconInputContainer,
                { 
                  borderColor: errors.name ? '#FF3B30' : (isDark ? '#333333' : '#E0E0E0'),
                  backgroundColor: isDark ? '#2A2A2A' : '#F9F9F9'
                }
              ]}>
                <User size={20} color={isDark ? '#BBBBBB' : '#666666'} style={styles.inputIcon} />
                <TextInput
                  style={[styles.input, { color: isDark ? '#FFFFFF' : '#333333' }]}
                  placeholder="Enter your full name"
                  placeholderTextColor={isDark ? '#888888' : '#999999'}
                  value={name}
                  onChangeText={setName}
                  autoCapitalize="words"
                />
              </View>
              {errors.name && (
                <Text variant="body-sm" style={styles.fieldError}>
                  {errors.name}
                </Text>
              )}
            </View>

            {/* Business Name Field */}
            <View style={styles.inputContainer}>
              <Text variant="body" weight="medium" style={styles.label}>
                Business Name *
              </Text>
              <View style={[
                styles.iconInputContainer,
                { 
                  borderColor: errors.businessName ? '#FF3B30' : (isDark ? '#333333' : '#E0E0E0'),
                  backgroundColor: isDark ? '#2A2A2A' : '#F9F9F9'
                }
              ]}>
                <Building2 size={20} color={isDark ? '#BBBBBB' : '#666666'} style={styles.inputIcon} />
                <TextInput
                  style={[styles.input, { color: isDark ? '#FFFFFF' : '#333333' }]}
                  placeholder="Enter your business name"
                  placeholderTextColor={isDark ? '#888888' : '#999999'}
                  value={businessName}
                  onChangeText={setBusinessName}
                  autoCapitalize="words"
                />
              </View>
              {errors.businessName && (
                <Text variant="caption" style={styles.fieldError}>
                  {errors.businessName}
                </Text>
              )}
            </View>

            {/* Email Field */}
            <View style={styles.inputContainer}>
              <Text variant="body" weight="medium" style={styles.label}>
                Email Address *
              </Text>
              <View style={[
                styles.iconInputContainer,
                { 
                  borderColor: errors.email ? '#FF3B30' : (isDark ? '#333333' : '#E0E0E0'),
                  backgroundColor: isDark ? '#2A2A2A' : '#F9F9F9'
                }
              ]}>
                <Mail size={20} color={isDark ? '#BBBBBB' : '#666666'} style={styles.inputIcon} />
                <TextInput
                  style={[styles.input, { color: isDark ? '#FFFFFF' : '#333333' }]}
                  placeholder="Enter your email address"
                  placeholderTextColor={isDark ? '#888888' : '#999999'}
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
              {errors.email && (
                <Text variant="caption" style={styles.fieldError}>
                  {errors.email}
                </Text>
              )}
            </View>

            {/* User Type Radio Buttons */}
            <View style={styles.inputContainer}>
              <Text variant="body" weight="medium" style={styles.label}>
                Are you a doctor or retailer/distributor? *
              </Text>
              
              <View style={styles.radioContainer}>
                <TouchableOpacity
                  style={styles.radioOption}
                  onPress={() => setUserType('doctor')}
                >
                  <View style={[
                    styles.radioOuter,
                    { borderColor: userType === 'doctor' ? colors.primary[600] : (isDark ? '#444444' : '#CCCCCC') }
                  ]}>
                    {userType === 'doctor' && (
                      <View style={[styles.radioInner, { backgroundColor: colors.primary[600] }]} />
                    )}
                  </View>
                  <Text variant="body" style={styles.radioText}>
                    Doctor
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.radioOption}
                  onPress={() => setUserType('retailer')}
                >
                  <View style={[
                    styles.radioOuter,
                    { borderColor: userType === 'retailer' ? colors.primary[600] : (isDark ? '#444444' : '#CCCCCC') }
                  ]}>
                    {userType === 'retailer' && (
                      <View style={[styles.radioInner, { backgroundColor: colors.primary[600] }]} />
                    )}
                  </View>
                  <Text variant="body" style={styles.radioText}>
                    Retailer/Distributor
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Complete Registration Button */}
            <TouchableOpacity
              style={[
                styles.registerButton,
                { backgroundColor: colors.primary[600] },
                isLoading && styles.disabledButton
              ]}
              onPress={handleRegister}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <>
                  <Text 
                    variant="body" weight="semibold" color="inverse" style={{fontFamily: commonStyles.typography.fontFamily.medium}}  >
                    Complete Registration
                  </Text>
                  <ArrowRight size={20} color="#FFFFFF" style={styles.buttonIcon} />
                </>
              )}
            </TouchableOpacity>

            {/* Terms Text */}
            <Text variant="body-sm" color="secondary" style={styles.termsText}>
              By registering, you agree to our Terms of Service and Privacy Policy
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardContainer: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 32,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 16,
  },
  titleContainer: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  title: {
    marginBottom: 8,
    fontFamily: commonStyles.typography.fontFamily.medium,
  },
  subtitle: {
    lineHeight: 22,
    fontFamily: commonStyles.typography.fontFamily.medium,
  },
  messageContainer: {
    marginHorizontal: 24,
    marginBottom: 16,
    padding: 12,
    borderRadius: 8,
  },
  successContainer: {
    backgroundColor: '#E8F5E9',
    borderColor: '#4CAF50',
    borderWidth: 1,
  },
  errorContainer: {
    backgroundColor: '#FFEBEE',
    borderColor: '#FF3B30',
    borderWidth: 1,
  },
  successText: {
    color: '#2E7D32',
    textAlign: 'center',
  },
  errorText: {
    color: '#C62828',
    textAlign: 'center',
  },
  formContainer: {
    marginHorizontal: 16,
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    marginBottom: 8,
    fontFamily: commonStyles.typography.fontFamily.medium,
  },
  iconInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 56,
    borderWidth: 1,
    borderRadius: 12,
    paddingLeft: 16,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    height: '100%',
    fontSize: 16,
    fontFamily: commonStyles.typography.fontFamily.medium,
  },
  fieldError: {
    color: '#FF3B30',
    marginTop: 4,
    fontFamily: commonStyles.typography.fontFamily.medium,
  },
  radioContainer: {
    marginTop: 8,
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  radioText: {
    fontSize: 16,
    fontFamily: commonStyles.typography.fontFamily.medium,
  },
  registerButton: {
    height: 56,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    marginTop: 8,
    fontFamily: commonStyles.typography.fontFamily.medium,
  },
  disabledButton: {
    opacity: 0.7,
  },
  buttonIcon: {
    marginLeft: 8,
  },
  termsText: {
    textAlign: 'center',
    // lineHeight: 18,
    fontFamily: commonStyles.typography.fontFamily.medium,
  },
});
