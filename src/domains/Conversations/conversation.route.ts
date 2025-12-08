import { Router } from "express";
import conversationController from "./conversation.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";

const router = Router();

// Create a new conversation
router.post("/", authMiddleware, conversationController.createConversation);

// Get a specific conversation by ID
router.get("/:conversationId", authMiddleware, conversationController.getConversationById);

// Get all conversations for the authenticated user
router.get("/", authMiddleware, conversationController.getUserConversations);

export default router;