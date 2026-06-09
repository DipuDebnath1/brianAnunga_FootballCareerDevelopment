import { Request, RequestHandler, Response } from "express";
import httpStatus from "http-status";
import AppError from "../../ErrorHandler/AppError";
import catchAsync from "../../utills/catchAsync";
import sendResponse from "../../utills/sendResponse";
import { ProtectedRequest } from "../../types/protected-request";
import conversationService from "../Conversations/conversation.service";
import messageService from "./message.service";

const isConversationParticipant = (
  participants: Array<{ _id: { toString(): string } }>,
  userId: string
) => participants.some((p) => p._id.toString() === userId);

const createMessage: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const { user } = req as ProtectedRequest;
    const userId = user!._id;
    const { conversationId, content } = req.body;

    const conversation = await conversationService.getConversationById(conversationId);

    if (!conversation || !isConversationParticipant(conversation.participants as Array<{ _id: { toString(): string } }>, userId)) {
      throw new AppError(
        httpStatus.FORBIDDEN,
        "You are not authorized to send messages in this conversation"
      );
    }

    const newMessage = await messageService.createMessage(conversationId, userId, content);

    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: "Message sent successfully",
      data: newMessage,
    });
  }
);

const getMessagesByConversation: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const { user } = req as ProtectedRequest;
    const userId = user!._id;
    const { conversationId } = req.params;
    const { skip = "0", limit = "50" } = req.query;

    const conversation = await conversationService.getConversationById(conversationId as string);

    if (!conversation || !isConversationParticipant(conversation.participants as Array<{ _id: { toString(): string } }>, userId)) {
      throw new AppError(
        httpStatus.FORBIDDEN,
        "You are not authorized to access messages in this conversation"
      );
    }

    const messages = await messageService.getMessagesByConversation(
      conversationId as string,
      parseInt(skip as string, 10),
      parseInt(limit as string, 10)
    );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Messages retrieved successfully",
      data: messages,
    });
  }
);

const updateMessage: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const { user } = req as ProtectedRequest;
    const { messageId } = req.params;
    const { content } = req.body;

    const updatedMessage = await messageService.updateMessage(
      messageId as string,
      content,
      user!._id
    );

    if (!updatedMessage) {
      throw new AppError(
        httpStatus.NOT_FOUND,
        "Message not found or you don't have permission to edit it"
      );
    }

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Message updated successfully",
      data: updatedMessage,
    });
  }
);

const messageController = {
  createMessage,
  getMessagesByConversation,
  updateMessage,
};

export default messageController;
