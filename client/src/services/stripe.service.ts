import { loadStripe, Stripe } from '@stripe/stripe-js';

// Stripe configuration
// NOTE: For local development, HTTP is fine for testing.
// For production, HTTPS is REQUIRED for live Stripe integrations.
const STRIPE_PUBLISHABLE_KEY = (import.meta as any).env?.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_your_key_here';

// Load Stripe instance
let stripePromise: Promise<Stripe | null>;

if (STRIPE_PUBLISHABLE_KEY) {
  stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY);
} else {
  console.warn('Stripe publishable key not found. Payments will not work.');
  stripePromise = Promise.resolve(null);
}

export default stripePromise;

// Stripe service class for additional functionality
export class StripeService {
  private baseURL: string;

  constructor() {
    this.baseURL = '/api/v1';
  }

  // Create a checkout session
  async createCheckoutSession(cartItems: any[], successUrl: string, cancelUrl: string): Promise<{ sessionId: string }> {
    try {
      const response = await fetch(`${this.baseURL}/payment/create-checkout-session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          items: cartItems,
          success_url: successUrl,
          cancel_url: cancelUrl,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to create checkout session: ${response.statusText}`);
      }

      const data = await response.json();
      return data.data || data;
    } catch (error) {
      console.error('Create checkout session error:', error);
      throw error;
    }
  }

  // Redirect to Stripe checkout
  async redirectToCheckout(sessionId: string): Promise<void> {
    try {
      const stripe = await stripePromise;
      if (!stripe) {
        throw new Error('Stripe not loaded');
      }

      const { error } = await stripe.redirectToCheckout({
        sessionId,
      });

      if (error) {
        throw error;
      }
    } catch (error) {
      console.error('Redirect to checkout error:', error);
      throw error;
    }
  }

  // Create payment intent
  async createPaymentIntent(amount: number, currency: string = 'usd'): Promise<{ clientSecret: string }> {
    try {
      const response = await fetch(`${this.baseURL}/payment/create-payment-intent`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          amount,
          currency,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to create payment intent: ${response.statusText}`);
      }

      const data = await response.json();
      return data.data || data;
    } catch (error) {
      console.error('Create payment intent error:', error);
      throw error;
    }
  }

  // Confirm payment
  async confirmPayment(paymentIntentId: string): Promise<{ status: string }> {
    try {
      const response = await fetch(`${this.baseURL}/payment/confirm`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          paymentIntentId,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to confirm payment: ${response.statusText}`);
      }

      const data = await response.json();
      return data.data || data;
    } catch (error) {
      console.error('Confirm payment error:', error);
      throw error;
    }
  }

  // Get payment status
  async getPaymentStatus(paymentIntentId: string): Promise<{ status: string; amount: number; currency: string }> {
    try {
      const response = await fetch(`${this.baseURL}/payment/status/${paymentIntentId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error(`Failed to get payment status: ${response.statusText}`);
      }

      const data = await response.json();
      return data.data || data;
    } catch (error) {
      console.error('Get payment status error:', error);
      throw error;
    }
  }

  // Create customer
  async createCustomer(email: string, name?: string): Promise<{ customerId: string }> {
    try {
      const response = await fetch(`${this.baseURL}/payment/create-customer`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          email,
          name,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to create customer: ${response.statusText}`);
      }

      const data = await response.json();
      return data.data || data;
    } catch (error) {
      console.error('Create customer error:', error);
      throw error;
    }
  }

  // Get customer payment methods
  async getCustomerPaymentMethods(customerId: string): Promise<any[]> {
    try {
      const response = await fetch(`${this.baseURL}/payment/customer/${customerId}/payment-methods`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error(`Failed to get payment methods: ${response.statusText}`);
      }

      const data = await response.json();
      return data.data || data;
    } catch (error) {
      console.error('Get payment methods error:', error);
      throw error;
    }
  }

  // Setup payment method for future use
  async setupPaymentMethod(customerId: string, paymentMethodId: string): Promise<void> {
    try {
      const response = await fetch(`${this.baseURL}/payment/setup-payment-method`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          customerId,
          paymentMethodId,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to setup payment method: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Setup payment method error:', error);
      throw error;
    }
  }
}

// Export utility functions for backward compatibility
export const createCheckoutSession = async (cartItems: any[], successUrl: string, cancelUrl: string) => {
  const service = new StripeService();
  return service.createCheckoutSession(cartItems, successUrl, cancelUrl);
};

export const redirectToCheckout = async (sessionId: string) => {
  const service = new StripeService();
  return service.redirectToCheckout(sessionId);
};

// Export the service instance
export const stripeService = new StripeService();
