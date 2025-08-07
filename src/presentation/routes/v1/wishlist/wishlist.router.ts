import { Router } from "express";
import { WishlistController } from "@/presentation/controller/wishlist/wishlist.controller";

const router = Router();
const wishlistController = new WishlistController();

// Add item to wishlist
router.post("/add", wishlistController.addToWishlist.bind(wishlistController));

// Get user's wishlist
router.get("/", wishlistController.getWishlist.bind(wishlistController));

// Remove item from wishlist
router.delete("/remove/:productId", wishlistController.removeFromWishlist.bind(wishlistController));

// Clear entire wishlist
router.delete("/clear", wishlistController.clearWishlist.bind(wishlistController));

export default router; 