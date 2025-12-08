// middleware/rateLimiter.js
import rateLimit from "express-rate-limit";
import RedisStore from "rate-limit-redis";
import redis from "../redis.js";

export const limiter = rateLimit({
  store: new RedisStore({
    sendCommand: (...args) => redis.call(...args), // required for ioredis
  }),
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // max 100 requests per window per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message: "Too many requests from this IP, please try again later.",
  },
});
