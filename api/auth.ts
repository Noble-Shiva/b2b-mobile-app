import axios from 'axios';
import { API_CONFIG } from './config';

// Use centralized config
const API_BASE_URL = API_CONFIG.baseUrl;
const CLIENT_ID = API_CONFIG.clientId;

// Types
export interface SavedAddress {
  name: string;
  last_name: string;
  address: string;
  city: string;
  pincode: string;
  country: string;
  state: string;
  email: string;
  mobile: string;
  is_default?: boolean;
}

export interface User {
  id: string | number;
  name?: string;
  email?: string;
  phone?: string;
  first_name?: string;
  last_name?: string;
  username?: string;
  billing_address?: string;
  shipping_address?: string;
  registration_date?: string;
  roles?: string[];
  saved_addresses?: SavedAddress[];
}

export interface SendOtpRequest {
  phone: string;
}

export interface SendOtpResponse {
  otp: string;
  status: string;
  // Keep these for backward compatibility
  success?: boolean;
  message?: string;
  otp_reference?: string;
}

export interface VerifyOtpRequest {
  phone: string;
  otp: string;
  otp_reference?: string;
}

export interface VerifyOtpResponse {
  // New API response format with otp_verified status
  status?: string; // 'otp_verified', 'success', or other values
  user_details?: User; // The API returns user_details instead of user for existing users
  user?: User; // Keep for backward compatibility
  token?: string;
  user_type?: 'new_user' | 'existing_user';
  
  // Old format for backward compatibility
  success?: boolean;
  message?: string;
}

export interface RegisterUserRequest {
  phone: string;
  name: string;
  email: string;
  otp: string;
  otp_reference?: string;
}

export interface RegisterUserResponse {
  success: boolean;
  message: string;
  token: string;
  user: User;
}

export interface EditProfileRequest {
  user_id: any;
  display_name: string;
  phone_number: string;
  email: string;
}

export interface EditProfileResponse {
  success: boolean;
  message: string;
  user: User;
}

export interface FetchUserDetailsResponse {
  success: boolean;
  message?: string;
  user?: User;
  data?: User; // API might return user data in different field
}

// Create authentication API service
const authApi = {
  // Send OTP to phone number
  sendOtp: async (data: SendOtpRequest): Promise<SendOtpResponse> => {
    try {
      // Append client_id to the request data
      const requestData = {
        ...data,
        client_id: CLIENT_ID,
      };
      
      console.log('Sending OTP request to:', `${API_BASE_URL}/otp/send`);
      console.log('With data:', requestData);
      
      const response = await axios.post<SendOtpResponse>(
        `${API_BASE_URL}/otp/send`,
        requestData
      );
      console.log('OTP API response:', response.data);
      return response.data;
    } catch (error) {
      console.error('OTP API error:', error);
      if (axios.isAxiosError(error)) {
        console.error('Response data:', error.response?.data);
        const errorMessage = error.response?.data?.message || 'Failed to send OTP. Please try again.';
        throw new Error(errorMessage);
      }
      throw error;
    }
  },

  // Verify OTP
  verifyOtp: async (data: VerifyOtpRequest): Promise<VerifyOtpResponse> => {
    try {
      // Log the request data for debugging
      console.log('Verifying OTP with data:', data);
      
      // Prepare request data - ensure only phone and OTP are sent, plus client_id
      const requestData = {
        phone: data.phone,
        otp: data.otp,
        client_id: CLIENT_ID,
      };
      
      console.log('Sending OTP verification request to:', `${API_BASE_URL}/otp/verify`);
      console.log('With request body:', requestData);
      
      const response = await axios.post<VerifyOtpResponse>(
        `${API_BASE_URL}/otp/verify`,
        requestData
      );
      
      console.log('OTP verification API response:', response.data);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.message || 'Failed to verify OTP. Please try again.';
        throw new Error(errorMessage);
      }
      throw error;
    }
  },

  // Register new user
  registerUser: async (data: RegisterUserRequest): Promise<RegisterUserResponse> => {
    try {
      // Prepare simplified request data as specified in requirements
      const requestData = {
        phone: data.phone,
        username: data.name, // Using name as username as per requirements
        email: data.email,
        client_id: CLIENT_ID,
      };
      
      console.log('Registering user with data:', requestData);
      console.log('Registration endpoint:', `${API_BASE_URL}/user/register`);
      
      const response = await axios.post<RegisterUserResponse>(
        `${API_BASE_URL}/user/register`,
        requestData
      );
      
      console.log('Registration API response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Registration API error:', error);
      if (axios.isAxiosError(error)) {
        console.error('Response data:', error.response?.data);
        const errorMessage = error.response?.data?.message || 'Failed to update profile. Please try again.';
        throw new Error(errorMessage);
      }
      throw error;
    }
  },

  // Verify auth token - useful for session validation
  verifyToken: async (token: string): Promise<{ valid: boolean; user?: User }> => {
    try {
      // You may need to adjust this endpoint based on your actual API
      const response = await axios.post<{ valid: boolean; user?: User }>(
        `${API_BASE_URL}/token/verify`, 
        { 
          token,
          client_id: CLIENT_ID,
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      return response.data;
    } catch (error) {
      return { valid: false };
    }
  },

  // Edit user profile
  editProfile: async (data: EditProfileRequest): Promise<EditProfileResponse> => {
    try {
      // Append client_id to the request data
      const requestData = {
        ...data,
        client_id: CLIENT_ID,
      };
      
      console.log('Updating profile with data:', requestData);
      console.log('Edit profile endpoint:', `${API_BASE_URL}/edit-profile`);
      
      const response = await axios.post<EditProfileResponse>(
        `${API_BASE_URL}/edit-profile`,
        requestData
      );
      
      console.log('Edit profile API response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Edit profile API error:', error);
      if (axios.isAxiosError(error)) {
        console.error('Response data:', error.response?.data);
        const errorMessage = error.response?.data?.message || 'Failed to update profile. Please try again.';
        throw new Error(errorMessage);
      }
      throw error;
    }
  },

  // Fetch user details by user_id
  fetchUserDetails: async (userId: string | number): Promise<FetchUserDetailsResponse> => {
    try {
      console.log('Fetching user details for user_id:', userId);
      const endpoint = `https://b2b.ayurcentralonline.com/wp-json/b2b/v1/customers/${userId}`;
      console.log('Fetch user details endpoint:', endpoint);
      
      // Append client_id as query parameter for GET requests
      const url = `${endpoint}?client_id=${CLIENT_ID}`;
      
      const response = await axios.get<FetchUserDetailsResponse>(url);
      
      console.log('Fetch user details API response:', response.data);
      
      // Handle different response formats
      if (response.data) {
        // Check if the response directly contains user data or nested in data/user field
        const userData = response.data.user || response.data.data || response.data;
        
        return {
          success: true,
          message: 'User details fetched successfully',
          user: userData as User
        };
      }
      
      return {
        success: false,
        message: 'Failed to fetch user details'
      };
    } catch (error) {
      console.error('Fetch user details API error:', error);
      if (axios.isAxiosError(error)) {
        console.error('Response data:', error.response?.data);
        const errorMessage = error.response?.data?.message || 'Failed to fetch user details. Please try again.';
        throw new Error(errorMessage);
      }
      throw error;
    }
  }
};

export default authApi;
