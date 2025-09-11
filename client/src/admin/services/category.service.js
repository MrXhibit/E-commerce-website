/**
 * Category service for admin operations
 * Handles category-related API calls and data transformations
 */

import { axiosInstance } from '../utills/axios.instance';

export const categoryService = {
  /**
   * Fetch all categories with product counts
   * @returns {Promise<Array>} Array of categories with product counts
   */
  async getCategoriesWithProductCounts() {
    try {
      const response = await axiosInstance.get('/category?limit=100&page=1');
      
      if (response.data?.data) {
        // For each category, fetch the product count
        const categoriesWithCounts = await Promise.all(
          response.data.data.map(async (category) => {
            try {
              // Fetch products for this category
              const productsResponse = await axiosInstance.get(`/product?category=${category._id}&limit=1&skip=0`);
              const productCount = productsResponse.data?.total || productsResponse.data?.data?.length || 0;
              
              return {
                ...category,
                productsCount: productCount
              };
            } catch (error) {
              console.error(`Error fetching product count for category ${category.name}:`, error);
              return {
                ...category,
                productsCount: 0
              };
            }
          })
        );
        
        return categoriesWithCounts;
      }
      
      return [];
    } catch (error) {
      console.error('Error fetching categories with product counts:', error);
      throw error;
    }
  },

  /**
   * Get category by ID
   * @param {string} categoryId - Category ID
   * @returns {Promise<Object>} Category object
   */
  async getCategoryById(categoryId) {
    try {
      const response = await axiosInstance.get(`/category/${categoryId}`);
      return response.data?.data || response.data;
    } catch (error) {
      console.error('Error fetching category by ID:', error);
      throw error;
    }
  },

  /**
   * Get products by category ID
   * @param {string} categoryId - Category ID
   * @param {number} limit - Number of products to fetch
   * @param {number} skip - Number of products to skip
   * @returns {Promise<Array>} Array of products
   */
  async getProductsByCategory(categoryId, limit = 50, skip = 0) {
    try {
      const response = await axiosInstance.get(`/product?category=${categoryId}&limit=${limit}&skip=${skip}`);
      return response.data?.data || [];
    } catch (error) {
      console.error('Error fetching products by category:', error);
      throw error;
    }
  },

  /**
   * Transform category data for frontend display
   * @param {Object} category - Raw category data from API
   * @returns {Object} Transformed category data
   */
  transformCategoryForDisplay(category) {
    return {
      id: category._id || category.id,
      name: category.name,
      image: { url: category.image?.url || 'https://via.placeholder.com/40' },
      parent: category.parentId ? 'Parent Category' : null,
      productsCount: category.productsCount || 0,
      status: category.isListed ? 'Active' : 'Inactive',
      type: category.parentId ? 'Sub Category' : 'Main Category',
      level: category.level || 0,
      ancestors: category.ancestors || []
    };
  }
};