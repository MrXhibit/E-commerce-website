import connectDb from "../db/connection";

export const bootstrap = async () => {
  await connectDb();
};
