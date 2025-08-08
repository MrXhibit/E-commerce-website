import { axiosInstance } from "../utills/axios.instance";
import { axiosCreateAdminFunction } from "../utills/axios.delete.admin"


export const loginFormSubmit = async (values,{ setStatus }) => {
  try {
    const response = await axiosInstance.post("/auth/admin/login", values);
     console.log(response.data);
    if(response?.data?.admin){      
      const admin = response.data.admin
      if(axiosCreateAdminFunction) axiosCreateAdminFunction(admin.userName,admin.email,admin.profile)
    }
  } catch (error) {
    if(error?.response?.data?.error) setStatus(error.response.data.error)
  }
};
