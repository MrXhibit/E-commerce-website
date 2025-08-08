import React from 'react';
import './User.css';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { theme } from './theme';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from '../contexts/AuthContext';
import Home from './Home';
import Contact from './Contact';
import About from './About';
import Login from './Login';
import Signup from './Signup';
import ProductPage from './ProductPage';
import CartPage from './CartPage';
import WishlistPage from './WishlistPage';
import ProfilePage from './ProfilePage';

function UserApp() {
  return (
    <AuthProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className='user-app'>
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/contact' element={<Contact />} />
            <Route path='/about' element={<About />} />
            <Route path='/login' element={<Login />} />
            <Route path='/signup' element={<Signup />} />
            <Route path='/products' element={<ProductPage />} />
            <Route path='/products/:id' element={<ProductPage />} /> {/* For product details */}
            <Route path='/product/:id' element={<ProductPage />} /> {/* For individual product details */}
            <Route path='/cart' element={<CartPage />} />
            <Route path='/wishlist' element={<WishlistPage />} />
            <Route path='/profile' element={<ProfilePage />} />
          </Routes>
        </div>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default UserApp;
