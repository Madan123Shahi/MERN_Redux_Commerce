import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.Model.js";
import OTP from "../models/Otp.Model.js";
import { generateOTP } from "../utils/generateOTP.js";
import { sendEmail } from "../config/mailer.js";
import { sendSms } from "../config/sms.js";

/* ======================================
   REGISTER → SEND OTP
====================================== */
export const register = async (req, res) => {
  const { email, phone, password } = req.body;

  if ((!email && !phone) || !password) {
    return res
      .status(400)
      .json({ message: "Email or phone and password required" });
  }

  try {
    const target = email || phone;
    const purpose = email ? "verify-email" : "verify-phone";

    // check existing user
    const existingUser = await User.findOne(email ? { email } : { phone });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    const otp = generateOTP();
    const otpHash = await bcrypt.hash(otp, 10);

    // delete old OTPs
    await OTP.deleteMany({ target, purpose });

    // store OTP
    await OTP.create({
      target,
      purpose,
      otpHash,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000),
    });

    // send OTP
    if (email) {
      await sendEmail({
        to: email, // ✅ REQUIRED
        subject: "Your Registration OTP",
        text: `Your OTP is ${otp}. It expires in 5 minutes.`,
        html: `
          <div style="font-family: Arial">
            <h2>OTP Verification</h2>
            <p>Your OTP is:</p>
            <h1>${otp}</h1>
            <p>Expires in 5 minutes.</p>
          </div>
        `,
      });
    } else {
      await sendSms({
        to: phone,
        body: `Your OTP is ${otp}. Valid for 5 minutes.`,
      });
    }

    // IMPORTANT: client must resend password in verify step
    return res.status(200).json({
      message: "OTP sent successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

/* ======================================
   VERIFY OTP → CREATE USER
====================================== */
export const verifyOTP = async (req, res) => {
  const { email, phone, otp, password } = req.body;

  if ((!email && !phone) || !otp || !password) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const target = email || phone;
    const purpose = email ? "verify-email" : "verify-phone";

    const record = await OTP.findOne({ target, purpose });
    if (!record) {
      return res.status(400).json({ message: "OTP not found" });
    }

    if (record.expiresAt < Date.now()) {
      return res.status(400).json({ message: "OTP expired" });
    }

    const validOtp = await bcrypt.compare(otp, record.otpHash);
    if (!validOtp) {
      record.attempts += 1;
      await record.save();
      return res.status(400).json({ message: "Invalid OTP" });
    }

    // create user
    const user = await User.create({
      email,
      phone,
      password, // hashed via pre-save hook
      isVerified: true,
    });

    await OTP.deleteOne({ _id: record._id });

    // auth
    const token = jwt.sign({ sub: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    req.session.userId = user._id;

    return res.status(201).json({
      message: "Registration successful",
      token,
      user,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};
