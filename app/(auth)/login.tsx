import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Image, KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator, Dimensions, TouchableOpacity } from 'react-native';
import { Link, router, useLocalSearchParams } from 'expo-router';
import { useDispatch, useSelector } from 'react-redux';
import { ArrowRight, Phone } from 'lucide-react-native';
import { sendOtp, selectIsLoading, selectOtpSent, selectAuthError, resetOtpSentFlag, clearError } from '@/store/authSlice';
import { selectIsDark } from '@/store/themeSlice';
import { AnyAction } from '@reduxjs/toolkit';
import { Text, Button, Input } from '@/components/ui';
import { colors, commonStyles, getTheme } from '@/utils/theme';
import SecurityModal, { SecurityModalType } from '@/components/security';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');



export default function LoginScreen() {
  const [phone, setPhone] = useState('');
  const [phoneError, setPhoneError] = useState<string | undefined>(undefined);
  
  // Get the returnTo parameter from URL if it exists
  const params = useLocalSearchParams<{ returnTo?: string }>();
  const returnTo = params.returnTo;
  
  const dispatch = useDispatch();
  const isLoading = useSelector(selectIsLoading);
  const otpSent = useSelector(selectOtpSent);
  const apiError = useSelector(selectAuthError);
  const isDark = useSelector(selectIsDark);
  
  const theme = getTheme(isDark);
  
  console.log('Return to path:', returnTo);

  // Navigate to OTP verification screen if OTP is successfully sent
  useEffect(() => {
    if (otpSent) {
      console.log('OTP sent, navigating to verification screen');
      
      // Use navigation callback to ensure resetOtpState is called after navigation
      const navigateToVerification = async () => {
        try {
          // Pass the returnTo parameter to the OTP verification screen
          if (returnTo) {
            await router.replace({ pathname: '/(auth)/verify-otp', params: { returnTo } });
          } else {
            await router.replace('/(auth)/verify-otp');
          }
          // Reset only the otpSent flag to prevent re-navigation, but keep otpReference for verification screen
          console.log('Navigation complete, resetting OTP sent flag');
          dispatch(resetOtpSentFlag());
        } catch (err) {
          console.error('Navigation error:', err);
        }
      };
      
      navigateToVerification();
    }
  }, [otpSent, dispatch, returnTo]);

  // Clean up error state when component unmounts
  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  // Validate phone number format
  const validatePhone = (phoneNumber: string) => {
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneNumber) {
      setPhoneError('Phone number is required');
      return false;
    } else if (!phoneRegex.test(phoneNumber)) {
      setPhoneError('Please enter a valid 10-digit phone number');
      return false;
    }
    setPhoneError(undefined);
    return true;
  };

  const handleSendOtp = () => {
    if (validatePhone(phone)) {
      console.log('Sending OTP to phone:', phone);
      
      // Dispatch the action and track its status
      dispatch(sendOtp({ phone }) as unknown as AnyAction)
        .then((result: any) => {
          console.log('OTP send action result:', result);
          // Check if the action was fulfilled (successful)
          if (result.meta && result.meta.requestStatus === 'fulfilled') {
            console.log('OTP sent successfully, otpSent should be true');
          }
        })
        .catch((err: any) => {
          console.error('Error sending OTP:', err);
        });
    }
  };



  return (
    <SecurityModal>
      {(openModal) => (
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={[styles.container, { backgroundColor: theme.background.primary }]}
        >
          <ScrollView 
            contentContainerStyle={[
              styles.scrollContainer,
              { minHeight: SCREEN_HEIGHT }
            ]}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.logoContainer}>
              <Image
                source={require('@/assets/srotas_logo_transparent.png')}
                style={styles.logo}
                resizeMode="contain"
              />
            </View>
            
            <Text variant="h1" weight="bold" style={styles.title}>
              Login to continue
            </Text>
            {/* <Text variant="body" color="secondary" style={styles.subtitle}>
              Enter your phone number to access your account
            </Text> */}
            
            {(phoneError || apiError) && 
              <Text variant="body-sm" color="error" style={styles.errorText}>
                {phoneError || apiError}
              </Text>
            }
            
            <View style={styles.inputContainer}>
              <Input
                // label="Phone Number"
                placeholder="Enter your mobile number"
                value={phone}
                onChangeText={(text) => {
                  setPhone(text);
                  if (phoneError) validatePhone(text);
                }}
                keyboardType="phone-pad"
                maxLength={10}
                leftIcon={<Text style={[styles.countryCode, { color: theme.text.primary }] as any}>+91</Text>}
                error={phoneError}
                style={{fontSize: commonStyles.typography.fontSize.lg, fontFamily: commonStyles.typography.fontFamily.medium}}
                containerStyle={styles.phoneInputContainer}
              />
            </View>
            
            <Button
              variant="primary"
              size="large"
              fullWidth
              onPress={handleSendOtp}
              disabled={isLoading}
              isLoading={isLoading}
              rightIcon={!isLoading && <ArrowRight size={20} color="#FFFFFF" />}
              style={styles.sendOtpButton}
            >
              Send Verification Code
            </Button>
            
            {/* <View style={styles.infoContainer}>
              <Phone size={16} color={theme.icon.secondary} />
              <Text variant="body-sm" color="tertiary" style={styles.infoText}>
                We'll send a one-time password to verify your phone number
              </Text>
            </View> */}

            <View style={styles.registerContainer}>
              <Text 
                variant="body" color="secondary" weight='medium'
                style={styles.registerText}>Having trouble? </Text>
              <Link href="/(tabs)" asChild>
                <Text variant="body" color="accent" weight="medium" style={styles.registerLink}>
                  Contact Us
                </Text>
              </Link>
            </View>
            
            <View style={styles.termsContainer}>
              <Text variant="body" color="secondary" style={styles.byContText}>
                By continuing, you agree to our
              </Text>
              <View style={styles.termsLinksContainer}>
                <TouchableOpacity onPress={() => openModal('terms')}>
                  <Text variant="body" color="accent" weight="medium">
                    Terms
                  </Text>
                </TouchableOpacity>
                <Text variant="body" color="secondary">
                  {' & '}
                </Text>
                <TouchableOpacity onPress={() => openModal('privacy')}>
                  <Text variant="body" color="accent" weight="medium">
                    Privacy Policy
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      )}
    </SecurityModal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    padding: commonStyles.spacing.lg,
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: commonStyles.spacing.xl,
  },
  logo: {
    width: 180,
    height: 60,
    borderRadius: commonStyles.borderRadius.large,
  },
  appName: {
    marginTop: commonStyles.spacing.sm,
    fontFamily: commonStyles.typography.fontFamily.medium,
  },
  title: {
    marginBottom: commonStyles.spacing.md,
    textAlign: 'center',
    fontSize: 22,
    fontFamily: commonStyles.typography.fontFamily.medium,
  },
  subtitle: {
    marginBottom: commonStyles.spacing.md,
    textAlign: 'center',
    fontFamily: commonStyles.typography.fontFamily.medium,
  },
  errorText: {
    marginBottom: commonStyles.spacing.md,
    fontFamily: commonStyles.typography.fontFamily.medium,
    textAlign: 'center',
  },
  inputContainer: {
    marginTop: commonStyles.spacing.sm,
    marginBottom: commonStyles.spacing.lg,
  },
  phoneInputContainer: {
    marginBottom: 0,
    fontFamily: commonStyles.typography.fontFamily.medium,
  },
  countryCode: {
    fontFamily: commonStyles.typography.fontFamily.medium,
    fontSize: commonStyles.typography.fontSize.lg,
    paddingRight: commonStyles.spacing.xs,
  },
  sendOtpButton: {
    marginBottom: commonStyles.spacing.lg,
    fontFamily: commonStyles.typography.fontFamily.medium,
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: commonStyles.spacing.xl,
    paddingHorizontal: commonStyles.spacing.xs,
    fontFamily: commonStyles.typography.fontFamily.medium,
  },
  infoText: {
    marginLeft: commonStyles.spacing.xs,
    flex: 1,
    lineHeight: 20,
    fontFamily: commonStyles.typography.fontFamily.medium,
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginBottom: commonStyles.spacing.md,
    fontFamily: commonStyles.typography.fontFamily.medium,
  },
  registerText: {
    fontFamily: commonStyles.typography.fontFamily.medium,
  },
  registerLink: {
    fontFamily: commonStyles.typography.fontFamily.medium,
  },
  termsContainer: {
    alignItems: 'center',
    marginBottom: commonStyles.spacing.md,
    fontFamily: commonStyles.typography.fontFamily.medium,
  },
  byContText: {
    textAlign: 'center',
    marginBottom: commonStyles.spacing.xs,
    fontFamily: commonStyles.typography.fontFamily.medium,
  },
  termsLinksContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',
    fontFamily: commonStyles.typography.fontFamily.medium,
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    flex: 1,
    marginTop: Platform.OS === 'ios' ? 50 : 25, // Account for status bar
    borderTopLeftRadius: commonStyles.borderRadius.large,
    borderTopRightRadius: commonStyles.borderRadius.large,
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: commonStyles.spacing.lg,
    borderBottomWidth: 1,
  },
  modalTitle: {
    flex: 1,
  },
  closeButton: {
    padding: commonStyles.spacing.xs,
  },
  modalContent: {
    flex: 1,
    padding: commonStyles.spacing.lg,
  },
  modalText: {
    lineHeight: 22,
  },
  modalFooter: {
    padding: commonStyles.spacing.lg,
    borderTopWidth: 1,
  },
  closeModalButton: {
    width: '100%',
  },
});