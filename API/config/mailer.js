// Production Based
import nodemailer from "nodemailer";
import { env } from "../config/env.js";

const port = env.SMTP_PORT || 587;

const smtpEnabled = Boolean(env.SMTP_HOST && env.SMTP_USER && env.SMTP_PASS);

let transporter;

if (smtpEnabled) {
  transporter = nodemailer.createTransport({
    host: env.SMTP_HOST,
    port,
    secure: port === 465,
    pool: true,
    maxConnections: 5,
    maxMessages: 100,
    auth: {
      user: env.SMTP_USER,
      pass: env.SMTP_PASS,
    },
    connectionTimeout: 10_000,
  });
} else {
  console.warn("📧 SMTP not configured – email disabled");
}

export const verifySMTP = async () => {
  if (!smtpEnabled) return;

  try {
    await transporter.verify();
    console.log("📧 SMTP server verified");
  } catch (err) {
    console.error("❌ SMTP verify failed");
    if (env.NODE_ENV !== "production") console.error(err);
  }
};

export const sendEmail = async ({ to, subject, html, text }) => {
  if (!smtpEnabled) return;

  try {
    return await transporter.sendMail({
      from: env.EMAIL_FROM,
      to,
      subject,
      text: text || "Email client does not support HTML",
      html,
    });
  } catch (err) {
    if (env.NODE_ENV !== "production") console.error(err);
    throw new Error("Email service unavailable");
  }
};
