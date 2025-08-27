import React from 'react';
import { Box, Container, Paper, Typography, Button, Stack } from '@mui/material';
import { Cancel } from '@mui/icons-material';
import { red } from '@mui/material/colors';
import Header from './Header';
import Footer from './Footer';
import { useNavigate } from 'react-router-dom';

function CancelPage() {
  const navigate = useNavigate();
  return (
    <Box>
      <Header />
      <Container maxWidth="sm" sx={{ py: 8 }}>
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Cancel sx={{ fontSize: 64, color: red[500] }} />
          <Typography variant="h4" sx={{ mt: 2, mb: 1 }}>
            Payment Cancelled
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Your payment was not completed. You can try again or continue shopping.
          </Typography>
          <Stack direction="row" spacing={2} justifyContent="center">
            <Button variant="contained" onClick={() => navigate('/cart')}>Back to Cart</Button>
            <Button variant="outlined" onClick={() => navigate('/')}>Go to Homepage</Button>
          </Stack>
        </Paper>
      </Container>
      <Footer />
    </Box>
  );
}

export default CancelPage;


