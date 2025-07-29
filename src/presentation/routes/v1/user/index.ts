import { Router } from "express";
import { Request, Response, NextFunction } from "express";

import authRouter from "./auth.router";

const userRouter = Router();

userRouter.use("/auth", authRouter);
userRouter.get("/", (req: Request, res: Response, next: NextFunction) => {
  res.status(200).json({ message: "hi from user route" });
});

export default userRouter;
