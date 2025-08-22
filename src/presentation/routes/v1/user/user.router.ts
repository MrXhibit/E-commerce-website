import { Router } from "express";
import { getUserProfile } from "@/presentation/controller";

const userRouter = Router();

userRouter.get("/", getUserProfile);

export default userRouter;
