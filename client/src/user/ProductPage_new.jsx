import React, { useEffect, useState } from 'react';
import { Box, Container, Typography, Card, CardMedia, CardContent, CardActions, Button, IconButton, Chip, Stack, Divider, Paper, CircularProgress, Alert, TextField, Snackbar, InputAdornment } from '@mui/material';
import Grid from '@mui/material/Grid2';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import SearchIcon from '@mui/icons-material/Search';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import apiService from '../services/api';
import Header from './Header';
import Footer from './Footer';

// Comprehensive categories similar to Amazon
const categories = [
  // Electronics & Technology
  { name: 'Computers', image: 'https://images.unsplash.com/photo-1547082299-de196ea013d6?w=100&h=100&fit=crop', highlight: true, category: 'electronics' },
  { name: 'Laptops', image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=100&h=100&fit=crop', category: 'electronics' },
  { name: 'Smartphones', image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=100&h=100&fit=crop', category: 'electronics' },
  { name: 'Headphones', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100&h=100&fit=crop', category: 'electronics' },
  { name: 'Gaming', image: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=100&h=100&fit=crop', category: 'electronics' },
  { name: 'Cameras', image: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=100&h=100&fit=crop', category: 'electronics' },
  { name: 'TV & Audio', image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=100&h=100&fit=crop', category: 'electronics' },
  { name: 'Smart Home', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=100&h=100&fit=crop', category: 'electronics' },
  
  // Home & Garden
  { name: 'Furniture', image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=100&h=100&fit=crop', category: 'home' },
  { name: 'Home Decor', image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=100&h=100&fit=crop', category: 'home' },
  { name: 'Kitchen', image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=100&h=100&fit=crop', category: 'home' },
  { name: 'Bedding', image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=100&h=100&fit=crop', category: 'home' },
  { name: 'Garden', image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=100&h=100&fit=crop', category: 'home' },
  { name: 'Tools', image: 'https://images.unsplash.com/photo-1572981779307-38b8cabb2407?w=100&h=100&fit=crop', category: 'home' },
  
  // Fashion & Beauty
  { name: 'Clothing', image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=100&h=100&fit=crop', category: 'fashion' },
  { name: 'Shoes', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=100&h=100&fit=crop', category: 'fashion' },
  { name: 'Jewelry', image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=100&h=100&fit=crop', category: 'fashion' },
  { name: 'Watches', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100&h=100&fit=crop', category: 'fashion' },
  { name: 'Beauty', image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=100&h=100&fit=crop', category: 'fashion' },
  { name: 'Bags', image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=100&h=100&fit=crop', category: 'fashion' },
  
  // Sports & Outdoors
  { name: 'Sports', image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=100&h=100&fit=crop', category: 'sports' },
  { name: 'Fitness', image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=100&h=100&fit=crop', category: 'sports' },
  { name: 'Outdoor', image: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=100&h=100&fit=crop', category: 'sports' },
  { name: 'Cycling', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=100&h=100&fit=crop', category: 'sports' },
  
  // Health & Personal Care
  { name: 'Health', image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=100&h=100&fit=crop', category: 'health' },
  { name: 'Personal Care', image: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=100&h=100&fit=crop', category: 'health' },
  { name: 'Vitamins', image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=100&h=100&fit=crop', category: 'health' },
  
  // Books & Media
  { name: 'Books', image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=100&h=100&fit=crop', category: 'media' },
  { name: 'Music', image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=100&h=100&fit=crop', category: 'media' },
  { name: 'Movies', image: 'https://images.unsplash.com/photo-1489599904472-af35ff2c7c3f?w=100&h=100&fit=crop', category: 'media' },
  
  // Automotive & Industrial
  { name: 'Automotive', image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=100&h=100&fit=crop', category: 'automotive' },
  { name: 'Industrial', image: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=100&h=100&fit=crop', category: 'automotive' },
  
  // Baby & Kids
  { name: 'Baby', image: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=100&h=100&fit=crop', category: 'kids' },
  { name: 'Toys', image: 'https://images.unsplash.com/photo-1558877385-1c2d7b8e8b8b?w=100&h=100&fit=crop', category: 'kids' },
  { name: 'Kids Fashion', image: 'https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?w=100&h=100&fit=crop', category: 'kids' },
  
  // Pet Supplies
  { name: 'Pet Supplies', image: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=100&h=100&fit=crop', category: 'pets' },
  
  // Office & School
  { name: 'Office', image: 'https://images.unsplash.com/photo-1497032628192-86f99bcd76bc?w=100&h=100&fit=crop', category: 'office' },
  { name: 'Stationery', image: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=100&h=100&fit=crop', category: 'office' },
];

const ProductPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState({});
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const { isAuthenticated, addToCart, addToWishlist, wishlist } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Helper function to safely get category string
  const getCategoryString = (product) => {
    if (!product || !product.category) return '';
    if (typeof product.category === 'string') return product.category;
    if (typeof product.category === 'object' && product.category.name) return product.category.name;
    return '';
  };

  // Helper function to format price
  const formatPrice = (price) => {
    if (typeof price === 'string') {
      return price.startsWith('$') ? price : `$${price}`;
    }
    return `$${price?.toFixed(2) || '0.00'}`;
  };

  // Fetch products from backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await apiService.getProducts(50, 0); // Fetch 50 products
        console.log('Full API response:', response);
        
        if (response.success && response.data) {
          // Backend returns { success, data, message } where data contains the products array
          let productsArray;
          if (Array.isArray(response.data)) {
            productsArray = response.data;
          } else if (response.data.products && Array.isArray(response.data.products)) {
            productsArray = response.data.products;
          } else {
            console.error('Unexpected response structure:', response.data);
            setError('Invalid response format from server');
            return;
          }
          
          // Ensure products is always an array before setting state
          if (Array.isArray(productsArray)) {
            setProducts(productsArray);
            console.log('Products fetched successfully:', productsArray.length);
          } else {
            console.error('Products is not an array:', productsArray);
            setError('Invalid products format from server');
          }
        } else {
          console.error('API response indicates failure:', response);
          setError(response.message || 'Failed to fetch products');
        }
      } catch (err) {
        console.error('Error fetching products:', err);
        setError(err.message || 'Failed to fetch products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Handle URL parameters for category filtering
  useEffect(() => {
    const categoryParam = searchParams.get('category');
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    }
  }, [searchParams]);

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

  const handleCategoryClick = (categoryName) => {
    setSelectedCategory(selectedCategory === categoryName ? null : categoryName);
  };

  const filteredProducts = products.filter(product => {
    // Ensure product is valid before filtering
    if (!product || typeof product !== 'object') {
      console.warn('Invalid product found during filtering:', product);
      return false;
    }
    
    const matchesSearch = searchTerm === '' || 
      (product.name && product.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (product.description && product.description.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = !selectedCategory || 
      getCategoryString(product).toLowerCase().includes(selectedCategory.toLowerCase());
    
    return matchesSearch && matchesCategory;
  });

  return (
    <>
      <Header />
      <Box sx={{ background: '#fafbfc', minHeight: '100vh' }}>
        {/* Hero Banner */}
        <Box sx={{ backgroundColor: 'primary.main', py: 6, mb: 4, color: 'primary.contrastText' }}>
          <Container>
            <Grid spacing={4} alignItems="center">
                              <Grid xs={12} md={6}>
                <Typography variant="h2" fontWeight={700} gutterBottom>
                  Everything You Need
                </Typography>
                <Typography variant="h5" sx={{ mb: 3, opacity: 0.9 }}>
                  From electronics to home essentials, discover millions of products with unbeatable prices and fast delivery.
                </Typography>
              </Grid>
            </Grid>
          </Container>
        </Box>

        {/* Search and Filter Section */}
        <Container maxWidth="xl" sx={{ mb: 4, px: { xs: 2, sm: 3, md: 4 } }}>
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
            <TextField
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              sx={{ 
                width: { xs: '100%', sm: '500px', md: '600px' },
                '& .MuiOutlinedInput-root': {
                  borderRadius: '25px',
                  backgroundColor: 'white'
                }
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="action" />
                  </InputAdornment>
                )
              }}
            />
          </Box>
          
          {selectedCategory && (
            <Box sx={{ textAlign: 'center', mb: 2 }}>
              <Chip 
                label={`Category: ${selectedCategory}`}
                onDelete={() => setSelectedCategory(null)}
                color="primary"
                variant="outlined"
                size="medium"
              />
            </Box>
          )}
        </Container>

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

        {/* Product Carousels by Category */}
        {!loading && !error && products.length > 0 && (
          <Container maxWidth="xl" sx={{ mb: 6, px: { xs: 2, sm: 3, md: 4 } }}>
            {/* Electronics & Technology */}
            <Box sx={{ mb: 6 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h5" fontWeight={700} sx={{ color: 'primary.main' }}>
                  📱 Electronics & Technology
                </Typography>
                <Button 
                  variant="outlined" 
                  size="small"
                  onClick={() => navigate('/electronics')}
                  sx={{ textTransform: 'none' }}
                >
                  View All
                </Button>
              </Box>
              <Box sx={{ overflowX: 'auto', pb: 2 }}>
                <Stack direction="row" spacing={{ xs: 2, sm: 3 }} sx={{ minWidth: 'max-content' }}>
                  {(() => {
                    const electronicsProducts = products.filter(product => {
                      if (!product || typeof product !== 'object') {
                        console.warn('Invalid product found during electronics filtering:', product);
                        return false;
                      }
                      return getCategoryString(product).toLowerCase() === 'electronics';
                    });
                    console.log('Electronics products found:', electronicsProducts.length);
                    return electronicsProducts.slice(0, 8).map((product) => {
                      if (!product || !product._id) {
                        console.warn('Invalid product found during electronics mapping:', product);
                        return null;
                      }
                      return (
                    <Card 
                      key={product._id || product.id} 
                      sx={{ 
                        minWidth: { xs: 160, sm: 180, md: 200 }, 
                        maxWidth: { xs: 160, sm: 180, md: 200 }, 
                        boxShadow: 2, 
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        '&:hover': { transform: 'translateY(-4px)', boxShadow: 4 }
                      }} 
                      onClick={() => navigate(`/products/${product._id || product.id}`)}
                    >
                      <CardMedia 
                        component="img" 
                        height="120" 
                        image={product.images?.[0]?.url || 'https://via.placeholder.com/400x300?text=No+Image'} 
                        alt={product.name} 
                      />
                      <CardContent sx={{ p: { xs: 1, sm: 1.5 } }}>
                        <Typography 
                          variant="subtitle2" 
                          fontWeight={600} 
                          sx={{ 
                            fontSize: { xs: '0.8rem', sm: '0.9rem' },
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            minHeight: '2.4em'
                          }}
                        >
                          {product.name}
                        </Typography>
                        <Typography variant="body2" color="primary.main" fontWeight={600} sx={{ mt: 1 }}>
                          {formatPrice(product.price)}
                        </Typography>
                      </CardContent>
                      <CardActions sx={{ p: { xs: 1, sm: 1.5 }, pt: 0 }}>
                        <IconButton 
                          color="primary" 
                          size="small"
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
                          sx={{ fontSize: { xs: '0.65rem', sm: '0.75rem' }, ml: 'auto' }}
                        >
                          {actionLoading[`cart-${product._id || product.id}`] ? 'Adding...' : 'Add'}
                        </Button>
                      </CardActions>
                    </Card>
                    );
                    }).filter(Boolean);
                  })()} 
                </Stack>
              </Box>
            </Box>

            {/* Home & Garden */}
            <Box sx={{ mb: 6 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h5" fontWeight={700} sx={{ color: 'primary.main' }}>
                  🏠 Home & Garden
                </Typography>
                <Button 
                  variant="outlined" 
                  size="small"
                  onClick={() => navigate('/home')}
                  sx={{ textTransform: 'none' }}
                >
                  View All
                </Button>
              </Box>
              <Box sx={{ overflowX: 'auto', pb: 2 }}>
                <Stack direction="row" spacing={{ xs: 2, sm: 3 }} sx={{ minWidth: 'max-content' }}>
                  {(() => {
                    const homeProducts = products.filter(product => 
                      getCategoryString(product).toLowerCase() === 'home' ||
                      getCategoryString(product).toLowerCase() === 'home' ||
                      getCategoryString(product).toLowerCase() === 'furniture' ||
                      getCategoryString(product).toLowerCase() === 'furniture'
                    );
                    return homeProducts.slice(0, 8).map((product) => (
                    <Card 
                      key={product._id || product.id} 
                      sx={{ 
                        minWidth: { xs: 160, sm: 180, md: 200 }, 
                        maxWidth: { xs: 160, sm: 180, md: 200 }, 
                        boxShadow: 2, 
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        '&:hover': { transform: 'translateY(-4px)', boxShadow: 4 }
                      }} 
                      onClick={() => navigate(`/products/${product._id || product.id}`)}
                    >
                      <CardMedia 
                        component="img" 
                        height="120" 
                        image={product.images?.[0]?.url || 'https://via.placeholder.com/400x300?text=No+Image'} 
                        alt={product.name} 
                      />
                      <CardContent sx={{ p: { xs: 1, sm: 1.5 } }}>
                        <Typography 
                          variant="subtitle2" 
                          fontWeight={600} 
                          sx={{ 
                            fontSize: { xs: '0.8rem', sm: '0.9rem' },
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            minHeight: '2.4em'
                          }}
                        >
                          {product.name}
                        </Typography>
                        <Typography variant="body2" color="primary.main" fontWeight={600} sx={{ mt: 1 }}>
                          {formatPrice(product.price)}
                        </Typography>
                      </CardContent>
                      <CardActions sx={{ p: { xs: 1, sm: 1.5 }, pt: 0 }}>
                        <IconButton 
                          color="primary" 
                          size="small"
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
                          sx={{ fontSize: { xs: '0.65rem', sm: '0.75rem' }, ml: 'auto' }}
                        >
                          {actionLoading[`cart-${product._id || product.id}`] ? 'Adding...' : 'Add'}
                        </Button>
                      </CardActions>
                    </Card>
                    ));
                  })()} 
                </Stack>
              </Box>
            </Box>

            {/* Fashion & Beauty */}
            <Box sx={{ mb: 6 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h5" fontWeight={700} sx={{ color: 'primary.main' }}>
                  👗 Fashion & Beauty
                </Typography>
                <Button 
                  variant="outlined" 
                  size="small"
                  onClick={() => navigate('/fashion')}
                  sx={{ textTransform: 'none' }}
                >
                  View All
                </Button>
              </Box>
              <Box sx={{ overflowX: 'auto', pb: 2 }}>
                <Stack direction="row" spacing={{ xs: 2, sm: 3 }} sx={{ minWidth: 'max-content' }}>
                  {(() => {
                    const fashionProducts = products.filter(product => 
                      getCategoryString(product).toLowerCase() === 'fashion' ||
                      getCategoryString(product).toLowerCase() === 'fashion' ||
                      getCategoryString(product).toLowerCase() === 'clothing' ||
                      getCategoryString(product).toLowerCase() === 'clothing'
                    );
                    return fashionProducts.slice(0, 8).map((product) => (
                    <Card 
                      key={product._id || product.id} 
                      sx={{ 
                        minWidth: { xs: 160, sm: 180, md: 200 }, 
                        maxWidth: { xs: 160, sm: 180, md: 200 }, 
                        boxShadow: 2, 
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        '&:hover': { transform: 'translateY(-4px)', boxShadow: 4 }
                      }} 
                      onClick={() => navigate(`/products/${product._id || product.id}`)}
                    >
                      <CardMedia 
                        component="img" 
                        height="120" 
                        image={product.images?.[0]?.url || 'https://via.placeholder.com/400x300?text=No+Image'} 
                        alt={product.name} 
                      />
                      <CardContent sx={{ p: { xs: 1, sm: 1.5 } }}>
                        <Typography 
                          variant="subtitle2" 
                          fontWeight={600} 
                          sx={{ 
                            fontSize: { xs: '0.8rem', sm: '0.9rem' },
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            minHeight: '2.4em'
                          }}
                        >
                          {product.name}
                        </Typography>
                        <Typography variant="body2" color="primary.main" fontWeight={600} sx={{ mt: 1 }}>
                          {formatPrice(product.price)}
                        </Typography>
                      </CardContent>
                      <CardActions sx={{ p: { xs: 1, sm: 1.5 }, pt: 0 }}>
                        <IconButton 
                          color="primary" 
                          size="small"
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
                          sx={{ fontSize: { xs: '0.65rem', sm: '0.75rem' }, ml: 'auto' }}
                        >
                          {actionLoading[`cart-${product._id || product.id}`] ? 'Adding...' : 'Add'}
                        </Button>
                      </CardActions>
                    </Card>
                    ));
                  })()} 
                </Stack>
              </Box>
            </Box>

            {/* Sports & Outdoors */}
            <Box sx={{ mb: 6 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h5" fontWeight={700} sx={{ color: 'primary.main' }}>
                  ⚽ Sports & Outdoors
                </Typography>
                <Button 
                  variant="outlined" 
                  size="small"
                  onClick={() => navigate('/sports')}
                  sx={{ textTransform: 'none' }}
                >
                  View All
                </Button>
              </Box>
              <Box sx={{ overflowX: 'auto', pb: 2 }}>
                <Stack direction="row" spacing={{ xs: 2, sm: 3 }} sx={{ minWidth: 'max-content' }}>
                  {(() => {
                    const sportsProducts = products.filter(product => 
                      getCategoryString(product).toLowerCase() === 'sports' ||
                      getCategoryString(product).toLowerCase() === 'sports' ||
                      getCategoryString(product).toLowerCase() === 'fitness' ||
                      getCategoryString(product).toLowerCase() === 'fitness'
                    );
                    return sportsProducts.slice(0, 8).map((product) => (
                    <Card 
                      key={product._id || product.id} 
                      sx={{ 
                        minWidth: { xs: 160, sm: 180, md: 200 }, 
                        maxWidth: { xs: 160, sm: 180, md: 200 }, 
                        boxShadow: 2, 
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        '&:hover': { transform: 'translateY(-4px)', boxShadow: 4 }
                      }} 
                      onClick={() => navigate(`/products/${product._id || product.id}`)}
                    >
                      <CardMedia 
                        component="img" 
                        height="120" 
                        image={product.images?.[0]?.url || 'https://via.placeholder.com/400x300?text=No+Image'} 
                        alt={product.name} 
                      />
                      <CardContent sx={{ p: { xs: 1, sm: 1.5 } }}>
                        <Typography 
                          variant="subtitle2" 
                          fontWeight={600} 
                          sx={{ 
                            fontSize: { xs: '0.8rem', sm: '0.9rem' },
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            minHeight: '2.4em'
                          }}
                        >
                          {product.name}
                        </Typography>
                        <Typography variant="body2" color="primary.main" fontWeight={600} sx={{ mt: 1 }}>
                          {formatPrice(product.price)}
                        </Typography>
                      </CardContent>
                      <CardActions sx={{ p: { xs: 1, sm: 1.5 }, pt: 0 }}>
                        <IconButton 
                          color="primary" 
                          size="small"
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
                          sx={{ fontSize: { xs: '0.65rem', sm: '0.75rem' }, ml: 'auto' }}
                        >
                          {actionLoading[`cart-${product._id || product.id}`] ? 'Adding...' : 'Add'}
                        </Button>
                      </CardActions>
                    </Card>
                    ));
                  })()} 
                </Stack>
              </Box>
            </Box>

            {/* Health & Personal Care */}
            <Box sx={{ mb: 6 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h5" fontWeight={700} sx={{ color: 'primary.main' }}>
                  💊 Health & Personal Care
                </Typography>
                <Button 
                  variant="outlined" 
                  size="small"
                  onClick={() => navigate('/health')}
                  sx={{ textTransform: 'none' }}
                >
                  View All
                </Button>
              </Box>
              <Box sx={{ overflowX: 'auto', pb: 2 }}>
                <Stack direction="row" spacing={{ xs: 2, sm: 3 }} sx={{ minWidth: 'max-content' }}>
                  {(() => {
                    const healthProducts = products.filter(product => 
                      getCategoryString(product).toLowerCase() === 'health' ||
                      getCategoryString(product).toLowerCase() === 'health' ||
                      getCategoryString(product).toLowerCase() === 'personal care' ||
                      getCategoryString(product).toLowerCase() === 'personal care'
                    );
                    return healthProducts.slice(0, 8).map((product) => (
                    <Card 
                      key={product._id || product.id} 
                      sx={{ 
                        minWidth: { xs: 160, sm: 180, md: 200 }, 
                        maxWidth: { xs: 160, sm: 180, md: 200 }, 
                        boxShadow: 2, 
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        '&:hover': { transform: 'translateY(-4px)', boxShadow: 4 }
                      }} 
                      onClick={() => navigate(`/products/${product._id || product.id}`)}
                    >
                      <CardMedia 
                        component="img" 
                        height="120" 
                        image={product.images?.[0]?.url || 'https://via.placeholder.com/400x300?text=No+Image'} 
                        alt={product.name} 
                      />
                      <CardContent sx={{ p: { xs: 1, sm: 1.5 } }}>
                        <Typography 
                          variant="subtitle2" 
                          fontWeight={600} 
                          sx={{ 
                            fontSize: { xs: '0.8rem', sm: '0.9rem' },
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            minHeight: '2.4em'
                          }}
                        >
                          {product.name}
                        </Typography>
                        <Typography variant="body2" color="primary.main" fontWeight={600} sx={{ mt: 1 }}>
                          {formatPrice(product.price)}
                        </Typography>
                      </CardContent>
                      <CardActions sx={{ p: { xs: 1, sm: 1.5 }, pt: 0 }}>
                        <IconButton 
                          color="primary" 
                          size="small"
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
                          sx={{ fontSize: { xs: '0.65rem', sm: '0.75rem' }, ml: 'auto' }}
                        >
                          {actionLoading[`cart-${product._id || product.id}`] ? 'Adding...' : 'Add'}
                        </Button>
                      </CardActions>
                    </Card>
                    ));
                  })()} 
                </Stack>
              </Box>
            </Box>

            {/* Books & Media */}
            <Box sx={{ mb: 6 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h5" fontWeight={700} sx={{ color: 'primary.main' }}>
                  📚 Books & Media
                </Typography>
                <Button 
                  variant="outlined" 
                  size="small"
                  onClick={() => navigate('/books')}
                  sx={{ textTransform: 'none' }}
                >
                  View All
                </Button>
              </Box>
              <Box sx={{ overflowX: 'auto', pb: 2 }}>
                <Stack direction="row" spacing={{ xs: 2, sm: 3 }} sx={{ minWidth: 'max-content' }}>
                  {(() => {
                    const mediaProducts = products.filter(product => 
                      getCategoryString(product).toLowerCase() === 'books' ||
                      getCategoryString(product).toLowerCase() === 'books' ||
                      getCategoryString(product).toLowerCase() === 'media' ||
                      getCategoryString(product).toLowerCase() === 'media'
                    );
                    return mediaProducts.slice(0, 8).map((product) => (
                    <Card 
                      key={product._id || product.id} 
                      sx={{ 
                        minWidth: { xs: 160, sm: 180, md: 200 }, 
                        maxWidth: { xs: 160, sm: 180, md: 200 }, 
                        boxShadow: 2, 
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        '&:hover': { transform: 'translateY(-4px)', boxShadow: 4 }
                      }} 
                      onClick={() => navigate(`/products/${product._id || product.id}`)}
                    >
                      <CardMedia 
                        component="img" 
                        height="120" 
                        image={product.images?.[0]?.url || 'https://via.placeholder.com/400x300?text=No+Image'} 
                        alt={product.name} 
                      />
                      <CardContent sx={{ p: { xs: 1, sm: 1.5 } }}>
                        <Typography 
                          variant="subtitle2" 
                          fontWeight={600} 
                          sx={{ 
                            fontSize: { xs: '0.8rem', sm: '0.9rem' },
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            minHeight: '2.4em'
                          }}
                        >
                          {product.name}
                        </Typography>
                        <Typography variant="body2" color="primary.main" fontWeight={600} sx={{ mt: 1 }}>
                          {formatPrice(product.price)}
                        </Typography>
                      </CardContent>
                      <CardActions sx={{ p: { xs: 1, sm: 1.5 }, pt: 0 }}>
                        <IconButton 
                          color="primary" 
                          size="small"
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
                          sx={{ fontSize: { xs: '0.65rem', sm: '0.75rem' }, ml: 'auto' }}
                        >
                          {actionLoading[`cart-${product._id || product.id}`] ? 'Adding...' : 'Add'}
                        </Button>
                      </CardActions>
                    </Card>
                    ));
                  })()} 
                </Stack>
              </Box>
            </Box>
          </Container>
        )}

        {/* No Products Found */}
        {!loading && !error && products.length > 0 && filteredProducts.length === 0 && (
          <Container maxWidth="xl" sx={{ mb: 6, px: { xs: 2, sm: 3, md: 4 } }}>
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <Typography variant="h5" color="text.secondary" gutterBottom>
                No products found
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Try adjusting your search or filter criteria
              </Typography>
            </Box>
          </Container>
        )}

        {/* No Products at all */}
        {!loading && !error && products.length === 0 && (
          <Container maxWidth="xl" sx={{ mb: 6, px: { xs: 2, sm: 3, md: 4 } }}>
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <Typography variant="h5" color="text.secondary" gutterBottom>
                No products available
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Please check back later or contact support
              </Typography>
            </Box>
          </Container>
        )}
      </Box>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>

      <Footer />
    </>
  );
};

export default ProductPage;