import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface PaymentMethod {
  id: string;
  type: string;
  cardNumber: string;
  expiryDate: string;
  isDefault?: boolean;
  cardHolder?: string;
}

interface PaymentState {
  paymentMethods: PaymentMethod[];
  selectedPaymentId: string | null;
}

const initialState: PaymentState = {
  paymentMethods: [],
  selectedPaymentId: null,
};

const paymentSlice = createSlice({
  name: 'payment',
  initialState,
  reducers: {
    addPaymentMethod(state, action: PayloadAction<PaymentMethod>) {
      state.paymentMethods.push(action.payload);
    },
    removePaymentMethod(state, action: PayloadAction<string>) {
      state.paymentMethods = state.paymentMethods.filter(pm => pm.id !== action.payload);
      if (state.selectedPaymentId === action.payload) {
        state.selectedPaymentId = null;
      }
    },
    updatePaymentMethod(state, action: PayloadAction<PaymentMethod>) {
      const idx = state.paymentMethods.findIndex(pm => pm.id === action.payload.id);
      if (idx !== -1) {
        state.paymentMethods[idx] = action.payload;
      }
    },
    selectPaymentMethod(state, action: PayloadAction<string>) {
      state.selectedPaymentId = action.payload;
    },
  },
});

export const { addPaymentMethod, removePaymentMethod, updatePaymentMethod, selectPaymentMethod } = paymentSlice.actions;

export const selectPaymentMethods = (state: { payment: PaymentState }) => state.payment.paymentMethods;
export const selectSelectedPaymentId = (state: { payment: PaymentState }) => state.payment.selectedPaymentId;

export default paymentSlice.reducer; 