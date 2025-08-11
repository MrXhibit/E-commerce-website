const fs = require('fs');
const path = require('path');

const categories = [
  // Electronics & Technology
  { name: 'Headphones', icon: '🎧', description: 'Headphones, earbuds, and audio accessories', keywords: ['headphones', 'earbuds', 'headset', 'audio'] },
  { name: 'Gaming', icon: '🎮', description: 'Gaming consoles, accessories, and games', keywords: ['gaming', 'console', 'playstation', 'xbox', 'nintendo'] },
  { name: 'Cameras', icon: '📷', description: 'Digital cameras, lenses, and photography equipment', keywords: ['camera', 'photography', 'lens', 'dslr'] },
  { name: 'TVAudio', icon: '📺', description: 'Televisions, speakers, and home audio systems', keywords: ['tv', 'television', 'speaker', 'audio', 'sound'], displayName: 'TV & Audio' },
  { name: 'SmartHome', icon: '🏠', description: 'Smart devices, home automation, and IoT products', keywords: ['smart', 'home', 'automation', 'iot', 'alexa'], displayName: 'Smart Home' },

  // Home & Garden
  { name: 'Furniture', icon: '🪑', description: 'Home and office furniture for every room', keywords: ['furniture', 'chair', 'table', 'sofa', 'bed'] },
  { name: 'HomeDecor', icon: '🏡', description: 'Decorative items, artwork, and home accessories', keywords: ['decor', 'decoration', 'art', 'vase', 'candle'], displayName: 'Home Decor' },
  { name: 'Kitchen', icon: '🍳', description: 'Kitchen appliances, cookware, and dining essentials', keywords: ['kitchen', 'cooking', 'appliance', 'cookware'] },
  { name: 'Bedding', icon: '🛏️', description: 'Bed sheets, pillows, comforters, and bedroom textiles', keywords: ['bedding', 'sheets', 'pillow', 'comforter', 'blanket'] },
  { name: 'Garden', icon: '🌱', description: 'Gardening tools, plants, and outdoor equipment', keywords: ['garden', 'plant', 'outdoor', 'lawn', 'flower'] },
  { name: 'Tools', icon: '🔧', description: 'Hand tools, power tools, and hardware', keywords: ['tools', 'hardware', 'drill', 'hammer', 'wrench'] },

  // Fashion & Beauty
  { name: 'Clothing', icon: '👕', description: 'Fashion apparel for men, women, and children', keywords: ['clothing', 'shirt', 'dress', 'pants', 'jacket'] },
  { name: 'Shoes', icon: '👟', description: 'Footwear for all occasions and activities', keywords: ['shoes', 'sneakers', 'boots', 'sandals', 'heels'] },
  { name: 'Jewelry', icon: '💍', description: 'Fine jewelry, accessories, and precious metals', keywords: ['jewelry', 'ring', 'necklace', 'earrings', 'bracelet'] },
  { name: 'Watches', icon: '⌚', description: 'Timepieces, smartwatches, and watch accessories', keywords: ['watch', 'timepiece', 'smartwatch', 'rolex', 'apple'] },
  { name: 'Beauty', icon: '💄', description: 'Cosmetics, skincare, and beauty products', keywords: ['beauty', 'makeup', 'cosmetics', 'skincare', 'lipstick'] },
  { name: 'Bags', icon: '👜', description: 'Handbags, backpacks, and travel accessories', keywords: ['bag', 'handbag', 'backpack', 'purse', 'luggage'] },

  // Sports & Outdoors
  { name: 'Sports', icon: '⚽', description: 'Sports equipment and athletic gear', keywords: ['sports', 'athletic', 'ball', 'equipment', 'gear'] },
  { name: 'Fitness', icon: '💪', description: 'Exercise equipment and fitness accessories', keywords: ['fitness', 'exercise', 'gym', 'workout', 'training'] },
  { name: 'Outdoor', icon: '🏕️', description: 'Outdoor recreation and adventure gear', keywords: ['outdoor', 'camping', 'hiking', 'adventure', 'nature'] },
  { name: 'Cycling', icon: '🚴', description: 'Bicycles, cycling gear, and accessories', keywords: ['cycling', 'bike', 'bicycle', 'helmet', 'gear'] },

  // Health & Personal Care
  { name: 'Health', icon: '🏥', description: 'Health products, medical supplies, and wellness items', keywords: ['health', 'medical', 'wellness', 'care', 'medicine'] },
  { name: 'PersonalCare', icon: '🧴', description: 'Personal hygiene and grooming products', keywords: ['personal', 'care', 'hygiene', 'grooming', 'soap'], displayName: 'Personal Care' },
  { name: 'Vitamins', icon: '💊', description: 'Vitamins, supplements, and nutritional products', keywords: ['vitamins', 'supplements', 'nutrition', 'health', 'pills'] },

  // Books & Media
  { name: 'Books', icon: '📚', description: 'Books, e-books, and reading materials', keywords: ['books', 'reading', 'novel', 'textbook', 'literature'] },
  { name: 'Music', icon: '🎵', description: 'Music albums, instruments, and audio equipment', keywords: ['music', 'album', 'instrument', 'cd', 'vinyl'] },
  { name: 'Movies', icon: '🎬', description: 'Movies, TV shows, and entertainment media', keywords: ['movies', 'film', 'dvd', 'bluray', 'entertainment'] },

  // Automotive & Industrial
  { name: 'Automotive', icon: '🚗', description: 'Car parts, accessories, and automotive supplies', keywords: ['automotive', 'car', 'parts', 'accessories', 'vehicle'] },
  { name: 'Industrial', icon: '🏭', description: 'Industrial equipment and commercial supplies', keywords: ['industrial', 'commercial', 'equipment', 'machinery', 'supplies'] },

  // Baby & Kids
  { name: 'Baby', icon: '👶', description: 'Baby products, care items, and nursery essentials', keywords: ['baby', 'infant', 'nursery', 'care', 'feeding'] },
  { name: 'Toys', icon: '🧸', description: 'Toys, games, and educational products for children', keywords: ['toys', 'games', 'children', 'play', 'educational'] },
  { name: 'KidsFashion', icon: '👶', description: 'Clothing and accessories for children', keywords: ['kids', 'children', 'clothing', 'fashion', 'apparel'], displayName: 'Kids Fashion' },

  // Pet Supplies
  { name: 'PetSupplies', icon: '🐕', description: 'Pet food, toys, and care products', keywords: ['pet', 'dog', 'cat', 'animal', 'supplies'], displayName: 'Pet Supplies' },

  // Office & School
  { name: 'Office', icon: '🏢', description: 'Office supplies, furniture, and business equipment', keywords: ['office', 'business', 'supplies', 'furniture', 'equipment'] },
  { name: 'Stationery', icon: '✏️', description: 'Pens, paper, and school/office supplies', keywords: ['stationery', 'pen', 'paper', 'supplies', 'school'] },
];

