//////////////
//--Temp file for runing remove later
//////////
import { APIError } from "@/domain/entities";
import AdminModel from "../model/admin.model";
import bcrypt from "bcrypt";

export const createAdmin = async () => {
  try {
    const admins = await AdminModel.find();
    if (admins.length === 0) {

      const password = "12345678";
      const email = "admin@gmail.com";
      const userName = "admin";
      const profile = "https://png.pngtree.com/png-vector/20231019/ourmid/pngtree-user-profile-avatar-png-image_10211467.png";
      const hashedPassword = await bcrypt.hash(password, 10);
      const newAdmin = new AdminModel({
        userName,
        email,
        password: hashedPassword,
        salt: "", // bcrypt handles salt internally
        profile
      });
      await newAdmin.save();
    }
  } catch (error) {
    throw new APIError();
  }
};
