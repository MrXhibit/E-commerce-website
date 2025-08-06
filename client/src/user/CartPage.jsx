import React, { useState, useEffect } from 'react';
import { Box, Container, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, IconButton, TextField, Divider, Radio, RadioGroup, FormControlLabel, Checkbox, Stack, LinearProgress, Grid, Alert, CircularProgress } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

const DELIVERY_FEE = 7.99;
const SERVICE_FEE = 1.5;
const TAX = 7.0;
const CREDITS = 8.0;
const TIP_PRESETS = [2, 4, 7];

const CartPage = () => {
  const { cart, updateCartItem, removeFromCart, clearCart, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [delivery, setDelivery] = useState('delivery');
  const [tip, setTip] = useState(0);
  const [customTip, setCustomTip] = useState('');
  const [useCredits, setUseCredits] = useState(false);
  const [coupon, setCoupon] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  const handleQuantityChange = async (productId, delta) => {
    const item = cart.items.find(item => item.productId === productId);
    if (item) {
      const newQuantity = Math.max(1, item.quantity + delta);
      setLoading(true);
      try {
        await updateCartItem(productId, newQuantity);
      } catch (error) {
        console.error('Failed to update quantity:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleRemove = async (productId) => {
    setLoading(true);
    try {
      await removeFromCart(productId);
    } catch (error) {
      console.error('Failed to remove item:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClearCart = async () => {
    setLoading(true);
    try {
      await clearCart();
    } catch (error) {
      console.error('Failed to clear cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTipPreset = (value) => {
    setTip(value);
    setCustomTip('');
  };

  const handleCustomTip = (e) => {
    setCustomTip(e.target.value);
    setTip(Number(e.target.value) || 0);
  };

  const subtotal = cart.totalAmount || 0;
  const deliveryFee = delivery === 'delivery' ? DELIVERY_FEE : 0;
  const credits = useCredits ? CREDITS : 0;
  const total = subtotal + deliveryFee + SERVICE_FEE + TAX + tip - credits;

  if (!isAuthenticated) {
    return null; // Will redirect to login
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

          {cart.items.length === 0 ? (
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
                    My Cart ({cart.items.length})
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  {cart.items.map(item => (
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
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <TextField placeholder="Coupon code" value={coupon} onChange={e => setCoupon(e.target.value)} size="small" sx={{ flex: 1 }} />
                    <Button variant="contained" color="inherit" sx={{ background: 'black', color: 'white', borderRadius: 0, px: 3, fontWeight: 700 }}>APPLY NOW</Button>
                  </Box>
                </Paper>
                {/* Order Summary */}
                <Paper sx={{ p: 3 }}>
                  <Typography variant="h6" fontWeight={700} gutterBottom>Your Order</Typography>
                  <Divider sx={{ mb: 2 }} />
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">Subtotal ({cart.itemCount} items)</Typography>
                    <Typography variant="body2">${subtotal.toFixed(2)}</Typography>
                  </Box>
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
                    disabled={loading}
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