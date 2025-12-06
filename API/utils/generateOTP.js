import crypto from "crypto";
import bcrypt from "bcrypt";

export const generateOTP = () => {
  const otp = crypto.randomInt(100000, 1000000).toString(); // OTPs are Strings even if it is numeric
  console.log(otp);
  return otp;
};

export const hashOTP = async (otp) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(otp, salt);
};

export const compareOTP = async (otp, otpHash) => {
  return bcrypt.compare(otp, otpHash); // Here otpHash which we declare in our model
};
