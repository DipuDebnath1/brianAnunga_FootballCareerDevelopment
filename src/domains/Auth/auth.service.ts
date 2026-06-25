import httpStatus from "http-status";
import AppError from "../../ErrorHandler/AppError";
import { sendVerificationOtpMail } from "../../lib/sendOtp";
import { generateOtp } from "../../utills/generateOtp";
import { ROLE } from "../../utills/roles";
import { UserDocument } from "../User/user.interface";
import User from "../User/user.model";
import { SignInInput, SignUpInput } from "./auth.interface";

const loginUser = async (loginData: SignInInput) => {
  const { email, password, fcmToken } = loginData;

  const user = await User.findOne({ email, isDeleted: false }).select(
    "name email image role password isDeleted isEmailVerified fcmToken"
  );

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found !");
  }

  if (user.isDeleted) {
    throw new AppError(httpStatus.BAD_REQUEST, "User account is deleted !");
  }

  if (!user.isEmailVerified) {
    throw new AppError(httpStatus.UNAUTHORIZED, "Email is not verified !");
  }

  const matchPassword = await user.isPasswordMatch(password);
  if (!matchPassword) {
    throw new AppError(httpStatus.UNAUTHORIZED, "wrong credentials !");
  }

  if (fcmToken) {
    user.fcmToken = fcmToken;
    await user.save();
  }

  return user;
};

const createUser = async (userData: SignUpInput, code: number):Promise<UserDocument> => {
  const { email, password, name, role } = userData;
  const existingUser = await User.findOne({ email }).select("email isDeleted isEmailVerified role");

  if (existingUser) {
    if (existingUser.isDeleted) 
      throw new AppError(httpStatus.FORBIDDEN, "User is deleted");
    

    if (existingUser.isEmailVerified) 
      throw new AppError(httpStatus.CONFLICT, "User already exists");

    existingUser.name = name;
    existingUser.password = password;
    if (role) existingUser.role = role;

    existingUser.oneTimeCode = Number(code);
    existingUser.isResetPassword = false;
    await existingUser.save();
    
    return existingUser;
  }

  const newUser = await User.create({
    name,
    email,
    password,
    role: role ?? ROLE.player,
    oneTimeCode: Number(code),
  });

  return newUser;
};

const forgotPassword = async (email: string) => {
  const user = await User.findOne({ email, isDeleted: false }).select(
    "email isResetPassword oneTimeCode"
  );

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found !");
  }

  const code = generateOtp();
  user.oneTimeCode = Number(code);
  user.isResetPassword = true;
  await user.save();
  sendVerificationOtpMail(user.email, code);

  return user;
};

const resetPassword = async (email: string, newPassword: string) => {
  const user = await User.findOne({ email, isDeleted: false }).select(
    "email isResetPassword password"
  );

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found !");
  }

  if (!user.isResetPassword) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "User is not in reset password state !"
    );
  }

  user.password = newPassword;
  user.isResetPassword = false;
  await user.save();

  return user;
};

const updatePassword = async (
  email: string,
  oldPassword: string,
  newPassword: string
) => {
  const user = await User.findOne({ email, isDeleted: false }).select(
    "email password"
  );

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found !");
  }

  const matchPassword = await user.isPasswordMatch(oldPassword);
  if (!matchPassword) {
    throw new AppError(httpStatus.UNAUTHORIZED, "Old password is incorrect !");
  }

  user.password = newPassword;
  await user.save();

  return user;
};

const verifyOtp = async (email: string, otp: string) => {
  const user = await User.findOne({ email, isDeleted: false }).select(
    "email oneTimeCode isEmailVerified"
  );

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found !");
  }

  if (Number(user.oneTimeCode) !== Number(otp)) {
    throw new AppError(httpStatus.UNAUTHORIZED, "Invalid OTP !");
  }

  user.isEmailVerified = true;
  user.oneTimeCode = null;
  await user.save();

  return user;
};

const googleLogin = async (
  name: string,
  email: string,
  image?: string
): Promise<UserDocument> => {
  let user = await User.findOne({ email, isDeleted: false }).select(
    "name email image role"
  );

  if (!user) {
    user = await User.create({
      name,
      email,
      image: image ?? "",
      password: `OAuth@${generateOtp()}`,
      isEmailVerified: true,
      role: ROLE.player,
    });
  }

  return user;
};

export const AuthServices = {
  createUser,
  loginUser,
  forgotPassword,
  resetPassword,
  updatePassword,
  verifyOtp,
  googleLogin,
};

export default AuthServices;
