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
import { catchAsync } from "../utils/catchAsync.js";
import AppError from "../utils/appError.js";
import {
  uploadToCloudinary,
  deleteFromCloudinary,
} from "../utils/cloudinary.js";

/* ======================================
   CONSTANTS
====================================== */
const OTP_EXPIRY_MS = 5 * 60 * 1000; // 5 minutes
const OTP_RESEND_COOLDOWN_MS = 60 * 1000; // 1 minute
const MAX_LOGIN_ATTEMPTS = 5;
const LOCK_TIME_MS = 15 * 60 * 1000;

const REFRESH_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  path: "/",
  maxAge: 30 * 24 * 60 * 60 * 1000,
};

/* ======================================
   REGISTER → SEND OTP
====================================== */
export const register = catchAsync(async (req, res, next) => {
  const { email, phone, country, password } = req.body;

  if ((!email && !phone) || !password) {
    throw new AppError("Email or phone and password required", 400);
  }

  let target;
  if (phone) {
    if (!country) throw new AppError("Country code required for phone", 400);
    target = normalizePhone(phone, country).e164;
  } else target = email.toLowerCase();

  const purpose = email ? "verify-email" : "verify-phone";

  const existingOtp = await OTP.findOne({ target, purpose });
  if (existingOtp) {
    const timeSinceLastSend = Date.now() - existingOtp.lastSentAt.getTime();
    if (timeSinceLastSend < OTP_RESEND_COOLDOWN_MS) {
      const wait = Math.ceil(
        (OTP_RESEND_COOLDOWN_MS - timeSinceLastSend) / 1000
      );
      throw new AppError(
        `Please wait ${wait}s before requesting a new OTP`,
        429
      );
    }
  }

  const existingUser = await User.findOne(
    email ? { email: target } : { phone: target }
  );
  if (existingUser) throw new AppError("User already exists", 409);

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
});

/* ======================================
   VERIFY OTP → CREATE USER + TOKENS
====================================== */
export const verifyOTP = catchAsync(async (req, res, next) => {
  const { email, phone, otp, password, country } = req.body;
  if ((!email && !phone) || !otp || !password) {
    throw new AppError("Missing required fields", 400);
  }

  const target = phone
    ? normalizePhone(phone, country).e164
    : email.toLowerCase();
  const purpose = email ? "verify-email" : "verify-phone";

  const record = await OTP.findOne({ target, purpose });
  if (!record) throw new AppError("OTP not found", 400);
  if (record.expiresAt < new Date()) {
    await OTP.deleteOne({ _id: record._id });
    throw new AppError("OTP expired", 400);
  }
  if (record.attempts >= 5) {
    await OTP.deleteOne({ _id: record._id });
    throw new AppError("Too many OTP attempts. Request a new OTP.", 429);
  }

  const isValid = await compareOTP(otp, record.otpHash);
  if (!isValid) {
    record.attempts += 1;
    await record.save();
    throw new AppError("Invalid OTP", 400);
  }

  const user = await User.create({
    email: email ? target : undefined,
    phone: phone ? target : undefined,
    password,
    isVerified: true,
  });

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

  res
    .status(201)
    .json({ message: "Registration successful", accessToken, user });
});

/* ======================================
   LOGIN (EMAIL OR PHONE)
====================================== */
export const login = catchAsync(async (req, res, next) => {
  const { email, phone, password, country } = req.body;
  if ((!email && !phone) || !password) {
    throw new AppError("Email or phone and password are required", 400);
  }

  const query = email
    ? { email: email.toLowerCase() }
    : { phone: normalizePhone(phone, country).e164 };
  const user = await User.findOne(query).select("+password");
  if (!user) throw new AppError("Invalid credentials", 401);

  if (user.lockUntil && user.lockUntil > Date.now()) {
    const minutes = Math.ceil((user.lockUntil - Date.now()) / 60000);
    throw new AppError(
      `Account locked. Try again in ${minutes} minute(s).`,
      423
    );
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    user.loginAttempts += 1;
    if (user.loginAttempts >= MAX_LOGIN_ATTEMPTS) {
      user.lockUntil = new Date(Date.now() + LOCK_TIME_MS);
      user.loginAttempts = 0;
    }
    await user.save();
    throw new AppError("Invalid credentials", 401);
  }

  user.loginAttempts = 0;
  user.lockUntil = undefined;
  await user.save();

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

  res.status(200).json({
    message: "Login successful",
    accessToken,
    user: {
      id: user._id,
      email: user.email,
      phone: user.phone,
      role: user.role,
    },
  });
});

