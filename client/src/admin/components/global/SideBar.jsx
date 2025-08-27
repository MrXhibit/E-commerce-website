import { useState } from "react";
import { Box, IconButton, Typography, useTheme, Avatar } from "@mui/material";
import { Sidebar as ProSidebar, Menu, MenuItem, sidebarClasses, menuClasses } from "react-pro-sidebar";
import { useLocation } from "react-router-dom";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import CategoryIcon from "@mui/icons-material/Category";
import InventoryIcon from "@mui/icons-material/Inventory";
import FactCheckIcon from '@mui/icons-material/FactCheck';
import { useContext } from "react";

import { AdminContext, ThemeContext } from "../../state/GlobalContext";
import Item from "../sidebar/Item";

function SideBar() {
  const theme = useTheme();
  const { admin } = useContext(AdminContext);
  const location = useLocation();
  
  // Fallback colors if theme is not available
  const colors = {
    grey: {
      100: "#f8fafc",
      300: "#cbd5e1",
      400: "#94a3b8",
      500: "#64748b",
      600: "#475569",
    },
    sidebar: {
      main: "#212B36",
      light: "#2D3748",
      dark: "#1A1D29",
    },
    blueAccent: {
      400: "#60a5fa",
      500: "#3b82f6",
    },
  };
  
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  return (
    <ProSidebar
      rootStyles={{
        [`.${sidebarClasses.container}`]: {
          backgroundColor: colors.sidebar.main,
          borderRight: "none",
        },
        [`.${menuClasses.icon}`]: {
          backgroundColor: "transparent !important",
        },
        [`.${menuClasses.button}`]: {
          padding: "12px 24px !important",
          color: colors.grey[300],
          backgroundColor: "transparent !important",
          borderRadius: "8px",
          margin: "4px 16px",
          "&:hover": {
            color: colors.grey[100],
            backgroundColor: `${colors.sidebar.light} !important`,
          },
          "&.ps-active": {
            color: colors.blueAccent[400],
            backgroundColor: `${colors.blueAccent[500]}20 !important`,
            borderLeft: `3px solid ${colors.blueAccent[400]}`,
          },
        },
      }}
      collapsed={isCollapsed}
    >
      <Menu iconShape="square">
        <MenuItem
          onClick={() => setIsCollapsed(!isCollapsed)}
          icon={isCollapsed ? <MenuOutlinedIcon /> : undefined}
          rootStyles={{
            margin: "16px 16px 24px 16px",
            color: colors.grey[100],
          }}
        >
          {!isCollapsed && (
            <Box display="flex" justifyContent="space-between" alignItems="center" ml="15px">
              <Typography 
                variant="h3" 
                color={colors.blueAccent[400]}
                sx={{ 
                  fontWeight: 700,
                  letterSpacing: "0.5px"
                }}
              >
                ADMINIS
              </Typography>
              <IconButton 
                onClick={() => setIsCollapsed(!isCollapsed)}
                sx={{ color: colors.grey[400] }}
              >
                <MenuOutlinedIcon />
              </IconButton>
            </Box>
          )}
        </MenuItem>
        
        {!isCollapsed && (
          <Box mb="32px" px="16px">
            <Box display="flex" justifyContent="center" alignItems="center" mb="16px">
              <Avatar
                alt="profile-user"
                src={admin?.profile}
                sx={{ 
                  width: 80, 
                  height: 80,
                  backgroundColor: colors.grey[600],
                  border: `2px solid ${colors.grey[500]}`,
                }}
              />
            </Box>
            <Box textAlign="center">
              <Typography 
                variant="h5" 
                color={colors.grey[100]} 
                fontWeight="600" 
                sx={{ mb: "4px" }}
              >
                {admin?.name || "Admin"}
              </Typography>
              <Typography 
                variant="body2" 
                color={colors.grey[400]}
                sx={{ fontSize: "12px" }}
              >
                {admin?.email || "admin@example.com"}
              </Typography>
            </Box>
          </Box>
        )}
        
        <Box paddingLeft={isCollapsed ? undefined : "16px"}>
          <Item
            title="Dashboard"
            to="/admin"
            icon={<HomeOutlinedIcon />}
            currentPath={location.pathname}
            exact={true}
          />
          <Item
            title="Categorys"
            to="/admin/categories"
            icon={<CategoryIcon />}
            currentPath={location.pathname}
          />
          <Item
            title="Products"
            to="/admin/products"
            icon={<InventoryIcon />}
            currentPath={location.pathname}
          />
          <Item
            title="Orders"
            to="/admin/orders"
            icon={<FactCheckIcon />}
            currentPath={location.pathname}
          />
        </Box>
      </Menu>
    </ProSidebar>
  );
}

export default SideBar;
