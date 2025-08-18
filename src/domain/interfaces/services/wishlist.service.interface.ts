import { Wishlist } from "@/domain/entities";

export interface wishlistServiceInterface {
  addToWishlist(userId: string, productId: string): Promise<Wishlist>;
  getWishlist(userId: string): Promise<Wishlist>;
  removeFromWishlist(userId: string, productId: string): Promise<Wishlist>;
  clearWishlist(userId: string): Promise<Wishlist>;
}
