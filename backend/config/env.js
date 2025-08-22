// backend/config/env.js
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Always load backend/.env regardless of where node is started
dotenv.config({ path: path.join(__dirname, "..", ".env") });

export const {
  MONGO_URI,
  PORT,
  NODE_ENV,
  CORS_ORIGIN, // optional: to configure allowed frontend origins
} = process.env;
