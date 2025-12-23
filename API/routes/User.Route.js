import express from "express";
const router = express.Router();

import {
  registerSchema,
  loginAdminSchema,
  registerAdminSchema,
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
  registerAdmin,
  login,
  changePassword,
  forgotPassword,
  resetPassword,
  logout,
  logoutAllDevices,
} from "../controllers/Auth.Controller.js";

import {
  otpSendLimiter,
  loginLimiter,
  otpVerifyLimiter,
} from "../middleware/rateLimiter.js";

import { protect } from "../middleware/auth.js"; // JWT auth middleware

/* ======================================
   AUTH ROUTES
====================================== */

// Registration & OTP
router.post("/register", otpSendLimiter, validate(registerSchema), register);
router.post("/verify", otpVerifyLimiter, verifyOTP);

// Login
router.post("/login", loginLimiter, validate(loginSchema), login);
router.post("/loginAdmin", validate(loginAdminSchema), loginAdmin);

// Admin registration
router.post("/registerAdmin", validate(registerAdminSchema), registerAdmin);

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

router.post("/logout", protect, logout);
router.post("/logout-all", protect, logoutAllDevices);

export default router;
