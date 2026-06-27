import { Request, RequestHandler, Response } from "express";
import httpStatus from "http-status";
import { ProtectedRequest } from "../../types/protected-request";
import catchAsync from "../../utills/catchAsync";
import sendResponse from "../../utills/sendResponse";
import { IPlayerVideoRequestStatus } from "./PlayerVideoRequests.interface";
import { PlayerVideoRequestsServices } from "./PlayerVideoRequests.services";
import {
  AddVideoReviewInput,
  CompleteVideoRequestInput,
  CreateVideoRequestInput,
  UpdateRequestStatusInput,
} from "./PlayerVideoRequests.validation";

const createVideoRequest: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const { user } = req as ProtectedRequest;
    const payload = req.body as CreateVideoRequestInput;

    const request = await PlayerVideoRequestsServices.createVideoRequest(
      user!._id,
      user!.role,
      payload
    );

    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: "Video analysis request created successfully",
      data: request,
    });
  }
);

const getVideoRequests: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const { user } = req as ProtectedRequest;
    const { status } = req.query as { status?: IPlayerVideoRequestStatus };

    const requests = await PlayerVideoRequestsServices.getVideoRequests(
      user!._id,
      user!.role,
      status
    );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Video analysis requests retrieved successfully",
      data: requests,
    });
  }
);

const getVideoRequestById: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const { user } = req as ProtectedRequest;
    const requestId = req.params.requestId as string;

    const request = await PlayerVideoRequestsServices.getVideoRequestById(
      user!._id,
      user!.role,
      requestId
    );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Video analysis request retrieved successfully",
      data: request,
    });
  }
);

const updateRequestStatus: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const { user } = req as ProtectedRequest;
    const requestId = req.params.requestId as string;
    const payload = req.body as UpdateRequestStatusInput;

    const request = await PlayerVideoRequestsServices.updateRequestStatus(
      user!._id,
      user!.role,
      requestId,
      payload
    );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Video analysis request status updated successfully",
      data: request,
    });
  }
);

const completeVideoRequest: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const { user } = req as ProtectedRequest;
    const requestId = req.params.requestId as string;
    const payload = req.body as CompleteVideoRequestInput;

    const request = await PlayerVideoRequestsServices.completeVideoRequest(
      user!._id,
      user!.role,
      requestId,
      payload
    );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Video analysis completed successfully",
      data: request,
    });
  }
);

const addVideoReview: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const { user } = req as ProtectedRequest;
    const requestId = req.params.requestId as string;
    const payload = req.body as AddVideoReviewInput;

    const review = await PlayerVideoRequestsServices.addVideoReview(
      user!._id,
      user!.role,
      requestId,
      payload
    );

    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: "Video analysis review submitted successfully",
      data: review,
    });
  }
);

export const PlayerVideoRequestsController = {
  createVideoRequest,
  getVideoRequests,
  getVideoRequestById,
  updateRequestStatus,
  completeVideoRequest,
  addVideoReview,
};

export default PlayerVideoRequestsController;
