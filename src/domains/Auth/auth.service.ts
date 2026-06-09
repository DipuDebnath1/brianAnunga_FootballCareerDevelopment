import httpStatus from "http-status";
import AppError from "../../ErrorHandler/AppError";
import config from "../../config/index";
import {
  sendPasswordResetOtpMail,
  sendVerificationOtpMail,
} from "../../lib/sendOtp";
import User, { IAMUser } from "../User/user.model";
import {
  createRefreshToken,
  createToken,
  UserTokenPayload,
  verifyRefreshToken,
} from "./auth.token.services";

type OtpPurpose = "verify" | "reset";

const generateOtp = (): number =>
  Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000;

const buildTokenPayload = (user: IAMUser): UserTokenPayload => ({
  userId: user._id.toString(),
  role: user.role,
  name: user.name,
  email: user.email,
  image: user.image,
});

export const sanitizeUser = (user: IAMUser) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  image: user.image,
  role: user.role,
  isEmailVerified: user.isEmailVerified,
});

const issueTokens = (user: IAMUser) => {
  const payload = buildTokenPayload(user);
  const accessToken = createToken(
    payload,
    config.jwt.secret,
    config.jwt.expiresIn
  );
  const refreshToken = createRefreshToken(payload);
  return { accessToken, refreshToken };
};

const register = async (userData: {
  name: string;
  email: string;
  password: string;
  role: string;
}) => {
  const { email, password, name, role } = userData;
  let data: IAMUser;

  const existingUser = await User.findOne({ email, isDeleted: false });
  if (existingUser) {
    if (existingUser.isEmailVerified) {
      throw new AppError(httpStatus.CONFLICT, "Email is already taken");
    } else {
      existingUser.oneTimeCode = generateOtp();
      existingUser.otpPurpose = "verify" as OtpPurpose;
      await existingUser.save();
      await sendVerificationOtpMail(existingUser.email, existingUser.oneTimeCode);
      data = existingUser;
    }
  }
  else {
    const oneTimeCode = generateOtp();
    const newUser = new User({
      name,
      email,
      password,
      role,
      oneTimeCode,
      otpPurpose: "verify" as OtpPurpose,
    });
  
    await newUser.save();
    await sendVerificationOtpMail(newUser.email, oneTimeCode);
    data = newUser;
  }

  return sanitizeUser(data);
};

const verifyEmail = async (email: string, code: number) => {
  const user = await User.findOne({ email, isDeleted: false }).select(
    "name email oneTimeCode otpPurpose isEmailVerified"
  );
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }
  if (user.isEmailVerified) {
    throw new AppError(httpStatus.CONFLICT, "Email is already verified");
  }
  if (user.otpPurpose !== "verify" || user.oneTimeCode !== code) {
    throw new AppError(httpStatus.UNAUTHORIZED, "Invalid verification code");
  }

  user.isEmailVerified = true;
  user.oneTimeCode = null;
  user.otpPurpose = null;
  await user.save();

  return { message: "Email verification successful" };
};

const loginUser = async (
  email: string,
  password: string,
  fcmToken?: string
) => {
  const user = await User.findOne({ email, isDeleted: false }).select(
    "name email image password role isEmailVerified fcmToken isDeleted"
  );

  if (!user) {
    throw new AppError(httpStatus.UNAUTHORIZED, "Invalid credentials");
  }

  if (!user.isEmailVerified) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "Email is not verified. Please check your email to verify."
    );
  }

  const isMatch = await user.isPasswordMatch(password);
  if (!isMatch) {
    throw new AppError(httpStatus.UNAUTHORIZED, "Invalid credentials");
  }

  if (fcmToken) {
    user.fcmToken = fcmToken;
    await user.save();
  }

  const { accessToken, refreshToken } = issueTokens(user);

  return { user: sanitizeUser(user), accessToken, refreshToken };
};

const forgotPassword = async (email: string) => {
  const user = await User.findOne({ email, isDeleted: false });
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  const resetCode = generateOtp();
  user.oneTimeCode = resetCode;
  user.otpPurpose = "reset";
  await user.save();

  await sendPasswordResetOtpMail(user.email, resetCode);

  return { message: "Password reset email sent" };
};

const resetPassword = async (
  email: string,
  code: string,
  newPassword: string
) => {
  const user = await User.findOne({
    email,
    isDeleted: false,
    oneTimeCode: Number(code),
    otpPurpose: "reset",
  });

  if (!user) {
    throw new AppError(httpStatus.UNAUTHORIZED, "Invalid reset code");
  }

  user.password = newPassword;
  user.isResetPassword = true;
  user.oneTimeCode = null;
  user.otpPurpose = null;
  await user.save();

  return { message: "Password successfully reset" };
};

const changePassword = async (
  userId: string,
  oldPassword: string,
  newPassword: string
) => {
  const user = await User.findOne({ _id: userId, isDeleted: false });
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  const isMatch = await user.isPasswordMatch(oldPassword);
  if (!isMatch) {
    throw new AppError(httpStatus.UNAUTHORIZED, "Current password is incorrect");
  }

  user.password = newPassword;
  await user.save();

  return { message: "Password updated successfully" };
};

const resendVerificationEmail = async (email: string) => {
  const user = await User.findOne({ email, isDeleted: false });
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }
  if (user.isEmailVerified) {
    throw new AppError(httpStatus.CONFLICT, "Email is already verified");
  }

  const oneTimeCode = generateOtp();
  user.oneTimeCode = oneTimeCode;
  user.otpPurpose = "verify";
  await user.save();

  await sendVerificationOtpMail(user.email, oneTimeCode);

  return { message: "Verification email resent" };
};

const refreshAccessToken = async (refreshToken: string) => {
  let payload: UserTokenPayload;
  try {
    payload = verifyRefreshToken(refreshToken);
  } catch {
    throw new AppError(httpStatus.UNAUTHORIZED, "Invalid or expired refresh token");
  }

  const user = await User.findOne({
    _id: payload.userId,
    isDeleted: false,
  }).select("name email image role isEmailVerified");

  if (!user || !user.isEmailVerified) {
    throw new AppError(httpStatus.UNAUTHORIZED, "Invalid or expired refresh token");
  }

  const accessToken = createToken(
    buildTokenPayload(user),
    config.jwt.secret,
    config.jwt.expiresIn
  );

  return { accessToken, user: sanitizeUser(user) };
};

const deleteUser = async (
  targetUserId: string,
  callerId: string,
  callerRole: string
) => {
  if (callerRole !== "admin" && callerId !== targetUserId) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "Forbidden: you can only delete your own account"
    );
  }

  const user = await User.findOne({ _id: targetUserId, isDeleted: false });
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  user.isDeleted = true;
  await user.save();

  return { message: "User deleted successfully" };
};

const logout = async (refreshToken: string) => {
  try {
    verifyRefreshToken(refreshToken);
  } catch {
    throw new AppError(httpStatus.UNAUTHORIZED, "Invalid or expired refresh token");
  }

  return { message: "Logged out successfully" };
};

const authService = {
  register,
  verifyEmail,
  loginUser,
  forgotPassword,
  resetPassword,
  changePassword,
  resendVerificationEmail,
  refreshAccessToken,
  deleteUser,
  logout,
  sanitizeUser,
};

export default authService;
