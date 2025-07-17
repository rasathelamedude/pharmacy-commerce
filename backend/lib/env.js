import dotenv from "dotenv";

dotenv.config({ path: `.env.${process.env.NODE_ENV || "development"}.local` });

export const {
  PORT,
  JWT_REFRESH_SECRET,
  REFRESH_EXPIRES_IN,
  JWT_ACCESS_SECRET,
  ACCESS_EXPIRES_IN,
  DB_CONNECTION_STRING,
  NODE_ENV,
} = process.env;
