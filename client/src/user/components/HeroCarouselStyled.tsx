import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  IconButton,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { 
  ChevronLeft as ChevronLeftIcon, 
  ChevronRight as ChevronRightIcon 
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { addToCart } from '../../store/slices/cartSlice';

const HeroCarouselStyled = ({ products, onAddToCart }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const [isPaused, setIsPaused] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  if (!products || products.length === 0) {
    return null;
  }

  const handlePrevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? products.length - 1 : prev - 1));
  };

  const handleNextSlide = () => {
    setCurrentSlide((prev) => (prev === products.length - 1 ? 0 : prev + 1));
  };

  // Touch handlers for mobile swipe
  const handleTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      handleNextSlide();
    }
    if (isRightSwipe) {
      handlePrevSlide();
    }
  };

  const handleProductClick = (product) => {
    const productId = product._id || product.id;
    if (!productId || productId === 'undefined') {
      console.error('Invalid product ID in hero carousel:', product);
      return;
    }
    navigate(`/products/${productId}`);
  };

  const handleAddToCart = async (product, event) => {
    event.stopPropagation();
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    try {
      await dispatch(addToCart({ productId: product._id || product.id, quantity: 1 })).unwrap();
      // Show success feedback (you can add a snackbar here)
    } catch (error) {
      console.error('Failed to add to cart:', error);
    }
  };

  const currentProduct = products[currentSlide];

  // Auto-advance carousel
  useEffect(() => {
    if (isPaused) return;
    
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev === products.length - 1 ? 0 : prev + 1));
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, [products.length, isPaused]);



  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') {
        handlePrevSlide();
      } else if (e.key === 'ArrowRight') {
        handleNextSlide();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
         <Box
       sx={{
         position: 'relative',
         width: '100%',
         height: { xs: '70vh', md: '80vh', xl: '85vh' },
         overflow: 'hidden',
         background: '#f8f9fa',
         cursor: 'pointer'
       }}
      onClick={() => handleProductClick(currentProduct)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
             {/* Main Product Image - Right Side on Desktop, Full Width on Mobile */}
       <Box
         component="img"
         src={currentProduct.images?.[0]?.url || '/placeholder.jpg'}
         alt={currentProduct.name}
         sx={{
           position: 'absolute',
           [theme.breakpoints.down('md')]: {
             top: 0,
             left: 0,
             width: '100%',
             height: '60%'
           },
           [theme.breakpoints.up('md')]: {
             right: '10%',
             top: '50%',
             transform: 'translateY(-50%)',
             width: '35%',
             height: '70%',
             borderRadius: '16px',
             boxShadow: '0 20px 40px rgba(0,0,0,0.15)'
           },
           objectFit: 'cover',
           objectPosition: 'center',
           transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
           filter: 'brightness(1.05)',
           animation: 'fadeIn 0.8s ease-in-out',
           '@keyframes fadeIn': {
             '0%': {
               opacity: 0.8,
               transform: 'translateY(-50%) scale(1.05)'
             },
             '100%': {
               opacity: 1,
               transform: 'translateY(-50%) scale(1)'
             }
           }
         }}
       />

             {/* Background Color - Left Side on Desktop, Bottom on Mobile */}
       <Box
         sx={{
           position: 'absolute',
           [theme.breakpoints.down('md')]: {
             bottom: 0,
             left: 0,
             width: '100%',
             height: '40%'
           },
           [theme.breakpoints.up('md')]: {
             top: 0,
             left: 0,
             width: '55%',
             height: '100%'
           },
           background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
           pointerEvents: 'none'
         }}
       />

             {/* Content Overlay - Left Side on Desktop, Bottom on Mobile */}
       <Container
         maxWidth="xl"
         sx={{
           position: 'absolute',
           [theme.breakpoints.down('md')]: {
             bottom: 0,
             left: 0,
             width: '100%',
             height: '40%',
             justifyContent: 'center',
             alignItems: 'center'
           },
           [theme.breakpoints.up('md')]: {
             top: 0,
             left: 0,
             width: '55%',
             height: '100%',
             justifyContent: 'center',
             alignItems: 'flex-start'
           },
           display: 'flex',
           flexDirection: 'column',
           px: { xs: 3, md: 6, xl: 8 },
           py: { xs: 4, md: 6, xl: 8 }
         }}
       >
                 {/* Product Information */}
         <Box
           sx={{
             textAlign: { xs: 'center', md: 'left' },
             width: '100%',
             color: 'white',
             zIndex: 2,
             position: 'relative'
           }}
         >
                     {/* Product Name */}
           <Typography
             variant={isMobile ? 'h3' : 'h2'}
             sx={{
               fontWeight: 700,
               fontSize: { 
                 xs: '2rem', 
                 md: '2.5rem', 
                 lg: '3rem',
                 xl: '3.5rem' 
               },
               lineHeight: { xs: 1.2, md: 1.1 },
               letterSpacing: { xs: '-0.01em', md: '-0.02em' },
               mb: { xs: 2, md: 3, xl: 4 },
               textShadow: '0 2px 8px rgba(0,0,0,0.3)',
               fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif'
             }}
           >
             {currentProduct.name}
           </Typography>

                     {/* Product Description/Tagline */}
           {currentProduct.description && (
             <Typography
               variant={isMobile ? 'body1' : 'h6'}
               sx={{
                 fontWeight: 400,
                 fontSize: { 
                   xs: '1rem', 
                   md: '1.1rem', 
                   lg: '1.2rem',
                   xl: '1.3rem' 
                 },
                 lineHeight: 1.5,
                 mb: { xs: 2, md: 3, xl: 4 },
                 opacity: 0.9,
                 textShadow: '0 1px 4px rgba(0,0,0,0.3)',
                 fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif'
               }}
             >
               {currentProduct.description}
             </Typography>
           )}

                     {/* Price */}
           <Typography
             variant={isMobile ? 'h4' : 'h3'}
             sx={{
               fontWeight: 700,
               fontSize: { 
                 xs: '1.8rem', 
                 md: '2rem', 
                 lg: '2.5rem',
                 xl: '3rem' 
               },
               color: '#FFD700',
               mb: { xs: 3, md: 4, xl: 5 },
               textShadow: '0 2px 8px rgba(0,0,0,0.4)',
               fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif'
             }}
           >
             ${currentProduct.price}
           </Typography>

          {/* Action Buttons */}
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              gap: { xs: 2, md: 3 },
              justifyContent: { xs: 'center', md: 'flex-start' }
            }}
          >
                         <Box
               onClick={(e) => handleAddToCart(currentProduct, e)}
               sx={{
                 bgcolor: 'rgba(255,255,255,0.95)',
                 color: 'text.primary',
                 px: { xs: 3, md: 4, xl: 5 },
                 py: { xs: 1.5, md: 2, xl: 2.5 },
                 borderRadius: { xs: 2, xl: 3 },
                 cursor: 'pointer',
                 fontWeight: 600,
                 fontSize: { xs: '0.9rem', md: '1rem', xl: '1.1rem' },
                 textAlign: 'center',
                 transition: 'all 0.3s ease',
                 '&:hover': {
                   bgcolor: 'white',
                   transform: 'translateY(-2px)',
                   boxShadow: '0 8px 25px rgba(0,0,0,0.2)'
                 },
                 textTransform: 'none',
                 fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif'
               }}
             >
               Add to Cart
             </Box>
            
                         <Box
               sx={{
                 border: '2px solid rgba(255,255,255,0.8)',
                 color: 'white',
                 px: { xs: 3, md: 4, xl: 5 },
                 py: { xs: 1.5, md: 2, xl: 2.5 },
                 borderRadius: { xs: 2, xl: 3 },
                 cursor: 'pointer',
                 fontWeight: 600,
                 fontSize: { xs: '0.9rem', md: '1rem', xl: '1.1rem' },
                 textAlign: 'center',
                 transition: 'all 0.3s ease',
                 '&:hover': {
                   bgcolor: 'rgba(255,255,255,0.15)',
                   borderColor: 'white',
                   transform: 'translateY(-2px)'
                 },
                 textTransform: 'none',
                 fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif'
               }}
             >
               Learn More
             </Box>
          </Box>
        </Box>
      </Container>

      {/* Navigation Arrows */}
      <IconButton
        onClick={(e) => {
          e.stopPropagation();
          handlePrevSlide();
        }}
        aria-label="Previous slide"
        sx={{
          position: 'absolute',
          left: { xs: 16, md: 32, xl: 48 },
          top: '50%',
          transform: 'translateY(-50%)',
          bgcolor: 'rgba(255,255,255,0.9)',
          color: 'text.primary',
          width: { xs: 48, md: 56, xl: 64 },
          height: { xs: 48, md: 56, xl: 64 },
          '&:hover': {
            bgcolor: 'white',
            transform: 'translateY(-50%) scale(1.05)',
            boxShadow: '0 4px 20px rgba(0,0,0,0.15)'
          },
          transition: 'all 0.3s ease',
          zIndex: 3
        }}
      >
        <ChevronLeftIcon sx={{ fontSize: { xs: 24, md: 28, xl: 32 } }} />
      </IconButton>

      <IconButton
        onClick={(e) => {
          e.stopPropagation();
          handleNextSlide();
        }}
        aria-label="Next slide"
        sx={{
          position: 'absolute',
          right: { xs: 16, md: 32, xl: 48 },
          top: '50%',
          transform: 'translateY(-50%)',
          bgcolor: 'rgba(255,255,255,0.9)',
          color: 'text.primary',
          width: { xs: 48, md: 56, xl: 64 },
          height: { xs: 48, md: 56, xl: 64 },
          '&:hover': {
            bgcolor: 'white',
            transform: 'translateY(-50%) scale(1.05)',
            boxShadow: '0 4px 20px rgba(0,0,0,0.15)'
          },
          transition: 'all 0.3s ease',
          zIndex: 3
        }}
      >
        <ChevronRightIcon sx={{ fontSize: { xs: 24, md: 28, xl: 32 } }} />
      </IconButton>

      {/* Pagination Dots */}
      <Box
        sx={{
          position: 'absolute',
          bottom: { xs: 24, md: 32, xl: 40 },
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          gap: { xs: 1, md: 1.5, xl: 2 },
          zIndex: 3
        }}
      >
                  {products.map((_, index) => (
            <Box
              key={index}
              onClick={(e) => {
                e.stopPropagation();
                setCurrentSlide(index);
              }}
              role="button"
              tabIndex={0}
              aria-label={`Go to slide ${index + 1}`}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setCurrentSlide(index);
                }
              }}
              sx={{
              width: { xs: 8, md: 10, xl: 12 },
              height: { xs: 8, md: 10, xl: 12 },
              borderRadius: '50%',
              bgcolor: index === currentSlide ? 'white' : 'rgba(255,255,255,0.5)',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              '&:hover': {
                bgcolor: index === currentSlide ? 'white' : 'rgba(255,255,255,0.8)',
                transform: 'scale(1.2)'
              }
            }}
          />
        ))}
      </Box>

      {/* Auto-advance indicator */}
      <Box
        sx={{
          position: 'absolute',
          bottom: { xs: 16, md: 20, xl: 24 },
          right: { xs: 16, md: 32, xl: 48 },
          zIndex: 3
        }}
      >
        <Typography
          variant="caption"
          sx={{
            color: 'rgba(255,255,255,0.8)',
            fontSize: { xs: '0.75rem', md: '0.875rem' },
            fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif'
          }}
        >
          {currentSlide + 1} / {products.length}
        </Typography>
      </Box>

      {/* Progress Bar */}
      <Box
        sx={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: '100%',
          height: 3,
          bgcolor: 'rgba(255,255,255,0.2)',
          zIndex: 3
        }}
      >
        <Box
          sx={{
            height: '100%',
            bgcolor: 'white',
            width: `${((currentSlide + 1) / products.length) * 100}%`,
            transition: 'width 0.3s ease',
            borderRadius: '0 2px 2px 0'
          }}
        />
      </Box>
    </Box>
  );
};

export default HeroCarouselStyled;
