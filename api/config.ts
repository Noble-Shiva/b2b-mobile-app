// Centralized API configuration
export const API_CONFIG = {
  // Base URL for all API endpoints
  baseUrl: 'https://b2b.ayurcentralonline.com/wp-json/b2b/v1',
  
  // Default headers for all requests
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  
  // Client ID for backend authentication
  // Change this value in one place to update all API calls
  clientId: 'ac_0123',
  
  // API endpoints
  endpoints: {
    auth: {
      sendOtp: '/otp/send',
      verifyOtp: '/otp/verify',
      registerUser: '/user/register',
      editProfile: '/edit-profile',
      verifyToken: '/token/verify',
    },
    orders: {
      create: '/b2borders/create',
      confirmPayment: '/payment/confirm',
      getUserOrders: '/getorders/user',
      getOrderDetails: '/getorders',
    },
    categories: '/categories',
    brands: '/brands',
    products: '/products',
  },
} as const;

// Type for the config to ensure type safety
export type ApiConfig = typeof API_CONFIG;
