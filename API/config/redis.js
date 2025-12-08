// redis.js
import Redis from "ioredis";
import env from "../config/env.js";

const redis = new Redis(env.REDIS_URL); // cloud Redis (Upstash / Redis Cloud)
redis.on("connect", () => console.log("✅ Redis connected"));
redis.on("error", (err) => console.error("❌ Redis error", err));

export default redis;
