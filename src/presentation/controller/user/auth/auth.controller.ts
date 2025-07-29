import { userService } from "@/application/services";
import { userRepository } from "@/infrastructure/repository";
import { Request, Response, NextFunction } from "express";
import { authUtills } from "@/infrastructure/utills";

const userRepo = new userRepository();
const userServ = new userService(userRepo, authUtills);
export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await userServ.loginUser(req.body);
    const { access_token, refresh_token, user } = result;
    res.cookie("access_token", access_token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: "none",
    });

    res.cookie("refresh_token", refresh_token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: "none",
    });
    return res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await userServ.registerUser(req.body);
    const { access_token, refresh_token, user } = result;
    res.cookie("access_token", access_token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: "none",
    });

    res.cookie("refresh_token", refresh_token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: "none",
    });
    return res.status(201).json(user);
  } catch (error) {
    next(error);
  }
};

export const googleLogin = (req: Request, res: Response, next: NextFunction) => {};
