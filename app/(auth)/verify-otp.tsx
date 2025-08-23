import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  TouchableOpacity, 
  StyleSheet, 
  KeyboardAvoidingView, 
  Platform, 
  ScrollView,
  ActivityIndicator,
  Alert,
  Dimensions,
  Keyboard
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { router, useLocalSearchParams } from 'expo-router';
import { ArrowRight, ArrowLeft } from 'lucide-react-native';
import { 
  verifyOtp, 
  selectIsLoading, 
  selectAuthError, 
  selectPhone, 
  selectUserType,
  selectOtpReference,
  resetOtpState,
  clearError 
} from '@/store/authSlice';
import { selectIsDark } from '@/store/themeSlice';
import { AnyAction } from '@reduxjs/toolkit';
import OTPTextInput from 'react-native-otp-textinput';
import { Text, Button } from '@/components/ui';
import { colors, commonStyles, getTheme } from '@/utils/theme';

// Configurable OTP length
const OTP_LENGTH = 4;

// Get screen dimensions
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function VerifyOtpScreen() {
  const [otp, setOtp] = useState('');
  const [verificationError, setVerificationError] = useState<string | null>(null);
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  
  const dispatch = useDispatch();
  const isLoading = useSelector(selectIsLoading);
  const apiError = useSelector(selectAuthError);
  const phone = useSelector(selectPhone);
  const userType = useSelector(selectUserType);
  // Retrieve OTP reference from the auth state to display for demo purposes
  const otpReference = useSelector(selectOtpReference);
  const isDark = useSelector(selectIsDark);
  
  // Debug logging
  console.log('OTP Reference in verify-otp component:', otpReference);
  
  const theme = getTheme(isDark);
  
  // Get the returnTo parameter from URL if it exists
  const params = useLocalSearchParams<{ returnTo?: string }>();
  const returnTo = params.returnTo;
  
  // Reference for OTP input
  const otpInput = useRef<OTPTextInput>(null);
  
  // Track whether OTP verification has been attempted
  const [verificationAttempted, setVerificationAttempted] = useState(false);

  // Handle keyboard visibility
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => setKeyboardVisible(true)
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => setKeyboardVisible(false)
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);
  
  // Handle navigation based on user type after OTP verification
  useEffect(() => {
    if (verificationAttempted && userType) {
      console.log('Auth state updated - userType:', userType);
    } else if (verificationAttempted) {
      console.log('Verification attempted but userType not set, staying on OTP screen');
    }
  }, [userType, verificationAttempted]);
  
  // Reset verification error when OTP changes
  useEffect(() => {
    if (verificationError) {
      setVerificationError(null);
    }
  }, [otp]);
  
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
  
  const validateOtp = () => {
    if (otp.length !== OTP_LENGTH) {
      setVerificationError(`Please enter a valid ${OTP_LENGTH}-digit OTP`);
      return false;
    }
    
    setVerificationError(null);
    return true;
  };
  
  const handleVerifyOtp = async () => {
    if (validateOtp() && phone) {
      setVerificationAttempted(true);
      
      console.log('Attempting to verify OTP...');
      
      try {
        const result = await dispatch(verifyOtp({ 
          phone, 
          otp 
        }) as unknown as AnyAction);
        
        console.log('OTP verification result:', result);
        
        if (result?.payload?.success || 
            (result?.payload?.user_type && 
             (result?.payload?.user_type === 'new_user' || result?.payload?.user_type === 'existing_user'))) {
          
          const userType = result.payload.user_type;
          console.log('Setting userType from successful result:', userType);
          
          if (userType === 'existing_user') {
            console.log('Authentication successful, waiting to navigate...');
            
            setTimeout(() => {
              try {
                if (returnTo) {
                  console.log('Navigating existing user to:', returnTo);
                  router.push({
                    pathname: returnTo as any,
                    params: { authCompleted: 'true' }
                  } as any);
                } else {
                  console.log('Navigating existing user to home');
                  router.push('/(tabs)' as any);
                }
              } catch (navError) {
                console.error('Navigation error:', navError);
                returnTo ? router.push(returnTo as any) : router.push('/(tabs)' as any);
              }
            }, 1500);
          } else if (userType === 'new_user') {
            console.log('Authentication successful for new user, waiting to navigate...');
            
            setTimeout(() => {
              try {
                console.log('Navigating new user to registration');
                if (returnTo) {
                  router.push({ 
                    pathname: '/register-user', 
                    params: { returnTo, authCompleted: 'true' } 
                  } as any);
                } else {
                  router.push('/register-user' as any);
                }
              } catch (navError) {
                console.error('Navigation error:', navError);
                router.push('/register-user' as any);
              }
            }, 1500);
          }
        } else {
          setVerificationError('OTP verification failed. Please try again.');
        }
      } catch (error: any) {
        console.error('OTP verification error:', error);
        setVerificationError(typeof error === 'string' ? error : 'Failed to verify OTP. Please try again.');
      }
    }
  };
  
  const handleResendOtp = () => {
    Alert.alert(
      "Resend OTP",
      "Are you sure you want to resend the OTP?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        { 
          text: "Resend", 
          onPress: () => {
            router.replace('/login');
          }
        }
      ]
    );
  };
  
  const formatPhone = (phoneNumber: string | null) => {
    if (!phoneNumber) return '';
    
    const cleaned = phoneNumber.replace(/\D/g, '');
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
    
    if (match) {
      return `+91 ${match[1]}-${match[2]}-${match[3]}`;
    }
    
    return `+91 ${phoneNumber}`;
  };
  
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={[styles.container, { backgroundColor: theme.background.primary }]}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
    >
      <ScrollView 
        contentContainerStyle={[
          styles.scrollContainer,
          { minHeight: SCREEN_HEIGHT }
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.contentContainer}>
          <TouchableOpacity 
            style={[styles.backButton, { backgroundColor: theme.background.tertiary }]}
            onPress={() => {
              dispatch(resetOtpState());
              // Use replace instead of back to avoid navigation errors
              router.replace('/(auth)/login');
            }}
          >
            <ArrowLeft size={24} color={theme.icon.primary} />
          </TouchableOpacity>
          
          <Text variant="h1" weight="bold" style={styles.title}>
            Enter Verification Code
          </Text>
          
          {(verificationError || apiError) && (
            <Text variant="body-sm" color="error" style={styles.errorText}>
              {verificationError || apiError}
            </Text>
          )}
          
          <View style={styles.otpContainer}>
            <OTPTextInput
              ref={otpInput}
              handleTextChange={(text) => setOtp(text)}
              inputCount={OTP_LENGTH}
              autoFocus
              keyboardType="number-pad"
              textInputStyle={[
                styles.otpInput,
                {
                  backgroundColor: theme.background.input,
                  borderColor: theme.border.light,
                  color: theme.text.primary,
                }
              ] as any}
              tintColor={colors.primary[600]}
              offTintColor={theme.border.light}
              containerStyle={styles.otpInputContainer}
            />
          </View>

          {/* Demo-only: Show the OTP reference (actual code) to testers */}
          {otpReference && (
            <Text variant="body-sm" color="tertiary" style={styles.infoText}>
              For testing: Use code <Text style={styles.testCode}>{otpReference}</Text>
            </Text>
          )}

          <Button
            variant="primary"
            size="large"
            fullWidth
            onPress={handleVerifyOtp}
            disabled={isLoading}
            isLoading={isLoading}
            rightIcon={!isLoading && <ArrowRight size={20} color="#FFFFFF" />}
            style={styles.verifyButton}
          >
            Verify
          </Button>

          <Text variant="body" color="secondary" style={styles.subtitle}>
            Enter the {OTP_LENGTH}-digit code sent to {formatPhone(phone)}
          </Text>
          
          <View style={styles.resendContainer}>
            <Text 
              variant="body" color="secondary" 
              style={styles.resendText}>
                Didn't receive the code?{' '}
            </Text>
            <TouchableOpacity onPress={handleResendOtp}>
              <Text 
                variant="body" color="accent" 
                weight="medium" 
                style={styles.resendLink}>
                Resend OTP
              </Text>
            </TouchableOpacity>
          </View>
          
          {/* <Text variant="body-sm" color="tertiary" style={styles.infoText}>
            For testing: Use code <Text style={styles.testCode}>123456</Text>
          </Text> */}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  contentContainer: {
    flex: 1,
    padding: commonStyles.spacing.lg,
    paddingTop: commonStyles.spacing.md,
  },
  backButton: {
    marginTop: commonStyles.spacing.xl,
    marginBottom: commonStyles.spacing.lg,
    width: 40,
    height: 40,
    borderRadius: commonStyles.borderRadius.round,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    marginBottom: commonStyles.spacing.xl,
    fontFamily: commonStyles.typography.fontFamily.bold,
    textAlign: 'center',
  },
  subtitle: {
    marginBottom: commonStyles.spacing.md,
    fontFamily: commonStyles.typography.fontFamily.medium,
    textAlign: 'center',
  },
  errorText: {
    marginBottom: commonStyles.spacing.lg,
    fontFamily: commonStyles.typography.fontFamily.medium,
    textAlign: 'center',
  },
  otpContainer: {
    marginBottom: commonStyles.spacing.xl,
    fontFamily: commonStyles.typography.fontFamily.medium,
  },
  otpInputContainer: {
    marginHorizontal: commonStyles.spacing.lg,
    fontFamily: commonStyles.typography.fontFamily.medium,
  },
  otpInput: {
    borderWidth: 1,
    borderRadius: commonStyles.borderRadius.medium,
    width: 48,
    height: 56,
    fontSize: commonStyles.typography.fontSize.xl,
    fontFamily: commonStyles.typography.fontFamily.medium,
    textAlign: 'center',
  },
  verifyButton: {
    marginBottom: commonStyles.spacing.lg,
    fontFamily: commonStyles.typography.fontFamily.medium,
  },
  resendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: commonStyles.spacing.xl,
    flexWrap: 'wrap',
    fontFamily: commonStyles.typography.fontFamily.medium,
  },
  resendText: {
    fontFamily: commonStyles.typography.fontFamily.medium,
  },
  resendLink: {
    fontFamily: commonStyles.typography.fontFamily.medium,
  },
  infoText: {
    textAlign: 'center',
    marginBottom: commonStyles.spacing.md,
    fontFamily: commonStyles.typography.fontFamily.medium,
  },
  testCode: {
    fontFamily: commonStyles.typography.fontFamily.bold,
  },
});
