import { Request, RequestHandler, Response } from "express";
import httpStatus from "http-status";
import AppError from "../../ErrorHandler/AppError";
import catchAsync from "../../utills/catchAsync";
import sendResponse from "../../utills/sendResponse";
import { ProtectedRequest } from "../../types/protected-request";
import agentService from "./agent.services";

const createAgentProfile: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const { user } = req as ProtectedRequest;
    const existingAgent = await agentService.getAgentByUserId(user!._id);

    if (existingAgent) {
      throw new AppError(httpStatus.CONFLICT, "Agent profile already exists for this user");
    }

    const newAgentProfile = await agentService.createAgentProfile({
      ...req.body,
      user_id: user!._id,
    });

    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: "Agent profile created successfully",
      data: newAgentProfile,
    });
  }
);

const updateAgentProfile: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const { user } = req as ProtectedRequest;
    const updatedAgentProfile = await agentService.updateAgentProfile(
      user!._id,
      req.body
    );

    if (!updatedAgentProfile) {
      throw new AppError(httpStatus.NOT_FOUND, "Agent profile not found");
    }

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Agent profile updated successfully",
      data: updatedAgentProfile,
    });
  }
);

const getAgentProfile: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const { user } = req as ProtectedRequest;
    const agent = await agentService.getAgentByUserId(user!._id);

    if (!agent) {
      throw new AppError(httpStatus.NOT_FOUND, "Agent profile not found");
    }

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Agent profile retrieved successfully",
      data: agent,
    });
  }
);

const getAllAgents: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const { areaOfExpertise, experienceYears } = req.query;
    const agents = await agentService.getAllAgents(
      typeof areaOfExpertise === "string" ? areaOfExpertise : undefined,
      typeof experienceYears === "string" ? parseInt(experienceYears, 10) : undefined
    );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "All agents retrieved successfully",
      data: agents,
    });
  }
);

const agentController = {
  createAgentProfile,
  updateAgentProfile,
  getAgentProfile,
  getAllAgents,
};

export default agentController;
