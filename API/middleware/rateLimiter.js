// middleware/rateLimiter.js
import rateLimit, { ipKeyGenerator } from "express-rate-limit";
import RedisStore from "rate-limit-redis";
import redis from "../config/redis.js";

/* ======================================
   REDIS STORE FACTORY (IMPORTANT)
====================================== */
const createRedisStore = (prefix) =>
  new RedisStore({
    sendCommand: (...args) => redis.call(...args),
    prefix, // ✅ UNIQUE PREFIX PER LIMITER
  });

/* ======================================
   GENERAL API LIMITER
====================================== */
export const limiter = rateLimit({
  store: createRedisStore("rl:global"),
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => ipKeyGenerator(req),
  message: {
    message: "Too many requests from this IP, please try again later.",
  },
});

/* ======================================
   OTP VERIFY LIMITER
====================================== */
export const otpVerifyLimiter = rateLimit({
  store: createRedisStore("rl:otp:verify"),
  windowMs: 10 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) =>
    `${ipKeyGenerator(req)}:${req.body.email || req.body.phone || "anon"}`,
  message: {
    message: "Too many OTP attempts. Please request a new OTP.",
  },
});

/* ======================================
   OTP SEND LIMITER
====================================== */
export const otpSendLimiter = rateLimit({
  store: createRedisStore("rl:otp:send"),
  windowMs: 15 * 60 * 1000,
  max: 3,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) =>
    `${ipKeyGenerator(req)}:${req.body.email || req.body.phone || "anon"}`,
  message: {
    message: "OTP already sent. Please wait before retrying.",
  },
});

/* ======================================
   LOGIN LIMITER
====================================== */
export const loginLimiter = rateLimit({
  store: createRedisStore("rl:login"),
  windowMs: 2 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) =>
    `${ipKeyGenerator(req)}:${req.body.email || req.body.phone || "anon"}`,
  message: {
    message: "Too many login attempts. Try again later.",
  },
});
