import { Request, RequestHandler, Response } from "express";
import httpStatus from "http-status";
import { ProtectedRequest } from "../../types/protected-request";
import catchAsync from "../../utills/catchAsync";
import sendResponse from "../../utills/sendResponse";
import { TPlayerConsultationStatus } from "./PlayerConsultation.interface";
import { PlayerConsultationServices } from "./PlayerConsultation.services";
import {
  AddConsultationReviewInput,
  CompleteConsultationInput,
  CreateConsultationInput,
  UpdateConsultationMeetingInput,
  UpdateConsultationStatusInput,
} from "./PlayerConsultation.validation";

const createConsultation: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const { user } = req as ProtectedRequest;
    const payload = req.body as CreateConsultationInput;

    const booking = await PlayerConsultationServices.createConsultation(
      user!._id,
      user!.role,
      payload
    );

    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: "Consultation booked successfully",
      data: booking,
    });
  }
);

const getConsultations: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const { user } = req as ProtectedRequest;
    const { status } = req.query as { status?: TPlayerConsultationStatus };

    const bookings = await PlayerConsultationServices.getConsultations(
      user!._id,
      user!.role,
      status
    );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Consultation bookings retrieved successfully",
      data: bookings,
    });
  }
);

const getConsultationById: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const { user } = req as ProtectedRequest;
    const requestId = req.params.requestId as string;

    const booking = await PlayerConsultationServices.getConsultationById(
      user!._id,
      user!.role,
      requestId
    );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Consultation booking retrieved successfully",
      data: booking,
    });
  }
);

const updateConsultationStatus: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const { user } = req as ProtectedRequest;
    const requestId = req.params.requestId as string;
    const payload = req.body as UpdateConsultationStatusInput;

    const booking = await PlayerConsultationServices.updateConsultationStatus(
      user!._id,
      user!.role,
      requestId,
      payload
    );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Consultation status updated successfully",
      data: booking,
    });
  }
);

const startConsultation: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const { user } = req as ProtectedRequest;
    const requestId = req.params.requestId as string;

    const booking = await PlayerConsultationServices.startConsultation(
      user!._id,
      user!.role,
      requestId
    );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Consultation started successfully",
      data: booking,
    });
  }
);

const updateConsultationMeeting: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const { user } = req as ProtectedRequest;
    const requestId = req.params.requestId as string;
    const payload = req.body as UpdateConsultationMeetingInput;

    const booking = await PlayerConsultationServices.updateConsultationMeeting(
      user!._id,
      user!.role,
      requestId,
      payload
    );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Consultation meeting details updated successfully",
      data: booking,
    });
  }
);

const cancelConsultation: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const { user } = req as ProtectedRequest;
    const requestId = req.params.requestId as string;

    const booking = await PlayerConsultationServices.cancelConsultation(
      user!._id,
      user!.role,
      requestId
    );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Consultation cancelled successfully",
      data: booking,
    });
  }
);

const completeConsultation: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const { user } = req as ProtectedRequest;
    const requestId = req.params.requestId as string;
    const payload = req.body as CompleteConsultationInput;

    const booking = await PlayerConsultationServices.completeConsultation(
      user!._id,
      user!.role,
      requestId,
      payload
    );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Consultation completed successfully",
      data: booking,
    });
  }
);

const addConsultationReview: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const { user } = req as ProtectedRequest;
    const requestId = req.params.requestId as string;
    const payload = req.body as AddConsultationReviewInput;

    const review = await PlayerConsultationServices.addConsultationReview(
      user!._id,
      user!.role,
      requestId,
      payload
    );

    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: "Consultation review submitted successfully",
      data: review,
    });
  }
);

export const PlayerConsultationController = {
  createConsultation,
  getConsultations,
  getConsultationById,
  updateConsultationStatus,
  startConsultation,
  updateConsultationMeeting,
  cancelConsultation,
  completeConsultation,
  addConsultationReview,
};

export default PlayerConsultationController;
