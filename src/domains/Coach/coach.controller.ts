import { Request, Response } from "express";
import coachService from "./coach.services";
import { handleError } from "../../lib/errorsHandle";
import httpStatus from "http-status";
import { response } from "../../lib/response";
import { ProtectedRequest } from "../../types/protected-request";

const createCoachProfile = async (req: ProtectedRequest, res: Response) => {
  try {
    // Extract user ID from the authenticated request
    const userId = req.user?._id as string;

    // Check if coach profile already exists for this user
    const existingCoach = await coachService.getCoachByUserId(userId);
    if (existingCoach) {
      return res.status(httpStatus.CONFLICT).json(
        response({
          message: "Coach profile already exists for this user",
          status: "ERROR",
          statusCode: httpStatus.CONFLICT,
          data: {},
        })
      );
    }

    // Create the coach profile with the user ID
    const coachData = {
      ...req.body,
      user_id: userId,
    };

    const newCoachProfile = await coachService.createCoachProfile(
      coachData
    );

    res.status(httpStatus.CREATED).json(
      response({
        message: "Coach profile created successfully",
        status: "OK",
        statusCode: httpStatus.CREATED,
        data: newCoachProfile,
      })
    );
  } catch (error) {
    const handledError = handleError(error);
    res.status(500).json({ error: handledError.message });
  }
};

const updateCoachProfile = async (req: ProtectedRequest, res: Response) => {
  try {
    const userId = req.user?._id as string;

    console.log(userId);

    // Update the coach profile
    const updatedCoachProfile = await coachService.updateCoachProfile(
      userId,
      req.body
    );

    if (!updatedCoachProfile) {
      return res.status(httpStatus.NOT_FOUND).json(
        response({
          message: "Coach profile not found",
          status: "ERROR",
          statusCode: httpStatus.NOT_FOUND,
          data: {},
        })
      );
    }

    res.status(httpStatus.OK).json(
      response({
        message: "Coach profile updated successfully",
        status: "OK",
        statusCode: httpStatus.OK,
        data: updatedCoachProfile,
      })
    );
  } catch (error) {
    const handledError = handleError(error);
    res.status(500).json({ error: handledError.message });
  }
};

const getCoachProfile = async (req: ProtectedRequest, res: Response) => {
  try {
    const userId = req.user?._id as string;

    const coach = await coachService.getCoachByUserId(userId);

    if (!coach) {
      return res.status(httpStatus.NOT_FOUND).json(
        response({
          message: "Coach profile not found",
          status: "ERROR",
          statusCode: httpStatus.NOT_FOUND,
          data: {},
        })
      );
    }

    res.status(httpStatus.OK).json(
      response({
        message: "Coach profile retrieved successfully",
        status: "OK",
        statusCode: httpStatus.OK,
        data: coach,
      })
    );
  } catch (error) {
    const handledError = handleError(error);
    res.status(500).json({ error: handledError.message });
  }
};

const getAllCoaches = async (req: Request, res: Response) => {
  try {
    // Extract query parameters for filtering
    const { areaOfExpertise, experienceYears } = req.query;

    const coaches = await coachService.getAllCoaches(
      typeof areaOfExpertise === "string" ? areaOfExpertise : undefined,
      typeof experienceYears === "string" ? parseInt(experienceYears) : undefined
    );

    res.status(httpStatus.OK).json(
      response({
        message: "All coaches retrieved successfully",
        status: "OK",
        statusCode: httpStatus.OK,
        data: coaches,
      })
    );
  } catch (error) {
    const handledError = handleError(error);
    res.status(500).json({ error: handledError.message });
  }
};

const coachController = {
  createCoachProfile,
  updateCoachProfile,
  getCoachProfile,
  getAllCoaches,
};

export default coachController;
