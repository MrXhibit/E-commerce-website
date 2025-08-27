import React from 'react';
import { 
  Box, Container, Typography, Grid, Card, CardContent, CardActionArea
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { styled } from '@mui/material/styles';

const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  transition: 'all 0.3s ease',
  '&:hover': { 
    transform: 'translateY(-4px)', 
    boxShadow: 4,
    backgroundColor: 'primary.light',
    color: 'primary.contrastText'
  }
}));

const categories = [
  // Row 1
  { 
    name: 'Computers', 
    image: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=200&h=200&fit=crop&crop=center', 
    path: '/computers', 
    color: '#2196F3' 
  },
  { 
    name: 'Laptops', 
    image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=200&h=200&fit=crop&crop=center', 
    path: '/laptops', 
    color: '#4CAF50' 
  },
  { 
    name: 'Smartphones', 
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=200&h=200&fit=crop&crop=center', 
    path: '/smartphones', 
    color: '#FF9800' 
  },
  { 
    name: 'Headphones', 
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&h=200&fit=crop&crop=center', 
    path: '/headphones', 
    color: '#9C27B0' 
  },
  { 
    name: 'Gaming', 
    image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=200&h=200&fit=crop&crop=center', 
    path: '/gaming', 
    color: '#F44336' 
  },
  { 
    name: 'Cameras', 
    image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=200&h=200&fit=crop&crop=center', 
    path: '/cameras', 
    color: '#607D8B' 
  },
  { 
    name: 'TV & Audio', 
    image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=200&h=200&fit=crop&crop=center', 
    path: '/tv-audio', 
    color: '#795548' 
  },
  { 
    name: 'Smart Home', 
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&h=200&fit=crop&crop=center', 
    path: '/smart-home', 
    color: '#00BCD4' 
  },
  { 
    name: 'Furniture', 
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=200&h=200&fit=crop&crop=center', 
    path: '/furniture', 
    color: '#8BC34A' 
  },
  { 
    name: 'Home Decor', 
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=200&h=200&fit=crop&crop=center', 
    path: '/home-decor', 
    color: '#FF5722' 
  },
  { 
    name: 'Kitchen', 
    image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=200&h=200&fit=crop&crop=center', 
    path: '/kitchen', 
    color: '#E91E63' 
  },
  { 
    name: 'Bedding', 
    image: 'https://images.unsplash.com/photo-1505693314120-0d443867891c?w=200&h=200&fit=crop&crop=center', 
    path: '/bedding', 
    color: '#3F51B5' 
  },
  { 
    name: 'Garden', 
    image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=200&h=200&fit=crop&crop=center', 
    path: '/garden', 
    color: '#4CAF50' 
  },
  
  // Row 2
  { 
    name: 'Tools', 
    image: 'https://images.unsplash.com/photo-1581147033415-58a7cdc5c4a8?w=200&h=200&fit=crop&crop=center', 
    path: '/tools', 
    color: '#FFC107' 
  },
  { 
    name: 'Clothing', 
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=200&h=200&fit=crop&crop=center', 
    path: '/clothing', 
    color: '#FF9800' 
  },
  { 
    name: 'Shoes', 
    image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=200&h=200&fit=crop&crop=center', 
    path: '/shoes', 
    color: '#9C27B0' 
  },
  { 
    name: 'Jewelry', 
    image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=200&h=200&fit=crop&crop=center', 
    path: '/jewelry', 
    color: '#FFD700' 
  },
  { 
    name: 'Watches', 
    image: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=200&h=200&fit=crop&crop=center', 
    path: '/watches', 
    color: '#607D8B' 
  },
  { 
    name: 'Beauty', 
    image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=200&h=200&fit=crop&crop=center', 
    path: '/beauty', 
    color: '#E91E63' 
  },
  { 
    name: 'Bags', 
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=200&h=200&fit=crop&crop=center', 
    path: '/bags', 
    color: '#795548' 
  },
  { 
    name: 'Sports', 
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=200&h=200&fit=crop&crop=center', 
    path: '/sports', 
    color: '#4CAF50' 
  },
  { 
    name: 'Fitness', 
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=200&h=200&fit=crop&crop=center', 
    path: '/fitness', 
    color: '#F44336' 
  },
  { 
    name: 'Outdoor', 
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=200&h=200&fit=crop&crop=center', 
    path: '/outdoor', 
    color: '#8BC34A' 
  },
  { 
    name: 'Cycling', 
    image: 'https://images.unsplash.com/photo-1544191696-102dbdaeeaa5?w=200&h=200&fit=crop&crop=center', 
    path: '/cycling', 
    color: '#2196F3' 
  },
  { 
    name: 'Health', 
    image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=200&h=200&fit=crop&crop=center', 
    path: '/health', 
    color: '#F44336' 
  },
  { 
    name: 'Personal Care', 
    image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=200&h=200&fit=crop&crop=center', 
    path: '/personal-care', 
    color: '#00BCD4' 
  },
  { 
    name: 'Vitamins', 
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=200&h=200&fit=crop&crop=center', 
    path: '/vitamins', 
    color: '#4CAF50' 
  },
  { 
    name: 'Books', 
    image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=200&h=200&fit=crop&crop=center', 
    path: '/books', 
    color: '#795548' 
  },
  
  // Row 3
  { 
    name: 'Music', 
    image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=200&h=200&fit=crop&crop=center', 
    path: '/music', 
    color: '#9C27B0' 
  },
  { 
    name: 'Movies', 
    image: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=200&h=200&fit=crop&crop=center', 
    path: '/movies', 
    color: '#607D8B' 
  },
  { 
    name: 'Automotive', 
    image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=200&h=200&fit=crop&crop=center', 
    path: '/automotive', 
    color: '#FF9800' 
  },
  { 
    name: 'Industrial', 
    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=200&h=200&fit=crop&crop=center', 
    path: '/industrial', 
    color: '#607D8B' 
  },
  { 
    name: 'Baby', 
    image: 'https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?w=200&h=200&fit=crop&crop=center', 
    path: '/baby', 
    color: '#E91E63' 
  },
  { 
    name: 'Toys', 
    image: 'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=200&h=200&fit=crop&crop=center', 
    path: '/toys', 
    color: '#FFC107' 
  },
  { 
    name: 'Kids Fashion', 
    image: 'https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?w=200&h=200&fit=crop&crop=center', 
    path: '/kids-fashion', 
    color: '#4CAF50' 
  },
  { 
    name: 'Pet Supplies', 
    image: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=200&h=200&fit=crop&crop=center', 
    path: '/pet-supplies', 
    color: '#8BC34A' 
  },
  { 
    name: 'Office', 
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=200&h=200&fit=crop&crop=center', 
    path: '/office', 
    color: '#3F51B5' 
  },
  { 
    name: 'Stationery', 
    image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=200&h=200&fit=crop&crop=center', 
    path: '/stationery', 
    color: '#FF9800' 
  }
];

