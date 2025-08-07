import  { createContext, useState, useMemo } from 'react';
import { createTheme, ThemeProvider, CssBaseline } from '@mui/material';
import { themeSettings } from '../theme';


const ThemeContext = createContext();
const AdminContext = createContext();

const GlobalProvider = ({ children }) => {
  const [mode, setMode] = useState('dark');
  const [admin, setAdmin] = useState(null);

  const toggleColorMode = () => {
    setMode((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);
  const themeValue = useMemo(() => ({
    mode,
    toggleColorMode,
  }), [mode]);

  const createAdmin = (name,email,profile)=>{
   setAdmin({
    name,
    email,
    profile
   })
  }
  const deleteAdmin = ()=>{
    setAdmin(null)
  }

  const adminValue = useMemo(() => ({
    admin,
    createAdmin,
    deleteAdmin
  }), [admin]);

  return (
    <ThemeContext.Provider value={themeValue}>
      <AdminContext.Provider value={adminValue}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          {children}
        </ThemeProvider>
      </AdminContext.Provider>
    </ThemeContext.Provider>

  );
};

export { GlobalProvider, ThemeContext, AdminContext };
