import { login, register, googleLogin } from "@/presentation/controller/user";
import { Router } from "express";

const authRouter = Router();

authRouter.post("/login", login);
authRouter.post("/register", register);
authRouter.post("/google-login", googleLogin);
export default authRouter;
