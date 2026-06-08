import { sendEmail } from "../../lib/mail.service";
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
    process.env.JWT_SECRET!,
    process.env.JWT_EXPIRE_TIME!
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

  const existingUser = await User.findOne({ email, isDeleted: false });
  if (existingUser) throw new Error("Email is already taken");

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

  const verificationLink = `${process.env.FRONTEND_URL}/verify-email?code=${oneTimeCode}&email=${encodeURIComponent(email)}`;
  const emailText = `Please click the following link to verify your email address: ${verificationLink}`;
  await sendEmail(newUser.email, "Verify Your Email Address", emailText);

  return sanitizeUser(newUser);
};

const verifyEmail = async (email: string, code: number) => {
  const user = await User.findOne({ email, isDeleted: false }).select(
    "name email oneTimeCode otpPurpose isEmailVerified"
  );
  if (!user) throw new Error("User not found");
  if (user.isEmailVerified) throw new Error("Email is already verified");
  if (user.otpPurpose !== "verify")
    throw new Error("Invalid verification code");
  if (user.oneTimeCode !== code) throw new Error("Invalid verification code");

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

  if (!user) throw new Error("Invalid credentials");

  if (!user.isEmailVerified) {
    throw new Error(
      "Email is not verified. Please check your email to verify."
    );
  }

  const isMatch = await user.isPasswordMatch(password);
  if (!isMatch) throw new Error("Invalid credentials");

  if (fcmToken) {
    user.fcmToken = fcmToken;
    await user.save();
  }

  const { accessToken, refreshToken } = issueTokens(user);

  return { user: sanitizeUser(user), accessToken, refreshToken };
};

const forgotPassword = async (email: string) => {
  const user = await User.findOne({ email, isDeleted: false });
  if (!user) throw new Error("User not found");

  const resetCode = generateOtp();
  user.oneTimeCode = resetCode;
  user.otpPurpose = "reset";
  await user.save();

  const resetLink = `${process.env.FRONTEND_URL}/reset-password?code=${resetCode}&email=${encodeURIComponent(email)}`;
  const emailText = `Please click the following link to reset your password: ${resetLink}`;
  await sendEmail(user.email, "Reset Your Password", emailText);

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

  if (!user) throw new Error("Invalid reset code");

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
  if (!user) throw new Error("User not found");

  const isMatch = await user.isPasswordMatch(oldPassword);
  if (!isMatch) throw new Error("Current password is incorrect");

  user.password = newPassword;
  await user.save();

  return { message: "Password updated successfully" };
};

const resendVerificationEmail = async (email: string) => {
  const user = await User.findOne({ email, isDeleted: false });
  if (!user) throw new Error("User not found");
  if (user.isEmailVerified) throw new Error("Email is already verified");

  const oneTimeCode = generateOtp();
  user.oneTimeCode = oneTimeCode;
  user.otpPurpose = "verify";
  await user.save();

  const verificationLink = `${process.env.FRONTEND_URL}/verify-email?code=${oneTimeCode}&email=${encodeURIComponent(email)}`;
  const emailText = `Please click the following link to verify your email address: ${verificationLink}`;
  await sendEmail(user.email, "Verify Your Email Address", emailText);

  return { message: "Verification email resent" };
};

const refreshAccessToken = async (refreshToken: string) => {
  let payload: UserTokenPayload;
  try {
    payload = verifyRefreshToken(refreshToken);
  } catch {
    throw new Error("Invalid or expired refresh token");
  }

  const user = await User.findOne({
    _id: payload.userId,
    isDeleted: false,
  }).select("name email image role isEmailVerified");

  if (!user || !user.isEmailVerified) {
    throw new Error("Invalid or expired refresh token");
  }

  const accessToken = createToken(
    buildTokenPayload(user),
    process.env.JWT_SECRET!,
    process.env.JWT_EXPIRE_TIME!
  );

  return { accessToken, user: sanitizeUser(user) };
};

const deleteUser = async (
  targetUserId: string,
  callerId: string,
  callerRole: string
) => {
  if (callerRole !== "admin" && callerId !== targetUserId) {
    throw new Error("Forbidden: you can only delete your own account");
  }

  const user = await User.findOne({ _id: targetUserId, isDeleted: false });
  if (!user) throw new Error("User not found");

  user.isDeleted = true;
  await user.save();

  return { message: "User deleted successfully" };
};

const logout = async (refreshToken: string) => {
  try {
    verifyRefreshToken(refreshToken);
  } catch {
    throw new Error("Invalid or expired refresh token");
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
