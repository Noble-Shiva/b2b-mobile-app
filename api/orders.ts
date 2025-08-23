import { post, get } from './client';

export interface OrderItem {
  product_id: number;
  quantity: number;
}

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

export interface OrderLineItem {
  product_id: number;
  variation_id: number;
  name: string;
  quantity: number;
  subtotal: string;
  total: string;
  product_type: string;
}

export interface UserOrder {
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
  items: OrderLineItem[];
}

export interface CreateOrderPayload {
  user_id: any;
  line_items: OrderItem[];
  billing_first_name?: string;
  billing_last_name?: string;
  billing_address_1?: string;
  billing_city?: string;
  billing_state?: string;
  billing_postcode?: string;
  billing_country?: string;
  billing_email?: string;
  billing_phone?: string;
}

export interface CreateOrderResponse {
  success: boolean;
  order_id: number;
  razorpay_order_id: string;
  amount: number;
  currency: string;
  message?: string;
  [key: string]: any;
}

export interface ConfirmPaymentPayload {
  order_id: number;
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

export interface ConfirmPaymentResponse {
  success: boolean;
  message: string;
  order_details?: {
    id: number;
    status: string;
    total: string;
    [key: string]: any;
  };
  [key: string]: any;
}

/**
 * Create a new order on the server
 * @param payload Order creation payload
 * @returns Response with order details
 */
export const createOrder = async (payload: CreateOrderPayload): Promise<CreateOrderResponse> => {
  try {
    console.log('Creating order with payload:', JSON.stringify(payload));
    
    const response = await post<CreateOrderResponse>(
      '/b2borders/create',
      payload
    );
    
    console.log('Order created successfully:', response);
    return response;
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
};

/**
 * Confirm payment after successful Razorpay transaction
 * @param payload Payment confirmation details
 * @returns Response with confirmation status
 */
export const confirmPayment = async (payload: ConfirmPaymentPayload): Promise<ConfirmPaymentResponse> => {
  try {
    console.log('Confirming payment with payload:', JSON.stringify(payload));
    
    const response = await post<ConfirmPaymentResponse>(
      '/payment/confirm',
      payload
    );
    
    console.log('Payment confirmed successfully:', response);
    return response;
  } catch (error) {
    console.error('Error confirming payment:', error);
    throw error;
  }
};

/**
 * Get user orders from the server
 * @param userId User ID to fetch orders for
 * @returns Array of user orders
 */
export const getUserOrders = async (userId: number): Promise<UserOrder[]> => {
  try {
    console.log('Fetching orders for user ID:', userId);
    
    const response = await get<UserOrder[]>(`/getorders/user/${userId}`);
    
    // console.log('Orders fetched successfully:', response);
    return response;
  } catch (error) {
    console.error('Error fetching user orders:', error);
    throw error;
  }
};

/**
 * Get detailed information for a specific order
 * @param orderId Order ID to fetch details for
 * @returns Detailed order information
 */
export const getOrderDetails = async (orderId: number): Promise<UserOrder> => {
  try {
    console.log('Fetching order details for order ID:', orderId);
    
    const response = await get<UserOrder>(`/getorders/${orderId}`);
    
    console.log('Order details fetched successfully:', response);
    return response;
  } catch (error) {
    console.error('Error fetching order details:', error);
    throw error;
  }
};
