import React, { useEffect, useState } from 'react';
import { Box, Container, Typography, Card, CardMedia, CardContent, CardActions, Button, IconButton, CircularProgress, Alert, TextField, Snackbar, InputAdornment, Breadcrumbs, Link, Grid } from '@mui/material';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import SearchIcon from '@mui/icons-material/Search';
import HomeIcon from '@mui/icons-material/Home';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import apiService from '../services/api';
import productSearchService from '../services/productSearch.service';
import Header from './Header';
import Footer from './Footer';
import ProductSearch from './components/ProductSearch';

const LaptopsPage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState({});
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState(null);
  const [currentFilters, setCurrentFilters] = useState({});
  const { isAuthenticated, addToCart, addToWishlist, wishlist } = useAuth();
  const navigate = useNavigate();

  const formatPrice = (price) => {
    if (typeof price === 'string') {
      return price.startsWith('$') ? price : `$${price}`;
    }
    return `$${price?.toFixed(2) || '0.00'}`;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const [productsResponse, categoriesResponse] = await Promise.all([
          apiService.getProducts(50, 0),
          productSearchService.getCategories().catch(() => ({ data: [] }))
        ]);
        
        if (productsResponse.success && productsResponse.data) {
          const productsData = productsResponse.data;
          const filteredProducts = productsData.filter(product => {
            const matchesCategory = product.subcategory?.toLowerCase() === 'laptops' ||
              product.name?.toLowerCase().includes('laptop') ||
              product.name?.toLowerCase().includes('notebook') ||
              product.name?.toLowerCase().includes('ultrabook') ||
              product.name?.toLowerCase().includes('macbook') ||
              product.description?.toLowerCase().includes('laptop') ||
              product.description?.toLowerCase().includes('portable');
            return matchesCategory;
          });
          setProducts(filteredProducts);
        } else {
          // Mock data for laptops
          const mockProducts = [
            { _id: 'lap1', name: 'MacBook Pro 16"', price: 2499, category: 'Electronics', subcategory: 'laptops', images: [{ url: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400' }], description: 'Powerful laptop for professionals' },
            { _id: 'lap2', name: 'Dell XPS 13', price: 1299, category: 'Electronics', subcategory: 'laptops', images: [{ url: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400' }], description: 'Ultra-portable laptop' },
            { _id: 'lap3', name: 'HP Spectre x360', price: 1199, category: 'Electronics', subcategory: 'laptops', images: [{ url: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400' }], description: '2-in-1 convertible laptop' },
          ];
          setProducts(mockProducts);
        }
        
        setCategories(categoriesResponse.data || []);
      } catch (err) {
        const mockProducts = [
          { _id: 'lap1', name: 'MacBook Pro 16"', price: 2499, category: 'Electronics', subcategory: 'laptops', images: [{ url: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400' }], description: 'Powerful laptop for professionals' },
          { _id: 'lap2', name: 'Dell XPS 13', price: 1299, category: 'Electronics', subcategory: 'laptops', images: [{ url: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400' }], description: 'Ultra-portable laptop' },
          { _id: 'lap3', name: 'HP Spectre x360', price: 1199, category: 'Electronics', subcategory: 'laptops', images: [{ url: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400' }], description: '2-in-1 convertible laptop' },
        ];
        setProducts(mockProducts);
        setError(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Handle advanced search with filters
  const handleAdvancedSearch = async (filters) => {
    setLoading(true);
    setError(null);
    try {
      // Add laptops category filter by default
      const searchFilters = {
        ...filters,
        category: 'laptops', // Default to laptops category
        limit: 50,
        skip: 0
      };
      
      const response = await productSearchService.searchProducts(searchFilters);
      
      if (response.data && response.data.products) {
        setSearchResults(response.data);
        setProducts(response.data.products);
        setCurrentFilters(filters);
      } else {
        // Fallback to local filtering if backend search fails
        const filtered = products.filter(product => {
          let matches = true;
          
          if (filters.query) {
            const query = filters.query.toLowerCase();
            matches = matches && (
              product.name.toLowerCase().includes(query) ||
              product.description?.toLowerCase().includes(query) ||
              product.brand?.toLowerCase().includes(query)
            );
          }
          
          if (filters.brand) {
            matches = matches && product.brand?.toLowerCase().includes(filters.brand.toLowerCase());
          }
          
          if (filters.minPrice !== undefined) {
            matches = matches && parseFloat(product.price) >= filters.minPrice;
          }
          
          if (filters.maxPrice !== undefined) {
            matches = matches && parseFloat(product.price) <= filters.maxPrice;
          }
          
          if (filters.inStock) {
            matches = matches && (product.stock || 0) > 0;
          }
          
          return matches;
        });
        
        setProducts(filtered);
        setCurrentFilters(filters);
      }
    } catch (err) {
      console.error('Advanced search failed:', err);
      setError('Search failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

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

  const isInWishlist = (productId) => {
    return wishlist?.items?.some(item => item.productId === productId) || false;
  };

  // Use search results if available, otherwise use filtered products
  const displayProducts = searchResults ? searchResults.products : products.filter(product => {
    return searchTerm === '' || 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const getSearchSummary = () => {
    if (!searchResults) return null;
    
    const filters = [];
    if (currentFilters.query) filters.push(`"${currentFilters.query}"`);
    if (currentFilters.brand) filters.push(currentFilters.brand);
    if (currentFilters.inStock) filters.push('In Stock Only');
    
    return filters.length > 0 ? filters.join(' • ') : null;
  };

  return (
    <>
      <Header />
      <Box sx={{ background: '#fafbfc', minHeight: '100vh' }}>
        {/* Breadcrumbs */}
        <Container maxWidth="xl" sx={{ pt: 2, px: { xs: 2, sm: 3, md: 4 } }}>
          <Breadcrumbs aria-label="breadcrumb">
            <Link
              component={RouterLink}
              to="/"
              sx={{ display: 'flex', alignItems: 'center' }}
              color="inherit"
            >
              <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />
              Home
            </Link>
            <Link
              component={RouterLink}
              to="/products"
              color="inherit"
            >
              Products
            </Link>
            <Typography color="text.primary">Laptops</Typography>
          </Breadcrumbs>
        </Container>

        {/* Category Header */}
        <Box sx={{ backgroundColor: 'primary.main', py: 6, mb: 4, color: 'primary.contrastText' }}>
          <Container maxWidth="xl">
            <Typography variant="h3" fontWeight={700} gutterBottom>
              Laptops & Notebooks
            </Typography>
            <Typography variant="h6" sx={{ mb: 3, opacity: 0.9 }}>
              Discover powerful and portable computing solutions
            </Typography>
          </Container>
        </Box>

        {/* Advanced Search and Filters */}
        <Container maxWidth="xl" sx={{ mb: 4, px: { xs: 2, sm: 3, md: 4 } }}>
          <ProductSearch
            onSearch={handleAdvancedSearch}
            categories={categories}
            loading={loading}
            initialFilters={{
              category: 'laptops',
              query: searchTerm
            }}
          />
        </Container>

        {/* Results Summary */}
        {searchResults && (
          <Container maxWidth="xl" sx={{ mb: 3, px: { xs: 2, sm: 3, md: 4 } }}>
            <Typography variant="h6" gutterBottom>
              {searchResults.total || displayProducts.length} {displayProducts.length === 1 ? 'result' : 'results'} found
            </Typography>
            {getSearchSummary() && (
              <Typography variant="body1" color="text.secondary">
                Showing results for: {getSearchSummary()}
              </Typography>
            )}
          </Container>
        )}

        {/* Products Grid */}
        <Container maxWidth="xl" sx={{ mb: 6, px: { xs: 2, sm: 3, md: 4 } }}>
          <Typography variant="h5" fontWeight={700} sx={{ mb: 3, color: 'primary.main' }}>
            All Laptops
          </Typography>
          
          {/* Loading/Error State */}
          {loading ? (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <CircularProgress />
              <Typography sx={{ mt: 2 }}>Loading products...</Typography>
            </Box>
          ) : error ? (
            <Alert severity="error" sx={{ mb: 4 }}>{error}</Alert>
          ) : displayProducts.length === 0 ? (
            <Alert severity="info" sx={{ mb: 4 }}>No products found matching your criteria.</Alert>
          ) : (
            <Grid spacing={3}>
              {displayProducts.map((product) => (
                <Grid xs={12} sm={6} md={4} lg={3} key={product._id || product.id}>
                  <Card 
                    sx={{ 
                      height: '100%', 
                      display: 'flex', 
                      flexDirection: 'column',
                      transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-5px)',
                        boxShadow: 6
                      }
                    }}
                    onClick={() => navigate(`/products/${product._id || product.id}`)}
                  >
                    <CardMedia
                      component="img"
                      height="200"
                      image={product.images?.[0]?.url || 'https://via.placeholder.com/300x200'}
                      alt={product.name}
                      sx={{ objectFit: 'cover' }}
                    />
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Typography variant="h6" component="div" gutterBottom noWrap>
                        {product.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ 
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        mb: 1,
                        height: '40px'
                      }}>
                        {product.description}
                      </Typography>
                      <Typography variant="h6" color="primary" fontWeight={600}>
                        {formatPrice(product.price)}
                      </Typography>
                    </CardContent>
                    <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
                      <Button 
                        variant="contained" 
                        size="small" 
                        startIcon={<ShoppingCartIcon />}
                        onClick={(e) => handleAddToCart(product._id || product.id, e)}
                        disabled={actionLoading[`cart-${product._id || product.id}`]}
                      >
                        Add to Cart
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
                </Grid>
              ))}
            </Grid>
          )}
        </Container>
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

export default LaptopsPage;