import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Review {
  id: string;
  productId: string;
  userId: string;
  rating: number;
  comment: string;
  createdAt: string;
}

interface ReviewsState {
  reviews: Review[];
}

const initialState: ReviewsState = {
  reviews: [],
};

const reviewsSlice = createSlice({
  name: 'reviews',
  initialState,
  reducers: {
    addReview(state, action: PayloadAction<Review>) {
      state.reviews.push(action.payload);
    },
    updateReview(state, action: PayloadAction<Review>) {
      const idx = state.reviews.findIndex(r => r.id === action.payload.id);
      if (idx !== -1) {
        state.reviews[idx] = action.payload;
      }
    },
    removeReview(state, action: PayloadAction<string>) {
      state.reviews = state.reviews.filter(r => r.id !== action.payload);
    },
  },
});

export const { addReview, updateReview, removeReview } = reviewsSlice.actions;

export const selectReviews = (state: { reviews: ReviewsState }) => state.reviews.reviews;
export const selectReviewsByProduct = (productId: string) => (state: { reviews: ReviewsState }) => state.reviews.reviews.filter(r => r.productId === productId);

export default reviewsSlice.reducer; 