// middleware/rateLimiter.js
import rateLimit from "express-rate-limit";
import RedisStore from "rate-limit-redis";
import redis from "../config/redis.js";

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

export const otpVerifyLimiter = rateLimit({
  store: new RedisStore({
    sendCommand: (...args) => redis.call(...args),
  }),
  windowMs: 10 * 60 * 1000,
  max: 5,
  keyGenerator: (req) => {
    return req.body.email || req.body.phone || req.ip;
  },
  message: {
    message: "Too many OTP attempts. Please request a new OTP.",
  },
});

export const otpSendLimiter = rateLimit({
  store: new RedisStore({
    sendCommand: (...args) => redis.call(...args),
  }),
  windowMs: 15 * 60 * 1000,
  max: 3,
  keyGenerator: (req) => {
    return req.body.email || req.body.phone || req.ip;
  },
  message: {
    message: "OTP already sent. Please wait before retrying.",
  },
});

export const loginLimiter = rateLimit({
  store: new RedisStore({
    sendCommand: (...args) => redis.call(...args),
  }),
  windowMs: 15 * 60 * 1000,
  max: 5,
  keyGenerator: (req) => `${req.ip}:${req.body.email}`,
  message: {
    message: "Too many login attempts. Try again later.",
  },
});
