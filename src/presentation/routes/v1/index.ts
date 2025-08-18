import { Router } from "express";
import authRouter from "./auth/auth.router";
import categoryRouter from "./category/category.router";
import productRouter from "./product/product.router";
import adminRouter from "./admin/admin.router";
import cartRouter from "./cart/cart.router";
import wishlistRouter from "./wishlist/wishlist.router";
import orderRouter from "./order/order.router";
import paymentRouter from "./payment/payment.router";

const v1Router = Router();

v1Router.use("/category", categoryRouter);
v1Router.use("/product", productRouter);
v1Router.use("/auth", authRouter);
v1Router.use("/admin", adminRouter);
v1Router.use("/cart", cartRouter);
v1Router.use("/wishlist", wishlistRouter);
v1Router.use("/orders", orderRouter);
v1Router.use("/payments", paymentRouter);

export default v1Router;
