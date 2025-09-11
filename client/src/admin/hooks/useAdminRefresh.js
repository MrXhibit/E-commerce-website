/**
 * Custom hook for admin-side data refresh
 * Handles refreshing of products, categories, and other admin data
 */

import { useCallback } from 'react';
import { axiosInstance } from '../utills/axios.instance';
import { categoryService } from '../services/category.service';

export const useAdminRefresh = () => {
  /**
   * Refresh products list
   * @returns {Promise<Array>} Refreshed products array
   */
  const refreshProducts = useCallback(async () => {
    try {
      const response = await axiosInstance.get('/product?limit=50&skip=0');
      
      if (response.data?.data) {
        // Transform backend data to match frontend format
        const transformedProducts = response.data.data.map((product) => ({
          id: product._id || product.id,
          name: product.name,
          image: product.images?.[0]?.url || 'https://via.placeholder.com/40',
          price: product.price,
          category: product.category?.name || product.category || 'Uncategorized',
          brand: product.brandName || product.brand,
          model: product.modelName || product.model,
          stock: product.stock || 0,
          status: product.isListed ? 'Active' : 'Inactive',
          views: Math.floor(Math.random() * 20000), // Mock views for now
          products: product.stock || 0
        }));
        
        console.log(`Refreshed ${transformedProducts.length} products`);
        return transformedProducts;
      }
      
      return [];
    } catch (error) {
      console.error('Error refreshing products:', error);
      throw error;
    }
  }, []);

  /**
   * Refresh categories with product counts
   * @returns {Promise<Array>} Refreshed categories array
   */
  const refreshCategories = useCallback(async () => {
    try {
      const categoriesWithCounts = await categoryService.getCategoriesWithProductCounts();
      
      if (categoriesWithCounts.length > 0) {
        const transformedCategories = categoriesWithCounts.map(category => 
          categoryService.transformCategoryForDisplay(category)
        );
        
        console.log(`Refreshed ${transformedCategories.length} categories`);
        return transformedCategories;
      }
      
      return [];
    } catch (error) {
      console.error('Error refreshing categories:', error);
      throw error;
    }
  }, []);

  /**
   * Refresh all admin data (products and categories)
   * @returns {Promise<Object>} Object containing refreshed products and categories
   */
  const refreshAllData = useCallback(async () => {
    try {
      const [products, categories] = await Promise.all([
        refreshProducts(),
        refreshCategories()
      ]);
      
      console.log('Refreshed all admin data:', { products: products.length, categories: categories.length });
      return { products, categories };
    } catch (error) {
      console.error('Error refreshing all admin data:', error);
      throw error;
    }
  }, [refreshProducts, refreshCategories]);

  /**
   * Refresh data for a specific category
   * @param {string} categoryId - Category ID
   * @returns {Promise<Object>} Object containing category and its products
   */
  const refreshCategoryData = useCallback(async (categoryId) => {
    try {
      const [category, products] = await Promise.all([
        categoryService.getCategoryById(categoryId),
        categoryService.getProductsByCategory(categoryId)
      ]);
      
      console.log(`Refreshed data for category ${categoryId}:`, { 
        category: category?.name, 
        products: products.length 
      });
      
      return { category, products };
    } catch (error) {
      console.error('Error refreshing category data:', error);
      throw error;
    }
  }, []);

  return {
    refreshProducts,
    refreshCategories,
    refreshAllData,
    refreshCategoryData
  };
};
