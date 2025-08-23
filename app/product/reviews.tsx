import { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, FlatList, TextInput, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Star, Send } from 'lucide-react-native';
import { useSelector, useDispatch } from 'react-redux';
import { selectIsDark } from '@/store/themeSlice';
import ProductReview from '@/components/product/ProductReview';
import { formatDate } from '@/utils/helpers';
import { Text, BackButton, Button } from '@/components/ui';
import { colors } from '@/utils/theme';
import {
  selectReviews,
  addReview,
} from '@/store/reviewsSlice';

export default function ReviewsScreen() {
  const router = useRouter();
  const isDark = useSelector(selectIsDark);
  const dispatch = useDispatch();
  const reviews = useSelector(selectReviews);

  const [newReview, setNewReview] = useState('');
  const [userRating, setUserRating] = useState(0);

  // For demo: if reviews is empty, add sample reviews
  useEffect(() => {
    if (reviews.length === 0) {
      [
        {
          id: '1',
          productId: 'demo',
          userId: 'user1',
          rating: 5,
          comment: 'Excellent product! The quality is outstanding and it arrived earlier than expected. Would definitely buy again.',
          createdAt: '2023-06-15T14:30:00Z',
        },
        {
          id: '2',
          productId: 'demo',
          userId: 'user2',
          rating: 4,
          comment: 'Very good product. The only reason I\'m not giving 5 stars is because the packaging was slightly damaged, but the product itself is great.',
          createdAt: '2023-06-10T11:15:00Z',
        },
        {
          id: '3',
          productId: 'demo',
          userId: 'user3',
          rating: 5,
          comment: 'Absolutely love it! Works exactly as described and the price is very reasonable.',
          createdAt: '2023-06-05T09:45:00Z',
        },
        {
          id: '4',
          productId: 'demo',
          userId: 'user4',
          rating: 3,
          comment: 'It\'s okay. Does the job but nothing special. Delivery was quick though.',
          createdAt: '2023-05-28T13:10:00Z',
        },
        {
          id: '5',
          productId: 'demo',
          userId: 'user5',
          rating: 5,
          comment: 'Perfect! Exactly what I was looking for. The customer service was also excellent when I had questions.',
          createdAt: '2023-05-20T16:20:00Z',
        }
      ].forEach(r => dispatch(addReview(r)));
    }
  }, [reviews, dispatch]);

  const averageRating = reviews.length > 0 ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length : 0;

  const handleSubmitReview = () => {
    if (userRating === 0) {
      Alert.alert('Rating Required', 'Please select a rating before submitting your review.');
      return;
    }
    if (!newReview.trim()) {
      Alert.alert('Review Required', 'Please write a review before submitting.');
      return;
    }
    dispatch(addReview({
      id: Date.now().toString(),
      productId: 'demo',
      userId: 'you',
      rating: userRating,
      comment: newReview.trim(),
      createdAt: new Date().toISOString(),
    }));
    setNewReview('');
    setUserRating(0);
    Alert.alert('Review Submitted', 'Thank you for your feedback!');
  };

  const renderStars = (rating: number, interactive = false) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <TouchableOpacity
          key={i}
          onPress={() => interactive && setUserRating(i)}
          disabled={!interactive}
        >
          <Star
            size={interactive ? 32 : 16}
            color="#FFB800"
            fill={i <= rating ? "#FFB800" : "none"}
            style={{ marginRight: interactive ? 8 : 2 }}
          />
        </TouchableOpacity>
      );
    }
    return stars;
  };

  return (
    <View style={[styles.container, { backgroundColor: isDark ? '#121212' : '#F8F8F8' }]}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      
      <View style={[
        styles.header, 
        { 
          backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF',
          borderBottomColor: isDark ? '#333333' : '#EEEEEE' 
        }
      ]}>
        <BackButton />
        <Text variant="h4" weight="semibold">Reviews</Text>
        <View style={styles.placeholder} />
      </View>
      
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={[
          styles.ratingOverview, 
          { 
            backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF',
            borderBottomColor: isDark ? '#333333' : '#EEEEEE' 
          }
        ]}>
          <View style={styles.averageRatingContainer}>
            <Text variant="h1" weight="bold" color="accent">
              {averageRating.toFixed(1)}
            </Text>
            <View style={styles.starsRow}>
              {renderStars(Math.round(averageRating))}
            </View>
            <Text variant="body-sm" color="secondary">
              Based on {reviews.length} reviews
            </Text>
          </View>
        </View>
        
        <View style={[
          styles.writeReviewContainer, 
          { 
            backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF',
            borderColor: isDark ? '#333333' : '#EEEEEE' 
          }
        ]}>
          <Text variant="h4" weight="semibold" style={styles.writeReviewTitle}>
            Write a Review
          </Text>
          
          <View style={styles.ratingSelector}>
            {renderStars(userRating, true)}
          </View>
          
          <View style={styles.reviewInputContainer}>
            <TextInput
              style={[
                styles.reviewInput,
                { 
                  backgroundColor: isDark ? '#2A2A2A' : '#F9F9F9',
                  borderColor: isDark ? '#444444' : '#E0E0E0',
                  color: isDark ? '#FFFFFF' : '#333333' 
                }
              ]}
              placeholder="Share your thoughts about this product..."
              placeholderTextColor={isDark ? '#888888' : '#999999'}
              value={newReview}
              onChangeText={setNewReview}
              multiline
              numberOfLines={4}
            />
            
            <Button
              variant="primary"
              disabled={!newReview.trim() || userRating === 0}
              rightIcon={<Send size={16} color="#FFFFFF" />}
              onPress={handleSubmitReview}
            >
              Submit
            </Button>
          </View>
        </View>
        
        <Text variant="h4" weight="semibold" style={styles.reviewsTitle}>
          Customer Reviews
        </Text>
        
        <FlatList
          data={reviews}
          renderItem={({ item }) => <ProductReview review={{
            ...item,
            userName: item.userId,
            date: item.createdAt,
          }} />}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.reviewsList}
          showsVerticalScrollIndicator={false}
          scrollEnabled={false} // Disable scrolling since we're inside a ScrollView
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 16,
    borderBottomWidth: 1,
  },
  placeholder: {
    width: 40,
  },
  ratingOverview: {
    padding: 16,
    borderBottomWidth: 1,
  },
  averageRatingContainer: {
    alignItems: 'center',
  },
  starsRow: {
    flexDirection: 'row',
    marginVertical: 8,
  },
  writeReviewContainer: {
    padding: 16,
    marginTop: 16,
    marginHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  writeReviewTitle: {
    marginBottom: 16,
  },
  ratingSelector: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 16,
  },
  reviewInputContainer: {
    marginBottom: 8,
  },
  reviewInput: {
    height: 120,
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    textAlignVertical: 'top',
    marginBottom: 16,
  },
  reviewsTitle: {
    marginTop: 24,
    marginBottom: 8,
    marginHorizontal: 16,
  },
  reviewsList: {
    padding: 16,
    paddingTop: 0,
  },
});