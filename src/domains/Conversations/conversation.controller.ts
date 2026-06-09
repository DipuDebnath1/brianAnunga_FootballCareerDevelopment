import { Request, RequestHandler, Response } from "express";
import httpStatus from "http-status";
import AppError from "../../ErrorHandler/AppError";
import catchAsync from "../../utills/catchAsync";
import sendResponse from "../../utills/sendResponse";
import { ProtectedRequest } from "../../types/protected-request";
import conversationService from "./conversation.service";

const createConversation: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const { user } = req as ProtectedRequest;
    const userId = user!._id;
    const { participant } = req.body;
    const participants = [participant, userId];

    if (participants.length !== 2) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "Private conversation must have exactly two participants"
      );
    }

    const newConversation = await conversationService.createConversation(participants);

    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: "Private conversation created successfully",
      data: newConversation,
    });
  }
);

const getConversationById: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const { user } = req as ProtectedRequest;
    const userId = user!._id;
    const conversation = await conversationService.getConversationById(
      req.params.conversationId as string
    );

    if (!conversation) {
      throw new AppError(httpStatus.NOT_FOUND, "Conversation not found");
    }

    const participants = conversation.participants as Array<{ _id: { toString(): string } }>;
    if (!participants.some((p) => p._id.toString() === userId)) {
      throw new AppError(httpStatus.FORBIDDEN, "You are not authorized to access this conversation");
    }

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Conversation retrieved successfully",
      data: conversation,
    });
  }
);

const getUserConversations: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const { user } = req as ProtectedRequest;
    const conversations = await conversationService.getUserConversations(user!._id);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "User conversations retrieved successfully",
      data: conversations,
    });
  }
);

const conversationController = {
  createConversation,
  getConversationById,
  getUserConversations,
};

export default conversationController;
