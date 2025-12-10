import RefreshToken from "../models/RefreshToken.Model.js";
import User from "../models/User.Model.js";
import OTP from "../models/Otp.Model.js";
import {
  generateRefreshToken,
  generateToken,
  hashToken,
} from "../utils/tokens.js";
import { generateOTP, hashOTP, compareOTP } from "../utils/generateOTP.js";
import { sendEmail } from "../config/mailer.js";
import { sendSms } from "../config/sms.js";
import { normalizePhone } from "../utils/phone.js";

/* ======================================
   CONSTANTS
====================================== */
const OTP_EXPIRY_MS = 5 * 60 * 1000;
const REFRESH_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict",
  path: "/api/auth/refresh",
  maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
};

export const register = async (req, res) => {
  const { email, phone, country, password } = req.body;

  if ((!email && !phone) || !password) {
    return res
      .status(400)
      .json({ message: "Email or phone and password required" });
  }

  console.log(email);
  try {
    let target;

    if (phone) {
      if (!country) {
        return res
          .status(400)
          .json({ message: "Country code required for phone" });
      }

      target = normalizePhone(phone, country).e164; // ✅ normalized
    } else {
      target = email.toLowerCase();
    }

    const purpose = email ? "verify-email" : "verify-phone";

    const existingUser = await User.findOne(
      email ? { email: target } : { phone: target }
    );

    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    const otp = generateOTP();
    const otpHash = await hashOTP(otp);

    await OTP.deleteMany({ target, purpose });

    await OTP.create({
      target,
      purpose,
      otpHash,
      expiresAt: new Date(Date.now() + OTP_EXPIRY_MS),
    });

    if (email) {
      await sendEmail({ to: target, subject: "OTP", text: otp });
    } else {
      await sendSms({ to: target, body: `OTP: ${otp}` });
    }

    res.status(200).json({ message: "OTP sent" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

/* ======================================
   VERIFY OTP → CREATE USER + TOKENS
====================================== */
export const verifyOTP = async (req, res) => {
  const { email, phone, otp, password, country } = req.body;

  if ((!email && !phone) || !otp || !password) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const target = phone
      ? normalizePhone(phone, country).e164
      : email.toLowerCase();
    const purpose = email ? "verify-email" : "verify-phone";

    const record = await OTP.findOne({ target, purpose });
    if (!record) {
      return res.status(400).json({ message: "OTP not found" });
    }

    if (record.expiresAt < new Date()) {
      await OTP.deleteOne({ _id: record._id });
      return res.status(400).json({ message: "OTP expired" });
    }

    if (record.attempts >= 5) {
      await OTP.deleteOne({ _id: record._id });
      return res.status(429).json({
        message: "Too many OTP attempts. Please request a new OTP.",
      });
    }

    const isValid = await compareOTP(otp, record.otpHash);
    if (!isValid) {
      record.attempts += 1;
      await record.save();
      return res.status(400).json({ message: "Invalid OTP" });
    }

    // ✅ Create verified user
    const user = await User.create({
      email: email ? target : undefined,
      phone: phone ? target : undefined,
      password,
      isVerified: true,
    });

    await OTP.deleteOne({ _id: record._id });

    // ✅ Generate tokens
    const accessToken = generateToken(user._id);
    const refresh = generateRefreshToken();

    await RefreshToken.create({
      user: user._id,
      tokenHash: refresh.tokenHash,
      ip: req.ip,
      userAgent: req.get("user-agent"),
      expiresAt: refresh.expiresAt,
    });

    res.cookie("refreshToken", refresh.token, REFRESH_COOKIE_OPTIONS);
    req.session.userId = user._id;

    return res.status(201).json({
      message: "Registration successful",
      accessToken,
      user,
    });
  } catch (err) {
    console.error("Verify OTP error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

/* ======================================
   REFRESH TOKEN ROTATION
====================================== */
export const refreshAccessToken = async (req, res) => {
  try {
    const refreshToken = req.cookies?.refreshToken;
    if (!refreshToken) {
      return res.status(401).json({ message: "Refresh token missing" });
    }

    const tokenHash = hashToken(refreshToken);

    const storedToken = await RefreshToken.findOne({ tokenHash });
    if (!storedToken || storedToken.revoked) {
      res.clearCookie("refreshToken", { path: "/api/auth/refresh" });
      return res.status(401).json({ message: "Invalid refresh token" });
    }

    /* =============================
   ✅ DEVICE / SESSION BINDING
============================= */
    const sameUserAgent = storedToken.userAgent === req.get("user-agent");

    // ❌ BLOCK if UA changes (strong signal)
    if (!sameUserAgent) {
      storedToken.revoked = true;
      await storedToken.save();

      res.clearCookie("refreshToken", { path: "/api/auth/refresh" });

      return res.status(401).json({
        message: "Suspicious token use detected. Please login again.",
      });
    }
    if (storedToken.expiresAt < new Date()) {
      res.clearCookie("refreshToken", { path: "/api/auth/refresh" });
      return res.status(401).json({ message: "Refresh token expired" });
    }

    // ✅ Rotate token
    const newRefresh = generateRefreshToken();

    storedToken.revoked = true;
    storedToken.replacedByToken = newRefresh.tokenHash;
    await storedToken.save();

    await RefreshToken.create({
      user: storedToken.user,
      tokenHash: newRefresh.tokenHash,
      expiresAt: newRefresh.expiresAt,
      ip: req.ip,
      userAgent: req.get("user-agent"),
    });

    const newAccessToken = generateToken(storedToken.user);
    res.cookie("refreshToken", newRefresh.token, REFRESH_COOKIE_OPTIONS);

    return res.json({ accessToken: newAccessToken });
  } catch (err) {
    console.error("Refresh error:", err);
    return res.status(500).json({ message: "Failed to refresh token" });
  }
};

export const sendLoginOTP = async (req, res) => {
  const { email, phone } = req.body;

  if (!email && !phone) {
    return res.status(400).json({ message: "Email or phone required" });
  }

  try {
    const target = email?.toLowerCase() || phone;
    const purpose = "login-otp";

    const user = await User.findOne(
      email ? { email: target } : { phone: target }
    );

    if (!user || !user.isVerified) {
      return res
        .status(404)
        .json({ message: "User not found or not verified" });
    }

    const otp = generateOTP();
    const otpHash = await hashOTP(otp);

    await OTP.deleteMany({ target, purpose });

    await OTP.create({
      target,
      purpose,
      otpHash,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000),
    });

    if (email) {
      await sendEmail({
        to: target,
        subject: "Login OTP",
        text: `Your login OTP is ${otp}. Valid for 5 minutes.`,
      });
    } else {
      await sendSms({
        to: target,
        body: `Your login OTP is ${otp}. Valid for 5 minutes.`,
      });
    }

    return res.json({ message: "OTP sent successfully" });
  } catch (err) {
    console.error("Send login OTP error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

export const verifyLoginOTP = async (req, res) => {
  const { email, phone, otp } = req.body;

  if ((!email && !phone) || !otp) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const target = email?.toLowerCase() || phone;
    const purpose = "login-otp";

    const record = await OTP.findOne({ target, purpose });
    if (!record) {
      return res.status(400).json({ message: "OTP not found" });
    }

    if (record.expiresAt < new Date()) {
      await OTP.deleteOne({ _id: record._id });
      return res.status(400).json({ message: "OTP expired" });
    }

    if (record.attempts >= 5) {
      await OTP.deleteOne({ _id: record._id });
      return res.status(429).json({ message: "Too many attempts" });
    }

    const isValid = await compareOTP(otp, record.otpHash);
    if (!isValid) {
      record.attempts += 1;
      await record.save();
      return res.status(400).json({ message: "Invalid OTP" });
    }

    const user = await User.findOne(
      email ? { email: target } : { phone: target }
    );

    await OTP.deleteOne({ _id: record._id });

    const accessToken = generateToken(user._id);
    const refresh = generateRefreshToken();

    await RefreshToken.create({
      user: user._id,
      tokenHash: refresh.tokenHash,
      ip: req.ip,
      userAgent: req.get("user-agent"),
      expiresAt: refresh.expiresAt,
    });

    res.cookie("refreshToken", refresh.token, REFRESH_COOKIE_OPTIONS);
    req.session.userId = user._id;

    return res.json({
      message: "Login successful",
      accessToken,
      user,
    });
  } catch (err) {
    console.error("Verify login OTP error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

export const logout = async (req, res) => {
  try {
    const refreshToken = req.cookies?.refreshToken;
    if (refreshToken) {
      const tokenHash = hashToken(refreshToken);

      await RefreshToken.findOneAndUpdate({ tokenHash }, { revoked: true });
    }

    req.session.destroy(() => {});
    res.clearCookie("refreshToken", { path: "/api/auth/refresh" });

    return res.json({ message: "Logged out successfully" });
  } catch (err) {
    console.error("Logout error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

export const logoutAllDevices = async (req, res) => {
  try {
    const userId = req.user.id; // from auth middleware

    await RefreshToken.updateMany({ user: userId }, { revoked: true });

    req.session.destroy(() => {});
    res.clearCookie("refreshToken", { path: "/api/auth/refresh" });

    return res.json({ message: "Logged out from all devices" });
  } catch (err) {
    console.error("Logout all devices error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};
