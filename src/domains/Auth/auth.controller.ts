import { Request, Response } from "express";
import authService from "./auth.service";
import { handleError } from "../../lib/errorsHandle";
import httpStatus from "http-status";
import { response } from "../../lib/response";
import { ProtectedRequest } from "../../types/protected-request";

const getAuthErrorStatus = (message: string): number => {
  if (message.includes("already taken") || message.includes("already verified")) {
    return httpStatus.CONFLICT;
  }
  if (
    message.includes("Forbidden") ||
    message.includes("not verified")
  ) {
    return httpStatus.FORBIDDEN;
  }
  if (
    message.includes("not found") ||
    message.includes("Invalid credentials") ||
    message.includes("Invalid reset") ||
    message.includes("Invalid verification") ||
    message.includes("incorrect") ||
    message.includes("Invalid or expired")
  ) {
    return httpStatus.UNAUTHORIZED;
  }
  return httpStatus.INTERNAL_SERVER_ERROR;
};

const sendAuthError = (res: Response, error: unknown) => {
  const handledError = handleError(error);
  const statusCode = getAuthErrorStatus(handledError.message);
  res.status(statusCode).json(
    response({
      message: handledError.message,
      status: "ERROR",
      statusCode,
      data: {},
    })
  );
};

const register = async (req: Request, res: Response) => {
  try {
    const user = await authService.register(req.body);
    res.status(httpStatus.CREATED).json(
      response({
        message: "User created successfully",
        status: "OK",
        statusCode: httpStatus.CREATED,
        data: user,
      })
    );
  } catch (error) {
    sendAuthError(res, error);
  }
};

const verifyEmail = async (req: Request, res: Response) => {
  try {
    const { email, code } = req.body;
    const result = await authService.verifyEmail(email, Number(code));
    res.status(httpStatus.OK).json(
      response({
        message: result.message,
        status: "OK",
        statusCode: httpStatus.OK,
        data: result,
      })
    );
  } catch (error) {
    sendAuthError(res, error);
  }
};

const login = async (req: Request, res: Response) => {
  try {
    const { email, password, fcmToken } = req.body;
    const result = await authService.loginUser(email, password, fcmToken);
    res.status(httpStatus.OK).json(
      response({
        message: "Login successful",
        status: "OK",
        statusCode: httpStatus.OK,
        data: result,
      })
    );
  } catch (error) {
    sendAuthError(res, error);
  }
};

const forgotPassword = async (req: Request, res: Response) => {
  try {
    const result = await authService.forgotPassword(req.body.email);
    res.status(httpStatus.OK).json(
      response({
        message: result.message,
        status: "OK",
        statusCode: httpStatus.OK,
        data: result,
      })
    );
  } catch (error) {
    sendAuthError(res, error);
  }
};

const resetPassword = async (req: Request, res: Response) => {
  try {
    const { code, newPassword, email } = req.body;
    const result = await authService.resetPassword(email, code, newPassword);
    res.status(httpStatus.OK).json(
      response({
        message: result.message,
        status: "OK",
        statusCode: httpStatus.OK,
        data: result,
      })
    );
  } catch (error) {
    sendAuthError(res, error);
  }
};

const changePassword = async (req: ProtectedRequest, res: Response) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const result = await authService.changePassword(
      req.user!._id,
      oldPassword,
      newPassword
    );
    res.status(httpStatus.OK).json(
      response({
        message: result.message,
        status: "OK",
        statusCode: httpStatus.OK,
        data: result,
      })
    );
  } catch (error) {
    sendAuthError(res, error);
  }
};

const resendVerification = async (req: Request, res: Response) => {
  try {
    const result = await authService.resendVerificationEmail(req.body.email);
    res.status(httpStatus.OK).json(
      response({
        message: result.message,
        status: "OK",
        statusCode: httpStatus.OK,
        data: result,
      })
    );
  } catch (error) {
    sendAuthError(res, error);
  }
};

const refreshToken = async (req: Request, res: Response) => {
  try {
    const { refreshToken: token } = req.body;
    const result = await authService.refreshAccessToken(token);
    res.status(httpStatus.OK).json(
      response({
        message: "Token refreshed successfully",
        status: "OK",
        statusCode: httpStatus.OK,
        data: result,
      })
    );
  } catch (error) {
    sendAuthError(res, error);
  }
};

const deleteUser = async (req: ProtectedRequest, res: Response) => {
  try {
    const result = await authService.deleteUser(
      req.params.userId as string,
      req.user!._id,
      req.user!.role
    );
    res.status(httpStatus.OK).json(
      response({
        message: result.message,
        status: "OK",
        statusCode: httpStatus.OK,
        data: result,
      })
    );
  } catch (error) {
    sendAuthError(res, error);
  }
};

const logout = async (req: Request, res: Response) => {
  try {
    const refreshToken = req.body.refreshToken;
    if (!refreshToken) {
      return res.status(httpStatus.BAD_REQUEST).json(
        response({
          message: "Refresh token is required",
          status: "ERROR",
          statusCode: httpStatus.BAD_REQUEST,
          data: {},
        })
      );
    }

    const result = await authService.logout(refreshToken);
    res.status(httpStatus.OK).json(
      response({
        message: result.message,
        status: "OK",
        statusCode: httpStatus.OK,
        data: result,
      })
    );
  } catch (error) {
    sendAuthError(res, error);
  }
};

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
