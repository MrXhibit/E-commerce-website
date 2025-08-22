import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  IconButton,
  useTheme,
  useMediaQuery,
  Fade
} from '@mui/material';
import { 
  ChevronLeft as ChevronLeftIcon, 
  ChevronRight as ChevronRightIcon 
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { addToCart } from '../../store/slices/cartSlice';

interface Product {
  _id?: string;
  id?: string;
  name: string;
  description?: string;
  price: number;
  images?: Array<{ url: string; alt?: string }>;
}

const HeroPinterestCarousel = ({ products, onAddToCart }: { products: Product[]; onAddToCart?: (product: Product) => void }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const [isPaused, setIsPaused] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [preloadedImages, setPreloadedImages] = useState(new Set());
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isLargeDesktop = useMediaQuery(theme.breakpoints.up('xl'));
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAppSelector((state: any) => state.auth);

  if (!products || products.length === 0) {
    return null;
  }

  const handlePrevSlide = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setImageLoaded(false);
    setCurrentSlide((prev) => (prev === 0 ? products.length - 1 : prev - 1));
    setTimeout(() => setIsTransitioning(false), 300);
  };

  const handleNextSlide = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setImageLoaded(false);
    setCurrentSlide((prev) => (prev === products.length - 1 ? 0 : prev + 1));
    setTimeout(() => setIsTransitioning(false), 300);
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
      await (dispatch as any)(addToCart()).unwrap();
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
      handleNextSlide();
    }, 6000); // Change slide every 6 seconds

    return () => clearInterval(interval);
  }, [isPaused]);

  // Preload images for smooth transitions
  useEffect(() => {
    const preloadImage = (url) => {
      if (!url || preloadedImages.has(url)) return;
      
      const img = new Image();
      img.onload = () => {
        setPreloadedImages(prev => new Set([...prev, url]));
      };
      img.src = url;
    };

    // Preload current and next image
    if (products[currentSlide]?.images?.[0]?.url) {
      preloadImage(products[currentSlide].images[0].url);
    }
    
    const nextIndex = (currentSlide + 1) % products.length;
    if (products[nextIndex]?.images?.[0]?.url) {
      preloadImage(products[nextIndex].images[0].url);
    }
  }, [currentSlide, products, preloadedImages]);

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
         height: { xs: '80vh', md: '85vh', xl: '90vh' },
         overflow: 'hidden',
         cursor: 'pointer',
         background: '#ffffff'
       }}
      onClick={() => handleProductClick(currentProduct)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
                     {/* Main Product Image - Card Style */}
        <Box
          component="img"
          src={currentProduct.images?.[0]?.url || '/placeholder.jpg'}
          alt={currentProduct.name}
          onLoad={() => setImageLoaded(true)}
          onError={() => setImageLoaded(false)}
          sx={{
            position: 'absolute',
            top: '50%',
            right: { xs: '5%', md: '6%', xl: '8%' },
            width: { xs: '90%', md: '32%', xl: '28%' },
            height: { xs: '60%', md: '55%', xl: '60%' },
            objectFit: 'cover',
            objectPosition: 'center',
            borderRadius: { xs: 3, md: 4, xl: 5 },
            boxShadow: '0 25px 80px rgba(0,0,0,0.5), 0 8px 32px rgba(0,0,0,0.3)',
            transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
            filter: imageLoaded ? 'brightness(1)' : 'brightness(0.9)',
            transform: 'translateY(-50%)',
            imageRendering: 'crisp-edges',
            WebkitImageSmoothing: 'antialiased',
            MozImageSmoothing: 'antialiased',
            msImageSmoothing: 'antialiased',
            imageSmoothing: 'antialiased',
            opacity: imageLoaded ? 1 : 0.9,
            willChange: 'transform, opacity, filter',
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            transformStyle: 'preserve-3d',
            border: '3px solid rgba(0,0,0,0.1)',
            zIndex: 2,
            '@media (max-width: 600px)': {
              right: '5%',
              width: '90%',
              height: '60%'
            }
          }}
        />

             {/* Loading Overlay */}
       {!imageLoaded && (
         <Box
           sx={{
             position: 'absolute',
             top: 0,
             left: 0,
             width: '100%',
             height: '100%',
             background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
             display: 'flex',
             justifyContent: 'center',
             alignItems: 'center',
             zIndex: 1
           }}
         >
           <Box
             sx={{
               width: 60,
               height: 60,
               border: '3px solid rgba(255,255,255,0.3)',
               borderTop: '3px solid #FFD700',
               borderRadius: '50%',
               animation: 'spin 1s linear infinite',
               '@keyframes spin': {
                 '0%': { transform: 'rotate(0deg)' },
                 '100%': { transform: 'rotate(360deg)' }
               }
             }}
           />
         </Box>
       )}

               {/* Background */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: '#ffffff',
            pointerEvents: 'none',
            zIndex: 1
          }}
        />

      {/* Content Overlay - Centered Typography */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: { xs: 'center', md: 'flex-start' },
          px: { xs: 3, md: 4, xl: 6 },
          py: { xs: 3, md: 4, xl: 6 },
          zIndex: 2
        }}
      >
                 {/* Product Information - Centered on Mobile, Left-aligned on Desktop */}
         <Box
           sx={{
             textAlign: { xs: 'center', md: 'left' },
             maxWidth: { xs: '100%', md: '55%', xl: '50%' },
             color: '#000000',
             position: 'relative'
           }}
         >
          {/* Product Name */}
          <Fade in={!isTransitioning} timeout={500}>
                         <Typography
               variant={isMobile ? 'h3' : 'h2'}
               sx={{
                 fontWeight: 600,
                 fontSize: { 
                   xs: '1.8rem', 
                   md: '2.2rem', 
                   lg: '2.5rem',
                   xl: '2.8rem' 
                 },
                 lineHeight: { xs: 1.2, md: 1.1 },
                 letterSpacing: { xs: '-0.01em', md: '-0.02em' },
                 mb: { xs: 2, md: 3, xl: 4 },
                 color: '#000000',
                 fontFamily: '"Poppins", "Inter", "Roboto", "Helvetica", "Arial", sans-serif'
               }}
             >
              {currentProduct.name}
            </Typography>
          </Fade>

          {/* Product Description/Tagline */}
          {currentProduct.description && (
            <Fade in={!isTransitioning} timeout={700}>
                             <Typography
                 variant={isMobile ? 'body1' : 'h6'}
                 sx={{
                   fontWeight: 400,
                   fontSize: { 
                     xs: '1rem', 
                     md: '1.2rem', 
                     lg: '1.3rem',
                     xl: '1.4rem' 
                   },
                   lineHeight: 1.5,
                   mb: { xs: 3, md: 4, xl: 5 },
                   color: '#666666',
                   fontFamily: '"Poppins", "Inter", "Roboto", "Helvetica", "Arial", sans-serif',
                   maxWidth: { xs: '100%', md: '80%' }
                 }}
               >
                {currentProduct.description}
              </Typography>
            </Fade>
          )}

          {/* Price */}
          <Fade in={!isTransitioning} timeout={900}>
                         <Typography
               variant={isMobile ? 'h4' : 'h3'}
               sx={{
                 fontWeight: 600,
                 fontSize: { 
                   xs: '1.6rem', 
                   md: '2rem', 
                   lg: '2.2rem',
                   xl: '2.5rem' 
                 },
                 color: '#1976d2',
                 mb: { xs: 4, md: 5, xl: 6 },
                 fontFamily: '"Poppins", "Inter", "Roboto", "Helvetica", "Arial", sans-serif'
               }}
             >
              ${currentProduct.price}
            </Typography>
          </Fade>

          {/* Action Buttons */}
          <Fade in={!isTransitioning} timeout={1100}>
            <Box
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                gap: { xs: 2, md: 2.5 },
                justifyContent: { xs: 'center', md: 'flex-start' },
                flexWrap: 'wrap'
              }}
            >
                             <Box
                 onClick={(e) => handleAddToCart(currentProduct, e)}
                 sx={{
                   bgcolor: '#1976d2',
                   color: 'white',
                   px: { xs: 3, md: 4, xl: 5 },
                   py: { xs: 1.5, md: 2, xl: 2.5 },
                   borderRadius: { xs: 3, xl: 4 },
                   cursor: 'pointer',
                   fontWeight: 500,
                   fontSize: { xs: '0.9rem', md: '1rem', xl: '1.1rem' },
                   textAlign: 'center',
                   transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                   '&:hover': {
                     bgcolor: '#1565c0',
                     transform: 'translateY(-3px)',
                     boxShadow: '0 12px 30px rgba(25, 118, 210, 0.3)'
                   },
                   textTransform: 'none',
                   fontFamily: '"Poppins", "Inter", "Roboto", "Helvetica", "Arial", sans-serif',
                   minWidth: { xs: '140px', md: '160px' }
                 }}
               >
                Add to Cart
              </Box>
              
                             <Box
                 sx={{
                   border: '2px solid #1976d2',
                   color: '#1976d2',
                   px: { xs: 3, md: 4, xl: 5 },
                   py: { xs: 1.5, md: 2, xl: 2.5 },
                   borderRadius: { xs: 3, xl: 4 },
                   cursor: 'pointer',
                   fontWeight: 500,
                   fontSize: { xs: '0.9rem', md: '1rem', xl: '1.1rem' },
                   textAlign: 'center',
                   transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                   '&:hover': {
                     bgcolor: '#1976d2',
                     color: 'white',
                     transform: 'translateY(-3px)',
                     boxShadow: '0 12px 30px rgba(25, 118, 210, 0.3)'
                   },
                   textTransform: 'none',
                   fontFamily: '"Poppins", "Inter", "Roboto", "Helvetica", "Arial", sans-serif',
                   minWidth: { xs: '140px', md: '160px' }
                 }}
               >
                Learn More
              </Box>
            </Box>
          </Fade>
        </Box>
      </Box>

      {/* Navigation Arrows - Minimalist and Discreet */}
      <IconButton
        onClick={(e) => {
          e.stopPropagation();
          handlePrevSlide();
        }}
        aria-label="Previous slide"
        sx={{
          position: 'absolute',
          left: { xs: 16, md: 24, xl: 32 },
          top: '50%',
          transform: 'translateY(-50%)',
          bgcolor: 'rgba(0,0,0,0.3)',
          color: 'white',
          width: { xs: 44, md: 52, xl: 56 },
          height: { xs: 44, md: 52, xl: 56 },
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255,255,255,0.2)',
          '&:hover': {
            bgcolor: 'rgba(0,0,0,0.5)',
            transform: 'translateY(-50%) scale(1.05)',
            borderColor: 'rgba(255,255,255,0.4)'
          },
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          zIndex: 3,
          display: 'none'
        }}
      >
        <ChevronLeftIcon sx={{ fontSize: { xs: 20, md: 24, xl: 28 } }} />
      </IconButton>

      <IconButton
        onClick={(e) => {
          e.stopPropagation();
          handleNextSlide();
        }}
        aria-label="Next slide"
        sx={{
          position: 'absolute',
          right: { xs: 16, md: 24, xl: 32 },
          top: '50%',
          transform: 'translateY(-50%)',
          bgcolor: 'rgba(0,0,0,0.3)',
          color: 'white',
          width: { xs: 44, md: 52, xl: 56 },
          height: { xs: 44, md: 52, xl: 56 },
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255,255,255,0.2)',
          '&:hover': {
            bgcolor: 'rgba(0,0,0,0.5)',
            transform: 'translateY(-50%) scale(1.05)',
            borderColor: 'rgba(255,255,255,0.4)'
          },
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          zIndex: 3,
          display: 'none'
        }}
      >
        <ChevronRightIcon sx={{ fontSize: { xs: 20, md: 24, xl: 28 } }} />
      </IconButton>

      {/* Pagination Dots - Below Content */}
      <Box
        sx={{
          position: 'absolute',
          bottom: { xs: 32, md: 40, xl: 48 },
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          gap: { xs: 1.5, md: 2, xl: 2.5 },
          zIndex: 3
        }}
      >
        {products.map((_, index) => (
                       <Box
               key={index}
               onClick={(e) => {
                 e.stopPropagation();
                 setImageLoaded(false);
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
              width: { xs: 10, md: 12, xl: 14 },
              height: { xs: 10, md: 12, xl: 14 },
              borderRadius: '50%',
              bgcolor: index === currentSlide ? 'white' : 'rgba(255,255,255,0.4)',
              cursor: 'pointer',
              transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
              backdropFilter: 'blur(10px)',
              '&:hover': {
                bgcolor: index === currentSlide ? 'white' : 'rgba(255,255,255,0.7)',
                transform: 'scale(1.3)'
              }
            }}
          />
        ))}
      </Box>

             {/* Quality Indicator & Slide Counter */}
       <Box
         sx={{
           position: 'absolute',
           bottom: { xs: 20, md: 24, xl: 28 },
           right: { xs: 20, md: 28, xl: 36 },
           zIndex: 3,
           display: 'flex',
           flexDirection: 'column',
           gap: 1,
           alignItems: 'flex-end'
         }}
       >
         {/* HD Quality Badge */}
         <Box
           sx={{
             bgcolor: 'rgba(0,255,0,0.2)',
             color: '#00ff00',
             px: 1.5,
             py: 0.5,
             borderRadius: 1,
             fontSize: { xs: '0.6rem', md: '0.7rem' },
             fontWeight: 600,
             border: '1px solid rgba(0,255,0,0.4)',
             backdropFilter: 'blur(10px)',
             fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif'
           }}
         >
           HD 2K
         </Box>
         
         {/* Slide Counter */}
         <Typography
           variant="caption"
           sx={{
             color: 'rgba(255,255,255,0.7)',
             fontSize: { xs: '0.75rem', md: '0.875rem' },
             fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
             bgcolor: 'rgba(0,0,0,0.3)',
             px: 2,
             py: 1,
             borderRadius: 2,
             backdropFilter: 'blur(10px)'
           }}
         >
           {currentSlide + 1} / {products.length}
         </Typography>
       </Box>
    </Box>
  );
};

export default HeroPinterestCarousel;
