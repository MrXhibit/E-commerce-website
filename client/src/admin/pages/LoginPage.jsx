import { Box, Button, TextField, Alert, Typography, Card, CardContent, useTheme } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import { loginFormSubmit } from "../services/auth.service";

const loginSchema = yup.object().shape({
  email: yup.string().email("invalid email").required("required"),
  password: yup.string().required("required"),
});

const loginInitialValues = {
  email: "",
  password: "",
};

function LoginPage() {
  const theme = useTheme();
  
  // Fallback colors if theme is not available
  const colors = {
    grey: {
      100: "#f8fafc",
      400: "#94a3b8",
      600: "#475569",
    },
    background: {
      default: "#0f172a",
    },
    card: {
      main: "#2D3748",
      light: "#374151",
    },
    blueAccent: {
      500: "#3b82f6",
      600: "#2563eb",
    },
    redAccent: {
      400: "#f87171",
    },
  };

  return (
    <Box
      sx={{
        p: { xs: 2, sm: 3 },
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        width: "100%",
        backgroundColor: colors.background.default,
      }}
    >
      <Card sx={{ 
        backgroundColor: colors.card.main, 
        borderRadius: 3, 
        width: "100%",
        maxWidth: { xs: "100%", sm: 400, md: 450 },
        mx: { xs: 2, sm: 0 }
      }}>
        <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
          {/* Header */}
          <Box mb={4} textAlign="center">
            <Typography variant="h3" sx={{ color: colors.grey[100], fontWeight: 700, mb: 1 }}>
              ADMINIS
            </Typography>
            <Typography variant="h5" sx={{ color: colors.grey[400] }}>
              Admin Login
            </Typography>
          </Box>

          <Formik onSubmit={loginFormSubmit} initialValues={loginInitialValues} validationSchema={loginSchema}>
            {({ values, errors, touched, handleBlur, handleChange, handleSubmit, status }) => (
              <form onSubmit={handleSubmit}>
                {status && (
                  <Alert severity="error" sx={{ mb: 3 }}>
                    {status}
                  </Alert>
                )}

                <TextField
                  fullWidth
                  variant="outlined"
                  type="email"
                  placeholder="Email"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.email}
                  name="email"
                  error={!!touched.email && !!errors.email}
                  helperText={touched.email && errors.email}
                  sx={{ 
                    mb: 3,
                    "& .MuiOutlinedInput-root": {
                      color: colors.grey[100],
                      backgroundColor: colors.card.light,
                      "& fieldset": { borderColor: colors.grey[600] },
                      "&:hover fieldset": { borderColor: colors.grey[500] },
                      "&.Mui-focused fieldset": { borderColor: colors.blueAccent[500] },
                    },
                    "& .MuiInputBase-input::placeholder": {
                      color: colors.grey[400],
                      opacity: 1,
                    },
                    "& .MuiFormHelperText-root": {
                      color: colors.redAccent[400],
                    },
                  }}
                />
                
                <TextField
                  fullWidth
                  variant="outlined"
                  type="password"
                  placeholder="Password"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.password}
                  name="password"
                  error={!!touched.password && !!errors.password}
                  helperText={touched.password && errors.password}
                  sx={{ 
                    mb: 4,
                    "& .MuiOutlinedInput-root": {
                      color: colors.grey[100],
                      backgroundColor: colors.card.light,
                      "& fieldset": { borderColor: colors.grey[600] },
                      "&:hover fieldset": { borderColor: colors.grey[500] },
                      "&.Mui-focused fieldset": { borderColor: colors.blueAccent[500] },
                    },
                    "& .MuiInputBase-input::placeholder": {
                      color: colors.grey[400],
                      opacity: 1,
                    },
                    "& .MuiFormHelperText-root": {
                      color: colors.redAccent[400],
                    },
                  }}
                />
                
                <Button 
                  type="submit" 
                  variant="contained" 
                  fullWidth
                  sx={{
                    backgroundColor: colors.blueAccent[500],
                    color: colors.grey[100],
                    py: 1.5,
                    borderRadius: 2,
                    textTransform: "none",
                    fontWeight: 600,
                    fontSize: "16px",
                    "&:hover": {
                      backgroundColor: colors.blueAccent[600],
                    }
                  }}
                >
                  Login
                </Button>
              </form>
            )}
          </Formik>
        </CardContent>
      </Card>
    </Box>
  );
}

export default LoginPage;
