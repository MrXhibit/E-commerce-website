import mongoose, { Document, Schema } from "mongoose";
import { Cart, CartItem } from "@/domain/entities";

export interface ICart extends Document {
  userId: string;
  items: CartItem[];
  totalAmount: number;
  itemCount: number;
  createdAt: string;
  updatedAt: string;
}

const cartItemSchema = new Schema<CartItem>({
  productId: { type: String, required: true },
  quantity: { type: Number, required: true, min: 1 },
  price: { type: Number, required: true },
  totalPrice: { type: Number, required: true },
  product: {
    id: { type: String, required: true },
    name: { type: String, required: true },
    images: [{
      url: { type: String, required: true },
      id: { type: String, required: true }
    }],
    price: { type: String, required: true },
    brandName: { type: String, required: true },
    modelName: { type: String, required: true }
  }
});

const cartSchema = new Schema<ICart>({
  userId: { type: String, required: true, unique: true },
  items: [cartItemSchema],
  totalAmount: { type: Number, default: 0 },
  itemCount: { type: Number, default: 0 },
  createdAt: { type: String, default: () => new Date().toISOString() },
  updatedAt: { type: String, default: () => new Date().toISOString() }
}, {
  timestamps: false
});

export const CartModel = mongoose.model<ICart>("Cart", cartSchema);
