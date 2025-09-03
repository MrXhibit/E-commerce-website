import React, { useState, useEffect } from 'react';
import { 
  Box, Container, Typography, Button, Stack, Chip, CircularProgress, Alert,
  IconButton, Card, CardContent, CardMedia, Rating, Avatar,
  useTheme, useMediaQuery, Grid
} from '@mui/material';
import { 
  PlayArrow as PlayIcon, Favorite as FavoriteIcon, 
  FavoriteBorder as FavoriteBorderIcon, ShoppingCart as ShoppingCartIcon,
  LocalShipping as LocalShippingIcon, Security as SecurityIcon,
  Refresh as RefreshIcon, CardGiftcard as CardGiftcardIcon,
  KeyboardArrowLeft as KeyboardArrowLeftIcon,
  KeyboardArrowRight as KeyboardArrowRightIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import Header from './Header';
import Footer from './Footer';
import ProductCard from './components/ProductCard';
import CategoryCard from './components/CategoryCard';
import EnhancedCategoryNavigation from './components/EnhancedCategoryNavigation';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { addToCart } from '../store/slices/cartSlice';
import { addToWishlist } from '../store/slices/wishlistSlice';
import apiService from '../services/api';
import { useNavigate } from 'react-router-dom';

// Carousel data
const carouselSlides = [
  {
    id: 1,
    title: "Galaxy S13+ Ultra",
    subtitle: "Supercharged for pros.",
    price: 999.00,
    monthlyPrice: 41.62,
    image: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=600&q=100&fit=crop&auto=format",
    buttonText: "Buy Now",
    learnMoreText: "Learn More"
  },
  {
    id: 2,
    title: "MacBook Pro M3",
    subtitle: "Power. Performance. Pro.",
    price: 1999.00,
    monthlyPrice: 83.29,
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&q=100&fit=crop&auto=format",
    buttonText: "Shop Now",
    learnMoreText: "Discover More"
  },
  {
    id: 3,
    title: "Sony WH-1000XM5",
    subtitle: "Industry-leading noise canceling.",
    price: 399.00,
    monthlyPrice: 16.62,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=100&fit=crop&auto=format",
    buttonText: "Get It Now",
    learnMoreText: "Learn Features"
  },
  {
    id: 4,
    title: "Nike Air Max 270",
    subtitle: "Maximum comfort, maximum style.",
    price: 150.00,
    monthlyPrice: 6.25,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=100&fit=crop&auto=format",
    buttonText: "Shop Shoes",
    learnMoreText: "View Collection"
  },
  {
    id: 5,
    title: "Levi's 501 Original Jeans",
    subtitle: "Timeless denim for every occasion.",
    price: 89.99,
    monthlyPrice: 3.75,
    image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=600&q=100&fit=crop&auto=format",
    buttonText: "Shop Jeans",
    learnMoreText: "See Sizes"
  },
  {
    id: 6,
    title: "Adidas Ultraboost 22",
    subtitle: "Energy return that never quits.",
    price: 190.00,
    monthlyPrice: 7.92,
    image: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=600&q=100&fit=crop&auto=format",
    buttonText: "Get Running",
    learnMoreText: "Learn Tech"
  },
  {
    id: 7,
    title: "Ray-Ban Aviator Classic",
    subtitle: "Iconic style meets premium quality.",
    price: 169.00,
    monthlyPrice: 7.04,
    image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600&q=100&fit=crop&auto=format",
    buttonText: "Shop Sunglasses",
    learnMoreText: "View Styles"
  },
  {
    id: 8,
    title: "Apple Watch Series 9",
    subtitle: "More powerful than ever.",
    price: 399.00,
    monthlyPrice: 16.62,
    image: "https://images.unsplash.com/photo-1544117519-31a4b719223d?w=600&q=100&fit=crop&auto=format",
    buttonText: "Shop Watch",
    learnMoreText: "Explore Features"
  }
];

// Styled components using old theme colors
const HeroSection = styled(Box)(({ theme }) => ({
  background: 'linear-gradient(135deg, #000000 0%, #333333 100%)',
  color: 'white',
  padding: theme.spacing(8, 0),
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'url("https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&q=100&fit=crop&auto=format")',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    opacity: 0.1,
    zIndex: 1
  }
}));

