import { Request, Response, NextFunction } from "express";
import { cloudUtills } from "@/infrastructure/utils/cloud.utils";
import { userService } from "@/application/services";
import { userRepository } from "@/infrastructure/repository";
import { authUtills } from "@/infrastructure/utils";
import { tokenUtils } from "@/infrastructure/utils/token.utils";
import { ResponseUtils } from "@/infrastructure/utils/response.utils";

const userRepo = new userRepository();
const userServ = new userService(userRepo, authUtills, tokenUtils);

export const updateUserProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req.user as { id: string })?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const user = await userRepo.getUserById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Update user fields
    const { userName } = req.body;
    if (userName) {
      user.setUserName(userName);
    }

    const updatedUser = await userRepo.editUser(user);
    const sanitizedUser = updatedUser.sanitizeUser();

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: { user: sanitizedUser }
    });
  } catch (error) {
    next(error);
  }
};

export const getUserProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req.user as { id: string })?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const user = await userRepo.getUserById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const sanitizedUser = user.sanitizeUser();
    return res.status(200).json({
      success: true,
      message: "Profile retrieved successfully",
      data: { user: sanitizedUser }
    });
  } catch (error) {
    next(error);
  }
};

export const uploadProfileImage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req.user as { id: string })?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    if (!req.file) {
      return res.status(400).json({ success: false, message: "No image file provided" });
    }

    const uploaded = await cloudUtills.uploadSingleFile(req.file as any);

    const user = await userRepo.getUserById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    user.setProfile(uploaded.url);
    const updatedUser = await userRepo.editUser(user);
    const sanitizedUser = updatedUser.sanitizeUser();

    return res.status(200).json({
      success: true,
      message: "Profile image updated successfully",
      data: {
        user: sanitizedUser,
        imageUrl: uploaded.url,
        imageId: uploaded.id
      }
    });
  } catch (error) {
    next(error);
  }
};

export const removeProfileImage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req.user as { id: string })?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const user = await userRepo.getUserById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    user.setProfile(""); // Remove profile image
    const updatedUser = await userRepo.editUser(user);
    const sanitizedUser = updatedUser.sanitizeUser();

    return res.status(200).json({
      success: true,
      message: "Profile image removed successfully",
      data: { user: sanitizedUser }
    });
  } catch (error) {
    next(error);
  }
};