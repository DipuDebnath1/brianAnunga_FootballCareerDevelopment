import { z } from "zod";
import { AllowSignupRoles } from "../../utills/roles";

const userSignUpValidation = z.object({
  body: z.object({
    name: z
      .string({ message: "Name is required" })
      .min(2, "Name must be at least 2 characters"),
    email: z
      .string({ message: "Email is required" })
      .email("Invalid email format"),
    password: z
      .string({ message: "Password is required" })
      .min(8, "Password must be at least 8 characters")
      .regex(/[a-zA-Z]/, "Password must contain at least one letter")
      .regex(/\d/, "Password must contain at least one number"),
    role: z.enum(AllowSignupRoles).optional(),
  }),
});

const userSignInValidation = z.object({
  body: z.object({
    device: z.enum(["web", "mobile"]).optional(),
    email: z
      .string({ message: "Email is required" })
      .email("Invalid email format"),
    password: z
      .string({ message: "Password is required" })
      .min(1, "Password is required"),
    fcmToken: z.string().optional(),
  }),
});

const VerifyOtpValidation = z.object({
  body: z.object({
    email: z
      .string({ message: "Email is required" })
      .email("Invalid email format"),
    oneTimeCode: z
      .string({ message: "oneTimeCode is required" })
      .length(6, "oneTimeCode must be 6 digits"),
  }),
});

const ForgotPasswordValidation = z.object({
  body: z.object({
    email: z
      .string({ message: "Email is required" })
      .email("Invalid email format"),
  }),
});

const ResetPasswordValidation = z.object({
  body: z.object({
    email: z
      .string({ message: "Email is required" })
      .email("Invalid email format"),
    password: z
      .string({ message: "New password is required" })
      .min(8, "New password must be at least 8 characters")
      .regex(/[a-zA-Z]/, "Password must contain at least one letter")
      .regex(/\d/, "Password must contain at least one number"),
  }),
});

const updatePasswordValidation = z.object({
  body: z.object({
    oldPassword: z.string({ message: "Old password is required" }),
    newPassword: z
      .string({ message: "New password is required" })
      .min(8, "New password must be at least 8 characters")
      .regex(/[a-zA-Z]/, "Password must contain at least one letter")
      .regex(/\d/, "Password must contain at least one number"),
  }),
});

const emailVerificationSchema = z.object({
  body: z.object({
    email: z
      .string({ message: "Email is required" })
      .email("Invalid email format"),
    oneTimeCode: z
      .string({ message: "oneTimeCode code is required" })
      .length(6, "oneTimeCode code must be 6 digits"),
  }),
});

const logoutVerification = z.object({
  body: z.object({
    refresh_token: z
      .string({ message: "Refresh token is required" })
      .optional(),
  }),
});

const refreshTokenVerification = z.object({
  body: z.object({
    refresh_token: z
      .string({ message: "Refresh token is required" })
      .optional(),
    type: z.enum(["web", "mobile"]).optional(),
  }),
});

const loginWithOAuthValidation = z.object({
  body: z
    .object({
      name: z.string({ message: "OAuth name is required" }),
      email: z
        .string({ message: "OAuth email is required" })
        .email("Invalid email format"),
      image: z.string().optional(),
      token: z.string().optional(),
      provider: z.enum(["google", "facebook", "twitter", "apple", "github"], {
        message: "OAuth provider is required",
      }),
    })
    .strict(),
});

export type SignUpInput = z.infer<typeof userSignUpValidation>["body"];
export type SignInInput = z.infer<typeof userSignInValidation>["body"];
export type VerifyOtpInput = z.infer<typeof VerifyOtpValidation>["body"];
export type ForgotPasswordInput = z.infer<typeof ForgotPasswordValidation>["body"];
export type ResetPasswordInput = z.infer<typeof ResetPasswordValidation>["body"];
export type UpdatePasswordInput = z.infer<typeof updatePasswordValidation>["body"];
export type RefreshTokenInput = z.infer<typeof refreshTokenVerification>["body"];
export type LoginWithOAuthInput = z.infer<typeof loginWithOAuthValidation>["body"];

const AuthValidation = {
  userSignUpValidation,
  userSignInValidation,
  VerifyOtpValidation,
  ForgotPasswordValidation,
  ResetPasswordValidation,
  updatePasswordValidation,
  emailVerificationSchema,
  refreshTokenVerification,
  logoutVerification,
  loginWithOAuthValidation,
};

export default AuthValidation;
