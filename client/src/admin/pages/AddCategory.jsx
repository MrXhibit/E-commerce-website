import { Box, Button, TextField, Alert,FormControl,FormLabel,Typography } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import Header from "../components/global/Header";
import { axiosInstance } from "../utills/axios.instance";

const handleFormSubmit = async (values, { setStatus }) => {
  try {

    const formData = new FormData();
    formData.append("name", values.name);
    formData.append("image", values.image);  
    const response = await axiosInstance.post('/category',formData)
    if(response.data?.category) setStatus({type:"success",message:"category added"})
  } catch (error) {
    if (error?.response?.data?.error) setStatus({type:"error",message:error.response.data.error});
  }
};
const categorySchema = yup.object().shape({
  name: yup.string().required("required"),
  image: yup.mixed()
  .required("required")
  .test("fileType", "Only JPG/PNG files are allowed", (file) =>
      file ? ["image/jpeg", "image/png", "image/jpg"].includes(file.type) : false
    )
    .test("fileSize", "Image must be less than 5MB", (file) =>
      file ? file.size <= 5 * 1024 * 1024 : false
    ),

});
const categoryInitialValues = {
  name: "",
  image: null,
};

function AddCategory() {
  return (
    <Box m="20px">
      <Header title="Category" subtitle="Enter the category details" />
      <Formik
        onSubmit={handleFormSubmit}
        initialValues={categoryInitialValues}
        validationSchema={categorySchema}
      >
        {({ values, errors, touched, handleBlur, handleChange, setFieldValue, handleSubmit, status }) => (
          <form onSubmit={handleSubmit} encType="multipart/form-data">
            {status && (
              <Alert severity={`${status.type=="success"?"success":"error"}`} sx={{ mb: 2 }}>
                {status.message}
              </Alert>
            )}

            <TextField
              fullWidth
              variant="filled"
              type="text"
              label="category name"
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.name}
              name="name"
              error={!!touched.name && !!errors.name}
              helperText={touched.name && errors.name}
              sx={{ marginBottom: "20px" }}
            />
            <FormControl fullWidth sx={{ marginBottom: "20px" }}>
              <FormLabel htmlFor="image">Upload Image</FormLabel>
              <input
                id="image"
                name="image"
                type="file"
                accept="image/*"
                onChange={(event) => {
                  setFieldValue("image", event.currentTarget.files[0]);
                }}
                onBlur={handleBlur}
                style={{ marginTop: "8px" }}
              />
              {touched.image && errors.image && (
                <Typography color="error" variant="body2">
                  {errors.image}
                </Typography>
              )}
            </FormControl>

            {values.image && (
              <Typography variant="body2" sx={{ mb: 2 }}>
                Selected file: {values.image.name}
              </Typography>
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

export default AddCategory;
