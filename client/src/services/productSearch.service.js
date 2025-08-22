import apiService from './api';

class ProductSearchService {
  async searchProducts(filters = {}) {
    try {
      const queryParams = new URLSearchParams();
      
      // Add all filter parameters
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          // Handle boolean values properly
          if (typeof value === 'boolean') {
            queryParams.append(key, value.toString());
          } else {
            queryParams.append(key, value.toString());
          }
        }
      });

      // Fixed: Use /product/search instead of /products/search
      const response = await fetch(`/api/v1/product/search?${queryParams.toString()}`, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Search products error:', error);
      throw error;
    }
  }

  async getProducts(limit = 20, skip = 0, category = '') {
    try {
      const queryParams = new URLSearchParams();
      queryParams.append('limit', limit.toString());
      queryParams.append('skip', skip.toString());
      if (category) queryParams.append('category', category);

      // Fixed: Use /product instead of /products
      const response = await fetch(`/api/v1/product?${queryParams.toString()}`, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Get products error:', error);
      throw error;
    }
  }

  async getCategories() {
    try {
      // Fixed: Use /category instead of /categories
      const response = await fetch('/api/v1/category', {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Get categories error:', error);
      throw error;
    }
  }
}

export default new ProductSearchService();