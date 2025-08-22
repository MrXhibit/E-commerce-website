import dotenv from "dotenv";

dotenv.config();

export const env = {
  // Provide sensible defaults for local development
  DB_URL: process.env.DB_URL || "mongodb://127.0.0.1:27017/buynest",
  PORT: process.env.PORT || "5000",
  APP_SCERET: process.env.APP_SCERET || "dev_secret",
  cloud_name: process.env.cloud_name,
  api_key: process.env.api_key,
  api_secret: process.env.api_secret,
  google_client_id: process.env.google_client_id,
  google_client_secret: process.env.google_client_secret,
  google_callback_url: process.env.google_callback_url,
  // Add Stripe configuration
  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
  STRIPE_PUBLISHABLE_KEY: process.env.STRIPE_PUBLISHABLE_KEY,
  STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,
  // CORS Configuration
  CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:3000,http://localhost:5173,http://localhost:5174',
  CORS_CREDENTIALS: process.env.CORS_CREDENTIALS === 'true' || true,
  // HTTPS Configuration
  HTTPS_ENABLED: process.env.HTTPS_ENABLED === 'true' || false,
  SSL_CERT_PATH: process.env.SSL_CERT_PATH,
  SSL_KEY_PATH: process.env.SSL_KEY_PATH,
  // Security Headers
  HELMET_ENABLED: process.env.HELMET_ENABLED !== 'false',
};
