import { Product } from '@/types';

export interface SearchFilters {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  rating?: number;
  inStock?: boolean;
}

export interface SearchParams {
  query?: string;
  filters?: SearchFilters;
  sortBy?: 'price' | 'rating' | 'name' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface SearchResult {
  products: Product[];
  total: number;
  page: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

class ProductSearchService {
  private baseURL: string;

  constructor() {
    this.baseURL = '/api/v1';
  }

  // Search products with filters and pagination
  async searchProducts(params: SearchParams = {}): Promise<SearchResult> {
    try {
      const queryParams = new URLSearchParams();
      
      if (params.query) queryParams.append('q', params.query);
      if (params.filters?.category) queryParams.append('category', params.filters.category);
      if (params.filters?.minPrice) queryParams.append('minPrice', params.filters.minPrice.toString());
      if (params.filters?.maxPrice) queryParams.append('maxPrice', params.filters.maxPrice.toString());
      if (params.filters?.rating) queryParams.append('rating', params.filters.rating.toString());
      if (params.filters?.inStock) queryParams.append('inStock', params.filters.inStock.toString());
      if (params.sortBy) queryParams.append('sortBy', params.sortBy);
      if (params.sortOrder) queryParams.append('sortOrder', params.sortOrder);
      if (params.page) queryParams.append('page', params.page.toString());
      if (params.limit) queryParams.append('limit', params.limit.toString());

      const response = await fetch(`${this.baseURL}/products/search?${queryParams.toString()}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error(`Search failed: ${response.statusText}`);
      }

      const data = await response.json();
      return data.data || data;
    } catch (error) {
      console.error('Product search error:', error);
      throw error;
    }
  }

  // Get products by category
  async getProductsByCategory(category: string, params: SearchParams = {}): Promise<SearchResult> {
    return this.searchProducts({
      ...params,
      filters: { ...params.filters, category }
    });
  }

  // Get featured products
  async getFeaturedProducts(limit: number = 8): Promise<Product[]> {
    try {
      const response = await fetch(`${this.baseURL}/products/featured?limit=${limit}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch featured products: ${response.statusText}`);
      }

      const data = await response.json();
      return data.data || data;
    } catch (error) {
      console.error('Featured products error:', error);
      throw error;
    }
  }

  // Get trending products
  async getTrendingProducts(limit: number = 6): Promise<Product[]> {
    try {
      const response = await fetch(`${this.baseURL}/products/trending?limit=${limit}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch trending products: ${response.statusText}`);
      }

      const data = await response.json();
      return data.data || data;
    } catch (error) {
      console.error('Trending products error:', error);
      throw error;
    }
  }

  // Get related products
  async getRelatedProducts(productId: string, limit: number = 4): Promise<Product[]> {
    try {
      const response = await fetch(`${this.baseURL}/products/${productId}/related?limit=${limit}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch related products: ${response.statusText}`);
      }

      const data = await response.json();
      return data.data || data;
    } catch (error) {
      console.error('Related products error:', error);
      throw error;
    }
  }

  // Get product suggestions (for search autocomplete)
  async getProductSuggestions(query: string, limit: number = 5): Promise<string[]> {
    try {
      const response = await fetch(`${this.baseURL}/products/suggestions?q=${encodeURIComponent(query)}&limit=${limit}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch suggestions: ${response.statusText}`);
      }

      const data = await response.json();
      return data.data || data;
    } catch (error) {
      console.error('Product suggestions error:', error);
      return [];
    }
  }

  // Get available categories
  async getCategories(): Promise<{ _id: string; name: string; productCount: number }[]> {
    try {
      const response = await fetch(`${this.baseURL}/categories`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch categories: ${response.statusText}`);
      }

      const data = await response.json();
      return data.data || data;
    } catch (error) {
      console.error('Categories error:', error);
      throw error;
    }
  }

  // Get price range for filters
  async getPriceRange(): Promise<{ min: number; max: number }> {
    try {
      const response = await fetch(`${this.baseURL}/products/price-range`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch price range: ${response.statusText}`);
      }

      const data = await response.json();
      return data.data || data;
    } catch (error) {
      console.error('Price range error:', error);
      return { min: 0, max: 1000 };
    }
  }
}

const productSearchService = new ProductSearchService();
export default productSearchService;
