import React, { useState, useEffect } from 'react';
import { Box, Container, Typography, Grid, Button, Stack, Card, CardMedia, CardContent, CardActions, Chip, Tabs, Tab, Paper, Divider, Avatar, IconButton, CircularProgress, Alert, Snackbar } from '@mui/material';
import Header from './Header';
import Footer from './Footer';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import ReplayIcon from '@mui/icons-material/Replay';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'; 
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { useAuth } from '../contexts/AuthContext';
import apiService from '../services/api';
import { useNavigate } from 'react-router-dom';

// Mock data
const hero = {
  title: "Season Sale",
  subtitle: "MEN'S FASHION",
  offer: 'Min. 35-70% Off',
  cta1: 'Shop Now',
  cta2: 'Read More',
  image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80',
};

const highlights = [
  { icon: <LocalShippingIcon fontSize="large" color="primary" />, label: 'Free Shipping' },
  { icon: <ReplayIcon fontSize="large" color="primary" />, label: '100% Money Back' },
  { icon: <SupportAgentIcon fontSize="large" color="primary" />, label: 'Online Support' },
];

const promoBanners = [
  { label: 'Handbag', discount: '25% Off', image: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=600&q=80' },
  { label: 'Watch', discount: '45% Off', image: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=600&q=80' },
  { label: 'Backpack', discount: '40% Off', image: 'https://images.unsplash.com/photo-1517263904808-5dc0d6d4c08e?auto=format&fit=crop&w=600&q=80' },
];

const featuredTabs = [
  { label: 'New Arrival', value: 'new' },
  { label: 'Best Selling', value: 'best' },
  { label: 'Top Rated', value: 'top' },
];

const categories = [
  { label: 'Men', image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80' },
  { label: 'Women', image: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=400&q=80' },
  { label: 'Accessories', image: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80' },
  { label: 'Watches', image: 'https://images.unsplash.com/photo-1517263904808-5dc0d6d4c08e?auto=format&fit=crop&w=400&q=80' },
];

const Home = () => {
  const [tab, setTab] = useState('new');
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
        const response = await apiService.getProducts(20, 0);
        if (response.success && response.data) {
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

  // Carousel settings
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    responsive: [
      { breakpoint: 1200, settings: { slidesToShow: 3 } },
      { breakpoint: 900, settings: { slidesToShow: 2 } },
      { breakpoint: 600, settings: { slidesToShow: 1 } },
    ],
    arrows: true, // Use default arrows
  };

  return (
    <>
      <Header />
      <Box sx={{ background: '#fafbfc', minHeight: '100vh' }}>
        {/* Hero Section */}
        <Box sx={{ background: 'white', py: { xs: 4, md: 8 }, px: 2 }}>
          <Container maxWidth={false} sx={{ px: { xs: 1, sm: 3, md: 8, lg: 16 } }}>
            <Grid container spacing={6} alignItems="center" justifyContent="center">
              <Grid item xs={12} md={6} lg={5}>
                <Typography variant="h5" color="primary" fontWeight={700} sx={{ mb: 1 }}>{hero.title}</Typography>
                <Typography variant="h2" fontWeight={900} sx={{ mb: 1 }}>{hero.subtitle}</Typography>
                <Typography variant="h5" color="text.secondary" sx={{ mb: 3 }}>{hero.offer}</Typography>
                <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
                  <Button variant="contained" color="primary" size="large" onClick={() => navigate('/products')}>{hero.cta1}</Button>
                  <Button variant="outlined" color="primary" size="large">{hero.cta2}</Button>
                </Stack>
              </Grid>
              <Grid item xs={12} md={6} lg={5} sx={{ textAlign: 'center' }}>
                <img src={hero.image} alt="Hero" style={{ width: '100%', maxWidth: 420, borderRadius: 24, boxShadow: '0 4px 24px rgba(0,0,0,0.08)' }} />
              </Grid>
            </Grid>
          </Container>
        </Box>
        {/* Service Highlights */}
        <Container maxWidth={false} sx={{ py: 4, px: { xs: 1, sm: 3, md: 8, lg: 16 } }}>
          <Grid container spacing={4} justifyContent="center">
            {highlights.map((h, i) => (
              <Grid item xs={12} sm={4} md={4} key={i} sx={{ textAlign: 'center' }}>
                <Box>{h.icon}</Box>
                <Typography variant="subtitle1" fontWeight={700}>{h.label}</Typography>
              </Grid>
            ))}
          </Grid>
        </Container>
        {/* Promo Banners */}
        <Container maxWidth={false} sx={{ py: 2, px: { xs: 1, sm: 3, md: 8, lg: 16 } }}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6} lg={4}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', background: '#f5f5f5', p: 2 }}>
                <img src="https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80" alt="Women's Style" style={{ width: '100%', borderRadius: 12, marginBottom: 8 }} />
                <Typography variant="h6" fontWeight={700}>Women's Style</Typography>
                <Typography variant="body2" color="text.secondary">Up to 70% Off</Typography>
              </Card>
            </Grid>
            {promoBanners.map((b, i) => (
              <Grid item xs={12} md={2} lg={2} key={i}>
                <Card sx={{ height: '100%', background: '#f5f5f5', p: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <img src={b.image} alt={b.label} style={{ width: '100%', borderRadius: 12, marginBottom: 8 }} />
                  <Typography variant="subtitle1" fontWeight={700}>{b.label}</Typography>
                  <Chip label={b.discount} color="primary" size="small" sx={{ mt: 1 }} />
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
        {/* Featured Products with Tabs as Carousel */}
        <Container maxWidth={false} sx={{ py: 6, px: { xs: 1, sm: 3, md: 8, lg: 16 } }}>
          <Typography variant="h5" fontWeight={700} sx={{ mb: 2 }}>Featured Products</Typography>
          <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 3 }}>
            {featuredTabs.map(t => <Tab key={t.value} value={t.value} label={t.label} />)}
          </Tabs>
          
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress />
            </Box>
          ) : error ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <Alert severity="error">{error}</Alert>
            </Box>
          ) : products.length > 0 ? (
            <Box sx={{ width: '100%' }}>
              <Slider {...sliderSettings}>
                {products.map(product => (
                  <Box key={product._id || product.id} sx={{ px: 2 }}>
                    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', boxShadow: 2 }}>
                      <CardMedia component="img" height="180" image={product.images?.[0]?.url || 'https://source.unsplash.com/featured/?product'} alt={product.name} />
                      <CardContent>
                        <Typography variant="subtitle1" fontWeight={600}>{product.name}</Typography>
                        <Typography variant="body2" color="text.secondary">${product.price}</Typography>
                      </CardContent>
                      <CardActions sx={{ mt: 'auto' }}>
                        <Button 
                          size="small" 
                          variant="contained" 
                          endIcon={<ShoppingCartIcon />}
                          onClick={(e) => handleAddToCart(product._id || product.id, e)}
                          disabled={actionLoading[`cart-${product._id || product.id}`]}
                        >
                          {actionLoading[`cart-${product._id || product.id}`] ? 'Adding...' : 'Add to Cart'}
                        </Button>
                        <IconButton 
                          color="primary" 
                          onClick={(e) => handleAddToWishlist(product._id || product.id, e)}
                          disabled={actionLoading[`wishlist-${product._id || product.id}`]}
                        >
                          {isInWishlist(product._id || product.id) ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                        </IconButton>
                      </CardActions>
                    </Card>
                  </Box>
                ))}
              </Slider>
            </Box>
          ) : (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="h6" color="text.secondary">No products available</Typography>
            </Box>
          )}
        </Container>
        {/* Shop by Category */}
        <Container maxWidth={false} sx={{ py: 6, px: { xs: 1, sm: 3, md: 8, lg: 16 } }}>
          <Typography variant="h5" fontWeight={700} sx={{ mb: 2 }}>Featured Categories</Typography>
          <Grid container spacing={4} justifyContent="center">
            {categories.map((cat, i) => (
              <Grid item xs={6} sm={3} md={2} key={i} sx={{ textAlign: 'center' }}>
                <Avatar src={cat.image} alt={cat.label} sx={{ width: 80, height: 80, mx: 'auto', mb: 1 }} />
                <Typography variant="subtitle1" fontWeight={600}>{cat.label}</Typography>
              </Grid>
            ))}
          </Grid>
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

export default Home;