import { Wishlist } from "@/domain/entities";
import { wishlistServiceInterface } from "@/domain/interfaces/services";
import { WishlistRepository } from "@/infrastructure/repository";
import { ProductRepository } from "@/infrastructure/repository";

export class WishlistService implements wishlistServiceInterface {
  constructor(
    private wishlistRepository: WishlistRepository,
    private productRepository: ProductRepository
  ) {}

  async addToWishlist(userId: string, productId: string): Promise<Wishlist> {
    // Get product details
    const product = await this.productRepository.getSingleProduct(productId);
    if (!product) {
      throw new Error("Product not found");
    }

    // Get existing wishlist or create new one
    let wishlist = await this.wishlistRepository.getWishlistByUserId(userId);
    
    if (!wishlist) {
      wishlist = new Wishlist("", userId);
    }

    // Add item to wishlist
    wishlist.addItem(productId, product);

    // Save or update wishlist
    if (wishlist.id) {
      return await this.wishlistRepository.updateWishlist(wishlist);
    } else {
      return await this.wishlistRepository.saveWishlist(wishlist);
    }
  }

  async getWishlist(userId: string): Promise<Wishlist> {
    const wishlist = await this.wishlistRepository.getWishlistByUserId(userId);
    
    if (!wishlist) {
      // Return empty wishlist if none exists
      return new Wishlist("", userId);
    }

    return wishlist;
  }

  async removeFromWishlist(userId: string, productId: string): Promise<Wishlist> {
    const wishlist = await this.wishlistRepository.getWishlistByUserId(userId);
    
    if (!wishlist) {
      throw new Error("Wishlist not found");
    }

    wishlist.removeItem(productId);
    return await this.wishlistRepository.updateWishlist(wishlist);
  }

  async clearWishlist(userId: string): Promise<Wishlist> {
    const wishlist = await this.wishlistRepository.getWishlistByUserId(userId);
    
    if (!wishlist) {
      throw new Error("Wishlist not found");
    }

    wishlist.clearWishlist();
    return await this.wishlistRepository.updateWishlist(wishlist);
  }
} 