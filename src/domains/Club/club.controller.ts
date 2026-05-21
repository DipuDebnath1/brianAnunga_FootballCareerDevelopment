import { Request, Response } from "express";
import clubService from "./club.service";
import { handleError } from "../../lib/errorsHandle";
import httpStatus from "http-status";
import { response } from "../../lib/response";
import { ProtectedRequest } from "../../types/protected-request";

// Create a new club
const createClub = async (req: Request, res: Response) => {
  try {
    const { name, logo, description, founded, location, league, stadium, coach, teamColor, website, socialMedia } = req.body;

    // Check if club with this name already exists
    const existingClub = await clubService.getClubByName(name);
    if (existingClub) {
      return res.status(httpStatus.CONFLICT).json(
        response({
          message: "Club with this name already exists",
          status: "ERROR",
          statusCode: httpStatus.CONFLICT,
          data: {},
        })
      );
    }

    const clubData = {
      name,
      logo,
      description,
      founded,
      location,
      league,
      stadium,
      coach,
      teamColor,
      website,
      socialMedia,
    };

    const newClub = await clubService.createClub(clubData);

    res.status(httpStatus.CREATED).json(
      response({
        message: "Club created successfully",
        status: "OK",
        statusCode: httpStatus.CREATED,
        data: newClub,
      })
    );
  } catch (error) {
    const handledError = handleError(error);
    res.status(500).json({ error: handledError.message });
  }
};

// Update club by ID
const updateClub = async (req: ProtectedRequest, res: Response) => {
  try {
    const { clubId } = req.params;
    const updateData = req.body;

    const updatedClub = await clubService.updateClub(clubId as string, updateData);

    if (!updatedClub) {
      return res.status(httpStatus.NOT_FOUND).json(
        response({
          message: "Club not found",
          status: "ERROR",
          statusCode: httpStatus.NOT_FOUND,
          data: {},
        })
      );
    }

    res.status(httpStatus.OK).json(
      response({
        message: "Club updated successfully",
        status: "OK",
        statusCode: httpStatus.OK,
        data: updatedClub,
      })
    );
  } catch (error) {
    const handledError = handleError(error);
    res.status(500).json({ error: handledError.message });
  }
};

// Get club by ID
const getClubById = async (req: Request, res: Response) => {
  try {
    const { clubId } = req.params;

    const club = await clubService.getClubById(clubId as string);

    if (!club) {
      return res.status(httpStatus.NOT_FOUND).json(
        response({
          message: "Club not found",
          status: "ERROR",
          statusCode: httpStatus.NOT_FOUND,
          data: {},
        })
      );
    }

    res.status(httpStatus.OK).json(
      response({
        message: "Club retrieved successfully",
        status: "OK",
        statusCode: httpStatus.OK,
        data: club,
      })
    );
  } catch (error) {
    const handledError = handleError(error);
    res.status(500).json({ error: handledError.message });
  }
};

// Get club by name
const getClubByName = async (req: Request, res: Response) => {
  try {
    const { name } = req.params;

    const club = await clubService.getClubByName(name as string);

    if (!club) {
      return res.status(httpStatus.NOT_FOUND).json(
        response({
          message: "Club not found",
          status: "ERROR",
          statusCode: httpStatus.NOT_FOUND,
          data: {},
        })
      );
    }

    res.status(httpStatus.OK).json(
      response({
        message: "Club retrieved successfully",
        status: "OK",
        statusCode: httpStatus.OK,
        data: club,
      })
    );
  } catch (error) {
    const handledError = handleError(error);
    res.status(500).json({ error: handledError.message });
  }
};

// Get all clubs with optional filters
const getAllClubs = async (req: Request, res: Response) => {
  try {
    // Extract query parameters for filtering
    const { league, location } = req.query;

    const clubs = await clubService.getAllClubs(
      typeof league === "string" ? league : undefined,
      typeof location === "string" ? location : undefined
    );

    res.status(httpStatus.OK).json(
      response({
        message: "All clubs retrieved successfully",
        status: "OK",
        statusCode: httpStatus.OK,
        data: clubs,
      })
    );
  } catch (error) {
    const handledError = handleError(error);
    res.status(500).json({ error: handledError.message });
  }
};

// Delete club by ID
const deleteClub = async (req: ProtectedRequest, res: Response) => {
  try {
    const { clubId } = req.params;

    const deletedClub = await clubService.deleteClub(clubId as string);

    if (!deletedClub) {
      return res.status(httpStatus.NOT_FOUND).json(
        response({
          message: "Club not found",
          status: "ERROR",
          statusCode: httpStatus.NOT_FOUND,
          data: {},
        })
      );
    }

    res.status(httpStatus.OK).json(
      response({
        message: "Club deleted successfully",
        status: "OK",
        statusCode: httpStatus.OK,
        data: deletedClub,
      })
    );
  } catch (error) {
    const handledError = handleError(error);
    res.status(500).json({ error: handledError.message });
  }
};

const clubController = {
  createClub,
  updateClub,
  getClubById,
  getClubByName,
  getAllClubs,
  deleteClub,
};

export default clubController;