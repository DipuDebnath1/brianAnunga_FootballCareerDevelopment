import { NextFunction, Request, RequestHandler, Response } from "express";
import httpStatus from "http-status";
import config from "../../config/index";
import AppError from "../../ErrorHandler/AppError";
import catchAsync from "../../utills/catchAsync";
import sendResponse from "../../utills/sendResponse";
import { ProtectedRequest } from "../../types/protected-request";
import {
  generateAuthTokens,
  invalidateUserAuthToken,
  refreshUserAuthToken,
} from "../tokens/token.service";
import { AuthServices } from "./auth.service";
import { SignUpInput } from "./auth.interface";

const setWebAuthCookies = (
  res: Response,
  tokens: { accessToken: string; refreshToken: string }
) => {
  res.cookie("access_token", tokens.accessToken, {
    httpOnly: true,
    secure: config.isProduction,
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.cookie("refresh_token", tokens.refreshToken, {
    httpOnly: true,
    secure: config.isProduction,
    sameSite: "strict",
    maxAge: 30 * 24 * 60 * 60 * 1000,
  });
};

const createUser: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const userData = req.body as SignUpInput;

    if (req.file) {
      userData.image = `/uploads/users/${req.file.filename}`;
    }

    const result = await AuthServices.createUser(userData);

    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: "please verify OTP sent to email",
      data: config.isProduction
        ? undefined
        : { oneTimeCode: result?.oneTimeCode ?? null },
    });
  }
);

const LoginUser: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const data = await AuthServices.loginUser(req.body);
    const tokens = await generateAuthTokens(data._id.toString());

    if (req.body?.device === "web") {
      setWebAuthCookies(res, tokens);
    }

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "User Sign in successfully",
      data,
      tokens,
    });
  }
);

const LoginAdmin: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const data = await AuthServices.loginUser(req.body);

    if (data.role !== "admin" && data.role !== "superAdmin") {
      throw new AppError(httpStatus.UNAUTHORIZED, "wrong credentials");
    }

    const tokens = await generateAuthTokens(data._id.toString());
    setWebAuthCookies(res, tokens);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Admin Sign in successfully",
      data,
      tokens,
    });
  }
);

const VerifyOtp: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const { email, oneTimeCode } = req.body;
    await AuthServices.verifyOtp(email, oneTimeCode);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "oneTimeCode verified successfully",
      data: {},
    });
  }
);

const ForgotPassword: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const { email } = req.body;
    const result = await AuthServices.forgotPassword(email);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "OTP sent to email",
      data: config.isProduction
        ? undefined
        : { oneTimeCode: result?.oneTimeCode ?? null },
    });
  }
);

const ResetPassword: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const { email, password } = req.body;
    await AuthServices.resetPassword(email, password);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Password reset successfully",
      data: {},
    });
  }
);

const UpdatePassword: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const { user } = req as ProtectedRequest;
    const { oldPassword, newPassword } = req.body;

    await AuthServices.updatePassword(user!.email, oldPassword, newPassword);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Password changed successfully",
      data: {},
    });
  }
);

const LogoutUser: RequestHandler = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    let token: string | undefined = req.cookies?.refresh_token;

    if (!token) token = req.body.refresh_token;
    if (!token) {
      return next(new AppError(httpStatus.BAD_REQUEST, "Token is required"));
    }

    await invalidateUserAuthToken(token);
    res.clearCookie("access_token");
    res.clearCookie("refresh_token");

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "User logged out successfully",
      data: null,
    });
  }
);

const RefreshUserToken: RequestHandler = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    let token: string | undefined = req.cookies?.refresh_token;

    if (!token) token = req.body.refresh_token;
    if (!token) {
      return next(new AppError(httpStatus.BAD_REQUEST, "Token is required"));
    }

    const tokens = await refreshUserAuthToken(token);

    if (req.body?.type === "web") {
      setWebAuthCookies(res, tokens);
    }

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "User token refreshed successfully",
      data: null,
      tokens,
    });
  }
);

const LoginWithOAuth: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const { token, provider, name, email, image } = req.body;

    if (!token || !provider) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "Token and provider are required"
      );
    }

    if (provider !== "google") {
      throw new AppError(httpStatus.BAD_REQUEST, "Invalid provider");
    }

    const result = await AuthServices.googleLogin(name, email, image);
    const tokens = await generateAuthTokens(result._id.toString());

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "User logged in successfully",
      data: result,
      tokens,
    });
  }
);

export const AuthController = {
  createUser,
  LoginUser,
  LoginAdmin,
  LogoutUser,
  LoginWithOAuth,
  UpdatePassword,
  ResetPassword,
  ForgotPassword,
  VerifyOtp,
  RefreshUserToken,
};

export default AuthController;
