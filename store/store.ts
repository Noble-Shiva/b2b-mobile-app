import { configureStore, combineReducers } from '@reduxjs/toolkit';
import cartReducer from './cartSlice';
import wishlistReducer from './wishlistSlice';
import authReducer from './authSlice';
import themeReducer from './themeSlice';
import addressReducer from './addressSlice';
import ordersReducer from './ordersSlice';
import paymentReducer from './paymentSlice';
import notificationsReducer from './notificationsSlice';
import searchReducer from './searchSlice';
import supportReducer from './supportSlice';
import reviewsReducer from './reviewsSlice';
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';

const rootReducer = combineReducers({
  cart: cartReducer,
  wishlist: wishlistReducer,
  auth: authReducer,
  theme: themeReducer,
  address: addressReducer,
  orders: ordersReducer,
  payment: paymentReducer,
  notifications: notificationsReducer,
  search: searchReducer,
  support: supportReducer,
  reviews: reviewsReducer,
});

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['cart', 'wishlist', 'auth', 'theme', 'address', 'orders', 'payment', 'notifications', 'search', 'support', 'reviews'],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 