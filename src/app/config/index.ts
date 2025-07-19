import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(process.cwd(), ".env") });

export default {
  NODE_ENV: process.env.NODE_ENV,
  port: process.env.PORT,
  database_url: process.env.DATABASE_URL,
  bcrypt_salt_rounds: process.env.BCRYPT_SALT_ROUNDS,
  default_password: process.env.DEFAULT_PIN,
  access_token_secret: process.env.ACCESS_TOKEN_SECRET,
  refresh_token_secret: process.env.REFRESH_TOKEN_SECRET,
  access_token_expire_in: process.env.ACCESS_TOKEN_EXPIRE_IN,
  refresh_token_expire_in: process.env.REFRESH_TOKEN_EXPIRE_IN,
  cloudinary_cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  cloudinary_api_key: process.env.CLOUDINARY_API_KEY,
  cloudinary_api_secret: process.env.CLOUDINARY_API_SECRET,
  sender_email: process.env.SENDER_EMAIL,
  sender_app_password: process.env.SENDER_APP_PASS,
  reset_pass_token_expire_in: process.env.RESET_PASS_TOKEN_EXPIRES_IN,
  reset_pass_link: process.env.RESET_PASS_LINK,
  stripe_publishable_key: process.env.STRIPE_PUBLISHABLE_KEY,
  STRIPE_SECRET_key: process.env.STRIPE_SECRET_KEY,
  STRIPE_webhook_secret: process.env.STRIPE_WEBHOOK_SECRET,
};
