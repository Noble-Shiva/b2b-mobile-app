import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useSelector } from 'react-redux';
import { selectIsDark } from '@/store/themeSlice';
import { Text } from '@/components/ui';
import VerifiedSupplierCard from './VerifiedSupplierCard';

interface Supplier {
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

const verifiedSuppliers: Supplier[] = [
  {
    id: 'supplier-1',
    name: 'AyurSource Distributors',
    logo: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?w=100&h=100&fit=crop',
    rating: 4.8,
    reviewCount: 1240,
    location: 'Mumbai, Maharashtra',
    deliveryTime: '1-2 days',
    productCount: 450,
    certifications: ['FSSAI', 'ISO 9001', 'GMP'],
    specialties: ['Immunity Products', 'Digestion Care', 'Skin Care'],
    averageMargin: 35,
    isVerified: true,
    yearsInBusiness: 12,
  },
  {
    id: 'supplier-2',
    name: 'Himalayan Herbs Ltd',
    logo: 'https://images.unsplash.com/photo-1516733725897-1aa73b87c8e8?w=100&h=100&fit=crop',
    rating: 4.6,
    reviewCount: 890,
    location: 'Dehradun, Uttarakhand',
    deliveryTime: '2-3 days',
    productCount: 320,
    certifications: ['FSSAI', 'Ayush License', 'Organic'],
    specialties: ['Herbal Extracts', 'Essential Oils', 'Powders'],
    averageMargin: 42,
    isVerified: true,
    yearsInBusiness: 18,
  },
  {
    id: 'supplier-3',
    name: 'Kerala Ayurveda Supply',
    logo: 'https://images.unsplash.com/photo-1511909216066-c044de63cea5?w=100&h=100&fit=crop',
    rating: 4.7,
    reviewCount: 756,
    location: 'Kochi, Kerala',
    deliveryTime: '3-4 days',
    productCount: 280,
    certifications: ['FSSAI', 'Kerala Ayurveda Board', 'Export License'],
    specialties: ['Traditional Medicines', 'Oils & Ghritams', 'Kashayams'],
    averageMargin: 38,
    isVerified: true,
    yearsInBusiness: 25,
  },
  {
    id: 'supplier-4',
    name: 'Patanjali Wholesale Hub',
    logo: 'https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=100&h=100&fit=crop',
    rating: 4.5,
    reviewCount: 1580,
    location: 'Haridwar, Uttarakhand',
    deliveryTime: '2-4 days',
    productCount: 680,
    certifications: ['FSSAI', 'WHO-GMP', 'Ayush'],
    specialties: ['FMCG Products', 'Healthcare', 'Personal Care'],
    averageMargin: 28,
    isVerified: true,
    yearsInBusiness: 15,
  },
  {
    id: 'supplier-5',
    name: 'Baidyanath Enterprises',
    logo: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=100&h=100&fit=crop',
    rating: 4.4,
    reviewCount: 1120,
    location: 'Kolkata, West Bengal',
    deliveryTime: '3-5 days',
    productCount: 520,
    certifications: ['FSSAI', 'GMP', 'Ayush License'],
    specialties: ['Classical Medicines', 'Rasayanas', 'Bhasmas'],
    averageMargin: 40,
    isVerified: true,
    yearsInBusiness: 22,
  },
];

interface VerifiedSuppliersListProps {
  onSupplierPress: (supplier: Supplier) => void;
}

export default function VerifiedSuppliersList({ onSupplierPress }: VerifiedSuppliersListProps) {
  const isDark = useSelector(selectIsDark);

  return (
    <View style={styles.container}>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
      >
        {verifiedSuppliers.map((supplier) => (
          <VerifiedSupplierCard
            key={supplier.id}
            supplier={supplier}
            onPress={() => onSupplierPress(supplier)}
          />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 8,
  },
  scrollContainer: {
    paddingHorizontal: 16,
  },
}); 