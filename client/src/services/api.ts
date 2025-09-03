import { ApiResponse, Product, Cart, Wishlist, User, LoginCredentials, RegisterData } from '../types';

const API_BASE_URL = (import.meta as any).env?.VITE_API_BASE_URL || '/api/v1';

interface FailedRequest {
  resolve: (value: any) => void;
  reject: (error: any) => void;
}

class ApiService {
  private baseURL: string;
  private isRefreshing: boolean;
  private failedQueue: FailedRequest[];
  private refreshPromise: Promise<any> | null;

  constructor() {
    this.baseURL = API_BASE_URL;
    this.isRefreshing = false;
    this.failedQueue = [];
    this.refreshPromise = null;
  }

  // Helper method to get auth headers
  private getAuthHeaders(): Record<string, string> {
    const accessToken = localStorage.getItem('accessToken');
    return {
      'Content-Type': 'application/json',
      ...(accessToken && { 'Authorization': `Bearer ${accessToken}` })
    };
  }

  // Process failed requests queue
  private processQueue(error: any, token: string | null = null): void {
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
  private async handleResponse(response: Response, originalRequest: Request | null = null): Promise<any> {
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
        // Check if we have a refresh token before attempting refresh
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) {
          throw new Error('No refresh token available');
        }

        const refreshResult = await this.refreshToken();
        if (refreshResult.success && refreshResult.data?.accessToken) {
          // Store new access token
          localStorage.setItem('accessToken', refreshResult.data.accessToken);
          
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
        // Clear tokens and redirect to login
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        
        // Only redirect if we're not already on login page
        if (window.location.pathname !== '/login' && window.location.pathname !== '/signup') {
          window.location.href = '/login';
        }
        throw error;
      } finally {
        this.isRefreshing = false;
      }
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('API Error Response:', {
        status: response.status,
        statusText: response.statusText,
        url: response.url,
        data: errorData
      });
      throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
    }

