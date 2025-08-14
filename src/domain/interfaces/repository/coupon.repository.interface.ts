import { Coupon } from "@/domain/entities/coupon";

export interface CouponRepositoryInterface {
  getCouponByCode(code: string): Promise<Coupon | null>;
  getCouponById(id: string): Promise<Coupon | null>;
  createCoupon(coupon: Coupon): Promise<Coupon>;
  updateCoupon(id: string, coupon: Partial<Coupon>): Promise<Coupon | null>;
  deleteCoupon(id: string): Promise<boolean>;
  incrementUsageCount(id: string): Promise<void>;
  getAllCoupons(): Promise<Coupon[]>;
  getActiveCoupons(): Promise<Coupon[]>;
}