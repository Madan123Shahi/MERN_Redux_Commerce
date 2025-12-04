import { config } from "dotenv";
config();
import express from "express";
import { connectDB } from "./config/connectDB.js";

const app = express();
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    // Log the error message and exit the process instead of just logging the error
    console.log("Failed to start server", error.message);
    process.exit(1);
  }
};

startServer();
