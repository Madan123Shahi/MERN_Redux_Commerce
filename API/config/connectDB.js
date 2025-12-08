// import mongoose from "mongoose";

// // Best for small to medium projects
// export const connectDB = async (mongoUri) => {
//   try {
//     await mongoose.connect(mongoUri);
//     console.log("Connected to MongoDB");
//   } catch (error) {
//     console.log(error);
//     process.exit(1);
//   }
// };

// Production ready with retries and Graceful shutdown
import mongoose from "mongoose";

export const connectDB = async (mongoUri, retries = 5, delay = 3000) => {
  if (!mongoUri) {
    // console.error("MongoDB URI not provided!");
    // process.exit(1);
    throw new Error("MongoDB URI not provided!");
  }

  const connectWithRetry = async (attempt = 1) => {
    try {
      await mongoose.connect(mongoUri, {
        serverSelectionTimeoutMS: 5000, // fail fast if DB not reachable
      });

      console.log("✅ MongoDB connected successfully");

      // Connection events
      mongoose.connection.on("error", (err) => {
        console.error("MongoDB connection error:", err);
      });

      mongoose.connection.on("disconnected", () => {
        console.warn("⚠️ MongoDB disconnected!");
      });

      // Graceful shutdown
      process.on("SIGINT", async () => {
        console.log("SIGINT received: closing MongoDB connection");
        await mongoose.connection.close();
        process.exit(0);
      });

      process.on("SIGTERM", async () => {
        console.log("SIGTERM received: closing MongoDB connection");
        await mongoose.connection.close();
        process.exit(0);
      });
    } catch (err) {
      console.error(
        `MongoDB connection attempt ${attempt} failed: ${err.message}`
      );
      if (attempt < retries) {
        console.log(`Retrying in ${delay}ms...`);
        setTimeout(() => connectWithRetry(attempt + 1), delay);
      } else {
        console.error("All MongoDB connection attempts failed. Exiting...");
        process.exit(1);
      }
    }
  };

  await connectWithRetry();
};
