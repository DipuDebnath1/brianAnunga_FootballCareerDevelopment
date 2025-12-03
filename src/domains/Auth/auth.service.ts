import { sendEmail } from "../../lib/mail.service";
import User, { IAMUser } from "../User/user.model";
import { createRefreshToken, createToken } from "./auth.token.services";

// Register User
const register = async (userData: {
  name: string;
  email: string;
  password: string;
  phoneNumber: string;
}) => {
  const { email, password, phoneNumber, name } = userData;

  // Check if email or phone number already exists
  const existingUser = await User.findOne({
    $or: [{ email }, { phoneNumber }],
  });
  if (existingUser) throw new Error("Email or Phone number is already taken");

  const oneTimeCode =
    Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000;
  const newUser = new User({
    name,
    email,
    password,
    phoneNumber,
    oneTimeCode: oneTimeCode, // Generate a one-time code for email verification
  });

  // Save User to DB
  await newUser.save();

  // Send Email Verification
  const verificationLink = `${process.env.FRONTEND_URL}/verify-email?code=${newUser.oneTimeCode}`;
  const emailText = `Please click the following link to verify your email address: ${verificationLink}`;
  await sendEmail(newUser.email, "Verify Your Email Address", emailText);

  return newUser;
};

const verifyEmail = async (email: string, code: number) => {
  // Find the user by email
  const user = await User.findOne({ email }).select("name email oneTimeCode");
  if (!user) throw new Error("User not found");
  if (user.oneTimeCode !== code) throw new Error("Invalid verification code");
  user.isEmailVerified = true;
  user.oneTimeCode = null;
  await user.save();
  return "Email Verification SuccessFul";
};

// Login User
const loginUser = async (email: string, password: string) => {
  const user = await User.findOne({ email }).select(
    "name email image password phoneNumber role isEmailVerified"
  );

  if (!user) throw new Error("User not found");

  // Check if the user's email is verified
  if (!user.isEmailVerified)
    throw new Error(
      "Email is not verified. Please check your email to verify."
    );

  const isMatch = await user.isPasswordMatch(password);
  if (!isMatch) throw new Error("Invalid credentials");
  // Generate JWT tokens
  const userDetails = {
    userId: user._id.toString(),
    role: user.role,
    name: user.name,
    email: user.email,
    image: user.image,
    password: user.password,
    phoneNumber: user.phoneNumber,
  };

  // Generate JWT tokens
  const accessToken = createToken(
    userDetails,
    process.env.JWT_SECRET!,
    process.env.JWT_EXPIRE_TIME!
  );

  const refreshToken = createRefreshToken(userDetails);

  return { user, accessToken, refreshToken };
};

// Forgot Password
const forgotPassword = async (email: string) => {
  const user = (await User.findOne({ email })) as IAMUser;
  if (!user) throw new Error("User not found");

  const resetCode = Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000;

  user.oneTimeCode = resetCode;
  await user.save();

  const resetLink = `${process.env.FRONTEND_URL}/reset-password?code=${resetCode}`;
  const emailText = `Please click the following link to reset your password: ${resetLink}`;
  sendEmail(user.email, "Reset Your Password", emailText);

  return { message: "Password reset email sent" };
};

// Reset Password
const resetPassword = async (
  email: string,
  code: string,
  newPassword: string
) => {
  const user = (await User.findOne({
    email,
    oneTimeCode: Number(code),
  })) as IAMUser;
  if (!user) {
    throw new Error("Invalid reset code");
  } else {
    user.password = newPassword;
    user.isResetPassword = true;
    user.oneTimeCode = null;
    await user.save();

    return { message: "Password successfully reset" };
  }
};

// Resend Verification Email
const resendVerificationEmail = async (email: string) => {
  const user = (await User.findOne({ email })) as IAMUser;
  if (!user) throw new Error("User not found");
  const oneTimeCode =
    Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000;
  user.oneTimeCode = oneTimeCode;
  user.save();

  const verificationLink = `${process.env.FRONTEND_URL}/verify-email?code=${oneTimeCode}`;
  const emailText = `Please click the following link to verify your email address: ${verificationLink}`;
  sendEmail(user.email, "Verify Your Email Address", emailText);

  return { message: "Verification email resent" };
};

// Delete User
const deleteUser = async (userId: string) => {
  const user = (await User.findById(userId)) as IAMUser;
  if (!user) throw new Error("User not found");

  user.isDeleted = true;
  await user.save();

  return { message: "User deleted successfully" };
};

// Logout
const logout = (refreshToken: string) => {
  return { message: "User logged out" };
};

const userService = {
  register,
  verifyEmail,
  loginUser,
  forgotPassword,
  resetPassword,
  resendVerificationEmail,
  deleteUser,
  logout,
};

export default userService;
