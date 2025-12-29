import express from "express";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import cors from "cors";
import { connectDB } from "./config/connectDB.js";
import { globalErrorHandler } from "./middleware/errorMiddleware.js";
import authRoute from "./routes/User.Route.js";
import categoryRoute from "./routes/category.route.js";
import subCategoryRoute from "./routes/subCategory.route.js";
import productRoute from "./routes/product.route.js";
import { env } from "./config/env.js";
// import { limiter } from "./middleware/rateLimiter.js";

const app = express();

// app.set("trust proxy", 1);

// app.use((req, res, next) => {
//   console.log("REQ:", req.method, req.originalUrl);
//   next();
// });

app.use(
  cors({
    origin: env.CLIENT_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(
  helmet({
    contentSecurityPolicy: false,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

/* ✅ Global rate limiter (all routes) */
// app.use(limiter);

app.use("/api/auth", authRoute);
app.use("/api/admin/categories", categoryRoute);
app.use("/api/admin/subcategories", subCategoryRoute);
app.use("/api/admin/products", productRoute);

app.use(globalErrorHandler);

const PORT = env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB(env.MONGO_URI);
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
