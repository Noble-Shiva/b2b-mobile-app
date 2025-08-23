import React from 'react';
import { View, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Star, Shield, Truck, MapPin, ArrowRight, Award } from 'lucide-react-native';
import { useSelector } from 'react-redux';
import { selectIsDark } from '@/store/themeSlice';
import { Text } from '@/components/ui';
import { colors } from '@/utils/theme';

interface VerifiedSupplier {
  id: string;
  name: string;
  logo: string;
  rating: number;
  reviewCount: number;
  location: string;
  deliveryTime: string;
  productCount: number;
  certifications: string[];
  specialties: string[];
  averageMargin: number;
  isVerified: boolean;
  yearsInBusiness: number;
}

interface VerifiedSupplierCardProps {
  supplier: VerifiedSupplier;
  onPress: () => void;
}

export default function VerifiedSupplierCard({ supplier, onPress }: VerifiedSupplierCardProps) {
  const isDark = useSelector(selectIsDark);

  return (
    <TouchableOpacity
      style={[
        styles.container,
        { backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF' }
      ]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      {/* Header with logo and verification */}
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Image source={{ uri: supplier.logo }} style={styles.logo} resizeMode="contain" />
          {supplier.isVerified && (
            <View style={styles.verificationBadge}>
              <Shield size={12} color="#FFFFFF" />
            </View>
          )}
        </View>
        
        <View style={styles.headerInfo}>
          <Text variant="body" weight="bold" numberOfLines={1}>
            {supplier.name}
          </Text>
          <Text variant="caption" color="secondary">
            {supplier.yearsInBusiness}+ years in business
          </Text>
          
          {/* Rating */}
          <View style={styles.ratingContainer}>
            <Star size={14} color="#FFB800" fill="#FFB800" />
            <Text variant="body-sm" weight="semibold" style={styles.rating}>
              {supplier.rating}
            </Text>
            <Text variant="caption" color="secondary">
              ({supplier.reviewCount} reviews)
            </Text>
          </View>
        </View>
        
        <ArrowRight size={16} color={colors.primary[600]} />
      </View>

      {/* Quick Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text variant="h4" weight="bold" color="accent">
            {supplier.productCount}+
          </Text>
          <Text variant="caption" color="secondary">Products</Text>
        </View>
        
        <View style={styles.statDivider} />
        
        <View style={styles.statItem}>
          <Text variant="h4" weight="bold" color="success">
            {supplier.averageMargin}%
          </Text>
          <Text variant="caption" color="secondary">Avg Margin</Text>
        </View>
        
        <View style={styles.statDivider} />
        
        <View style={styles.statItem}>
          <Truck size={16} color={colors.primary[600]} />
          <Text variant="caption" color="secondary" style={styles.deliveryText}>
            {supplier.deliveryTime}
          </Text>
        </View>
      </View>

      {/* Location */}
      <View style={styles.locationContainer}>
        <MapPin size={12} color="#999" />
        <Text variant="caption" color="secondary" style={styles.locationText}>
          {supplier.location}
        </Text>
      </View>

      {/* Certifications */}
      <View style={styles.certificationsContainer}>
        <Text variant="caption" weight="semibold" style={styles.sectionTitle}>
          Certifications:
        </Text>
        <View style={styles.certificationsList}>
          {supplier.certifications.slice(0, 3).map((cert, index) => (
            <View key={index} style={styles.certificationBadge}>
              <Award size={10} color={colors.primary[600]} />
              <Text variant="caption" style={styles.certificationText}>
                {cert}
              </Text>
            </View>
          ))}
        </View>
      </View>

      {/* Specialties */}
      <View style={styles.specialtiesContainer}>
        <Text variant="caption" weight="semibold" style={styles.sectionTitle}>
          Specialties:
        </Text>
        <View style={styles.specialtiesList}>
          {supplier.specialties.slice(0, 3).map((specialty, index) => (
            <View key={index} style={styles.specialtyTag}>
              <Text variant="caption" style={styles.specialtyText}>
                {specialty}
              </Text>
            </View>
          ))}
          {supplier.specialties.length > 3 && (
            <Text variant="caption" color="secondary" style={styles.moreText}>
              +{supplier.specialties.length - 3} more
            </Text>
          )}
        </View>
      </View>

      {/* Trust Indicators */}
      <View style={styles.trustContainer}>
        <View style={styles.trustItem}>
          <Shield size={12} color="#4CAF50" />
          <Text variant="caption" style={styles.trustText}>
            Verified Supplier
          </Text>
        </View>
        <View style={styles.trustItem}>
          <Star size={12} color="#FFB800" />
          <Text variant="caption" style={styles.trustText}>
            Top Rated
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 320,
    marginRight: 16,
    borderRadius: 12,
    padding: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  logoContainer: {
    position: 'relative',
    marginRight: 12,
  },
  logo: {
    width: 48,
    height: 48,
    borderRadius: 8,
    backgroundColor: '#F5F5F5',
  },
  verificationBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#4CAF50',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerInfo: {
    flex: 1,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    gap: 4,
  },
  rating: {
    marginLeft: 2,
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
    height: 24,
    backgroundColor: '#E0E0E0',
    marginHorizontal: 8,
  },
  deliveryText: {
    marginTop: 2,
    textAlign: 'center',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 6,
  },
  locationText: {
    fontSize: 11,
  },
  certificationsContainer: {
    marginBottom: 12,
  },
  sectionTitle: {
    marginBottom: 6,
    fontSize: 11,
    color: '#666',
  },
  certificationsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  certificationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 6,
    gap: 3,
  },
  certificationText: {
    fontSize: 10,
    color: '#1976D2',
    fontWeight: '500',
  },
  specialtiesContainer: {
    marginBottom: 12,
  },
  specialtiesList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  specialtyTag: {
    backgroundColor: '#FFF3E0',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  specialtyText: {
    fontSize: 10,
    color: '#F57C00',
    fontWeight: '500',
  },
  moreText: {
    fontSize: 10,
    fontStyle: 'italic',
    alignSelf: 'center',
  },
  trustContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  trustItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  trustText: {
    fontSize: 11,
    color: '#4CAF50',
    fontWeight: '500',
  },
}); 