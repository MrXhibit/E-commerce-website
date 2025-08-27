// Product types
export interface Product {
  _id: string;
  id?: string; // For compatibility with different API responses
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: string;
  images: string[];
  stock: number;
  rating: number;
  numReviews: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Cart types
export interface CartItem {
  _id: string;
  productId: string;
  quantity: number;
  price: number;
  name: string;
  image: string;
}

export interface Cart {
  items: CartItem[];
  totalAmount: number;
  itemCount: number;
}

// User types
export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'user' | 'admin';
  profilePicture?: string;
  isEmailVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

// Auth types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

// Order types
export interface OrderItem {
  productId: string;
  quantity: number;
  price: number;
  name: string;
  image: string;
}

export interface Order {
  _id: string;
  user: string | User;
  items: OrderItem[];
  totalAmount: number;
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  paymentInfo: {
    method: 'cod' | 'online';
    paymentStatus: 'pending' | 'processing' | 'completed' | 'failed' | 'refunded';
    transactionId?: string;
  };
  orderStatus: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: string;
  updatedAt: string;
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data: T;
  error?: string;
}

// Wishlist types
export interface WishlistItem {
  _id: string;
  productId: string;
  name: string;
  price: number;
  image: string;
}

export interface Wishlist {
  items: WishlistItem[];
  itemCount: number;
}

// Category types
export interface Category {
  _id: string;
  name: string;
  description?: string;
  image?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Coupon types
export interface Coupon {
  _id: string;
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minPurchase: number;
  maxDiscount?: number;
  validFrom: string;
  validUntil: string;
  usageLimit: number;
  usedCount: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
