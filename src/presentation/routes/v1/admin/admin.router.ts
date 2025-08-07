import { Router } from "express";
import { getCurentAdmin } from "@/presentation/controller";


const adminRouter = Router()

adminRouter.get('/',getCurentAdmin)

export default adminRouter;
