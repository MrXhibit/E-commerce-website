import connectDb from "../db/connection";
import { createAdmin } from "./admin.seed"; // want remove
import { seedData } from "./data.seed";

export const bootstrap = async () => {
  await connectDb();
  await createAdmin(); // want remove
  await seedData();
};
