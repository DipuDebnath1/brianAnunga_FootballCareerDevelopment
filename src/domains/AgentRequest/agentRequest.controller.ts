import { Request, Response } from "express";
import agentRequestService from "./agentRequest.services";
import { handleError } from "../../lib/errorsHandle";
import httpStatus from "http-status";
import { response } from "../../lib/response";
import { ProtectedRequest } from "../../types/protected-request";

// Create a new agent request
const createAgentRequest = async (req: ProtectedRequest, res: Response) => {
  try {
    // Extract user ID from the authenticated request
    const userId = req.user?._id as string;

    // Validate that agent_id is provided in the request body
    if (!req.body.agent_id) {
      return res.status(httpStatus.BAD_REQUEST).json(
        response({
          message: "Agent ID is required",
          status: "ERROR",
          statusCode: httpStatus.BAD_REQUEST,
          data: {},
        })
      );
    }

    // Prepare agent request data with user ID
    const agentRequestData = {
      ...req.body,
      user_id: userId,
    };

    const newAgentRequest = await agentRequestService.createAgentRequest(
      agentRequestData
    );

    res.status(httpStatus.CREATED).json(
      response({
        message: "Agent request created successfully",
        status: "OK",
        statusCode: httpStatus.CREATED,
        data: newAgentRequest,
      })
    );
  } catch (error) {
    const handledError = handleError(error);
    res.status(500).json(
      response({
        message: handledError.message,
        status: "ERROR",
        statusCode: 500,
        data: {},
      })
    );
  }
};

// Get agent requests by agent_id
const getAgentRequestsByAgentId = async (
  req: ProtectedRequest,
  res: Response
) => {
  try {
    const agentId = req.params.agentId as string;

    // Validate that agentId is provided
    if (!agentId) {
      return res.status(httpStatus.BAD_REQUEST).json(
        response({
          message: "Agent ID is required in the URL parameter",
          status: "ERROR",
          statusCode: httpStatus.BAD_REQUEST,
          data: {},
        })
      );
    }

    const agentRequests = await agentRequestService.getAgentRequestsByAgentId(
      agentId
    );

    res.status(httpStatus.OK).json(
      response({
        message: "Agent requests retrieved successfully",
        status: "OK",
        statusCode: httpStatus.OK,
        data: agentRequests,
      })
    );
  } catch (error) {
    const handledError = handleError(error);
    res.status(500).json(
      response({
        message: handledError.message,
        status: "ERROR",
        statusCode: 500,
        data: {},
      })
    );
  }
};

// Get agent requests by user_id
const getAgentRequestsByUserId = async (
  req: ProtectedRequest,
  res: Response
) => {
  try {
    const userId = req.user?._id as string;

    const agentRequests = await agentRequestService.getAgentRequestsByUserId(
      userId
    );

    res.status(httpStatus.OK).json(
      response({
        message: "Agent requests retrieved successfully",
        status: "OK",
        statusCode: httpStatus.OK,
        data: agentRequests,
      })
    );
  } catch (error) {
    const handledError = handleError(error);
    res.status(500).json(
      response({
        message: handledError.message,
        status: "ERROR",
        statusCode: 500,
        data: {},
      })
    );
  }
};

// Update agent request status
const updateAgentRequestStatus = async (
  req: ProtectedRequest,
  res: Response
) => {
  try {
    const agentRequestId = req.params.id as string;
    const { status } = req.body;

    // Validate required fields
    if (!agentRequestId) {
      return res.status(httpStatus.BAD_REQUEST).json(
        response({
          message: "Agent request ID is required in the URL parameter",
          status: "ERROR",
          statusCode: httpStatus.BAD_REQUEST,
          data: {},
        })
      );
    }

    if (!status) {
      return res.status(httpStatus.BAD_REQUEST).json(
        response({
          message: "Status is required in the request body",
          status: "ERROR",
          statusCode: httpStatus.BAD_REQUEST,
          data: {},
        })
      );
    }

    // Validate status value
    const validStatuses: Array<"pending" | "accept" | "decline" | "completed"> =
      ["pending", "accept", "decline", "completed"];
    if (!validStatuses.includes(status)) {
      return res.status(httpStatus.BAD_REQUEST).json(
        response({
          message: `Invalid status. Valid statuses are: ${validStatuses.join(
            ", "
          )}`,
          status: "ERROR",
          statusCode: httpStatus.BAD_REQUEST,
          data: {},
        })
      );
    }

    const updatedAgentRequest =
      await agentRequestService.updateAgentRequestStatus(
        agentRequestId,
        status
      );

    if (!updatedAgentRequest) {
      return res.status(httpStatus.NOT_FOUND).json(
        response({
          message: "Agent request not found",
          status: "ERROR",
          statusCode: httpStatus.NOT_FOUND,
          data: {},
        })
      );
    }

    res.status(httpStatus.OK).json(
      response({
        message: "Agent request status updated successfully",
        status: "OK",
        statusCode: httpStatus.OK,
        data: updatedAgentRequest,
      })
    );
  } catch (error) {
    const handledError = handleError(error);
    res.status(500).json(
      response({
        message: handledError.message,
        status: "ERROR",
        statusCode: 500,
        data: {},
      })
    );
  }
};

// Get all agent requests with optional filters (for admin or authorized users)
const getAllAgentRequests = async (req: ProtectedRequest, res: Response) => {
  try {
    const { userId, agentId, status } = req.query;

    const agentRequests = await agentRequestService.getAllAgentRequests(
      typeof userId === "string" ? userId : undefined,
      typeof agentId === "string" ? agentId : undefined,
      typeof status === "string"
        ? (status as "pending" | "accept" | "decline" | "completed")
        : undefined
    );

    res.status(httpStatus.OK).json(
      response({
        message: "All agent requests retrieved successfully",
        status: "OK",
        statusCode: httpStatus.OK,
        data: agentRequests,
      })
    );
  } catch (error) {
    const handledError = handleError(error);
    res.status(500).json(
      response({
        message: handledError.message,
        status: "ERROR",
        statusCode: 500,
        data: {},
      })
    );
  }
};

// Get single agent request by ID
const getAgentRequestById = async (req: ProtectedRequest, res: Response) => {
  try {
    const agentRequestId = req.params.id as string;

    if (!agentRequestId) {
      return res.status(httpStatus.BAD_REQUEST).json(
        response({
          message: "Agent request ID is required",
          status: "ERROR",
          statusCode: httpStatus.BAD_REQUEST,
          data: {},
        })
      );
    }

    const agentRequest = await agentRequestService.getAgentRequestById(
      agentRequestId
    );

    if (!agentRequest) {
      return res.status(httpStatus.NOT_FOUND).json(
        response({
          message: "Agent request not found",
          status: "ERROR",
          statusCode: httpStatus.NOT_FOUND,
          data: {},
        })
      );
    }

    res.status(httpStatus.OK).json(
      response({
        message: "Agent request retrieved successfully",
        status: "OK",
        statusCode: httpStatus.OK,
        data: agentRequest,
      })
    );
  } catch (error) {
    const handledError = handleError(error);
    res.status(500).json(
      response({
        message: handledError.message,
        status: "ERROR",
        statusCode: 500,
        data: {},
      })
    );
  }
};

const agentRequestController = {
  createAgentRequest,
  getAgentRequestsByAgentId,
  getAgentRequestsByUserId,
  updateAgentRequestStatus,
  getAllAgentRequests,
  getAgentRequestById,
};

export default agentRequestController;
