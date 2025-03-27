import express from "express";
import "dotenv/config";
import authRoute from "./routes/auth.routes.js";
import { config } from "./config/config.js";
import { dbConnection } from "./config/db.js";

const app = express();
const PORT = config.PORT;

app.use("/api/auth", authRoute);

app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
  dbConnection();
});
