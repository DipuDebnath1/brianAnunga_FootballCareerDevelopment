import { Request, RequestHandler, Response } from "express";
import httpStatus from "http-status";
import AppError from "../../ErrorHandler/AppError";
import catchAsync from "../../utills/catchAsync";
import sendResponse from "../../utills/sendResponse";
import { ProtectedRequest } from "../../types/protected-request";
import playerService from "./players.services";

const createPlayerProfile: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const { user } = req as ProtectedRequest;
    const playerData = { ...req.body, user_id: user!._id };
    const newPlayerProfile = await playerService.createPlayerProfile(playerData);

    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: "Player profile created successfully",
      data: newPlayerProfile,
    });
  }
);

const updatePlayerProfile: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const { user } = req as ProtectedRequest;
    const updatedPlayerProfile = await playerService.updatePlayerProfile(
      user!._id,
      req.body
    );

    if (!updatedPlayerProfile) {
      throw new AppError(httpStatus.NOT_FOUND, "Player profile not found");
    }

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Player profile updated successfully",
      data: updatedPlayerProfile,
    });
  }
);

const getAllPlayers: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const { position, location, keySkills } = req.query;

    let skillsArray: string[] | undefined;
    if (typeof keySkills === "string") {
      skillsArray = keySkills.split(",");
    } else if (Array.isArray(keySkills)) {
      skillsArray = keySkills.filter((skill) => typeof skill === "string") as string[];
    }

    const players = await playerService.getAllPlayers(
      typeof position === "string" ? position : undefined,
      typeof location === "string" ? location : undefined,
      skillsArray
    );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "All players retrieved successfully",
      data: players,
    });
  }
);

const playerController = {
  createPlayerProfile,
  updatePlayerProfile,
  getAllPlayers,
};

export default playerController;
