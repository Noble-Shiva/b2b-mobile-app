import React from 'react';
import { 
  View, 
  StyleSheet, 
  Image, 
  Dimensions, 
  TouchableOpacity,
  FlatList,
  ImageBackground
} from 'react-native';
import { Text } from '@/components/ui';
import { selectIsDark } from '@/store/themeSlice';
import { useSelector } from 'react-redux';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 64) / 2; // Two cards with spacing
// Calculate height based on the sample image's aspect ratio (approximately 4:3)
const CARD_HEIGHT = (CARD_WIDTH * 4) / 3;

interface BannerItem {
  id: string;
  imageUrl: string;
  title: string;
}

interface MultiBannerProps {
  title: string;
  data: BannerItem[];
  onItemPress?: (item: BannerItem) => void;
}

export default function MultiBanner({ title, data, onItemPress }: MultiBannerProps) {
  const isDark = useSelector(selectIsDark);
  
  const renderItem = ({ item }: { item: BannerItem }) => {
    return (
      <TouchableOpacity 
        style={styles.bannerItem}
        activeOpacity={0.8}
        onPress={() => onItemPress?.(item)}
      >
        <ImageBackground 
          source={{ uri: item.imageUrl }}
          style={styles.bannerImage}
          imageStyle={styles.bannerImageStyle}
          resizeMode="contain"
        />
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text variant="h4" weight="semibold">{title}</Text>
      </View>
      
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 4,
  },
  header: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  listContainer: {
    paddingLeft: 16,
    paddingRight: 8,
  },
  bannerItem: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    marginRight: 8,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#F5F5F5', // Add background color while image loads
  },
  bannerImage: {
    width: '100%',
    height: '100%',
  },
  bannerImageStyle: {
    borderRadius: 12,
  },
});
