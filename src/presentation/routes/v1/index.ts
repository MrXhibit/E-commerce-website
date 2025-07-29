import { Router } from "express";
import userRouter from "./user";
import categoryRouter from "./category/category.router";
import productRouter from "./product/product.router";

const v1Router = Router();

v1Router.use("/category",categoryRouter);
v1Router.use("/product",productRouter);
v1Router.use("/", userRouter);


export default v1Router;
