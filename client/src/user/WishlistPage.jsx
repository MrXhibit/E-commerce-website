import React, { useState, useEffect } from 'react';
import { Box, Container, Typography, Button, Divider, Link, TextField, Alert, CircularProgress } from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

const WishlistPage = () => {
  const { wishlist, removeFromWishlist, clearWishlist, addToCart, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  const handleRemove = async (productId) => {
    setLoading(true);
    try {
      await removeFromWishlist(productId);
    } catch (error) {
      console.error('Failed to remove from wishlist:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (productId) => {
    setLoading(true);
    try {
      const result = await addToCart(productId, 1);
      if (result.success) {
        alert('Item added to cart successfully!');
      } else {
        alert(result.message || 'Failed to add to cart');
      }
    } catch (error) {
      alert('Failed to add item to cart');
    } finally {
      setLoading(false);
    }
  };

  const handleAddAllToCart = async () => {
    setLoading(true);
    try {
      for (const item of wishlist.items) {
        await addToCart(item.productId, 1);
      }
      alert('All items added to cart successfully!');
    } catch (error) {
      alert('Failed to add some items to cart');
    } finally {
      setLoading(false);
    }
  };

  const handleClearWishlist = async () => {
    setLoading(true);
    try {
      await clearWishlist();
    } catch (error) {
      console.error('Failed to clear wishlist:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return null; // Will redirect to login
  }

  return (
    <>
      <Header />
      <Box sx={{ background: '#fafbfc', minHeight: '100vh', py: 6 }}>
        <Container maxWidth="md">
          <Typography variant="h4" fontWeight={700} align="center" gutterBottom>
            Wishlist
          </Typography>
          <Divider sx={{ my: 3 }} />
          
          {loading && (
            <Box sx={{ width: '100%', mb: 2 }}>
              <CircularProgress />
            </Box>
          )}

          {wishlist.items.length === 0 ? (
            <Box sx={{ textAlign: 'center', mt: 4 }}>
              <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
                Your wishlist is empty.
              </Typography>
              <Button 
                variant="contained" 
                color="primary" 
                onClick={() => navigate('/products')}
                sx={{ fontWeight: 600 }}
              >
                Start Shopping
              </Button>
            </Box>
          ) : (
            <>
              {wishlist.items.map(item => (
                <Box key={item.productId} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 4 }}>
                  {/* Info left */}
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="subtitle1" fontWeight={600}>{item.product.name}</Typography>
                    <Typography variant="body2">{item.product.price}</Typography>
                    <Typography variant="body2" color="text.secondary">Brand: {item.product.brandName}</Typography>
                    <Typography variant="body2" color="text.secondary">Model: {item.product.modelName}</Typography>
                    <Button 
                      variant="outlined" 
                      sx={{ mt: 2, mb: 1, borderRadius: 0, textTransform: 'none', width: 180 }} 
                      onClick={() => handleAddToCart(item.productId)}
                      disabled={loading}
                    >
                      Add to bag
                    </Button>
                    <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
                      <Link component="button" underline="hover" sx={{ fontSize: 14 }} onClick={() => alert('Edit feature coming soon!')}>Edit</Link>
                      <Link component="button" underline="hover" sx={{ fontSize: 14 }} onClick={() => handleRemove(item.productId)} disabled={loading}>Remove item</Link>
                      <Link component="button" underline="hover" sx={{ fontSize: 14 }} onClick={() => alert('Add comment feature coming soon!')}>Add comment</Link>
                    </Box>
                  </Box>
                  {/* Image right */}
                  <Box sx={{ ml: 4 }}>
                    <img 
                      src={item.product.images[0]?.url || 'https://via.placeholder.com/100'} 
                      alt={item.product.name} 
                      style={{ width: 100, height: 100, objectFit: 'cover', borderRadius: 4 }} 
                    />
                  </Box>
                </Box>
              ))}
              <Divider sx={{ my: 3 }} />
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 4 }}>
                <Box>
                  <Link component="button" underline="hover" sx={{ fontSize: 15, mr: 3 }} onClick={() => alert('Update wishlist feature coming soon!')}>Update wishlist</Link>
                  <Link component="button" underline="hover" sx={{ fontSize: 15 }} onClick={() => alert('Share wishlist feature coming soon!')}>Share wishlist</Link>
                </Box>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Button 
                    variant="outlined" 
                    color="error" 
                    onClick={handleClearWishlist}
                    disabled={loading}
                    sx={{ fontWeight: 600 }}
                  >
                    Clear Wishlist
                  </Button>
                  <Button 
                    variant="contained" 
                    color="inherit" 
                    sx={{ background: 'black', color: 'white', px: 5, py: 1.5, borderRadius: 0, fontWeight: 700, fontSize: 16 }} 
                    onClick={handleAddAllToCart}
                    disabled={loading}
                  >
                    Add all to bag
                  </Button>
                </Box>
              </Box>
            </>
          )}
        </Container>
      </Box>
      <Footer />
    </>
  );
};

export default WishlistPage;