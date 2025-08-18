export class Wishlist {
  id: string;
  userId: string;
  items: WishlistItem[];
  itemCount: number;
  createdAt: string;
  updatedAt: string;
  private _modifiedFields = {} as modifiedFields;

  constructor(id: string = "", userId: string, items: WishlistItem[] = [], itemCount: number = 0) {
    this.id = id;
    this.userId = userId;
    this.items = items;
    this.itemCount = itemCount;
    this.createdAt = new Date().toISOString();
    this.updatedAt = new Date().toISOString();
  }

  addItem(productId: string, product: any) {
    const existingItem = this.items.find((item) => item.productId === productId);

    if (!existingItem) {
      const newItem: WishlistItem = {
        productId,
        product: {
          id: product.id,
          name: product.name,
          images: product.images,
          price: product.price,
          brandName: product.brandName,
          modelName: product.modelName,
          description: product.description,
          stock: product.stock,
        },
        addedAt: new Date().toISOString(),
      };
      this.items.push(newItem);
      this.updateItemCount();
      this.updatedAt = new Date().toISOString();
      this._modifiedFields.items = true;
      this._modifiedFields.itemCount = true;
      this._modifiedFields.updatedAt = true;
    }
  }

  removeItem(productId: string) {
    this.items = this.items.filter((item) => item.productId !== productId);
    this.updateItemCount();
    this.updatedAt = new Date().toISOString();
    this._modifiedFields.items = true;
    this._modifiedFields.itemCount = true;
    this._modifiedFields.updatedAt = true;
  }

  clearWishlist() {
    this.items = [];
    this.updateItemCount();
    this.updatedAt = new Date().toISOString();
    this._modifiedFields.items = true;
    this._modifiedFields.itemCount = true;
    this._modifiedFields.updatedAt = true;
  }

  private updateItemCount() {
    this.itemCount = this.items.length;
  }

  sanitizeWishlist() {
    const wishlist = {} as Partial<wishlistProperties>;
    wishlist.id = this.id;
    wishlist.userId = this.userId;
    wishlist.items = this.items;
    wishlist.itemCount = this.itemCount;
    wishlist.createdAt = this.createdAt;
    wishlist.updatedAt = this.updatedAt;
    return wishlist;
  }

  get modifiedFields(): modifiedFields {
    return this._modifiedFields;
  }

  get clearModifiedFields(): modifiedFields {
    this._modifiedFields = {} as modifiedFields;
    return this._modifiedFields;
  }
}

export interface WishlistItem {
  productId: string;
  product: {
    id: string;
    name: string;
    images: { url: string; id: string }[];
    price: string;
    brandName: string;
    modelName: string;
    description: string;
    stock: number;
  };
  addedAt: string;
}

export type wishlistProperties = Omit<
  Wishlist,
  | "addItem"
  | "removeItem"
  | "clearWishlist"
  | "updateItemCount"
  | "sanitizeWishlist"
  | "modifiedFields"
  | "clearModifiedFields"
>;

type modifiedFields = {
  [K in keyof Omit<wishlistProperties, "id">]: boolean;
};
