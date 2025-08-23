import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Address {
  id?: string; // Added for our internal use
  name: string; // Contact person name
  business_name: string; // Business name
  address: string;
  city: string;
  state: string;
  pincode: string; // API uses pincode instead of zipCode
  country: string;
  email: string;
  mobile: string; // API uses mobile instead of phone
  isDefault?: boolean; // Added for our internal use
}

interface AddressState {
  addresses: Address[];
  selectedAddressId: string | null;
}

const initialState: AddressState = {
  addresses: [],
  selectedAddressId: null,
};

const addressSlice = createSlice({
  name: 'address',
  initialState,
  reducers: {
    addAddress(state, action: PayloadAction<Address>) {
      state.addresses.push(action.payload);
    },
    removeAddress(state, action: PayloadAction<string>) {
      state.addresses = state.addresses.filter(addr => addr.id !== action.payload);
      if (state.selectedAddressId === action.payload) {
        state.selectedAddressId = null;
      }
    },
    updateAddress(state, action: PayloadAction<Address>) {
      const idx = state.addresses.findIndex(addr => addr.id === action.payload.id);
      if (idx !== -1) {
        state.addresses[idx] = action.payload;
      }
    },
    selectAddress(state, action: PayloadAction<string>) {
      state.selectedAddressId = action.payload;
    },
  },
});

export const { addAddress, removeAddress, updateAddress, selectAddress } = addressSlice.actions;

export const selectAddresses = (state: { address: AddressState }) => state.address.addresses;
export const selectSelectedAddressId = (state: { address: AddressState }) => state.address.selectedAddressId;

export default addressSlice.reducer; 