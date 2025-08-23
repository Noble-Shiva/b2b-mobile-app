import { useState, useEffect } from 'react';
import { View, StyleSheet, Image, TouchableOpacity, ScrollView, Switch, Alert, Dimensions, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useDispatch, useSelector } from 'react-redux';
import { selectUser, selectToken, signOut, fetchUserDetails } from '@/store/authSlice';
import { selectIsDark, setTheme } from '@/store/themeSlice';
import { User, MapPin, CreditCard, Bell, ShieldCheck, CircleHelp as HelpCircle, LogOut, ChevronRight, ShoppingBag, Heart, UserPlus, Lock, Info } from 'lucide-react-native';
import { Text, Button } from '@/components/ui';
import { colors, getTheme } from '@/utils/theme';
import SecurityModal, { SecurityModalType } from '@/components/security';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');



export default function ProfileScreen() {
  const router = useRouter();
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const token = useSelector(selectToken);
  const isDark = useSelector(selectIsDark);
  
  // Check if user is authenticated
  const isAuthenticated = !!(user && token);
  
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [isSigningOut, setIsSigningOut] = useState(false);

  
  const theme = getTheme(isDark);

  // Fetch user details when component mounts or when user becomes authenticated
  useEffect(() => {
    if (isAuthenticated && user?.id) {
      console.log('Fetching user details for user ID:', user.id);
      dispatch(fetchUserDetails(user.id) as any);
    }
  }, [isAuthenticated, user?.id, dispatch]);
  
  const handleSignOut = async () => {
    try {
      setIsSigningOut(true);
      dispatch(signOut());
      // Stay on the same page - it will automatically show guest content
      console.log('User signed out successfully');
    } catch (error) {
      console.error('Error signing out:', error);
    } finally {
      setIsSigningOut(false);
    }
  };
  
  const handleSignIn = () => {
    router.push('/login');
  };
  
  const navigateToOrders = () => {
    router.push('/profile/orders');
  };
  
  const navigateToAddresses = () => {
    router.push('/profile/addresses');
  };
  
  const navigateToPaymentMethods = () => {
    router.push('/profile/payment-methods');
  };
  
  const navigateToWishlist = () => {
    router.push('/profile/wishlist');
  };
  
  const handleToggleDarkMode = (value: boolean) => {
    dispatch(setTheme(value ? 'dark' : 'light'));
  };



  // Get user initials for profile circle
  const getUserInitials = () => {
    const name = getUserDisplayName();
    if (!name || name === 'Guest User') return 'GU';
    
    // Split name into words and get first letter of first two words
    const words = name.trim().split(' ').filter(word => word.length > 0);
    if (words.length >= 2) {
      return `${words[0][0]}${words[1][0]}`.toUpperCase();
    } else if (words.length === 1) {
      // If only one word, take first two letters
      return words[0].substring(0, 2).toUpperCase();
    }
    return 'U'; // fallback
  };

  // Get user display name
  const getUserDisplayName = () => {
    if (!user) return 'Guest User';
    return user.name || `${user.first_name || ''} ${user.last_name || ''}`.trim() || user.username || 'User';
  };

  // Get user email
  const getUserEmail = () => {
    return user?.email || 'guest@example.com';
  };

  // Render non-authenticated user content
  const renderGuestContent = (openModal: (type: SecurityModalType) => void) => (
    <>
      <View style={styles.guestContainer}>
        <View style={styles.guestIconContainer}>
          <UserPlus size={48} color={colors.primary[600]} />
        </View>
        <Text variant="h4" weight="semibold" style={styles.guestTitle}>
          Sign in to Access Your Account
        </Text>
        <Text variant="body" color="secondary" style={styles.guestSubtitle}>
          Get access to your orders, wishlist, and personalized recommendations
        </Text>
        <Button 
          onPress={handleSignIn}
          style={styles.guestSignInButton}
        >
          Sign In
        </Button>
      </View>
      
      {/* Show limited options for guests */}
      <View style={styles.sectionContainer}>
        <Text variant="h4" weight="semibold" style={styles.sectionTitle}>
          Preferences
        </Text>
        
        <View style={[styles.optionsCard, isDark && styles.optionsCardDark]}>
          <View style={styles.optionItem}>
            <View style={styles.optionIconContainer}>
              <ShieldCheck size={20} color={colors.primary[700]} />
            </View>
            <Text variant="body" weight="medium" style={styles.optionText}>
              Dark Mode
            </Text>
            <Switch
              value={isDark}
              onValueChange={handleToggleDarkMode}
              trackColor={{ false: '#DDDDDD', true: colors.primary[700] }}
              thumbColor="#FFFFFF"
            />
          </View>
        </View>
      </View>
      
      <View style={styles.sectionContainer}>
        <Text variant="h4" weight="semibold" style={styles.sectionTitle}>
          About
        </Text>
        
        <View style={[styles.optionsCard, isDark && styles.optionsCardDark]}>
          <TouchableOpacity 
            style={styles.optionItem}
            onPress={() => openModal('help')}
          >
            <View style={styles.optionIconContainer}>
              <HelpCircle size={20} color={colors.primary[700]} />
            </View>
            <Text variant="body" weight="medium" style={styles.optionText}>
              Help Center
            </Text>
            <ChevronRight size={20} color={isDark ? '#BBBBBB' : '#666666'} />
          </TouchableOpacity>
        </View>
      </View>
    </>
  );

  // Render authenticated user content
  const renderAuthenticatedContent = (openModal: (type: SecurityModalType) => void) => (
    <>
      <View style={styles.sectionContainer}>
        <Text variant="h4" weight="semibold" style={styles.sectionTitle}>
          My Account
        </Text>
        
        <View style={[styles.optionsCard, isDark && styles.optionsCardDark]}>
          <TouchableOpacity 
            style={styles.optionItem}
            onPress={navigateToOrders}
          >
            <View style={styles.optionIconContainer}>
              <ShoppingBag size={20} color={colors.primary[700]} />
            </View>
            <Text variant="body" weight="medium" style={styles.optionText}>
              My Orders
            </Text>
            <ChevronRight size={20} color={isDark ? '#BBBBBB' : '#666666'} />
          </TouchableOpacity>
          
          <View style={styles.divider} />
          
          {/* <TouchableOpacity 
            style={styles.optionItem}
            onPress={navigateToWishlist}
          >
            <View style={styles.optionIconContainer}>
              <Heart size={20} color={colors.primary[700]} />
            </View>
            <Text variant="body" weight="medium" style={styles.optionText}>
              My Wishlist
            </Text>
            <ChevronRight size={20} color={isDark ? '#BBBBBB' : '#666666'} />
          </TouchableOpacity>
          
          <View style={styles.divider} /> */}
          
          <TouchableOpacity 
            style={styles.optionItem}
            onPress={navigateToAddresses}
          >
            <View style={styles.optionIconContainer}>
              <MapPin size={20} color={colors.primary[700]} />
            </View>
            <Text variant="body" weight="medium" style={styles.optionText}>
              My Addresses
            </Text>
            <ChevronRight size={20} color={isDark ? '#BBBBBB' : '#666666'} />
          </TouchableOpacity>
          
          {/* <View style={styles.divider} />
          
          <TouchableOpacity 
            style={styles.optionItem}
            onPress={navigateToPaymentMethods}
          >
            <View style={styles.optionIconContainer}>
              <CreditCard size={20} color={colors.primary[700]} />
            </View>
            <Text variant="body" weight="medium" style={styles.optionText}>
              Payment Methods
            </Text>
            <ChevronRight size={20} color={isDark ? '#BBBBBB' : '#666666'} />
          </TouchableOpacity> */}
        </View>
      </View>
      
      <View style={styles.sectionContainer}>
        <Text variant="h4" weight="semibold" style={styles.sectionTitle}>
          Preferences
        </Text>
        
        <View style={[styles.optionsCard, isDark && styles.optionsCardDark]}>
          <View style={styles.optionItem}>
            <View style={styles.optionIconContainer}>
              <Bell size={20} color={colors.primary[700]} />
            </View>
            <Text variant="body" weight="medium" style={styles.optionText}>
              Notifications
            </Text>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: '#DDDDDD', true: colors.primary[700] }}
              thumbColor="#FFFFFF"
            />
          </View>
          
          <View style={styles.divider} />
          
          <View style={styles.optionItem}>
            <View style={styles.optionIconContainer}>
              <ShieldCheck size={20} color={colors.primary[700]} />
            </View>
            <Text variant="body" weight="medium" style={styles.optionText}>
              Dark Mode
            </Text>
            <Switch
              value={isDark}
              onValueChange={handleToggleDarkMode}
              trackColor={{ false: '#DDDDDD', true: colors.primary[700] }}
              thumbColor="#FFFFFF"
            />
          </View>
        </View>
      </View>
      
      <View style={styles.sectionContainer}>
        <Text variant="h4" weight="semibold" style={styles.sectionTitle}>
          Policies
        </Text>
        
        <View style={[styles.optionsCard, isDark && styles.optionsCardDark]}>
          {/* <TouchableOpacity 
            style={styles.optionItem}
            onPress={() => Alert.alert('Change Password', 'This would allow you to change your password in a real app.')}
          >
            <View style={styles.optionIconContainer}>
              <Lock size={20} color={colors.primary[700]} />
            </View>
            <Text variant="body" weight="medium" style={styles.optionText}>
              Change Password
            </Text>
            <ChevronRight size={20} color={isDark ? '#BBBBBB' : '#666666'} />
          </TouchableOpacity> */}
          <TouchableOpacity 
            style={styles.optionItem}
            onPress={() => openModal('terms')}
          >
            <View style={styles.optionIconContainer}>
              <Info size={20} color={colors.primary[700]} />
            </View>
            <Text variant="body" weight="medium" style={styles.optionText}>
              Terms & Conditions
            </Text>
            <ChevronRight size={20} color={isDark ? '#BBBBBB' : '#666666'} />
          </TouchableOpacity>
          
          <View style={styles.divider} />
          
          <TouchableOpacity 
            style={styles.optionItem}
            onPress={() => openModal('privacy')}
          >
            <View style={styles.optionIconContainer}>
              <Info size={20} color={colors.primary[700]} />
            </View>
            <Text variant="body" weight="medium" style={styles.optionText}>
              Privacy Policy
            </Text>
            <ChevronRight size={20} color={isDark ? '#BBBBBB' : '#666666'} />
          </TouchableOpacity>
        </View>
      </View>
      
      <View style={styles.sectionContainer}>
        <Text variant="h4" weight="semibold" style={styles.sectionTitle}>
          About
        </Text>
        
        <View style={[styles.optionsCard, isDark && styles.optionsCardDark]}>
          {/* <TouchableOpacity 
            style={styles.optionItem}
            onPress={() => openModal('help')}
          >
            <View style={styles.optionIconContainer}>
              <HelpCircle size={20} color={colors.primary[700]} />
            </View>
            <Text variant="body" weight="medium" style={styles.optionText}>
              Help Center
            </Text>
            <ChevronRight size={20} color={isDark ? '#BBBBBB' : '#666666'} />
          </TouchableOpacity>
          
          <View style={styles.divider} /> */}
          
          <TouchableOpacity 
            style={styles.optionItem}
            onPress={() => openModal('about')}
          >
            <View style={styles.optionIconContainer}>
              <Info size={20} color={colors.primary[700]} />
            </View>
            <Text variant="body" weight="medium" style={styles.optionText}>
              About Us
            </Text>
            <ChevronRight size={20} color={isDark ? '#BBBBBB' : '#666666'} />
          </TouchableOpacity>
        </View>
      </View>
      
      <TouchableOpacity 
        style={[styles.logoutButton, isDark && styles.logoutButtonDark]}
        onPress={handleSignOut}
        disabled={isSigningOut}
      >
        <LogOut size={20} color={isDark ? '#FFFFFF' : colors.primary[700]} />
        <Text 
          variant="body" 
          weight="medium" 
          color={isDark ? 'inverse' : 'accent'} 
          style={styles.logoutText}
        >
          {isSigningOut ? 'Signing Out...' : 'Sign Out'}
        </Text>
      </TouchableOpacity>
    </>
  );

  return (
    <SecurityModal>
      {(openModal) => (
        <View style={[styles.container, isDark && styles.containerDark]}>
          <StatusBar style={isDark ? 'light' : 'dark'} />
          
          <View style={[styles.header, isDark && styles.headerDark]}>
            <Text variant="h3" weight="bold">Profile</Text>
          </View>
          
          <ScrollView showsVerticalScrollIndicator={false}>
            {/* User Profile Card */}
            <View style={[styles.profileCard, isDark && styles.profileCardDark]}>
              <View style={[styles.profileImageContainer, isDark && styles.profileImageContainerDark]}>
                <Text style={[styles.profileInitials, isDark && styles.profileInitialsDark]}>
                  {getUserInitials()}
                </Text>
              </View>
              
              <View style={styles.profileInfo}>
                <Text variant="h4" weight="semibold" style={styles.profileName}>
                  {getUserDisplayName()}
                </Text>
                <Text variant="body-sm" color="secondary" style={styles.profileEmail}>
                  {getUserEmail()}
                </Text>
                
                {isAuthenticated && (
                  <TouchableOpacity 
                    style={styles.editButton}
                    onPress={() => router.push('/profile/edit-profile')}
                  >
                    <Text variant="body-sm" weight="medium" color="accent">Edit Profile</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>

            {/* Conditional content based on authentication */}
            {isAuthenticated ? renderAuthenticatedContent(openModal) : renderGuestContent(openModal)}
            
            <View style={styles.versionContainer}>
              <Text variant="caption" color="tertiary">Version 1.0.0</Text>
            </View>

            <View style={styles.footer}>
              <Text variant="caption" color="tertiary">
                © 2025 Srotas. All rights reserved.
              </Text>
            </View>
          </ScrollView>
        </View>
      )}
    </SecurityModal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },
  containerDark: {
    backgroundColor: '#121212',
  },
  header: {
    paddingTop: 60,
    paddingBottom: 16,
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  headerDark: {
    backgroundColor: '#1E1E1E',
    borderBottomColor: '#333333',
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    margin: 16,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  profileCardDark: {
    backgroundColor: '#1E1E1E',
  },
  profileImageContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primary[600],
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileImageContainerDark: {
    backgroundColor: colors.primary[700],
  },
  profileInitials: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 28,
  },
  profileInitialsDark: {
    color: '#FFFFFF',
  },
  profileInfo: {
    marginLeft: 16,
    flex: 1,
  },
  profileName: {
    marginBottom: 4,
  },
  profileEmail: {
    marginBottom: 12,
  },
  editButton: {
    backgroundColor: '#FFF0EB',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  guestContainer: {
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 16,
  },
  guestIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FFF0EB',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  guestTitle: {
    textAlign: 'center',
    marginBottom: 8,
  },
  guestSubtitle: {
    textAlign: 'center',
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  guestSignInButton: {
    minWidth: 120,
  },
  sectionContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    marginLeft: 16,
    marginBottom: 12,
  },
  optionsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginHorizontal: 16,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  optionsCardDark: {
    backgroundColor: '#1E1E1E',
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  optionIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFF0EB',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  optionText: {
    flex: 1,
  },
  divider: {
    height: 1,
    backgroundColor: '#EEEEEE',
    marginLeft: 56,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF0EB',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 16,
  },
  logoutButtonDark: {
    backgroundColor: colors.primary[700],
  },
  logoutText: {
    marginLeft: 8,
  },
  versionContainer: {
    alignItems: 'center',
    marginBottom: 10,
  },
  footer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    flex: 1,
    marginTop: Platform.OS === 'ios' ? 50 : 25, // Account for status bar
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
  },
  modalTitle: {
    flex: 1,
  },
  closeButton: {
    padding: 8,
  },
  modalContent: {
    flex: 1,
    padding: 16,
  },
  modalText: {
    lineHeight: 22,
  },
  modalFooter: {
    padding: 16,
    borderTopWidth: 1,
  },
  closeModalButton: {
    width: '100%',
  },
});