/* ======================================
   REFRESH ACCESS TOKEN
====================================== */
export const refreshAccessToken = catchAsync(async (req, res, next) => {
  const refreshToken = req.cookies?.refreshToken;
  if (!refreshToken) throw new AppError("Refresh token missing", 401);

  const tokenHash = hashToken(refreshToken);
  const storedToken = await RefreshToken.findOne({ tokenHash });

  if (!storedToken || storedToken.revoked) {
    if (storedToken?.revoked) {
      await RefreshToken.updateMany(
        { user: storedToken.user },
        { revoked: true }
      );
    }
    res.clearCookie("refreshToken", { ...REFRESH_COOKIE_OPTIONS, maxAge: 0 });
    throw new AppError("Invalid refresh token", 401);
  }

  if (storedToken.expiresAt < new Date()) {
    storedToken.revoked = true;
    await storedToken.save();
    res.clearCookie("refreshToken", { ...REFRESH_COOKIE_OPTIONS, maxAge: 0 });
    throw new AppError("Refresh token expired", 401);
  }

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
  const user = await User.findById(storedToken.user).select("-password");

  res.status(200).json({
    accessToken: newAccessToken,
    user: { id: user._id, email: user.email, role: user.role, name: user.name },
  });
});

/* ======================================
   LOGOUT
====================================== */
export const logout = catchAsync(async (req, res, next) => {
  const refreshToken = req.cookies?.refreshToken;
  if (refreshToken) {
    const tokenHash = hashToken(refreshToken);
    await RefreshToken.findOneAndDelete({ tokenHash });
  }

  res.clearCookie("refreshToken", REFRESH_COOKIE_OPTIONS);
  res.status(200).json({ message: "Logged out successfully" });
});

/* ======================================
   LOGOUT ALL DEVICES
====================================== */
export const logoutAllDevices = catchAsync(async (req, res, next) => {
  if (!req.user?.id) throw new AppError("User not authenticated", 401);

  await RefreshToken.deleteMany({ user: req.user.id });
  res.clearCookie("refreshToken", REFRESH_COOKIE_OPTIONS);
  res.status(200).json({ message: "Logged out from all devices" });
});

/* ======================================
   CHANGE PASSWORD (LOGGED-IN USER)
====================================== */
export const changePassword = catchAsync(async (req, res, next) => {
  const userId = req.user?.id;
  const { oldPassword, newPassword } = req.body;

  if (!oldPassword || !newPassword)
    throw new AppError("Old and new passwords required", 400);

  const user = await User.findById(userId).select("+password");
  if (!user) throw new AppError("User not found", 404);

  const isMatch = await user.comparePassword(oldPassword);
  if (!isMatch) throw new AppError("Old password is incorrect", 401);

  user.password = newPassword;
  await user.save();

  await RefreshToken.updateMany({ user: user._id }, { revoked: true });

  res.status(200).json({ message: "Password changed successfully" });
});

/* ======================================
   FORGOT PASSWORD → SEND OTP
====================================== */
export const forgotPassword = catchAsync(async (req, res, next) => {
  const { email, phone, country } = req.body;
  if (!email && !phone) throw new AppError("Email or phone required", 400);

  const target = email
    ? email.toLowerCase()
    : normalizePhone(phone, country).e164;

  const user = await User.findOne(
    email ? { email: target } : { phone: target }
  );
  if (!user) throw new AppError("User not found", 404);

  const otp = generateOTP();
  const otpHash = await hashOTP(otp);

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

  res.status(200).json({ message: "OTP sent for password reset" });
});

