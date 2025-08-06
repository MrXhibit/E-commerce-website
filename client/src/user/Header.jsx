import React from 'react';
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

const Header = () => {
  return (
    <AppBar position="static" color="primary" enableColorOnDark elevation={0}>
      <Toolbar sx={{ justifyContent: 'space-between', flexWrap: 'wrap' }}>
        {/* Logo/Site Name */}
        <Typography variant="h5" component="div" sx={{ fontWeight: 700, flex: { xs: 1, md: 'none' } }}>
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
            <Button key={link.label} color="inherit" href={link.href} sx={{ fontWeight: 500 }}>
              {link.label}
            </Button>
          ))}
        </Box>
        {/* Icons */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, ml: 2 }}>
          <IconButton color="inherit" href="/wishlist">
            <FavoriteBorderIcon />
          </IconButton>
          <IconButton color="inherit" href="/cart">
            <ShoppingCartIcon />
          </IconButton>
          <IconButton color="inherit" href="/profile">
            <AccountCircleIcon />
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;