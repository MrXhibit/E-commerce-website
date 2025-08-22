const API_BASE_URL = '/api/v1';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
    this.isRefreshing = false;
    this.failedQueue = [];
  }

  // Helper method to get auth headers
  getAuthHeaders() {
    const token = localStorage.getItem('accessToken');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` })
    };
  }

  // Process failed requests queue
  processQueue(error, token = null) {
    this.failedQueue.forEach(({ resolve, reject }) => {
      if (error) {
        reject(error);
      } else {
        resolve(token);
      }
    });
    
    this.failedQueue = [];
  }

  // Enhanced response handler with automatic token refresh
  async handleResponse(response, originalRequest = null) {
    if (response.status === 401 && originalRequest) {
      if (this.isRefreshing) {
        // If already refreshing, queue this request
        return new Promise((resolve, reject) => {
          this.failedQueue.push({ resolve, reject });
        }).then(() => {
          // Retry original request with new token
          return fetch(originalRequest.url, {
            ...originalRequest,
            headers: this.getAuthHeaders()
          }).then(this.handleResponse.bind(this));
        });
      }

      this.isRefreshing = true;

      try {
        const refreshResult = await this.refreshToken();
        if (refreshResult.success) {
          this.processQueue(null, refreshResult.data.accessToken);
          
          // Retry original request with new token
          const retryResponse = await fetch(originalRequest.url, {
            ...originalRequest,
            headers: this.getAuthHeaders()
          });
          
          return this.handleResponse(retryResponse);
        } else {
          throw new Error('Token refresh failed');
        }
      } catch (error) {
        this.processQueue(error, null);
        // Redirect to login
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        window.location.href = '/login';
        throw error;
      } finally {
        this.isRefreshing = false;
      }
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }
    return response.json();
  }

  // Enhanced fetch method with retry capability
  // Enhanced fetch method with credentials
  async fetchWithAuth(url, options = {}) {
    const requestOptions = {
      ...options,
      credentials: 'include', // Include cookies
      headers: {
        ...this.getAuthHeaders(),
        ...options.headers
      }
    };
  
    const response = await fetch(url, requestOptions);
    return this.handleResponse(response, { url, ...requestOptions });
  }
  
  // Fix login method
  async login(credentials) {
    const response = await fetch(`${this.baseURL}/auth/login`, {
      method: 'POST',
      credentials: 'include', // Include cookies
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
      credentials: 'include', // include cookies set by server
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

  // Updated refresh token method
  async refreshToken() {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await fetch(`${this.baseURL}/auth/refresh-token`, {
      method: 'POST',
      credentials: 'include', // Send cookies instead of body
      headers: {
        'Content-Type': 'application/json',
      },
      // Remove body since backend expects cookies
    });
    
    const data = await this.handleResponse(response);
    if (data.success && data.data?.accessToken) {
      localStorage.setItem('accessToken', data.data.accessToken);
      localStorage.setItem('refreshToken', data.data.refreshToken);
    }
    return data;
  }

  // Cart APIs - Updated to use fetchWithAuth
  async getCart() {
    return this.fetchWithAuth(`${this.baseURL}/cart`);
  }

  async addToCart(productId, quantity = 1) {
    return this.fetchWithAuth(`${this.baseURL}/cart/add`, {
      method: 'POST',
      body: JSON.stringify({ productId, quantity }),
    });
  }

  async updateCartItem(productId, quantity) {
    return this.fetchWithAuth(`${this.baseURL}/cart/update`, {
      method: 'PUT',
      body: JSON.stringify({ productId, quantity }),
    });
  }

  async removeFromCart(productId) {
    return this.fetchWithAuth(`${this.baseURL}/cart/remove/${productId}`, {
      method: 'DELETE',
    });
  }

  async clearCart() {
    return this.fetchWithAuth(`${this.baseURL}/cart/clear`, {
      method: 'DELETE',
    });
  }

  // Wishlist APIs - Updated to use fetchWithAuth
  async getWishlist() {
    return this.fetchWithAuth(`${this.baseURL}/wishlist`);
  }

  async addToWishlist(productId) {
    return this.fetchWithAuth(`${this.baseURL}/wishlist/add`, {
      method: 'POST',
      body: JSON.stringify({ productId }),
    });
  }

  async removeFromWishlist(productId) {
    return this.fetchWithAuth(`${this.baseURL}/wishlist/remove/${productId}`, {
      method: 'DELETE',
    });
  }

  async clearWishlist() {
    return this.fetchWithAuth(`${this.baseURL}/wishlist/clear`, {
      method: 'DELETE',
    });
  }

  // Fixed Product APIs - Align with backend /product routes
  async getProducts(limit = 20, skip = 0) {
    try {
      const response = await fetch(`${this.baseURL}/product?limit=${limit}&skip=${skip}`, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  }

  async getProductById(productId) {
    try {
      const response = await fetch(`${this.baseURL}/products/${productId}`, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching product:', error);
      throw error;
    }
  }

  // Fixed Search API - Align with backend /product/search
  async searchProducts(filters = {}) {
    try {
      const queryParams = new URLSearchParams();
      
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          queryParams.append(key, value.toString());
        }
      });

      const response = await fetch(`${this.baseURL}/product/search?${queryParams.toString()}`, {
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

  // Fixed Category APIs - Align with backend /category routes
  async getCategories(limit = 20, page = 1) {
    try {
      const response = await fetch(`${this.baseURL}/category?limit=${limit}&page=${page}`, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  }

  async getCategoryById(categoryId) {
    try {
      const response = await fetch(`${this.baseURL}/category/${categoryId}`, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching category:', error);
      throw error;
    }
  }

  // Order APIs - Align with backend /orders routes
  async createOrder(orderData) {
    return this.fetchWithAuth(`${this.baseURL}/orders`, {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
  }

  async getUserOrders() {
    return this.fetchWithAuth(`${this.baseURL}/orders`);
  }

  async getOrderById(orderId) {
    return this.fetchWithAuth(`${this.baseURL}/orders/${orderId}`);
  }

  async updateOrderStatus(orderId, status) {
    return this.fetchWithAuth(`${this.baseURL}/orders/${orderId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  }

  async getOrderInvoice(orderId) {
    return this.fetchWithAuth(`${this.baseURL}/orders/${orderId}/invoice`);
  }

  // Payment APIs - Align with backend /payments routes
  async createPaymentIntent(amount, currency = 'usd', orderId) {
    return this.fetchWithAuth(`${this.baseURL}/payments/create-payment-intent`, {
      method: 'POST',
      body: JSON.stringify({ amount, currency, orderId }),
    });
  }

  async confirmPayment(paymentIntentId) {
    return this.fetchWithAuth(`${this.baseURL}/payments/confirm-payment`, {
      method: 'POST',
      body: JSON.stringify({ paymentIntentId }),
    });
  }

  async createCheckoutSession(orderData) {
    return this.fetchWithAuth(`${this.baseURL}/payments/create-checkout-session`, {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
  }

  // Coupon APIs - Align with backend /coupons routes
  async getActiveCoupons() {
    try {
      const response = await fetch(`${this.baseURL}/coupons/active`, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching active coupons:', error);
      throw error;
    }
  }

  async validateCoupon(couponCode) {
    return this.fetchWithAuth(`${this.baseURL}/coupons/validate?code=${couponCode}`);
  }

  // Utility methods
  isAuthenticated() {
    return !!localStorage.getItem('accessToken');
  }

  getCurrentUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  // User Profile APIs
  async updateUserProfile(profileData) {
    return this.fetchWithAuth(`${this.baseURL}/user/profile`, {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  }

  async getUserProfile() {
    return this.fetchWithAuth(`${this.baseURL}/user/profile`);
  }

  // Profile Image APIs
  async uploadProfileImage(formData) {
    return this.fetchWithAuth(`${this.baseURL}/user/profile/image`, {
      method: 'POST',
      headers: {
        // Don't set Content-Type for FormData, let browser set it
        ...this.getAuthHeaders(),
        'Content-Type': undefined
      },
      body: formData,
    });
  }

  async removeProfileImage() {
    return this.fetchWithAuth(`${this.baseURL}/user/profile/image`, {
      method: 'DELETE',
    });
  }
}

export default new ApiService();