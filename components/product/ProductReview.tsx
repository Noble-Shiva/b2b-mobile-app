import { View, Text, StyleSheet, useColorScheme } from 'react-native';
import { Star } from 'lucide-react-native';
import { formatDate } from '@/utils/helpers';

interface ProductReviewProps {
  review: {
    id: string;
    userName: string;
    rating: number;
    comment: string;
    date: string;
  };
}

export default function ProductReview({ review }: ProductReviewProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  
  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Star 
          key={i}
          size={16} 
          color="#FFB800" 
          fill={i <= rating ? "#FFB800" : "none"} 
          style={{ marginRight: 2 }}
        />
      );
    }
    return stars;
  };
  
  return (
    <View style={[styles.container, isDark && styles.containerDark]}>
      <View style={styles.header}>
        <Text style={[styles.userName, isDark && styles.userNameDark]}>
          {review.userName}
        </Text>
        <Text style={styles.date}>
          {formatDate(review.date)}
        </Text>
      </View>
      
      <View style={styles.ratingContainer}>
        {renderStars(review.rating)}
      </View>
      
      <Text style={[styles.comment, isDark && styles.commentDark]}>
        {review.comment}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  containerDark: {
    backgroundColor: '#1E1E1E',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  userName: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: '#333333',
  },
  userNameDark: {
    color: '#FFFFFF',
  },
  date: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: '#999999',
  },
  ratingContainer: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  comment: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#666666',
    lineHeight: 20,
  },
  commentDark: {
    color: '#BBBBBB',
  },
});