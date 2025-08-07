import React, { useEffect, useState } from 'react';
import { Box, Container, Typography, Grid, Card, CardMedia, CardContent, CardActions, Button, IconButton, Chip, Stack, Divider, Paper, CircularProgress, Alert, TextField, Snackbar } from '@mui/material';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import apiService from '../services/api';
import Header from './Header';
import Footer from './Footer';

// Mock categories
const categories = [
  { name: 'Computers', image: 'https://source.unsplash.com/featured/?computer', highlight: true },
  { name: 'Headphones', image: 'https://source.unsplash.com/featured/?headphones' },
  { name: 'Accessories', image: 'https://source.unsplash.com/featured/?accessories' },
  { name: 'Smartphones', image: 'https://source.unsplash.com/featured/?smartphone' },
];

const ProductPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState({});
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const { isAuthenticated, addToCart, addToWishlist, wishlist } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await apiService.getProducts();
        if (response.success) {
          setProducts(response.data || []);
        } else {
          setError('Failed to load products.');
        }
      } catch (err) {
        setError('Failed to load products.');
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleAddToCart = async (productId, event) => {
    event.stopPropagation();
    if (!isAuthenticated) {
      setSnackbar({ open: true, message: 'Please login to add items to cart', severity: 'warning' });
      return;
    }

    setActionLoading(prev => ({ ...prev, [`cart-${productId}`]: true }));
    try {
      const result = await addToCart(productId, 1);
      if (result.success) {
        setSnackbar({ open: true, message: 'Added to cart successfully!', severity: 'success' });
      } else {
        setSnackbar({ open: true, message: result.message || 'Failed to add to cart', severity: 'error' });
      }
    } catch (error) {
      setSnackbar({ open: true, message: 'Failed to add to cart', severity: 'error' });
    } finally {
      setActionLoading(prev => ({ ...prev, [`cart-${productId}`]: false }));
    }
  };

  const handleAddToWishlist = async (productId, event) => {
    event.stopPropagation();
    if (!isAuthenticated) {
      setSnackbar({ open: true, message: 'Please login to add items to wishlist', severity: 'warning' });
      return;
    }

    setActionLoading(prev => ({ ...prev, [`wishlist-${productId}`]: true }));
    try {
      const result = await addToWishlist(productId);
      if (result.success) {
        setSnackbar({ open: true, message: 'Added to wishlist successfully!', severity: 'success' });
      } else {
        setSnackbar({ open: true, message: result.message || 'Failed to add to wishlist', severity: 'error' });
      }
    } catch (error) {
      setSnackbar({ open: true, message: 'Failed to add to wishlist', severity: 'error' });
    } finally {
      setActionLoading(prev => ({ ...prev, [`wishlist-${productId}`]: false }));
    }
  };

  const isInWishlist = (productId) => {
    return wishlist.items.some(item => item.productId === productId);
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <>
      <Header />
      <Box sx={{ background: '#fafbfc', minHeight: '100vh' }}>
        {/* Hero/Category Banner */}
        <Box sx={{ background: 'white', py: 5, mb: 4, boxShadow: 1 }}>
          <Container>
            <Grid container spacing={4} alignItems="center">
              <Grid item xs={12} md={6}>
                <Typography variant="h3" fontWeight={700} gutterBottom>
                  Shop Computers & Accessories
                </Typography>
                <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
                  Discover the latest in tech and accessories. Unbeatable prices, fast delivery.
                </Typography>
                <Stack direction="row" spacing={2}>
                  {categories.map((cat) => (
                    <Chip key={cat.name} label={cat.name} color={cat.highlight ? 'primary' : 'default'} />
                  ))}
                </Stack>
              </Grid>
              <Grid item xs={12} md={6}>
                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                  <img src={categories[0].image} alt="Category" style={{ width: '80%', borderRadius: 16, boxShadow: '0 4px 24px rgba(0,0,0,0.08)' }} />
                </Box>
              </Grid>
            </Grid>
          </Container>
        </Box>

        {/* Loading/Error State */}
        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress />
          </Box>
        )}
        {error && (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <Alert severity="error">{error}</Alert>
          </Box>
        )}

        {/* Horizontal Product Carousel/Section */}
        {!loading && !error && products.length > 0 && (
          <Container sx={{ mb: 6 }}>
            <Typography variant="h5" fontWeight={700} sx={{ mb: 2 }}>
              Featured Products
            </Typography>
            <Box sx={{ overflowX: 'auto', pb: 2 }}>
              <Stack direction="row" spacing={3}>
                {products.slice(0, 5).map((product) => (
                  <Card key={product._id || product.id} sx={{ minWidth: 220, maxWidth: 220, boxShadow: 2, cursor: 'pointer' }} onClick={() => navigate(`/products/${product._id || product.id}`)}>
                    <CardMedia component="img" height="140" image={product.images?.[0]?.url || 'https://source.unsplash.com/featured/?product'} alt={product.name} />
                    <CardContent>
                      <Typography variant="subtitle1" fontWeight={600}>{product.name}</Typography>
                      <Typography variant="body2" color="text.secondary">${product.price}</Typography>
                    </CardContent>
                    <CardActions>
                      <IconButton 
                        color="primary" 
                        onClick={(e) => handleAddToWishlist(product._id || product.id, e)}
                        disabled={actionLoading[`wishlist-${product._id || product.id}`]}
                      >
                        {isInWishlist(product._id || product.id) ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                      </IconButton>
                      <Button 
                        size="small" 
                        variant="contained" 
                        endIcon={<ShoppingCartIcon />}
                        onClick={(e) => handleAddToCart(product._id || product.id, e)}
                        disabled={actionLoading[`cart-${product._id || product.id}`]}
                      >
                        {actionLoading[`cart-${product._id || product.id}`] ? 'Adding...' : 'Add'}
                      </Button>
                    </CardActions>
                  </Card>
                ))}
              </Stack>
            </Box>
          </Container>
        )}

        {/* Product Grid */}
        {!loading && !error && products.length > 0 && (
          <Container sx={{ mb: 6 }}>
            <Typography variant="h5" fontWeight={700} sx={{ mb: 2 }}>
              All Products
            </Typography>
            <Grid container spacing={4}>
              {products.map((product) => (
                <Grid item xs={12} sm={6} md={3} key={product._id || product.id}>
                  <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', boxShadow: 2, cursor: 'pointer' }} onClick={() => navigate(`/products/${product._id || product.id}`)}>
                    <CardMedia component="img" height="160" image={product.images?.[0]?.url || 'https://source.unsplash.com/featured/?product'} alt={product.name} />
                    <CardContent>
                      <Typography variant="subtitle1" fontWeight={600}>{product.name}</Typography>
                      <Typography variant="body2" color="text.secondary">${product.price}</Typography>
                    </CardContent>
                    <CardActions sx={{ mt: 'auto' }}>
                      <IconButton 
                        color="primary" 
                        onClick={(e) => handleAddToWishlist(product._id || product.id, e)}
                        disabled={actionLoading[`wishlist-${product._id || product.id}`]}
                      >
                        {isInWishlist(product._id || product.id) ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                      </IconButton>
                      <Button 
                        size="small" 
                        variant="contained" 
                        endIcon={<ShoppingCartIcon />}
                        onClick={(e) => handleAddToCart(product._id || product.id, e)}
                        disabled={actionLoading[`cart-${product._id || product.id}`]}
                      >
                        {actionLoading[`cart-${product._id || product.id}`] ? 'Adding...' : 'Add'}
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Container>
        )}

        {/* Promo/Info Section */}
        <Container sx={{ mb: 6 }}>
          <Paper sx={{ p: 4, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', background: 'linear-gradient(90deg, #f7fafc 60%, #e3e6f3 100%)' }}>
            <Box>
              <Typography variant="h5" fontWeight={700} gutterBottom>Subscribe to the News</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>Get exclusive offers and updates straight to your inbox.</Typography>
              <Stack direction="row" spacing={2}>
                <TextField size="small" placeholder="Enter your email" sx={{ background: 'white', borderRadius: 1 }} />
                <Button variant="contained" color="primary">Subscribe</Button>
              </Stack>
            </Box>
            <Box sx={{ display: { xs: 'none', md: 'block' } }}>
              <img src="https://source.unsplash.com/featured/?smile,person" alt="Subscribe" style={{ width: 120, borderRadius: 16 }} />
            </Box>
          </Paper>
        </Container>
      </Box>
      <Footer />
      
      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default ProductPage;