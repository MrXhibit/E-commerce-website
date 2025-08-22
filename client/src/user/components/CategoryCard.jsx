import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Avatar
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const CategoryCard = ({ category }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(category.path);
  };

  return (
    <Card
      onClick={handleClick}
      sx={{
        cursor: 'pointer',
        textAlign: 'center',
        p: { xs: 1.5, md: 2, xl: 2.5 },
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'all 0.3s ease',
        border: '1px solid #f0f0f0',
        borderRadius: 2,
        minHeight: { xs: 120, md: 140, xl: 160 },
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
          borderColor: category.color,
        }
      }}
    >
      <CardContent sx={{ p: 1, '&:last-child': { pb: 1 }, width: '100%' }}>
        <Avatar
          sx={{
            bgcolor: category.color,
            width: { xs: 48, md: 56, xl: 64 },
            height: { xs: 48, md: 56, xl: 64 },
            mb: { xs: 1, md: 1.5, xl: 2 },
            mx: 'auto'
          }}
        >
          {category.icon}
        </Avatar>
        <Typography
          variant="body2"
          fontWeight={600}
          color="text.primary"
          sx={{ 
            fontSize: { xs: '0.8rem', md: '0.875rem', xl: '1rem' },
            mb: { xs: 0.5, md: 0.75, xl: 1 },
            lineHeight: 1.2
          }}
        >
          {category.name}
        </Typography>
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ 
            fontSize: { xs: '0.7rem', md: '0.75rem', xl: '0.875rem' },
            fontWeight: 500,
            opacity: 0.8
          }}
        >
          {category.count}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default CategoryCard;