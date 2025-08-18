import { Coupon } from './coupon';

export class Cart {
  id: string;
  userId: string;
  items: CartItem[];
  totalAmount: number;
  itemCount: number;
  createdAt: string;
  updatedAt: string;
  private _modifiedFields = {} as modifiedFields;
  appliedCoupon?: Coupon;
  discountAmount: number;

  constructor(
    id: string = "",
    userId: string,
    items: CartItem[] = [],
    totalAmount: number = 0,
    itemCount: number = 0,
  ) {
    this.id = id;
    this.userId = userId;
    this.items = items;
    this.totalAmount = totalAmount;
    this.itemCount = itemCount;
    this.createdAt = new Date().toISOString();
    this.updatedAt = new Date().toISOString();
    this.discountAmount = 0;
  }

  addItem(productId: string, quantity: number, product: any) {
    const existingItem = this.items.find((item) => item.productId === productId);

    if (existingItem) {
      existingItem.quantity += quantity;
      existingItem.totalPrice = existingItem.quantity * existingItem.price;
    } else {
      const newItem: CartItem = {
        productId,
        quantity,
        price: parseFloat(product.price),
        totalPrice: parseFloat(product.price) * quantity,
        product: {
          id: product.id,
          name: product.name,
          images: product.images,
          price: product.price,
          brandName: product.brandName,
          modelName: product.modelName,
        },
      };
      this.items.push(newItem);
    }

    this.updateTotals();
    this.updatedAt = new Date().toISOString();
    this._modifiedFields.items = true;
    this._modifiedFields.totalAmount = true;
    this._modifiedFields.itemCount = true;
    this._modifiedFields.updatedAt = true;
  }

  updateItemQuantity(productId: string, quantity: number) {
    const item = this.items.find((item) => item.productId === productId);
    if (item) {
      if (quantity <= 0) {
        this.removeItem(productId);
      } else {
        item.quantity = quantity;
        item.totalPrice = item.quantity * item.price;
        this.updateTotals();
        this.updatedAt = new Date().toISOString();
        this._modifiedFields.items = true;
        this._modifiedFields.totalAmount = true;
        this._modifiedFields.itemCount = true;
        this._modifiedFields.updatedAt = true;
      }
    }
  }

  removeItem(productId: string) {
    this.items = this.items.filter((item) => item.productId !== productId);
    this.updateTotals();
    this.updatedAt = new Date().toISOString();
    this._modifiedFields.items = true;
    this._modifiedFields.totalAmount = true;
    this._modifiedFields.itemCount = true;
    this._modifiedFields.updatedAt = true;
  }

  clearCart() {
    this.items = [];
    this.updateTotals();
    this.updatedAt = new Date().toISOString();
    this._modifiedFields.items = true;
    this._modifiedFields.totalAmount = true;
    this._modifiedFields.itemCount = true;
    this._modifiedFields.updatedAt = true;
  }

  applyCoupon(coupon: Coupon): boolean {
    if (!coupon.isValid()) {
      return false;
    }

    const subtotal = this.items.reduce((sum, item) => sum + item.totalPrice, 0);
    if (subtotal < coupon.minimumOrderAmount) {
      return false;
    }

    this.appliedCoupon = coupon;
    this.discountAmount = coupon.calculateDiscount(subtotal);
    this.updateTotals();
    this._modifiedFields.appliedCoupon = true;
    this._modifiedFields.discountAmount = true;
    this._modifiedFields.totalAmount = true;
    this._modifiedFields.updatedAt = true;
    return true;
  }

  removeCoupon(): void {
    this.appliedCoupon = undefined;
    this.discountAmount = 0;
    this.updateTotals();
    this._modifiedFields.appliedCoupon = true;
    this._modifiedFields.discountAmount = true;
    this._modifiedFields.totalAmount = true;
    this._modifiedFields.updatedAt = true;
  }

  private updateTotals() {
    const subtotal = this.items.reduce((sum, item) => sum + item.totalPrice, 0);
    this.totalAmount = subtotal - this.discountAmount;
    this.itemCount = this.items.reduce((sum, item) => sum + item.quantity, 0);
  }

  sanitizeCart() {
    const cart = {} as Partial<cartProperties>;
    cart.id = this.id;
    cart.userId = this.userId;
    cart.items = this.items;
    cart.totalAmount = this.totalAmount;
    cart.itemCount = this.itemCount;
    cart.appliedCoupon = this.appliedCoupon;
    cart.discountAmount = this.discountAmount;
    cart.createdAt = this.createdAt;
    cart.updatedAt = this.updatedAt;
    return cart;
  }

  get modifiedFields(): modifiedFields {
    return this._modifiedFields;
  }

  get clearModifiedFields(): modifiedFields {
    this._modifiedFields = {} as modifiedFields;
    return this._modifiedFields;
  }
}

export interface CartItem {
  productId: string;
  quantity: number;
  price: number;
  totalPrice: number;
  product: {
    id: string;
    name: string;
    images: { url: string; id: string }[];
    price: string;
    brandName: string;
    modelName: string;
  };
}

export type cartProperties = Omit<
  Cart,
  | "addItem"
  | "updateItemQuantity"
  | "removeItem"
  | "clearCart"
  | "updateTotals"
  | "applyCoupon"
  | "removeCoupon"
  | "sanitizeCart"
  | "modifiedFields"
  | "clearModifiedFields"
>;

type modifiedFields = {
  [K in keyof Omit<cartProperties, "id">]: boolean;
<<<<<<< HEAD
};
=======
};
>>>>>>> 53e40f222b782e71a2959d2bce278cfc106affd4
