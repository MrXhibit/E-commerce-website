import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Container, 
  Paper, 
  Typography, 
  TextField, 
  Button, 
  Link as MuiLink,
  Alert, 
  CircularProgress,
  Divider,
  FormControlLabel,
  Checkbox,
  Avatar,
  Chip,
  Grid

} from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';
import AppleIcon from '@mui/icons-material/Apple';
import PersonAddOutlinedIcon from '@mui/icons-material/PersonAddOutlined';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { registerUser, clearError } from '../store/slices/authSlice';
import Header from './Header';
import Footer from './Footer';

const SignupPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: ''
  });
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loading, error, isAuthenticated } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    // Clear any previous errors when component mounts
    dispatch(clearError());
  }, [dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });

    // Clear password error when user types
    if (name === 'confirmPassword' || name === 'password') {
      setPasswordError('');
    }
  };

  const validateForm = () => {
    if (formData.password !== formData.confirmPassword) {
      setPasswordError('Passwords do not match');
      return false;
    }
    if (formData.password.length < 6) {
      setPasswordError('Password must be at least 6 characters long');
      return false;
    }
    if (!agreedToTerms) {
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    dispatch(clearError());
    
    // Send the data that backend expects
    const registrationData = {
      email: formData.email,
      password: formData.password,
      conformPassword: formData.confirmPassword
    };
    
    const result = await dispatch(registerUser(registrationData));
    if (result.type === 'auth/registerUser/fulfilled') {
      navigate('/');
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <Header />
      
      {/* Main Content - Enhanced Design */}
      <Box 
        component="main" 
        sx={{ 
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#fafbfc',
          py: 4,
          px: 2
        }}
      >
        <Container maxWidth="md">
          <Paper 
            elevation={24} 
            sx={{ 
              borderRadius: 4,
              overflow: 'hidden',
              display: 'flex',
              minHeight: 700,
              background: '#f8f9fa',
              boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
            }}
          >
            {/* Left Side - Visual Content */}
            <Box 
              sx={{ 
                flex: 1,
                background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
                display: { xs: 'none', md: 'flex' },
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                p: 6,
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              {/* Decorative Elements */}
              <Box
                sx={{
                  position: 'absolute',
                  top: -50,
                  right: -50,
                  width: 200,
                  height: 200,
                  borderRadius: '50%',
                  background: 'rgba(255,255,255,0.1)',
                  zIndex: 1
                }}
              />
              <Box
                sx={{
                  position: 'absolute',
                  bottom: -30,
                  left: -30,
                  width: 150,
                  height: 150,
                  borderRadius: '50%',
                  background: 'rgba(255,255,255,0.08)',
                  zIndex: 1
                }}
              />
              
              {/* Content */}
              <Box sx={{ textAlign: 'center', zIndex: 2, position: 'relative' }}>
                <Avatar
                  sx={{
                    width: 80,
                    height: 80,
                    bgcolor: 'primary.main',
                    mb: 3,
                    mx: 'auto'
                  }}
                >
                  <PersonAddOutlinedIcon sx={{ fontSize: 40, color: 'white' }} />
                </Avatar>
                
                <Typography 
                  variant="h3" 
                  component="h1" 
                  sx={{ 
                    mb: 2, 
                    fontWeight: 700,
                    color: 'primary.main',
                    textShadow: 'none'
                  }}
                >
                  Join Buy Nest
                </Typography>
                
                <Typography 
                  variant="h6" 
                  sx={{ 
                    mb: 4, 
                    color: 'text.secondary',
                    fontWeight: 400,
                    lineHeight: 1.6
                  }}
                >
                  Create your account and discover amazing products with exclusive deals and fast delivery
                </Typography>

                {/* Feature Chips */}
                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
                  <Chip 
                    label="Exclusive Deals" 
                    sx={{ 
                      bgcolor: 'primary.main', 
                      color: 'white',
                      border: 'none'
                    }} 
                  />
                  <Chip 
                    label="Fast Delivery" 
                    sx={{ 
                      bgcolor: 'primary.main', 
                      color: 'white',
                      border: 'none'
                    }} 
                  />
                  <Chip 
                    label="Premium Support" 
                    sx={{ 
                      bgcolor: 'primary.main', 
                      color: 'white',
                      border: 'none'
                    }} 
                  />
                </Box>
              </Box>
            </Box>

            {/* Right Side - Signup Form */}
            <Box 
              sx={{ 
                flex: 1, 
                p: { xs: 4, md: 6 },
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                background: 'white'
              }}
            >
              {/* Form Header */}
              <Box sx={{ textAlign: 'center', mb: 4 }}>
                <Typography 
                  variant="h4" 
                  component="h2" 
                  sx={{ 
                    mb: 1, 
                    fontWeight: 700,
                    color: 'primary.main'
                  }}
                >
                  Create Account
                </Typography>
                
                <Typography 
                  variant="body1" 
                  sx={{ 
                    color: 'text.secondary',
                    fontSize: '1.1rem'
                  }}
                >
                  Join us and start your shopping journey today
                </Typography>
              </Box>
              
              {/* Error Alert */}
              {error && (
                <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
                  {error}
                </Alert>
              )}

              {/* Signup Form */}
              <Box component="form" onSubmit={handleSubmit} sx={{ mb: 4 }}>
                <TextField
                  label="Full Name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  required
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'primary.main',
                      }
                    }
                  }}
                />
                
                <TextField
                  label="Email Address"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  required
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'primary.main',
                      }
                    }
                  }}
                />
                
                <TextField
                  label="Password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  required
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'primary.main',
                      }
                    }
                  }}
                />
                
                <TextField
                  label="Confirm Password"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  required
                  error={!!passwordError}
                  helperText={passwordError}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'primary.main',
                      }
                    }
                  }}
                />

                {/* Terms and Conditions */}
                <FormControlLabel
                  control={
                    <Checkbox 
                      checked={agreedToTerms}
                      onChange={(e) => setAgreedToTerms(e.target.checked)}
                      sx={{ color: 'primary.main' }} 
                    />
                  }
                  label={
                    <Typography variant="body2" color="text.secondary">
                      I agree to the{' '}
                      <MuiLink 
                        href="#" 
                        sx={{ 
                          color: 'primary.main',
                          textDecoration: 'none',
                          fontWeight: 600,
                          '&:hover': {
                            textDecoration: 'underline'
                          }
                        }}
                      >
                        Terms & Conditions
                      </MuiLink>
                    </Typography>
                  }
                  sx={{ mt: 2, mb: 3, justifyContent: 'flex-start' }}
                />

                {/* Sign Up Button */}
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  fullWidth
                  disabled={loading || !agreedToTerms}
                  sx={{
                    py: 1.8,
                    borderRadius: 2,
                    textTransform: 'none',
                    fontSize: '1.1rem',
                    fontWeight: 600,
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                    background: 'linear-gradient(45deg, #dc3545 0%, #c82333 100%)',
                    '&:hover': {
                      boxShadow: '0 6px 20px rgba(0,0,0,0.25)',
                      transform: 'translateY(-1px)',
                      transition: 'all 0.2s ease-in-out'
                    }
                  }}
                >
                  {loading ? <CircularProgress size={24} color="inherit" /> : 'Create Account'}
                </Button>
              </Box>

              {/* Divider */}
              <Divider sx={{ my: 4 }}>
                <Typography variant="body2" color="text.secondary" sx={{ px: 2 }}>
                  or continue with
                </Typography>
              </Divider>

              {/* Social Signup Buttons */}
              <Grid spacing={2} sx={{ mb: 4 }}>
                <Grid xs={6}>
                  <Button
                    variant="outlined"
                    fullWidth
                    startIcon={<GoogleIcon />}
                    sx={{
                      py: 1.5,
                      borderRadius: 2,
                      textTransform: 'none',
                      borderColor: '#db4437',
                      color: '#db4437',
                      fontWeight: 600,
                      '&:hover': {
                        borderColor: '#c23321',
                        backgroundColor: 'rgba(219, 68, 55, 0.04)',
                        transform: 'translateY(-1px)',
                        transition: 'all 0.2s ease-in-out'
                      }
                    }}
                    onClick={() => {
                      window.location.href = '/api/v1/auth/google';
                    }}
                  >
                    Google
                  </Button>
                </Grid>
                <Grid xs={6}>
                  <Button
                    variant="outlined"
                    fullWidth
                    startIcon={<AppleIcon />}
                    sx={{
                      py: 1.5,
                      borderRadius: 2,
                      textTransform: 'none',
                      borderColor: '#000',
                      color: '#000',
                      fontWeight: 600,
                      '&:hover': {
                        borderColor: '#333',
                        backgroundColor: 'rgba(0, 0, 0, 0.04)',
                        transform: 'translateY(-1px)',
                        transition: 'all 0.2s ease-in-out'
                      }
                    }}
                  >
                    Apple
                  </Button>
                </Grid>
              </Grid>

              {/* Login Link */}
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="body1" color="text.secondary">
                  Already have an account?{' '}
                  <MuiLink
                    component={Link}
                    to="/login"
                    sx={{
                      color: 'primary.main',
                      textDecoration: 'none',
                      fontWeight: 700,
                      fontSize: '1rem',
                      '&:hover': {
                        textDecoration: 'underline'
                      }
                    }}
                  >
                    Sign In
                  </MuiLink>
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Container>
      </Box>

      {/* Footer */}
      <Footer />
    </Box>
  );
};

export default SignupPage;
