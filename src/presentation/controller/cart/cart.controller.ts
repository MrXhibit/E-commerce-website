import { Request, Response } from "express";
import { CartService } from "@/application/services";
import { CartRepository, ProductRepository } from "@/infrastructure/repository";

export class CartController {
  private cartService: CartService;

  constructor() {
    const cartRepository = new CartRepository();
    const productRepository = new ProductRepository();
    this.cartService = new CartService(cartRepository, productRepository);
  }

  async addToCart(req: Request, res: Response) {
    try {
      const { productId, quantity } = req.body;
      const userId = req.user?.id; // Assuming user is attached by auth middleware

      if (!userId) {
        return res.status(401).json({ message: "User not authenticated" });
      }

      if (!productId || !quantity || quantity <= 0) {
        return res.status(400).json({ message: "Invalid product ID or quantity" });
      }

      const cart = await this.cartService.addToCart(userId, productId, quantity);
      res.status(200).json({
        success: true,
        message: "Item added to cart successfully",
        data: cart.sanitizeCart()
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || "Failed to add item to cart"
      });
    }
  }

  async getCart(req: Request, res: Response) {
    try {
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({ message: "User not authenticated" });
      }

      const cart = await this.cartService.getCart(userId);
      res.status(200).json({
        success: true,
        data: cart.sanitizeCart()
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || "Failed to get cart"
      });
    }
  }

  async updateCartItem(req: Request, res: Response) {
    try {
      const { productId, quantity } = req.body;
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({ message: "User not authenticated" });
      }

      if (!productId || quantity === undefined || quantity < 0) {
        return res.status(400).json({ message: "Invalid product ID or quantity" });
      }

      const cart = await this.cartService.updateCartItem(userId, productId, quantity);
      res.status(200).json({
        success: true,
        message: "Cart item updated successfully",
        data: cart.sanitizeCart()
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || "Failed to update cart item"
      });
    }
  }

  async removeFromCart(req: Request, res: Response) {
    try {
      const { productId } = req.params;
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({ message: "User not authenticated" });
      }

      if (!productId) {
        return res.status(400).json({ message: "Product ID is required" });
      }

      const cart = await this.cartService.removeFromCart(userId, productId);
      res.status(200).json({
        success: true,
        message: "Item removed from cart successfully",
        data: cart.sanitizeCart()
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || "Failed to remove item from cart"
      });
    }
  }

  async clearCart(req: Request, res: Response) {
    try {
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({ message: "User not authenticated" });
      }

      const cart = await this.cartService.clearCart(userId);
      res.status(200).json({
        success: true,
        message: "Cart cleared successfully",
        data: cart.sanitizeCart()
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || "Failed to clear cart"
      });
    }
  }
} 