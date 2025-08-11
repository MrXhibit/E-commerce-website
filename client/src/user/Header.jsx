import React, { useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import InputBase from '@mui/material/InputBase';
import SearchIcon from '@mui/icons-material/Search';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { alpha, styled } from '@mui/material/styles';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Container, Grid, Card, Chip, Collapse } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';


const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(1),
    width: '400px',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  width: '100%',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
  },
}));

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'Products', href: '/products' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
];

// Categories data
const categories = [
  // Electronics & Technology
  { name: 'Computers', image: 'https://images.unsplash.com/photo-1547082299-de196ea013d6?w=100&h=100&fit=crop', highlight: true, category: 'electronics' },
  { name: 'Laptops', image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=100&h=100&fit=crop', category: 'electronics' },
  { name: 'Smartphones', image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=100&h=100&fit=crop', category: 'electronics' },
  { name: 'Headphones', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100&h=100&fit=crop', category: 'electronics' },
  { name: 'Gaming', image: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=100&h=100&fit=crop', category: 'electronics' },
  { name: 'Cameras', image: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=100&h=100&fit=crop', category: 'electronics' },
  { name: 'TV & Audio', image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=100&h=100&fit=crop', category: 'electronics' },
  { name: 'Smart Home', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=100&h=100&fit=crop', category: 'electronics' },
  
  // Home & Garden
  { name: 'Furniture', image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=100&h=100&fit=crop', category: 'home' },
  { name: 'Home Decor', image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=100&h=100&fit=crop', category: 'home' },
  { name: 'Kitchen', image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=100&h=100&fit=crop', category: 'home' },
  { name: 'Bedding', image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=100&h=100&fit=crop', category: 'home' },
  { name: 'Garden', image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=100&h=100&fit=crop', category: 'home' },
  { name: 'Tools', image: 'https://images.unsplash.com/photo-1572981779307-38b8cabb2407?w=100&h=100&fit=crop', category: 'home' },
  
  // Fashion & Beauty
  { name: 'Clothing', image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=100&h=100&fit=crop', category: 'fashion' },
  { name: 'Shoes', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=100&h=100&fit=crop', category: 'fashion' },
  { name: 'Jewelry', image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=100&h=100&fit=crop', category: 'fashion' },
  { name: 'Watches', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100&h=100&fit=crop', category: 'fashion' },
  { name: 'Beauty', image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=100&h=100&fit=crop', category: 'fashion' },
  { name: 'Bags', image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=100&h=100&fit=crop', category: 'fashion' },
  
  // Sports & Outdoors
  { name: 'Sports', image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=100&h=100&fit=crop', category: 'sports' },
  { name: 'Fitness', image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=100&h=100&fit=crop', category: 'sports' },
  { name: 'Outdoor', image: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=100&h=100&fit=crop', category: 'sports' },
  { name: 'Cycling', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=100&h=100&fit=crop', category: 'sports' },
  
  // Health & Personal Care
  { name: 'Health', image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=100&h=100&fit=crop', category: 'health' },
  { name: 'Personal Care', image: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=100&h=100&fit=crop', category: 'health' },
  { name: 'Vitamins', image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=100&h=100&fit=crop', category: 'health' },
  
  // Books & Media
  { name: 'Books', image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=100&h=100&fit=crop', category: 'media' },
  { name: 'Music', image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=100&h=100&fit=crop', category: 'media' },
  { name: 'Movies', image: 'https://images.unsplash.com/photo-1489599904472-af35ff2c7c3f?w=100&h=100&fit=crop', category: 'media' },
  
  // Automotive & Industrial
  { name: 'Automotive', image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=100&h=100&fit=crop', category: 'automotive' },
  { name: 'Industrial', image: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=100&h=100&fit=crop', category: 'automotive' },
  
  // Baby & Kids
  { name: 'Baby', image: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=100&h=100&fit=crop', category: 'kids' },
  { name: 'Toys', image: 'https://images.unsplash.com/photo-1558877385-1c2d7b8e8b8b?w=100&h=100&fit=crop', category: 'kids' },
  { name: 'Kids Fashion', image: 'https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?w=100&h=100&fit=crop', category: 'kids' },
  
  // Pet Supplies
  { name: 'Pet Supplies', image: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=100&h=100&fit=crop', category: 'pets' },
  
  // Office & School
  { name: 'Office', image: 'https://images.unsplash.com/photo-1497032628192-86f99bcd76bc?w=100&h=100&fit=crop', category: 'office' },
  { name: 'Stationery', image: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=100&h=100&fit=crop', category: 'office' },
];



const Header = () => {
  const { user, isAuthenticated, logout, cart, wishlist } = useAuth();
  const navigate = useNavigate();
  const [showCategories, setShowCategories] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleCategoryClick = (categoryName) => {
    // Navigate to products page with category filter
    navigate(`/products?category=${encodeURIComponent(categoryName)}`);
    setShowCategories(false);
  };

  return (
    <Box>
      <AppBar position="static" color="primary" enableColorOnDark elevation={0}>
        {/* Main Header */}
        <Toolbar sx={{ justifyContent: 'space-between', flexWrap: 'wrap' }}>
          {/* Logo/Site Name */}
          <Typography variant="h5" component={Link} to="/" sx={{ fontWeight: 700, flex: { xs: 1, md: 'none' }, color: 'inherit', textDecoration: 'none' }}>
            Buy Nest
          </Typography>
          
          {/* Centered Search Bar */}
          <Box sx={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
            <Search>
              <SearchIconWrapper>
                <SearchIcon />
              </SearchIconWrapper>
              <StyledInputBase placeholder="Search products..." inputProps={{ 'aria-label': 'search' }} />
            </Search>
          </Box>
          
          {/* Navigation Links */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 2, ml: 2 }}>
            {navLinks.map((link) => (
              <Button key={link.label} color="inherit" component={Link} to={link.href} sx={{ fontWeight: 500 }}>
                {link.label}
              </Button>
            ))}
          </Box>
          
          {/* Icons */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, ml: 2 }}>
            <IconButton color="inherit" component={Link} to="/wishlist" sx={{ position: 'relative' }}>
              <FavoriteBorderIcon />
              {wishlist.itemCount > 0 && (
                <Box
                  sx={{
                    position: 'absolute',
                    top: -5,
                    right: -5,
                    backgroundColor: 'error.main',
                    color: 'white',
                    borderRadius: '50%',
                    width: 20,
                    height: 20,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.75rem',
                    fontWeight: 'bold',
                  }}
                >
                  {wishlist.itemCount}
                </Box>
              )}
            </IconButton>
            <IconButton color="inherit" component={Link} to="/cart" sx={{ position: 'relative' }}>
              <ShoppingCartIcon />
              {cart.itemCount > 0 && (
                <Box
                  sx={{
                    position: 'absolute',
                    top: -5,
                    right: -5,
                    backgroundColor: 'error.main',
                    color: 'white',
                    borderRadius: '50%',
                    width: 20,
                    height: 20,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.75rem',
                    fontWeight: 'bold',
                  }}
                >
                  {cart.itemCount}
                </Box>
              )}
            </IconButton>
            {isAuthenticated ? (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="body2" sx={{ color: 'inherit' }}>
                  Hi, {user?.userName || 'User'}
                </Typography>
                <IconButton color="inherit" component={Link} to="/profile">
                  <AccountCircleIcon />
                </IconButton>
                <Button color="inherit" onClick={handleLogout} sx={{ fontWeight: 500 }}>
                  Logout
                </Button>
              </Box>
            ) : (
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button color="inherit" component={Link} to="/login" sx={{ fontWeight: 500 }}>
                  Login
                </Button>
                <Button color="inherit" component={Link} to="/signup" sx={{ fontWeight: 500 }}>
                  Signup
                </Button>
              </Box>
            )}
          </Box>
        </Toolbar>

        {/* Categories Bar - Integrated into Header */}
        <Box sx={{ backgroundColor: 'primary.dark', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          <Container maxWidth="xl">
            <Box sx={{ display: 'flex', alignItems: 'center', py: 1 }}>
              {/* Categories Toggle Button */}
              <Button
                color="inherit"
                onClick={() => setShowCategories(!showCategories)}
                startIcon={showCategories ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                sx={{ mr: 2, fontWeight: 500 }}
              >
                All Categories
              </Button>
              
              {/* Quick Category Links */}
              <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 1, overflow: 'hidden' }}>
                {categories.slice(0, 8).map((category) => (
                  <Chip
                    key={category.name}
                    label={category.name}
                    onClick={() => handleCategoryClick(category.name)}
                    sx={{
                      backgroundColor: 'rgba(255,255,255,0.1)',
                      color: 'white',
                      '&:hover': { backgroundColor: 'rgba(255,255,255,0.2)' },
                      cursor: 'pointer'
                    }}
                    size="small"
                  />
                ))}
              </Box>
            </Box>
          </Container>
        </Box>
      </AppBar>

      {/* Categories Dropdown */}
      <Collapse in={showCategories}>
        <Box sx={{ backgroundColor: 'white', boxShadow: 2, borderBottom: '1px solid #e0e0e0' }}>
          <Container maxWidth="xl" sx={{ py: 3 }}>
            <Typography variant="h6" fontWeight={600} sx={{ mb: 2, color: 'primary.main' }}>
              Shop by Category
            </Typography>
            <Grid container spacing={{ xs: 2, sm: 3 }} justifyContent="flex-start">
              {categories.map((category) => (
                <Grid item xs={4} sm={3} md={2} lg={1.5} xl={1.33} key={category.name}>
                  <Card 
                    onClick={() => handleCategoryClick(category.name)}
                    sx={{ 
                      cursor: 'pointer', 
                      transition: 'all 0.3s ease',
                      '&:hover': { 
                        transform: 'translateY(-2px)', 
                        boxShadow: 3 
                      },
                      textAlign: 'center',
                      p: { xs: 1, sm: 1.5 },
                      height: '100%',
                      minHeight: { xs: 80, sm: 100 }
                    }}
                  >
                    <Box
                      sx={{
                        width: { xs: 40, sm: 50 },
                        height: { xs: 40, sm: 50 },
                        borderRadius: '50%',
                        backgroundColor: 'primary.main',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 8px',
                        backgroundImage: `url(${category.image})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center'
                      }}
                    />
                    <Typography variant="caption" fontWeight={600} sx={{ fontSize: { xs: '0.65rem', sm: '0.75rem' } }}>
                      {category.name}
                    </Typography>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Container>
        </Box>
      </Collapse>
    </Box>
  );
};

export default Header;