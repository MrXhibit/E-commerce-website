import { Typography, Box, useTheme } from "@mui/material";

const Header = ({ title, subtitle }) => {
  const theme = useTheme();
  
  // Fallback colors if theme is not available
  const colors = {
    grey: {
      100: "#f8fafc",
    },
    greenAccent: {
      400: "#4ade80",
    },
  };
  
  return (
    <Box mb="30px">
      <Typography variant="h2" color={colors.grey[100]} fontWeight="bold" sx={{ m: "0 0 5px 0" }}>
        {title}
      </Typography>
      <Typography variant="h5" color={colors.greenAccent[400]}>
        {subtitle}
      </Typography>
    </Box>
  );
};

export default Header;
