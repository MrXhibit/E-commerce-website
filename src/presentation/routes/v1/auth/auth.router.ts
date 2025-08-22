import {
  userLogin,
  userRegister,
  googleLogin,
  adminLogin,
  userRefreshToken,
  adminRefreshToken,
  googleLoginMiddleware,
  googleLoginSucessController,
} from "@/presentation/controller";
import { Router } from "express";

const authRouter = Router();

authRouter.post("/login", userLogin);
authRouter.post("/register", userRegister);
authRouter.get("/google-login", googleLogin);
// Alias common Google OAuth path
authRouter.get("/google", googleLogin);
authRouter.get("/google/callback", googleLoginMiddleware, googleLoginSucessController);
authRouter.post("/refresh-token", userRefreshToken);
authRouter.post("/admin/login", adminLogin);
authRouter.post("/admin/refresh-token", adminRefreshToken);
export default authRouter;
