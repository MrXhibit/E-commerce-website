import { Router } from "express";
import { authenticateUser } from "@/presentation/middleware/auth.middleware";
import { uploadSingleProfile } from "@/presentation/middleware/multer.uploader";
import { getUserProfile, updateUserProfile, uploadProfileImage, removeProfileImage } from "@/presentation/controller/user/user.controller";

const router = Router();

router.use(authenticateUser);
router.get("/profile", getUserProfile);
router.put("/profile", updateUserProfile);
router.post("/profile/image", uploadSingleProfile, uploadProfileImage);
router.delete("/profile/image", removeProfileImage);

export default router;


