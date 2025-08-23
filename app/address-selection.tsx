import { useState } from 'react';
import { View, StyleSheet, TextInput, FlatList, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { MapPin, Search, Plus, Navigation, Chrome as Home, Briefcase, Star } from 'lucide-react-native';
import { Text, BackButton } from '@/components/ui';
import { colors } from '@/utils/theme';
import { useSelector } from 'react-redux';
import { selectIsDark } from '@/store/themeSlice';

// Sample saved addresses
const savedAddresses = [
  {
    id: '1',
    type: 'home',
    title: 'Home',
    address: '123 Main Street, Apt 4B',
    area: 'Downtown',
    city: 'New York, NY 10001',
    isDefault: true,
  },
  {
    id: '2',
    type: 'work',
    title: 'Work',
    address: '456 Business Ave, Suite 200',
    area: 'Financial District',
    city: 'New York, NY 10022',
    isDefault: false,
  },
  {
    id: '3',
    type: 'other',
    title: 'Gym',
    address: '789 Fitness Blvd',
    area: 'Midtown',
    city: 'New York, NY 10019',
    isDefault: false,
  },
];

export default function AddressSelectionScreen() {
  const router = useRouter();
  const isDark = useSelector(selectIsDark);
  
  const [searchQuery, setSearchQuery] = useState('');
  
  const getAddressIcon = (type: string) => {
    switch (type) {
      case 'home':
        return <Home size={20} color={colors.primary[600]} />;
      case 'work':
        return <Briefcase size={20} color={colors.primary[600]} />;
      default:
        return <Star size={20} color={colors.primary[600]} />;
    }
  };
  
  const handleAddressSelect = (address: any) => {
    // In a real app, this would update the selected address in a context/store
    router.back();
  };
  
  const handleAddNewAddress = () => {
    // Navigate to add new address screen
    router.push('/profile/addresses');
  };

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
        <Text variant="h4" weight="semibold">Select Location</Text>
        <View style={styles.placeholder} />
      </View>
      
      <View style={[
        styles.searchContainer,
        { 
          backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF',
          borderBottomColor: isDark ? '#333333' : '#EEEEEE' 
        }
      ]}>
        <View style={[
          styles.searchInputContainer,
          { backgroundColor: isDark ? '#2A2A2A' : '#F5F5F5' }
        ]}>
          <Search size={20} color={isDark ? '#999999' : '#666666'} />
          <TextInput
            style={[
              styles.searchInput,
              { color: isDark ? '#FFFFFF' : '#333333' }
            ]}
            placeholder="Search for area, street name..."
            placeholderTextColor={isDark ? '#999999' : '#999999'}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        
        <TouchableOpacity 
          style={[
            styles.currentLocationButton,
            { backgroundColor: isDark ? '#2A2A2A' : '#F5F5F5' }
          ]}
        >
          <Navigation size={20} color={colors.primary[600]} />
          <Text variant="body-sm" weight="medium" color="accent" style={styles.currentLocationText}>
            Use current location
          </Text>
        </TouchableOpacity>
      </View>
      
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.savedAddressesSection}>
          <View style={styles.sectionHeader}>
            <Text variant="h4" weight="semibold">Saved Addresses</Text>
            <TouchableOpacity 
              style={styles.addButton}
              onPress={handleAddNewAddress}
            >
              <Plus size={16} color={colors.primary[600]} />
              <Text variant="body-sm" weight="medium" color="accent" style={styles.addButtonText}>
                Add New
              </Text>
            </TouchableOpacity>
          </View>
          
          {savedAddresses.map((address) => (
            <TouchableOpacity
              key={address.id}
              style={[
                styles.addressCard,
                { backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF' }
              ]}
              onPress={() => handleAddressSelect(address)}
            >
              <View style={styles.addressIcon}>
                {getAddressIcon(address.type)}
              </View>
              
              <View style={styles.addressInfo}>
                <View style={styles.addressHeader}>
                  <Text variant="body" weight="semibold">
                    {address.title}
                  </Text>
                  {address.isDefault && (
                    <View style={styles.defaultBadge}>
                      <Text variant="caption" weight="medium" color="accent">
                        Default
                      </Text>
                    </View>
                  )}
                </View>
                
                <Text variant="body-sm" color="secondary">
                  {address.address}
                </Text>
                <Text variant="body-sm" color="secondary">
                  {address.area}, {address.city}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
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
  searchContainer: {
    padding: 16,
    borderBottomWidth: 1,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    height: 48,
    borderRadius: 8,
    marginBottom: 12,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
  },
  currentLocationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
  },
  currentLocationText: {
    marginLeft: 8,
  },
  savedAddressesSection: {
    padding: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addButtonText: {
    marginLeft: 4,
  },
  addressCard: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  addressIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFF0EB',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  addressInfo: {
    flex: 1,
  },
  addressHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  defaultBadge: {
    backgroundColor: '#FFF0EB',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    marginLeft: 8,
  },
});