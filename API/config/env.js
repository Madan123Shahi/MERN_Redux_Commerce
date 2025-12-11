import { cleanEnv, str, port, url } from "envalid";

export const env = cleanEnv(process.env, {
  NODE_ENV: str({
    choices: ["development", "production"],
    default: "development",
  }),
  PORT: port({ default: 8000 }),

  MONGO_URI: url(),
  REDIS_URL: url({ default: "" }), // ✅ ADD THIS

  JWT_SECRET: str(),
  SESSION_SECRET: str(),

  CLIENT_URL: url({ default: "http://localhost:5173/" }),

  SMTP_HOST: str({ default: "" }),
  SMTP_PORT: port({ default: 587 }),
  SMTP_USER: str({ default: "" }),
  SMTP_PASS: str({ default: "" }),
  EMAIL_FROM: str({ default: "" }),

  TWILIO_ACCOUNT_SID: str({ default: "" }),
  TWILIO_AUTH_TOKEN: str({ default: "" }),
  TWILIO_FROM: str({ default: "" }),
});
