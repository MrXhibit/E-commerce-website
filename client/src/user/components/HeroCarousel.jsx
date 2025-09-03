import React from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Stack,
  IconButton,
  Grid
} from '@mui/material'
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import Slider from 'react-slick';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { addToCart } from '../../store/slices/cartSlice';

// Custom arrow components optimized for desktop
const CustomPrevArrow = ({ onClick }) => (
  <IconButton
    onClick={onClick}
    sx={{
      position: 'absolute',
      left: { xs: 10, md: 30, xl: 50 },
      top: '50%',
      transform: 'translateY(-50%)',
      zIndex: 3,
      bgcolor: 'rgba(255,255,255,0.95)',
      color: 'primary.main',
      width: { xs: 40, md: 50, xl: 60 },
      height: { xs: 40, md: 50, xl: 60 },
      '&:hover': {
        bgcolor: 'white',
        transform: 'translateY(-50%) scale(1.1)',
        boxShadow: '0 8px 25px rgba(0,0,0,0.2)'
      },
      transition: 'all 0.3s ease',
      boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
    }}
  >
    <ArrowBackIosIcon sx={{ fontSize: { xs: 20, md: 24, xl: 28 } }} />
  </IconButton>
);

const CustomNextArrow = ({ onClick }) => (
  <IconButton
    onClick={onClick}
    sx={{
      position: 'absolute',
      right: { xs: 10, md: 30, xl: 50 },
      top: '50%',
      transform: 'translateY(-50%)',
      zIndex: 3,
      bgcolor: 'rgba(255,255,255,0.95)',
      color: 'primary.main',
      width: { xs: 40, md: 50, xl: 60 },
      height: { xs: 40, md: 50, xl: 60 },
      '&:hover': {
        bgcolor: 'white',
        transform: 'translateY(-50%) scale(1.1)',
        boxShadow: '0 8px 25px rgba(0,0,0,0.2)'
      },
      transition: 'all 0.3s ease',
      boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
    }}
  >
    <ArrowForwardIosIcon sx={{ fontSize: { xs: 20, md: 24, xl: 28 } }} />
  </IconButton>
);

