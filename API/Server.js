import express from "express";
import session from "express-session";
import MongoStore from "connect-mongo";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import cors from "cors";
import { connectDB } from "./config/connectDB.js";
import authRoute from "./routes/User.Route.js";
import { env } from "./config/env.js";
import { limiter } from "./middleware/rateLimiter.js";

const app = express();

// app.set("trust proxy", 1);

app.use(helmet());

app.use(
  cors({
    origin: env.CLIENT_URL,
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(
  session({
    name: "sid", // cookie name
    secret: env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false, // ✅ important
    store: MongoStore.create({
      mongoUrl: env.MONGO_URI,
      collectionName: "sessions",
      ttl: 7 * 24 * 60 * 60, // 7 days
    }),
    cookie: {
      httpOnly: true,
      secure: env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    },
  })
);

/* ✅ Global rate limiter (all routes) */
app.use(limiter);

app.use("/api/auth", authRoute);

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
