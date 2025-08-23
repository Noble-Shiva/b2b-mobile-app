import RazorpayCheckout from 'react-native-razorpay';
import { Platform } from 'react-native';

interface RazorpayOptions {
  key: string;
  amount: number; 
  currency: string;
  name: string;
  description?: string;
  order_id: string;
  prefill?: {
    email?: string;
    contact?: string;
    name?: string;
  };
  theme?: {
    color?: string;
  };
  notes?: {
    [key: string]: string;
  };
}

/**
 * Initialize Razorpay payment
 * @param options Razorpay payment options
 * @returns Promise with payment response
 */
export const initializePayment = (options: RazorpayOptions): Promise<any> => {
  // Ensure amount is in paise (multiply by 100 if not)
  // Razorpay expects amount in paise but our API might return in rupees
  const paidAmount = options.amount;
  
  // Configure Razorpay options
  const razorpayOptions = {
    ...options,
    amount: paidAmount,
    image: 'https://your-app-logo-url.png', // Replace with your app logo URL
    // Add Android-specific options
    ...(Platform.OS === 'android' && {
      retry: {
        enabled: true,
        max_count: 1,
      },
      send_sms_hash: true,
    }),
  };

  console.log('Initializing Razorpay payment with options:', JSON.stringify(razorpayOptions));

  // Open Razorpay checkout
  return RazorpayCheckout.open(razorpayOptions);
};

/**
 * Get default Razorpay options with app-specific settings
 * @param orderId Razorpay order ID
 * @param amount Amount in rupees
 * @param userInfo User information for prefill
 * @returns RazorpayOptions object
 */
export const getDefaultRazorpayOptions = (
  orderId: string, 
  amount: number,
  userInfo?: {
    name?: string;
    email?: string;
    phone?: string;
  }
): RazorpayOptions => {
  // IMPORTANT: Replace with your actual Razorpay key in production
  // This is just a placeholder key format
  const RAZORPAY_KEY = 'rzp_test_your_razorpay_key_here';
  
  return {
    key: RAZORPAY_KEY,
    amount: amount,
    currency: 'INR',
    name: 'QuickMart',
    description: 'Purchase from QuickMart',
    order_id: orderId,
    prefill: {
      email: userInfo?.email || '',
      contact: userInfo?.phone || '',
      name: userInfo?.name || '',
    },
    theme: {
      color: '#FF456A', // Primary app color
    },
    notes: {
      app_name: 'QuickMart',
      platform: Platform.OS,
    },
  };
};
