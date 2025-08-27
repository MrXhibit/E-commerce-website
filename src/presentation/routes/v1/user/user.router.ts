import { Router } from "express";
import { getUserProfile,LogOutUser } from "../../../controller";
import { authenticateUser } from "../../../middleware/auth.middleware";

const userRouter = Router();

userRouter.use(authenticateUser); // Protect all user routes
userRouter.get("/", getUserProfile);
userRouter.get("/logout",LogOutUser)

export default userRouter;
