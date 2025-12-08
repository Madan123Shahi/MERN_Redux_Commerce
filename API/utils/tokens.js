import crypto from "crypto";
import jwt from "jsonwebtoken";

export const generateToken = (userId) => {
  return jwt.sign({ sub: userId }, process.env.JWT_SECRET, {
    expiresIn: "15m",
  });
};

export const generateRefreshToken = () => {
  const token = crypto.randomBytes(48).toString("hex");
  const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
  return {
    token,
    tokenHash,
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30d
  };
};

export const hashToken = crypto
  .createHash("sha256")
  .update(token)
  .digest("hex");
