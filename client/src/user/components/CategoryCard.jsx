import React from 'react';
import { Card, CardContent, Typography, Box, useTheme } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';

const StyledCard = styled(Card)(({ theme, color }) => ({
  textAlign: 'center',
  cursor: 'pointer',
  transition: 'all 0.3s ease-in-out',
  height: '100%',
  backgroundColor: 'white',
  border: `2px solid transparent`,
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: '0 12px 40px rgba(0,0,0,0.15)',
    borderColor: color || theme.palette.primary.main,
    '& .category-icon': {
      transform: 'scale(1.1)',
      backgroundColor: color || theme.palette.primary.main,
    }
  }
}));

const CategoryIcon = styled(Box)(({ theme, color }) => ({
  width: 80,
  height: 80,
  borderRadius: '50%',
  backgroundColor: color || theme.palette.primary.main,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '2rem',
  margin: '0 auto 16px',
  color: 'white',
  transition: 'all 0.3s ease-in-out',
  boxShadow: `0 4px 20px ${color || theme.palette.primary.main}40`
}));

const CategoryCard = ({ category, onClick }) => {
  const theme = useTheme();
  const navigate = useNavigate();

  const handleClick = () => {
    if (onClick) {
      onClick(category);
    } else {
      navigate(`/products?category=${encodeURIComponent(category.name)}`);
    }
  };

  return (
    <StyledCard color={category.color} onClick={handleClick}>
      <CardContent sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <CategoryIcon 
          color={category.color} 
          className="category-icon"
        >
          {category.icon}
        </CategoryIcon>
        
        <Typography 
          variant="h6" 
          sx={{ 
            mb: 1, 
            fontWeight: 600,
            color: 'text.primary',
            fontSize: '1.1rem'
          }}
        >
          {category.name}
        </Typography>
        
        <Typography 
          variant="body2" 
          color="text.secondary"
          sx={{ 
            fontWeight: 500,
            color: 'text.secondary'
          }}
        >
          {category.count} items
        </Typography>
      </CardContent>
    </StyledCard>
  );
};

export default CategoryCard;