import { View, StyleSheet, Dimensions } from 'react-native';
import { useSelector } from 'react-redux';
import { selectIsDark } from '@/store/themeSlice';
import MultiBannerCarousel from './MultiBannerCarousel';
import ConcernsCarouselSkeleton from '@/components/skeletons/ConcernsCarouselSkeleton';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface ConcernItem {
  id: string;
  imageUrl: string;
  title: string;
}

const dummyConcerns: ConcernItem[] = [
  {
    id: '1',
    imageUrl: 'https://www.ayurcentralonline.com/wp-content/uploads/webp_images/1-9.webp',
    title: 'Skin Care'
  },
  {
    id: '2',
    imageUrl: 'https://www.ayurcentralonline.com/wp-content/uploads/webp_images/2-5.webp',
    title: 'Hair Care'
  },
  {
    id: '3',
    imageUrl: 'https://www.ayurcentralonline.com/wp-content/uploads/webp_images/5-1-3.webp',
    title: 'Oral Care'
  },
  {
    id: '4',
    imageUrl: 'https://www.ayurcentralonline.com/wp-content/uploads/webp_images/4-1-3.webp',
    title: 'Mom & Baby Care'
  },
  {
    id: '5',
    imageUrl: 'https://www.ayurcentralonline.com/wp-content/uploads/webp_images/3-2-1.webp',
    title: 'Boby Care'
  }
];

interface ConcernsCarouselProps {
  isLoading?: boolean;
}

export default function ConcernsCarousel({ isLoading = false }: ConcernsCarouselProps) {
  const isDark = useSelector(selectIsDark);

  if (isLoading) {
    return <ConcernsCarouselSkeleton />;
  }

  return (
    <View style={styles.container}>
      <MultiBannerCarousel
        title="Shop by Concerns"
        data={dummyConcerns}
        onItemPress={(item) => {
          // Handle item press
          console.log('Pressed concern:', item.title);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
  }
}); 