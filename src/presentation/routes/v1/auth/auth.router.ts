import {
  userLogin,
  userRegister,
  googleLogin,
  adminLogin,
  userRefreshToken,
  adminRefreshToken,
} from "@/presentation/controller";
import { Router } from "express";

const authRouter = Router();

authRouter.post("/login", userLogin);
authRouter.post("/register", userRegister);
authRouter.post("/google-login", googleLogin);
authRouter.post("/refresh-token", userRefreshToken);
authRouter.post("/admin/login", adminLogin);
authRouter.post("/admin/refresh-token", adminRefreshToken);
export default authRouter;
