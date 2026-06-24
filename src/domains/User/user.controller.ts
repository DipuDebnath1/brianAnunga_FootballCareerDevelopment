import { Request, RequestHandler, Response } from "express";
import httpStatus from "http-status";
import { ProtectedRequest } from "../../types/protected-request";
import catchAsync from "../../utills/catchAsync";
import sendResponse from "../../utills/sendResponse";
import { UserServices } from "./user.services";

const getProfile: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const { user } = req as ProtectedRequest;
    const profile = await UserServices.getUserProfile(user!._id);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "User profile retrieved successfully",
      data: profile,
    });
  }
);

// const updateProfile: RequestHandler = catchAsync(
//   async (req: Request, res: Response) => {
//     const { user } = req as ProtectedRequest;
//     const updateData = req.body as UpdateProfileInput;

//     if (req.file) {
//       updateData.image = `/uploads/users/${req.file.filename}`;
//     }

//     const profile = await UserServices.updateUserProfile(
//       user!._id,
//       updateData
//     );

//     sendResponse(res, {
//       statusCode: httpStatus.OK,
//       success: true,
//       message: "User profile updated successfully",
//       data: profile,
//     });
//   }
// );

const updateProfile: RequestHandler = catchAsync(async (req, res) => {
  const { user } = req as ProtectedRequest;

  const payload = req.body;

  if (req.file) {
    payload.user = payload.user || {};
    payload.user.image = `/uploads/users/${req.file.filename}`;
  }

  const result = await UserServices.updateUserAndProfile(
    user!._id,
    payload
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Profile updated successfully",
    data: result,
  });
});


const singleFileUpload: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const file = req.file;

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "File uploaded successfully",
      data: {
        path: file ? `/uploads/users/${file.filename}` : "",
      },
    });
  }
);

const multipleFileUpload: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const files = req.files as
      | Record<string, { filename: string }[]>
      | undefined;

    const uploadedFiles = files
      ? Object.values(files)
          .flat()
          .map((file) => `/uploads/users/${file.filename}`)
      : [];

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Files uploaded successfully",
      data: { files: uploadedFiles },
    });
  }
);

export const UserController = {
  getProfile,
  updateProfile,
  singleFileUpload,
  multipleFileUpload,
};

export default UserController;
