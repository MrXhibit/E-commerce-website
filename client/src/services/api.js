const API_BASE_URL = 'http://localhost:5000/api/v1';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  // Helper method to get auth headers
  getAuthHeaders() {
    const token = localStorage.getItem('accessToken');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` })
    };
  }

  // Helper method to handle API responses
  async handleResponse(response) {
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }
    return response.json();
  }

  // Authentication APIs
  async login(credentials) {
    const response = await fetch(`${this.baseURL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });
    const data = await this.handleResponse(response);
    if (data.success && data.data?.accessToken) {
      localStorage.setItem('accessToken', data.data.accessToken);
      localStorage.setItem('refreshToken', data.data.refreshToken);
      localStorage.setItem('user', JSON.stringify(data.data.user));
    }
    return data;
  }

  async register(userData) {
    const response = await fetch(`${this.baseURL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });
    const data = await this.handleResponse(response);
    if (data.success && data.data?.accessToken) {
      localStorage.setItem('accessToken', data.data.accessToken);
      localStorage.setItem('refreshToken', data.data.refreshToken);
      localStorage.setItem('user', JSON.stringify(data.data.user));
    }
    return data;
  }

  async logout() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
  }

  // Product APIs
  async getProducts(limit = 20, skip = 0) {
    const response = await fetch(`${this.baseURL}/product?limit=${limit}&skip=${skip}`, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse(response);
  }

  async getProductById(productId) {
    const response = await fetch(`${this.baseURL}/product/${productId}`, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse(response);
  }

  // Category APIs
  async getCategories(limit = 20, page = 1) {
    const response = await fetch(`${this.baseURL}/category?limit=${limit}&page=${page}`, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse(response);
  }

  async getProductsByCategory(categoryId, limit = 20) {
    const response = await fetch(`${this.baseURL}/product?category=${categoryId}&limit=${limit}`, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse(response);
  }

  // Cart APIs
  async getCart() {
    const response = await fetch(`${this.baseURL}/cart`, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse(response);
  }

  async addToCart(productId, quantity = 1) {
    const response = await fetch(`${this.baseURL}/cart/add`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ productId, quantity }),
    });
    return this.handleResponse(response);
  }

  async updateCartItem(productId, quantity) {
    const response = await fetch(`${this.baseURL}/cart/update`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ productId, quantity }),
    });
    return this.handleResponse(response);
  }

  async removeFromCart(productId) {
    const response = await fetch(`${this.baseURL}/cart/remove/${productId}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse(response);
  }

  async clearCart() {
    const response = await fetch(`${this.baseURL}/cart/clear`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse(response);
  }

  // Wishlist APIs
  async getWishlist() {
    const response = await fetch(`${this.baseURL}/wishlist`, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse(response);
  }

  async addToWishlist(productId) {
    const response = await fetch(`${this.baseURL}/wishlist/add`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ productId }),
    });
    return this.handleResponse(response);
  }

  async removeFromWishlist(productId) {
    const response = await fetch(`${this.baseURL}/wishlist/remove/${productId}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse(response);
  }

  async clearWishlist() {
    const response = await fetch(`${this.baseURL}/wishlist/clear`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse(response);
  }

  // Utility methods
  isAuthenticated() {
    return !!localStorage.getItem('accessToken');
  }

  getCurrentUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  // Refresh token method (for future use)
  async refreshToken() {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await fetch(`${this.baseURL}/auth/refresh-token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refreshToken }),
    });
    const data = await this.handleResponse(response);
    if (data.success && data.data?.accessToken) {
      localStorage.setItem('accessToken', data.data.accessToken);
      localStorage.setItem('refreshToken', data.data.refreshToken);
    }
    return data;
  }
}

export default new ApiService(); 