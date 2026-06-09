import config from "../config/index";
import { sendEmail } from "./mail.service";

export type OtpMailPurpose = "verify" | "reset" | "generic";

type OtpMailContent = {
  subject: string;
  heading: string;
  intro: string;
  footer: string;
};

const OTP_MAIL_CONTENT: Record<OtpMailPurpose, OtpMailContent> = {
  verify: {
    subject: "Email Verification Code",
    heading: "Verify Your Email",
    intro:
      "Welcome! Use the One-Time Password (OTP) below to verify your email address and complete your registration:",
    footer:
      "If you did not create an account, you can safely ignore this email.",
  },
  reset: {
    subject: "Password Reset Code",
    heading: "Reset Your Password",
    intro:
      "We received a request to reset your password. Use the OTP below to continue:",
    footer:
      "If you did not request a password reset, please ignore this email and your password will stay the same.",
  },
  generic: {
    subject: "Your Verification Code",
    heading: "Verification Code",
    intro: "Use the One-Time Password (OTP) below to continue:",
    footer:
      "If you did not request this code, please ignore this email or contact support.",
  },
};

const generateOtpEmailTemplate = (
  otp: string,
  purpose: OtpMailPurpose
): string => {
  const { heading, intro, footer } = OTP_MAIL_CONTENT[purpose];
  const appName = config.appName || "Evolution Hub";

  return `
    <html>
      <body>
        <div style="font-family: Arial, sans-serif; font-size: 14px; line-height: 1.6; color: #333;">
          <h2 style="color: #007bff;">${heading}</h2>
          <p>Hi there,</p>
          <p>${intro}</p>

          <h3 style="font-size: 24px; color: #007bff; font-weight: bold; letter-spacing: 2px;">${otp}</h3>

          <p>This OTP is valid for 10 minutes.</p>
          <p style="font-size: 12px; color: #777;">${footer}</p>
          <p style="font-size: 12px; color: #777;">
            For your security, never share your OTP with anyone.
          </p>

          <br />
          <p>Best regards,</p>
          <p>The ${appName} Team</p>
        </div>
      </body>
    </html>
  `;
};

const formatOtp = (otp: string | number): string => String(otp).padStart(6, "0");

export const sendOtpMail = async (
  to: string,
  otp: string | number,
  purpose: OtpMailPurpose = "generic"
): Promise<void> => {
  const otpText = formatOtp(otp);
  const { subject, heading, intro } = OTP_MAIL_CONTENT[purpose];
  const html = generateOtpEmailTemplate(otpText, purpose);

  await sendEmail(to, subject, {
    text: `${heading}\n\n${intro}\n\nOTP: ${otpText}\n\nThis OTP is valid for 10 minutes.`,
    html,
  });
};

export const sendVerificationOtpMail = async (
  to: string,
  otp: string | number
): Promise<void> => sendOtpMail(to, otp, "verify");

export const sendPasswordResetOtpMail = async (
  to: string,
  otp: string | number
): Promise<void> => sendOtpMail(to, otp, "reset");

export const sendServiceOtpMail = async (
  to: string,
  otp: string | number
): Promise<void> => sendOtpMail(to, otp, "generic");

/** @deprecated Use sendVerificationOtpMail instead */
export const sendOtpVerificationMail = sendVerificationOtpMail;
