import { Router } from "express";
import messageController from "./message.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";

const router = Router();

// Create a new message
router.post("/", authMiddleware, messageController.createMessage);

// Get messages for a conversation
router.get(
  "/conversation/:conversationId",
  authMiddleware,
  messageController.getMessagesByConversation
);

// Update a message (edit)
router.put("/:messageId", authMiddleware, messageController.updateMessage);

// Delete a message
// router.delete("/:messageId", authMiddleware, messageController.deleteMessage);

export default router;
