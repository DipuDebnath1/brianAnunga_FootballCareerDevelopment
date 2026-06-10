import { HydratedDocument, Model } from "mongoose";
import { TRoles } from "../../utills/roles";

export type OtpPurpose = "verify" | "reset" | null;

export interface IUser {
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
  isDeleted: boolean;
}

export interface IUserMethods {
  isPasswordMatch(_password: string): Promise<boolean>;
}

export type UserDocument = HydratedDocument<IUser, IUserMethods>;
export type UserModel = Model<IUser, Record<string, never>, IUserMethods>;

/** @deprecated Use UserDocument instead */
export type IAMUser = UserDocument;
