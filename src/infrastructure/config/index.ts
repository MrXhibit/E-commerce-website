import connectDb from "../db/connection";
import { createAdmin } from "./admin.seed"; // want remove

export const bootstrap = async () => {
  await connectDb();
  await createAdmin(); // want remove
};
