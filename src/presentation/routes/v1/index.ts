import { Router } from "express";
import authRouter from "./auth/auth.router";
import categoryRouter from "./category/category.router";
import productRouter from "./product/product.router";

const v1Router = Router();

v1Router.use("/category", categoryRouter);
v1Router.use("/product", productRouter);
v1Router.use("/auth", authRouter);

export default v1Router;
