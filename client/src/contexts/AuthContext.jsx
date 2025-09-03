import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import apiService from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState({ items: [], totalAmount: 0, itemCount: 0 });
  const [wishlist, setWishlist] = useState({ items: [], itemCount: 0 });
  const [isInitializing, setIsInitializing] = useState(true);

  // Initialize auth state on app load
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Only try to refresh token if we have a stored refresh token
        const storedRefreshToken = localStorage.getItem('refreshToken');
        if (storedRefreshToken) {
          const response = await apiService.refreshToken();
          if (response.success && response.data?.user) {
            setUser(response.data.user);
            // Load cart and wishlist data
            await loadCart();
            await loadWishlist();
          } else {
            // Clear invalid tokens
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('user');
          }
        }
      } catch (error) {
        console.log('User not authenticated or token refresh failed:', error.message);
        // Clear any stored tokens on error
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
      } finally {
        setLoading(false);
        setIsInitializing(false);
      }
    };

    initializeAuth();
  }, []);

  const loadCart = async () => {
    try {
      const response = await apiService.getCart();
      if (response.success) {
        setCart(response.data);
      }
    } catch (error) {
      console.error('Failed to load cart:', error);
    }
  };

  const loadWishlist = async () => {
    try {
      const response = await apiService.getWishlist();
      if (response.success) {
        setWishlist(response.data);
      }
    } catch (error) {
      console.error('Failed to load wishlist:', error);
    }
  };

  const login = async (credentials) => {
    try {
      const response = await apiService.login(credentials);
      if (response.success) {
        const { user: userData, accessToken, refreshToken } = response.data;
        
        // Store tokens securely
        if (accessToken) localStorage.setItem('accessToken', accessToken);
        if (refreshToken) localStorage.setItem('refreshToken', refreshToken);
        if (userData) localStorage.setItem('user', JSON.stringify(userData));
        
        setUser(userData);
        await loadCart();
        await loadWishlist();
        return { success: true };
      }
      return { success: false, message: response.message };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  const register = async (userData) => {
    try {
      const response = await apiService.register(userData);
      if (response.success) {
        const { user: newUser, accessToken, refreshToken } = response.data;
        
        // Store tokens securely
        if (accessToken) localStorage.setItem('accessToken', accessToken);
        if (refreshToken) localStorage.setItem('refreshToken', refreshToken);
        if (newUser) localStorage.setItem('user', JSON.stringify(newUser));
        
        setUser(newUser);
        await loadCart();
        await loadWishlist();
        return { success: true };
      }
      return { success: false, message: response.message };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  const logout = useCallback(async () => {
    try {
      await apiService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear all stored data
      setUser(null);
      setCart({ items: [], totalAmount: 0, itemCount: 0 });
      setWishlist({ items: [], itemCount: 0 });
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
    }
  }, []);

  // Cart operations
  const addToCart = async (productId, quantity = 1) => {
    try {
      const response = await apiService.addToCart(productId, quantity);
      if (response.success) {
        setCart(response.data);
        return { success: true };
      }
      return { success: false, message: response.message };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  const updateCartItem = async (productId, quantity) => {
    try {
      const response = await apiService.updateCartItem(productId, quantity);
      if (response.success) {
        setCart(response.data);
        return { success: true };
      }
      return { success: false, message: response.message };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  const removeFromCart = async (productId) => {
    try {
      const response = await apiService.removeFromCart(productId);
      if (response.success) {
        setCart(response.data);
        return { success: true };
      }
      return { success: false, message: response.message };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  const clearCart = async () => {
    try {
      const response = await apiService.clearCart();
      if (response.success) {
        setCart(response.data);
        return { success: true };
      }
      return { success: false, message: response.message };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  // Wishlist operations
  const addToWishlist = async (productId) => {
    try {
      const response = await apiService.addToWishlist(productId);
      if (response.success) {
        setWishlist(response.data);
        return { success: true };
      }
      return { success: false, message: response.message };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  const removeFromWishlist = async (productId) => {
    try {
      const response = await apiService.removeFromWishlist(productId);
      if (response.success) {
        setWishlist(response.data);
        return { success: true };
      }
      return { success: false, message: response.message };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  const clearWishlist = async () => {
    try {
      const response = await apiService.clearWishlist();
      if (response.success) {
        setWishlist(response.data);
        return { success: true };
      }
      return { success: false, message: response.message };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  const value = {
    user,
    loading,
    cart,
    wishlist,
    login,
    register,
    logout,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    addToWishlist,
    removeFromWishlist,
    clearWishlist,
    isAuthenticated: !!user,
    isInitializing,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
