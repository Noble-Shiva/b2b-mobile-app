import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { Link, router } from 'expo-router';
import { ArrowLeft, Send } from 'lucide-react-native';

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!email) {
      setError('Please enter your email address');
      return;
    }
    
    try {
      // API call to send password reset email would go here
      setIsSubmitted(true);
      setError(null);
    } catch (err) {
      setError('Failed to send reset email. Please try again.');
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color="#333333" />
        </TouchableOpacity>
        
        <View style={styles.logoContainer}>
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1633409361618-c73427e4e206?q=80&w=200&auto=format&fit=crop' }}
            style={styles.logo}
          />
          <Text style={styles.appName}>QuickMart</Text>
        </View>
        
        {!isSubmitted ? (
          <>
            <Text style={styles.title}>Forgot Password</Text>
            <Text style={styles.subtitle}>Enter your email to reset your password</Text>
            
            {error && <Text style={styles.errorText}>{error}</Text>}
            
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
            
            <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
              <Text style={styles.submitButtonText}>Send Reset Link</Text>
              <Send size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </>
        ) : (
          <View style={styles.successContainer}>
            <Image
              source={{ uri: 'https://images.unsplash.com/photo-1526280760714-f9e8b26f318f?q=80&w=200&auto=format&fit=crop' }}
              style={styles.successImage}
            />
            <Text style={styles.successTitle}>Check Your Email</Text>
            <Text style={styles.successText}>
              We've sent a password reset link to {email}. Please check your inbox and follow the instructions.
            </Text>
            <TouchableOpacity 
              style={styles.backToLoginButton}
              onPress={() => router.replace('/login')}
            >
              <Text style={styles.backToLoginText}>Back to Login</Text>
            </TouchableOpacity>
          </View>
        )}
        
        <View style={styles.loginContainer}>
          <Text style={styles.loginText}>Remember your password? </Text>
          <Link href="/login" asChild>
            <TouchableOpacity>
              <Text style={styles.loginLink}>Sign In</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 24,
    justifyContent: 'center',
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 24,
    zIndex: 10,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 20,
  },
  appName: {
    marginTop: 12,
    fontSize: 24,
    fontFamily: 'Poppins-Bold',
    color: '#FF4500',
  },
  title: {
    fontSize: 28,
    fontFamily: 'Poppins-Bold',
    color: '#333333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: '#666666',
    marginBottom: 32,
  },
  errorText: {
    color: '#FF3B30',
    marginBottom: 16,
    fontFamily: 'Poppins-Regular',
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
    color: '#333333',
    marginBottom: 8,
  },
  input: {
    height: 56,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    backgroundColor: '#F9F9F9',
  },
  submitButton: {
    height: 56,
    backgroundColor: '#FF4500',
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
    marginBottom: 24,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    marginRight: 8,
  },
  successContainer: {
    alignItems: 'center',
    marginVertical: 24,
  },
  successImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 24,
  },
  successTitle: {
    fontSize: 24,
    fontFamily: 'Poppins-Bold',
    color: '#333333',
    marginBottom: 16,
  },
  successText: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: '#666666',
    textAlign: 'center',
    marginBottom: 32,
  },
  backToLoginButton: {
    height: 56,
    backgroundColor: '#FF4500',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    marginBottom: 24,
  },
  backToLoginText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginText: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#666666',
  },
  loginLink: {
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
    color: '#FF4500',
  },
});