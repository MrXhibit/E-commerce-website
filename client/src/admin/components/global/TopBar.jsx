import { Box, IconButton, Typography, useTheme, Avatar } from "@mui/material";
import { useContext } from "react";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import LogoutIcon from "@mui/icons-material/Logout";
import RefreshIcon from "@mui/icons-material/Refresh";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { ThemeContext } from "../../state/GlobalContext";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import { axiosInstance } from "../../utills/axios.instance";
import { axiosDeleteAdminFunction } from "../../utills/axios.delete.admin";

async function logout() {
  try {
    await axiosInstance.get("/admin/logout");
    axiosDeleteAdminFunction();
  } catch (error) {
    axiosDeleteAdminFunction();
  }
}

function TopBar() {
  const theme = useTheme();
  const colorMode = useContext(ThemeContext);
  
  // Fallback colors if theme is not available
  const colors = {
    grey: {
      100: "#f8fafc",
      400: "#94a3b8",
      600: "#475569",
      700: "#334155",
    },
    card: {
      main: "#2D3748",
    },
    blueAccent: {
      400: "#60a5fa",
    },
    redAccent: {
      400: "#f87171",
    },
  };

  return (
    <Box 
      display="flex" 
      justifyContent="space-between" 
      alignItems="center"
      p={3}
      sx={{
        backgroundColor: colors.card.main,
        borderBottom: `1px solid ${colors.grey[700]}`,
        minHeight: "80px"
      }}
    >
      {/* Left side - Logo and title */}
      <Box display="flex" alignItems="center" gap={2}>
        <Typography
          variant="h4"
          component="div"
          sx={{
            color: colors.blueAccent[400],
            textTransform: "uppercase",
            letterSpacing: 1,
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          ADMINIS
        </Typography>
        <Box 
          sx={{ 
            width: "1px", 
            height: "24px", 
            backgroundColor: colors.grey[600] 
          }} 
        />
        <Typography
          variant="h5"
          component="div"
          sx={{
            color: colors.grey[100],
            fontWeight: 600,
          }}
        >
          E COMMERCE
        </Typography>
      </Box>

      {/* Right side - Icons */}
      <Box display="flex" alignItems="center" gap={1}>
        <IconButton 
          sx={{ 
            color: colors.grey[400],
            "&:hover": { color: colors.grey[100] }
          }}
        >
          <RefreshIcon />
        </IconButton>
        <IconButton 
          onClick={colorMode?.toggleColorMode}
          sx={{ 
            color: colors.grey[400],
            "&:hover": { color: colors.grey[100] }
          }}
        >
          {theme.palette.mode === "dark" ? <LightModeOutlinedIcon /> : <DarkModeOutlinedIcon />}
        </IconButton>
        <IconButton 
          sx={{ 
            color: colors.grey[400],
            "&:hover": { color: colors.grey[100] }
          }}
        >
          <NotificationsIcon />
        </IconButton>
        <IconButton 
          sx={{ 
            color: colors.grey[400],
            "&:hover": { color: colors.grey[100] }
          }}
        >
          <PersonOutlinedIcon />
        </IconButton>
        <IconButton 
          onClick={logout}
          sx={{ 
            color: colors.grey[400],
            "&:hover": { color: colors.redAccent[400] }
          }}
        >
          <LogoutIcon />
        </IconButton>
      </Box>
    </Box>
  );
}

export default TopBar;
