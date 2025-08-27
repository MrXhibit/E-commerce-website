import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  TextField,
  Divider,
  Grid,
  Alert,
  CircularProgress
} from '@mui/material';
import { Elements } from '@stripe/react-stripe-js';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAppSelector } from '../store/hooks';
import Header from './Header';
import Footer from './Footer';
import StripePaymentForm from './components/StripePaymentForm';
import stripePromise from '../services/stripe.service';
import apiService from '../services/api'; // Change this import

const CheckoutPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, token } = useAppSelector((state) => state.auth);
  
  const orderData = location.state?.orderData;
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [clientSecret, setClientSecret] = useState('');
  
  // Shipping form state
  const [shippingForm, setShippingForm] = useState({
    fullName: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'US',
    phone: ''
  });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    if (!orderData) {
      navigate('/cart');
      return;
    }

    // Create payment intent when component mounts
    initializePayment();
  }, [isAuthenticated, orderData, navigate]);

  const initializePayment = async () => {
    try {
      setLoading(true);
      // Create an order first, then create payment intent
      const orderPayload = {
        items: orderData.items,
        shippingAddress: shippingForm,
        deliveryMethod: orderData.deliveryMethod,
        orderSummary: orderData.orderSummary,
        appliedCoupon: orderData.appliedCoupon,
        paymentInfo: {
          method: 'stripe',
          paymentStatus: 'pending'
        },
        notes: ''
      };
      
      // Create order first
      const orderResponse = await apiService.createOrder(orderPayload);
      
      if (orderResponse.success) {
        // Then create payment intent with the order ID
        const paymentIntent = await apiService.createPaymentIntent(
          orderData.orderSummary.total,
          'usd',
          orderResponse.data.orderId // Pass the order ID
        );
        
        setClientSecret(paymentIntent.data.clientSecret);
      } else {
        setError('Failed to create order. Please try again.');
      }
    } catch (err) {
      console.error('Payment initialization error:', err);
      setError('Failed to initialize payment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleShippingChange = (field, value) => {
    setShippingForm(prev => ({ ...prev, [field]: value }));
  };

  const validateShippingForm = () => {
    const requiredFields = ['fullName', 'addressLine1', 'city', 'state', 'zipCode', 'phone'];
    
    for (const field of requiredFields) {
      if (!shippingForm[field]) {
        setError(`Please fill in ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`);
        return false;
      }
    }
    
    return true;
  };

  const handlePaymentSuccess = async (paymentIntent) => {
    if (!validateShippingForm()) return;
    
    setLoading(true);
    setError('');
    
    try {
      const orderPayload = {
        items: orderData.items,
        shippingAddress: shippingForm,
        deliveryMethod: orderData.deliveryMethod,
        orderSummary: orderData.orderSummary,
        appliedCoupon: orderData.appliedCoupon,
        paymentIntentId: paymentIntent.id,
        notes: ''
      };
      
      const response = await fetch('/api/v1/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(orderPayload)
      });
      
      const data = await response.json();
      
      if (data.success) {
        navigate('/order-confirmation', {
          state: {
            order: data.data,
            paymentInfo: {
              transactionId: paymentIntent.id,
              method: 'stripe',
              amount: orderData.orderSummary.total
            }
          }
        });
      } else {
        setError(data.message || 'Failed to place order');
      }
    } catch (error) {
      setError('Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentError = (error) => {
    setError(error.message || 'Payment failed. Please try again.');
  };

  if (!orderData) {
    return null;
  }

  const stripeOptions = {
    clientSecret,
    appearance: {
      theme: 'stripe'
    }
  };

  return (
    <>
      <Header />
      <Box sx={{ background: '#f8f5f2', minHeight: '100vh', py: 6 }}>
        <Container maxWidth="lg">
          <Typography variant="h4" fontWeight={700} sx={{ mb: 3 }}>
            Checkout
          </Typography>
          
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}
          
          <Grid container spacing={4}>
            {/* Left Column - Forms */}
            <Grid item xs={12} md={8}>
              {/* Shipping Address */}
              <Paper sx={{ p: 3, mb: 3 }}>
                <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
                  Shipping Address
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Full Name"
                      value={shippingForm.fullName}
                      onChange={(e) => handleShippingChange('fullName', e.target.value)}
                      required
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Address Line 1"
                      value={shippingForm.addressLine1}
                      onChange={(e) => handleShippingChange('addressLine1', e.target.value)}
                      required
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Address Line 2 (Optional)"
                      value={shippingForm.addressLine2}
                      onChange={(e) => handleShippingChange('addressLine2', e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="City"
                      value={shippingForm.city}
                      onChange={(e) => handleShippingChange('city', e.target.value)}
                      required
                    />
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <TextField
                      fullWidth
                      label="State"
                      value={shippingForm.state}
                      onChange={(e) => handleShippingChange('state', e.target.value)}
                      required
                    />
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <TextField
                      fullWidth
                      label="ZIP Code"
                      value={shippingForm.zipCode}
                      onChange={(e) => handleShippingChange('zipCode', e.target.value)}
                      required
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Phone Number"
                      value={shippingForm.phone}
                      onChange={(e) => handleShippingChange('phone', e.target.value)}
                      required
                    />
                  </Grid>
                </Grid>
              </Paper>
              
              {/* Payment Information */}
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
                  Payment Information
                </Typography>
                
                {clientSecret && (
                  <Elements stripe={stripePromise} options={stripeOptions}>
                    <StripePaymentForm
                      onPaymentSuccess={handlePaymentSuccess}
                      onPaymentError={handlePaymentError}
                      loading={loading}
                      total={orderData.orderSummary.total}
                    />
                  </Elements>
                )}
                
                {!clientSecret && (
                  <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                    <CircularProgress />
                  </Box>
                )}
              </Paper>
            </Grid>
            
            {/* Right Column - Order Summary */}
            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 3, position: 'sticky', top: 20 }}>
                <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
                  Order Summary
                </Typography>
                
                {/* Order Items */}
                {orderData.items.map((item, index) => (
                  <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <img
                      src={item.product.images[0]?.url || 'https://via.placeholder.com/50'}
                      alt={item.product.name}
                      style={{ width: 50, height: 50, objectFit: 'cover', borderRadius: 4, marginRight: 12 }}
                    />
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="body2" fontWeight={600}>
                        {item.product.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Qty: {item.quantity} × ${item.price}
                      </Typography>
                    </Box>
                    <Typography variant="body2" fontWeight={600}>
                      ${(item.quantity * item.price).toFixed(2)}
                    </Typography>
                  </Box>
                ))}
                
                <Divider sx={{ my: 2 }} />
                
                {/* Order Totals */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">Subtotal</Typography>
                  <Typography variant="body2">${orderData.orderSummary.subtotal.toFixed(2)}</Typography>
                </Box>
                
                {orderData.orderSummary.discountAmount > 0 && (
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" color="success.main">Discount</Typography>
                    <Typography variant="body2" color="success.main">
                      -${orderData.orderSummary.discountAmount.toFixed(2)}
                    </Typography>
                  </Box>
                )}
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">Delivery</Typography>
                  <Typography variant="body2">${orderData.orderSummary.deliveryFee.toFixed(2)}</Typography>
                </Box>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">Service Fee</Typography>
                  <Typography variant="body2">${orderData.orderSummary.serviceFee.toFixed(2)}</Typography>
                </Box>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">Tax</Typography>
                  <Typography variant="body2">${orderData.orderSummary.tax.toFixed(2)}</Typography>
                </Box>
                
                <Divider sx={{ my: 2 }} />
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                  <Typography variant="h6" fontWeight={700}>Total</Typography>
                  <Typography variant="h6" fontWeight={700}>
                    ${orderData.orderSummary.total.toFixed(2)}
                  </Typography>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>
      <Footer />
    </>
  );
};

export default CheckoutPage;