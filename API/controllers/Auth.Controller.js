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
const OTP_EXPIRY_MS = 5 * 60 * 1000; // 5 minutes
const OTP_RESEND_COOLDOWN_MS = 60 * 1000; // 1 minute
const MAX_LOGIN_ATTEMPTS = 5;
const LOCK_TIME_MS = 15 * 60 * 1000;

const REFRESH_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production" ? true : false, // false in dev
  sameSite: "lax",
  path: "/", // must match login/logout
  maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
};

/* ======================================
   REGISTER → SEND OTP
====================================== */
export const register = async (req, res) => {
  const { email, phone, country, password } = req.body;
  if ((!email && !phone) || !password) {
    return res
      .status(400)
      .json({ message: "Email or phone and password required" });
  }

  try {
    let target;
    if (phone) {
      if (!country)
        return res
          .status(400)
          .json({ message: "Country code required for phone" });
      target = normalizePhone(phone, country).e164;
    } else target = email.toLowerCase();

    const purpose = email ? "verify-email" : "verify-phone";

    // 🔍 Check existing OTP
    const existingOtp = await OTP.findOne({ target, purpose });

    if (existingOtp) {
      const timeSinceLastSend = Date.now() - existingOtp.lastSentAt.getTime();

      if (timeSinceLastSend < OTP_RESEND_COOLDOWN_MS) {
        const wait = Math.ceil(
          (OTP_RESEND_COOLDOWN_MS - timeSinceLastSend) / 1000
        );

        return res.status(429).json({
          message: `Please wait ${wait}s before requesting a new OTP`,
        });
      }
    }

    const existingUser = await User.findOne(
      email ? { email: target } : { phone: target }
    );
    if (existingUser)
      return res.status(409).json({ message: "User already exists" });

    const otp = generateOTP();
    const otpHash = await hashOTP(otp);
    await OTP.deleteMany({ target, purpose });
    await OTP.create({
      target,
      purpose,
      otpHash,
      expiresAt: new Date(Date.now() + OTP_EXPIRY_MS),
    });

    if (email) await sendEmail({ to: target, subject: "OTP", text: otp });
    else await sendSms({ to: target, body: `OTP: ${otp}` });

    res.status(200).json({ message: "OTP sent" });
  } catch (err) {
    res.status(500).json({ message: err.message });
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
    if (!record) return res.status(400).json({ message: "OTP not found" });
    if (record.expiresAt < new Date()) {
      await OTP.deleteOne({ _id: record._id });
      return res.status(400).json({ message: "OTP expired" });
    }
    if (record.attempts >= 5) {
      await OTP.deleteOne({ _id: record._id });
      return res
        .status(429)
        .json({ message: "Too many OTP attempts. Request a new OTP." });
    }

    const isValid = await compareOTP(otp, record.otpHash);
    if (!isValid) {
      record.attempts += 1;
      await record.save();
      return res.status(400).json({ message: "Invalid OTP" });
    }

    const user = await User.create({
      email: email ? target : undefined,
      phone: phone ? target : undefined,
      password,
      isVerified: true,
    });

    await OTP.deleteOne({ _id: record._id });

    // Generate tokens
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

    return res
      .status(201)
      .json({ message: "Registration successful", accessToken, user });
  } catch (err) {
    console.error("Verify OTP error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

/* ======================================
   LOGOUT
====================================== */
export const logout = async (req, res) => {
  try {
    const refreshToken = req.cookies?.refreshToken;
    if (refreshToken) {
      const tokenHash = hashToken(refreshToken);
      await RefreshToken.findOneAndDelete({ tokenHash });
    }

    res.clearCookie("refreshToken", REFRESH_COOKIE_OPTIONS);

    return res.json({ message: "Logged out successfully" });
  } catch (err) {
    console.error("Logout error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

/* ======================================
   LOGOUT ALL DEVICES
====================================== */
export const logoutAllDevices = async (req, res) => {
  try {
    const userId = req.user.id; // from auth middleware
    await RefreshToken.deleteMany({ user: userId });
    res.clearCookie("refreshToken", REFRESH_COOKIE_OPTIONS);

    return res.json({ message: "Logged out from all devices" });
  } catch (err) {
    console.error("Logout all devices error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

/* ======================================
   LOGIN (EMAIL OR PHONE)
====================================== */
export const login = async (req, res) => {
  const { email, phone, password, country } = req.body;

  if ((!email && !phone) || !password) {
    return res.status(400).json({
      message: "Email or phone and password are required",
    });
  }

  try {
    /* ----------------------------------
       1️⃣ Resolve login identifier
    ---------------------------------- */
    let query = {};

    if (email) {
      query.email = email.toLowerCase();
    } else {
      if (!country) {
        return res
          .status(400)
          .json({ message: "Country code required for phone login" });
      }

      const normalized = normalizePhone(phone, country);
      query.phone = normalized.e164;
    }

    const user = await User.findOne(query).select("+password");

    /* ----------------------------------
       2️⃣ Generic failure (no user)
    ---------------------------------- */
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    /* ----------------------------------
       3️⃣ Account lock check
    ---------------------------------- */
    if (user.lockUntil && user.lockUntil > Date.now()) {
      const remainingMs = user.lockUntil - Date.now();
      const minutes = Math.ceil(remainingMs / 60000);

      return res.status(423).json({
        message: `Account locked. Try again in ${minutes} minute(s).`,
      });
    }

    /* ----------------------------------
       4️⃣ Password verification
    ---------------------------------- */
    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      user.loginAttempts += 1;

      if (user.loginAttempts >= MAX_LOGIN_ATTEMPTS) {
        user.lockUntil = new Date(Date.now() + LOCK_TIME_MS);
        user.loginAttempts = 0; // reset after lock
      }

      await user.save();

      return res.status(401).json({ message: "Invalid credentials" });
    }

    /* ----------------------------------
       5️⃣ Successful login → reset state
    ---------------------------------- */
    user.loginAttempts = 0;
    user.lockUntil = undefined;
    await user.save();

    /* ----------------------------------
       6️⃣ Refresh token rotation
    ---------------------------------- */
    await RefreshToken.deleteMany({
      user: user._id,
      userAgent: req.get("user-agent"),
    });

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

    /* ----------------------------------
       7️⃣ Final response
    ---------------------------------- */
    return res.status(200).json({
      message: "Login successful",
      accessToken,
      user: {
        id: user._id,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

/* ======================================
   CHANGE PASSWORD (LOGGED-IN USER)
====================================== */
export const changePassword = async (req, res) => {
  const userId = req.user.id; // from auth middleware
  const { oldPassword, newPassword } = req.body;

  if (!oldPassword || !newPassword) {
    return res.status(400).json({ message: "Old and new passwords required" });
  }

  try {
    const user = await User.findById(userId).select("+password");
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await user.comparePassword(oldPassword);
    if (!isMatch) {
      return res.status(401).json({ message: "Old password is incorrect" });
    }

    user.password = newPassword;
    await user.save();

    // Revoke all previous refresh tokens after password change
    await RefreshToken.updateMany({ user: user._id }, { revoked: true });

    return res.status(200).json({ message: "Password changed successfully" });
  } catch (err) {
    console.error("Change password error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

/* ======================================
   FORGOT PASSWORD → SEND OTP
====================================== */
export const forgotPassword = async (req, res) => {
  const { email, phone, country } = req.body;

  if (!email && !phone) {
    return res.status(400).json({ message: "Email or phone required" });
  }

  try {
    let target;
    if (email) {
      target = email.toLowerCase();
    } else {
      if (!country)
        return res.status(400).json({ message: "Country code required" });
      target = normalizePhone(phone, country).e164;
    }

    const user = await User.findOne(
      email ? { email: target } : { phone: target }
    );
    if (!user) return res.status(404).json({ message: "User not found" });

    const otp = generateOTP();
    const otpHash = await hashOTP(otp);

    // Delete old OTPs for same user
    await OTP.deleteMany({ target, purpose: "reset-password" });

    await OTP.create({
      target,
      purpose: "reset-password",
      otpHash,
      expiresAt: new Date(Date.now() + OTP_EXPIRY_MS),
    });

    if (email)
      await sendEmail({ to: target, subject: "Password Reset OTP", text: otp });
    else await sendSms({ to: target, body: `Password Reset OTP: ${otp}` });

    return res.status(200).json({ message: "OTP sent for password reset" });
  } catch (err) {
    console.error("Forgot password error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

/* ======================================
   RESET PASSWORD USING OTP
====================================== */
export const resetPassword = async (req, res) => {
  const { email, phone, country, otp, newPassword } = req.body;

  if ((!email && !phone) || !otp || !newPassword) {
    return res.status(400).json({ message: "Required fields missing" });
  }

  try {
    const target = email
      ? email.toLowerCase()
      : normalizePhone(phone, country).e164;
    const record = await OTP.findOne({ target, purpose: "reset-password" });

    if (!record) return res.status(400).json({ message: "OTP not found" });
    if (record.expiresAt < new Date()) {
      await OTP.deleteOne({ _id: record._id });
      return res.status(400).json({ message: "OTP expired" });
    }

    const isValid = await compareOTP(otp, record.otpHash);
    if (!isValid) {
      record.attempts = (record.attempts || 0) + 1;
      await record.save();
      return res.status(400).json({ message: "Invalid OTP" });
    }

    // OTP valid → update password
    const user = await User.findOne(
      email ? { email: target } : { phone: target }
    ).select("+password");
    if (!user) return res.status(404).json({ message: "User not found" });

    user.password = newPassword;
    await user.save();

    // Delete OTP and revoke all previous refresh tokens
    await OTP.deleteOne({ _id: record._id });
    await RefreshToken.updateMany({ user: user._id }, { revoked: true });

    return res.status(200).json({ message: "Password reset successfully" });
  } catch (err) {
    console.error("Reset password error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// GET CURRENT USER (ME)
// =========================== */
export const getMe = async (req, res) => {
  try {
    // req.user is attached by protect middleware
    const user = await User.findById(req.user._id).select("-password");
    res.status(200).json({ user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* ======================================
   ADMIN LOGIN
====================================== */
export const loginAdmin = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ message: "All fields are required" });

  try {
    const admin = await User.findOne({ email, role: "admin" }).select(
      "+password"
    );
    if (!admin) return res.status(401).json({ message: "Admin not found" });

    const isMatch = await admin.comparePassword(password);
    if (!isMatch)
      return res.status(401).json({ message: "Password doesn't match" });

    // Revoke all previous refresh tokens
    await RefreshToken.updateMany(
      { user: admin._id, revoked: false },
      { revoked: true }
    );

    // Generate tokens
    const accessToken = generateToken(admin._id);
    const refresh = generateRefreshToken();

    // Save refresh token in DB
    await RefreshToken.create({
      user: admin._id,
      tokenHash: refresh.tokenHash,
      ip: req.ip,
      userAgent: req.get("user-agent"),
      expiresAt: refresh.expiresAt,
    });

    // Set HttpOnly cookie
    res.cookie("refreshToken", refresh.token, REFRESH_COOKIE_OPTIONS);

    return res.status(200).json({
      message: "Admin login successful",
      accessToken,
      admin: {
        id: admin._id,
        email: admin.email,
        name: admin.name,
        role: admin.role,
      },
    });
  } catch (err) {
    console.error("Admin login error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

/* ======================================
   LOGOUT ADMIN
====================================== */
export const logoutAdmin = async (req, res) => {
  try {
    const refreshToken = req.cookies?.refreshToken;
    console.log(refreshToken);

    if (refreshToken) {
      const tokenHash = hashToken(refreshToken);
      await RefreshToken.updateOne(
        { tokenHash, revoked: false },
        { revoked: true }
      );
      console.log("Token revoked in DB");
    } else {
      console.log("No refresh token received from client");
    }

    // Clear cookie
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production" ? true : false,
      sameSite: "lax",
      path: "/",
      maxAge: 0,
    });

    console.log("Cookie cleared");

    return res.status(200).json({ message: "Logged out successfully" });
  } catch (err) {
    console.error("Logout error:", err);
    return res.status(500).json({ message: "Failed to log out" });
  }
};

/* ======================================
   REFRESH ACCESS TOKEN
====================================== */
export const refreshAccessToken = async (req, res) => {
  try {
    const refreshToken = req.cookies?.refreshToken;
    if (!refreshToken)
      return res.status(401).json({ message: "Refresh token missing" });

    const tokenHash = hashToken(refreshToken);
    const storedToken = await RefreshToken.findOne({ tokenHash });

    if (!storedToken || storedToken.revoked) {
      // possible reuse attack → revoke all tokens
      if (storedToken?.revoked) {
        await RefreshToken.updateMany(
          { user: storedToken.user },
          { revoked: true }
        );
      }

      res.clearCookie("refreshToken", { ...REFRESH_COOKIE_OPTIONS, maxAge: 0 });
      return res.status(401).json({ message: "Invalid refresh token" });
    }

    if (storedToken.expiresAt < new Date()) {
      storedToken.revoked = true;
      await storedToken.save();
      res.clearCookie("refreshToken", { ...REFRESH_COOKIE_OPTIONS, maxAge: 0 });
      return res.status(401).json({ message: "Refresh token expired" });
    }

    // Rotate tokens
    const newAccessToken = generateToken(storedToken.user);
    const newRefresh = generateRefreshToken();

    storedToken.revoked = true;
    storedToken.replacedByToken = newRefresh.tokenHash;
    await storedToken.save();

    await RefreshToken.create({
      user: storedToken.user,
      tokenHash: newRefresh.tokenHash,
      ip: req.ip,
      userAgent: req.get("user-agent"),
      expiresAt: newRefresh.expiresAt,
    });

    res.cookie("refreshToken", newRefresh.token, REFRESH_COOKIE_OPTIONS);

    return res.json({ accessToken: newAccessToken });
  } catch (err) {
    console.error("Refresh token error:", err);
    return res.status(500).json({ message: "Failed to refresh token" });
  }
};
