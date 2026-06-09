import {
  NextFunction,
  Request,
  RequestHandler,
  Response,
} from "express";
import httpStatus from "http-status";
import AppError from "../../ErrorHandler/AppError";
import catchAsync from "../../utills/catchAsync";
import sendResponse from "../../utills/sendResponse";
import { ProtectedRequest } from "../../types/protected-request";
import authService from "./auth.service";

const register: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const user = await authService.register(req.body);

    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: "User created successfully",
      data: user,
    });
  }
);

const verifyEmail: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const { email, code } = req.body;
    const result = await authService.verifyEmail(email, Number(code));

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: result.message,
      data: result,
    });
  }
);

const login: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const { email, password, fcmToken } = req.body;
    const result = await authService.loginUser(email, password, fcmToken);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Login successful",
      data: { user: result.user },
      tokens: {
        accessToken: result.accessToken,
        refreshToken: result.refreshToken,
      },
    });
  }
);

const forgotPassword: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const result = await authService.forgotPassword(req.body.email);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: result.message,
      data: result,
    });
  }
);

const resetPassword: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const { code, newPassword, email } = req.body;
    const result = await authService.resetPassword(email, code, newPassword);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: result.message,
      data: result,
    });
  }
);

const changePassword: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const { oldPassword, newPassword } = req.body;
    const { user } = req as ProtectedRequest;

    const result = await authService.changePassword(
      user!._id,
      oldPassword,
      newPassword
    );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: result.message,
      data: result,
    });
  }
);

const resendVerification: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const result = await authService.resendVerificationEmail(req.body.email);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: result.message,
      data: result,
    });
  }
);

const refreshToken: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const { refreshToken: token } = req.body;
    const result = await authService.refreshAccessToken(token);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Token refreshed successfully",
      data: { user: result.user },
      tokens: { accessToken: result.accessToken, refreshToken: token },
    });
  }
);

const deleteUser: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const { user } = req as ProtectedRequest;
    const result = await authService.deleteUser(
      req.params.userId as string,
      user!._id,
      user!.role
    );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: result.message,
      data: result,
    });
  }
);

const logout: RequestHandler = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return next(
        new AppError(httpStatus.BAD_REQUEST, "Refresh token is required")
      );
    }

    const result = await authService.logout(refreshToken);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: result.message,
      data: result,
    });
  }
);

const authController = {
  register,
  verifyEmail,
  login,
  forgotPassword,
  resetPassword,
  changePassword,
  resendVerification,
  refreshToken,
  deleteUser,
  logout,
};

export default authController;
