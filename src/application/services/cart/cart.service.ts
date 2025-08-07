import { Cart } from "@/domain/entities";
import { cartServiceInterface } from "@/domain/interfaces/services";
import { CartRepository } from "@/infrastructure/repository";
import { ProductRepository } from "@/infrastructure/repository";

export class CartService implements cartServiceInterface {
  constructor(
    private cartRepository: CartRepository,
    private productRepository: ProductRepository
  ) {}

  async addToCart(userId: string, productId: string, quantity: number): Promise<Cart> {
    // Get product details
    const product = await this.productRepository.getSingleProduct(productId);
    if (!product) {
      throw new Error("Product not found");
    }

    // Get existing cart or create new one
    let cart = await this.cartRepository.getCartByUserId(userId);
    
    if (!cart) {
      cart = new Cart("", userId);
    }

    // Add item to cart
    cart.addItem(productId, quantity, product);

    // Save or update cart
    if (cart.id) {
      return await this.cartRepository.updateCart(cart);
    } else {
      return await this.cartRepository.saveCart(cart);
    }
  }

  async getCart(userId: string): Promise<Cart> {
    const cart = await this.cartRepository.getCartByUserId(userId);
    
    if (!cart) {
      // Return empty cart if none exists
      return new Cart("", userId);
    }

    return cart;
  }

  async updateCartItem(userId: string, productId: string, quantity: number): Promise<Cart> {
    const cart = await this.cartRepository.getCartByUserId(userId);
    
    if (!cart) {
      throw new Error("Cart not found");
    }

    cart.updateItemQuantity(productId, quantity);
    return await this.cartRepository.updateCart(cart);
  }

  async removeFromCart(userId: string, productId: string): Promise<Cart> {
    const cart = await this.cartRepository.getCartByUserId(userId);
    
    if (!cart) {
      throw new Error("Cart not found");
    }

    cart.removeItem(productId);
    return await this.cartRepository.updateCart(cart);
  }

  async clearCart(userId: string): Promise<Cart> {
    const cart = await this.cartRepository.getCartByUserId(userId);
    
    if (!cart) {
      throw new Error("Cart not found");
    }

    cart.clearCart();
    return await this.cartRepository.updateCart(cart);
  }
} 