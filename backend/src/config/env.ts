import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT || "5000";
const MONGODB_URI = process.env.MONGODB_URI;
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";

if (!MONGODB_URI) {
  throw new Error("MONGODB_URI is not set");
}

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not set");
}

export const env = {
  PORT: Number(PORT),
  MONGODB_URI,
  JWT_SECRET,
  JWT_EXPIRES_IN,
};
