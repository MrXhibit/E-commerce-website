export interface OrderItem {
  productId: string;
  productName: string;
  productImage: string;
  brandName: string;
  modelName: string;
  price: number;
  quantity: number;
  subtotal: number;
}

export interface ShippingAddress {
  [x: string]: any;
  fullName: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone: string;
}

export interface PaymentInfo {
  method: 'cod' | 'online';
  paymentStatus: 'pending' | 'processing' | 'completed' | 'failed' | 'refunded';
  transactionId?: string;
  paymentIntentId?: string; // Add this field
  paymentDate?: Date;
}

export interface OrderSummary {
  subtotal: number;
  deliveryFee: number;
  serviceFee: number;
  tax: number;
  tip: number;
  credits: number;
  discountAmount: number;
  total: number;
}

export interface Order {
  _id?: string;
  orderId: string;
  userId: string;
  items: OrderItem[];
  orderSummary: OrderSummary;
  shippingAddress: ShippingAddress;
  deliveryMethod: 'delivery' | 'pickup';
  paymentInfo: PaymentInfo;
  orderStatus: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  appliedCoupon?: {
    code: string;
    discountAmount: number;
  };
  orderDate: Date;
  estimatedDeliveryDate?: Date;
  trackingNumber?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateOrderRequest {
  items: OrderItem[];
  shippingAddress: ShippingAddress;
  deliveryMethod: 'delivery' | 'pickup';
  paymentInfo: Omit<PaymentInfo, 'paymentDate'>;
  orderSummary: OrderSummary;
  appliedCoupon?: {
    code: string;
    discountAmount: number;
  };
  notes?: string;
}