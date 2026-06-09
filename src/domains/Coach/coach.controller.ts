import { Request, RequestHandler, Response } from "express";
import httpStatus from "http-status";
import AppError from "../../ErrorHandler/AppError";
import catchAsync from "../../utills/catchAsync";
import sendResponse from "../../utills/sendResponse";
import { ProtectedRequest } from "../../types/protected-request";
import coachService from "./coach.services";

const createCoachProfile: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const { user } = req as ProtectedRequest;
    const existingCoach = await coachService.getCoachByUserId(user!._id);

    if (existingCoach) {
      throw new AppError(httpStatus.CONFLICT, "Coach profile already exists for this user");
    }

    const newCoachProfile = await coachService.createCoachProfile({
      ...req.body,
      user_id: user!._id,
    });

    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: "Coach profile created successfully",
      data: newCoachProfile,
    });
  }
);

const updateCoachProfile: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const { user } = req as ProtectedRequest;
    const updatedCoachProfile = await coachService.updateCoachProfile(
      user!._id,
      req.body
    );

    if (!updatedCoachProfile) {
      throw new AppError(httpStatus.NOT_FOUND, "Coach profile not found");
    }

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Coach profile updated successfully",
      data: updatedCoachProfile,
    });
  }
);

const getCoachProfile: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const { user } = req as ProtectedRequest;
    const coach = await coachService.getCoachByUserId(user!._id);

    if (!coach) {
      throw new AppError(httpStatus.NOT_FOUND, "Coach profile not found");
    }

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Coach profile retrieved successfully",
      data: coach,
    });
  }
);

const getAllCoaches: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const { areaOfExpertise, experienceYears } = req.query;
    const coaches = await coachService.getAllCoaches(
      typeof areaOfExpertise === "string" ? areaOfExpertise : undefined,
      typeof experienceYears === "string" ? parseInt(experienceYears, 10) : undefined
    );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "All coaches retrieved successfully",
      data: coaches,
    });
  }
);

const coachController = {
  createCoachProfile,
  updateCoachProfile,
  getCoachProfile,
  getAllCoaches,
};

export default coachController;
