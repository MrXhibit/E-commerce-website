import { ApiResponse, Product, Cart, Wishlist, User, LoginCredentials, RegisterData } from '../types';

const API_BASE_URL = '/api/v1';

interface FailedRequest {
  resolve: (value: any) => void;
  reject: (error: any) => void;
}

class ApiService {
  private baseURL: string;
  private isRefreshing: boolean;
  private failedQueue: FailedRequest[];

  constructor() {
    this.baseURL = API_BASE_URL;
    this.isRefreshing = false;
    this.failedQueue = [];
  }

  // Helper method to get auth headers
  private getAuthHeaders(): Record<string, string> {
    const token = localStorage.getItem('accessToken');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` })
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
  private async fetchWithAuth(url: string, options: RequestInit = {}): Promise<any> {
    const requestOptions: RequestInit = {
      ...options,
      credentials: 'include', // Include cookies
      headers: {
        ...this.getAuthHeaders(),
        ...options.headers
      }
    };
  
    const response = await fetch(url, requestOptions);
    return this.handleResponse(response, { url, ...requestOptions } as Request);
  }

  // Auth methods
  async login(credentials: LoginCredentials): Promise<ApiResponse<{ user: User; accessToken: string }>> {
    return this.fetchWithAuth(`${this.baseURL}/users/login`, {
      method: 'POST',
      body: JSON.stringify(credentials)
    });
  }

  async register(userData: RegisterData): Promise<ApiResponse<{ user: User; accessToken: string }>> {
    return this.fetchWithAuth(`${this.baseURL}/users/register`, {
      method: 'POST',
      body: JSON.stringify(userData)
    });
  }

  async logout(): Promise<ApiResponse<void>> {
    return this.fetchWithAuth(`${this.baseURL}/users/logout`, {
      method: 'POST'
    });
  }

  async refreshToken(): Promise<ApiResponse<{ accessToken: string }>> {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    return this.fetchWithAuth(`${this.baseURL}/users/refresh-token`, {
      method: 'POST',
      body: JSON.stringify({ refreshToken })
    });
  }

  // User methods
  getCurrentUser(): User | null {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }

  isAuthenticated(): boolean {
    const token = localStorage.getItem('accessToken');
    return !!token;
  }

  // Product methods
  async getProducts(params?: string | Record<string, any>): Promise<ApiResponse<Product[]>> {
    let queryString = '';
    if (typeof params === 'string') {
      queryString = params;
    } else if (params) {
      queryString = `?${new URLSearchParams(params).toString()}`;
    }
    return this.fetchWithAuth(`${this.baseURL}/products${queryString}`);
  }

  async getProductById(id: string): Promise<ApiResponse<Product>> {
    return this.fetchWithAuth(`${this.baseURL}/products/${id}`);
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
    return this.fetchWithAuth(`${this.baseURL}/orders`, {
      method: 'POST',
      body: JSON.stringify(orderData)
    });
  }

  async getOrders(): Promise<ApiResponse<any[]>> {
    return this.fetchWithAuth(`${this.baseURL}/orders`);
  }

  async getOrderById(id: string): Promise<ApiResponse<any>> {
    return this.fetchWithAuth(`${this.baseURL}/orders/${id}`);
  }

  // Payment methods
  async createPaymentIntent(amount: number, currency: string = 'usd'): Promise<ApiResponse<any>> {
    return this.fetchWithAuth(`${this.baseURL}/payment/create-payment-intent`, {
      method: 'POST',
      body: JSON.stringify({ amount, currency })
    });
  }

  async confirmPayment(paymentIntentId: string): Promise<ApiResponse<any>> {
    return this.fetchWithAuth(`${this.baseURL}/payment/confirm`, {
      method: 'POST',
      body: JSON.stringify({ paymentIntentId })
    });
  }
}

const apiService = new ApiService();
export default apiService;
