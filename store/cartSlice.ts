import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  totalPrice?: number;
  originalPrice?: number;
  discount?: number;
  weight?: string;
  volume?: string;
  quantity_info?: string;
  category?: string;
  parentProductId?: string; // For variant tracking
  variantName?: string;    // For variant display
}

interface CartState {
  items: CartItem[];
}

const initialState: CartState = {
  items: [],
};

// Calculate tiered pricing based on quantity
const calculateTieredPrice = (basePrice: number, quantity: number) => {
  if (quantity >= 20) {
    return basePrice * 0.9; // 10% discount
  } else if (quantity >= 10) {
    return basePrice * 0.95; // 5% discount
  }
  return basePrice;
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart(state, action: PayloadAction<CartItem>) {
      const existing = state.items.find(item => item.id === action.payload.id);
      if (existing) {
        // If payload.quantity is provided and greater than current, set it
        if (action.payload.quantity && action.payload.quantity > existing.quantity) {
          existing.quantity = action.payload.quantity;
        } else {
          existing.quantity += 1;
        }
      } else {
        // Use payload.quantity if provided, else default to 1
        state.items.push({ ...action.payload, quantity: action.payload.quantity || 1 });
      }
    },
    removeFromCart(state, action: PayloadAction<string>) {
      state.items = state.items.filter(item => item.id !== action.payload);
    },
    updateQuantity(state, action: PayloadAction<{ id: string; quantity: number }>) {
      const item = state.items.find(item => item.id === action.payload.id);
      if (item) {
        if (action.payload.quantity <= 0) {
          state.items = state.items.filter(i => i.id !== item.id);
        } else {
          item.quantity = action.payload.quantity;
        }
      }
    },
    clearCart(state) {
      state.items = [];
    },
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer;

// Selectors
export const selectCartItems = (state: { cart: CartState }) => state.cart.items;
export const selectTotalItems = (state: { cart: CartState }) =>
  state.cart.items.reduce((sum, item) => sum + item.quantity, 0);
export const selectSubtotal = (state: { cart: CartState }) =>
  state.cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
export const selectDiscount = (state: { cart: CartState }) =>
  state.cart.items.reduce((sum, item) => {
    if (!item.discount) return sum;
    return sum + (item.price * item.discount / 100) * item.quantity;
  }, 0);
export const selectTotal = (state: { cart: CartState }) =>
  selectSubtotal(state) - selectDiscount(state);

// New selector for tiered pricing total
export const selectTieredTotal = (state: { cart: CartState }) =>
  state.cart.items.reduce((total, item) => {
    const tieredPrice = calculateTieredPrice(item.price, item.quantity);
    return total + (tieredPrice * item.quantity);
  }, 0);

// Selector for total savings from original prices and tiered pricing
export const selectTotalSavings = (state: { cart: CartState }) => {
  const originalTotal = state.cart.items.reduce((total, item) => {
    const originalPrice = item.originalPrice || item.price * 1.25; // Fallback if no original price
    return total + (originalPrice * item.quantity);
  }, 0);
  const tieredTotal = selectTieredTotal(state);
  return originalTotal - tieredTotal;
}; 