import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';

export interface OrderBilling {
  first_name: string;
  last_name: string;
  company: string;
  address_1: string;
  address_2: string;
  city: string;
  state: string;
  postcode: string;
  country: string;
  email: string;
  phone: string;
}

export interface OrderShipping {
  first_name: string;
  last_name: string;
  company: string;
  address_1: string;
  address_2: string;
  city: string;
  state: string;
  postcode: string;
  country: string;
  phone: string;
}

export interface OrderItem {
  product_id: number;
  variation_id: number;
  name: string;
  quantity: number;
  subtotal: string;
  total: string;
  product_type: string;
}

export interface Order {
  order_id: number;
  status: string;
  currency: string;
  payment_method: string;
  total: string;
  shipping_total: string;
  discount_total: string;
  date_created: string;
  billing: OrderBilling;
  shipping: OrderShipping;
  items: OrderItem[];
}

interface OrdersState {
  orders: Order[];
  selectedOrderId: number | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: OrdersState = {
  orders: [],
  selectedOrderId: null,
  isLoading: false,
  error: null,
};

// Async thunk for fetching user orders
export const fetchUserOrders = createAsyncThunk(
  'orders/fetchUserOrders',
  async (userId: number, { rejectWithValue }) => {
    try {
      const { getUserOrders } = await import('../api/orders');
      return await getUserOrders(userId);
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch orders');
    }
  }
);

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    addOrder(state, action: PayloadAction<Order>) {
      state.orders.push(action.payload);
    },
    updateOrder(state, action: PayloadAction<Order>) {
      const idx = state.orders.findIndex(order => order.order_id === action.payload.order_id);
      if (idx !== -1) {
        state.orders[idx] = action.payload;
      }
    },
    removeOrder(state, action: PayloadAction<number>) {
      state.orders = state.orders.filter(order => order.order_id !== action.payload);
      if (state.selectedOrderId === action.payload) {
        state.selectedOrderId = null;
      }
    },
    selectOrder(state, action: PayloadAction<number>) {
      state.selectedOrderId = action.payload;
    },
    clearOrders(state) {
      state.orders = [];
      state.selectedOrderId = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserOrders.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUserOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders = action.payload;
        state.error = null;
      })
      .addCase(fetchUserOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { addOrder, updateOrder, removeOrder, selectOrder, clearOrders } = ordersSlice.actions;

export const selectOrders = (state: { orders: OrdersState }) => state.orders.orders;
export const selectSelectedOrderId = (state: { orders: OrdersState }) => state.orders.selectedOrderId;
export const selectOrdersLoading = (state: { orders: OrdersState }) => state.orders.isLoading;
export const selectOrdersError = (state: { orders: OrdersState }) => state.orders.error;

export default ordersSlice.reducer; 