import { Request, RequestHandler, Response } from "express";
import mongoose from "mongoose";
import httpStatus from "http-status";
import AppError from "../../ErrorHandler/AppError";
import catchAsync from "../../utills/catchAsync";
import sendResponse from "../../utills/sendResponse";
import { ProtectedRequest } from "../../types/protected-request";
import ratingService from "./rating.service";
import { RatingType } from "./rating.model";

const assertRatingType = (ratingType: string): RatingType => {
  if (!["coach", "agent"].includes(ratingType)) {
    throw new AppError(httpStatus.BAD_REQUEST, "Rating type must be either 'coach' or 'agent'");
  }
  return ratingType as RatingType;
};

const createRating: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const { user } = req as ProtectedRequest;
    const { rating, review, ratingType, profileId } = req.body;

    if (rating < 1 || rating > 5) {
      throw new AppError(httpStatus.BAD_REQUEST, "Rating must be between 1 and 5");
    }

    assertRatingType(ratingType);

    const newRating = await ratingService.createRating({
      rating,
      review,
      ratingType: ratingType as RatingType,
      profileId: new mongoose.Types.ObjectId(profileId),
      userId: new mongoose.Types.ObjectId(user!._id),
    });

    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: "Rating created successfully",
      data: newRating,
    });
  }
);

const updateRating: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const { user } = req as ProtectedRequest;
    const { ratingId } = req.params;
    const { rating, review } = req.body;

    if (rating !== undefined && (rating < 1 || rating > 5)) {
      throw new AppError(httpStatus.BAD_REQUEST, "Rating must be between 1 and 5");
    }

    const existingRating = await ratingService.getRatingById(ratingId as string);
    if (!existingRating) {
      throw new AppError(httpStatus.NOT_FOUND, "Rating not found");
    }

    if (existingRating.userId.toString() !== user!._id) {
      throw new AppError(httpStatus.FORBIDDEN, "You can only update your own ratings");
    }

    const updatedRating = await ratingService.updateRating(
      user!._id,
      existingRating.profileId.toString(),
      existingRating.ratingType,
      { rating, review }
    );

    if (!updatedRating) {
      throw new AppError(httpStatus.NOT_FOUND, "Rating not found");
    }

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Rating updated successfully",
      data: updatedRating,
    });
  }
);

const getRatingById: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const rating = await ratingService.getRatingById(req.params.ratingId as string);

    if (!rating) {
      throw new AppError(httpStatus.NOT_FOUND, "Rating not found");
    }

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Rating retrieved successfully",
      data: rating,
    });
  }
);

const getRatingsByProfile: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const { profileId, ratingType } = req.params;
    const { page = "1", limit = "10" } = req.query;

    const type = assertRatingType(ratingType as string);

    const ratings = await ratingService.getRatingsByProfile(
      profileId as string,
      type,
      parseInt(page as string, 10),
      parseInt(limit as string, 10)
    );

    const avgRatingData = await ratingService.getAverageRatingByProfile(
      profileId as string,
      type
    );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Ratings retrieved successfully",
      data: {
        ratings,
        averageRating: avgRatingData.averageRating,
        totalRatings: avgRatingData.count,
      },
    });
  }
);

const getRatingsByUser: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const ratings = await ratingService.getRatingsByUser(req.params.userId as string);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "User ratings retrieved successfully",
      data: ratings,
    });
  }
);

const getAverageRatingByProfile: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const { profileId, ratingType } = req.params;
    const type = assertRatingType(ratingType as string);

    const avgRatingData = await ratingService.getAverageRatingByProfile(
      profileId as string,
      type
    );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Average rating retrieved successfully",
      data: avgRatingData,
    });
  }
);

const deleteRating: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const { user } = req as ProtectedRequest;
    const rating = await ratingService.getRatingById(req.params.ratingId as string);

    if (!rating) {
      throw new AppError(httpStatus.NOT_FOUND, "Rating not found");
    }

    if (rating.userId.toString() !== user!._id) {
      throw new AppError(httpStatus.FORBIDDEN, "You can only delete your own ratings");
    }

    const deletedRating = await ratingService.deleteRating(
      user!._id,
      rating.profileId.toString(),
      rating.ratingType
    );

    if (!deletedRating) {
      throw new AppError(httpStatus.NOT_FOUND, "Rating not found");
    }

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Rating deleted successfully",
      data: deletedRating,
    });
  }
);

const getAllRatings: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const { ratingType, minRating, maxRating, page = "1", limit = "10" } = req.query;

    if (ratingType && !["coach", "agent"].includes(ratingType as string)) {
      throw new AppError(httpStatus.BAD_REQUEST, "Rating type must be either 'coach' or 'agent'");
    }

    const ratings = await ratingService.getAllRatings(
      ratingType as RatingType,
      minRating ? parseInt(minRating as string, 10) : undefined,
      maxRating ? parseInt(maxRating as string, 10) : undefined,
      parseInt(page as string, 10),
      parseInt(limit as string, 10)
    );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "All ratings retrieved successfully",
      data: ratings,
    });
  }
);

const ratingController = {
  createRating,
  updateRating,
  getRatingById,
  getRatingsByProfile,
  getRatingsByUser,
  getAverageRatingByProfile,
  deleteRating,
  getAllRatings,
};

export default ratingController;
