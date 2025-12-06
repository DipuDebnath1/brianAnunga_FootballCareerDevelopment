import { Request, Response } from "express";
import playerService from "./players.services";
import { handleError } from "../../lib/errorsHandle";
import httpStatus from "http-status";
import { response } from "../../lib/response";
import { ProtectedRequest } from "../../types/protected-request";

const createPlayerProfile = async (req: ProtectedRequest, res: Response) => {
  try {
    // Extract user ID from the authenticated request
    const userId = req.user?._id as string;

    // Create the player profile with the user ID
    const playerData = {
      ...req.body,
      user_id: userId,
    };

    const newPlayerProfile = await playerService.createPlayerProfile(
      playerData
    );

    res.status(httpStatus.CREATED).json(
      response({
        message: "Player profile created successfully",
        status: "OK",
        statusCode: httpStatus.CREATED,
        data: newPlayerProfile,
      })
    );
  } catch (error) {
    const handledError = handleError(error);
    res.status(500).json({ error: handledError.message });
  }
};

const updatePlayerProfile = async (req: ProtectedRequest, res: Response) => {
  try {
    const userId = req.user?._id as string;

    console.log(userId);

    // Update the player profile
    const updatedPlayerProfile = await playerService.updatePlayerProfile(
      userId,
      req.body
    );

    if (!updatedPlayerProfile) {
      return res.status(httpStatus.NOT_FOUND).json(
        response({
          message: "Player profile not found",
          status: "ERROR",
          statusCode: httpStatus.NOT_FOUND,
          data: {},
        })
      );
    }

    res.status(httpStatus.OK).json(
      response({
        message: "Player profile updated successfully",
        status: "OK",
        statusCode: httpStatus.OK,
        data: updatedPlayerProfile,
      })
    );
  } catch (error) {
    const handledError = handleError(error);
    res.status(500).json({ error: handledError.message });
  }
};

const getAllPlayers = async (req: Request, res: Response) => {
  try {
    // Extract query parameters for filtering
    const { position, location, keySkills } = req.query;

    // Convert keySkills from string to array if it exists
    let skillsArray: string[] | undefined;
    if (typeof keySkills === "string") {
      skillsArray = keySkills.split(",");
    } else if (Array.isArray(keySkills)) {
      // Filter out any non-string values to ensure we only have string[]
      skillsArray = keySkills.filter(
        (skill) => typeof skill === "string"
      ) as string[];
    }

    const players = await playerService.getAllPlayers(
      typeof position === "string" ? position : undefined,
      typeof location === "string" ? location : undefined,
      skillsArray
    );

    res.status(httpStatus.OK).json(
      response({
        message: "All players retrieved successfully",
        status: "OK",
        statusCode: httpStatus.OK,
        data: players,
      })
    );
  } catch (error) {
    const handledError = handleError(error);
    res.status(500).json({ error: handledError.message });
  }
};

const playerController = {
  createPlayerProfile,
  updatePlayerProfile,
  getAllPlayers,
};

export default playerController;
