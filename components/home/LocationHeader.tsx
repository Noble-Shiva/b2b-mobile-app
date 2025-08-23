import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { MapPin, ChevronDown } from 'lucide-react-native';
import { Text } from '@/components/ui';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { selectIsDark } from '@/store/themeSlice';
import { useSelector } from 'react-redux';

interface LocationHeaderProps {
  currentAddress?: string;
}

export default function LocationHeader({ currentAddress }: LocationHeaderProps) {
  const router = useRouter();
  const isDark = useSelector(selectIsDark);
  const insets = useSafeAreaInsets();
  
  const handleAddressPress = () => {
    router.push('/address-selection');
  };

  return (
    <View style={[
      styles.container,
      { 
        backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF',
        paddingTop: insets.top
      }
    ]}>
      <View style={styles.locationContainer}>
        <Text variant="caption" color="secondary" style={styles.deliverTo}>
          DELIVER TO
        </Text>
        
        <TouchableOpacity 
          style={styles.addressButton}
          onPress={handleAddressPress}
        >
          <MapPin size={16} color={isDark ? '#FFFFFF' : '#333333'} />
          <Text 
            variant="body" 
            weight="medium" 
            numberOfLines={1} 
            style={styles.address}
          >
            {currentAddress || 'Select your location'}
          </Text>
          <ChevronDown size={16} color={isDark ? '#FFFFFF' : '#333333'} />
        </TouchableOpacity>
      </View>
      
      <View style={[
        styles.deliveryTime,
        { backgroundColor: isDark ? '#2A2A2A' : '#F5F5F5' }
      ]}>
        <Text variant="caption" weight="medium" color="accent">
          15-30 min
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
    zIndex: 10,
  },
  locationContainer: {
    flex: 1,
    marginRight: 16,
  },
  deliverTo: {
    marginBottom: 4,
  },
  addressButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  address: {
    flex: 1,
    marginHorizontal: 8,
  },
  deliveryTime: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
});