import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import authApi, { User, SendOtpRequest, VerifyOtpRequest, RegisterUserRequest, SavedAddress, EditProfileRequest, FetchUserDetailsResponse } from '@/api/auth';
import { addAddress } from './addressSlice';

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  otpSent: boolean;
  otpReference: string | null;
  phone: string | null;
  userType: 'new_user' | 'existing_user' | null;
  tempOtp: string | null; // For storing OTP temporarily during registration flow
}

const initialState: AuthState = {
  user: null,
  token: null,
  isLoading: false,
  error: null,
  otpSent: false,
  otpReference: null,
  phone: null,
  userType: null,
  tempOtp: null,
};

// Simplified token helpers (not needed for current implementation)
export const getAuthToken = async (): Promise<string | null> => {
  return null; // Simplified - not using persistent tokens for now
};

// Send OTP thunk
export const sendOtp = createAsyncThunk(
  'auth/sendOtp',
  async (data: SendOtpRequest, { rejectWithValue }) => {
    try {
      const response = await authApi.sendOtp(data);
      console.log('OTP Response:', response);
      console.log('Response status:', response.status);
      console.log('Response success:', response.success);
      console.log('Response otp:', response.otp);
      console.log('Response otp_reference:', response.otp_reference);
      
      // Check if we got the new format response
      if (response.status && response.status === 'Otp Sent') {
        // New format response
        console.log('Using new format - storing OTP reference:', response.otp);
        return {
          phone: data.phone,
          otpReference: response.otp, // Store the OTP as the reference
          message: 'OTP sent successfully',
          success: true
        };
      } else if (response.success) {
        // Old format response - for backward compatibility
        console.log('Using old format - storing OTP reference:', response.otp_reference);
        return {
          phone: data.phone,
          otpReference: response.otp_reference,
          message: response.message
        };
      } else {
        // Error case
        console.log('OTP send failed with response:', response);
        return rejectWithValue(response.message || 'Failed to send OTP');
      }
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('An unknown error occurred');
    }
  }
);

// Verify OTP thunk
export const verifyOtp = createAsyncThunk(
  'auth/verifyOtp',
  async (data: VerifyOtpRequest, { rejectWithValue, dispatch }) => {
    try {
      const response = await authApi.verifyOtp(data);
      console.log('OTP verification response:', response);
      
      // Check for successful OTP verification
      if (response.status === 'otp_verified') {
        const userType = response.user_type || 'existing_user';
        const user = response.user_details || response.user || null;
        
        console.log('OTP verified successfully - User type:', userType);
        
        // Import saved addresses (simplified without UUID dependency)
        if (user && user.saved_addresses && user.saved_addresses.length > 0) {
          console.log('Importing', user.saved_addresses.length, 'saved addresses');
          
          user.saved_addresses.forEach((address, index) => {
            const addressWithId = {
              id: `address_${Date.now()}_${index}`,
              name: address.name,
              business_name: address.name || 'Business',
              address: address.address,
              city: address.city,
              state: address.state,
              pincode: address.pincode,
              country: address.country || 'India',
              email: address.email,
              mobile: address.mobile,
              isDefault: index === 0
            };
            dispatch(addAddress(addressWithId));
          });
        }
        
        return {
          user_type: userType,
          user: user,
          success: true,
          tempOtp: userType === 'new_user' ? data.otp : undefined
        };
      }
      
      // Handle legacy response formats
      if (response.success) {
        return {
          user_type: response.user_type || 'new_user',
          user: response.user || null,
          success: true,
          tempOtp: response.user_type === 'new_user' ? data.otp : undefined
        };
      }
      
      // Handle failure
      return rejectWithValue(response.message || 'OTP verification failed');
    } catch (error) {
      console.error('OTP verification error:', error);
      return rejectWithValue(error instanceof Error ? error.message : 'Network error occurred');
    }
  }
);

// Register user thunk
export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (data: { name: string; email: string; phone: string }, { rejectWithValue, getState }) => {
    try {
      const state = getState() as { auth: AuthState };
      const { tempOtp } = state.auth;
      
      if (!data.phone || !tempOtp) {
        return rejectWithValue('Missing required data for registration');
      }
      
      const registerData: RegisterUserRequest = {
        phone: data.phone,
        name: data.name,
        email: data.email,
        otp: tempOtp
      };
      
      const response = await authApi.registerUser(registerData);
      
      if (!response.success) {
        return rejectWithValue(response.message || 'Registration failed');
      }
      
      return {
        user: response.user,
        token: 'authenticated'
      };
    } catch (error) {
      console.error('Registration error:', error);
      return rejectWithValue(error instanceof Error ? error.message : 'Registration failed');
    }
  }
);

// Edit user profile thunk
export const editProfile = createAsyncThunk(
  'auth/editProfile',
  async (data: EditProfileRequest, { rejectWithValue }) => {
    try {
      const response = await authApi.editProfile(data);
      console.log('Edit profile response:', response);
      
      if (!response.success) {
        return rejectWithValue(response.message || 'Failed to update profile');
      }
      
      return {
        user: response.user,
        success: true,
        message: response.message
      };
    } catch (error) {
      console.error('Edit profile error:', error);
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to update profile');
    }
  }
);

