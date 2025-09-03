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
import { Container, Card, Chip, Collapse, Grid } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { logoutUser } from '../store/slices/authSlice';

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
  { label: 'HOME', href: '/' },
  { label: 'PRODUCTS', href: '/products' },
  { label: 'ABOUT', href: '/about' },
  { label: 'CONTACT', href: '/contact' },
];

// Extended categories data for the category bar - matching the second image
const categories = [
  { 
    name: 'Computers', 
    image: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=100&h=100&fit=crop&crop=center', 
    href: '/computers' 
  },
  { 
    name: 'Laptops', 
    image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=100&h=100&fit=crop&crop=center', 
    href: '/laptops' 
  },
  { 
    name: 'Smartphones', 
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=100&h=100&fit=crop&crop=center', 
    href: '/smartphones' 
  },
  { 
    name: 'Headphones', 
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100&h=100&fit=crop&crop=center', 
    href: '/headphones' 
  },
  { 
    name: 'Gaming', 
    image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=100&h=100&fit=crop&crop=center', 
    href: '/gaming' 
  },
  { 
    name: 'Cameras', 
    image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=100&h=100&fit=crop&crop=center', 
    href: '/cameras' 
  },
  { 
    name: 'TV & Audio', 
    image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=100&h=100&fit=crop&crop=center', 
    href: '/tv-audio' 
  },
  { 
    name: 'Smart Home', 
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=100&h=100&fit=crop&crop=center', 
    href: '/smart-home' 
  },
  { 
    name: 'Furniture', 
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=100&h=100&fit=crop&crop=center', 
    href: '/furniture' 
  },
  { 
    name: 'Home Decor', 
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=100&h=100&fit=crop&crop=center', 
    href: '/home-decor' 
  },
  { 
    name: 'Kitchen', 
    image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=100&h=100&fit=crop&crop=center', 
    href: '/kitchen' 
  },
  { 
    name: 'Bedding', 
    image: 'https://images.unsplash.com/photo-1505693314120-0d443867891c?w=100&h=100&fit=crop&crop=center', 
    href: '/bedding' 
  },
  { 
    name: 'Garden', 
    image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=100&h=100&fit=crop&crop=center', 
    href: '/garden' 
  },
  { 
    name: 'Tools', 
    image: 'https://images.unsplash.com/photo-1581147033415-58a7cdc5c4a8?w=100&h=100&fit=crop&crop=center', 
    href: '/tools' 
  },
  { 
    name: 'Clothing', 
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=100&h=100&fit=crop&crop=center', 
    href: '/clothing' 
  },
  { 
    name: 'Shoes', 
    image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=100&h=100&fit=crop&crop=center', 
    href: '/shoes' 
  },
  { 
    name: 'Jewelry', 
    image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=100&h=100&fit=crop&crop=center', 
    href: '/jewelry' 
  },
  { 
    name: 'Watches', 
    image: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=100&h=100&fit=crop&crop=center', 
    href: '/watches' 
  },
  { 
    name: 'Beauty', 
    image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=100&h=100&fit=crop&crop=center', 
    href: '/beauty' 
  },
  { 
    name: 'Bags', 
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=100&h=100&fit=crop&crop=center', 
    href: '/bags' 
  },
  { 
    name: 'Sports', 
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=100&h=100&fit=crop&crop=center', 
    href: '/sports' 
  },
  { 
    name: 'Fitness', 
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=100&h=100&fit=crop&crop=center', 
    href: '/fitness' 
  },
  { 
    name: 'Outdoor', 
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=100&h=100&fit=crop&crop=center', 
    href: '/outdoor' 
  },
  { 
    name: 'Cycling', 
    image: 'https://images.unsplash.com/photo-1544191696-102dbdaeeaa5?w=100&h=100&fit=crop&crop=center', 
    href: '/cycling' 
  },
  { 
    name: 'Health', 
    image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=100&h=100&fit=crop&crop=center', 
    href: '/health' 
  },
  { 
    name: 'Personal Care', 
    image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=100&h=100&fit=crop&crop=center', 
    href: '/personal-care' 
  },
  { 
    name: 'Vitamins', 
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=100&h=100&fit=crop&crop=center', 
    href: '/vitamins' 
  },
  { 
    name: 'Books', 
    image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=100&h=100&fit=crop&crop=center', 
    href: '/books' 
  },
  { 
    name: 'Music', 
    image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=100&h=100&fit=crop&crop=center', 
    href: '/music' 
  },
  { 
    name: 'Movies', 
    image: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=100&h=100&fit=crop&crop=center', 
    href: '/movies' 
  },
  { 
    name: 'Automotive', 
    image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=100&h=100&fit=crop&crop=center', 
    href: '/automotive' 
  },
  { 
    name: 'Industrial', 
    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=100&h=100&fit=crop&crop=center', 
    href: '/industrial' 
  },
  { 
    name: 'Baby', 
    image: 'https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?w=100&h=100&fit=crop&crop=center', 
    href: '/baby' 
  },
  { 
    name: 'Toys', 
    image: 'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=100&h=100&fit=crop&crop=center', 
    href: '/toys' 
  },
  { 
    name: 'Kids Fashion', 
    image: 'https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?w=100&h=100&fit=crop&crop=center', 
    href: '/kids-fashion' 
  },
  { 
    name: 'Pet Supplies', 
    image: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=100&h=100&fit=crop&crop=center', 
    href: '/pet-supplies' 
  },
  { 
    name: 'Office', 
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=100&h=100&fit=crop&crop=center', 
    href: '/office' 
  },
  { 
    name: 'Stationery', 
    image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=100&h=100&fit=crop&crop=center', 
    href: '/stationery' 
  }
];

