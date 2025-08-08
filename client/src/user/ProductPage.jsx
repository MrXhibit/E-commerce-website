import React, { useEffect, useState } from 'react';
import { Box, Container, Typography, Grid, Card, CardMedia, CardContent, CardActions, Button, IconButton, Chip, Stack, Divider, Paper, CircularProgress, Alert, TextField, Snackbar, InputAdornment } from '@mui/material';
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
  { name: 'Computers', image: 'https://source.unsplash.com/featured/?computer', highlight: true, category: 'electronics' },
  { name: 'Laptops', image: 'https://source.unsplash.com/featured/?laptop', category: 'electronics' },
  { name: 'Smartphones', image: 'https://source.unsplash.com/featured/?smartphone', category: 'electronics' },
  { name: 'Headphones', image: 'https://source.unsplash.com/featured/?headphones', category: 'electronics' },
  { name: 'Gaming', image: 'https://source.unsplash.com/featured/?gaming', category: 'electronics' },
  { name: 'Cameras', image: 'https://source.unsplash.com/featured/?camera', category: 'electronics' },
  { name: 'TV & Audio', image: 'https://source.unsplash.com/featured/?television', category: 'electronics' },
  { name: 'Smart Home', image: 'https://source.unsplash.com/featured/?smart-home', category: 'electronics' },
  
  // Home & Garden
  { name: 'Furniture', image: 'https://source.unsplash.com/featured/?furniture', category: 'home' },
  { name: 'Home Decor', image: 'https://source.unsplash.com/featured/?home-decor', category: 'home' },
  { name: 'Kitchen', image: 'https://source.unsplash.com/featured/?kitchen', category: 'home' },
  { name: 'Bedding', image: 'https://source.unsplash.com/featured/?bedding', category: 'home' },
  { name: 'Garden', image: 'https://source.unsplash.com/featured/?garden', category: 'home' },
  { name: 'Tools', image: 'https://source.unsplash.com/featured/?tools', category: 'home' },
  
  // Fashion & Beauty
  { name: 'Clothing', image: 'https://source.unsplash.com/featured/?clothing', category: 'fashion' },
  { name: 'Shoes', image: 'https://source.unsplash.com/featured/?shoes', category: 'fashion' },
  { name: 'Jewelry', image: 'https://source.unsplash.com/featured/?jewelry', category: 'fashion' },
  { name: 'Watches', image: 'https://source.unsplash.com/featured/?watches', category: 'fashion' },
  { name: 'Beauty', image: 'https://source.unsplash.com/featured/?beauty', category: 'fashion' },
  { name: 'Bags', image: 'https://source.unsplash.com/featured/?bags', category: 'fashion' },
  
  // Sports & Outdoors
  { name: 'Sports', image: 'https://source.unsplash.com/featured/?sports', category: 'sports' },
  { name: 'Fitness', image: 'https://source.unsplash.com/featured/?fitness', category: 'sports' },
  { name: 'Outdoor', image: 'https://source.unsplash.com/featured/?outdoor', category: 'sports' },
  { name: 'Cycling', image: 'https://source.unsplash.com/featured/?bicycle', category: 'sports' },
  
  // Health & Personal Care
  { name: 'Health', image: 'https://source.unsplash.com/featured/?health', category: 'health' },
  { name: 'Personal Care', image: 'https://source.unsplash.com/featured/?personal-care', category: 'health' },
  { name: 'Vitamins', image: 'https://source.unsplash.com/featured/?vitamins', category: 'health' },
  
  // Books & Media
  { name: 'Books', image: 'https://source.unsplash.com/featured/?books', category: 'media' },
  { name: 'Music', image: 'https://source.unsplash.com/featured/?music', category: 'media' },
  { name: 'Movies', image: 'https://source.unsplash.com/featured/?movies', category: 'media' },
  
  // Automotive & Industrial
  { name: 'Automotive', image: 'https://source.unsplash.com/featured/?car', category: 'automotive' },
  { name: 'Industrial', image: 'https://source.unsplash.com/featured/?industrial', category: 'automotive' },
  
  // Baby & Kids
  { name: 'Baby', image: 'https://source.unsplash.com/featured/?baby', category: 'kids' },
  { name: 'Toys', image: 'https://source.unsplash.com/featured/?toys', category: 'kids' },
  { name: 'Kids Fashion', image: 'https://source.unsplash.com/featured/?kids-clothes', category: 'kids' },
  
  // Pet Supplies
  { name: 'Pet Supplies', image: 'https://source.unsplash.com/featured/?pets', category: 'pets' },
  
  // Office & School
  { name: 'Office', image: 'https://source.unsplash.com/featured/?office', category: 'office' },
  { name: 'Stationery', image: 'https://source.unsplash.com/featured/?stationery', category: 'office' },
];

