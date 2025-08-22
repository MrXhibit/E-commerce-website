import { Router } from "express";
import { authenticateAdmin, authenticateUser } from "@/presentation/middleware/auth.middleware";
import {
  createCoupon,
  updateCoupon,
  deleteCoupon,
  getCouponById,
  getCoupons,
  getActiveCoupons,
  validateCoupon,
} from "@/presentation/controller/coupon/coupon.controller";

const router = Router();

// Admin CRUD
router.post("/", authenticateAdmin, createCoupon);
router.put("/:id", authenticateAdmin, updateCoupon);
router.delete("/:id", authenticateAdmin, deleteCoupon);

// Public/user
router.get("/active", getActiveCoupons);
router.get("/validate", authenticateUser, validateCoupon);
router.get("/:id", authenticateAdmin, getCouponById);
router.get("/", authenticateAdmin, getCoupons);

export default router;


