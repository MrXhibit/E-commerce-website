import React, { useState } from 'react';
import {
  PaymentElement,
  useStripe,
  useElements
} from '@stripe/react-stripe-js';
import {
  Box,
  Button,
  CircularProgress,
  Alert
} from '@mui/material';

const StripePaymentForm = ({ onPaymentSuccess, onPaymentError, loading, total }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);
    setErrorMessage('');

    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/order-confirmation`
        },
        redirect: 'if_required'
      });

      if (error) {
        setErrorMessage(error.message);
        onPaymentError(error);
      } else if (paymentIntent && paymentIntent.status === 'succeeded') {
        onPaymentSuccess(paymentIntent);
      }
    } catch (err) {
      setErrorMessage('An unexpected error occurred.');
      onPaymentError(err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      {errorMessage && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {errorMessage}
        </Alert>
      )}
      
      <PaymentElement 
        options={{
          layout: 'tabs'
        }}
      />
      
      <Button
        type="submit"
        fullWidth
        variant="contained"
        color="primary"
        size="large"
        disabled={!stripe || loading || isProcessing}
        sx={{ fontWeight: 700, py: 1.5, mt: 3 }}
      >
        {isProcessing || loading ? (
          <CircularProgress size={24} color="inherit" />
        ) : (
          `Pay $${total.toFixed(2)}`
        )}
      </Button>
    </Box>
  );
};

export default StripePaymentForm;