const HeroCarousel = ({ products, onAddToCart }) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 1000,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 6000,
    pauseOnHover: true,
    fade: true,
    cssEase: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    prevArrow: <CustomPrevArrow />,
    nextArrow: <CustomNextArrow />,
    dotsClass: 'slick-dots hero-dots-desktop',
    customPaging: (i) => (
      <Box
        sx={{
          width: { xs: 10, md: 12, xl: 16 },
          height: { xs: 10, md: 12, xl: 16 },
          borderRadius: '50%',
          bgcolor: 'rgba(255,255,255,0.6)',
          transition: 'all 0.4s ease',
          cursor: 'pointer',
          '&:hover': {
            bgcolor: 'rgba(255,255,255,0.9)',
            transform: 'scale(1.2)'
          }
        }}
      />
    )
  };

  const handleBuyNow = async (product, event) => {
    event.stopPropagation();
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    try {
      await dispatch(addToCart({ productId: product._id, quantity: 1 })).unwrap();
      navigate('/cart');
    } catch (error) {
      console.error('Failed to add to cart:', error);
    }
  };

  const handleLearnMore = (product, event) => {
    event.stopPropagation();
    const productId = product._id || product.id;
    if (!productId || productId === 'undefined') {
      console.error('Invalid product ID in learn more:', product);
      return;
    }
    navigate(`/products/${productId}`);
  };

  const handleProductClick = (product) => {
    console.log('Hero carousel product click:', product);
    const productId = product._id || product.id;
    if (!product || !productId || productId === 'undefined') {
      console.error('Invalid product in hero carousel:', product);
      return;
    }
    navigate(`/products/${productId}`);
  };

  if (!products || products.length === 0) {
    return null;
  }

  return (
    <Box
      sx={{
        position: 'relative',
        width: '100%',
        overflow: 'hidden',
        '& .hero-dots-desktop': {
          bottom: { xs: 20, md: 30, xl: 40 },
          '& li': {
            margin: { xs: '0 6px', md: '0 8px', xl: '0 12px' },
            '&.slick-active div': {
              bgcolor: 'white !important',
              transform: 'scale(1.3)',
              boxShadow: '0 0 20px rgba(255,255,255,0.8)'
            }
          }
        },
        '& .slick-slide': {
          '& > div': {
            height: '100%'
          }
        }
      }}
    >
      <Slider {...sliderSettings}>
        {products.map((product) => (
          <Box key={product._id || product.id}>
            <Box
              sx={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                width: '100%',
                height: { xs: '70vh', md: '75vh', xl: '80vh' },
                position: 'relative',
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'center'
              }}
            >
              <Container 
                maxWidth="xl" 
                sx={{ 
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  py: { xs: 4, md: 6, xl: 8 }
                }}
              >
                <Grid container 
                  spacing={{ xs: 3, md: 4, xl: 6 }} 
                  alignItems="center" 
                  sx={{ height: '100%' }}
                >
                  {/* Text Content - Left Side */}
                  <Grid size={{ xs: 12, md: 6 }}
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      height: '100%',
                      pr: { md: 2, xl: 4 }
                    }}
                  >
                    <Box
                      onClick={() => handleProductClick(product)}
                      sx={{
                        cursor: 'pointer',
                        '&:hover': {
                          '& .product-title': {
                            transform: 'scale(1.02)',
                            transition: 'transform 0.3s ease'
                          }
                        }
                      }}
                    >
                      <Typography
                        className="product-title"
                        variant="h1"
                        fontWeight={700}
                        sx={{
                          mb: { xs: 2, md: 3, xl: 4 },
                          fontSize: { 
                            xs: '2.5rem', 
                            md: '3.5rem', 
                            lg: '4rem',
                            xl: '4.5rem' 
                          },
                          lineHeight: { xs: 1.2, xl: 1.1 },
                          letterSpacing: '-0.02em',
                          transition: 'transform 0.3s ease'
                        }}
                      >
                        {product.name}
                      </Typography>
                      
                      <Typography
                        variant="h4"
                        sx={{
                          mb: { xs: 2, md: 3, xl: 4 },
                          opacity: 0.95,
                          fontSize: { 
                            xs: '1.3rem', 
                            md: '1.8rem', 
                            xl: '2.2rem' 
                          },
                          fontWeight: 400,
                          lineHeight: 1.3
                        }}
                      >
                        {product.description || 'Premium quality product for professionals'}
                      </Typography>
                      
                      <Typography
                        variant="h2"
                        fontWeight={700}
                        sx={{
                          mb: { xs: 2, md: 3, xl: 4 },
                          fontSize: { 
                            xs: '2rem', 
                            md: '2.8rem', 
                            xl: '3.2rem' 
                          },
                          color: '#FFE082'
                        }}
                      >
                        ${product.price}
                      </Typography>
                      
                      {product.category && (
                        <Typography
                          variant="h6"
                          sx={{
                            mb: { xs: 3, md: 4, xl: 5 },
                            opacity: 0.85,
                            fontSize: { xs: '1rem', md: '1.2rem', xl: '1.4rem' },
                            fontWeight: 500
                          }}
                        >
                          Category: {product.category?.name || product.category}
                        </Typography>
                      )}
                    </Box>
                    
                    <Stack 
                      direction={{ xs: 'column', sm: 'row' }} 
                      spacing={{ xs: 2, md: 3, xl: 4 }}
                      sx={{ mt: { xs: 2, xl: 3 } }}
                    >
                      <Button
                        variant="contained"
                        size="large"
                        onClick={(e) => handleBuyNow(product, e)}
                        sx={{
                          bgcolor: 'white',
                          color: 'primary.main',
                          '&:hover': { 
                            bgcolor: 'grey.100',
                            transform: 'translateY(-2px)',
                            boxShadow: '0 8px 25px rgba(0,0,0,0.2)'
                          },
                          borderRadius: { xs: 2, xl: 3 },
                          px: { xs: 4, md: 5, xl: 6 },
                          py: { xs: 1.5, md: 2, xl: 2.5 },
                          fontWeight: 600,
                          textTransform: 'none',
                          fontSize: { xs: '1.1rem', md: '1.3rem', xl: '1.5rem' },
                          minWidth: { xs: 140, md: 160, xl: 180 },
                          transition: 'all 0.3s ease'
                        }}
                      >
                        Buy Now
                      </Button>
                      
                      <Button
                        variant="outlined"
                        size="large"
                        onClick={(e) => handleLearnMore(product, e)}
                        sx={{
                          borderColor: 'white',
                          color: 'white',
                          borderWidth: 2,
                          '&:hover': {
                            borderColor: 'white',
                            bgcolor: 'rgba(255,255,255,0.15)',
                            transform: 'translateY(-2px)',
                            boxShadow: '0 8px 25px rgba(255,255,255,0.2)'
                          },
                          borderRadius: { xs: 2, xl: 3 },
                          px: { xs: 4, md: 5, xl: 6 },
                          py: { xs: 1.5, md: 2, xl: 2.5 },
                          fontWeight: 600,
                          textTransform: 'none',
                          fontSize: { xs: '1.1rem', md: '1.3rem', xl: '1.5rem' },
                          minWidth: { xs: 140, md: 160, xl: 180 },
                          transition: 'all 0.3s ease'
                        }}
                      >
                        Learn More
                      </Button>
                    </Stack>
                  </Grid>
                  
                  {/* Product Image - Right Side */}
                  <Grid size={{ xs: 12, md: 6 }}
                    sx={{
                      display: 'flex',
                      justifyContent: { xs: 'center', md: 'flex-end' },
                      alignItems: 'center',
                      height: '100%',
                      pl: { md: 2, xl: 4 }
                    }}
                  >
                    <Box
                      onClick={() => handleProductClick(product)}
                      sx={{
                        position: 'relative',
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        justifyContent: { xs: 'center', md: 'flex-end' },
                        alignItems: 'center',
                        cursor: 'pointer'
                      }}
                    >
                      <Box
                        component="img"
                        src={product.images?.[0]?.url || '/placeholder.jpg'}
                        alt={product.name}
                        sx={{
                          width: { 
                            xs: '85%', 
                            md: '90%', 
                            lg: '85%',
                            xl: '80%' 
                          },
                          maxWidth: { xs: 400, md: 500, xl: 600 },
                          height: 'auto',
                          maxHeight: { xs: '60%', md: '70%', xl: '75%' },
                          objectFit: 'contain',
                          borderRadius: { xs: 2, md: 3, xl: 4 },
                          boxShadow: '0 25px 50px rgba(0,0,0,0.4)',
                          transition: 'all 0.4s ease',
                          filter: 'brightness(1.05) contrast(1.1)',
                          '&:hover': {
                            transform: 'scale(1.03) translateY(-5px)',
                            boxShadow: '0 35px 70px rgba(0,0,0,0.5)'
                          }
                        }}
                      />
                    </Box>
                  </Grid>
                </Grid>
              </Container>
            </Box>
          </Box>
        ))}
      </Slider>
    </Box>
  );
};

export default HeroCarousel;