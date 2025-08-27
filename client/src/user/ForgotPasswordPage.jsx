import React, { useState } from 'react';
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
  Avatar,
  Chip
} from '@mui/material';
import LockResetOutlinedIcon from '@mui/icons-material/LockResetOutlined';
import { Link } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Simulate API call - replace with actual password reset logic
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSuccess(true);
    } catch (err) {
      setError('Failed to send reset email. Please try again.');
    } finally {
      setLoading(false);
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
              minHeight: 600,
              background: '#f3e5f5',
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
                  <LockResetOutlinedIcon sx={{ fontSize: 40, color: 'white' }} />
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
                  Reset Password
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
                  Don't worry! It happens to the best of us. Enter your email and we'll send you a reset link.
                </Typography>

                {/* Feature Chips */}
                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
                  <Chip 
                    label="Secure Reset" 
                    sx={{ 
                      bgcolor: 'primary.main', 
                      color: 'white',
                      border: 'none'
                    }} 
                  />
                  <Chip 
                    label="Quick Process" 
                    sx={{ 
                      bgcolor: 'primary.main', 
                      color: 'white',
                      border: 'none'
                    }} 
                  />
                  <Chip 
                    label="24/7 Support" 
                    sx={{ 
                      bgcolor: 'primary.main', 
                      color: 'white',
                      border: 'none'
                    }} 
                  />
                </Box>
              </Box>
            </Box>

            {/* Right Side - Reset Form */}
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
                  Forgot Password?
                </Typography>
                
                <Typography 
                  variant="body1" 
                  sx={{ 
                    color: 'text.secondary',
                    fontSize: '1.1rem'
                  }}
                >
                  Enter your email address and we'll send you a link to reset your password.
                </Typography>
              </Box>
              
              {/* Success Alert */}
              {success && (
                <Alert severity="success" sx={{ mb: 3, borderRadius: 2 }}>
                  Password reset email sent! Please check your inbox.
                </Alert>
              )}

              {/* Error Alert */}
              {error && (
                <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
                  {error}
                </Alert>
              )}

              {/* Form */}
              {!success ? (
                <Box component="form" onSubmit={handleSubmit} sx={{ mb: 4 }}>
                  <TextField
                    label="Email Address"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
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

                  {/* Reset Button */}
                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    fullWidth
                    disabled={loading || !email}
                    sx={{
                      py: 1.8,
                      borderRadius: 2,
                      textTransform: 'none',
                      fontSize: '1.1rem',
                      fontWeight: 600,
                      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                      background: 'linear-gradient(45deg, #2e7d32 0%, #1b5e20 100%)',
                      mt: 3,
                      '&:hover': {
                        boxShadow: '0 6px 20px rgba(0,0,0,0.25)',
                        transform: 'translateY(-1px)',
                        transition: 'all 0.2s ease-in-out'
                      }
                    }}
                  >
                    {loading ? <CircularProgress size={24} color="inherit" /> : 'Send Reset Link'}
                  </Button>
                </Box>
              ) : (
                <Button
                  variant="outlined"
                  component={Link}
                  to="/login"
                  fullWidth
                  sx={{
                    py: 1.8,
                    borderRadius: 2,
                    textTransform: 'none',
                    fontSize: '1.1rem',
                    fontWeight: 600,
                    mt: 3,
                    borderColor: 'primary.main',
                    color: 'primary.main',
                    '&:hover': {
                      borderColor: 'primary.dark',
                      backgroundColor: 'rgba(102, 126, 234, 0.04)',
                      transform: 'translateY(-1px)',
                      transition: 'all 0.2s ease-in-out'
                    }
                  }}
                >
                  Back to Login
                </Button>
              )}

              {/* Back to Login Link */}
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="body1" color="text.secondary">
                  Remember your password?{' '}
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

export default ForgotPasswordPage;
