import { axiosInstance } from "../utills/axios.instance";

export const addCategoryFormSubmit = async (values, { setStatus }) => {
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

