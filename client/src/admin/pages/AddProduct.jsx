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
} from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import Header from "../components/global/Header";
import { axiosInstance } from "../utills/axios.instance";

const categories = [
  { name: "Electronics", id: "electronics" },
  { name: "Clothing", id: "clothing" },
  { name: "Home Appliances", id: "home-appliances" },
];

const handleFormSubmit = async (values, { setStatus }) => {
  try {
    const formData = new FormData();
    const { name, description, price, category, brand, model, stock, images } = values;
    formData.append("name", name);
    formData.append("price", price);
    formData.append("category", category);
    formData.append("brand", brand);
    formData.append("description", description);
    formData.append("model", model);
    formData.append("stock", stock);
    images.forEach((image) => {
      formData.append("images", image);
    });
    console.log(values);
  } catch (error) {
    if (error?.response?.data?.error) setStatus(error.response.data.error);
  }
};

const productSchema = yup.object().shape({
  name: yup.string().required("required"),
  description: yup.string().required("required"),
  price: yup.number().required("required"),
  category: yup.string().required("required"),
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
  category: "",
  brand: "",
  model: "",
  stock: "",
  images: [],
};

function AddProduct() {
  return (
    <Box m="20px">
      <Header title="Product" subtitle="Enter the product details" />
      <Formik
        onSubmit={handleFormSubmit}
        initialValues={productInitialValues}
        validationSchema={productSchema}
      >
        {({ values, errors, touched, handleBlur, handleChange, setFieldValue, handleSubmit, status }) => (
          <form onSubmit={handleSubmit} encType="multipart/form-data">
            {status && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {status}
              </Alert>
            )}

            <TextField
              fullWidth
              variant="filled"
              type="text"
              label="product name"
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.name}
              name="name"
              error={!!touched.name && !!errors.name}
              helperText={touched.name && errors.name}
              sx={{ marginBottom: "20px" }}
            />
            <TextField
              fullWidth
              variant="filled"
              type="text"
              label="product model"
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.model}
              name="model"
              error={!!touched.model && !!errors.model}
              helperText={touched.model && errors.model}
              sx={{ marginBottom: "20px" }}
            />
            <TextField
              fullWidth
              variant="filled"
              type="text"
              label="product brand"
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.brand}
              name="brand"
              error={!!touched.brand && !!errors.brand}
              helperText={touched.brand && errors.brand}
              sx={{ marginBottom: "20px" }}
            />
            <TextField
              fullWidth
              variant="filled"
              label="product description"
              multiline
              rows={5}
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.description}
              name="description"
              error={!!touched.description && !!errors.description}
              helperText={touched.name && errors.name}
              sx={{ marginBottom: "20px" }}
            />
            <TextField
              fullWidth
              variant="filled"
              type="text"
              label="product price"
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.price}
              name="price"
              error={!!touched.price && !!errors.price}
              helperText={touched.price && errors.price}
              sx={{ marginBottom: "20px" }}
            />
            <TextField
              fullWidth
              variant="filled"
              type="stock"
              label="product stock"
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.stock}
              name="stock"
              error={!!touched.stock && !!errors.stock}
              helperText={touched.stock && errors.stock}
              sx={{ marginBottom: "20px" }}
            />
            <FormControl fullWidth sx={{ marginBottom: "20px" }} variant="filled">
              <FormLabel>Category</FormLabel>
              <Select
                name="category"
                value={values.category}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.category && Boolean(errors.category)}
              >
                {categories.map((option) => (
                  <MenuItem key={option.name} value={option.id}>
                    {option.name}
                  </MenuItem>
                ))}
              </Select>
              {touched.category && errors.category && (
                <Typography color="error" variant="body2">
                  {errors.category}
                </Typography>
              )}
            </FormControl>

            <FormControl fullWidth sx={{ marginBottom: "20px" }}>
              <FormLabel htmlFor="images">Upload Images</FormLabel>
              <input
                id="images"
                name="images"
                type="file"
                multiple
                accept="image/*"
                onChange={(event) => {
                  const files = Array.from(event.currentTarget.files);
                  setFieldValue("images", files);
                }}
                onBlur={handleBlur}
                style={{ marginTop: "8px" }}
              />
              {touched.images && errors.images && (
                <Typography color="error" variant="body2">
                  {errors.images}
                </Typography>
              )}
            </FormControl>

            {values.images && values.images.length > 0 && (
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2">Selected files:</Typography>
                <ul>
                  {values.images.map((file, idx) => (
                    <li key={idx}>{file.name}</li>
                  ))}
                </ul>
              </Box>
            )}

            <Button type="submit" color="secondary" variant="contained" fullWidth>
              submit
            </Button>
          </form>
        )}
      </Formik>
    </Box>
  );
}

export default AddProduct;
