import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useSelector } from 'react-redux';
import { useRouter } from 'expo-router';
import { selectIsDark } from '@/store/themeSlice';
import { Text } from '@/components/ui';
import { Package, BookOpen, RotateCcw } from 'lucide-react-native';

interface QuickAction {
  id: string;
  title: string;
  icon: string;
  iconColor: string;
  bgColor: string;
  route: string;
  description: string;
}

const quickActions: QuickAction[] = [
  {
    id: '1',
    title: 'Instant Re-Order',
    icon: 'rotate-ccw',
    iconColor: '#FF6B35',
    bgColor: '#FFF3E0',
    route: '/reorder',
    description: 'Quick reorder favorites'
  },
  {
    id: '2',
    title: 'Previous Orders',
    icon: 'package',
    iconColor: '#4CAF50',
    bgColor: '#E8F5E9',
    route: '/profile/orders',
    description: 'View order history'
  },
  {
    id: '3',
    title: 'Browse Catalog',
    icon: 'book-open',
    iconColor: '#9C27B0',
    bgColor: '#F3E5F5',
    route: '/catalog',
    description: 'Explore products'
  }
];

export default function QuickActionPanel() {
  const isDark = useSelector(selectIsDark);
  const router = useRouter();

  const handleActionPress = (route: string) => {
    router.push(route as any);
  };

  const getIcon = (iconName: string, color: string) => {
    const iconProps = { size: 24, color };
    
    switch (iconName) {
      case 'rotate-ccw':
        return <RotateCcw {...iconProps} />;
      case 'package':
        return <Package {...iconProps} />;
      case 'book-open':
        return <BookOpen {...iconProps} />;
      default:
        return <Package {...iconProps} />;
    }
  };

    return (
    <View style={[styles.container, { backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF' }]}>
      <View style={styles.header}>
        <Text variant="h4" weight="semibold">Quick Actions</Text>
      </View>
      
      <View style={styles.actionsGrid}>
        {quickActions.map((action) => (
          <TouchableOpacity
            key={action.id}
            style={[
              styles.actionButton,
              { backgroundColor: isDark ? '#2A2A2A' : '#F8F9FA' }
            ]}
            onPress={() => handleActionPress(action.route)}
            activeOpacity={0.7}
          >
            <View style={[styles.iconContainer, { backgroundColor: action.bgColor }]}>
              {getIcon(action.icon, action.iconColor)}
            </View>
            <Text variant="body-sm" weight="semibold" style={styles.actionTitle}>
              {action.title}
            </Text>
            <Text variant="caption" color="secondary" style={styles.actionDescription}>
              {action.description}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 12,
    marginHorizontal: 16,
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  header: {
    marginBottom: 16,
  },
  actionsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 8,
    borderRadius: 12,
    marginHorizontal: 4,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  actionTitle: {
    textAlign: 'center',
    marginBottom: 4,
    lineHeight: 16,
  },
  actionDescription: {
    textAlign: 'center',
    lineHeight: 12,
  },
}); 