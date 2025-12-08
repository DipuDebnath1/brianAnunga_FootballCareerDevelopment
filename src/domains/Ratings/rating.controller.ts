import { Request, Response } from "express";
import mongoose from "mongoose";
import ratingService from "./rating.service";
import { handleError } from "../../lib/errorsHandle";
import httpStatus from "http-status";
import { response } from "../../lib/response";
import { ProtectedRequest } from "../../types/protected-request";
import { RatingType } from "./rating.model";

// Create a new rating
const createRating = async (req: ProtectedRequest, res: Response) => {
  try {
    const userId = req.user?._id as string;
    const { rating, review, ratingType, profileId } = req.body;

    // Validate rating is between 1 and 5
    if (rating < 1 || rating > 5) {
      return res.status(httpStatus.BAD_REQUEST).json(
        response({
          message: "Rating must be between 1 and 5",
          status: "ERROR",
          statusCode: httpStatus.BAD_REQUEST,
          data: {},
        })
      );
    }

    // Validate ratingType is either 'coach' or 'agent'
    if (!["coach", "agent"].includes(ratingType)) {
      return res.status(httpStatus.BAD_REQUEST).json(
        response({
          message: "Rating type must be either 'coach' or 'agent'",
          status: "ERROR",
          statusCode: httpStatus.BAD_REQUEST,
          data: {},
        })
      );
    }

    const ratingData = {
      rating,
      review,
      ratingType: ratingType as RatingType,
      profileId: new mongoose.Types.ObjectId(profileId),
      userId: new mongoose.Types.ObjectId(userId),
    };

    const newRating = await ratingService.createRating(ratingData);

    res.status(httpStatus.CREATED).json(
      response({
        message: "Rating created successfully",
        status: "OK",
        statusCode: httpStatus.CREATED,
        data: newRating,
      })
    );
  } catch (error) {
    const handledError = handleError(error);
    res.status(500).json({ error: handledError.message });
  }
};

// Update a rating
const updateRating = async (req: ProtectedRequest, res: Response) => {
  try {
    const userId = req.user?._id as string;
    const { ratingId } = req.params;
    const { rating, review } = req.body;

    // Validate rating is between 1 and 5
    if (rating !== undefined && (rating < 1 || rating > 5)) {
      return res.status(httpStatus.BAD_REQUEST).json(
        response({
          message: "Rating must be between 1 and 5",
          status: "ERROR",
          statusCode: httpStatus.BAD_REQUEST,
          data: {},
        })
      );
    }

    // First get the rating to check the profileId and ratingType
    const existingRating = await ratingService.getRatingById(ratingId);
    if (!existingRating) {
      return res.status(httpStatus.NOT_FOUND).json(
        response({
          message: "Rating not found",
          status: "ERROR",
          statusCode: httpStatus.NOT_FOUND,
          data: {},
        })
      );
    }

    // Check if the user is the owner of the rating
    if (existingRating.userId.toString() !== userId) {
      return res.status(httpStatus.FORBIDDEN).json(
        response({
          message: "You can only update your own ratings",
          status: "ERROR",
          statusCode: httpStatus.FORBIDDEN,
          data: {},
        })
      );
    }

    const updatedRating = await ratingService.updateRating(
      userId,
      existingRating.profileId.toString(),
      existingRating.ratingType,
      { rating, review }
    );

    if (!updatedRating) {
      return res.status(httpStatus.NOT_FOUND).json(
        response({
          message: "Rating not found",
          status: "ERROR",
          statusCode: httpStatus.NOT_FOUND,
          data: {},
        })
      );
    }

    res.status(httpStatus.OK).json(
      response({
        message: "Rating updated successfully",
        status: "OK",
        statusCode: httpStatus.OK,
        data: updatedRating,
      })
    );
  } catch (error) {
    const handledError = handleError(error);
    res.status(500).json({ error: handledError.message });
  }
};

// Get rating by ID
const getRatingById = async (req: Request, res: Response) => {
  try {
    const { ratingId } = req.params;

    const rating = await ratingService.getRatingById(ratingId);

    if (!rating) {
      return res.status(httpStatus.NOT_FOUND).json(
        response({
          message: "Rating not found",
          status: "ERROR",
          statusCode: httpStatus.NOT_FOUND,
          data: {},
        })
      );
    }

    res.status(httpStatus.OK).json(
      response({
        message: "Rating retrieved successfully",
        status: "OK",
        statusCode: httpStatus.OK,
        data: rating,
      })
    );
  } catch (error) {
    const handledError = handleError(error);
    res.status(500).json({ error: handledError.message });
  }
};

