import { useEffect, useState } from "react";
import {
  Box,
  Button,
  TextField,
  Alert,
  FormControl,
  FormLabel,
  Typography,
  Select,
  MenuItem,
  Card,
  CardContent,
  Grid,
  useTheme,
} from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import Header from "../components/global/Header";
import { addProductFormSubmit } from "../services/product.form.service";
import { useFetchData } from "../hooks/useFetchData";

function AddProduct() {
  const [data, error] = useFetchData("/category");
  const categories = data?.categories || [];
  const [allCategories, setAllCategories] = useState([]);
  const [levels, setLevels] = useState([]);
  const theme = useTheme();
  
  // Fallback colors if theme is not available
  const colors = {
    grey: {
      100: "#f8fafc",
      300: "#cbd5e1",
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

  useEffect(() => {
    if (categories.length > 0) {
      const flat = flattenCategoriesByLevel(categories);
      setAllCategories(flat);
      const level0 = flat.filter((cat) => cat.level === 0);
      setLevels([level0]);
    }
  }, [categories]);

  const productSchema = yup.object().shape({
    name: yup.string().required("required"),
    description: yup.string().required("required"),
    price: yup.number("price only number").required("required"),
    categoryPath: yup
      .array()
      .of(
        yup.object({
          id: yup.string().required(),
          name: yup.string().required(),
        }),
      )
      .min(1, "Category is required")
      .test("is-final-category", "Please select the most specific category", function (value) {
        if (!value || value.length === 0) return false;
        const lastSelected = value[value.length - 1];
        const hasChildren = allCategories.some(
          (cat) => cat.level === value.length && cat.path[value.length - 1]?.id === lastSelected.id,
        );
        return !hasChildren;
      }),

    brand: yup.string().required("required"),
    model: yup.string().required("required"),
    stock: yup.number().required("required"),
    images: yup
      .mixed()
      .required("required")
      .test("fileType", "Only JPG/PNG files are allowed", (files) =>
        files ? files.every((file) => ["image/jpeg", "image/png", "image/jpg"].includes(file.type)) : false,
      )
      .test("fileSize", "Image must be less than 5MB", (files) =>
        files ? files.every((file) => file.size <= 5 * 1024 * 1024) : false,
      ),
  });

  const productInitialValues = {
    name: "",
    description: "",
    price: "",
    categoryPath: [],
    brand: "",
    model: "",
    stock: "",
    images: [],
  };

  const flattenCategoriesByLevel = (categories, level = 0, path = []) => {
    return categories.flatMap((cat) => {
      const currentPath = [...path, { id: cat.id, name: cat.name }];
      const flattened = [{ ...cat, level, path: currentPath }];
      if (cat.children && cat.children.length > 0) {
        return [...flattened, ...flattenCategoriesByLevel(cat.children, level + 1, currentPath)];
      }
      return flattened;
    });
  };

  const handleCategoryChange = (levelIndex, selectedId, setFieldValue, values) => {
    const newPath = [...values.categoryPath.slice(0, levelIndex)];

    const selectedCategory = levels[levelIndex].find((cat) => cat.id === selectedId);
    if (!selectedCategory) return;

    newPath.push({ id: selectedCategory.id, name: selectedCategory.name });
    setFieldValue("categoryPath", newPath);

    const newLevels = [...levels.slice(0, levelIndex + 1)];

    const nextLevelOptions = allCategories.filter(
      (cat) => cat.level === levelIndex + 1 && cat.path[levelIndex]?.id === selectedId,
    );

    if (nextLevelOptions.length > 0) {
      newLevels.push(nextLevelOptions);
    }

    setLevels(newLevels);
  };

  return (
    <Box sx={{ p: 3, backgroundColor: colors.background.default, minHeight: "100vh", width: "100%" }}>
      {/* Header */}
      <Box mb={4}>
        <Typography variant="h3" sx={{ color: colors.grey[100], fontWeight: 700, mb: 1 }}>
          Product
        </Typography>
        <Typography variant="body1" sx={{ color: colors.greenAccent[400] }}>
          Enter the product details
        </Typography>
      </Box>

      {/* Form Card - Now responsive and fits to screen */}
      <Card sx={{ backgroundColor: colors.card.main, borderRadius: 3, width: "100%" }}>
        <CardContent sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
          <Formik
            onSubmit={addProductFormSubmit}
            initialValues={productInitialValues}
            validationSchema={productSchema}
          >
            {({ values, errors, touched, handleBlur, handleChange, setFieldValue, handleSubmit, status }) => (
              <form onSubmit={handleSubmit}>
                {status && (
                  <Alert severity="error" sx={{ mb: 3 }}>
                    {status}
                  </Alert>
                )}

                <Grid container spacing={{ xs: 2, sm: 3 }}>
                  {/* Product Name */}
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      variant="outlined"
                      type="text"
                      placeholder="product name"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.name}
                      name="name"
                      error={!!touched.name && !!errors.name}
                      helperText={touched.name && errors.name}
                      sx={{
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
                  </Grid>

                  {/* Product Model */}
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      variant="outlined"
                      type="text"
                      placeholder="product model"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.model}
                      name="model"
                      error={!!touched.model && !!errors.model}
                      helperText={touched.model && errors.model}
                      sx={{
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
                  </Grid>

                  {/* Product Brand */}
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      variant="outlined"
                      type="text"
                      placeholder="product brand"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.brand}
                      name="brand"
                      error={!!touched.brand && !!errors.brand}
                      helperText={touched.brand && errors.brand}
                      sx={{
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
                  </Grid>

                  {/* Product Price */}
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      variant="outlined"
                      type="number"
                      placeholder="product price"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.price}
                      name="price"
                      error={!!touched.price && !!errors.price}
                      helperText={touched.price && errors.price}
                      sx={{
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
                  </Grid>

                  {/* Product Stock */}
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      variant="outlined"
                      type="number"
                      placeholder="product stock"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.stock}
                      name="stock"
                      error={!!touched.stock && !!errors.stock}
                      helperText={touched.stock && errors.stock}
                      sx={{
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
                  </Grid>

                  {/* Category Selection */}
                  {levels.length > 0 &&
                    levels.map(
                      (levelOptions, idx) =>
                        levelOptions.length > 0 && (
                          <Grid item xs={12} md={6} key={idx}>
                            <FormControl fullWidth>
                              <FormLabel sx={{ color: colors.grey[100], mb: 1 }}>
                                {`Category Level ${idx + 1}`}
                              </FormLabel>
                              <Select
                                name={`category_level_${idx}`}
                                value={values.categoryPath[idx]?.id || ""}
                                onChange={(e) => handleCategoryChange(idx, e.target.value, setFieldValue, values)}
                                sx={{
                                  color: colors.grey[100],
                                  backgroundColor: colors.card.light,
                                  "& .MuiSelect-icon": { color: colors.grey[400] },
                                  "& .MuiOutlinedInput-notchedOutline": { borderColor: colors.grey[600] },
                                  "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: colors.grey[500] },
                                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: colors.blueAccent[500] },
                                }}
                              >
                                {levelOptions.map((cat) => (
                                  <MenuItem key={cat.id} value={cat.id} sx={{ color: colors.grey[100] }}>
                                    {cat.name}
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                          </Grid>
                        ),
                    )}

                  {/* Product Description */}
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      variant="outlined"
                      placeholder="product description"
                      multiline
                      rows={4}
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.description}
                      name="description"
                      error={!!touched.description && !!errors.description}
                      helperText={touched.description && errors.description}
                      sx={{
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
                  </Grid>

                  {/* Image Upload */}
                  <Grid item xs={12}>
                    <FormControl fullWidth>
                      <FormLabel sx={{ color: colors.grey[100], mb: 1 }}>
                        Upload Images
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
                        onClick={() => document.getElementById("images-input").click()}
                      >
                        <input
                          id="images-input"
                          name="images"
                          type="file"
                          multiple
                          accept="image/*"
                          onChange={(event) => {
                            const files = Array.from(event.currentTarget.files);
                            setFieldValue("images", files);
                          }}
                          onBlur={handleBlur}
                          style={{ display: "none" }}
                        />
                        {values.images && values.images.length > 0 ? (
                          <Box>
                            <Typography variant="body2" sx={{ color: colors.grey[100], mb: 1 }}>
                              Selected files: {values.images.length} image(s)
                            </Typography>
                            <Typography variant="caption" sx={{ color: colors.grey[400] }}>
                              Click to change files
                            </Typography>
                          </Box>
                        ) : (
                          <Box>
                            <Typography variant="body2" sx={{ color: colors.grey[400] }}>
                              Click to choose files
                            </Typography>
                            <Typography variant="caption" sx={{ color: colors.grey[500] }}>
                              No files chosen
                            </Typography>
                          </Box>
                        )}
                      </Box>
                      {touched.images && errors.images && (
                        <Typography color="error" variant="body2" sx={{ mt: 1, color: colors.redAccent[400] }}>
                          {errors.images}
                        </Typography>
                      )}
                    </FormControl>
                  </Grid>

                  {/* Submit Button */}
                  <Grid item xs={12}>
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
                  </Grid>
                </Grid>
              </form>
            )}
          </Formik>
        </CardContent>
      </Card>
    </Box>
  );
}

export default AddProduct;
