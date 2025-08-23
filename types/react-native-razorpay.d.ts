declare module 'react-native-razorpay' {
  interface RazorpayOptions {
    key: string;
    amount: number;
    currency?: string;
    name: string;
    description?: string;
    image?: string;
    order_id: string;
    prefill?: {
      email?: string;
      contact?: string;
      name?: string;
    };
    theme?: {
      color?: string;
      backdrop_color?: string;
      hide_topbar?: boolean;
    };
    notes?: {
      [key: string]: string;
    };
    retry?: {
      enabled?: boolean;
      max_count?: number;
    };
    send_sms_hash?: boolean;
  }

  interface RazorpaySuccessResponse {
    razorpay_payment_id: string;
    razorpay_order_id: string;
    razorpay_signature: string;
  }

  interface RazorpayErrorResponse {
    code: string | number;
    description: string;
    source: string;
    step: string;
    reason: string;
    metadata: Record<string, any>;
  }

  const RazorpayCheckout: {
    open: (options: RazorpayOptions) => Promise<RazorpaySuccessResponse>;
    onExternalWalletSelection: (callback: (data: { external_wallet: string }) => void) => void;
  };

  export default RazorpayCheckout;
}
