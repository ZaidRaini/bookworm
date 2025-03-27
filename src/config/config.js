import "dotenv/config";

export const config = {
  uri: process.env.MONGODB_URI | "string",
  PORT: process.env.PORT || 3000,
  jwtToken: process.env.JWT_SECRET,
};
