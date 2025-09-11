/**
 * Custom hook to handle product data refresh
 * This ensures that when admin adds new products, the user side gets updated data
 */

import { useState, useCallback } from 'react';
import apiService from '../services/api';
import { filterProductsByCategory } from '../utils/categoryMapping';

export const useProductRefresh = () => {
  const [refreshing, setRefreshing] = useState(false);

  /**
   * Refresh products for a specific category
   * @param {string} category - Category to refresh (optional)
   * @param {number} limit - Number of products to fetch
   * @param {number} skip - Number of products to skip
   * @returns {Promise<Array>} - Refreshed products array
   */
  const refreshProducts = useCallback(async (category = '', limit = 50, skip = 0) => {
    setRefreshing(true);
    try {
      const response = await apiService.getProducts(limit, skip, category);
      
      if (response.success && response.data) {
        if (category) {
          // Filter products by category if specified
          return filterProductsByCategory(response.data, category);
        }
        return response.data;
      } else {
        throw new Error('Failed to fetch products');
      }
    } catch (error) {
      console.error('Error refreshing products:', error);
      throw error;
    } finally {
      setRefreshing(false);
    }
  }, []);

  /**
   * Refresh all products without category filter
   * @param {number} limit - Number of products to fetch
   * @param {number} skip - Number of products to skip
   * @returns {Promise<Array>} - Refreshed products array
   */
  const refreshAllProducts = useCallback(async (limit = 50, skip = 0) => {
    return refreshProducts('', limit, skip);
  }, [refreshProducts]);

  /**
   * Refresh products for electronics category
   * @param {number} limit - Number of products to fetch
   * @param {number} skip - Number of products to skip
   * @returns {Promise<Array>} - Refreshed electronics products
   */
  const refreshElectronicsProducts = useCallback(async (limit = 50, skip = 0) => {
    return refreshProducts('electronics', limit, skip);
  }, [refreshProducts]);

  /**
   * Refresh products for smartphones category
   * @param {number} limit - Number of products to fetch
   * @param {number} skip - Number of products to skip
   * @returns {Promise<Array>} - Refreshed smartphone products
   */
  const refreshSmartphoneProducts = useCallback(async (limit = 50, skip = 0) => {
    return refreshProducts('smartphones', limit, skip);
  }, [refreshProducts]);

  /**
   * Refresh products for fashion category
   * @param {number} limit - Number of products to fetch
   * @param {number} skip - Number of products to skip
   * @returns {Promise<Array>} - Refreshed fashion products
   */
  const refreshFashionProducts = useCallback(async (limit = 50, skip = 0) => {
    return refreshProducts('fashion', limit, skip);
  }, [refreshProducts]);

  /**
   * Refresh products for home & kitchen category
   * @param {number} limit - Number of products to fetch
   * @param {number} skip - Number of products to skip
   * @returns {Promise<Array>} - Refreshed home & kitchen products
   */
  const refreshHomeKitchenProducts = useCallback(async (limit = 50, skip = 0) => {
    return refreshProducts('home-kitchen', limit, skip);
  }, [refreshProducts]);

  /**
   * Refresh products for books category
   * @param {number} limit - Number of products to fetch
   * @param {number} skip - Number of products to skip
   * @returns {Promise<Array>} - Refreshed books products
   */
  const refreshBooksProducts = useCallback(async (limit = 50, skip = 0) => {
    return refreshProducts('books', limit, skip);
  }, [refreshProducts]);

  /**
   * Refresh products for sports category
   * @param {number} limit - Number of products to fetch
   * @param {number} skip - Number of products to skip
   * @returns {Promise<Array>} - Refreshed sports products
   */
  const refreshSportsProducts = useCallback(async (limit = 50, skip = 0) => {
    return refreshProducts('sports', limit, skip);
  }, [refreshProducts]);

  return {
    refreshing,
    refreshProducts,
    refreshAllProducts,
    refreshElectronicsProducts,
    refreshSmartphoneProducts,
    refreshFashionProducts,
    refreshHomeKitchenProducts,
    refreshBooksProducts,
    refreshSportsProducts
  };
};
