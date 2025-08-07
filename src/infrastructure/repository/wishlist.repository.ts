import { Wishlist } from "@/domain/entities";
import { wishlistRepositoryInterface } from "@/domain/interfaces/repository";
import { WishlistModel, IWishlist } from "@/infrastructure/model";

export class WishlistRepository implements wishlistRepositoryInterface {
  async saveWishlist(wishlist: Wishlist): Promise<Wishlist> {
    const wishlistData = {
      userId: wishlist.userId,
      items: wishlist.items,
      itemCount: wishlist.itemCount,
      createdAt: wishlist.createdAt,
      updatedAt: wishlist.updatedAt
    };

    const savedWishlist = await WishlistModel.create(wishlistData);
    return this.mapToWishlist(savedWishlist);
  }

  async getWishlistByUserId(userId: string): Promise<Wishlist | null> {
    const wishlist = await WishlistModel.findOne({ userId });
    return wishlist ? this.mapToWishlist(wishlist) : null;
  }

  async updateWishlist(wishlist: Wishlist): Promise<Wishlist> {
    const updatedWishlist = await WishlistModel.findOneAndUpdate(
      { userId: wishlist.userId },
      {
        items: wishlist.items,
        itemCount: wishlist.itemCount,
        updatedAt: wishlist.updatedAt
      },
      { new: true }
    );

    if (!updatedWishlist) {
      throw new Error("Wishlist not found");
    }

    return this.mapToWishlist(updatedWishlist);
  }

  async deleteWishlist(userId: string): Promise<boolean> {
    const result = await WishlistModel.deleteOne({ userId });
    return result.deletedCount > 0;
  }

  mapToWishlist(wishlistDb: IWishlist): Wishlist {
    const wishlistData = wishlistDb as IWishlist;
    return new Wishlist(
      wishlistData.id,
      wishlistData.userId,
      wishlistData.items,
      wishlistData.itemCount
    );
  }
}
