import { colorModeContext, useMode } from "./theme";
import { CssBaseline, ThemeProvider } from "@mui/material";
import "./Admin.css";
import LoginPage from "./pages/LoginPage";
import Layout from "./Layout";

function AdminApp() {
  const [theme, colorMode] = useMode();
  return (
    <colorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="admin-app">
          <Layout/>
        </div>
      </ThemeProvider>
    </colorModeContext.Provider>
  );
}

export default AdminApp;
