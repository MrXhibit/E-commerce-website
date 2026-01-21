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
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

// Custom CSS for the carousel
const carouselStyles = {
  '.slick-prev, .slick-next': {
    display: 'none !important', // Hide arrows completely
  },
  '.slick-track': {
    display: 'flex',
    gap: '10px',
    padding: '10px 0',
  },
  '.slick-slide': {
    height: 'inherit',
    '& > div': {
      height: '100%',
    },
  },
};

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

  // Helper function to format price
  const formatPrice = (price) => {
    if (typeof price === 'string') {
      return price.startsWith('$') ? price : `$${price}`;
    }
    return `$${price?.toFixed(2) || '0.00'}`;
  };

  // Function to determine the route for a product - now directing to product detail page
  const getCategoryRoute = (product) => {
    // Direct all products to the product detail page
    return `/products/${product._id || product.id}`;
  };

  // Fetch products from backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await apiService.getProducts(50, 0); // Fetch 50 products
        if (response.success && response.data) {
          const productsData = response.data;
          setProducts(productsData);
        } else {
          setProducts(mockProducts);
        }
      } catch (err) {
        setProducts(mockProducts);
        setError(null); // Clear error since we have fallback data
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

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleCategoryClick = (categoryName) => {
    setSelectedCategory(selectedCategory === categoryName ? null : categoryName);
    // Scroll to products section
    window.scrollTo({
      top: document.querySelector('.product-carousels')?.offsetTop - 100 || 0,
      behavior: 'smooth'
    });
  };

  const isInWishlist = (productId) => {
    return wishlist?.items?.some(item => item.productId === productId) || false;
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = searchTerm === '' || 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Fix category filtering to handle both lowercase and uppercase category names
    const matchesCategory = !selectedCategory || 
      (product.category?.toLowerCase() === selectedCategory.toLowerCase()) ||
      (typeof product.category === 'object' && product.category?.name?.toLowerCase() === selectedCategory.toLowerCase());
    
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
          <Container maxWidth="xl" sx={{ mb: 6, px: { xs: 2, sm: 3, md: 4 } }} className="product-carousels">
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
              <Box sx={{ pb: 2, ...carouselStyles }}>
                <Slider
                  dots={false}
                  infinite={true}
                  speed={500}
                  slidesToShow={5}
                  slidesToScroll={2}
                  autoplay={true}
                  autoplaySpeed={5000}
                  arrows={false}
                  responsive={[
                    {
                      breakpoint: 1280,
                      settings: {
                        slidesToShow: 4,
                        slidesToScroll: 2
                      }
                    },
                    {
                      breakpoint: 960,
                      settings: {
                        slidesToShow: 3,
                        slidesToScroll: 1
                      }
                    },
                    {
                      breakpoint: 600,
                      settings: {
                        slidesToShow: 2,
                        slidesToScroll: 1
                      }
                    },
                    {
                      breakpoint: 480,
                      settings: {
                        slidesToShow: 1,
                        slidesToScroll: 1
                      }
                    }
                  ]}
                >
                  {products.filter(product => 
                    product.category?.toLowerCase() === 'electronics' ||
                    (typeof product.category === 'object' && product.category?.name?.toLowerCase() === 'electronics')
                  ).slice(0, 12).map((product) => (
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
                      onClick={() => navigate(getCategoryRoute(product))}
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
                  ))}
                </Slider>
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
                  onClick={() => navigate('/clothing')}
                  sx={{ textTransform: 'none' }}
                >
                  View All
                </Button>
              </Box>
              <Box sx={{ pb: 2, ...carouselStyles }}>
                <Slider
                  dots={false}
                  infinite={true}
                  speed={500}
                  slidesToShow={5}
                  slidesToScroll={2}
                  autoplay={true}
                  autoplaySpeed={5000}
                  arrows={false}
                  responsive={[
                    {
                      breakpoint: 1280,
                      settings: {
                        slidesToShow: 4,
                        slidesToScroll: 2
                      }
                    },
                    {
                      breakpoint: 960,
                      settings: {
                        slidesToShow: 3,
                        slidesToScroll: 1
                      }
                    },
                    {
                      breakpoint: 600,
                      settings: {
                        slidesToShow: 2,
                        slidesToScroll: 1
                      }
                    },
                    {
                      breakpoint: 480,
                      settings: {
                        slidesToShow: 1,
                        slidesToScroll: 1
                      }
                    }
                  ]}
                >
                  {products.filter(product => 
                    product.category?.toLowerCase() === 'fashion' ||
                    (typeof product.category === 'object' && product.category?.name?.toLowerCase() === 'fashion')
                  ).slice(0, 12).map((product) => (
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
                      onClick={() => navigate(getCategoryRoute(product))}
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
                  ))}
                </Slider>
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
                  onClick={() => navigate('/furniture')}
                  sx={{ textTransform: 'none' }}
                >
                  View All
                </Button>
              </Box>
              <Box sx={{ pb: 2, ...carouselStyles }}>
                <Slider
                  dots={false}
                  infinite={true}
                  speed={500}
                  slidesToShow={5}
                  slidesToScroll={2}
                  autoplay={true}
                  autoplaySpeed={5000}
                  arrows={false}
                  responsive={[
                    {
                      breakpoint: 1280,
                      settings: {
                        slidesToShow: 4,
                        slidesToScroll: 2
                      }
                    },
                    {
                      breakpoint: 960,
                      settings: {
                        slidesToShow: 3,
                        slidesToScroll: 1
                      }
                    },
                    {
                      breakpoint: 600,
                      settings: {
                        slidesToShow: 2,
                        slidesToScroll: 1
                      }
                    },
                    {
                      breakpoint: 480,
                      settings: {
                        slidesToShow: 1,
                        slidesToScroll: 1
                      }
                    }
                  ]}
                >
                  {products.filter(product => 
                    product.category?.toLowerCase() === 'home' ||
                    (typeof product.category === 'object' && product.category?.name?.toLowerCase() === 'home')
                  ).slice(0, 12).map((product) => (
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
                      onClick={() => navigate(getCategoryRoute(product))}
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
                  ))}
                </Slider>
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
                  onClick={() => navigate('/sports')}
                  sx={{ textTransform: 'none' }}
                >
                  View All
                </Button>
              </Box>
              <Box sx={{ pb: 2, ...carouselStyles }}>
                <Slider
                  dots={false}
                  infinite={true}
                  speed={500}
                  slidesToShow={5}
                  slidesToScroll={2}
                  autoplay={true}
                  autoplaySpeed={5000}
                  arrows={false}
                  responsive={[
                    {
                      breakpoint: 1280,
                      settings: {
                        slidesToShow: 4,
                        slidesToScroll: 2
                      }
                    },
                    {
                      breakpoint: 960,
                      settings: {
                        slidesToShow: 3,
                        slidesToScroll: 1
                      }
                    },
                    {
                      breakpoint: 600,
                      settings: {
                        slidesToShow: 2,
                        slidesToScroll: 1
                      }
                    },
                    {
                      breakpoint: 480,
                      settings: {
                        slidesToShow: 1,
                        slidesToScroll: 1
                      }
                    }
                  ]}
                >
                  {products.filter(product => 
                    product.category?.toLowerCase() === 'sports' ||
                    (typeof product.category === 'object' && product.category?.name?.toLowerCase() === 'sports')
                  ).slice(0, 12).map((product) => (
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
                      onClick={() => navigate(getCategoryRoute(product))}
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
                  ))}
                </Slider>
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
                    onClick={() => navigate('/books')}
                    sx={{ textTransform: 'none' }}
                  >
                    View All
                  </Button>
                </Box>
                <Box sx={{ pb: 2, ...carouselStyles }}>
                  <Slider
                    dots={false}
                    infinite={true}
                    speed={500}
                    slidesToShow={5}
                    slidesToScroll={2}
                    autoplay={true}
                    autoplaySpeed={5000}
                    arrows={false}
                    responsive={[
                      {
                        breakpoint: 1280,
                        settings: {
                          slidesToShow: 4,
                          slidesToScroll: 2
                        }
                      },
                      {
                        breakpoint: 960,
                        settings: {
                          slidesToShow: 3,
                          slidesToScroll: 1
                        }
                      },
                      {
                        breakpoint: 600,
                        settings: {
                          slidesToShow: 2,
                          slidesToScroll: 1
                        }
                      },
                      {
                        breakpoint: 480,
                        settings: {
                          slidesToShow: 1,
                          slidesToScroll: 1
                        }
                      }
                    ]}
                  >
                    {products.filter(product => 
                    !['electronics', 'fashion', 'home', 'sports'].includes(product.category?.toLowerCase()) && 
                    !(typeof product.category === 'object' && product.category?.name && ['electronics', 'fashion', 'home', 'sports'].includes(product.category?.name?.toLowerCase()))
                  ).slice(0, 12).map((product) => (
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
                        onClick={() => navigate(getCategoryRoute(product))}
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
                    ))}
                  </Slider>
                </Box>
              </Box>
            )}
          </Container>
        )}



        {/* No Products Loaded */}
        {!loading && !error && products.length === 0 && (
          <Container maxWidth="xl" sx={{ mb: 6, px: { xs: 2, sm: 3, md: 4 } }}>
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <Typography variant="h5" color="text.secondary" gutterBottom>
                No products available
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                We're having trouble loading products. Please try refreshing the page.
              </Typography>
              <Button 
                variant="contained" 
                size="large"
                onClick={() => window.location.reload()}
              >
                Refresh Page
              </Button>
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