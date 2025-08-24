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
  // Scheme related fields
  schemeType?: string;     // e.g., "4+1", "5+1"
  schemeThreshold?: number; // Minimum cart total to activate scheme
  schemeApplied?: boolean;  // Whether scheme is currently active
  schemeQuantity?: number;  // How many free items from scheme
  schemeSavings?: number;   // Total savings from scheme
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

// Calculate scheme benefits
const calculateSchemeBenefits = (cartTotal: number, schemeThreshold: number, schemeType: string) => {
  if (cartTotal < schemeThreshold) {
    return { applied: false, quantity: 0, savings: 0 };
  }
  
  // Parse scheme type (e.g., "4+1" means for every 4 items, get 1 free)
  const schemeMatch = schemeType.match(/(\d+)\+(\d+)/);
  if (!schemeMatch) {
    return { applied: false, quantity: 0, savings: 0 };
  }
  
  const buyQuantity = parseInt(schemeMatch[1]);
  const freeQuantity = parseInt(schemeMatch[2]);
  
  // Calculate how many scheme sets can be applied
  const totalItems = Math.floor(cartTotal / (schemeThreshold / 4)); // Assuming 4 items = threshold
  const schemeSets = Math.floor(totalItems / buyQuantity);
  
  return {
    applied: schemeSets > 0,
    quantity: schemeSets * freeQuantity,
    savings: schemeSets * freeQuantity * 100, // Assuming average item price of 100
  };
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
    applySchemes(state, action: PayloadAction<{ schemeType: string; schemeThreshold: number }>) {
      const { schemeType, schemeThreshold } = action.payload;
      const cartTotal = state.items.reduce((total, item) => total + (item.price * item.quantity), 0);
      
      if (cartTotal >= schemeThreshold) {
        // Parse scheme type (e.g., "4+1")
        const schemeMatch = schemeType.match(/(\d+)\+(\d+)/);
        if (schemeMatch) {
          const buyQuantity = parseInt(schemeMatch[1]);
          const freeQuantity = parseInt(schemeMatch[2]);
          
          // Calculate scheme benefits per individual product
          state.items.forEach(item => {
            const schemeSets = Math.floor(item.quantity / buyQuantity);
            const additionalProducts = schemeSets * freeQuantity;
            
            // Update item with scheme information
            item.schemeType = schemeType;
            item.schemeThreshold = schemeThreshold;
            item.schemeApplied = schemeSets > 0;
            item.schemeQuantity = additionalProducts;
            item.schemeSavings = additionalProducts * item.price; // Full price savings for free items
          });
        }
      } else {
        // Remove scheme information if threshold not met
        state.items.forEach(item => {
          item.schemeApplied = false;
          item.schemeQuantity = 0;
          item.schemeSavings = 0;
        });
      }
    },
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart, applySchemes } = cartSlice.actions;
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

// Scheme-related selectors
export const selectSchemeInfo = (state: { cart: CartState }) => {
  const items = state.cart.items;
  if (items.length === 0) return null;
  
  const firstItem = items[0];
  if (!firstItem.schemeType || !firstItem.schemeApplied) return null;
  
  return {
    schemeType: firstItem.schemeType,
    schemeThreshold: firstItem.schemeThreshold,
    schemeQuantity: firstItem.schemeQuantity,
    schemeSavings: firstItem.schemeSavings,
  };
};

export const selectTotalWithSchemes = (state: { cart: CartState }) => {
  const tieredTotal = selectTieredTotal(state);
  const schemeInfo = selectSchemeInfo(state);
  
  if (schemeInfo && schemeInfo.schemeSavings) {
    return tieredTotal - schemeInfo.schemeSavings;
  }
  
  return tieredTotal;
}; 