const PromoCard = styled(Card)(({ theme }) => ({
  position: 'relative',
  overflow: 'hidden',
  height: '100%',
  background: 'white',
  color: 'black',
  borderRadius: 12,
  border: '1px solid #e0e0e0',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 8px 25px rgba(0,0,0,0.15)'
  }
}));

const ServiceCard = styled(Box)(({ theme }) => ({
  textAlign: 'center',
  padding: theme.spacing(3),
  '& .MuiSvgIcon-root': {
    fontSize: '3rem',
    color: theme.palette.primary.main,
    marginBottom: theme.spacing(2)
  }
}));

const Home = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState({});
  const [currentSlide, setCurrentSlide] = useState(0);
  const [currentProductSlide, setCurrentProductSlide] = useState(0);
  
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAppSelector(state => state.auth);
  const { items: wishlistItems } = useAppSelector(state => state.wishlist);
  const navigate = useNavigate();
  
  // Fetch featured products from backend
  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await apiService.getProducts({ limit: 10, skip: 0 });
        
        if (response && response.data && response.data.length > 0) {
          const featuredProducts = response.data.slice(0, 8).map(product => ({
            ...product,
            _id: product._id || product.id || `product_${Math.random()}`,
            images: product.images && product.images.length > 0 
              ? product.images.map(img => typeof img === 'string' ? img : img.url)
              : ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=1200&q=100&fit=crop&auto=format']
          }));
          setProducts(featuredProducts);
        } else {
          // Fallback to mock products
          const mockProducts = [
            {
              _id: 'iphone15pro',
              name: 'iPhone 15 Pro',
              price: 999.00,
              category: 'Smartphones',
              images: ['https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=1200&q=100&fit=crop&auto=format'],
              description: 'Latest iPhone with A17 Pro chip, titanium design, and advanced camera system',
              rating: 4.8,
              discount: 15
            },
            {
              _id: 'samsung-s24',
              name: 'Samsung Galaxy S24 Ultra',
              price: 1199.00,
              category: 'Smartphones',
              images: ['https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=1200&q=100&fit=crop&auto=format'],
              description: 'Premium Android smartphone with S Pen, 200MP camera, and AI features',
              rating: 4.7,
              discount: 20
            },
            {
              _id: 'macbook-pro',
              name: 'MacBook Pro 16-inch',
              price: 2499.00,
              category: 'Laptops',
              images: ['https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=1200&q=100&fit=crop&auto=format'],
              description: 'Powerful laptop with M3 Pro chip, 16-inch Liquid Retina XDR display',
              rating: 4.9,
              discount: 10
            },
            {
              _id: 'sony-headphones',
              name: 'Sony WH-1000XM5',
              price: 399.00,
              category: 'Headphones',
              images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1200&q=100&fit=crop&auto=format'],
              description: 'Industry-leading noise canceling wireless headphones',
              rating: 4.6,
              discount: 25
            },
            {
              _id: 'ipad-air',
              name: 'iPad Air 5th Generation',
              price: 599.00,
              category: 'Tablets',
              images: ['https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=1200&q=100&fit=crop&auto=format'],
              description: 'Powerful, colorful, and versatile iPad with M1 chip',
              rating: 4.5,
              discount: 18
            },
            {
              _id: 'apple-watch',
              name: 'Apple Watch Series 9',
              price: 399.00,
              category: 'Smartwatches',
              images: ['https://images.unsplash.com/photo-1544117519-31a4b719223d?w=1200&q=100&fit=crop&auto=format'],
              description: 'Advanced health monitoring and fitness tracking',
              rating: 4.7,
              discount: 12
            },
            {
              _id: 'airpods-pro',
              name: 'AirPods Pro 2nd Generation',
              price: 249.00,
              category: 'Earbuds',
              images: ['https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf0?w=1200&q=100&fit=crop&auto=format'],
              description: 'Active noise cancellation and spatial audio',
              rating: 4.6,
              discount: 22
            },
            {
              _id: 'imac',
              name: 'iMac 24-inch',
              price: 1299.00,
              category: 'Desktops',
              images: ['https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=1200&q=100&fit=crop&auto=format'],
              description: 'All-in-one desktop with M1 chip and stunning display',
              rating: 4.8,
              discount: 15
            }
          ];
          setProducts(mockProducts);
        }
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Failed to load products. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

  const handleAddToCart = async (product) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    setActionLoading(prev => ({ ...prev, [product._id]: true }));
    try {
      await dispatch(addToCart({ productId: product._id, quantity: 1 })).unwrap();
    } catch (error) {
      console.error('Error adding to cart:', error);
    } finally {
      setActionLoading(prev => ({ ...prev, [product._id]: false }));
    }
  };

  const handleAddToWishlist = async (product) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    setActionLoading(prev => ({ ...prev, [product._id]: true }));
    try {
      await dispatch(addToWishlist(product._id)).unwrap();
    } catch (error) {
      console.error('Error adding to wishlist:', error);
    } finally {
      setActionLoading(prev => ({ ...prev, [product._id]: false }));
    }
  };

  const isInWishlist = (productId) => {
    return wishlistItems.some(item => item._id === productId);
  };

  const categories = [
    { name: 'SmartTV', icon: '📺', count: 9, color: '#000000' },
    { name: 'Speaker', icon: '🔊', count: 3, color: '#d6001c' },
    { name: 'Tablets', icon: '📱', count: 4, color: '#333333' },
    { name: 'Airpods', icon: '🎧', count: 2, color: '#666666' },
    { name: 'Smartwatches', icon: '⌚', count: 10, color: '#999999' },
    { name: 'Smart Phones', icon: '📱', count: 9, color: '#cccccc' },
    { name: 'Headphones', icon: '🎧', count: 2, color: '#e2e1e1' },
    { name: 'Laptops', icon: '💻', count: 6, color: '#ecebeb' },
    { name: 'Bluetooth', icon: '🔵', count: 5, color: '#f5f5f5' }
  ];

  const promotionalProducts = [
    {
      title: 'Galaxy S13 Lite Love The Price',
      subtitle: 'BIG SAVING',
      price: 429.00,
      image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=400&q=100&fit=crop&auto=format',
      action: 'BUY NOW'
    },
    {
      title: 'Smartwatch 7 Light On Price',
      subtitle: '15% OFF',
      price: 399.00,
      image: 'https://images.unsplash.com/photo-1544117519-31a4b719223d?w=400&q=100&fit=crop&auto=format',
      action: 'LEARN MORE'
    },
    {
      title: 'Five Bold Colors. $99 Each',
      subtitle: 'SMART HOME',
      price: 229.00,
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=100&fit=crop&auto=format',
      action: 'BUY NOW'
    },
    {
      title: '5th Generation AirPods',
      subtitle: 'BEST PRICE',
      price: 499.00,
      image: 'https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf0?w=400&q=100&fit=crop&auto=format',
      action: 'LEARN MORE'
    },
    {
      title: 'Headset Max 3rd Generation',
      subtitle: 'FLAT 25% OFF',
      price: 549.00,
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=100&fit=crop&auto=format',
      action: 'BUY NOW'
    },
    {
      title: 'Mac Book Pro. New Arrival',
      subtitle: 'NEWLY ADDED',
      price: 2499.00,
      image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&q=100&fit=crop&auto=format',
      action: 'LEARN MORE'
    }
  ];

  const services = [
    { icon: <LocalShippingIcon />, title: 'Free Delivery From $59.89', description: 'Free shipping on orders over $59.89' },
    { icon: <SecurityIcon />, title: 'Support 24/7 Online 24 hours', description: 'Round the clock customer support' },
    { icon: <RefreshIcon />, title: 'Free Return 365 a day', description: '365 days return policy' },
    { icon: <SecurityIcon />, title: 'Payment Method Secure payment', description: 'Secure payment processing' },
    { icon: <CardGiftcardIcon />, title: 'Big Saving Weeken Sales', description: 'Weekend sales and discounts' }
  ];

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box>
      <Header />
      
      {/* Hero Section with Carousel */}
      <HeroSection>
        <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 2 }}>
          <Box sx={{ position: 'relative', overflow: 'hidden' }}>
            {carouselSlides.map((slide, index) => (
              <Box
                key={slide.id}
                sx={{
                  display: index === currentSlide ? 'block' : 'none',
                  animation: index === currentSlide ? 'fadeIn 0.5s ease-in' : 'none'
                }}
              >
                <Grid spacing={4} alignItems="center">
                  <Grid xs={12} md={6}>
                    <Typography variant="h1" sx={{ mb: 2, fontWeight: 700 }}>
                      {slide.title}
                    </Typography>
                    <Typography variant="h4" sx={{ mb: 1, opacity: 0.9 }}>
                      {slide.subtitle}
                    </Typography>
                    <Typography variant="h5" sx={{ mb: 3, opacity: 0.8 }}>
                      From ${slide.price.toFixed(2)} or ${slide.monthlyPrice.toFixed(2)}/mo.per month
                    </Typography>
                    <Stack direction="row" spacing={2}>
                      <Button 
                        variant="contained" 
                        size="large"
                        sx={{ 
                          backgroundColor: 'white', 
                          color: 'primary.main',
                          '&:hover': { backgroundColor: 'grey.100' }
                        }}
                      >
                        {slide.buttonText}
                      </Button>
                      <Button 
                        variant="text" 
                        size="large"
                        sx={{ color: 'white', textDecoration: 'underline' }}
                      >
                        {slide.learnMoreText}
                      </Button>
                    </Stack>
                  </Grid>
                  <Grid xs={12} md={6}>
                    <Box sx={{ position: 'relative', textAlign: 'center' }}>
                      <Box
                        component="img"
                        src={slide.image}
                        alt={slide.title}
                        sx={{
                          width: '100%',
                          maxWidth: 400,
                          height: 'auto',
                          filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.3))'
                        }}
                      />
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            ))}
            
            {/* Carousel Navigation Dots */}
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'center', 
              mt: 4,
              position: 'absolute',
              bottom: 20,
              left: '50%',
              transform: 'translateX(-50%)',
              zIndex: 3
            }}>
              {carouselSlides.map((_, index) => (
                <Box
                  key={index}
                  sx={{
                    width: 12,
                    height: 12,
                    borderRadius: '50%',
                    backgroundColor: index === currentSlide ? 'white' : 'rgba(255,255,255,0.3)',
                    mx: 1,
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      backgroundColor: index === currentSlide ? 'white' : 'rgba(255,255,255,0.6)'
                    }
                  }}
                  onClick={() => setCurrentSlide(index)}
                />
              ))}
            </Box>
          </Box>
        </Container>
      </HeroSection>

      {/* Promotional Products Grid */}
      <Box sx={{ py: 8 }}>
        <Container maxWidth="xl">
                     <Typography variant="h2" sx={{ textAlign: 'center', mb: 6, fontWeight: 600 }}>
             FEATURED PRODUCTS
           </Typography>
                     <Grid spacing={4}>
             {promotionalProducts.map((product, index) => (
               <Grid xs={12} sm={6} md={4} key={index}>
                 <PromoCard>
                   <CardMedia
                     component="img"
                     height="250"
                     image={product.image}
                     alt={product.title}
                     sx={{
                       objectFit: 'cover',
                       width: '100%'
                     }}
                   />
                                       <CardContent sx={{ p: 4, textAlign: 'center' }}>
                      <Chip 
                        label={product.subtitle} 
                        sx={{ 
                          backgroundColor: 'primary.main', 
                          color: 'white',
                          mb: 3,
                          fontWeight: 600,
                          fontSize: '0.875rem'
                        }} 
                      />
                      <Typography variant="h5" sx={{ mb: 2, fontWeight: 600, lineHeight: 1.3, color: 'black' }}>
                        {product.title}
                      </Typography>
                      <Typography variant="h6" sx={{ mb: 3, opacity: 0.7, fontWeight: 500, color: 'black' }}>
                        From ${product.price.toFixed(2)}
                      </Typography>
                      <Button 
                        variant="contained" 
                        size="large"
                        sx={{ 
                          backgroundColor: 'primary.main', 
                          color: 'white',
                          fontWeight: 600,
                          px: 4,
                          py: 1.5,
                          '&:hover': { backgroundColor: 'primary.dark' }
                        }}
                      >
                        {product.action}
                      </Button>
                    </CardContent>
                 </PromoCard>
               </Grid>
             ))}
           </Grid>
        </Container>
      </Box>

             {/* Trending Products */}
       <Box sx={{ py: 8 }}>
         <Container maxWidth="xl">
           <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
             <Typography variant="h2" sx={{ fontWeight: 600 }}>
               Our Trending Products
             </Typography>
             <Box sx={{ display: 'flex', gap: 1 }}>
               <IconButton 
                 sx={{ border: 1, borderColor: 'grey.300' }}
                 onClick={() => setCurrentProductSlide((prev) => (prev - 1 + Math.ceil(products.length / 4)) % Math.ceil(products.length / 4))}
               >
                 <KeyboardArrowLeftIcon />
               </IconButton>
               <IconButton 
                 sx={{ border: 1, borderColor: 'grey.300' }}
                 onClick={() => setCurrentProductSlide((prev) => (prev + 1) % Math.ceil(products.length / 4))}
               >
                 <KeyboardArrowRightIcon />
               </IconButton>
             </Box>
           </Box>
           
           <Box sx={{ position: 'relative', overflow: 'hidden' }}>
             <Box sx={{ 
               display: 'flex', 
               transition: 'transform 0.5s ease',
               transform: `translateX(-${currentProductSlide * 100}%)`
             }}>
               {Array.from({ length: Math.ceil(products.length / 4) }, (_, slideIndex) => (
                 <Box
                   key={slideIndex}
                   sx={{
                     minWidth: '100%',
                     display: 'flex',
                     gap: 3
                   }}
                 >
                   {products.slice(slideIndex * 4, (slideIndex + 1) * 4).map((product) => (
                     <Box key={product._id} sx={{ flex: 1, minWidth: 0 }}>
                       <ProductCard
                         product={product}
                         onAddToCart={handleAddToCart}
                         onAddToWishlist={handleAddToWishlist}
                         isInWishlist={isInWishlist(product._id)}
                         loading={actionLoading[product._id]}
                       />
                     </Box>
                   ))}
                 </Box>
               ))}
             </Box>
           </Box>
         </Container>
       </Box>

       {/* Services Section */}
       <Box sx={{ py: 8, backgroundColor: 'grey.50' }}>
         <Container maxWidth="xl">
           <Grid spacing={4}>
             {services.map((service, index) => (
                               <Grid xs={12} sm={6} md={2.4} key={index}>
                 <ServiceCard>
                   {service.icon}
                   <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
                     {service.title}
                   </Typography>
                   <Typography variant="body2" color="text.secondary">
                     {service.description}
                   </Typography>
                 </ServiceCard>
               </Grid>
             ))}
           </Grid>
         </Container>
       </Box>

       <Footer />
    </Box>
  );
};

export default Home;