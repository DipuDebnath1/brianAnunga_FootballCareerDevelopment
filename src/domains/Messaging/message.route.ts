import { Router } from "express";
import messageController from "./message.controller";
import auth from "../../middlewares/auth";

const router = Router();

// Create a new message
router.post("/", auth(), messageController.createMessage);

// Get messages for a conversation
router.get(
  "/conversation/:conversationId",
  auth(),
  messageController.getMessagesByConversation
);

// Update a message (edit)
router.put("/:messageId", auth(), messageController.updateMessage);

// Delete a message
// router.delete("/:messageId", auth(), messageController.deleteMessage);

export default router;
