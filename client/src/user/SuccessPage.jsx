import React, { useEffect, useState } from 'react';
import { Box, Container, Paper, Typography, Button, Stack } from '@mui/material';
import { CheckCircle } from '@mui/icons-material';
import { green } from '@mui/material/colors';
import Header from './Header';
import Footer from './Footer';
import { useNavigate } from 'react-router-dom';
import apiService from '../services/api';

function SuccessPage() {
  const navigate = useNavigate();
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sessionId = params.get('session_id');
    if (!sessionId) return;
    
    (async () => {
      try {
        const token = localStorage.getItem('accessToken');
        const res = await fetch(`/api/v1/payments/checkout-session?session_id=${sessionId}`, {
          credentials: 'include',
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        });
        const data = await res.json();
        if (data.success) {
          setSummary({
            amountTotal: (data.data.session.amount_total || 0) / 100,
            currency: data.data.session.currency,
            lineItems: data.data.lineItems.map(li => ({
              name: li.description,
              quantity: li.quantity,
              amount: (li.amount_total || 0) / 100,
            }))
          });
        }
      } catch (e) {
        console.error('Error fetching checkout session:', e);
      }
    })();
  }, []);
  return (
    <Box>
      <Header />
      <Container maxWidth="sm" sx={{ py: 8 }}>
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <CheckCircle sx={{ fontSize: 64, color: green[500] }} />
          <Typography variant="h4" sx={{ mt: 2, mb: 1 }}>
            Payment Successful!
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Thank you for your purchase. Your order is being processed.
          </Typography>
          {summary && (
            <Box sx={{ textAlign: 'left', mt: 2 }}>
              <Typography variant="h6" sx={{ mb: 1 }}>Order Summary</Typography>
              {summary.lineItems.map((it, idx) => (
                <Box key={idx} sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography>{it.name} x {it.quantity}</Typography>
                  <Typography>${it.amount.toFixed(2)}</Typography>
                </Box>
              ))}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1, pt: 1, borderTop: '1px solid #eee' }}>
                <Typography fontWeight={700}>Total</Typography>
                <Typography fontWeight={700}>${summary.amountTotal.toFixed(2)}</Typography>
              </Box>
            </Box>
          )}
          <Stack direction="row" spacing={2} justifyContent="center">
            <Button variant="contained" onClick={() => navigate('/')}>Go to Homepage</Button>
          </Stack>
        </Paper>
      </Container>
      <Footer />
    </Box>
  );
}

export default SuccessPage;


