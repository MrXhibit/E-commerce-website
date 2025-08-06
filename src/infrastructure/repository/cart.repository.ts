import { Cart } from "@/domain/entities";
import { cartRepositoryInterface } from "@/domain/interfaces/repository";
import { CartModel, ICart } from "@/infrastructure/model";

export class CartRepository implements cartRepositoryInterface {
  async saveCart(cart: Cart): Promise<Cart> {
    const cartData = {
      userId: cart.userId,
      items: cart.items,
      totalAmount: cart.totalAmount,
      itemCount: cart.itemCount,
      createdAt: cart.createdAt,
      updatedAt: cart.updatedAt
    };

    const savedCart = await CartModel.create(cartData);
    return this.mapToCart(savedCart);
  }

  async getCartByUserId(userId: string): Promise<Cart | null> {
    const cart = await CartModel.findOne({ userId });
    return cart ? this.mapToCart(cart) : null;
  }

  async updateCart(cart: Cart): Promise<Cart> {
    const updatedCart = await CartModel.findOneAndUpdate(
      { userId: cart.userId },
      {
        items: cart.items,
        totalAmount: cart.totalAmount,
        itemCount: cart.itemCount,
        updatedAt: cart.updatedAt
      },
      { new: true }
    );

    if (!updatedCart) {
      throw new Error("Cart not found");
    }

    return this.mapToCart(updatedCart);
  }

  async deleteCart(userId: string): Promise<boolean> {
    const result = await CartModel.deleteOne({ userId });
    return result.deletedCount > 0;
  }

  mapToCart(cartDb: unknown): Cart {
    const cartData = cartDb as ICart;
    return new Cart(
      cartData._id.toString(),
      cartData.userId,
      cartData.items,
      cartData.totalAmount,
      cartData.itemCount
    );
  }
}
