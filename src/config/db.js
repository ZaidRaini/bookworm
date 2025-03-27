import mongoose from "mongoose";
import { config } from "./config";

export const dbConnection = async () => {
  try {
    await mongoose.connect(mongoose.connect(config.uri));
    console.log("database connection successfully");
  } catch (error) {
    console.log("Error connecting to the database");
    process.exit(1);
  }
};
