import React from 'react';
import { Box, Container, Typography, Card, CardContent, CardActionArea } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { useNavigate } from 'react-router-dom';

const categories = [
  // Electronics & Technology
  { 
    name: 'Electronics & Technology', 
    items: [
      { name: 'All Electronics', icon: '🔌', path: '/electronics' },
      { name: 'Computers', icon: '💻', path: '/computers' },
      { name: 'Laptops', icon: '💻', path: '/laptops' },
      { name: 'Smartphones', icon: '📱', path: '/smartphones' },
      { name: 'Headphones', icon: '🎧', path: '/headphones' },
      { name: 'Gaming', icon: '🎮', path: '/gaming' },
      { name: 'Cameras', icon: '📷', path: '/cameras' },
      { name: 'TV & Audio', icon: '📺', path: '/tv-audio' },
      { name: 'Smart Home', icon: '🏠', path: '/smart-home' },
    ]
  },
  // Home & Garden
  { 
    name: 'Home & Garden', 
    items: [
      { name: 'Furniture', icon: '🪑', path: '/furniture' },
      { name: 'Home Decor', icon: '🏡', path: '/home-decor' },
      { name: 'Kitchen', icon: '🍳', path: '/kitchen' },
      { name: 'Bedding', icon: '🛏️', path: '/bedding' },
      { name: 'Garden', icon: '🌱', path: '/garden' },
      { name: 'Tools', icon: '🔧', path: '/tools' },
    ]
  },
  // Fashion & Beauty
  { 
    name: 'Fashion & Beauty', 
    items: [
      { name: 'Clothing', icon: '👕', path: '/clothing' },
      { name: 'Shoes', icon: '👟', path: '/shoes' },
      { name: 'Jewelry', icon: '💍', path: '/jewelry' },
      { name: 'Watches', icon: '⌚', path: '/watches' },
      { name: 'Beauty', icon: '💄', path: '/beauty' },
      { name: 'Bags', icon: '👜', path: '/bags' },
    ]
  },
  // Sports & Outdoors
  { 
    name: 'Sports & Outdoors', 
    items: [
      { name: 'Sports', icon: '⚽', path: '/sports' },
      { name: 'Fitness', icon: '💪', path: '/fitness' },
      { name: 'Outdoor', icon: '🏕️', path: '/outdoor' },
      { name: 'Cycling', icon: '🚴', path: '/cycling' },
    ]
  },
  // Health & Personal Care
  { 
    name: 'Health & Personal Care', 
    items: [
      { name: 'Health', icon: '🏥', path: '/health' },
      { name: 'Personal Care', icon: '🧴', path: '/personal-care' },
      { name: 'Vitamins', icon: '💊', path: '/vitamins' },
    ]
  },
  // Books & Media
  { 
    name: 'Books & Media', 
    items: [
      { name: 'Books', icon: '📚', path: '/books' },
      { name: 'Music', icon: '🎵', path: '/music' },
      { name: 'Movies', icon: '🎬', path: '/movies' },
    ]
  },
  // Automotive & Industrial
  { 
    name: 'Automotive & Industrial', 
    items: [
      { name: 'Automotive', icon: '🚗', path: '/automotive' },
      { name: 'Industrial', icon: '🏭', path: '/industrial' },
    ]
  },
  // Baby & Kids
  { 
    name: 'Baby & Kids', 
    items: [
      { name: 'Baby', icon: '👶', path: '/baby' },
      { name: 'Toys', icon: '🧸', path: '/toys' },
      { name: 'Kids Fashion', icon: '👶', path: '/kids-fashion' },
    ]
  },
  // Pet Supplies
  { 
    name: 'Pet Supplies', 
    items: [
      { name: 'Pet Supplies', icon: '🐕', path: '/pet-supplies' },
    ]
  },
  // Office & School
  { 
    name: 'Office & School', 
    items: [
      { name: 'Office', icon: '🏢', path: '/office' },
      { name: 'Stationery', icon: '✏️', path: '/stationery' },
    ]
  },
];

const CategoryNavigation = ({ title = "Shop by Category", showTitle = true }) => {
  const navigate = useNavigate();

  const handleCategoryClick = (path) => {
    navigate(path);
  };

  return (
    <Box sx={{ py: 4 }}>
      <Container maxWidth="xl">
        {showTitle && (
          <Typography variant="h4" fontWeight={700} textAlign="center" sx={{ mb: 4, color: 'primary.main' }}>
            {title}
          </Typography>
        )}
        
        {categories.map((categoryGroup, groupIndex) => (
          <Box key={groupIndex} sx={{ mb: 4 }}>
            <Typography variant="h5" fontWeight={600} sx={{ mb: 2, color: 'text.primary' }}>
              {categoryGroup.name}
            </Typography>
            <Grid spacing={2}>
              {categoryGroup.items.map((item, itemIndex) => (
                <Grid xs={6} sm={4} md={3} lg={2} key={itemIndex}>
                  <Card 
                    sx={{ 
                      height: '100%',
                      transition: 'all 0.3s ease',
                      '&:hover': { 
                        transform: 'translateY(-4px)', 
                        boxShadow: 4,
                        backgroundColor: 'primary.light',
                        color: 'primary.contrastText'
                      }
                    }}
                  >
                    <CardActionArea 
                      onClick={() => handleCategoryClick(item.path)}
                      sx={{ height: '100%', p: 2 }}
                    >
                      <CardContent sx={{ textAlign: 'center', p: 1 }}>
                        <Typography variant="h3" sx={{ mb: 1 }}>
                          {item.icon}
                        </Typography>
                        <Typography 
                          variant="subtitle2" 
                          fontWeight={600}
                          sx={{ 
                            fontSize: { xs: '0.8rem', sm: '0.9rem' },
                            lineHeight: 1.2
                          }}
                        >
                          {item.name}
                        </Typography>
                      </CardContent>
                    </CardActionArea>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        ))}
      </Container>
    </Box>
  );
};

export default CategoryNavigation;