import { z } from "zod";
import { AllowSignupRoles } from "../../utills/roles";
import {
  emailSchema,
  nameSchema,
  otpCodeSchema,
  otpCodeStringSchema,
  passwordSchema,
} from "../../utills/zodSchemas";

const registerValidation = z.object({
  body: z.object({
    name: nameSchema,
    email: emailSchema,
    password: passwordSchema,
    role: z.enum(AllowSignupRoles, { message: "Role is required" }),
  }),
});

const verificationValidation = z.object({
  body: z.object({
    code: otpCodeSchema,
    email: emailSchema,
  }),
});

const loginValidation = z.object({
  body: z.object({
    email: emailSchema,
    password: z.string({ message: "Password is required" }),
    fcmToken: z.string().optional(),
  }),
});

const forgotPasswordValidation = z.object({
  body: z.object({
    email: emailSchema,
  }),
});

const resetPasswordValidation = z.object({
  body: z.object({
    code: otpCodeStringSchema,
    email: emailSchema,
    newPassword: passwordSchema,
  }),
});

const changePasswordValidation = z.object({
  body: z
    .object({
      oldPassword: z.string({ message: "Current password is required" }),
      newPassword: passwordSchema,
      confirmPassword: z.string({ message: "Confirm password is required" }),
    })
    .refine((data) => data.confirmPassword === data.newPassword, {
      message: "Confirm password must match new password",
      path: ["confirmPassword"],
    }),
});

const refreshTokenValidation = z.object({
  body: z.object({
    refreshToken: z.string({ message: "Refresh token is required" }),
  }),
});

const resendVerificationValidation = z.object({
  body: z.object({
    email: emailSchema,
  }),
});

export type RegisterInput = z.infer<typeof registerValidation>["body"];
export type LoginInput = z.infer<typeof loginValidation>["body"];
export type VerificationInput = z.infer<typeof verificationValidation>["body"];
export type ForgotPasswordInput = z.infer<typeof forgotPasswordValidation>["body"];
export type ResetPasswordInput = z.infer<typeof resetPasswordValidation>["body"];
export type ChangePasswordInput = z.infer<typeof changePasswordValidation>["body"];
export type RefreshTokenInput = z.infer<typeof refreshTokenValidation>["body"];
export type ResendVerificationInput = z.infer<
  typeof resendVerificationValidation
>["body"];

const authValidator = {
  registerValidation,
  verificationValidation,
  loginValidation,
  forgotPasswordValidation,
  resetPasswordValidation,
  changePasswordValidation,
  refreshTokenValidation,
  resendVerificationValidation,
};

export default authValidator;
