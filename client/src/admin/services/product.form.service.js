import { axiosInstance } from "../utills/axios.instance";
import { axiosStartLoadingFunction,axiosStopLoadingFunction } from "../utills/axios.delete.admin"

export const addProductFormSubmit = async (values, { setStatus }) => {
  axiosStartLoadingFunction()
  try {
    const formData = new FormData();
    console.log('Adding product with values:', values);
    const { name, description, price, categoryPath, brand, model, stock, images } = values;
    const finalCategoryId = categoryPath[values.categoryPath.length - 1]?.id;
    const finalCategoryName = categoryPath[values.categoryPath.length - 1]?.name;

    // Validate required fields
    if (!finalCategoryId) {
      throw new Error('Please select a category');
    }

    formData.append("name", name);
    formData.append("price", price);
    formData.append("category", finalCategoryId);
    formData.append("brand", brand);
    formData.append("description", description);
    formData.append("model", model);
    formData.append("stock", stock);
    images.forEach((image) => {
      formData.append("images", image);
    });

    console.log('Submitting product to backend with category:', finalCategoryName);
    const response = await axiosInstance.post('/product', formData);
    
    if (response.data?.product) {
      console.log('Product successfully added:', response.data.product);
      setStatus({
        type: "success", 
        message: `Product "${name}" has been successfully added to the ${finalCategoryName} category and is now visible to users!`
      });
      
      // Trigger a custom event for real-time updates across admin pages
      window.dispatchEvent(new CustomEvent('productAdded', {
        detail: {
          product: response.data.product,
          category: finalCategoryName,
          categoryId: finalCategoryId,
          timestamp: new Date().toISOString()
        }
      }));
      
      // Optional: Navigate to products list after successful addition
      // This can be uncommented if you want automatic navigation
      // setTimeout(() => {
      //   window.location.href = '/admin/products';
      // }, 2000);
      
    } else {
      throw new Error('Product was not created successfully');
    }

  } catch (error) {
    console.error('Error adding product:', error);
    if (error?.response?.data?.error) {
      setStatus({type:"error", message: error.response.data.error});
    } else if (error.message) {
      setStatus({type:"error", message: error.message});
    } else {
      setStatus({type:"error", message: "Failed to add product. Please try again."});
    }
  } finally {
    axiosStopLoadingFunction()
  }
};