const Header = () => {
  const dispatch = useAppDispatch();
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const { itemCount: cartItemCount } = useAppSelector((state) => state.cart);
  const { itemCount: wishlistItemCount } = useAppSelector((state) => state.wishlist);
  const navigate = useNavigate();
  const [showCategories, setShowCategories] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate('/');
  };

  const handleCategoryClick = (categoryName) => {
    navigate(`/products?category=${encodeURIComponent(categoryName)}`);
    setShowCategories(false);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleSearchKeyPress = (event) => {
    if (event.key === 'Enter') {
      if (searchQuery.trim()) {
        navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      }
    }
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
              <StyledInputBase 
                placeholder="Search products..." 
                inputProps={{ 'aria-label': 'search' }}
                value={searchQuery}
                onChange={handleSearchChange}
                onKeyPress={handleSearchKeyPress}
              />
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
              {wishlistItemCount > 0 && (
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
                  {wishlistItemCount}
                </Box>
              )}
            </IconButton>
            <IconButton color="inherit" component={Link} to="/cart" sx={{ position: 'relative' }}>
              <ShoppingCartIcon />
              {cartItemCount > 0 && (
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
                  {cartItemCount}
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
                  LOGIN
                </Button>
                <Button color="inherit" component={Link} to="/signup" sx={{ fontWeight: 500 }}>
                  SIGNUP
                </Button>
              </Box>
            )}
          </Box>
        </Toolbar>

        {/* Categories Bar - Horizontal scrollable list matching second image */}
        <Box sx={{ backgroundColor: 'primary.dark', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          <Container maxWidth="xl">
            <Box sx={{ display: 'flex', alignItems: 'center', py: 1.5 }}>
              {/* ALL CATEGORIES Button */}
              <Button
                color="inherit"
                onClick={() => setShowCategories(!showCategories)}
                startIcon={showCategories ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                sx={{ 
                  fontWeight: 600, 
                  fontSize: '0.9rem',
                  minWidth: 'auto',
                  px: 2
                }}
              >
                ALL CATEGORIES
              </Button>
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
            <Grid spacing={{ xs: 2, sm: 3 }} justifyContent="flex-start">
              {categories.map((category) => (
                <Grid xs={4} sm={3} md={2} lg={1.5} xl={1.33} key={category.name}>
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