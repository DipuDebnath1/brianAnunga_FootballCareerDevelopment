import { Request, Response } from "express";
import messageService from "./message.service";
import { handleError } from "../../lib/errorsHandle";
import httpStatus from "http-status";
import { response } from "../../lib/response";
import { ProtectedRequest } from "../../types/protected-request";

// Create a new message
const createMessage = async (req: ProtectedRequest, res: Response) => {
  try {
    const userId = req.user?._id as string;
    const { conversationId, content } = req.body;

    // Verify that the user is part of this conversation
    const conversation = await import(
      "../Conversations/conversation.service"
    ).then((service) => service.default.getConversationById(conversationId));

    if (
      !conversation ||
      !conversation.participants.some((p: any) => p._id.toString() === userId)
    ) {
      return res.status(httpStatus.FORBIDDEN).json(
        response({
          message:
            "You are not authorized to send messages in this conversation",
          status: "ERROR",
          statusCode: httpStatus.FORBIDDEN,
          data: {},
        })
      );
    }

    const newMessage = await messageService.createMessage(
      conversationId,
      userId,
      content
    );

    res.status(httpStatus.CREATED).json(
      response({
        message: "Message sent successfully",
        status: "OK",
        statusCode: httpStatus.CREATED,
        data: newMessage,
      })
    );
  } catch (error) {
    const handledError = handleError(error);
    res.status(500).json({ error: handledError.message });
  }
};

// Get messages for a conversation
const getMessagesByConversation = async (
  req: ProtectedRequest,
  res: Response
) => {
  try {
    const { conversationId } = req.params;
    const { skip = 0, limit = 50 } = req.query;

    // Verify that the user is part of this conversation
    const conversation = await import(
      "../Conversations/conversation.service"
    ).then((service) => service.default.getConversationById(conversationId));

    const userId = req.user?._id as string;
    if (
      !conversation ||
      !conversation.participants.some((p: any) => p._id.toString() === userId)
    ) {
      return res.status(httpStatus.FORBIDDEN).json(
        response({
          message:
            "You are not authorized to access messages in this conversation",
          status: "ERROR",
          statusCode: httpStatus.FORBIDDEN,
          data: {},
        })
      );
    }

    const messages = await messageService.getMessagesByConversation(
      conversationId,
      parseInt(skip as string),
      parseInt(limit as string)
    );

    res.status(httpStatus.OK).json(
      response({
        message: "Messages retrieved successfully",
        status: "OK",
        statusCode: httpStatus.OK,
        data: messages,
      })
    );
  } catch (error) {
    const handledError = handleError(error);
    res.status(500).json({ error: handledError.message });
  }
};

// Update a message (edit)
const updateMessage = async (req: ProtectedRequest, res: Response) => {
  try {
    const userId = req.user?._id as string;
    const { messageId } = req.params;
    const { content } = req.body;

    const updatedMessage = await messageService.updateMessage(
      messageId,
      content,
      userId
    );

    if (!updatedMessage) {
      return res.status(httpStatus.NOT_FOUND).json(
        response({
          message: "Message not found or you don't have permission to edit it",
          status: "ERROR",
          statusCode: httpStatus.NOT_FOUND,
          data: {},
        })
      );
    }

    res.status(httpStatus.OK).json(
      response({
        message: "Message updated successfully",
        status: "OK",
        statusCode: httpStatus.OK,
        data: updatedMessage,
      })
    );
  } catch (error) {
    const handledError = handleError(error);
    res.status(500).json({ error: handledError.message });
  }
};

const messageController = {
  createMessage,
  getMessagesByConversation,
  updateMessage,
};

export default messageController;
