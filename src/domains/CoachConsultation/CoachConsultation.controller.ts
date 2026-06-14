import { Request, RequestHandler, Response } from "express";
import httpStatus from "http-status";
import AppError from "../../ErrorHandler/AppError";
import catchAsync from "../../utills/catchAsync";
import sendResponse from "../../utills/sendResponse";
import { ProtectedRequest } from "../../types/protected-request";
import coachVideoRequestService from "./CoachConsultation.services";

type VideoRequestStatus = "pending" | "accept" | "decline" | "completed";
const VALID_STATUSES: VideoRequestStatus[] = ["pending", "accept", "decline", "completed"];

const createCoachVideoRequest: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const { user } = req as ProtectedRequest;

    if (!req.body.coach_id) {
      throw new AppError(httpStatus.BAD_REQUEST, "Coach ID is required");
    }

    const newVideoRequest = await coachVideoRequestService.createCoachVideoRequest({
      ...req.body,
      user_id: user!._id,
    });

    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: "Coach video request created successfully",
      data: newVideoRequest,
    });
  }
);

const getCoachVideoRequestsByCoachId: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const videoRequests = await coachVideoRequestService.getCoachVideoRequestsByCoachId(
      req.params.coachId as string
    );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Coach video requests retrieved successfully",
      data: videoRequests,
    });
  }
);

const getCoachVideoRequestsByUserId: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const { user } = req as ProtectedRequest;
    const videoRequests = await coachVideoRequestService.getCoachVideoRequestsByUserId(
      user!._id
    );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Coach video requests retrieved successfully",
      data: videoRequests,
    });
  }
);

const updateCoachVideoRequestStatus: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const { status } = req.body;

    if (!status) {
      throw new AppError(httpStatus.BAD_REQUEST, "Status is required in the request body");
    }

    if (!VALID_STATUSES.includes(status)) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        `Invalid status. Valid statuses are: ${VALID_STATUSES.join(", ")}`
      );
    }

    const updatedVideoRequest = await coachVideoRequestService.updateCoachVideoRequestStatus(
      req.params.id as string,
      status
    );

    if (!updatedVideoRequest) {
      throw new AppError(httpStatus.NOT_FOUND, "Coach video request not found");
    }

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Coach video request status updated successfully",
      data: updatedVideoRequest,
    });
  }
);

const updateCoachVideoRequestFeedback: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const { feedback } = req.body;

    if (!feedback) {
      throw new AppError(httpStatus.BAD_REQUEST, "Feedback is required in the request body");
    }

    const updatedVideoRequest = await coachVideoRequestService.updateCoachVideoRequestFeedback(
      req.params.id as string,
      feedback
    );

    if (!updatedVideoRequest) {
      throw new AppError(httpStatus.NOT_FOUND, "Coach video request not found");
    }

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Coach video request feedback updated successfully",
      data: updatedVideoRequest,
    });
  }
);

const getAllCoachVideoRequests: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const { userId, coachId, status } = req.query;

    const videoRequests = await coachVideoRequestService.getAllCoachVideoRequests(
      typeof userId === "string" ? userId : undefined,
      typeof coachId === "string" ? coachId : undefined,
      typeof status === "string" ? (status as VideoRequestStatus) : undefined
    );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "All coach video requests retrieved successfully",
      data: videoRequests,
    });
  }
);

const getCoachVideoRequestById: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const videoRequest = await coachVideoRequestService.getCoachVideoRequestById(
      req.params.id as string
    );

    if (!videoRequest) {
      throw new AppError(httpStatus.NOT_FOUND, "Coach video request not found");
    }

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Coach video request retrieved successfully",
      data: videoRequest,
    });
  }
);

const coachVideoRequestController = {
  createCoachVideoRequest,
  getCoachVideoRequestsByCoachId,
  getCoachVideoRequestsByUserId,
  updateCoachVideoRequestStatus,
  updateCoachVideoRequestFeedback,
  getAllCoachVideoRequests,
  getCoachVideoRequestById,
};

export default coachVideoRequestController;
