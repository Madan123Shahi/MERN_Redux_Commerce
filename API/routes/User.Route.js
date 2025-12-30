import express from "express";
const router = express.Router();

import {
  registerSchema,
  loginAdminSchema,
  loginSchema, // for email/phone login
  changePasswordSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from "../validators/User.Schema.js";
import { validate } from "../middleware/yup.middleware.js";

import {
  register,
  verifyOTP,
  refreshAccessToken,
  loginAdmin,
  login,
  changePassword,
  forgotPassword,
  resetPassword,
  logout,
  logoutAllDevices,
  getMe,
  logoutAdmin,
} from "../controllers/Auth.Controller.js";

import {
  otpSendLimiter,
  loginLimiter,
  otpVerifyLimiter,
} from "../middleware/rateLimiter.js";

import { protect } from "../middleware/auth.js"; // JWT auth middleware
import { adminOnly } from "../middleware/role.middleware.js";

/* ======================================
   AUTH ROUTES
====================================== */

// Registration & OTP
router.post("/register", otpSendLimiter, validate(registerSchema), register);
router.post("/verify", otpVerifyLimiter, verifyOTP);

// Login
router.post("/login", loginLimiter, validate(loginSchema), login);
router.post(
  "/loginAdmin",
  loginLimiter,
  validate(loginAdminSchema),
  loginAdmin
);

// Token refresh
router.post("/refresh", refreshAccessToken);

// Change password (logged-in users)
router.post(
  "/change-password",
  protect,
  validate(changePasswordSchema),
  changePassword
);

// Forgot & reset password
router.post(
  "/forgot-password",
  otpSendLimiter,
  validate(forgotPasswordSchema),
  forgotPassword
);
router.post(
  "/reset-password",
  otpVerifyLimiter,
  validate(resetPasswordSchema),
  resetPassword
);

router.post("/logout", logout);
router.post("/logout-all", protect, logoutAllDevices);
router.get("/me", protect, getMe);
router.post("/logoutAdmin", logoutAdmin);

export default router;
