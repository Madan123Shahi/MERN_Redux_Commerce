// import nodemailer from "nodemailer";
// import env from "../config/env.js";

// const port = Number(env.SMTP_PORT) || 587;

// const transporter = nodemailer.createTransport({
//   host: env.SMTP_HOST,
//   port: port,
//   secure: port === 465, // true only for 465
//   auth: {
//     user: env.SMTP_USER,
//     pass: env.SMTP_PASS,
//   },
//   // this code not needed in production
//   tls: {
//     rejectUnauthorized: false, // optional for sandbox/test
//   },
//   connectionTimeout: 10_000, // 10 seconds
// });

// // Verify SMTP connection once when server starts
// export const verifySMTP = async () => {
//   try {
//     await transporter.verify();
//     console.log("📧 SMTP server is ready to send emails");
//   } catch (error) {
//     console.error("❌ SMTP connection failed:", error.message);
//   }
// };

// export const sendEmail = async ({ to, subject, html, text }) => {
//   try {
//     const msg = {
//       from: env.EMAIL_FROM,
//       to,
//       subject,
//       text: text || "Your email client does not support HTML email.",
//       html,
//     };

//     const info = await transporter.sendMail(msg);
//     console.log("📨 Email sent:", info.messageId);
//     return info;
//   } catch (error) {
//     console.error("❌ Email send error:", error.message);
//     throw new Error("Failed to send email");
//   }
// };

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
