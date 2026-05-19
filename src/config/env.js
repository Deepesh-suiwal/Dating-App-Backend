import { config } from "dotenv";
import { z } from "zod";

config();

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  PORT: z.coerce.number(),

  CORS_ORIGINS: z.string(),

  MONGO_URL: z.string(),

  USER_JWT_ACCESS_SECRET: z.string().min(1),
  USER_JWT_REFRESH_SECRET: z.string().min(1),
  JWT_USER_OTP_SECRET: z.string().min(1),

  BACKEND_URL: z.string(),
  FRONTEND_URL: z.string(),

  GOOGLE_WEB_CLIENT_ID: z.string(),
  GOOGLE_CLIENT_SECRET: z.string(),
  GOOGLE_REDIRECT_URI: z.string(),

  SENDGRID_API_KEY: z.string(),
  EMAIL_FROM: z.string().email(),

  CLOUDINARY_CLOUD_NAME: z.string(),
  CLOUDINARY_API_KEY: z.string(),
  CLOUDINARY_API_SECRET: z.string(),

  FIREBASE_PROJECT_ID: z.string(),
  FIREBASE_PRIVATE_KEY_ID: z.string(),
  FIREBASE_PRIVATE_KEY: z.string(),
  FIREBASE_CLIENT_EMAIL: z.string(),
  FIREBASE_CLIENT_ID: z.string(),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("❌ Invalid environment variables:", parsed.error.format());
  process.exit(1);
}

const envData = parsed.data;

export const env = envData;
