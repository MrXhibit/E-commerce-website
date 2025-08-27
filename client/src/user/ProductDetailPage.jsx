import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Typography,
  Button,
  Card,
  CardMedia,
  Box,
  Divider,
  Rating,
  Chip,
  Paper,
  CircularProgress,
  Snackbar,
  Alert,
  Breadcrumbs,
  Link,
  IconButton,
  Tabs,
  Tab,
} from '@mui/material';
import {
  ShoppingCart as CartIcon,
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  Share as ShareIcon,
  ArrowBack as ArrowBackIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
} from '@mui/icons-material';
import apiService from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import Header from './Header';
import Footer from './Footer';

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, addToCart, addToWishlist, wishlist } = useAuth();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState(0);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [actionLoading, setActionLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Check if product is in wishlist
  const isInWishlist = wishlist?.items?.some(item => item.product._id === id);

  // Helper function to format price
  const formatPrice = (price) => {
    if (typeof price === 'string') {
      return price.startsWith('$') ? price : `$${price}`;
    }
    return `$${price?.toFixed(2) || '0.00'}`;
  };

  // Carousel navigation functions
  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? (product.images?.length || 1) - 1 : prev - 1
    );
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => 
      prev === (product.images?.length || 1) - 1 ? 0 : prev - 1
    );
  };

  const handleImageSelect = (index) => {
    setCurrentImageIndex(index);
  };

  useEffect(() => {
    // Guard against undefined ID
    if (!id || id === 'undefined') {
      setError('Invalid product ID');
      setLoading(false);
      return;
    }

    const fetchProductDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log('Fetching product with ID:', id);
        const response = await apiService.getProductById(id);
        
        console.log('API Response:', response);
        
        if (response.success && response.data) {
          setProduct(response.data);
        } else if (response.product) {
          // Fallback to old format if needed
          setProduct(response.product);
        } else {
          throw new Error('Product data not found in response');
        }
        
        // Fetch related products based on category
        const currentProduct = response.success ? response.data : response.product;
        if (currentProduct?.category) {
          try {
            const relatedResponse = await apiService.getProductsByCategory(currentProduct.category, 8);
            if (relatedResponse.success && relatedResponse.data) {
              const filteredRelated = relatedResponse.data.filter(p => p._id !== id);
              setRelatedProducts(filteredRelated.slice(0, 4));
            }
          } catch (relatedError) {
            console.warn('Failed to fetch related products:', relatedError);
          }
        }
      } catch (err) {
        console.error('Error fetching product details:', err);
        setError(`Failed to load product: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [id]);

  // Reset image index when product changes
  useEffect(() => {
    setCurrentImageIndex(0);
  }, [product]);

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    try {
      setActionLoading(true);
      await addToCart(id, quantity);
      setSnackbar({
        open: true,
        message: 'Product added to cart successfully!',
        severity: 'success',
      });
    } catch (err) {
      setSnackbar({
        open: true,
        message: err.message || 'Failed to add product to cart',
        severity: 'error',
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleAddToWishlist = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    try {
      setActionLoading(true);
      await addToWishlist(id);
      setSnackbar({
        open: true,
        message: 'Product added to wishlist successfully!',
        severity: 'success',
      });
    } catch (err) {
      setSnackbar({
        open: true,
        message: err.message || 'Failed to add product to wishlist',
        severity: 'error',
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity >= 1 && newQuantity <= (product?.stock || 10)) {
      setQuantity(newQuantity);
    }
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  if (loading) {
    return (
      <>
        <Header />
        <Container sx={{ py: 8, textAlign: 'center' }}>
          <CircularProgress />
          <Typography variant="h6" sx={{ mt: 2 }}>
            Loading product details...
          </Typography>
        </Container>
        <Footer />
      </>
    );
  }

  if (error) {
    return (
      <>
        <Header />
        <Container sx={{ py: 8, textAlign: 'center' }}>
          <Typography variant="h5" color="error" gutterBottom>
            {error === 'Invalid product ID' ? 'Invalid Product' : 'Error Loading Product'}
          </Typography>
          <Typography variant="body1">
            {error === 'Invalid product ID' 
              ? 'The product ID is invalid or missing. Please check the URL and try again.'
              : error
            }
          </Typography>
          <Button variant="contained" onClick={handleGoBack} sx={{ mt: 3 }}>
            Go Back
          </Button>
        </Container>
        <Footer />
      </>
    );
  }

  if (!product) {
    return (
      <>
        <Header />
        <Container sx={{ py: 8, textAlign: 'center' }}>
          <Typography variant="h5" gutterBottom>
            Product Not Found
          </Typography>
          <Button variant="contained" onClick={handleGoBack} sx={{ mt: 3 }}>
            Go Back
          </Button>
        </Container>
        <Footer />
      </>
    );
  }

  const productImages = product.images || [{ url: 'https://via.placeholder.com/400x400?text=No+Image' }];

  return (
    <>
      <Header />
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Breadcrumbs navigation */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <IconButton onClick={handleGoBack} sx={{ mr: 1 }}>
            <ArrowBackIcon />
          </IconButton>
          <Breadcrumbs aria-label="breadcrumb">
            <Link underline="hover" color="inherit" onClick={() => navigate('/')} sx={{ cursor: 'pointer' }}>
              Home
            </Link>
            <Link 
              underline="hover" 
              color="inherit" 
              onClick={() => navigate('/products')} 
              sx={{ cursor: 'pointer' }}
            >
              Products
            </Link>
            <Typography color="text.primary">{product.name}</Typography>
          </Breadcrumbs>
        </Box>

        <Grid container spacing={4}>
          {/* Product Images with Carousel */}
          <Grid item xs={12} md={6}>
            <Paper elevation={2} sx={{ p: 2, borderRadius: 2, overflow: 'hidden' }}>
              {/* Main Image with Carousel */}
              <Box sx={{ position: 'relative', mb: 2 }}>
                <Card sx={{ borderRadius: 2, overflow: 'hidden' }}>
                  <CardMedia
                    component="img"
                    image={productImages[currentImageIndex]?.url}
                    alt={`${product.name} - view ${currentImageIndex + 1}`}
                    sx={{ 
                      height: 400, 
                      objectFit: 'contain',
                      transition: 'all 0.3s ease-in-out'
                    }}
                  />
                </Card>
                
                {/* Navigation Arrows */}
                {productImages.length > 1 && (
                  <>
                    <IconButton
                      onClick={handlePrevImage}
                      sx={{
                        position: 'absolute',
                        left: 8,
                        top: '50%',
                        transform: 'translateY(-50%)',
                        backgroundColor: 'rgba(255, 255, 255, 0.8)',
                        '&:hover': {
                          backgroundColor: 'rgba(255, 255, 255, 0.9)',
                        },
                        boxShadow: 2
                      }}
                    >
                      <ChevronLeftIcon />
                    </IconButton>
                    <IconButton
                      onClick={handleNextImage}
                      sx={{
                        position: 'absolute',
                        right: 8,
                        top: '50%',
                        transform: 'translateY(-50%)',
                        backgroundColor: 'rgba(255, 255, 255, 0.8)',
                        '&:hover': {
                          backgroundColor: 'rgba(255, 255, 255, 0.9)',
                        },
                        boxShadow: 2
                      }}
                    >
                      <ChevronRightIcon />
                    </IconButton>
                  </>
                )}
                
                {/* Image Indicators */}
                {productImages.length > 1 && (
                  <Box
                    sx={{
                      position: 'absolute',
                      bottom: 16,
                      left: '50%',
                      transform: 'translateX(-50%)',
                      display: 'flex',
                      gap: 1,
                      backgroundColor: 'rgba(0, 0, 0, 0.5)',
                      borderRadius: 2,
                      p: 1
                    }}
                  >
                    {productImages.map((_, index) => (
                      <Box
                        key={index}
                        onClick={() => handleImageSelect(index)}
                        sx={{
                          width: 8,
                          height: 8,
                          borderRadius: '50%',
                          backgroundColor: index === currentImageIndex ? 'white' : 'rgba(255, 255, 255, 0.5)',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease-in-out',
                          '&:hover': {
                            backgroundColor: 'white'
                          }
                        }}
                      />
                    ))}
                  </Box>
                )}
              </Box>
              
              {/* Thumbnail Images */}
              {productImages.length > 1 && (
                <Grid container spacing={1}>
                  {productImages.slice(0, 4).map((image, index) => (
                    <Grid item xs={3} key={index}>
                      <Card 
                        sx={{ 
                          cursor: 'pointer',
                          border: index === currentImageIndex ? 2 : 0,
                          borderColor: 'primary.main',
                          transition: 'all 0.2s ease-in-out',
                          '&:hover': {
                            transform: 'scale(1.05)'
                          }
                        }}
                        onClick={() => handleImageSelect(index)}
                      >
                        <CardMedia
                          component="img"
                          image={image.url}
                          alt={`${product.name} - thumbnail ${index + 1}`}
                          sx={{ height: 80, objectFit: 'cover' }}
                        />
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              )}
            </Paper>
          </Grid>

          {/* Product Details */}
          <Grid item xs={12} md={6}>
            <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
              <Typography variant="h4" gutterBottom>
                {product.name}
              </Typography>
              
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Rating value={product.rating || 4.5} precision={0.5} readOnly />
                <Typography variant="body2" sx={{ ml: 1 }}>
                  ({product.reviewCount || 24} reviews)
                </Typography>
              </Box>
              
              <Typography variant="h5" color="primary" sx={{ my: 2 }}>
                {formatPrice(product.price)}
              </Typography>
              
              <Divider sx={{ my: 2 }} />
              
              <Box sx={{ mb: 3 }}>
                {product.brandName && (
                  <Typography variant="subtitle1" gutterBottom>
                    <strong>Brand:</strong> {product.brandName}
                  </Typography>
                )}
                {product.modelName && (
                  <Typography variant="subtitle1" gutterBottom>
                    <strong>Model:</strong> {product.modelName}
                  </Typography>
                )}
                <Typography variant="subtitle1" gutterBottom>
                  <strong>Category:</strong> {product.category}
                </Typography>
                <Typography variant="subtitle1" gutterBottom>
                  <strong>Availability:</strong> {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                </Typography>
                {product.stock > 0 && (
                  <Typography variant="subtitle1" gutterBottom>
                    <strong>Stock:</strong> {product.stock} units
                  </Typography>
                )}
                <Typography variant="subtitle1" gutterBottom sx={{ color: 'success.main' }}>
                  <strong>Estimated Delivery:</strong> {new Date(Date.now() + 3*24*60*60*1000).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Typography variant="subtitle1" sx={{ mr: 2 }}>
                  <strong>Quantity:</strong>
                </Typography>
                <Button 
                  variant="outlined" 
                  size="small" 
                  onClick={() => handleQuantityChange(quantity - 1)}
                  disabled={quantity <= 1}
                >
                  -
                </Button>
                <Typography sx={{ mx: 2 }}>{quantity}</Typography>
                <Button 
                  variant="outlined" 
                  size="small" 
                  onClick={() => handleQuantityChange(quantity + 1)}
                  disabled={quantity >= (product.stock || 10)}
                >
                  +
                </Button>
              </Box>
              
              <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                <Button 
                  variant="contained" 
                  startIcon={<CartIcon />} 
                  onClick={handleAddToCart}
                  disabled={actionLoading || product.stock <= 0}
                  fullWidth
                >
                  Add to Cart
                </Button>
                <Button 
                  variant="outlined" 
                  startIcon={isInWishlist ? <FavoriteIcon color="error" /> : <FavoriteBorderIcon />} 
                  onClick={handleAddToWishlist}
                  disabled={actionLoading || isInWishlist}
                  fullWidth
                >
                  {isInWishlist ? 'In Wishlist' : 'Add to Wishlist'}
                </Button>
              </Box>
              
              <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                <Button startIcon={<ShareIcon />} size="small">
                  Share
                </Button>
              </Box>
            </Paper>
          </Grid>
        </Grid>

        {/* Product Information Tabs */}
        <Paper elevation={2} sx={{ mt: 4, borderRadius: 2 }}>
          <Tabs 
            value={activeTab} 
            onChange={handleTabChange} 
            variant="fullWidth" 
            sx={{ borderBottom: 1, borderColor: 'divider' }}
          >
            <Tab label="Description" />
            <Tab label="Specifications" />
            <Tab label="Reviews" />
          </Tabs>
          
          <Box sx={{ p: 3 }}>
            {activeTab === 0 && (
              <Typography variant="body1">
                {product.description}
              </Typography>
            )}
            
            {activeTab === 1 && (
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  {product.brandName && (
                    <>
                      <Typography variant="subtitle1" gutterBottom><strong>Brand</strong></Typography>
                      <Typography variant="body1" paragraph>{product.brandName}</Typography>
                    </>
                  )}
                  {product.modelName && (
                    <>
                      <Typography variant="subtitle1" gutterBottom><strong>Model</strong></Typography>
                      <Typography variant="body1" paragraph>{product.modelName}</Typography>
                    </>
                  )}
                  <Typography variant="subtitle1" gutterBottom><strong>Category</strong></Typography>
                  <Typography variant="body1" paragraph>{product.category}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle1" gutterBottom><strong>Stock</strong></Typography>
                  <Typography variant="body1" paragraph>{product.stock} units</Typography>
                  
                  <Typography variant="subtitle1" gutterBottom><strong>Price</strong></Typography>
                  <Typography variant="body1" paragraph>{formatPrice(product.price)}</Typography>
                </Grid>
              </Grid>
            )}
            
            {activeTab === 2 && (
              <Box>
                <Typography variant="h6" gutterBottom>Customer Reviews</Typography>
                <Typography variant="body1">
                  No reviews yet. Be the first to review this product.
                </Typography>
              </Box>
            )}
          </Box>
        </Paper>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <Box sx={{ mt: 6 }}>
            <Typography variant="h5" gutterBottom>
              Related Products
            </Typography>
            <Grid container spacing={3}>
              {relatedProducts.map((relatedProduct) => (
                <Grid item xs={12} sm={6} md={3} key={relatedProduct._id}>
                  <Card 
                    sx={{ 
                      height: '100%', 
                      display: 'flex', 
                      flexDirection: 'column',
                      transition: 'transform 0.2s',
                      '&:hover': { transform: 'scale(1.03)' },
                      cursor: 'pointer'
                    }}
                    onClick={() => navigate(`/products/${relatedProduct._id}`)}
                  >
                    <CardMedia
                      component="img"
                      image={relatedProduct.images?.[0]?.url || 'https://via.placeholder.com/200x200?text=No+Image'}
                      alt={relatedProduct.name}
                      sx={{ height: 200, objectFit: 'contain', p: 2 }}
                    />
                    <Box sx={{ p: 2, flexGrow: 1 }}>
                      <Typography variant="subtitle1" component="div" noWrap>
                        {relatedProduct.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        {relatedProduct.brandName}
                      </Typography>
                      <Typography variant="h6" color="primary">
                        {formatPrice(relatedProduct.price)}
                      </Typography>
                    </Box>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}

        {/* Snackbar for notifications */}
        <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={handleCloseSnackbar}>
          <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Container>
      <Footer />
    </>
  );
};

export default ProductDetailPage;