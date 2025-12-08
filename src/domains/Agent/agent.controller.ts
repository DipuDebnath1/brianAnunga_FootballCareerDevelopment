import { Request, Response } from "express";
import agentService from "./agent.services";
import { handleError } from "../../lib/errorsHandle";
import httpStatus from "http-status";
import { response } from "../../lib/response";
import { ProtectedRequest } from "../../types/protected-request";

const createAgentProfile = async (req: ProtectedRequest, res: Response) => {
  try {
    // Extract user ID from the authenticated request
    const userId = req.user?._id as string;

    // Check if agent profile already exists for this user
    const existingAgent = await agentService.getAgentByUserId(userId);
    if (existingAgent) {
      return res.status(httpStatus.CONFLICT).json(
        response({
          message: "Agent profile already exists for this user",
          status: "ERROR",
          statusCode: httpStatus.CONFLICT,
          data: {},
        })
      );
    }

    // Create the agent profile with the user ID
    const agentData = {
      ...req.body,
      user_id: userId,
    };

    const newAgentProfile = await agentService.createAgentProfile(agentData);

    res.status(httpStatus.CREATED).json(
      response({
        message: "Agent profile created successfully",
        status: "OK",
        statusCode: httpStatus.CREATED,
        data: newAgentProfile,
      })
    );
  } catch (error) {
    const handledError = handleError(error);
    res.status(500).json({ error: handledError.message });
  }
};

const updateAgentProfile = async (req: ProtectedRequest, res: Response) => {
  try {
    const userId = req.user?._id as string;

    console.log(userId);

    // Update the agent profile
    const updatedAgentProfile = await agentService.updateAgentProfile(
      userId,
      req.body
    );

    if (!updatedAgentProfile) {
      return res.status(httpStatus.NOT_FOUND).json(
        response({
          message: "Agent profile not found",
          status: "ERROR",
          statusCode: httpStatus.NOT_FOUND,
          data: {},
        })
      );
    }

    res.status(httpStatus.OK).json(
      response({
        message: "Agent profile updated successfully",
        status: "OK",
        statusCode: httpStatus.OK,
        data: updatedAgentProfile,
      })
    );
  } catch (error) {
    const handledError = handleError(error);
    res.status(500).json({ error: handledError.message });
  }
};

const getAgentProfile = async (req: ProtectedRequest, res: Response) => {
  try {
    const userId = req.user?._id as string;

    const agent = await agentService.getAgentByUserId(userId);

    if (!agent) {
      return res.status(httpStatus.NOT_FOUND).json(
        response({
          message: "Agent profile not found",
          status: "ERROR",
          statusCode: httpStatus.NOT_FOUND,
          data: {},
        })
      );
    }

    res.status(httpStatus.OK).json(
      response({
        message: "Agent profile retrieved successfully",
        status: "OK",
        statusCode: httpStatus.OK,
        data: agent,
      })
    );
  } catch (error) {
    const handledError = handleError(error);
    res.status(500).json({ error: handledError.message });
  }
};

const getAllAgents = async (req: Request, res: Response) => {
  try {
    // Extract query parameters for filtering
    const { areaOfExpertise, experienceYears } = req.query;

    const agents = await agentService.getAllAgents(
      typeof areaOfExpertise === "string" ? areaOfExpertise : undefined,
      typeof experienceYears === "string"
        ? parseInt(experienceYears)
        : undefined
    );

    res.status(httpStatus.OK).json(
      response({
        message: "All agents retrieved successfully",
        status: "OK",
        statusCode: httpStatus.OK,
        data: agents,
      })
    );
  } catch (error) {
    const handledError = handleError(error);
    res.status(500).json({ error: handledError.message });
  }
};

const agentController = {
  createAgentProfile,
  updateAgentProfile,
  getAgentProfile,
  getAllAgents,
};

export default agentController;