/* ======================================
   RESET PASSWORD USING OTP
====================================== */
export const resetPassword = catchAsync(async (req, res, next) => {
  const { email, phone, country, otp, newPassword } = req.body;
  if ((!email && !phone) || !otp || !newPassword)
    throw new AppError("Required fields missing", 400);

  const target = email
    ? email.toLowerCase()
    : normalizePhone(phone, country).e164;
  const record = await OTP.findOne({ target, purpose: "reset-password" });

  if (!record) throw new AppError("OTP not found", 400);
  if (record.expiresAt < new Date()) {
    await OTP.deleteOne({ _id: record._id });
    throw new AppError("OTP expired", 400);
  }

  const isValid = await compareOTP(otp, record.otpHash);
  if (!isValid) {
    record.attempts = (record.attempts || 0) + 1;
    await record.save();
    throw new AppError("Invalid OTP", 400);
  }

  const user = await User.findOne(
    email ? { email: target } : { phone: target }
  ).select("+password");
  if (!user) throw new AppError("User not found", 404);

  user.password = newPassword;
  await user.save();

  await OTP.deleteOne({ _id: record._id });
  await RefreshToken.updateMany({ user: user._id }, { revoked: true });

  res.status(200).json({ message: "Password reset successfully" });
});

/* ======================================
   GET CURRENT USER (ME)
====================================== */
export const getMe = catchAsync(async (req, res, next) => {
  if (!req.user?.id) throw new AppError("User not authenticated", 401);

  const user = await User.findById(req.user.id).select("-password");
  res.status(200).json({ user });
});

/* ======================================
   ADMIN LOGIN
====================================== */
export const loginAdmin = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) throw new AppError("All fields are required", 400);

  const admin = await User.findOne({ email, role: "admin" }).select(
    "+password"
  );
  if (!admin) throw new AppError("Email is wrong", 401);

  const isMatch = await admin.comparePassword(password);
  if (!isMatch) throw new AppError("Password doesn't match", 401);

  await RefreshToken.updateMany(
    { user: admin._id, revoked: false },
    { revoked: true }
  );

  const accessToken = generateToken(admin._id);
  const refresh = generateRefreshToken();

  await RefreshToken.create({
    user: admin._id,
    tokenHash: refresh.tokenHash,
    ip: req.ip,
    userAgent: req.get("user-agent"),
    expiresAt: refresh.expiresAt,
  });

  res.cookie("refreshToken", refresh.token, REFRESH_COOKIE_OPTIONS);

  res.status(200).json({
    message: "Admin login successful",
    accessToken,
    admin: {
      id: admin._id,
      email: admin.email,
      name: admin.name,
      role: admin.role,
    },
  });
});

/* ======================================
   LOGOUT ADMIN
====================================== */
export const logoutAdmin = catchAsync(async (req, res, next) => {
  const refreshToken = req.cookies?.refreshToken;

  if (refreshToken) {
    const tokenHash = hashToken(refreshToken);
    await RefreshToken.updateOne(
      { tokenHash, revoked: false },
      { revoked: true }
    );
  }

  res.clearCookie("refreshToken", { ...REFRESH_COOKIE_OPTIONS, maxAge: 0 });
  res.status(200).json({ message: "Logged out successfully" });
});

export const uploadAvatar = catchAsync(async (req, res, next) => {
  if (!req.file) return next(new AppError("No image uploaded", 400));

  const user = await User.findById(req.user.id);

  // 1. Generic Delete: Clean up the old image if it exists
  if (user.avatar?.publicId) {
    await deleteFromCloudinary(user.avatar.publicId);
  }

  // 2. Generic Upload: Upload the new image
  const result = await uploadToCloudinary(req.file.buffer, "avatars");

  // 3. Update Database
  user.avatar = {
    url: result.secure_url,
    publicId: result.public_id,
  };
  await user.save();

  res.status(200).json({
    status: "success",
    data: { avatar: user.avatar.url },
  });
});
