import { loadStripe } from '@stripe/stripe-js';

// Initialize Stripe with your publishable key
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

export const createPaymentIntent = async (amount, currency = 'usd', token) => {
  try {
    const response = await fetch('/api/v1/payments/create-payment-intent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        amount: Math.round(amount * 100), // Convert to cents
        currency
      })
    });
    
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.message || 'Failed to create payment intent');
    }
    
    return data.data;
  } catch (error) {
    console.error('Error creating payment intent:', error);
    throw error;
  }
};

export default stripePromise;