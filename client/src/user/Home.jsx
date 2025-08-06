import React from 'react';
import { Container, Typography, Grid, Card, CardMedia, CardContent, CardActions, Button, Box } from '@mui/material';
import Header from './Header';
import Footer from './Footer';

// Mock category data
const categories = [
  { name: 'Electronics', icon: '📱', count: 150 },
  { name: 'Fashion', icon: '👕', count: 200 },
  { name: 'Home & Garden', icon: '🏠', count: 100 },
  { name: 'Sports', icon: '⚽', count: 80 },
];

// Mock product data
const products = [
  {
    id: 1,
    name: 'Wireless Headphones',
    price: 999.99,
    image: 'https://source.unsplash.com/featured/?headphones',
    description: 'High-quality wireless headphones with noise cancellation.',
    rating: 4.5
  },
  {
    id: 2,
    name: 'Smart Watch',
    price: 1499.99,
    image: 'https://source.unsplash.com/featured/?smartwatch',
    description: 'Track your fitness and notifications on the go.',
    rating: 4.8
  },
  {
    id: 3,
    name: 'Bluetooth Speaker',
    price: 599.99,
    image: 'https://source.unsplash.com/featured/?speaker',
    description: 'Portable speaker with deep bass and long battery life.',
    rating: 4.2
  },
];

const Home = () => {
  return (
    <>
      <Header />
      {/* Hero Section */}
      <Box sx={theme => ({
        width: '100%',
        py: 10,
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.primary.contrastText,
        textAlign: 'center',
      })}>
        <Typography variant="h2" fontWeight={700} gutterBottom>
          Welcome to Buy Nest
        </Typography>
        <Typography variant="h6" sx={{ mb: 4 }}>
          Discover amazing products at unbeatable prices. Shop with confidence and enjoy fast, reliable delivery.
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
          <Button variant="contained" color="secondary" size="large">Shop Now</Button>
          <Button variant="outlined" color="inherit" size="large">Learn More</Button>
        </Box>
      </Box>

      {/* Shop by Category */}
      <Container sx={{ py: 6 }}>
        <Typography variant="h4" align="center" fontWeight={700} gutterBottom>
          Shop by Category
        </Typography>
        <Grid container spacing={4} justifyContent="center">
          {categories.map((cat) => (
            <Grid item key={cat.name} xs={12} sm={6} md={3}>
              <Card sx={{ p: 2, textAlign: 'center', boxShadow: 3 }}>
                <Typography variant="h2" component="div" sx={{ mb: 1 }}>
                  {cat.icon}
                </Typography>
                <Typography variant="h6" fontWeight={600}>{cat.name}</Typography>
                <Typography variant="body2" color="text.secondary">{cat.count} products</Typography>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Featured Products */}
      <Container sx={{ py: 6 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" fontWeight={700}>Featured Products</Typography>
          <Button variant="text" color="primary" href="/products">Browse More Products</Button>
        </Box>
        <Grid container spacing={4}>
          {products.map((product) => (
            <Grid item key={product.id} xs={12} sm={6} md={4}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', boxShadow: 3 }}>
                <CardMedia
                  component="img"
                  sx={{ height: 180, objectFit: 'cover' }}
                  image={product.image}
                  alt={product.name}
                />
                <CardContent>
                  <Typography gutterBottom variant="h6" component="h2">
                    {product.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {product.description}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                    <Typography variant="subtitle1" color="primary" sx={{ fontWeight: 700 }}>
                      ${product.price}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ ml: 2 }}>
                      ★ {product.rating}
                    </Typography>
                  </Box>
                </CardContent>
                <CardActions>
                  <Button size="small" variant="contained" color="primary" fullWidth>
                    View Details
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
      <Footer />
    </>
  );
};

export default Home;