import React from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useSelector } from 'react-redux';
import { useRouter } from 'expo-router';
import { selectIsDark } from '@/store/themeSlice';
import { Text } from '@/components/ui';
import { colors } from '@/utils/theme';

interface SpecialOffer {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  icon: string;
  backgroundColor: string;
  textColor: string;
  route?: string;
}

const specialOffers: SpecialOffer[] = [
  {
    id: '1',
    title: 'Bulk Deal',
    subtitle: '50+ units',
    description: 'Extra 15% off',
    icon: '📦',
    backgroundColor: '#E3F2FD',
    textColor: '#1976D2',
    route: '/offers/bulk'
  },
  {
    id: '2',
    title: 'First Order',
    subtitle: 'New customers',
    description: 'Extra 5% off',
    icon: '🎉',
    backgroundColor: '#E8F5E9',
    textColor: '#388E3C',
    route: '/offers/first-order'
  },
  {
    id: '3',
    title: 'Fast Moving',
    subtitle: 'Stock up now',
    description: 'Before festive',
    icon: '⚡',
    backgroundColor: '#FFF3E0',
    textColor: '#F57C00',
    route: '/offers/fast-moving'
  },
  {
    id: '4',
    title: 'Pre-Order',
    subtitle: 'Coming soon',
    description: '10% early bird',
    icon: '🚀',
    backgroundColor: '#F3E5F5',
    textColor: '#7B1FA2',
    route: '/offers/pre-order'
  }
];

export default function SpecialOffersGrid() {
  const isDark = useSelector(selectIsDark);
  const router = useRouter();

  const handleOfferPress = (route?: string) => {
    if (route) {
      router.push(route as any);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text variant="h4" weight="semibold">💰 Limited Time Deals</Text>
        <TouchableOpacity onPress={() => router.push('/offers' as any)}>
          <Text variant="body-sm" weight="medium" color="accent">See All</Text>
        </TouchableOpacity>
      </View>
      
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.offersList}
      >
        {specialOffers.map((offer) => (
          <TouchableOpacity
            key={offer.id}
            style={[
              styles.offerCard,
              { backgroundColor: isDark ? '#2A2A2A' : offer.backgroundColor }
            ]}
            onPress={() => handleOfferPress(offer.route)}
            activeOpacity={0.7}
          >
            <View style={styles.offerIcon}>
              <Text style={styles.iconText}>{offer.icon}</Text>
            </View>
            
            <View style={styles.offerContent}>
                             <Text 
                 variant="body" 
                 weight="bold" 
                 style={{
                   ...styles.offerTitle,
                   color: isDark ? '#FFFFFF' : offer.textColor
                 }}
               >
                {offer.title}
              </Text>
              
                             <Text 
                 variant="caption" 
                 style={{
                   ...styles.offerSubtitle,
                   color: isDark ? '#CCCCCC' : offer.textColor
                 }}
               >
                 {offer.subtitle}
               </Text>
               
               <Text 
                 variant="body-sm" 
                 weight="semibold"
                 style={{
                   ...styles.offerDescription,
                   color: isDark ? '#FFFFFF' : offer.textColor
                 }}
               >
                 {offer.description}
               </Text>
            </View>
            
            <View style={[
              styles.arrow,
              { backgroundColor: isDark ? '#FFFFFF' : offer.textColor }
            ]}>
                             <Text style={{
                 ...styles.arrowText,
                 color: isDark ? '#2A2A2A' : '#FFFFFF'
               }}>
                 →
               </Text>
            </View>
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
  offersList: {
    paddingRight: 16,
  },
  offerCard: {
    width: 160,
    height: 120,
    borderRadius: 12,
    padding: 12,
    marginRight: 12,
    justifyContent: 'space-between',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  offerIcon: {
    alignSelf: 'flex-start',
  },
  iconText: {
    fontSize: 24,
  },
  offerContent: {
    flex: 1,
    justifyContent: 'center',
  },
  offerTitle: {
    marginBottom: 2,
  },
  offerSubtitle: {
    marginBottom: 4,
    fontSize: 11,
  },
  offerDescription: {
    fontSize: 13,
  },
  arrow: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  arrowText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
}); 