// Fetch user details thunk
export const fetchUserDetails = createAsyncThunk(
  'auth/fetchUserDetails',
  async (userId: string | number, { rejectWithValue, dispatch }) => {
    try {
      const response = await authApi.fetchUserDetails(userId);
      console.log('Fetch user details response:', response);
      
      if (!response.success || !response.user) {
        return rejectWithValue(response.message || 'Failed to fetch user details');
      }
      
      // Import addresses if they exist
      if (response.user.saved_addresses && response.user.saved_addresses.length > 0) {
        response.user.saved_addresses.forEach((address, index) => {
          const addressWithId = {
            id: `address_${Date.now()}_${index}`,
            name: address.name,
            business_name: address.name || 'Business',
            address: address.address,
            city: address.city,
            state: address.state,
            pincode: address.pincode,
            country: address.country || 'India',
            email: address.email,
            mobile: address.mobile,
            isDefault: index === 0
          };
          dispatch(addAddress(addressWithId));
        });
      }
      
      return {
        user: response.user,
        success: true,
        message: response.message
      };
    } catch (error) {
      console.error('Fetch user details error:', error);
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch user details');
    }
  }
);

// Simplified - no persistent session for now
export const restoreAuthSession = createAsyncThunk(
  'auth/restoreSession',
  async (_, { rejectWithValue }) => {
    // Simplified implementation - no persistent sessions
    return rejectWithValue('No persistent session available');
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    signOut(state) {
      state.user = null;
      state.token = null;
      state.error = null;
      state.otpSent = false;
      state.otpReference = null;
      state.phone = null;
      state.userType = null;
      state.tempOtp = null;
    },
    clearError(state) {
      state.error = null;
    },
    resetOtpState(state) {
      console.log('Resetting OTP state completely');
      state.otpSent = false;
      state.otpReference = null;
      state.error = null;
    },
    resetOtpSentFlag(state) {
      // Only reset the otpSent flag, preserve otpReference for verification screen
      console.log('Resetting OTP sent flag only, preserving otpReference');
      state.otpSent = false;
    },
    resetAuthState(state) {
      return initialState;
    }
  },
  extraReducers: builder => {
    builder
      // Send OTP
      .addCase(sendOtp.pending, state => {
        state.isLoading = true;
        state.error = null;
        state.otpSent = false;
        state.userType = null; // Reset userType to prevent premature navigation
      })
      .addCase(sendOtp.fulfilled, (state, action) => {
        console.log('OTP send fulfilled:', action.payload);
        state.isLoading = false;
        // Explicitly set otpSent to true to trigger navigation
        state.otpSent = true;
        state.phone = action.payload.phone;
        state.otpReference = action.payload.otpReference || null;
        state.error = null;
      })
      .addCase(sendOtp.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        state.otpSent = false;
      })
      
      // Verify OTP
      .addCase(verifyOtp.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(verifyOtp.fulfilled, (state, action) => {
        state.isLoading = false;
        
        const userTypeValue = action.payload.user_type;
        state.userType = userTypeValue;
        
        // Store OTP for new user registration
        state.tempOtp = action.payload.tempOtp || null;
        
        // If existing user, set user data and mark as authenticated
        if (userTypeValue === 'existing_user' && action.payload.user) {
          state.user = action.payload.user;
          state.token = 'authenticated';
          console.log('User authenticated successfully');
        }
        
        // Clear OTP reference after successful verification for security
        console.log('Clearing OTP reference after successful verification');
        state.otpReference = null;
        state.error = null;
      })
      .addCase(verifyOtp.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Register User
      .addCase(registerUser.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.userType = 'existing_user';
        state.tempOtp = null; // Clear temporary OTP
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Edit Profile
      .addCase(editProfile.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(editProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.error = null;
        console.log('Profile updated successfully');
      })
      .addCase(editProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Fetch User Details
      .addCase(fetchUserDetails.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUserDetails.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.error = null;
        console.log('User details fetched successfully');
      })
      .addCase(fetchUserDetails.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Simplified - no restore session logic needed
  },
});

export const { signOut, clearError, resetOtpState, resetOtpSentFlag, resetAuthState } = authSlice.actions;
export default authSlice.reducer;

// Selectors
export const selectUser = (state: { auth: AuthState }) => state.auth.user;
export const selectToken = (state: { auth: AuthState }) => state.auth.token;
export const selectIsLoading = (state: { auth: AuthState }) => state.auth.isLoading;
export const selectAuthError = (state: { auth: AuthState }) => state.auth.error;
export const selectOtpSent = (state: { auth: AuthState }) => state.auth.otpSent;
export const selectPhone = (state: { auth: AuthState }) => state.auth.phone;
export const selectUserType = (state: { auth: AuthState }) => state.auth.userType;
export const selectOtpReference = (state: { auth: AuthState }) => state.auth.otpReference;