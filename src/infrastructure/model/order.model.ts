import mongoose, { Schema, Document } from 'mongoose';
import { Order } from '../../domain/entities/order';


const OrderItemSchema = new Schema({
  productId: { type: String, required: true },
  productName: { type: String, required: true },
  productImage: { type: String, required: true },
  brandName: { type: String, required: true },
  modelName: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true, min: 1 },
  subtotal: { type: Number, required: true }
});

const ShippingAddressSchema = new Schema({
  fullName: { type: String, required: true },
  addressLine1: { type: String, required: true },
  addressLine2: { type: String },
  city: { type: String, required: true },
  state: { type: String, required: true },
  zipCode: { type: String, required: true },
  country: { type: String, required: true, default: 'US' },
  phone: { type: String, required: true }
});

const PaymentInfoSchema = new Schema({
  method: { 
    type: String, 
    required: true, 
    enum: ['credit_card', 'debit_card', 'paypal', 'stripe'] 
  },
  transactionId: { type: String, required: true },
  paymentStatus: { 
    type: String, 
    required: true, 
    enum: ['pending', 'completed', 'failed', 'refunded'],
    default: 'pending'
  },
  amount: { type: Number, required: true },
  currency: { type: String, required: true, default: 'USD' },
  paymentDate: { type: Date, required: true }
});

const OrderSummarySchema = new Schema({
  subtotal: { type: Number, required: true },
  deliveryFee: { type: Number, required: true, default: 0 },
  serviceFee: { type: Number, required: true, default: 0 },
  tax: { type: Number, required: true, default: 0 },
  tip: { type: Number, required: true, default: 0 },
  credits: { type: Number, required: true, default: 0 },
  discountAmount: { type: Number, required: true, default: 0 },
  total: { type: Number, required: true }
});

const OrderSchema = new Schema<Order & Document>({
  orderId: { 
    type: String, 
    required: true, 
    unique: true,
    default: () => `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`
  },
  userId: { type: String, required: true, index: true },
  items: [OrderItemSchema],
  orderSummary: OrderSummarySchema,
  shippingAddress: ShippingAddressSchema,
  deliveryMethod: { 
    type: String, 
    required: true, 
    enum: ['delivery', 'pickup'] 
  },
  paymentInfo: PaymentInfoSchema,
  orderStatus: { 
    type: String, 
    required: true, 
    enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'pending'
  },
  appliedCoupon: {
    code: { type: String },
    discountAmount: { type: Number, default: 0 }
  },
  orderDate: { type: Date, required: true, default: Date.now },
  estimatedDeliveryDate: { type: Date },
  trackingNumber: { type: String },
  notes: { type: String }
}, {
  timestamps: true
});

// Indexes for better query performance
OrderSchema.index({ userId: 1, orderDate: -1 });
// OrderSchema.index({ orderId: 1 }); // Remove this line since unique: true already creates an index
OrderSchema.index({ 'paymentInfo.transactionId': 1 });

export const OrderModel = mongoose.model<Order & Document>('Order', OrderSchema);