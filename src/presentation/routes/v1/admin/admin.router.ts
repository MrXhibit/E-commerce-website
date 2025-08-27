import { Router } from "express";
import { getCurentAdmin, adminLogout } from "../../../controller";

const adminRouter = Router();

adminRouter.get("/logout", adminLogout);
adminRouter.get("/", getCurentAdmin);

export default adminRouter;
