import { Cart } from "@/domain/entities";

export interface cartServiceInterface {
  addToCart(userId: string, productId: string, quantity: number): Promise<Cart>;
  getCart(userId: string): Promise<Cart>;
  updateCartItem(userId: string, productId: string, quantity: number): Promise<Cart>;
  removeFromCart(userId: string, productId: string): Promise<Cart>;
  clearCart(userId: string): Promise<Cart>;
} 