import React from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useSelector } from 'react-redux';
import { useRouter } from 'expo-router';
import { selectIsDark } from '@/store/themeSlice';
import { Text } from '@/components/ui';
import { colors } from '@/utils/theme';

interface HealthConcern {
  id: string;
  name: string;
  icon: string;
  productCount: number;
  route: string;
}

const healthConcerns: HealthConcern[] = [
  {
    id: '1',
    name: 'Immunity',
    icon: '🛡️',
    productCount: 245,
    route: '/search?concern=immunity'
  },
  {
    id: '2',
    name: 'Digestion',
    icon: '🌱',
    productCount: 189,
    route: '/search?concern=digestion'
  },
  {
    id: '3',
    name: 'Joint Care',
    icon: '🦴',
    productCount: 156,
    route: '/search?concern=joint-care'
  },
  {
    id: '4',
    name: 'Diabetes',
    icon: '🩺',
    productCount: 134,
    route: '/search?concern=diabetes'
  },
  {
    id: '5',
    name: 'Heart Health',
    icon: '❤️',
    productCount: 98,
    route: '/search?concern=heart-health'
  },
  {
    id: '6',
    name: 'Skin Care',
    icon: '✨',
    productCount: 276,
    route: '/search?concern=skin-care'
  },
  {
    id: '7',
    name: 'Respiratory',
    icon: '🫁',
    productCount: 87,
    route: '/search?concern=respiratory'
  },
  {
    id: '8',
    name: 'Weight Management',
    icon: '⚖️',
    productCount: 112,
    route: '/search?concern=weight'
  }
];

export default function HealthConcernsNav() {
  const isDark = useSelector(selectIsDark);
  const router = useRouter();

  const handleConcernPress = (route: string) => {
    router.push(route as any);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text variant="h4" weight="semibold">🎯 Shop by Health Need</Text>
        <TouchableOpacity onPress={() => router.push('/health-concerns' as any)}>
          <Text variant="body-sm" weight="medium" color="accent">See All</Text>
        </TouchableOpacity>
      </View>
      
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.concernsList}
      >
        {healthConcerns.map((concern) => (
          <TouchableOpacity
            key={concern.id}
            style={[
              styles.concernCard,
              { backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF' }
            ]}
            onPress={() => handleConcernPress(concern.route)}
            activeOpacity={0.7}
          >
            <View style={[
              styles.iconContainer,
              { backgroundColor: isDark ? '#2A2A2A' : colors.primary[50] }
            ]}>
              <Text style={styles.concernIcon}>{concern.icon}</Text>
            </View>
            
            <Text 
              variant="body-sm" 
              weight="semibold" 
              numberOfLines={2}
              style={styles.concernName}
            >
              {concern.name}
            </Text>
            
            <Text variant="caption" color="secondary" style={styles.productCount}>
              {concern.productCount} products
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  concernsList: {
    paddingRight: 16,
  },
  concernCard: {
    width: 90,
    height: 110,
    borderRadius: 12,
    padding: 8,
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  concernIcon: {
    fontSize: 20,
  },
  concernName: {
    textAlign: 'center',
    marginBottom: 4,
    minHeight: 32,
  },
  productCount: {
    textAlign: 'center',
    fontSize: 10,
  },
}); 