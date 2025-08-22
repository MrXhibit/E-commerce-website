import { Router } from "express";
import authRouter from "./auth/auth.router";
import categoryRouter from "./category/category.router";
import productRouter from "./product/product.router";
import adminRouter from "./admin/admin.router";
import cartRouter from "./cart/cart.router";
import wishlistRouter from "./wishlist/wishlist.router";
import orderRouter from "./order/order.router";
import paymentRouter from "./payment/payment.router";
import couponRouter from "./coupon/coupon.router";
import userRouter from "./user/user.router";

const v1Router = Router();

v1Router.use("/category", categoryRouter);
v1Router.use("/product", productRouter);
v1Router.use("/products", productRouter); // Add alias for /products
v1Router.use("/auth", authRouter);
v1Router.use("/admin", adminRouter);
v1Router.use("/cart", cartRouter);
v1Router.use("/wishlist", wishlistRouter);
v1Router.use("/orders", orderRouter);
v1Router.use("/payments", paymentRouter);
v1Router.use("/coupons", couponRouter);
v1Router.use("/user", userRouter);

export default v1Router;
