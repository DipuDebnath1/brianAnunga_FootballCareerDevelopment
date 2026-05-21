import { Request, Response } from "express";
import { handleError } from "../../lib/errorsHandle";
import httpStatus from "http-status";
import { response } from "../../lib/response";
import { ProtectedRequest } from "../../types/protected-request";
import coachVideoRequestService from "./coachVideoRequest.services";

// Create a new coach video request
const createCoachVideoRequest = async (
  req: ProtectedRequest,
  res: Response
) => {
  try {
    // Extract user ID from the authenticated request
    const userId = req.user?._id as string;

    // Validate that coach_id is provided in the request body
    if (!req.body.coach_id) {
      return res.status(httpStatus.BAD_REQUEST).json(
        response({
          message: "Coach ID is required",
          status: "ERROR",
          statusCode: httpStatus.BAD_REQUEST,
          data: {},
        })
      );
    }

    // Prepare video request data with user ID
    const requestData = {
      ...req.body,
      user_id: userId,
    };

    const newVideoRequest =
      await coachVideoRequestService.createCoachVideoRequest(requestData);

    res.status(httpStatus.CREATED).json(
      response({
        message: "Coach video request created successfully",
        status: "OK",
        statusCode: httpStatus.CREATED,
        data: newVideoRequest,
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

// Get coach video requests by coach_id
const getCoachVideoRequestsByCoachId = async (
  req: ProtectedRequest,
  res: Response
) => {
  try {
    const coachId = req.params.coachId as string;

    // Validate that coachId is provided
    if (!coachId) {
      return res.status(httpStatus.BAD_REQUEST).json(
        response({
          message: "Coach ID is required in the URL parameter",
          status: "ERROR",
          statusCode: httpStatus.BAD_REQUEST,
          data: {},
        })
      );
    }

    const videoRequests =
      await coachVideoRequestService.getCoachVideoRequestsByCoachId(coachId);

    res.status(httpStatus.OK).json(
      response({
        message: "Coach video requests retrieved successfully",
        status: "OK",
        statusCode: httpStatus.OK,
        data: videoRequests,
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

// Get coach video requests by user_id
const getCoachVideoRequestsByUserId = async (
  req: ProtectedRequest,
  res: Response
) => {
  try {
    const userId = req.user?._id as string;

    const videoRequests =
      await coachVideoRequestService.getCoachVideoRequestsByUserId(userId);

    res.status(httpStatus.OK).json(
      response({
        message: "Coach video requests retrieved successfully",
        status: "OK",
        statusCode: httpStatus.OK,
        data: videoRequests,
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

// Update coach video request status
const updateCoachVideoRequestStatus = async (
  req: ProtectedRequest,
  res: Response
) => {
  try {
    const requestId = req.params.id as string;
    const { status } = req.body;

    // Validate required fields
    if (!requestId) {
      return res.status(httpStatus.BAD_REQUEST).json(
        response({
          message: "Request ID is required in the URL parameter",
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

    const updatedVideoRequest =
      await coachVideoRequestService.updateCoachVideoRequestStatus(
        requestId,
        status
      );

    if (!updatedVideoRequest) {
      return res.status(httpStatus.NOT_FOUND).json(
        response({
          message: "Coach video request not found",
          status: "ERROR",
          statusCode: httpStatus.NOT_FOUND,
          data: {},
        })
      );
    }

    res.status(httpStatus.OK).json(
      response({
        message: "Coach video request status updated successfully",
        status: "OK",
        statusCode: httpStatus.OK,
        data: updatedVideoRequest,
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

// Update coach video request with feedback
const updateCoachVideoRequestFeedback = async (
  req: ProtectedRequest,
  res: Response
) => {
  try {
    const requestId = req.params.id as string;
    const { feedback } = req.body;

    // Validate required fields
    if (!requestId) {
      return res.status(httpStatus.BAD_REQUEST).json(
        response({
          message: "Request ID is required in the URL parameter",
          status: "ERROR",
          statusCode: httpStatus.BAD_REQUEST,
          data: {},
        })
      );
    }

    if (!feedback) {
      return res.status(httpStatus.BAD_REQUEST).json(
        response({
          message: "Feedback is required in the request body",
          status: "ERROR",
          statusCode: httpStatus.BAD_REQUEST,
          data: {},
        })
      );
    }

    const updatedVideoRequest =
      await coachVideoRequestService.updateCoachVideoRequestFeedback(
        requestId,
        feedback
      );

    if (!updatedVideoRequest) {
      return res.status(httpStatus.NOT_FOUND).json(
        response({
          message: "Coach video request not found",
          status: "ERROR",
          statusCode: httpStatus.NOT_FOUND,
          data: {},
        })
      );
    }

    res.status(httpStatus.OK).json(
      response({
        message: "Coach video request feedback updated successfully",
        status: "OK",
        statusCode: httpStatus.OK,
        data: updatedVideoRequest,
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

// Get all coach video requests with optional filters (for admin or authorized users)
const getAllCoachVideoRequests = async (
  req: ProtectedRequest,
  res: Response
) => {
  try {
    const { userId, coachId, status } = req.query;

    const videoRequests =
      await coachVideoRequestService.getAllCoachVideoRequests(
        typeof userId === "string" ? userId : undefined,
        typeof coachId === "string" ? coachId : undefined,
        typeof status === "string"
          ? (status as "pending" | "accept" | "decline" | "completed")
          : undefined
      );

    res.status(httpStatus.OK).json(
      response({
        message: "All coach video requests retrieved successfully",
        status: "OK",
        statusCode: httpStatus.OK,
        data: videoRequests,
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

// Get single coach video request by ID
const getCoachVideoRequestById = async (
  req: ProtectedRequest,
  res: Response
) => {
  try {
    const requestId = req.params.id as string;

    if (!requestId) {
      return res.status(httpStatus.BAD_REQUEST).json(
        response({
          message: "Request ID is required",
          status: "ERROR",
          statusCode: httpStatus.BAD_REQUEST,
          data: {},
        })
      );
    }

    const videoRequest =
      await coachVideoRequestService.getCoachVideoRequestById(requestId);

    if (!videoRequest) {
      return res.status(httpStatus.NOT_FOUND).json(
        response({
          message: "Coach video request not found",
          status: "ERROR",
          statusCode: httpStatus.NOT_FOUND,
          data: {},
        })
      );
    }

    res.status(httpStatus.OK).json(
      response({
        message: "Coach video request retrieved successfully",
        status: "OK",
        statusCode: httpStatus.OK,
        data: videoRequest,
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

const coachVideoRequestController = {
  createCoachVideoRequest,
  getCoachVideoRequestsByCoachId,
  getCoachVideoRequestsByUserId,
  updateCoachVideoRequestStatus,
  updateCoachVideoRequestFeedback,
  getAllCoachVideoRequests,
  getCoachVideoRequestById,
};

export default coachVideoRequestController;