// Mock product data with proper categorization
const mockProducts = [
  // Electronics & Technology
  {
    _id: 'elec1',
    name: 'iPhone 15 Pro Max',
    price: 1199,
    category: 'Electronics',
    images: [{ url: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400' }],
    description: 'Latest iPhone with advanced camera system'
  },
  {
    _id: 'elec2',
    name: 'MacBook Pro 16"',
    price: 2499,
    category: 'Electronics',
    images: [{ url: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400' }],
    description: 'Powerful laptop for professionals'
  },
  {
    _id: 'elec3',
    name: 'Samsung Galaxy S24 Ultra',
    price: 1299,
    category: 'Electronics',
    images: [{ url: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400' }],
    description: 'Premium Android smartphone'
  },
  {
    _id: 'elec4',
    name: 'Sony WH-1000XM5 Headphones',
    price: 399,
    category: 'Electronics',
    images: [{ url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400' }],
    description: 'Noise-canceling wireless headphones'
  },
  {
    _id: 'elec5',
    name: 'Dell XPS 13 Laptop',
    price: 1299,
    category: 'Electronics',
    images: [{ url: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400' }],
    description: 'Ultra-portable laptop'
  },
  {
    _id: 'elec6',
    name: 'Canon EOS R5 Camera',
    price: 3899,
    category: 'Electronics',
    images: [{ url: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=400' }],
    description: 'Professional mirrorless camera'
  },
  {
    _id: 'elec7',
    name: 'PlayStation 5 Gaming Console',
    price: 499,
    category: 'Electronics',
    images: [{ url: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=400' }],
    description: 'Next-gen gaming console'
  },
  {
    _id: 'elec8',
    name: 'iPad Pro 12.9"',
    price: 1099,
    category: 'Electronics',
    images: [{ url: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400' }],
    description: 'Professional tablet for creativity'
  },

  // Fashion & Clothing
  {
    _id: 'fashion1',
    name: 'Nike Air Jordan 1 Sneakers',
    price: 170,
    category: 'Fashion',
    images: [{ url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400' }],
    description: 'Classic basketball sneakers'
  },
  {
    _id: 'fashion2',
    name: 'Levi\'s 501 Original Jeans',
    price: 89,
    category: 'Fashion',
    images: [{ url: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400' }],
    description: 'Classic straight-leg jeans'
  },
  {
    _id: 'fashion3',
    name: 'Adidas Ultraboost 22 Shoes',
    price: 190,
    category: 'Fashion',
    images: [{ url: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400' }],
    description: 'Premium running shoes'
  },
  {
    _id: 'fashion4',
    name: 'Ralph Lauren Polo Shirt',
    price: 89,
    category: 'Fashion',
    images: [{ url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400' }],
    description: 'Classic polo shirt'
  },
  {
    _id: 'fashion5',
    name: 'Coach Leather Handbag',
    price: 350,
    category: 'Fashion',
    images: [{ url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400' }],
    description: 'Luxury leather handbag'
  },
  {
    _id: 'fashion6',
    name: 'Rolex Submariner Watch',
    price: 8100,
    category: 'Fashion',
    images: [{ url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400' }],
    description: 'Luxury diving watch'
  },
  {
    _id: 'fashion7',
    name: 'Zara Summer Dress',
    price: 49,
    category: 'Fashion',
    images: [{ url: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400' }],
    description: 'Elegant summer dress'
  },
  {
    _id: 'fashion8',
    name: 'Tiffany & Co. Diamond Necklace',
    price: 1200,
    category: 'Fashion',
    images: [{ url: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400' }],
    description: 'Elegant diamond jewelry'
  },

  // Home & Kitchen
  {
    _id: 'home1',
    name: 'IKEA MALM Bed Frame',
    price: 179,
    category: 'Home',
    images: [{ url: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400' }],
    description: 'Modern bed frame'
  },
  {
    _id: 'home2',
    name: 'KitchenAid Stand Mixer',
    price: 379,
    category: 'Home',
    images: [{ url: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400' }],
    description: 'Professional stand mixer'
  },
  {
    _id: 'home3',
    name: 'West Elm Mid-Century Sofa',
    price: 1299,
    category: 'Home',
    images: [{ url: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400' }],
    description: 'Stylish living room sofa'
  },
  {
    _id: 'home4',
    name: 'Nespresso Coffee Machine',
    price: 199,
    category: 'Home',
    images: [{ url: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400' }],
    description: 'Premium coffee maker'
  },
  {
    _id: 'home5',
    name: 'Dyson V15 Vacuum Cleaner',
    price: 749,
    category: 'Home',
    images: [{ url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400' }],
    description: 'Cordless vacuum cleaner'
  },
  {
    _id: 'home6',
    name: 'Le Creuset Dutch Oven',
    price: 350,
    category: 'Home',
    images: [{ url: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400' }],
    description: 'Cast iron cookware'
  },
  {
    _id: 'home7',
    name: 'Pottery Barn Dining Table',
    price: 899,
    category: 'Home',
    images: [{ url: 'https://images.unsplash.com/photo-1549497538-303791108f95?w=400' }],
    description: 'Solid wood dining table'
  },
  {
    _id: 'home8',
    name: 'Brooklinen Luxury Bedding Set',
    price: 249,
    category: 'Home',
    images: [{ url: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400' }],
    description: 'Premium bedding collection'
  },

  // Sports & Fitness
  {
    _id: 'sports1',
    name: 'Peloton Exercise Bike',
    price: 1445,
    category: 'Sports',
    images: [{ url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400' }],
    description: 'Interactive fitness bike'
  },
  {
    _id: 'sports2',
    name: 'Nike Dri-FIT Running Shirt',
    price: 35,
    category: 'Sports',
    images: [{ url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400' }],
    description: 'Moisture-wicking athletic wear'
  },
  {
    _id: 'sports3',
    name: 'Bowflex Adjustable Dumbbells',
    price: 349,
    category: 'Sports',
    images: [{ url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400' }],
    description: 'Space-saving workout equipment'
  },
  {
    _id: 'sports4',
    name: 'Yeti Rambler Water Bottle',
    price: 35,
    category: 'Sports',
    images: [{ url: 'https://images.unsplash.com/photo-1523362628745-0c100150b504?w=400' }],
    description: 'Insulated water bottle'
  },
  {
    _id: 'sports5',
    name: 'Trek Mountain Bike',
    price: 1299,
    category: 'Sports',
    images: [{ url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400' }],
    description: 'All-terrain mountain bike'
  },
  {
    _id: 'sports6',
    name: 'Lululemon Yoga Mat',
    price: 88,
    category: 'Sports',
    images: [{ url: 'https://images.unsplash.com/photo-1506629905607-d405b7a30db9?w=400' }],
    description: 'Premium yoga mat'
  },

  // Books & Media
  {
    _id: 'books1',
    name: 'The Psychology of Money',
    price: 16,
    category: 'Books',
    images: [{ url: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400' }],
    description: 'Bestselling finance book'
  },
  {
    _id: 'books2',
    name: 'Atomic Habits',
    price: 18,
    category: 'Books',
    images: [{ url: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400' }],
    description: 'Self-improvement bestseller'
  },
  {
    _id: 'books3',
    name: 'The Midnight Library',
    price: 14,
    category: 'Books',
    images: [{ url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400' }],
    description: 'Popular fiction novel'
  },

  // Health & Beauty
  {
    _id: 'health1',
    name: 'Olaplex Hair Treatment Set',
    price: 89,
    category: 'Beauty',
    images: [{ url: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400' }],
    description: 'Professional hair care'
  },
  {
    _id: 'health2',
    name: 'The Ordinary Skincare Set',
    price: 45,
    category: 'Beauty',
    images: [{ url: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400' }],
    description: 'Complete skincare routine'
  },
  {
    _id: 'health3',
    name: 'Optimum Nutrition Whey Protein',
    price: 59,
    category: 'Health',
    images: [{ url: 'https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=400' }],
    description: 'Premium protein supplement'
  }
];

const ProductPage = () => {
  const [products, setProducts] = useState(mockProducts); // Start with mock data
  const [loading, setLoading] = useState(false); // Start with loading false
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState({});
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const { isAuthenticated, addToCart, addToWishlist, wishlist } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Mock data is already set in initial state
  console.log('Products in component:', products.length);

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
    const matchesSearch = searchTerm === '' || 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = !selectedCategory || 
      product.category?.toLowerCase().includes(selectedCategory.toLowerCase());
    
    return matchesSearch && matchesCategory;
  });

  return (
    <>
      <Header />
      <Box sx={{ background: '#fafbfc', minHeight: '100vh' }}>
        {/* Hero Banner */}
        <Box sx={{ backgroundColor: 'primary.main', py: 6, mb: 4, color: 'primary.contrastText' }}>
          <Container>
            <Grid container spacing={4} alignItems="center">
              <Grid item xs={12} md={6}>
                <Typography variant="h2" fontWeight={700} gutterBottom>
                  Everything You Need
                </Typography>
                <Typography variant="h5" sx={{ mb: 3, opacity: 0.9 }}>
                  From electronics to home essentials, discover millions of products with unbeatable prices and fast delivery.
                </Typography>
                <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap>
                  {categories.slice(0, 6).map((cat) => (
                    <Chip 
                      key={cat.name} 
                      label={cat.name} 
                      sx={{ 
                        backgroundColor: 'rgba(255,255,255,0.2)', 
                        color: 'white',
                        '&:hover': { backgroundColor: 'rgba(255,255,255,0.3)' }
                      }} 
                    />
                  ))}
                </Stack>
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
                  onClick={() => navigate('/products?category=Electronics')}
                  sx={{ textTransform: 'none' }}
                >
                  View All
                </Button>
              </Box>
              <Box sx={{ overflowX: 'auto', pb: 2 }}>
                <Stack direction="row" spacing={{ xs: 2, sm: 3 }} sx={{ minWidth: 'max-content' }}>
                  {(() => {
                    const electronicsProducts = products.filter(product => 
                      product.category?.toLowerCase() === 'electronics'
                    );
                    console.log('Electronics products found:', electronicsProducts.length);
                    return electronicsProducts.slice(0, 8).map((product) => (
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
                        image={product.images?.[0]?.url || 'https://source.unsplash.com/featured/?electronics'} 
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
                          ${product.price}
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

            {/* Fashion & Clothing */}
            <Box sx={{ mb: 6 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h5" fontWeight={700} sx={{ color: 'primary.main' }}>
                  👗 Fashion & Clothing
                </Typography>
                <Button 
                  variant="outlined" 
                  size="small"
                  onClick={() => navigate('/products?category=Fashion')}
                  sx={{ textTransform: 'none' }}
                >
                  View All
                </Button>
              </Box>
              <Box sx={{ overflowX: 'auto', pb: 2 }}>
                <Stack direction="row" spacing={{ xs: 2, sm: 3 }} sx={{ minWidth: 'max-content' }}>
                  {products.filter(product => 
                    product.category?.toLowerCase() === 'fashion'
                  ).slice(0, 8).map((product) => (
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
                        image={product.images?.[0]?.url || 'https://source.unsplash.com/featured/?fashion'} 
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
                          ${product.price}
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
                  ))}
                </Stack>
              </Box>
            </Box>

            {/* Home & Kitchen */}
            <Box sx={{ mb: 6 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h5" fontWeight={700} sx={{ color: 'primary.main' }}>
                  🏠 Home & Kitchen
                </Typography>
                <Button 
                  variant="outlined" 
                  size="small"
                  onClick={() => navigate('/products?category=Home')}
                  sx={{ textTransform: 'none' }}
                >
                  View All
                </Button>
              </Box>
              <Box sx={{ overflowX: 'auto', pb: 2 }}>
                <Stack direction="row" spacing={{ xs: 2, sm: 3 }} sx={{ minWidth: 'max-content' }}>
                  {products.filter(product => 
                    product.category?.toLowerCase() === 'home'
                  ).slice(0, 8).map((product) => (
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
                        image={product.images?.[0]?.url || 'https://source.unsplash.com/featured/?home'} 
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
                          ${product.price}
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
                  ))}
                </Stack>
              </Box>
            </Box>

            {/* Sports & Fitness */}
            <Box sx={{ mb: 6 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h5" fontWeight={700} sx={{ color: 'primary.main' }}>
                  🏃‍♂️ Sports & Fitness
                </Typography>
                <Button 
                  variant="outlined" 
                  size="small"
                  onClick={() => navigate('/products?category=Sports')}
                  sx={{ textTransform: 'none' }}
                >
                  View All
                </Button>
              </Box>
              <Box sx={{ overflowX: 'auto', pb: 2 }}>
                <Stack direction="row" spacing={{ xs: 2, sm: 3 }} sx={{ minWidth: 'max-content' }}>
                  {products.filter(product => 
                    product.category?.toLowerCase() === 'sports'
                  ).slice(0, 8).map((product) => (
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
                        image={product.images?.[0]?.url || 'https://source.unsplash.com/featured/?sports'} 
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
                          ${product.price}
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
                  ))}
                </Stack>
              </Box>
            </Box>

            {/* Books & More */}
            {products.length > 0 && (
              <Box sx={{ mb: 6 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                  <Typography variant="h5" fontWeight={700} sx={{ color: 'primary.main' }}>
                    📚 Books & More
                  </Typography>
                  <Button 
                    variant="outlined" 
                    size="small"
                    onClick={() => navigate('/products')}
                    sx={{ textTransform: 'none' }}
                  >
                    View All
                  </Button>
                </Box>
                <Box sx={{ overflowX: 'auto', pb: 2 }}>
                  <Stack direction="row" spacing={{ xs: 2, sm: 3 }} sx={{ minWidth: 'max-content' }}>
                    {products.filter(product => 
                      !['electronics', 'fashion', 'home', 'sports'].includes(product.category?.toLowerCase())
                    ).slice(0, 10).map((product) => (
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
                          image={product.images?.[0]?.url || 'https://source.unsplash.com/featured/?product'} 
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
                            ${product.price}
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
                    ))}
                  </Stack>
                </Box>
              </Box>
            )}
          </Container>
        )}



        {/* No Products Found */}
        {!loading && !error && products.length > 0 && filteredProducts.length === 0 && (
          <Container maxWidth="xl" sx={{ mb: 6, px: { xs: 2, sm: 3, md: 4 } }}>
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <Typography variant="h5" color="text.secondary" gutterBottom>
                No products found
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                {searchTerm && selectedCategory 
                  ? `No products match "${searchTerm}" in ${selectedCategory} category`
                  : searchTerm 
                    ? `No products match "${searchTerm}"`
                    : `No products found in ${selectedCategory} category`
                }
              </Typography>
              <Button 
                variant="outlined" 
                size="large"
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory(null);
                }}
              >
                Clear Filters
              </Button>
            </Box>
          </Container>
        )}


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