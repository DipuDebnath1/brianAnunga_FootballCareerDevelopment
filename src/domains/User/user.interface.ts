import { Document } from "mongoose";
import { TRoles } from "../../utills/roles";

export type OtpPurpose = "verify" | "reset" | null;

export interface IUser extends Document {
  name: string;
  email: string;
  phone: string;
  password: string;
  image: string;
  role: TRoles;
  oneTimeCode: number | null;
  otpPurpose: OtpPurpose;
  isEmailVerified: boolean;
  isResetPassword: boolean;
  fcmToken: string | null;
  isPasswordMatch(_password: string): Promise<boolean>;
  isDeleted: boolean;
  walletBalance: number;
}

export type UserDocument = IUser;
