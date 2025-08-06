import { Router } from "express";
import { CartController } from "@/presentation/controller/cart/cart.controller";

const router = Router();
const cartController = new CartController();

// Add item to cart
router.post("/add", cartController.addToCart.bind(cartController));

// Get user's cart
router.get("/", cartController.getCart.bind(cartController));

// Update cart item quantity
router.put("/update", cartController.updateCartItem.bind(cartController));

// Remove item from cart
router.delete("/remove/:productId", cartController.removeFromCart.bind(cartController));

// Clear entire cart
router.delete("/clear", cartController.clearCart.bind(cartController));

export default router; 