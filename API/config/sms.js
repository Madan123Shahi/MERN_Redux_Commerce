// smsService.js

import Twilio from "twilio";

const ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
const AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;
const FROM_NUMBER = process.env.TWILIO_FROM;

// Create client only if keys exist (important for production)
let client = null;

if (ACCOUNT_SID && AUTH_TOKEN) {
  client = Twilio(ACCOUNT_SID, AUTH_TOKEN);
  console.log("Twilio SMS service initialized");
} else {
  console.warn("⚠️ Twilio not configured — SMS sending disabled");
}

// --------------------------------------------
// Send SMS (Real world logic)
// --------------------------------------------
export const sendSms = async ({ to, body }) => {
  if (!client) {
    console.error("SMS not sent: Twilio not configured");
    return { success: false, error: "Twilio not configured" };
  }

  try {
    const response = await client.messages.create({
      body,
      from: FROM_NUMBER,
      to,
    });

    return { success: true, sid: response.sid };
  } catch (err) {
    console.error("Failed to send SMS:", err.message);

    return {
      success: false,
      error: err.message || "Unknown SMS error",
    };
  }
};
