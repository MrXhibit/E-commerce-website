import React, { useState, useEffect } from 'react';
import { Box, Paper, Typography, TextField, Button, Checkbox, FormControlLabel, Divider, Alert, CircularProgress, Grid } from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';
import AppleIcon from '@mui/icons-material/Apple';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { registerUser, clearError } from '../store/slices/authSlice';

const Signup = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    conformPassword: ''
  });
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  
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
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!agreedToTerms) {
      return;
    }
    
    // Password validation
    if (formData.password !== formData.conformPassword) {
      console.error('Password mismatch');
      return;
    }
    
    // Password strength validation
    if (formData.password.length < 8) {
      console.error('Password too short');
      return;
    }
    
    dispatch(clearError());
    // Send the data that backend expects - backend expects { email, password, conformPassword }
    const registrationData = {
      email: formData.email,
      password: formData.password,
      conformPassword: formData.conformPassword
    };
    console.log('Signup component - Sending registration data:', registrationData);
    const result = await dispatch(registerUser(registrationData));
    if (result.type === 'auth/registerUser/fulfilled') {
      navigate('/');
    } else if (result.type === 'auth/registerUser/rejected') {
      console.error('Signup failed:', result.payload);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #232526 0%, #414345 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Paper elevation={8} sx={{ borderRadius: 4, overflow: 'hidden', width: { xs: '100%', sm: 700, md: 900 }, maxWidth: '95vw', display: 'flex', minHeight: 500 }}>
        {/* Left Side - Placeholder */}
        <Box sx={{ flex: 1, background: '#292929', display: { xs: 'none', md: 'flex' }, flexDirection: 'column', justifyContent: 'center', alignItems: 'center', p: 4, minWidth: 350 }}>
          <Typography variant="h6" color="white" sx={{ opacity: 0.5, fontWeight: 400, textAlign: 'center' }}>
            Image Placeholder
          </Typography>
        </Box>
        {/* Right Side - Signup Form */}
        <Box sx={{ flex: 1, background: '#232526', color: 'white', p: { xs: 3, md: 6 }, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <Typography variant="h4" fontWeight={700} sx={{ mb: 1 }}>
            Create an account
          </Typography>
          <Typography variant="body2" sx={{ mb: 3 }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: '#b39ddb', textDecoration: 'underline' }}>Log in</Link>
          </Typography>
          
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <Grid spacing={2} sx={{ mb: 2 }}>
              <Grid xs={12}>
                <TextField 
                  label="Email" 
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  variant="outlined" 
                  fullWidth 
                  size="small" 
                  InputProps={{ style: { background: '#2c2f34', color: 'white' } }} 
                  InputLabelProps={{ style: { color: '#bdbdbd' } }} 
                  required
                />
              </Grid>
              <Grid xs={12}>
                <TextField 
                  label="Enter your password" 
                  name="password"
                  type="password" 
                  value={formData.password}
                  onChange={handleChange}
                  variant="outlined" 
                  fullWidth 
                  size="small" 
                  InputProps={{ style: { background: '#2c2f34', color: 'white' } }} 
                  InputLabelProps={{ style: { color: '#bdbdbd' } }} 
                  required
                />
              </Grid>
              {/* ADD CONFIRM PASSWORD FIELD */}
              <Grid xs={12}>
                <TextField 
                  label="Confirm Password" 
                  name="conformPassword"
                  type="password" 
                  value={formData.conformPassword}
                  onChange={handleChange}
                  variant="outlined" 
                  fullWidth 
                  size="small" 
                  InputProps={{ style: { background: '#2c2f34', color: 'white' } }} 
                  InputLabelProps={{ style: { color: '#bdbdbd' } }} 
                  required
                  error={formData.password !== formData.conformPassword && formData.conformPassword !== ''}
                  helperText={formData.password !== formData.conformPassword && formData.conformPassword !== '' ? 'Passwords do not match' : ''}
                />
              </Grid>
            </Grid>
            <FormControlLabel
              control={
                <Checkbox 
                  checked={agreedToTerms}
                  onChange={(e) => setAgreedToTerms(e.target.checked)}
                  sx={{ color: '#b39ddb' }} 
                />
              }
              label={<Typography variant="body2" color="#bdbdbd">I agree to the <Link to="#" style={{ color: '#b39ddb' }}>Terms & Conditions</Link></Typography>}
              sx={{ mb: 2 }}
            />
            <Button 
              type="submit"
              variant="contained" 
              color="primary" 
              size="large" 
              fullWidth 
              sx={{ mb: 2, fontWeight: 600, borderRadius: 2, py: 1.2 }}
              disabled={loading || !agreedToTerms}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Create account'}
            </Button>
          </form>
          
          <Divider sx={{ my: 2, background: '#444' }}>Or register with</Divider>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
            <Button
              variant="outlined"
              startIcon={<GoogleIcon />}
              sx={{ color: 'white', borderColor: '#b39ddb', borderRadius: 2, textTransform: 'none', width: 220 }}
              onClick={() => {
                window.location.href = '/api/v1/auth/google';
              }}
            >
              Google
            </Button>
            <Button variant="outlined" startIcon={<AppleIcon />} sx={{ color: 'white', borderColor: '#b39ddb', borderRadius: 2, textTransform: 'none', width: 220 }}>
              Apple
            </Button>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default Signup;