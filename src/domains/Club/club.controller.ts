import { Request, RequestHandler, Response } from "express";
import httpStatus from "http-status";
import AppError from "../../ErrorHandler/AppError";
import catchAsync from "../../utills/catchAsync";
import sendResponse from "../../utills/sendResponse";
import { IClub } from "./club.interface";
import clubService from "./club.service";

const createClub: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const { clubName } = req.body;

    const existingClub = clubName
      ? await clubService.getClubByName(clubName)
      : null;
    if (existingClub) {
      throw new AppError(httpStatus.CONFLICT, "Club with this name already exists");
    }

    const newClub = await clubService.createClub(req.body as Partial<IClub>);

    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: "Club created successfully",
      data: newClub,
    });
  }
);

const updateClub: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const updatedClub = await clubService.updateClub(
      req.params.clubId as string,
      req.body
    );

    if (!updatedClub) {
      throw new AppError(httpStatus.NOT_FOUND, "Club not found");
    }

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Club updated successfully",
      data: updatedClub,
    });
  }
);

const getClubById: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const club = await clubService.getClubById(req.params.clubId as string);

    if (!club) {
      throw new AppError(httpStatus.NOT_FOUND, "Club not found");
    }

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Club retrieved successfully",
      data: club,
    });
  }
);

const getClubByName: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const club = await clubService.getClubByName(req.params.name as string);

    if (!club) {
      throw new AppError(httpStatus.NOT_FOUND, "Club not found");
    }

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Club retrieved successfully",
      data: club,
    });
  }
);

const getAllClubs: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const { league, location } = req.query;
    const clubs = await clubService.getAllClubs(
      typeof league === "string" ? league : undefined,
      typeof location === "string" ? location : undefined
    );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "All clubs retrieved successfully",
      data: clubs,
    });
  }
);

const deleteClub: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const deletedClub = await clubService.deleteClub(req.params.clubId as string);

    if (!deletedClub) {
      throw new AppError(httpStatus.NOT_FOUND, "Club not found");
    }

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Club deleted successfully",
      data: deletedClub,
    });
  }
);

const clubController = {
  createClub,
  updateClub,
  getClubById,
  getClubByName,
  getAllClubs,
  deleteClub,
};

export default clubController;
