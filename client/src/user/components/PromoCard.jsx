import React from 'react';
import { Card, CardContent, Typography, Button, Box } from '@mui/material';

const PromoCard = ({ promo }) => {
  return (
    <Card 
      sx={{ 
        height: '100%',
        background: promo.bgColor || '#f5f5f5',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflow: 'hidden',
        borderRadius: 2,
        boxShadow: 2,
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 4
        }
      }}
    >
      <CardContent sx={{ flexGrow: 1, p: 3, display: 'flex', flexDirection: 'column' }}>
        <Typography 
          variant="h5" 
          component="h3" 
          fontWeight={700}
          sx={{ mb: 1, color: 'text.primary' }}
        >
          {promo.title}
        </Typography>
        
        <Typography 
          variant="h6" 
          component="h4" 
          sx={{ mb: 2, color: 'text.secondary', fontWeight: 500 }}
        >
          {promo.subtitle}
        </Typography>
        
        <Typography 
          variant="body1" 
          sx={{ mb: 3, color: 'text.primary', fontWeight: 600 }}
        >
          {promo.description}
        </Typography>
        
        <Box sx={{ mt: 'auto' }}>
          <Button 
            variant="contained" 
            color="primary"
            sx={{ 
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 600,
              px: 3,
              py: 1
            }}
          >
            {promo.cta}
          </Button>
        </Box>
      </CardContent>
      
      {promo.image && (
        <Box 
          sx={{ 
            position: 'absolute',
            right: -20,
            top: '50%',
            transform: 'translateY(-50%)',
            width: 120,
            height: 120,
            backgroundImage: `url(${promo.image})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            borderRadius: '50%',
            opacity: 0.3
          }}
        />
      )}
    </Card>
  );
};

export default PromoCard;