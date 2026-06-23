export interface UserTokenPayload {
  userId: string;
  role: string;
  name: string;
  email: string;
  image: string;
}

export type OtpPurpose = "verify" | "reset";

export type {
  RegisterInput,
  LoginInput,
  VerificationInput,
  ForgotPasswordInput,
  ResetPasswordInput,
  ChangePasswordInput,
  RefreshTokenInput,
  ResendVerificationInput,
} from "./auth.validation";