    try {
      const data = await response.json();
      return {
        success: true,
        data: data
      };
    } catch (error) {
      console.error('Error parsing JSON response:', error);
      throw new Error('Invalid JSON response from server');
    }
  }

  // Enhanced fetch method with proper headers and error handling
  private async fetchWithAuth(url: string, options: RequestInit = {}): Promise<any> {
    const requestOptions: RequestInit = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...this.getAuthHeaders(),
        ...options.headers,
      },
      credentials: 'include', // Include cookies for authentication
    };

    console.log('Making API request to:', url, 'with options:', requestOptions);

    try {
      const response = await fetch(url, requestOptions);
      return await this.handleResponse(response, { url, ...requestOptions } as Request);
    } catch (error) {
      console.error('Fetch error:', error);
      throw error;
    }
  }

  // Auth methods
  async login(credentials: LoginCredentials): Promise<ApiResponse<{ user: User }>> {
    console.log('API Login - Request payload:', credentials);
    console.log('API Login - Request URL:', `${this.baseURL}/auth/login`);
    const response = await this.fetchWithAuth(`${this.baseURL}/auth/login`, {
      method: 'POST',
      body: JSON.stringify(credentials)
    });
    console.log('API Login - Response:', response);
    return response;
  }

  async register(userData: RegisterData): Promise<ApiResponse<{ user: User }>> {
    console.log('API Register - Request payload:', userData);
    console.log('API Register - Request URL:', `${this.baseURL}/auth/register`);
    const response = await this.fetchWithAuth(`${this.baseURL}/auth/register`, {
      method: 'POST',
      body: JSON.stringify(userData)
    });
    console.log('API Register - Response:', response);
    return response;
  }

  async logout(): Promise<ApiResponse<void>> {
    try {
      const response = await this.fetchWithAuth(`${this.baseURL}/auth/logout`, {
        method: 'POST'
      });
      return response;
    } catch (error) {
      // Even if logout fails on backend, clear local tokens
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      throw error;
    }
  }

  async refreshToken(): Promise<ApiResponse<{ accessToken: string; user?: User }>> {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    // If already refreshing, return the existing promise
    if (this.refreshPromise) {
      return this.refreshPromise;
    }

    this.refreshPromise = fetch(`${this.baseURL}/auth/refresh-token`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refreshToken })
    }).then(async (response) => {
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Token refresh failed');
      }
      const data = await response.json();
      return {
        success: true,
        data: data
      };
    }).finally(() => {
      this.refreshPromise = null;
    });

    return this.refreshPromise;
  }

  // User methods
  getCurrentUser(): User | null {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('accessToken');
  }

  // Product methods
  async getProducts(params?: string | Record<string, any>): Promise<ApiResponse<Product[]>> {
    let queryString = '';
    if (typeof params === 'string') {
      queryString = params;
    } else if (params) {
      queryString = `?${new URLSearchParams(params).toString()}`;
    }
    const url = `${this.baseURL}/product${queryString}`;
    console.log('API GetProducts - Request URL:', url);
    const response = await this.fetchWithAuth(url);
    console.log('API GetProducts - Response:', response);
    return response;
  }

  async getProductById(id: string): Promise<ApiResponse<Product>> {
    return this.fetchWithAuth(`${this.baseURL}/product/${id}`);
  }

  async getProductsByCategory(category: string, limit: number = 20): Promise<ApiResponse<Product[]>> {
    return this.fetchWithAuth(`${this.baseURL}/product?category=${category}&limit=${limit}`);
  }

  // Cart methods
  async getCart(): Promise<ApiResponse<Cart>> {
    return this.fetchWithAuth(`${this.baseURL}/cart`);
  }

  async addToCart(productId: string, quantity: number = 1): Promise<ApiResponse<Cart>> {
    return this.fetchWithAuth(`${this.baseURL}/cart`, {
      method: 'POST',
      body: JSON.stringify({ productId, quantity })
    });
  }

  async updateCartItem(productId: string, quantity: number): Promise<ApiResponse<Cart>> {
    return this.fetchWithAuth(`${this.baseURL}/cart/${productId}`, {
      method: 'PATCH',
      body: JSON.stringify({ quantity })
    });
  }

  async removeFromCart(productId: string): Promise<ApiResponse<Cart>> {
    return this.fetchWithAuth(`${this.baseURL}/cart/${productId}`, {
      method: 'DELETE'
    });
  }

  async clearCart(): Promise<ApiResponse<Cart>> {
    return this.fetchWithAuth(`${this.baseURL}/cart`, {
      method: 'DELETE'
    });
  }

  // Wishlist methods
  async getWishlist(): Promise<ApiResponse<Wishlist>> {
    return this.fetchWithAuth(`${this.baseURL}/wishlist`);
  }

  async addToWishlist(productId: string): Promise<ApiResponse<Wishlist>> {
    return this.fetchWithAuth(`${this.baseURL}/wishlist`, {
      method: 'POST',
      body: JSON.stringify({ productId })
    });
  }

  async removeFromWishlist(productId: string): Promise<ApiResponse<Wishlist>> {
    return this.fetchWithAuth(`${this.baseURL}/wishlist/${productId}`, {
      method: 'DELETE'
    });
  }

  async clearWishlist(): Promise<ApiResponse<Wishlist>> {
    return this.fetchWithAuth(`${this.baseURL}/wishlist`, {
      method: 'DELETE'
    });
  }

  // Order methods
  async createOrder(orderData: any): Promise<ApiResponse<any>> {
    return this.fetchWithAuth(`${this.baseURL}/order`, {
      method: 'POST',
      body: JSON.stringify(orderData)
    });
  }

  async getOrders(): Promise<ApiResponse<any[]>> {
    return this.fetchWithAuth(`${this.baseURL}/order`);
  }

  async getOrderById(id: string): Promise<ApiResponse<any>> {
    return this.fetchWithAuth(`${this.baseURL}/order/${id}`);
  }

  // Payment methods
  async createPaymentIntent(amount: number, currency: string = 'usd'): Promise<ApiResponse<any>> {
    return this.fetchWithAuth(`${this.baseURL}/payments/create-payment-intent`, {
      method: 'POST',
      body: JSON.stringify({ amount, currency })
    });
  }

  async confirmPayment(paymentIntentId: string): Promise<ApiResponse<any>> {
    return this.fetchWithAuth(`${this.baseURL}/payments/confirm`, {
      method: 'POST',
      body: JSON.stringify({ paymentIntentId })
    });
  }
}

const apiService = new ApiService();
export default apiService;
