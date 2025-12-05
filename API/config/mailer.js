import nodemailer from "nodemailer";

const port = Number(process.env.SMTP_PORT) || 587;

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: port,
  secure: port === 465, // true only for 465
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  tls: {
    rejectUnauthorized: false, // optional for sandbox/test
  },
  connectionTimeout: 10_000, // 10 seconds
});

// Verify SMTP connection once when server starts
export const verifySMTP = async () => {
  try {
    await transporter.verify();
    console.log("📧 SMTP server is ready to send emails");
  } catch (error) {
    console.error("❌ SMTP connection failed:", error.message);
  }
};

export const sendEmail = async ({ to, subject, html, text }) => {
  try {
    const msg = {
      from: process.env.EMAIL_FROM,
      to,
      subject,
      text: text || "Your email client does not support HTML email.",
      html,
    };

    const info = await transporter.sendMail(msg);
    console.log("📨 Email sent:", info.messageId);
    return info;
  } catch (error) {
    console.error("❌ Email send error:", error.message);
    throw new Error("Failed to send email");
  }
};
