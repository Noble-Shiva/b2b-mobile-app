import React from 'react';
import { View, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import { Text } from '@/components/ui';
import { colors } from '@/utils/theme';
import { useSelector } from 'react-redux';
import { selectIsDark } from '@/store/themeSlice';

interface PoliciesProps {
  containerStyle?: any;
  showTitle?: boolean;
}

export default function Policies({ containerStyle, showTitle = true }: PoliciesProps) {
  const isDark = useSelector(selectIsDark);
  
  return (
    <View style={[
      styles.policiesContainer,
      { backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF' },
      containerStyle
    ]}>
      {showTitle && (
        <Text variant="h4" weight="semibold" style={styles.sectionTitle}>
          Policies
        </Text>
      )}
      
      <View style={styles.policyItem}>
        <Text variant="body" weight="semibold" style={styles.policyTitle}>
          Return / Refund / Cancellation
        </Text>
        <Text variant="body" color="secondary" style={styles.policyDescription}>
          Items can be returned within 7 days for full refund. Orders can be cancelled free before dispatch. Product must be unused and in original packaging.
        </Text>
        <TouchableOpacity 
          style={styles.learnMoreButton}
          onPress={() => Linking.openURL('https://example.com/return-policy')}
        >
          <Text variant="body" style={[
            styles.learnMoreText,
            { color: colors.primary[600] }
          ]}>
            Learn More
          </Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.policyItem}>
        <Text variant="body" weight="semibold" style={styles.policyTitle}>
          Shipping / Delivery
        </Text>
        <Text variant="body" color="secondary" style={styles.policyDescription}>
          Free shipping on orders above ₹500. Standard delivery in 3-5 days, express delivery in 24-48 hours with real-time tracking available.
        </Text>
        <TouchableOpacity 
          style={styles.learnMoreButton}
          onPress={() => Linking.openURL('https://example.com/shipping-policy')}
        >
          <Text variant="body" style={[
            styles.learnMoreText,
            { color: colors.primary[600] }
          ]}>
            Learn More
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  policiesContainer: {
    padding: 16,
    marginTop: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  sectionTitle: {
    marginBottom: 12,
  },
  policyItem: {
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  policyTitle: {
    marginBottom: 6,
  },
  policyDescription: {
    lineHeight: 20,
  },
  learnMoreButton: {
    marginTop: 8,
    alignSelf: 'flex-end',
  },
  learnMoreText: {
    textDecorationLine: 'underline',
    fontWeight: '500',
  },
}); 