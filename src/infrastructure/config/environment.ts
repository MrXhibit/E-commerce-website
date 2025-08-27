import dotenv from "dotenv";

dotenv.config();

export const environment = {
  DB_URL: process.env.DB_URL || 'mongodb://localhost:27017/buynest',
  PORT: process.env.PORT || 5000,
  APP_SECRET: process.env.APP_SECRET || 'your-secret-key',
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME || '',
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY || '',
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET || '',
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID || '',
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET || '',
  GOOGLE_CALLBACK_URL: process.env.GOOGLE_CALLBACK_URL || 'http://localhost:3000/api/auth/google/callback',
  STRIPE_PUBLISHABLE_KEY: process.env.STRIPE_PUBLISHABLE_KEY || '',
  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY || '',
  STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET || '',
  CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:3000',
  NODE_ENV: process.env.NODE_ENV || 'development'
};

// Legacy export for backward compatibility
export const env = {
  DB_URL: environment.DB_URL,
  PORT: environment.PORT,
  APP_SECRET: environment.APP_SECRET, // Fixed typo
  cloud_name: environment.CLOUDINARY_CLOUD_NAME,
  api_key: environment.CLOUDINARY_API_KEY,
  api_secret: environment.CLOUDINARY_API_SECRET, // Fixed: was using CLOUDINARY_CLOUD_NAME
  google_client_id: environment.GOOGLE_CLIENT_ID,
  google_client_secret: environment.GOOGLE_CLIENT_SECRET,
  google_callback_url: environment.GOOGLE_CALLBACK_URL,
  stripe_publish_key: environment.STRIPE_PUBLISHABLE_KEY,
  stripe_secret_key: environment.STRIPE_SECRET_KEY,
};
