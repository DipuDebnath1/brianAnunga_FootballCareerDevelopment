import { Request, RequestHandler, Response } from "express";
import httpStatus from "http-status";
import multer from "multer";
import config from "../../config";
import { ProtectedRequest } from "../../types/protected-request";
import AppError from "../../ErrorHandler/AppError";
import catchAsync from "../../utills/catchAsync";
import { ImageUrl } from "../../utills/ImageLink";
import sendResponse from "../../utills/sendResponse";
import { TPlayerPlacementStatus } from "./PlayerPlaceRequest.interface";
import { PlayerPlaceRequestServices } from "./PlayerPlaceRequest.services";
import {
  CreatePlacementInput,
  UpdatePlacementStatusInput,
} from "./PlayerPlaceRequest.validation";

type MulterFile = Parameters<NonNullable<multer.Options["fileFilter"]>>[1];

const getResumeUrl = (file: MulterFile): string => {
  const url = ImageUrl(file);

  if (config.file.UploaderServices === "LOCAL" && url) {
    return `/uploads/${url}`;
  }

  return url;
};

const createPlacement: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const { user } = req as ProtectedRequest;
    const payload = req.body as CreatePlacementInput;
    const files = req.files as { [fieldname: string]: MulterFile[] };
    const resumeFile = files?.resume?.[0];

    if (!resumeFile) {
      throw new AppError(httpStatus.BAD_REQUEST, "Resume file is required");
    }

    const placement = await PlayerPlaceRequestServices.createPlacement(
      user!._id,
      user!.role,
      payload,
      getResumeUrl(resumeFile)
    );

    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: "Placement request created successfully",
      data: placement,
    });
  }
);

const getPlacements: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const { user } = req as ProtectedRequest;
    const { status } = req.query as { status?: TPlayerPlacementStatus };

    const placements = await PlayerPlaceRequestServices.getPlacements(
      user!._id,
      user!.role,
      status
    );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Placement requests retrieved successfully",
      data: placements,
    });
  }
);

const getPlacementById: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const { user } = req as ProtectedRequest;
    const requestId = req.params.requestId as string;

    const placement = await PlayerPlaceRequestServices.getPlacementById(
      user!._id,
      user!.role,
      requestId
    );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Placement request retrieved successfully",
      data: placement,
    });
  }
);

const updatePlacementStatus: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const { user } = req as ProtectedRequest;
    const requestId = req.params.requestId as string;
    const payload = req.body as UpdatePlacementStatusInput;

    const placement = await PlayerPlaceRequestServices.updatePlacementStatus(
      user!._id,
      user!.role,
      requestId,
      payload
    );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Placement request status updated successfully",
      data: placement,
    });
  }
);

export const PlayerPlaceRequestController = {
  createPlacement,
  getPlacements,
  getPlacementById,
  updatePlacementStatus,
};

export default PlayerPlaceRequestController;
