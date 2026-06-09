import dotenv from "dotenv";

dotenv.config({ quiet: true });

const config = {
  appName: process.env.APP_NAME ?? "Server Side",
  nodeEnv: process.env.NODE_ENV ?? "development",
  isProduction: process.env.NODE_ENV === "production",
  ip: process.env.BACKEND_IP ?? "localhost",
  port: Number(process.env.PORT ?? 3000),
  frontendUrl: process.env.FRONTEND_URL ?? "http://localhost:3000",
  database: {
    url: process.env.DATABASE_URL ?? "",
  },
  jwt: {
    secret: process.env.JWT_SECRET ?? "",
    expiresIn: process.env.JWT_EXPIRE_TIME ?? "30d",
    refreshSecret: process.env.JWT_REFRESH_SECRET ?? "",
    refreshExpiresIn: "30d",
  },
  email: {
    smtp: {
    host: process.env.SMTP_HOST ?? "smtp.gmail.com",
    port: Number(process.env.SMTP_PORT ?? 587),
    auth: {
      user: process.env.SMTP_MAIL ?? process.env.EMAIL_USERNAME ?? "",
      pass: process.env.SMTP_PASSWORD ?? process.env.EMAIL_PASSWORD ?? "",
    },
    from: process.env.EMAIL_FROM ?? "",
    },
  },
  redis: {
    host: process.env.REDIS_HOST ?? "localhost",
    port: Number(process.env.REDIS_PORT ?? 6379),
    password: process.env.REDIS_PASSWORD ?? "",
    db: Number(process.env.REDIS_DB ?? 0),
  },
  stripe: {
    secretKey: process.env.STRIPE_SECRET_KEY ?? "",
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET ?? "",
  },
};

export default config;
