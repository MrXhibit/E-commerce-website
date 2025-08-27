import { useState, useEffect } from 'react';
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
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { addToCart } from '@/store/slices/cartSlice';
import { Product } from '@/types';

interface HeroPinterestCarouselProps {
  products: Product[];
  onAddToCart?: (product: Product) => void;
}

const HeroPinterestCarousel = ({ products, onAddToCart }: HeroPinterestCarouselProps) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [preloadedImages, setPreloadedImages] = useState(new Set<string>());
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAppSelector((state) => state.auth);

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
    setCurrentSlide((prev) => (prev === products.length - 1 ? 0 : prev - 1));
    setTimeout(() => setIsTransitioning(false), 300);
  };

  // Touch handlers for mobile swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
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

  const handleProductClick = (product: Product) => {
    const productId = product._id || product.id;
    if (!productId || productId === 'undefined') {
      console.error('Invalid product ID in hero carousel:', product);
      return;
    }
    navigate(`/products/${productId}`);
  };

  const handleAddToCart = async (product: Product, event: React.MouseEvent) => {
    event.stopPropagation();
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    try {
      const productId = product._id || product.id;
      if (!productId) {
        console.error('Product has no valid ID');
        return;
      }
      await dispatch(addToCart({ productId, quantity: 1 })).unwrap();
      // Show success feedback (you can add a snackbar here)
    } catch (error) {
      console.error('Failed to add to cart:', error);
    }
  };

  const currentProduct = products[currentSlide];

  // Preload images for smooth transitions
  useEffect(() => {
    const preloadImage = (url: string) => {
      if (preloadedImages.has(url)) return;
      
      const img = new Image();
      img.onload = () => {
        setPreloadedImages(prev => new Set(prev).add(url));
      };
      img.src = url;
    };

    // Preload current and next image
    if (currentProduct.images?.[0]) {
      preloadImage(currentProduct.images[0]);
    }
    
    const nextIndex = (currentSlide + 1) % products.length;
    const nextProduct = products[nextIndex];
    if (nextProduct.images?.[0]) {
      preloadImage(nextProduct.images[0]);
    }
  }, [currentSlide, products, preloadedImages]);

  // Auto-advance carousel
  useEffect(() => {
    if (isPaused || isTransitioning) return;
    
    const interval = setInterval(() => {
      handleNextSlide();
    }, 6000); // Change slide every 6 seconds

    return () => clearInterval(interval);
  }, [isPaused, isTransitioning]);

  // Pause carousel on hover
  const handleMouseEnter = () => setIsPaused(true);
  const handleMouseLeave = () => setIsPaused(false);

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') {
      handlePrevSlide();
    } else if (e.key === 'ArrowRight') {
      handleNextSlide();
    }
  };

  return (
    <Box
      sx={{
        position: 'relative',
        width: '100%',
        height: { xs: '400px', md: '600px' },
        overflow: 'hidden',
        backgroundColor: 'background.default',
        borderRadius: { xs: 0, md: 2 },
        boxShadow: { xs: 0, md: 3 },
        mb: 4
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="region"
      aria-label="Product carousel"
    >
      {/* Main Image */}
      <Box
        sx={{
          position: 'relative',
          width: '100%',
          height: '100%',
          cursor: 'pointer'
        }}
        onClick={() => handleProductClick(currentProduct)}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <Fade in={!isTransitioning} timeout={300}>
          <img
            src={currentProduct.images?.[0] || '/placeholder-image.jpg'}
            alt={currentProduct.name}
            onLoad={() => setImageLoaded(true)}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transition: 'transform 0.3s ease-in-out'
            }}
          />
        </Fade>
        
        {/* Overlay with product info */}
        <Box
          sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            background: 'linear-gradient(transparent, rgba(0,0,0,0.8))',
            color: 'white',
            p: 3,
            textAlign: 'center'
          }}
        >
          <Typography variant="h4" component="h2" gutterBottom>
            {currentProduct.name}
          </Typography>
          <Typography variant="h6" gutterBottom>
            ${currentProduct.price}
          </Typography>
          {currentProduct.description && (
            <Typography variant="body1" sx={{ mb: 2 }}>
              {currentProduct.description.substring(0, 120)}...
            </Typography>
          )}
          
          {/* Add to Cart Button */}
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
            <IconButton
              onClick={(e) => handleAddToCart(currentProduct, e)}
              sx={{
                backgroundColor: 'primary.main',
                color: 'white',
                '&:hover': {
                  backgroundColor: 'primary.dark',
                },
                px: 3,
                py: 1
              }}
            >
              Add to Cart
            </IconButton>
          </Box>
        </Box>
      </Box>

      {/* Navigation Arrows */}
      <IconButton
        onClick={handlePrevSlide}
        sx={{
          position: 'absolute',
          left: 16,
          top: '50%',
          transform: 'translateY(-50%)',
          backgroundColor: 'rgba(255,255,255,0.8)',
          '&:hover': {
            backgroundColor: 'rgba(255,255,255,0.9)',
          },
          display: { xs: 'none', md: 'flex' }
        }}
      >
        <ChevronLeftIcon />
      </IconButton>

      <IconButton
        onClick={handleNextSlide}
        sx={{
          position: 'absolute',
          right: 16,
          top: '50%',
          transform: 'translateY(-50%)',
          backgroundColor: 'rgba(255,255,255,0.8)',
          '&:hover': {
            backgroundColor: 'rgba(255,255,255,0.9)',
          },
          display: { xs: 'none', md: 'flex' }
        }}
      >
        <ChevronRightIcon />
      </IconButton>

      {/* Dots Indicator */}
      <Box
        sx={{
          position: 'absolute',
          bottom: 16,
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          gap: 1
        }}
      >
        {products.map((_, index) => (
          <Box
            key={index}
            sx={{
              width: 12,
              height: 12,
              borderRadius: '50%',
              backgroundColor: index === currentSlide ? 'white' : 'rgba(255,255,255,0.5)',
              cursor: 'pointer',
              transition: 'background-color 0.3s ease'
            }}
            onClick={() => setCurrentSlide(index)}
          />
        ))}
      </Box>
    </Box>
  );
};

export default HeroPinterestCarousel;
