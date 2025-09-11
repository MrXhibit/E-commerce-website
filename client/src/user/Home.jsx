import React, { useState, useEffect } from 'react';
import { 
  Box, Container, Typography, Grid, Button, Stack, Card, CardMedia, 
  CardContent, CardActions, Chip, Tabs, Tab, Paper, IconButton, 
  CircularProgress, Alert, Snackbar
} from '@mui/material';
import Header from './Header';
import Footer from './Footer';
import ProductCarousel from './components/ProductCarousel';
import HeroPinterestCarousel from './components/HeroPinterestCarousel';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { addToCart } from '../store/slices/cartSlice';
import { addToWishlist } from '../store/slices/wishlistSlice';
import userProductService from '../services/userProduct.service';
import { useNavigate } from 'react-router-dom';

const featuredTabs = [
  { label: "New Products", value: "new" },
  { label: "Best Selling", value: "best" },
  { label: "Featured", value: "featured" }
];

const MOCK_PRODUCTS = [
  {
    _id: 'prod1',
    name: 'iPhone 15 Pro Max',
    price: '1199.00',
    category: 'Electronics',
    images: [{ url: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=2560&q=100&fit=crop&auto=format' }],
    description: 'Revolutionary iPhone with titanium design and A17 Pro chip',
    isNew: true,
    isFeatured: true
  },
  {
    _id: 'prod2',
    name: 'MacBook Pro M3',
    price: '2499.00',
    category: 'Electronics',
    images: [{ url: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=2560&q=100&fit=crop&auto=format' }],
    description: 'Ultimate laptop with M3 Pro chip for creative professionals',
    isFeatured: true
  },
  {
    _id: 'prod3',
    name: 'Apple Watch Series 9',
    price: '399.99',
    category: 'Wearables',
    images: [{ url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=2560&q=100&fit=crop&auto=format' }],
    description: 'Advanced health monitoring with S9 chip',
    isNew: true
  },
  {
    _id: 'prod4',
    name: 'AirPods Pro 2nd Gen',
    price: '249.00',
    category: 'Audio',
    images: [{ url: 'https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=2560&q=100&fit=crop&auto=format' }],
    description: 'Premium wireless earbuds with active noise cancellation',
    isFeatured: true
  },
  {
    _id: 'prod5',
    name: 'Sony WH-1000XM5',
    price: '399.99',
    category: 'Audio',
    images: [{ url: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=2560&q=100&fit=crop&auto=format' }],
    description: 'Industry-leading noise cancelling headphones',
    isNew: true
  },
  {
    _id: 'prod6',
    name: 'PlayStation 5 Pro',
    price: '699.99',
    category: 'Gaming',
    images: [{ url: 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=2560&q=100&fit=crop&auto=format' }],
    description: 'Next-generation gaming with 4K 120fps performance',
    isFeatured: true
  },
  {
    _id: 'prod7',
    name: 'Samsung Galaxy S24 Ultra',
    price: '1299.99',
    category: 'Electronics',
    images: [{ url: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=2560&q=100&fit=crop&auto=format' }],
    description: 'Revolutionary AI-powered smartphone with S Pen',
    isNew: true,
    isFeatured: true
  },
  {
    _id: 'prod8',
    name: 'DJI Mini 4 Pro Drone',
    price: '759.00',
    category: 'Electronics',
    images: [{ url: 'https://images.unsplash.com/photo-1579829366248-204fe8413f31?w=2560&q=100&fit=crop&auto=format' }],
    description: 'Ultra-lightweight drone with 4K video and obstacle avoidance',
    isNew: true
  },
  {
    _id: 'prod9',
    name: 'Nike Air Max 270',
    price: '150.00',
    category: 'Footwear',
    images: [{ url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=2560&q=100&fit=crop&auto=format' }],
    description: 'Maximum comfort with visible Air unit for all-day wear',
    isFeatured: true
  },
  {
    _id: 'prod10',
    name: 'Canon EOS R5',
    price: '3899.00',
    category: 'Electronics',
    images: [{ url: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=2560&q=100&fit=crop&auto=format' }],
    description: 'Professional mirrorless camera with 8K video recording',
    isFeatured: true
  },
  {
    _id: 'prod11',
    name: 'Tesla Model 3',
    price: '38990.00',
    category: 'Automotive',
    images: [{ url: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=2560&q=100&fit=crop&auto=format' }],
    description: 'Electric sedan with autopilot and 358-mile range',
    isNew: true
  },
  {
    _id: 'prod12',
    name: 'Rolex Submariner',
    price: '8950.00',
    category: 'Luxury',
    images: [{ url: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=2560&q=100&fit=crop&auto=format' }],
    description: 'Iconic diving watch with 300m water resistance',
    isFeatured: true
  }
];

const Home = () => {
  const [tab, setTab] = useState('new');
  const [products, setProducts] = useState([]);
  const [heroProducts, setHeroProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [heroLoading, setHeroLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState({});
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAppSelector(state => state.auth);
  const { items: wishlistItems } = useAppSelector(state => state.wishlist);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        // Use the new user product service
        const normalizedProducts = await userProductService.getAllProducts(24, 0);
        console.log(`Fetched ${normalizedProducts.length} products from backend`);
        setProducts(normalizedProducts);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Failed to load products. Please try again later.');
        // Don't set mock data - show error instead
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  // Fetch featured products for hero carousel
  useEffect(() => {
    const fetchHeroProducts = async () => {
      setHeroLoading(true);
      try {
        // Use the new user product service for featured products
        const featuredProducts = await userProductService.getFeaturedProducts(6);
        setHeroProducts(featuredProducts);
        console.log(`Fetched ${featuredProducts.length} featured products for hero carousel`);
      } catch (err) {
        console.error('Error fetching hero products:', err);
        // Don't set mock data - show empty state instead
        setHeroProducts([]);
      } finally {
        setHeroLoading(false);
      }
    };
    fetchHeroProducts();
  }, []);

  const handleAddToCart = async (productId, event) => {
    event.stopPropagation();
    if (!isAuthenticated) {
      setSnackbar({ open: true, message: 'Please login to add items to cart', severity: 'warning' });
      return;
    }

    setActionLoading(prev => ({ ...prev, [`cart-${productId}`]: true }));
    try {
      const result = await dispatch(addToCart({ productId, quantity: 1 })).unwrap();
      setSnackbar({ open: true, message: 'Added to cart successfully!', severity: 'success' });
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
      const result = await dispatch(addToWishlist(productId)).unwrap();
      setSnackbar({ open: true, message: 'Added to wishlist successfully!', severity: 'success' });
    } catch (error) {
      setSnackbar({ open: true, message: 'Failed to add to wishlist', severity: 'error' });
    } finally {
      setActionLoading(prev => ({ ...prev, [`wishlist-${productId}`]: false }));
    }
  };

  const isInWishlist = (productId) => {
    return wishlistItems.some(item => item.productId === productId);
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleViewProduct = (productId) => {
    console.log('Navigating to product:', productId);
    if (!productId || productId === 'undefined') {
      console.error('Invalid product ID:', productId);
      return;
    }
    navigate(`/products/${productId}`);
  };

  const handleTabChange = (_, newValue) => {
    setTab(newValue);
  };

  return (
    <>
      <Header />
      <Box sx={{ background: '#fafbfc', minHeight: '100vh' }}>
        {/* Hero Carousel Section - DB-powered, optimized for 1920px */}
        {heroLoading ? (
          <Box
            sx={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              py: { xs: 6, md: 10, xl: 12 },
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              minHeight: { xs: 500, md: 600, xl: 700 }
            }}
          >
            <CircularProgress color="inherit" size={60} />
          </Box>
        ) : (
          <HeroPinterestCarousel 
            products={heroProducts} 
            onAddToCart={handleAddToCart}
          />
        )}

        {/* Trending Products Section - Tabbed carousel, optimized for 1920px */}
        <Container maxWidth="xl" sx={{ py: { xs: 6, md: 8, xl: 10 } }}>
          <Typography 
            variant="h4" 
            component="h2" 
            fontWeight={600}
            sx={{ 
              mb: 4,
              textAlign: { xs: 'center', md: 'left' },
              fontSize: { xs: '1.75rem', md: '2.125rem', xl: '2.5rem' }
            }}
          >
            Trending Products
          </Typography>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
              <CircularProgress size={60} />
            </Box>
          ) : error ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
              <Alert severity="error" sx={{ fontSize: '1.1rem' }}>{error}</Alert>
            </Box>
          ) : products.length > 0 ? (
            <Box>
              {/* Enhanced Tabs - optimized for 1920px */}
              <Box sx={{ mb: 4 }}>
                <Tabs
                  value={tab}
                  onChange={handleTabChange}
                  sx={{
                    '& .MuiTabs-indicator': {
                      height: 3,
                      borderRadius: 1.5
                    },
                    '& .MuiTab-root': {
                      textTransform: 'none',
                      fontWeight: 600,
                      fontSize: { xs: '0.9rem', md: '1rem', xl: '1.125rem' },
                      minWidth: { xs: 100, md: 120, xl: 140 },
                      px: { xs: 2, md: 3, xl: 4 }
                    }
                  }}
                >
                  {featuredTabs.map((tabItem) => (
                    <Tab
                      key={tabItem.value}
                      label={tabItem.label}
                      value={tabItem.value}
                    />
                  ))}
                </Tabs>
              </Box>
              <ProductCarousel
                products={products}
                tabs={featuredTabs}
                onAddToCart={handleAddToCart}
                onAddToWishlist={handleAddToWishlist}
                isInWishlist={isInWishlist}
                cartLoading={actionLoading}
                currentTab={tab}
                onTabChange={handleTabChange}
              />
            </Box>
          ) : (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <Typography variant="h6" color="text.secondary" sx={{ fontSize: '1.1rem' }}>
                No products available
              </Typography>
            </Box>
          )}
        </Container>
      </Box>
      
      <Footer />
      
      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default Home;