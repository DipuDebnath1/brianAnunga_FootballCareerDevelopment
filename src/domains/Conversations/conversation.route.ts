import { Router } from "express";
import conversationController from "./conversation.controller";
import auth from "../../middlewares/auth";

const router = Router();

// Create a new conversation
router.post("/", auth(), conversationController.createConversation);

// Get a specific conversation by ID
router.get("/:conversationId", auth(), conversationController.getConversationById);

// Get all conversations for the authenticated user
router.get("/", auth(), conversationController.getUserConversations);

export default router;