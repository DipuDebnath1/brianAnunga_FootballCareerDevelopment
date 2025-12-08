import { Request, Response } from "express";
import conversationService from "./conversation.service";
import { handleError } from "../../lib/errorsHandle";
import httpStatus from "http-status";
import { response } from "../../lib/response";
import { ProtectedRequest } from "../../types/protected-request";

// Create a new private conversation
const createConversation = async (req: ProtectedRequest, res: Response) => {
  try {
    const userId = req.user?._id as string;

    const { participant } = req.body;
    const participants = [participant, userId];

    // Ensure exactly two participants
    if (participants.length !== 2) {
      return res.status(httpStatus.BAD_REQUEST).json(
        response({
          message: "Private conversation must have exactly two participants",
          status: "ERROR",
          statusCode: httpStatus.BAD_REQUEST,
          data: {},
        })
      );
    }

    // Ensure the authenticated user is one of the participants
    if (!participants.includes(userId)) {
      return res.status(httpStatus.FORBIDDEN).json(
        response({
          message: "You can only create conversations that include yourself",
          status: "ERROR",
          statusCode: httpStatus.FORBIDDEN,
          data: {},
        })
      );
    }

    const newConversation = await conversationService.createConversation(
      participants
    );

    res.status(httpStatus.CREATED).json(
      response({
        message: "Private conversation created successfully",
        status: "OK",
        statusCode: httpStatus.CREATED,
        data: newConversation,
      })
    );
  } catch (error) {
    const handledError = handleError(error);
    res.status(500).json({ error: handledError.message });
  }
};

// Get a specific conversation by ID
const getConversationById = async (req: ProtectedRequest, res: Response) => {
  try {
    const { conversationId } = req.params;

    const conversation = await conversationService.getConversationById(
      conversationId
    );

    if (!conversation) {
      return res.status(httpStatus.NOT_FOUND).json(
        response({
          message: "Conversation not found",
          status: "ERROR",
          statusCode: httpStatus.NOT_FOUND,
          data: {},
        })
      );
    }

    // Check if the user is part of this conversation
    const userId = req.user?._id as string;
    if (
      !conversation.participants.some(
        (participant: any) => participant._id.toString() === userId
      )
    ) {
      return res.status(httpStatus.FORBIDDEN).json(
        response({
          message: "You are not authorized to access this conversation",
          status: "ERROR",
          statusCode: httpStatus.FORBIDDEN,
          data: {},
        })
      );
    }

    res.status(httpStatus.OK).json(
      response({
        message: "Conversation retrieved successfully",
        status: "OK",
        statusCode: httpStatus.OK,
        data: conversation,
      })
    );
  } catch (error) {
    const handledError = handleError(error);
    res.status(500).json({ error: handledError.message });
  }
};

// Get all conversations for the authenticated user
const getUserConversations = async (req: ProtectedRequest, res: Response) => {
  try {
    const userId = req.user?._id as string;

    const conversations = await conversationService.getUserConversations(
      userId
    );

    res.status(httpStatus.OK).json(
      response({
        message: "User conversations retrieved successfully",
        status: "OK",
        statusCode: httpStatus.OK,
        data: conversations,
      })
    );
  } catch (error) {
    const handledError = handleError(error);
    res.status(500).json({ error: handledError.message });
  }
};

const conversationController = {
  createConversation,
  getConversationById,
  getUserConversations,
};

export default conversationController;
