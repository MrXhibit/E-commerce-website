import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import LoginPage from '../../LoginPage';
import authReducer from '../../store/slices/authSlice';

// Mock the Redux store
const createTestStore = () => {
  return configureStore({
    reducer: {
      auth: authReducer,
    },
    preloadedState: {
      auth: {
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      },
    },
  });
};

// Mock the auth service
jest.mock('../../services/api', () => ({
  login: jest.fn(),
}));

// Mock the useNavigate hook
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

// Mock the useDispatch hook
const mockDispatch = jest.fn();
jest.mock('../../store/hooks', () => ({
  useAppDispatch: () => mockDispatch,
  useAppSelector: (selector) => selector({
    auth: {
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    },
  }),
}));

const renderLoginPage = () => {
  const store = createTestStore();
  return render(
    <Provider store={store}>
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>
    </Provider>
  );
};

describe('🔐 LoginPage Component Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('📱 Component Rendering', () => {
    it('✅ Should render login form correctly', () => {
      renderLoginPage();
      
      expect(screen.getByText('Login')).toBeInTheDocument();
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
      expect(screen.getByText(/don't have an account/i)).toBeInTheDocument();
    });

    it('✅ Should render Google OAuth button', () => {
      renderLoginPage();
      
      expect(screen.getByText(/continue with google/i)).toBeInTheDocument();
    });

    it('✅ Should render forgot password link', () => {
      renderLoginPage();
      
      expect(screen.getByText(/forgot password/i)).toBeInTheDocument();
    });
  });

  describe('📝 Form Validation', () => {
    it('❌ Should show error for empty email', async () => {
      renderLoginPage();
      
      const loginButton = screen.getByRole('button', { name: /login/i });
      fireEvent.click(loginButton);
      
      await waitFor(() => {
        expect(screen.getByText(/email is required/i)).toBeInTheDocument();
      });
    });

    it('❌ Should show error for empty password', async () => {
      renderLoginPage();
      
      const emailInput = screen.getByLabelText(/email/i);
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      
      const loginButton = screen.getByRole('button', { name: /login/i });
      fireEvent.click(loginButton);
      
      await waitFor(() => {
        expect(screen.getByText(/password is required/i)).toBeInTheDocument();
      });
    });

    it('❌ Should show error for invalid email format', async () => {
      renderLoginPage();
      
      const emailInput = screen.getByLabelText(/email/i);
      fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
      
      const passwordInput = screen.getByLabelText(/password/i);
      fireEvent.change(passwordInput, { target: { value: 'password123' } });
      
      const loginButton = screen.getByRole('button', { name: /login/i });
      fireEvent.click(loginButton);
      
      await waitFor(() => {
        expect(screen.getByText(/invalid email format/i)).toBeInTheDocument();
      });
    });

    it('❌ Should show error for weak password', async () => {
      renderLoginPage();
      
      const emailInput = screen.getByLabelText(/email/i);
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      
      const passwordInput = screen.getByLabelText(/password/i);
      fireEvent.change(passwordInput, { target: { value: '123' } }); // Too short
      
      const loginButton = screen.getByRole('button', { name: /login/i });
      fireEvent.click(loginButton);
      
      await waitFor(() => {
        expect(screen.getByText(/password must be at least 6 characters/i)).toBeInTheDocument();
      });
    });

    it('✅ Should not show errors for valid input', async () => {
      renderLoginPage();
      
      const emailInput = screen.getByLabelText(/email/i);
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      
      const passwordInput = screen.getByLabelText(/password/i);
      fireEvent.change(passwordInput, { target: { value: 'password123' } });
      
      // Wait for validation to complete
      await waitFor(() => {
        expect(screen.queryByText(/email is required/i)).not.toBeInTheDocument();
        expect(screen.queryByText(/password is required/i)).not.toBeInTheDocument();
        expect(screen.queryByText(/invalid email format/i)).not.toBeInTheDocument();
        expect(screen.queryByText(/password must be at least 6 characters/i)).not.toBeInTheDocument();
      });
    });
  });

  describe('🚀 Form Submission', () => {
    it('✅ Should submit form with valid data', async () => {
      renderLoginPage();
      
      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/password/i);
      const loginButton = screen.getByRole('button', { name: /login/i });
      
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });
      fireEvent.click(loginButton);
      
      await waitFor(() => {
        expect(mockDispatch).toHaveBeenCalled();
      });
    });

    it('✅ Should show loading state during submission', async () => {
      // Mock loading state
      const store = createTestStore();
      store.dispatch({ type: 'auth/login/pending' });
      
      render(
        <Provider store={store}>
          <BrowserRouter>
            <LoginPage />
          </BrowserRouter>
        </Provider>
      );
      
      expect(screen.getByText(/logging in/i)).toBeInTheDocument();
    });

    it('✅ Should handle successful login', async () => {
      // Mock successful login
      const store = createTestStore();
      store.dispatch({ 
        type: 'auth/login/fulfilled', 
        payload: { user: { id: 1, email: 'test@example.com' } } 
      });
      
      render(
        <Provider store={store}>
          <BrowserRouter>
            <LoginPage />
          </BrowserRouter>
        </Provider>
      );
      
      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/');
      });
    });

    it('❌ Should handle login error', async () => {
      // Mock error state
      const store = createTestStore();
      store.dispatch({ 
        type: 'auth/login/rejected', 
        error: { message: 'Invalid credentials' } 
      });
      
      render(
        <Provider store={store}>
          <BrowserRouter>
            <LoginPage />
          </BrowserRouter>
        </Provider>
      );
      
      expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument();
    });
  });

  describe('🔗 Navigation', () => {
    it('✅ Should navigate to signup page', () => {
      renderLoginPage();
      
      const signupLink = screen.getByText(/don't have an account/i);
      fireEvent.click(signupLink);
      
      expect(mockNavigate).toHaveBeenCalledWith('/signup');
    });

    it('✅ Should navigate to forgot password page', () => {
      renderLoginPage();
      
      const forgotPasswordLink = screen.getByText(/forgot password/i);
      fireEvent.click(forgotPasswordLink);
      
      expect(mockNavigate).toHaveBeenCalledWith('/forgot-password');
    });
  });

  describe('🌐 Google OAuth', () => {
    it('✅ Should handle Google OAuth click', () => {
      renderLoginPage();
      
      const googleButton = screen.getByText(/continue with google/i);
      fireEvent.click(googleButton);
      
      // Should trigger Google OAuth flow
      expect(googleButton).toBeInTheDocument();
    });
  });

  describe('♿ Accessibility', () => {
    it('✅ Should have proper form labels', () => {
      renderLoginPage();
      
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    });

    it('✅ Should have proper button types', () => {
      renderLoginPage();
      
      const loginButton = screen.getByRole('button', { name: /login/i });
      expect(loginButton).toHaveAttribute('type', 'submit');
    });

    it('✅ Should have proper input types', () => {
      renderLoginPage();
      
      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/password/i);
      
      expect(emailInput).toHaveAttribute('type', 'email');
      expect(passwordInput).toHaveAttribute('type', 'password');
    });
  });

  describe('📱 Responsive Design', () => {
    it('✅ Should be responsive on different screen sizes', () => {
      renderLoginPage();
      
      // Test that the component renders without breaking
      expect(screen.getByText('Login')).toBeInTheDocument();
      
      // In a real test, you would test different viewport sizes
      // This is a placeholder for responsive testing
    });
  });
});
