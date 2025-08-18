export class Coupon {
  id: string;
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minimumOrderAmount: number;
  maxDiscountAmount?: number;
  expiryDate: string;
  usageLimit: number;
  usedCount: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;

  constructor(
    id: string = "",
    code: string,
    discountType: 'percentage' | 'fixed',
    discountValue: number,
    minimumOrderAmount: number = 0,
    expiryDate: string,
    usageLimit: number = 1,
    maxDiscountAmount?: number
  ) {
    this.id = id;
    this.code = code.toUpperCase();
    this.discountType = discountType;
    this.discountValue = discountValue;
    this.minimumOrderAmount = minimumOrderAmount;
    this.maxDiscountAmount = maxDiscountAmount;
    this.expiryDate = expiryDate;
    this.usageLimit = usageLimit;
    this.usedCount = 0;
    this.isActive = true;
    this.createdAt = new Date().toISOString();
    this.updatedAt = new Date().toISOString();
  }

  isValid(): boolean {
    const now = new Date();
    const expiry = new Date(this.expiryDate);
    return this.isActive && 
           now <= expiry && 
           this.usedCount < this.usageLimit;
  }

  calculateDiscount(orderAmount: number): number {
    if (!this.isValid() || orderAmount < this.minimumOrderAmount) {
      return 0;
    }

    let discount = 0;
    if (this.discountType === 'percentage') {
      discount = (orderAmount * this.discountValue) / 100;
      if (this.maxDiscountAmount) {
        discount = Math.min(discount, this.maxDiscountAmount);
      }
    } else {
      discount = this.discountValue;
    }

    return Math.min(discount, orderAmount);
  }
}