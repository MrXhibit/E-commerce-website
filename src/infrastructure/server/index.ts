import express from "express";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import cors from "cors";
import https from "https";
import fs from "fs";

import router from "@/presentation/routes";
import { handleError } from "@/presentation/middleware/error.middleware";
import passport from "@/infrastructure/config/passport.config";
import { env } from "@/infrastructure/config/environment";

export const createServer = () => {
  const app = express();
  
  // Helmet security headers (configurable)
  if (env.HELMET_ENABLED) {
    app.use(helmet());
  }
  
  // CORS configuration from environment
  const corsOrigins = env.CORS_ORIGIN.split(',').map(origin => origin.trim());
  app.use(cors({
    origin: corsOrigins,
    credentials: env.CORS_CREDENTIALS
  }));
  
  app.use(cookieParser());
  // Stripe webhook must receive the raw body to verify signature
  app.use('/api/v1/payments/webhook', express.raw({ type: 'application/json' }));
  app.use(express.json());
  // Initialize Passport (Google OAuth)
  app.use(passport.initialize());
  app.use("/api", router);
  app.use(handleError);
  return app;
};

// HTTPS server creation function
export const createHttpsServer = () => {
  if (!env.HTTPS_ENABLED || !env.SSL_CERT_PATH || !env.SSL_KEY_PATH) {
    throw new Error('HTTPS is enabled but SSL certificate paths are not provided');
  }
  
  const app = createServer();
  
  const options = {
    key: fs.readFileSync(env.SSL_KEY_PATH),
    cert: fs.readFileSync(env.SSL_CERT_PATH)
  };
  
  return https.createServer(options, app);
};
