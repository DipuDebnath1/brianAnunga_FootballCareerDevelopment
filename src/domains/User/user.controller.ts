import { Request, RequestHandler, Response } from "express";
import httpStatus from "http-status";
import AppError from "../../ErrorHandler/AppError";
import { ProtectedRequest } from "../../types/protected-request";
import catchAsync from "../../utills/catchAsync";
import sendResponse from "../../utills/sendResponse";
import { UserServices } from "./user.services";
import {
  GetAllUsersQuery,
  GetSingleUserQuery,
} from "./user.validation";

const getAllUsers: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const query = req.query as GetAllUsersQuery;
    const users = await UserServices.getAllUsers(query);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Users retrieved successfully",
      data: users,
    });
  }
);

const getSingleUser: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const userId = req.params.userId as string;
    const { select, profileSelect } = req.query as GetSingleUserQuery;

    const result = await UserServices.getSingleUser(userId, {
      userSelect: select,
      profileSelect,
    });

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "User retrieved successfully",
      data: result,
    });
  }
);

const getProfile: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const { user } = req as ProtectedRequest;
    const { select, profileSelect } = req.query as GetSingleUserQuery;

    const profile = await UserServices.getUserWithProfile(user!._id, {
      userSelect: select,
      profileSelect,
    });

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "User profile retrieved successfully",
      data: profile,
    });
  }
);

const updateUserImage: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const { user } = req as ProtectedRequest;

    if (!req.file) {
      throw new AppError(httpStatus.BAD_REQUEST, "Image file is required");
    }

    const updatedUser = await UserServices.updateUserImage(
      user!._id,
      `/uploads/users/${req.file.filename}`
    );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "User image updated successfully",
      data: updatedUser,
    });
  }
);

const updateProfile: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const { user } = req as ProtectedRequest;
    const payload = req.body as Record<string, unknown>;

    await UserServices.updateUserAndProfile(user!._id, payload);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Profile updated successfully",
      data: null,
    });
  }
);

export const UserController = {
  getAllUsers,
  getSingleUser,
  getProfile,
  updateUserImage,
  updateProfile,
};

export default UserController;
