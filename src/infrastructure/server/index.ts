import express from "express";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import cors from "cors";

import router from "@/presentation/routes";
import { handleError } from "@/presentation/middleware/error.middleware";

export const createServer = () => {
  const app = express();
  app.use(helmet());
  app.use(cors()); //enable for only frontend url
  app.use(cookieParser());
  app.use(express.json());
  app.use("/api", router);
  app.use(handleError);
  return app;
};
