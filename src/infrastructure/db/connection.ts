import mongoose from "mongoose";
import { env } from '@/infrastructure/config/environment'
const connectDb = async () => {
  try {
    await mongoose.connect(env.DB_URL!);
    console.log("database connected.......");
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

export default connectDb;
