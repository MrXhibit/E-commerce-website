/**
 * User Product Service
 * Handles all product fetching for user-side pages with real-time updates
 */

import apiService from './api';
import { filterProductsByCategory } from '../utils/categoryMapping';

class UserProductService {
  /**
   * Fetch all products for the main products page
   * @param {number} limit - Number of products to fetch
   * @param {number} skip - Number of products to skip
   * @returns {Promise<Array>} Array of normalized products
   */
  async getAllProducts(limit = 100, skip = 0) {
    try {
      const response = await apiService.getProducts(limit, skip);
      
      if (response.success && response.data) {
        return this.normalizeProducts(response.data);
      } else {
        throw new Error('Failed to fetch products from backend');
      }
    } catch (error) {
      console.error('Error fetching all products:', error);
      throw error;
    }
  }

  /**
   * Fetch products by category
   * @param {string} category - Category name or ID
   * @param {number} limit - Number of products to fetch
   * @param {number} skip - Number of products to skip
   * @returns {Promise<Array>} Array of normalized products for the category
   */
  async getProductsByCategory(category, limit = 100, skip = 0) {
    try {
      // First try to fetch with category filter
      const response = await apiService.getProducts(limit, skip, category);
      
      if (response.success && response.data) {
        // Use category mapping for additional filtering
        const filteredProducts = filterProductsByCategory(response.data, category);
        return this.normalizeProducts(filteredProducts);
      } else {
        throw new Error(`Failed to fetch products for category: ${category}`);
      }
    } catch (error) {
      console.error(`Error fetching products for category ${category}:`, error);
      throw error;
    }
  }

  /**
   * Fetch products for specific category pages (Electronics, Smartphones, etc.)
   * @param {string} categoryName - Category name (e.g., 'electronics', 'smartphones')
   * @param {Array} keywords - Additional keywords for filtering
   * @param {number} limit - Number of products to fetch
   * @returns {Promise<Array>} Array of normalized products
   */
  async getCategoryPageProducts(categoryName, keywords = [], limit = 100) {
    try {
      const response = await apiService.getProducts(limit, 0, categoryName);
      
      if (response.success && response.data) {
        // Filter by category and keywords
        const filteredProducts = response.data.filter(product => {
          const productCategory = product.category?.name || product.category;
          const matchesCategory = productCategory?.toLowerCase() === categoryName.toLowerCase();
          
          const matchesKeywords = keywords.length === 0 || keywords.some(keyword => 
            product.name?.toLowerCase().includes(keyword.toLowerCase()) ||
            product.description?.toLowerCase().includes(keyword.toLowerCase()) ||
            product.brandName?.toLowerCase().includes(keyword.toLowerCase())
          );
          
          return matchesCategory || matchesKeywords;
        });
        
        return this.normalizeProducts(filteredProducts);
      } else {
        throw new Error(`Failed to fetch products for ${categoryName}`);
      }
    } catch (error) {
      console.error(`Error fetching products for ${categoryName}:`, error);
      throw error;
    }
  }

  /**
   * Search products with filters
   * @param {Object} filters - Search filters
   * @returns {Promise<Array>} Array of normalized products
   */
  async searchProducts(filters = {}) {
    try {
      const response = await apiService.searchProducts(filters);
      
      if (response.success && response.data) {
        return this.normalizeProducts(response.data.products || response.data);
      } else {
        throw new Error('Failed to search products');
      }
    } catch (error) {
      console.error('Error searching products:', error);
      throw error;
    }
  }

  /**
   * Get product by ID
   * @param {string} productId - Product ID
   * @returns {Promise<Object>} Normalized product object
   */
  async getProductById(productId) {
    try {
      const response = await apiService.getProductById(productId);
      
      if (response.success && response.data) {
        return this.normalizeProduct(response.data);
      } else {
        throw new Error(`Failed to fetch product: ${productId}`);
      }
    } catch (error) {
      console.error(`Error fetching product ${productId}:`, error);
      throw error;
    }
  }

  /**
   * Normalize a single product to ensure consistent structure
   * @param {Object} product - Raw product data from API
   * @returns {Object} Normalized product object
   */
  normalizeProduct(product) {
    return {
      _id: product._id || product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      brand: product.brandName || product.brand,
      model: product.modelName || product.model,
      category: product.category?.name || product.category,
      categoryId: product.category?._id || product.categoryId,
      subcategory: product.subcategory,
      stock: product.stock || 0,
      images: product.images || [{ url: 'https://via.placeholder.com/300x200' }],
      isListed: product.isListed !== false,
      rating: product.rating || 0,
      reviews: product.reviews || [],
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
      // Additional fields for compatibility
      id: product._id || product.id,
      image: product.images?.[0]?.url || 'https://via.placeholder.com/300x200'
    };
  }

  /**
   * Normalize an array of products
   * @param {Array} products - Array of raw product data from API
   * @returns {Array} Array of normalized product objects
   */
  normalizeProducts(products) {
    return products.map(product => this.normalizeProduct(product));
  }

  /**
   * Listen for product updates and refresh data
   * @param {Function} refreshCallback - Callback function to refresh data
   * @returns {Function} Cleanup function to remove event listener
   */
  setupProductRefreshListener(refreshCallback) {
    const handleProductAdded = async (event) => {
      console.log('Product added event received in user service:', event.detail);
      try {
        await refreshCallback();
      } catch (error) {
        console.error('Error refreshing products after addition:', error);
      }
    };

    window.addEventListener('productAdded', handleProductAdded);
    window.addEventListener('globalProductRefresh', handleProductAdded);

    // Return cleanup function
    return () => {
      window.removeEventListener('productAdded', handleProductAdded);
      window.removeEventListener('globalProductRefresh', handleProductAdded);
    };
  }

  /**
   * Get category-specific product counts
   * @param {string} categoryName - Category name
   * @returns {Promise<number>} Number of products in category
   */
  async getCategoryProductCount(categoryName) {
    try {
      const products = await this.getProductsByCategory(categoryName, 1000, 0);
      return products.length;
    } catch (error) {
      console.error(`Error getting product count for ${categoryName}:`, error);
      return 0;
    }
  }

  /**
   * Get featured products for homepage
   * @param {number} limit - Number of featured products
   * @returns {Promise<Array>} Array of featured products
   */
  async getFeaturedProducts(limit = 8) {
    try {
      const response = await apiService.getProducts(limit, 0);
      
      if (response.success && response.data) {
        // Filter for featured products or take first N products
        const featuredProducts = response.data
          .filter(product => product.isListed !== false)
          .slice(0, limit);
        
        return this.normalizeProducts(featuredProducts);
      } else {
        throw new Error('Failed to fetch featured products');
      }
    } catch (error) {
      console.error('Error fetching featured products:', error);
      throw error;
    }
  }
}

// Create and export singleton instance
const userProductService = new UserProductService();
export default userProductService;
