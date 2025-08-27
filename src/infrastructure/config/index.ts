import connectDb from "../db/connection";
import { createAdmin } from "./admin.seed";
import { seedData } from "./data.seed";

export const bootstrap = async () => {
  await connectDb();
  await createAdmin();
  await seedData();
};
