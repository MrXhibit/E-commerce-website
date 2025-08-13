import React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AdminProvider, LoadingProvider, ThemeProvider as CustomThemeProvider } from './state/GlobalContext';
import Layout from './Layout';
import { theme } from './theme';
import './Admin.css';

function AdminApp() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <CustomThemeProvider>
        <LoadingProvider>
          <AdminProvider>
            <div className='admin-app'>
              <Layout />
            </div>
          </AdminProvider>
        </LoadingProvider>
      </CustomThemeProvider>
    </ThemeProvider>
  );
}

export default AdminApp;
