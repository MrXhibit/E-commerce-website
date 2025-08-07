import { Request, Response, NextFunction } from "express";
import { authUtills } from "@/infrastructure/utills";
import { tokenUtils } from "@/infrastructure/utills/token.utils";
import { adminRepository } from "@/infrastructure/repository/admin.repository";
import { adminService } from "@/application/services/admin/admin.service";

const adminRepo = new adminRepository();
const adminServ = new adminService(adminRepo, tokenUtils, authUtills);


export const getCurentAdmin = async (req: Request, res: Response, next: NextFunction) => {
    try {
     const token = req.cookies.access_token_admin;
      const admin = await adminServ.getcurentAdmin(token)
      return res.status(200).json({admin})  
    } catch (error) {
        next(error)
    }
}

export const adminLogout = async(req:Request,res:Response,next:NextFunction)=>{
    try {
     const token = req.cookies.access_token_admin;
     const admin = await adminServ.logOutAdmin(token)
      res.cookie("access_token_admin", "", {
      httpOnly: true,
      maxAge: 1,
    });

    res.cookie("refresh_token_admin","", {
      httpOnly: true,
      maxAge:1,
    });
  return res.status(200).json({admin})  
     
    } catch (error) {
       next(error) 
    }
}