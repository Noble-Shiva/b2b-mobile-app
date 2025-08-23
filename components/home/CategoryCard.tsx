import { View, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useSelector } from 'react-redux';
import { selectIsDark } from '@/store/themeSlice';
import { colors } from '@/utils/theme';

import { Text, Card } from '@/components/ui';

interface Category {
  id: string;
  name: string;
  icon: string;
  image: string;
  slug: string;
}

interface CategoryCardProps {
  category: Category;
  onPress: () => void;
}

export default function CategoryCard({ category, onPress }: CategoryCardProps) {
  const isDark = useSelector(selectIsDark);
  
  return (
    <TouchableOpacity 
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Card style={styles.container}>
        {category.image ? (
          <View style={styles.imageContainer}>
            <Image 
              source={{ uri: category.image }} 
              style={styles.image} 
              resizeMode="cover"
            />
            <View style={[styles.iconOverlay, { backgroundColor: isDark ? 'rgba(0,0,0,0.4)' : 'rgba(255,255,255,0.7)' }]}>
              <Text style={styles.icon}>{category.icon}</Text>
            </View>
          </View>
        ) : (
          <View style={[
            styles.iconContainer, 
            { backgroundColor: isDark ? colors.primary[900] : colors.primary[50] }
          ]}>
            <Text style={styles.icon}>{category.icon}</Text>
          </View>
        )}
        <Text 
          variant="body-sm" 
          weight="medium" 
          style={styles.name}
          numberOfLines={1}
        >
          {category.name}
        </Text>
      </Card>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 100, // Slightly wider to better display images
    height: 120, // Slightly taller to better display images
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    padding: 8,
    overflow: 'hidden',
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  imageContainer: {
    width: 80,
    height: 80,
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 8,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
  iconOverlay: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    fontSize: 18,
  },
  name: {
    textAlign: 'center',
    width: '100%',
  },
});