import { Request, RequestHandler, Response } from "express";
import httpStatus from "http-status";
import { FilterQuery } from "mongoose";
import AppError from "../../ErrorHandler/AppError";
import { ProtectedRequest } from "../../types/protected-request";
import catchAsync from "../../utills/catchAsync";
import sendResponse from "../../utills/sendResponse";
import { IUser } from "./user.interface";
import { UserServices } from "./user.services";

// update user image
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

// update user and profile
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

// all coaches for players
const allCoachesForPlayers: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {

    const coaches = await UserServices.AllCoachesForPlayers(req.query as FilterQuery<IUser>);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "All coaches for players",
      data: coaches,
    });
  }
);

// all agents for players
const allAgentsForPlayers: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const agents = await UserServices.AllAgentsForPlayers(req.query as FilterQuery<IUser>);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "All agents for players",
      data: agents,
    });
  }
);

// coach profile
const coachProfile: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const coach = await UserServices.CoachProfile(req.params.id as string);
    sendResponse(res, {   
      statusCode: httpStatus.OK,
      success: true,
      message: "Coach profile",
      data: coach,
    });
  }
);

// agent profile
const agentProfile: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const agent = await UserServices.AgentProfile(req.params.id as string);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Agent profile",
      data: agent,
    });
  }
);




export const UserController = {
  updateUserImage,
  updateProfile,
  allCoachesForPlayers,
  allAgentsForPlayers,
  coachProfile,
  agentProfile,
};

export default UserController;