// Get all ratings for a specific profile (coach or agent)
const getRatingsByProfile = async (req: Request, res: Response) => {
  try {
    const { profileId, ratingType } = req.params;
    const { page = 1, limit = 10 } = req.query;

    // Validate ratingType is either 'coach' or 'agent'
    if (!["coach", "agent"].includes(ratingType)) {
      return res.status(httpStatus.BAD_REQUEST).json(
        response({
          message: "Rating type must be either 'coach' or 'agent'",
          status: "ERROR",
          statusCode: httpStatus.BAD_REQUEST,
          data: {},
        })
      );
    }

    const ratings = await ratingService.getRatingsByProfile(
      profileId,
      ratingType as RatingType,
      parseInt(page as string),
      parseInt(limit as string)
    );

    // Get average rating and count
    const avgRatingData = await ratingService.getAverageRatingByProfile(
      profileId,
      ratingType as RatingType
    );

    res.status(httpStatus.OK).json(
      response({
        message: "Ratings retrieved successfully",
        status: "OK",
        statusCode: httpStatus.OK,
        data: {
          ratings,
          averageRating: avgRatingData.averageRating,
          totalRatings: avgRatingData.count,
        },
      })
    );
  } catch (error) {
    const handledError = handleError(error);
    res.status(500).json({ error: handledError.message });
  }
};

// Get all ratings by a specific user
const getRatingsByUser = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    const ratings = await ratingService.getRatingsByUser(userId);

    res.status(httpStatus.OK).json(
      response({
        message: "User ratings retrieved successfully",
        status: "OK",
        statusCode: httpStatus.OK,
        data: ratings,
      })
    );
  } catch (error) {
    const handledError = handleError(error);
    res.status(500).json({ error: handledError.message });
  }
};

// Get average rating for a specific profile with count
const getAverageRatingByProfile = async (req: Request, res: Response) => {
  try {
    const { profileId, ratingType } = req.params;

    // Validate ratingType is either 'coach' or 'agent'
    if (!["coach", "agent"].includes(ratingType)) {
      return res.status(httpStatus.BAD_REQUEST).json(
        response({
          message: "Rating type must be either 'coach' or 'agent'",
          status: "ERROR",
          statusCode: httpStatus.BAD_REQUEST,
          data: {},
        })
      );
    }

    const avgRatingData = await ratingService.getAverageRatingByProfile(
      profileId,
      ratingType as RatingType
    );

    res.status(httpStatus.OK).json(
      response({
        message: "Average rating retrieved successfully",
        status: "OK",
        statusCode: httpStatus.OK,
        data: avgRatingData,
      })
    );
  } catch (error) {
    const handledError = handleError(error);
    res.status(500).json({ error: handledError.message });
  }
};

// Delete a rating
const deleteRating = async (req: ProtectedRequest, res: Response) => {
  try {
    const userId = req.user?._id as string;
    const { ratingId } = req.params;

    // First get the rating to check the profileId and ratingType
    const rating = await ratingService.getRatingById(ratingId);
    if (!rating) {
      return res.status(httpStatus.NOT_FOUND).json(
        response({
          message: "Rating not found",
          status: "ERROR",
          statusCode: httpStatus.NOT_FOUND,
          data: {},
        })
      );
    }

    // Check if the user is the owner of the rating
    if (rating.userId.toString() !== userId) {
      return res.status(httpStatus.FORBIDDEN).json(
        response({
          message: "You can only delete your own ratings",
          status: "ERROR",
          statusCode: httpStatus.FORBIDDEN,
          data: {},
        })
      );
    }

    const deletedRating = await ratingService.deleteRating(
      userId,
      rating.profileId.toString(),
      rating.ratingType
    );

    if (!deletedRating) {
      return res.status(httpStatus.NOT_FOUND).json(
        response({
          message: "Rating not found",
          status: "ERROR",
          statusCode: httpStatus.NOT_FOUND,
          data: {},
        })
      );
    }

    res.status(httpStatus.OK).json(
      response({
        message: "Rating deleted successfully",
        status: "OK",
        statusCode: httpStatus.OK,
        data: deletedRating,
      })
    );
  } catch (error) {
    const handledError = handleError(error);
    res.status(500).json({ error: handledError.message });
  }
};

// Get all ratings with optional filters
const getAllRatings = async (req: Request, res: Response) => {
  try {
    const {
      ratingType,
      minRating,
      maxRating,
      page = 1,
      limit = 10,
    } = req.query;

    // Validate ratingType if provided
    if (ratingType && !["coach", "agent"].includes(ratingType as string)) {
      return res.status(httpStatus.BAD_REQUEST).json(
        response({
          message: "Rating type must be either 'coach' or 'agent'",
          status: "ERROR",
          statusCode: httpStatus.BAD_REQUEST,
          data: {},
        })
      );
    }

    const ratings = await ratingService.getAllRatings(
      ratingType as RatingType,
      minRating ? parseInt(minRating as string) : undefined,
      maxRating ? parseInt(maxRating as string) : undefined,
      parseInt(page as string),
      parseInt(limit as string)
    );

    res.status(httpStatus.OK).json(
      response({
        message: "All ratings retrieved successfully",
        status: "OK",
        statusCode: httpStatus.OK,
        data: ratings,
      })
    );
  } catch (error) {
    const handledError = handleError(error);
    res.status(500).json({ error: handledError.message });
  }
};

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
