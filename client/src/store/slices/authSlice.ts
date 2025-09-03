import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import apiService from '../../services/api';
import { clearCart } from './cartSlice';
import { clearWishlist } from './wishlistSlice';

// Types
export interface User {
  _id: string;
  userName: string;
  email: string;
  role: 'user' | 'admin';
  profilePicture?: string;
  isEmailVerified: boolean;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  conformPassword: string;
}

// Async thunks for API calls
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (credentials: LoginCredentials, { rejectWithValue }) => {
    try {
      console.log('Auth Slice - Logging in user with credentials:', credentials);
      const response = await apiService.login(credentials);
      console.log('Auth Slice - Login response:', response);
      
      if (response.success) {
        // Store user data in localStorage since tokens are in cookies
        localStorage.setItem('user', JSON.stringify(response.data.user));
        return response.data;
      }
      console.error('Auth Slice - Login failed:', response.message);
      return rejectWithValue(response.message || 'Login failed');
    } catch (error: any) {
      console.error('Auth Slice - Login error:', error);
      return rejectWithValue(error.message || 'Login failed');
    }
  }
);

export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (userData: RegisterData, { rejectWithValue }) => {
    try {
      console.log('Auth Slice - Registering user with data:', userData);
      const response = await apiService.register(userData);
      console.log('Auth Slice - Register response:', response);
      
      if (response.success) {
        // Store user data in localStorage since tokens are in cookies
        localStorage.setItem('user', JSON.stringify(response.data.user));
        return response.data;
      }
      console.error('Auth Slice - Registration failed:', response.message);
      return rejectWithValue(response.message || 'Registration failed');
    } catch (error: any) {
      console.error('Auth Slice - Registration error:', error);
      return rejectWithValue(error.message || 'Registration failed');
    }
  }
);

export const logoutUser = createAsyncThunk(
  'auth/logoutUser',
  async (_, { dispatch }) => {
    await apiService.logout();
    dispatch(clearCart());
    dispatch(clearWishlist());
    return null;
  }
);

export const checkAuthStatus = createAsyncThunk(
  'auth/checkAuthStatus',
  async (_, { rejectWithValue }) => {
    try {
      const currentUser = apiService.getCurrentUser();
      if (currentUser && apiService.isAuthenticated()) {
        return { user: currentUser };
      }
      return rejectWithValue('Not authenticated');
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login cases
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.isAuthenticated = false;
      })
      // Register cases
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.isAuthenticated = false;
      })
      // Logout cases
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.error = null;
      })
      // Check auth status cases
      .addCase(checkAuthStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(checkAuthStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(checkAuthStatus.rejected, (state) => {
        state.loading = false;
        state.user = null;
        state.isAuthenticated = false;
      });
  },
});

export const { clearError, setLoading } = authSlice.actions;
export default authSlice.reducer;
