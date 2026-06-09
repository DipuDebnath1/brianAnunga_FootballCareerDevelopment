import nodemailer, { Transporter } from "nodemailer";
import config from "../config/index";
import logger from "./logger";

const transport: Transporter = nodemailer.createTransport(config.email.smtp);

const verifyEmailTransport = async () => {
  if (config.nodeEnv === "test") return;

  try {
    await transport.verify();
    logger.info("Connected to email server");
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    logger.warn(
      "Unable to connect to email server. Make sure you have configured the SMTP options in .env"
    );
    logger.error(`SMTP connection error: ${message}`);
  }
};
verifyEmailTransport();

export const sendEmail = async (to: string, subject: string, text: string) => {
  const mailOptions = {
    from: config.email.smtp.auth.user,
    to,
    subject,
    text,
  };

  try {
    await transport.sendMail(mailOptions);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    logger.error(`Error sending email: ${message}`);
    throw new Error("Error sending email");
  }
};