const EnhancedCategoryNavigation = ({ title = "Shop by Category", showTitle = true }) => {
  const navigate = useNavigate();

  const handleCategoryClick = (path) => {
    navigate(path);
  };

  return (
    <Box sx={{ py: 6, backgroundColor: 'grey.50' }}>
      <Container maxWidth="xl">
        {showTitle && (
          <Typography variant="h3" fontWeight={700} textAlign="center" sx={{ mb: 6, color: 'primary.main' }}>
            {title}
          </Typography>
        )}
        
        {/* Category Grid with 3 rows as shown in the image */}
        <Grid container spacing={2}>
          {categories.map((item, itemIndex) => (
            <Grid item xs={6} sm={4} md={3} lg={2} key={itemIndex}>
              <StyledCard>
                <CardActionArea 
                  onClick={() => handleCategoryClick(item.path)}
                  sx={{ height: '100%', p: 2 }}
                >
                  <CardContent sx={{ textAlign: 'center', p: 1 }}>
                    <Box 
                      sx={{ 
                        width: 80, 
                        height: 80, 
                        borderRadius: '50%', 
                        overflow: 'hidden',
                        mx: 'auto',
                        mb: 2,
                        border: '2px solid',
                        borderColor: 'grey.200',
                        position: 'relative'
                      }}
                    >
                      <img 
                        src={item.image} 
                        alt={item.name}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover'
                        }}
                        onError={(e) => {
                          // Fallback to colored background if image fails to load
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                      {/* Fallback colored circle */}
                      <Box 
                        sx={{ 
                          width: '100%', 
                          height: '100%', 
                          backgroundColor: item.color,
                          display: 'none',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '2rem',
                          color: 'white',
                          fontWeight: 'bold'
                        }}
                      >
                        {item.name.charAt(0)}
                      </Box>
                    </Box>
                    <Typography 
                      variant="subtitle1" 
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
              </StyledCard>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default EnhancedCategoryNavigation;
