import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { 
  Box, 
  Button, 
  TextField, 
  Alert, 
  FormControl, 
  FormLabel, 
  Typography,
  Card,
  CardContent,
  useTheme
} from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import Header from "../components/global/Header";
import { addCategoryFormSubmit } from "../services/category.service";

function AddCategory() {
  const { parentId } = useParams();
  const theme = useTheme();
  
  // Fallback colors if theme is not available
  const colors = {
    grey: {
      100: "#f8fafc",
      400: "#94a3b8",
      500: "#64748b",
      600: "#475569",
    },
    background: {
      default: "#0f172a",
    },
    card: {
      main: "#2D3748",
      light: "#374151",
    },
    greenAccent: {
      400: "#4ade80",
    },
    blueAccent: {
      500: "#3b82f6",
    },
    redAccent: {
      400: "#f87171",
    },
    purpleAccent: {
      500: "#a855f7",
      600: "#9333ea",
    },
  };
  
  const categorySchema = yup.object().shape({
    name: yup.string().required("required"),
    image: yup
      .mixed()
      .required("required")
      .test("fileType", "Only JPG/PNG files are allowed", (file) =>
        file ? ["image/jpeg", "image/png", "image/jpg"].includes(file.type) : false,
      )
      .test("fileSize", "Image must be less than 5MB", (file) =>
        file ? file.size <= 5 * 1024 * 1024 : false,
      ),
  });
  
  const categoryInitialValues = {
    name: "",
    image: null,
    parentId,
  };

  return (
    <Box sx={{ p: 3, backgroundColor: colors.background.default, minHeight: "100vh", width: "100%" }}>
      {/* Header */}
      <Box mb={4}>
        <Typography variant="h3" sx={{ color: colors.grey[100], fontWeight: 700, mb: 1 }}>
          Category
        </Typography>
        <Typography variant="body1" sx={{ color: colors.greenAccent[400] }}>
          Enter the category details
        </Typography>
      </Box>

      {/* Form Card - Now responsive and fits to screen */}
      <Card sx={{ backgroundColor: colors.card.main, borderRadius: 3, width: "100%" }}>
        <CardContent sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
          <Formik
            onSubmit={addCategoryFormSubmit}
            initialValues={categoryInitialValues}
            validationSchema={categorySchema}
          >
            {({ values, errors, touched, handleBlur, handleChange, setFieldValue, handleSubmit, status }) => (
              <form onSubmit={handleSubmit} encType="multipart/form-data">
                {status && (
                  <Alert severity={`${status.type == "success" ? "success" : "error"}`} sx={{ mb: 3 }}>
                    {status.message}
                  </Alert>
                )}

                {/* Category Name Input */}
                <TextField
                  fullWidth
                  variant="outlined"
                  type="text"
                  placeholder="category name"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.name}
                  name="name"
                  error={!!touched.name && !!errors.name}
                  helperText={touched.name && errors.name}
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

                {/* Image Upload */}
                <FormControl fullWidth sx={{ mb: 3 }}>
                  <FormLabel sx={{ color: colors.grey[100], mb: 1 }}>
                    Upload Image
                  </FormLabel>
                  <Box
                    sx={{
                      border: `2px dashed ${colors.grey[600]}`,
                      borderRadius: 2,
                      p: 3,
                      textAlign: "center",
                      backgroundColor: colors.card.light,
                      cursor: "pointer",
                      "&:hover": {
                        borderColor: colors.blueAccent[500],
                        backgroundColor: `${colors.blueAccent[500]}10`,
                      },
                    }}
                    onClick={() => document.getElementById("image-input").click()}
                  >
                    <input
                      id="image-input"
                      name="image"
                      type="file"
                      accept="image/*"
                      onChange={(event) => {
                        setFieldValue("image", event.currentTarget.files[0]);
                      }}
                      onBlur={handleBlur}
                      style={{ display: "none" }}
                    />
                    {values.image ? (
                      <Box>
                        <Typography variant="body2" sx={{ color: colors.grey[100], mb: 1 }}>
                          Selected file: {values.image.name}
                        </Typography>
                        <Typography variant="caption" sx={{ color: colors.grey[400] }}>
                          Click to change file
                        </Typography>
                      </Box>
                    ) : (
                      <Box>
                        <Typography variant="body2" sx={{ color: colors.grey[400] }}>
                          Click to choose file
                        </Typography>
                        <Typography variant="caption" sx={{ color: colors.grey[500] }}>
                          No file chosen
                        </Typography>
                      </Box>
                    )}
                  </Box>
                  {touched.image && errors.image && (
                    <Typography color="error" variant="body2" sx={{ mt: 1, color: colors.redAccent[400] }}>
                      {errors.image}
                    </Typography>
                  )}
                </FormControl>

                {/* Submit Button */}
                <Button 
                  type="submit" 
                  variant="contained" 
                  fullWidth
                  sx={{
                    backgroundColor: colors.purpleAccent[500],
                    color: colors.grey[100],
                    py: 1.5,
                    borderRadius: 2,
                    textTransform: "none",
                    fontWeight: 600,
                    fontSize: "16px",
                    "&:hover": {
                      backgroundColor: colors.purpleAccent[600],
                    }
                  }}
                >
                  SUBMIT
                </Button>
              </form>
            )}
          </Formik>
        </CardContent>
      </Card>
    </Box>
  );
}

export default AddCategory;
