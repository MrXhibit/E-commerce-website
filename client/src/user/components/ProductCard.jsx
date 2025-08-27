import React from 'react';
import {
  Card, CardContent, CardMedia, Typography, Button, Chip, Box, IconButton,
  Rating, useTheme
} from '@mui/material';
import {
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  ShoppingCart as ShoppingCartIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';

const StyledCard = styled(Card)(({ theme }) => ({
  position: 'relative',
  overflow: 'hidden',
  transition: 'all 0.3s ease-in-out',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
    '& .product-image': {
      transform: 'scale(1.05)'
    }
  }
}));

const ProductImage = styled(CardMedia)(({ theme }) => ({
  height: 250,
  transition: 'transform 0.3s ease-in-out',
  cursor: 'pointer'
}));

const DiscountChip = styled(Chip)(({ theme }) => ({
  position: 'absolute',
  top: 16,
  left: 16,
  backgroundColor: theme.palette.secondary.main,
  color: 'white',
  fontWeight: 600,
  zIndex: 2
}));

const WishlistButton = styled(IconButton)(({ theme }) => ({
  position: 'absolute',
  top: 16,
  right: 16,
  backgroundColor: 'rgba(255,255,255,0.9)',
  backdropFilter: 'blur(10px)',
  zIndex: 2,
  '&:hover': {
    backgroundColor: 'white',
    transform: 'scale(1.1)'
  }
}));

const ProductCard = ({ 
  product, 
  onAddToCart, 
  onAddToWishlist, 
  isInWishlist = false,
  loading = false,
  showActions = true 
}) => {
  const theme = useTheme();
  const navigate = useNavigate();

  const handleImageClick = () => {
    navigate(`/product/${product._id}`);
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    if (onAddToCart) {
      onAddToCart(product);
    }
  };

  const handleAddToWishlist = (e) => {
    e.stopPropagation();
    if (onAddToWishlist) {
      onAddToWishlist(product);
    }
  };

  return (
    <StyledCard>
      <Box sx={{ position: 'relative' }}>
        <ProductImage
          component="img"
          image={product.images?.[0] || '/placeholder-product.jpg'}
          alt={product.name}
          className="product-image"
          onClick={handleImageClick}
        />
        
        {product.discount && (
          <DiscountChip
            label={`${product.discount}% OFF`}
            size="small"
          />
        )}
        
        {showActions && (
          <WishlistButton
            onClick={handleAddToWishlist}
            disabled={loading}
            size="small"
          >
            {isInWishlist ? (
              <FavoriteIcon color="error" />
            ) : (
              <FavoriteBorderIcon />
            )}
          </WishlistButton>
        )}
      </Box>
      
      <CardContent sx={{ p: 2, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <Typography 
          variant="h6" 
          sx={{ 
            mb: 1, 
            fontWeight: 600, 
            fontSize: '1rem',
            cursor: 'pointer',
            '&:hover': {
              color: theme.palette.primary.main
            }
          }}
          onClick={handleImageClick}
        >
          {product.name}
        </Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <Rating 
            value={product.rating || 4.5} 
            precision={0.1} 
            size="small" 
            readOnly 
          />
          <Typography 
            variant="body2" 
            sx={{ ml: 1, color: 'text.secondary' }}
          >
            ({product.rating || 4.5})
          </Typography>
        </Box>
        
        <Typography 
          variant="h6" 
          sx={{ 
            mb: 2, 
            color: 'primary.main', 
            fontWeight: 600,
            flexGrow: 1
          }}
        >
          ${typeof product.price === 'string' ? parseFloat(product.price) : product.price}
        </Typography>
        
        {showActions && (
          <Button
            variant="contained"
            fullWidth
            onClick={handleAddToCart}
            disabled={loading}
            startIcon={<ShoppingCartIcon />}
            sx={{
              mt: 'auto',
              py: 1.5,
              fontWeight: 600
            }}
          >
            {loading ? 'Adding...' : 'Add to Cart'}
          </Button>
        )}
      </CardContent>
    </StyledCard>
  );
};

export default ProductCard;