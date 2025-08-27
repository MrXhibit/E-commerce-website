import React, { useState, useEffect } from 'react';
import { Box, Container, Typography, Paper, Button, TextField, Divider, Radio, RadioGroup, FormControlLabel, Checkbox, Stack, LinearProgress, Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { createCheckoutSession, redirectToCheckout } from '../services/stripe.service';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { updateCartItem, removeFromCart, clearCart } from '../store/slices/cartSlice';
import Header from './Header';
import Footer from './Footer';

const DELIVERY_FEE = 7.99;
const SERVICE_FEE = 1.5;
const TAX = 7.0;
const CREDITS = 8.0;
const TIP_PRESETS = [2, 4, 7];

const CartPage = () => {
  const dispatch = useAppDispatch();
  const { items: cartItems, totalAmount, itemCount, isLoading } = useAppSelector((state) => state.cart);
  const { isAuthenticated, token } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();
  
  const [delivery, setDelivery] = useState('delivery');
  const [tip, setTip] = useState(0);
  const [customTip, setCustomTip] = useState('');
  const [useCredits, setUseCredits] = useState(false);
  const [coupon, setCoupon] = useState('');
  const [loading, setLoading] = useState(false);
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [discountAmount, setDiscountAmount] = useState(0);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  const handleQuantityChange = async (productId, delta) => {
    const item = cartItems.find(item => item.productId === productId);
    if (item) {
      const newQuantity = Math.max(1, item.quantity + delta);
      dispatch(updateCartItem({ productId, quantity: newQuantity }));
    }
  };

  const handleRemove = async (productId) => {
    dispatch(removeFromCart(productId));
  };

  const handleClearCart = async () => {
    dispatch(clearCart());
  };

  const handleTipPreset = (value) => {
    setTip(value);
    setCustomTip('');
  };

  const handleCustomTip = (e) => {
    setCustomTip(e.target.value);
    setTip(Number(e.target.value) || 0);
  };

  const handleApplyCoupon = async () => {
    if (!coupon.trim()) {
      setCouponError('Please enter a coupon code');
      return;
    }

    setLoading(true);
    setCouponError('');
    setCouponSuccess('');

    try {
      const response = await fetch('/api/v1/cart/coupon/apply', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ couponCode: coupon })
      });

      const data = await response.json();

      if (data.success) {
        setAppliedCoupon(data.data.appliedCoupon);
        setDiscountAmount(data.data.discountAmount || 0);
        setCouponSuccess('Coupon applied successfully!');
        setCoupon('');
      } else {
        setCouponError(data.message);
      }
    } catch (error) {
      setCouponError('Failed to apply coupon');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveCoupon = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/v1/cart/coupon/remove', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      if (data.success) {
        setAppliedCoupon(null);
        setDiscountAmount(0);
        setCouponSuccess('Coupon removed successfully!');
      }
    } catch (error) {
      setCouponError('Failed to remove coupon');
    } finally {
      setLoading(false);
    }
  };

  // Handle Stripe Checkout redirect
  const handleProceedToCheckout = async () => {
    if (cartItems.length === 0) return;
    
    try {
      setLoading(true);
      
      // Validate cart items have required fields
      const invalidItems = cartItems.filter(item => 
        !item.name || !item.price || !item.quantity || item.quantity <= 0
      );
      
      if (invalidItems.length > 0) {
        throw new Error('Some cart items are missing required information. Please refresh and try again.');
      }
      
      const lineItems = cartItems.map((item) => ({
        name: item.name,
        price: item.price,
        quantity: item.quantity,
      }));
      
      const successUrl = `${window.location.origin}/success`;
      const cancelUrl = `${window.location.origin}/cancel`;
      
      const session = await createCheckoutSession(lineItems, successUrl, cancelUrl);
      
      if (!session || !session.id) {
        throw new Error('Failed to create checkout session. Please try again.');
      }
      
      await redirectToCheckout(session.id);
    } catch (err) {
      console.error('Checkout error:', err);
      const errorMessage = err.message || 'Unable to start checkout. Please try again.';
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const subtotal = totalAmount || 0;
  const deliveryFee = delivery === 'delivery' ? DELIVERY_FEE : 0;
  const credits = useCredits ? CREDITS : 0;
  const total = subtotal + deliveryFee + SERVICE_FEE + TAX + tip - credits - discountAmount;

  if (!isAuthenticated) {
    return null;
  }

  return (
    <>
      <Header />
      <Box sx={{ background: '#f8f5f2', minHeight: '100vh', py: 6 }}>
        <Container maxWidth={false} sx={{ px: { xs: 1, sm: 3, md: 6, lg: 12 } }}>
          <Typography variant="h4" fontWeight={700} sx={{ mb: 3 }}>
            My Cart
          </Typography>
          
          {loading && (
            <Box sx={{ width: '100%', mb: 2 }}>
              <LinearProgress />
            </Box>
          )}

          {cartItems.length === 0 ? (
            <Paper sx={{ p: 4, textAlign: 'center' }}>
              <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
                Your cart is empty
              </Typography>
              <Button 
                variant="contained" 
                color="primary" 
                onClick={() => navigate('/products')}
                sx={{ fontWeight: 600 }}
              >
                Continue Shopping
              </Button>
            </Paper>
          ) : (
            <Grid container spacing={4} alignItems="flex-start" justifyContent="center">
              {/* Cart List */}
              <Grid item xs={12} md={8} lg={8}>
                <Paper sx={{ p: 3, mb: 3 }}>
                  <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
                    My Cart ({cartItems.length})
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  {cartItems.map(item => (
                    <Box key={item.productId} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <img 
                          src={item.product.images[0]?.url || 'https://via.placeholder.com/70'} 
                          alt={item.product.name} 
                          style={{ width: 70, height: 70, objectFit: 'cover', borderRadius: 8 }} 
                        />
                        <Box>
                          <Typography fontWeight={700}>{item.product.name}</Typography>
                          <Typography variant="body2" color="text.secondary">{item.product.brandName}</Typography>
                          <Typography variant="body2" color="text.secondary">Model: {item.product.modelName}</Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography variant="body2" color="error.main" fontWeight={700}>
                              ${item.price}
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Button 
                          onClick={() => handleQuantityChange(item.productId, -1)} 
                          size="small" 
                          sx={{ minWidth: 32, fontWeight: 700, border: '1px solid #ccc', borderRadius: 1, color: 'black' }}
                          disabled={loading}
                        >
                          -
                        </Button>
                        <TextField 
                          value={item.quantity} 
                          size="small" 
                          inputProps={{ style: { width: 32, textAlign: 'center' }, readOnly: true }} 
                          sx={{ mx: 1, background: 'white', borderRadius: 1 }} 
                        />
                        <Button 
                          onClick={() => handleQuantityChange(item.productId, 1)} 
                          size="small" 
                          sx={{ minWidth: 32, fontWeight: 700, border: '1px solid #ccc', borderRadius: 1, color: 'black' }}
                          disabled={loading}
                        >
                          +
                        </Button>
                      </Box>
                      <Button 
                        color="inherit" 
                        size="small" 
                        sx={{ p: 0, minWidth: 0, textTransform: 'none', fontSize: 14, ml: 2 }} 
                        onClick={() => handleRemove(item.productId)}
                        disabled={loading}
                      >
                        × Remove
                      </Button>
                    </Box>
                  ))}
                  <Divider sx={{ my: 2 }} />
                  <Button 
                    variant="outlined" 
                    color="error" 
                    onClick={handleClearCart}
                    disabled={loading}
                    sx={{ fontWeight: 600 }}
                  >
                    Clear Cart
                  </Button>
                </Paper>
              </Grid>
              
              {/* Cart Summary & Coupon */}
              <Grid item xs={12} md={4} lg={4}>
                {/* Coupon */}
                <Paper sx={{ p: 2, mb: 3 }}>
                  <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 1 }}>Coupons</Typography>
                  
                  {appliedCoupon ? (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <Typography variant="body2" color="success.main">
                        {appliedCoupon.code} applied (-${discountAmount.toFixed(2)})
                      </Typography>
                      <Button size="small" onClick={handleRemoveCoupon}>Remove</Button>
                    </Box>
                  ) : (
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <TextField 
                        placeholder="Coupon code" 
                        value={coupon} 
                        onChange={e => setCoupon(e.target.value)} 
                        size="small" 
                        sx={{ flex: 1 }}
                        error={!!couponError}
                      />
                      <Button 
                        variant="contained" 
                        color="inherit" 
                        sx={{ background: 'black', color: 'white', borderRadius: 0, px: 3, fontWeight: 700 }}
                        onClick={handleApplyCoupon}
                        disabled={loading}
                      >
                        APPLY NOW
                      </Button>
                    </Box>
                  )}
                  
                  {couponError && (
                    <Typography variant="body2" color="error" sx={{ mt: 1 }}>
                      {couponError}
                    </Typography>
                  )}
                  
                  {couponSuccess && (
                    <Typography variant="body2" color="success.main" sx={{ mt: 1 }}>
                      {couponSuccess}
                    </Typography>
                  )}
                </Paper>
                
                {/* Order Summary */}
                <Paper sx={{ p: 3 }}>
                  <Typography variant="h6" fontWeight={700} gutterBottom>Your Order</Typography>
                  <Divider sx={{ mb: 2 }} />
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">Subtotal ({itemCount} items)</Typography>
                    <Typography variant="body2">${subtotal.toFixed(2)}</Typography>
                  </Box>
                  
                  {/* Add discount line in order summary */}
                  {discountAmount > 0 && (
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2" color="success.main">Discount</Typography>
                      <Typography variant="body2" color="success.main">-${discountAmount.toFixed(2)}</Typography>
                    </Box>
                  )}
                  
                  {/* Delivery */}
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" fontWeight={700} sx={{ mb: 1 }}>Delivery</Typography>
                    <RadioGroup value={delivery} onChange={e => setDelivery(e.target.value)}>
                      <FormControlLabel value="delivery" control={<Radio />} label={<Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}><span>Delivery</span><span>${DELIVERY_FEE.toFixed(2)}</span></Box>} />
                      <FormControlLabel value="pickup" control={<Radio />} label={<Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}><span>Pick Up</span></Box>} />
                    </RadioGroup>
                  </Box>
                  
                  {/* Tip */}
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" fontWeight={700} sx={{ mb: 1 }}>Tip</Typography>
                    <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
                      {TIP_PRESETS.map(val => (
                        <Button key={val} variant={tip === val ? 'contained' : 'outlined'} color={tip === val ? 'primary' : 'inherit'} size="small" sx={{ minWidth: 48 }} onClick={() => handleTipPreset(val)}>
                          ${val}
                        </Button>
                      ))}
                      <TextField placeholder="$" value={customTip} onChange={handleCustomTip} size="small" sx={{ width: 60, background: 'white', borderRadius: 1 }} />
                    </Stack>
                    <Typography variant="body2" color="text.secondary">Total: ${tip.toFixed(2)}</Typography>
                  </Box>
                  
                  {/* Service Fee */}
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">Service Fee</Typography>
                    <Typography variant="body2">${SERVICE_FEE.toFixed(2)}</Typography>
                  </Box>
                  
                  {/* Tax */}
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">Tax</Typography>
                    <Typography variant="body2">${TAX.toFixed(2)}</Typography>
                  </Box>
                  
                  {/* Credits */}
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Checkbox checked={useCredits} onChange={e => setUseCredits(e.target.checked)} sx={{ p: 0, mr: 1 }} />
                    <Typography variant="body2">Use E-Markets Credits</Typography>
                    <Box sx={{ flex: 1 }} />
                    <Typography variant="body2">${CREDITS.toFixed(2)}</Typography>
                  </Box>
                  
                  <Divider sx={{ my: 2 }} />
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, mb: 2 }}>
                    <Typography variant="body1">Total Payable</Typography>
                    <Typography variant="body1">${total.toFixed(2)}</Typography>
                  </Box>
                  
                  <Button 
                    variant="contained" 
                    color="primary" 
                    fullWidth 
                    sx={{ fontWeight: 700, fontSize: 16, py: 1.2, borderRadius: 0 }}
                    disabled={loading || cartItems.length === 0}
                    onClick={handleProceedToCheckout}
                  >
                    PROCEED TO CHECKOUT
                  </Button>
                </Paper>
              </Grid>
            </Grid>
          )}
        </Container>
      </Box>
      <Footer />
    </>
  );
};

export default CartPage;