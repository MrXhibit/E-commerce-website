import dotenv from "dotenv";

dotenv.config();

export const env = {
  DB_URL: process.env.DB_URL,
  PORT: process.env.PORT,
  APP_SCERET: process.env.APP_SCERET,
  cloud_name: process.env.cloud_name,
  api_key: process.env.api_key,
  api_secret: process.env.api_secret,
  google_client_id: process.env.google_client_id,
  google_client_secret: process.env.google_client_secret,
  google_callback_url: process.env.google_callback_url,
};
