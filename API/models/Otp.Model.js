import mongoose from "mongoose";

const otpSchema = new mongoose.Schema(
  {
    target: {
      type: String,
      required: true,
    },
    purpose: {
      type: String,
      enum: ["verify-email", "verify-phone", "login-otp"],
      required: true,
    },
    otpHash: {
      type: String,
      required: true,
    },
    attempts: { type: Number, default: 0 },
  },
  { timestamps: true }
);

otpSchema.index({ target: 1, purpose: 1 });
otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 }); // optional TTL at DB level

const OTP = mongoose.model("Otp", otpSchema);

export default OTP;
