import { Link } from "react-router-dom";
import { Typography, useTheme } from "@mui/material";
import { MenuItem } from "react-pro-sidebar";

const Item = ({ title, to, icon, currentPath, exact = false }) => {
  const theme = useTheme();
  const isActive = exact ? currentPath === to : currentPath.startsWith(to);

  // Fallback colors if theme is not available
  const colors = {
    grey: {
      100: "#f8fafc",
    },
  };
  
  return (
    <MenuItem
      active={isActive}
      style={{
        color: colors.grey[100],
      }}
      icon={icon}
      component={<Link to={to} />}
    >
      <Typography>{title}</Typography>
    </MenuItem>
  );
};

export default Item;
