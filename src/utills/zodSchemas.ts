import { z } from "zod";

export const emailSchema = z
  .string({ message: "Email is required" })
  .trim()
  .toLowerCase()
  .email("Invalid email format");

export const passwordSchema = z
  .string({ message: "Password is required" })
  .min(8, "Password must be at least 8 characters")
  .regex(/[a-zA-Z]/, "Password must contain at least one letter")
  .regex(/\d/, "Password must contain at least one number");

export const otpCodeSchema = z.coerce
  .number({ message: "Verification code is required" })
  .int("Verification code must be a whole number");

export const otpCodeStringSchema = z
  .string({ message: "Code is required" })
  .length(6, "Code must be 6 characters");

export const nameSchema = z
  .string({ message: "Name is required" })
  .trim()
  .min(3, "Name must be at least 3 characters");