const generatePageTemplate = (category) => {
  const displayName = category.displayName || category.name;
  const lowerName = category.name.toLowerCase();
  const searchPlaceholder = `Search ${displayName.toLowerCase()}...`;
  const keywordsFilter = category.keywords.map(k => `product.name?.toLowerCase().includes('${k}') ||
              product.description?.toLowerCase().includes('${k}')`).join(' ||\n              ');

  return `import React, { useEffect, useState } from 'react';
import { Box, Container, Typography, Grid, Card, CardMedia, CardContent, CardActions, Button, IconButton, CircularProgress, Alert, TextField, Snackbar, InputAdornment, Breadcrumbs, Link } from '@mui/material';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import SearchIcon from '@mui/icons-material/Search';
import HomeIcon from '@mui/icons-material/Home';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import apiService from '../services/api';
import Header from './Header';
import Footer from './Footer';

const ${category.name}Page = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState({});
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [searchTerm, setSearchTerm] = useState('');
  const { isAuthenticated, addToCart, addToWishlist, wishlist } = useAuth();
  const navigate = useNavigate();

  const formatPrice = (price) => {
    if (typeof price === 'string') {
      return price.startsWith('$') ? price : \`$\${price}\`;
    }
    return \`$\${price?.toFixed(2) || '0.00'}\`;
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await apiService.getProducts(50, 0);
        if (response.success && response.data) {
          const productsData = response.data;
          const filteredProducts = productsData.filter(product => {
            const matchesCategory = product.subcategory?.toLowerCase() === '${lowerName}' ||
              ${keywordsFilter};
            return matchesCategory;
          });
          setProducts(filteredProducts);
        } else {
          // Mock data for ${displayName.toLowerCase()}
          const mockProducts = [
            { _id: '${lowerName}1', name: 'Sample ${displayName}', price: 99, category: 'Sample', subcategory: '${lowerName}', images: [{ url: 'https://via.placeholder.com/400x300?text=${displayName}' }], description: 'Sample ${displayName.toLowerCase()} product' },
          ];
          setProducts(mockProducts);
        }
      } catch (err) {
        const mockProducts = [
          { _id: '${lowerName}1', name: 'Sample ${displayName}', price: 99, category: 'Sample', subcategory: '${lowerName}', images: [{ url: 'https://via.placeholder.com/400x300?text=${displayName}' }], description: 'Sample ${displayName.toLowerCase()} product' },
        ];
        setProducts(mockProducts);
        setError(null);
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

    setActionLoading(prev => ({ ...prev, [\`cart-\${productId}\`]: true }));
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
      setActionLoading(prev => ({ ...prev, [\`cart-\${productId}\`]: false }));
    }
  };

  const handleAddToWishlist = async (productId, event) => {
    event.stopPropagation();
    if (!isAuthenticated) {
      setSnackbar({ open: true, message: 'Please login to add items to wishlist', severity: 'warning' });
      return;
    }

    setActionLoading(prev => ({ ...prev, [\`wishlist-\${productId}\`]: true }));
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
      setActionLoading(prev => ({ ...prev, [\`wishlist-\${productId}\`]: false }));
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const isInWishlist = (productId) => {
    return wishlist?.items?.some(item => item.productId === productId) || false;
  };

  const filteredProducts = products.filter(product => {
    return searchTerm === '' || 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <>
      <Header />
      <Box sx={{ background: '#fafbfc', minHeight: '100vh' }}>
        {/* Breadcrumbs */}
        <Container maxWidth="xl" sx={{ pt: 2, px: { xs: 2, sm: 3, md: 4 } }}>
          <Breadcrumbs aria-label="breadcrumb">
            <Link component={RouterLink} to="/" sx={{ display: 'flex', alignItems: 'center' }} color="inherit">
              <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />
              Home
            </Link>
            <Link component={RouterLink} to="/products" color="inherit">
              Products
            </Link>
            <Typography color="text.primary">${displayName}</Typography>
          </Breadcrumbs>
        </Container>

        {/* Category Header */}
        <Box sx={{ backgroundColor: 'primary.main', py: 6, mb: 4, color: 'primary.contrastText' }}>
          <Container maxWidth="xl">
            <Grid container spacing={4} alignItems="center">
              <Grid item xs={12} md={8}>
                <Typography variant="h2" fontWeight={700} gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <span style={{ fontSize: '3rem' }}>${category.icon}</span>
                  ${displayName}
                </Typography>
                <Typography variant="h5" sx={{ mb: 3, opacity: 0.9 }}>
                  ${category.description}
                </Typography>
              </Grid>
            </Grid>
          </Container>
        </Box>

        {/* Search Section */}
        <Container maxWidth="xl" sx={{ mb: 4, px: { xs: 2, sm: 3, md: 4 } }}>
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
            <TextField
              placeholder="${searchPlaceholder}"
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

        {/* Products Grid */}
        {!loading && !error && (
          <Container maxWidth="xl" sx={{ mb: 6, px: { xs: 2, sm: 3, md: 4 } }}>
            {filteredProducts.length > 0 ? (
              <Grid container spacing={{ xs: 2, sm: 3, md: 4 }}>
                {filteredProducts.map((product) => (
                  <Grid item xs={6} sm={4} md={3} lg={2.4} key={product._id || product.id}>
                    <Card 
                      sx={{ 
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        boxShadow: 2, 
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        '&:hover': { transform: 'translateY(-4px)', boxShadow: 4 }
                      }} 
                      onClick={() => navigate(\`/products/\${product._id || product.id}\`)}
                    >
                      <CardMedia 
                        component="img" 
                        height="200" 
                        image={product.images?.[0]?.url || 'https://via.placeholder.com/400x300?text=No+Image'} 
                        alt={product.name} 
                      />
                      <CardContent sx={{ flexGrow: 1, p: { xs: 1.5, sm: 2 } }}>
                        <Typography 
                          variant="subtitle1" 
                          fontWeight={600} 
                          sx={{ 
                            fontSize: { xs: '0.9rem', sm: '1rem' },
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            minHeight: '2.4em',
                            mb: 1
                          }}
                        >
                          {product.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                          {product.description}
                        </Typography>
                        <Typography variant="h6" color="primary.main" fontWeight={600}>
                          {formatPrice(product.price)}
                        </Typography>
                      </CardContent>
                      <CardActions sx={{ p: { xs: 1.5, sm: 2 }, pt: 0 }}>
                        <IconButton 
                          color="primary" 
                          size="small"
                          onClick={(e) => handleAddToWishlist(product._id || product.id, e)}
                          disabled={actionLoading[\`wishlist-\${product._id || product.id}\`]}
                        >
                          {isInWishlist(product._id || product.id) ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                        </IconButton>
                        <Button 
                          size="small" 
                          variant="contained" 
                          endIcon={<ShoppingCartIcon />}
                          onClick={(e) => handleAddToCart(product._id || product.id, e)}
                          disabled={actionLoading[\`cart-\${product._id || product.id}\`]}
                          sx={{ ml: 'auto' }}
                        >
                          {actionLoading[\`cart-\${product._id || product.id}\`] ? 'Adding...' : 'Add to Cart'}
                        </Button>
                      </CardActions>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Box sx={{ textAlign: 'center', py: 8 }}>
                <Typography variant="h5" color="text.secondary" gutterBottom>
                  No ${displayName.toLowerCase()} found
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                  {searchTerm 
                    ? \`No ${displayName.toLowerCase()} match "\${searchTerm}"\`
                    : 'No ${displayName.toLowerCase()} available at the moment'
                  }
                </Typography>
                {searchTerm && (
                  <Button 
                    variant="outlined" 
                    size="large"
                    onClick={() => setSearchTerm('')}
                  >
                    Clear Search
                  </Button>
                )}
              </Box>
            )}
          </Container>
        )}
      </Box>
      <Footer />
      
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

export default ${category.name}Page;`;
};

// Generate all category pages
categories.forEach(category => {
  const content = generatePageTemplate(category);
  const fileName = `${category.name}Page.jsx`;
  const filePath = path.join(__dirname, 'client', 'src', 'user', fileName);
  
  fs.writeFileSync(filePath, content);
  console.log(`Generated ${fileName}`);
});

console.log('All category pages generated successfully!');