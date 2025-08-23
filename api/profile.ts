import axios from 'axios';
import { API_BASE_URL } from '../constants';
import { API_CONFIG } from './config';

// Use centralized config
const CLIENT_ID = API_CONFIG.clientId;

interface AddressData {
  name: string;
  pincode: string;
  city: string;
  state: string;
  address: string;
  mobile: string;
}

interface UpdateProfileRequest {
  user_id: number | string;
  address_data: any;
}

interface UpdateProfileResponse {
  message: string;
}

export interface Address {
  id?: string;
  name: string;
  last_name?: string;
  pincode: string;
  city: string;
  state: string;
  address: string;
  mobile: string;
  email?: string;
  country?: string;
  isDefault?: boolean;
  user_id?: number | string;
}

export const profileApi = {
  // Update profile with address data
  updateProfile: async (data: UpdateProfileRequest): Promise<UpdateProfileResponse> => {
    try {
      // Append client_id to the request data
      const requestData = {
        ...data,
        client_id: CLIENT_ID,
      };
      
      console.log('Updating profile with data:', requestData);
      const response = await axios.post<UpdateProfileResponse>(
        `${API_BASE_URL}/edit-profile`,
        requestData
      );
      console.log('Profile update response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Profile update error:', error);
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.message || 'Failed to update profile';
        throw new Error(errorMessage);
      }
      throw error;
    }
  },
  
  // Add a new address
  addAddress: async (address: Address): Promise<{success: boolean; message: string}> => {
    try {
      // Append client_id to the request data
      const requestData = {
        ...address,
        client_id: CLIENT_ID,
      };
      
      console.log('Adding address:', requestData);
      const response = await axios.post(
        `${API_BASE_URL}/edit-profile`,
        requestData
      );
      return { success: true, message: 'Address added successfully' };
    } catch (error) {
      console.error('Add address error:', error);
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.message || 'Failed to add address';
        throw new Error(errorMessage);
      }
      throw error;
    }
  },
  
  // Update an existing address
  updateAddress: async (address: Address): Promise<{success: boolean; message: string}> => {
    try {
      // Append client_id to the request data
      const requestData = {
        ...address,
        client_id: CLIENT_ID,
      };
      
      console.log('Updating address:', requestData);
      const response = await axios.put(
        `${API_BASE_URL}/addresses/${address.id}`,
        requestData
      );
      return { success: true, message: 'Address updated successfully' };
    } catch (error) {
      console.error('Update address error:', error);
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.message || 'Failed to update address';
        throw new Error(errorMessage);
      }
      throw error;
    }
  },
  
  // Delete an address
  deleteAddress: async (id: string): Promise<{success: boolean; message: string}> => {
    try {
      console.log('Deleting address:', id);
      const response = await axios.delete(`${API_BASE_URL}/addresses/${id}`);
      return { success: true, message: 'Address deleted successfully' };
    } catch (error) {
      console.error('Delete address error:', error);
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.message || 'Failed to delete address';
        throw new Error(errorMessage);
      }
      throw error;
    }
  },
  
  // Set default address
  setDefaultAddress: async (id: string): Promise<{success: boolean; message: string}> => {
    try {
      // Append client_id to the request data
      const requestData = {
        client_id: CLIENT_ID,
      };
      
      console.log('Setting default address:', id);
      const response = await axios.put(`${API_BASE_URL}/addresses/${id}/default`, requestData);
      return { success: true, message: 'Default address updated successfully' };
    } catch (error) {
      console.error('Set default address error:', error);
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.message || 'Failed to set default address';
        throw new Error(errorMessage);
      }
      throw error;
    }
  },
};
