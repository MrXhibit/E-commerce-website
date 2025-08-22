import React, { useState } from 'react';
import {
  Box,
  Tabs,
  Tab,
  Typography,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Button,
  IconButton,
  Chip,
  CircularProgress
} from '@mui/material';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import Slider from 'react-slick';
import { useNavigate } from 'react-router-dom';

const ProductCarousel = ({ 
  products, 
  tabs, 
  onAddToCart, 
  onAddToWishlist, 
  isInWishlist, 
  cartLoading,
  currentTab,
  onTabChange
}) => {
  const navigate = useNavigate();

  const sliderSettings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1920,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 1
        }
      },
      {
        breakpoint: 1536,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1
        }
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1
        }
      },
      {
        breakpoint: 768,
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
    ]
  };

  const handleViewProduct = (productId) => {
    console.log('Product carousel navigation:', productId);
    if (!productId || productId === 'undefined') {
      console.error('Invalid product ID in carousel:', productId);
      return;
    }
    navigate(`/products/${productId}`);
  };

  const isCartLoading = (productId) => {
    return cartLoading && cartLoading[`cart-${productId}`];
  };

  return (
    <Box sx={{ 
      '& .slick-list': {
        overflow: 'visible'
      },
      '& .slick-slide': {
        opacity: 1,
        transition: 'opacity 0.3s ease'
      }
    }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" fontWeight={700} color="text.primary">
          Our Trending Products
        </Typography>
        <Tabs
          value={currentTab}
          onChange={onTabChange}
          sx={{
            '& .MuiTab-root': {
              textTransform: 'none',
              fontWeight: 500,
              fontSize: { xs: '0.9rem', md: '0.95rem', xl: '1rem' }
            }
          }}
        >
          {tabs.map((tab) => (
            <Tab key={tab.value} label={tab.label} value={tab.value} />
          ))}
        </Tabs>
      </Box>

      <Box sx={{ 
        '& .slick-slide': { px: 1 },
        '& .slick-track': { 
          display: 'flex !important',
          gap: 2,
          alignItems: 'stretch'
        },
        '& .slick-slide > div': {
          height: '100%',
          display: 'flex'
        },
        '& .slick-list': {
          overflow: 'hidden'
        }
      }}>
        <Slider {...sliderSettings}>
          {products.map((product) => (
            <Box key={product._id || product.id} sx={{ 
              px: 1,
              height: '100%',
              display: 'flex'
            }}>
                <Card
                  sx={{
                    height: { xs: 380, md: 400, xl: 420 },
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    mx: 1,
                    overflow: 'hidden',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 8px 25px rgba(0,0,0,0.15)'
                    }
                  }}
                  onClick={() => handleViewProduct(product._id || product.id)}
                >
                <Box sx={{ position: 'relative', flexShrink: 0 }}>
                  <CardMedia
                    component="img"
                    height="200"
                    image={product.images?.[0]?.url || '/placeholder.jpg'}
                    alt={product.name}
                    sx={{ objectFit: 'cover' }}
                  />
                  {product.isNew && (
                    <Chip
                      label="New"
                      size="small"
                      sx={{
                        position: 'absolute',
                        top: 8,
                        left: 8,
                        bgcolor: '#ff4444',
                        color: 'white',
                        fontWeight: 600
                      }}
                    />
                  )}
                  <IconButton
                    onClick={(e) => {
                      e.stopPropagation();
                      onAddToWishlist(product._id || product.id, e);
                    }}
                    sx={{
                      position: 'absolute',
                      top: 8,
                      right: 8,
                      bgcolor: 'rgba(255,255,255,0.9)',
                      '&:hover': { bgcolor: 'rgba(255,255,255,1)' }
                    }}
                  >
                    {isInWishlist(product._id || product.id) ? (
                      <FavoriteIcon sx={{ color: '#ff4444' }} />
                    ) : (
                      <FavoriteBorderIcon />
                    )}
                  </IconButton>
                </Box>

                <CardContent sx={{ 
                  flex: 1, 
                  p: { xs: 2, md: 2.5, xl: 3 },
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  minHeight: 0
                }}>
                  <Box sx={{ flex: 1 }}>
                    <Typography
                      variant="h6"
                      fontWeight={600}
                      sx={{
                        mb: 1,
                        fontSize: { xs: '0.95rem', md: '1rem', xl: '1.125rem' },
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      {product.name}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        mb: 1,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        fontSize: { xs: '0.8rem', md: '0.875rem', xl: '0.95rem' },
                        lineHeight: 1.4
                      }}
                    >
                      {product.description}
                    </Typography>
                    <Typography
                      variant="h6"
                      fontWeight={700}
                      color="primary.main"
                      sx={{ 
                        fontSize: { xs: '1rem', md: '1.1rem', xl: '1.25rem' }
                      }}
                    >
                      ${product.price}
                    </Typography>
                  </Box>
                </CardContent>

                <CardActions sx={{ 
                  p: { xs: 2, md: 2.5, xl: 3 }, 
                  pt: 0,
                  flexShrink: 0
                }}>
                  <Button
                    fullWidth
                    variant="contained"
                    startIcon={
                      isCartLoading(product._id) ? (
                        <CircularProgress size={16} color="inherit" />
                      ) : (
                        <ShoppingCartIcon />
                      )
                    }
                    onClick={(e) => {
                      e.stopPropagation();
                      onAddToCart(product._id, e);
                    }}
                    disabled={isCartLoading(product._id)}
                    sx={{
                      textTransform: 'none',
                      fontWeight: 600,
                      borderRadius: 2,
                      fontSize: { xs: '0.875rem', md: '0.95rem', xl: '1rem' },
                      py: 1
                    }}
                  >
                    Add to Cart
                  </Button>
                </CardActions>
              </Card>
            </Box>
          ))}
        </Slider>
      </Box>
    </Box>
  );
};

export default ProductCarousel;