import mongoose from "mongoose";
import { env } from "@/infrastructure/config/environment";

const connectDb = async () => {
  try {
    if(!env.DB_URL) throw new Error('database url not found in env')
    console.log('Attempting to connect to database:', env.DB_URL.replace(/\/\/.*@/, '//***:***@')); // Hide credentials in logs
    await mongoose.connect(env.DB_URL);
    console.log("database connected.......");
  } catch (error) {
    console.error('Database connection failed:', error);
    process.exit(1);
  }
};

export default connectDb;
