import { Request, RequestHandler, Response } from "express";
import httpStatus from "http-status";
import AppError from "../../ErrorHandler/AppError";
import catchAsync from "../../utills/catchAsync";
import sendResponse from "../../utills/sendResponse";
import { ProtectedRequest } from "../../types/protected-request";
import userService from "./user.services";

const getAllUsers: RequestHandler = catchAsync(
  async (_req: Request, res: Response) => {
    const users = await userService.getAllUsers();

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Users retrieved successfully",
      data: users,
    });
  }
);

const userDetails: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const { user } = req as ProtectedRequest;
    const details = await userService.userDetails(user!._id);

    if (!details) {
      throw new AppError(httpStatus.NOT_FOUND, "User not found");
    }

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "User details retrieved successfully",
      data: details,
    });
  }
);

const singleFileUpload: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "File uploaded successfully",
      data: { path: (req as ProtectedRequest & { file?: { path?: string } }).file?.path ?? "" },
    });
  }
);

const multipleFileUpload: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Files uploaded successfully",
      data: { files: (req as ProtectedRequest & { files?: unknown }).files ?? {} },
    });
  }
);

const userController = {
  getAllUsers,
  userDetails,
  singleFileUpload,
  multipleFileUpload,
};

export default userController;
