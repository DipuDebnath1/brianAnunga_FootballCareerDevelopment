import { Request, RequestHandler, Response } from "express";
import httpStatus from "http-status";
import AppError from "../../ErrorHandler/AppError";
import catchAsync from "../../utills/catchAsync";
import sendResponse from "../../utills/sendResponse";
import { ProtectedRequest } from "../../types/protected-request";
import agentRequestService from "./agentRequest.services";

type AgentRequestStatus = "pending" | "accept" | "decline" | "completed";
const VALID_STATUSES: AgentRequestStatus[] = ["pending", "accept", "decline", "completed"];

const createAgentRequest: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const { user } = req as ProtectedRequest;

    if (!req.body.agent_id) {
      throw new AppError(httpStatus.BAD_REQUEST, "Agent ID is required");
    }

    const newAgentRequest = await agentRequestService.createAgentRequest({
      ...req.body,
      user_id: user!._id,
    });

    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: "Agent request created successfully",
      data: newAgentRequest,
    });
  }
);

const getAgentRequestsByAgentId: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const agentRequests = await agentRequestService.getAgentRequestsByAgentId(
      req.params.agentId as string
    );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Agent requests retrieved successfully",
      data: agentRequests,
    });
  }
);

const getAgentRequestsByUserId: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const { user } = req as ProtectedRequest;
    const agentRequests = await agentRequestService.getAgentRequestsByUserId(user!._id);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Agent requests retrieved successfully",
      data: agentRequests,
    });
  }
);

const updateAgentRequestStatus: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const { status } = req.body;

    if (!status) {
      throw new AppError(httpStatus.BAD_REQUEST, "Status is required in the request body");
    }

    if (!VALID_STATUSES.includes(status)) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        `Invalid status. Valid statuses are: ${VALID_STATUSES.join(", ")}`
      );
    }

    const updatedAgentRequest = await agentRequestService.updateAgentRequestStatus(
      req.params.id as string,
      status
    );

    if (!updatedAgentRequest) {
      throw new AppError(httpStatus.NOT_FOUND, "Agent request not found");
    }

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Agent request status updated successfully",
      data: updatedAgentRequest,
    });
  }
);

const getAllAgentRequests: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const { userId, agentId, status } = req.query;

    const agentRequests = await agentRequestService.getAllAgentRequests(
      typeof userId === "string" ? userId : undefined,
      typeof agentId === "string" ? agentId : undefined,
      typeof status === "string" ? (status as AgentRequestStatus) : undefined
    );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "All agent requests retrieved successfully",
      data: agentRequests,
    });
  }
);

const getAgentRequestById: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const agentRequest = await agentRequestService.getAgentRequestById(
      req.params.id as string
    );

    if (!agentRequest) {
      throw new AppError(httpStatus.NOT_FOUND, "Agent request not found");
    }

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Agent request retrieved successfully",
      data: agentRequest,
    });
  }
);

const agentRequestController = {
  createAgentRequest,
  getAgentRequestsByAgentId,
  getAgentRequestsByUserId,
  updateAgentRequestStatus,
  getAllAgentRequests,
  getAgentRequestById,
};

export default agentRequestController;
