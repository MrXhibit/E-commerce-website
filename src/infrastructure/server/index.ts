import express from "express";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import cors from "cors";

import router from "@/presentation/routes";
import { handleError } from "@/presentation/middleware/error.middleware";

export const createServer = () => {
  const app = express();
  app.use(helmet());
  app.use(cors(
    {
    origin: 'http://localhost:5173', 
    credentials: true,              
    }
  ));
  app.use(cookieParser());
  app.use(express.json());
  app.use("/api", router);
  app.use(handleError);
  return app;
};
