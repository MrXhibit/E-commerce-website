import { axiosInstance } from "../utills/axios.instance";

export const addProductFormSubmit = async (values, { setStatus }) => {
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
