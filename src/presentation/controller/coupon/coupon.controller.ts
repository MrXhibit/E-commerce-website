import { Request, Response, NextFunction } from "express";
import { CouponRepository } from "@/infrastructure/repository/coupon.repository";
import { Coupon } from "@/domain/entities/coupon";
import { ResponseUtils } from "@/infrastructure/utils/response.utils";

const couponRepository = new CouponRepository();

export const createCoupon = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { code, discountType, discountValue, minimumOrderAmount, maxDiscountAmount, expiryDate, usageLimit } = req.body;
    const coupon = new Coupon(
      "",
      code,
      discountType,
      Number(discountValue),
      Number(minimumOrderAmount || 0),
      expiryDate,
      Number(usageLimit || 1),
      maxDiscountAmount !== undefined ? Number(maxDiscountAmount) : undefined,
    );
    const created = await couponRepository.createCoupon(coupon);
    return res.status(201).json(ResponseUtils.success(created, "Coupon created successfully"));
  } catch (error) {
    next(error);
  }
};

export const updateCoupon = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const updated = await couponRepository.updateCoupon(id, req.body);
    if (!updated) return res.status(404).json(ResponseUtils.error("Coupon not found"));
    return res.status(200).json(ResponseUtils.success(updated, "Coupon updated successfully"));
  } catch (error) {
    next(error);
  }
};

export const deleteCoupon = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const ok = await couponRepository.deleteCoupon(id);
    if (!ok) return res.status(404).json(ResponseUtils.error("Coupon not found"));
    return res.status(200).json(ResponseUtils.success(true, "Coupon deleted successfully"));
  } catch (error) {
    next(error);
  }
};

export const getCouponById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const coupon = await couponRepository.getCouponById(id);
    if (!coupon) return res.status(404).json(ResponseUtils.error("Coupon not found"));
    return res.status(200).json(ResponseUtils.success(coupon, "Coupon fetched successfully"));
  } catch (error) {
    next(error);
  }
};

export const getCoupons = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const coupons = await couponRepository.getAllCoupons();
    return res.status(200).json(ResponseUtils.success(coupons, "Coupons fetched successfully"));
  } catch (error) {
    next(error);
  }
};

export const getActiveCoupons = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const coupons = await couponRepository.getActiveCoupons();
    return res.status(200).json(ResponseUtils.success(coupons, "Active coupons fetched successfully"));
  } catch (error) {
    next(error);
  }
};

export const validateCoupon = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const code = String(req.query.code || "");
    if (!code) return res.status(400).json(ResponseUtils.error("Coupon code is required"));
    const coupon = await couponRepository.getCouponByCode(code);
    if (!coupon || !coupon.isValid()) return res.status(400).json(ResponseUtils.error("Invalid or expired coupon"));
    return res.status(200).json(ResponseUtils.success(coupon, "Coupon is valid"));
  } catch (error) {
    next(error);
  }
};


