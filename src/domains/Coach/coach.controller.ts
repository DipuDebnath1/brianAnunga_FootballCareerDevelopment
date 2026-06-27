import { Request, RequestHandler, Response } from "express";
import httpStatus from "http-status";
import { ProtectedRequest } from "../../types/protected-request";
import catchAsync from "../../utills/catchAsync";
import sendResponse from "../../utills/sendResponse";
import { DayOfWeek } from "./coach.interface";
import { CoachServices } from "./coach.services";
import {
  CreateTimeSlotInput,
  UpdateTimeSlotInput,
} from "./coach.validation";

const createTimeSlot: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const { user } = req as ProtectedRequest;
    const payload = req.body as CreateTimeSlotInput;

    const slot = await CoachServices.createTimeSlot(
      user!._id,
      user!.role,
      payload
    );

    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: "Time slot created successfully",
      data: slot,
    });
  }
);

const getTimeSlots: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const { user } = req as ProtectedRequest;
    const { day } = req.query as { day?: DayOfWeek };

    const slots = await CoachServices.getTimeSlots(
      user!._id,
      user!.role,
      day
    );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Time slots retrieved successfully",
      data: slots,
    });
  }
);

const getTimeSlotById: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const { user } = req as ProtectedRequest;
    const slotId = req.params.slotId as string;

    const slot = await CoachServices.getTimeSlotById(
      user!._id,
      user!.role,
      slotId
    );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Time slot retrieved successfully",
      data: slot,
    });
  }
);

const updateTimeSlot: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const { user } = req as ProtectedRequest;
    const slotId = req.params.slotId as string;
    const payload = req.body as UpdateTimeSlotInput;

    const slot = await CoachServices.updateTimeSlot(
      user!._id,
      user!.role,
      slotId,
      payload
    );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Time slot updated successfully",
      data: slot,
    });
  }
);

const deleteTimeSlot: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const { user } = req as ProtectedRequest;
    const slotId = req.params.slotId as string;

    await CoachServices.deleteTimeSlot(user!._id, user!.role, slotId);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Time slot deleted successfully",
      data: null,
    });
  }
);

export const CoachController = {
  createTimeSlot,
  getTimeSlots,
  getTimeSlotById,
  updateTimeSlot,
  deleteTimeSlot,
};

export default CoachController;
