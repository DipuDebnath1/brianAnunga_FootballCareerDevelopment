import Message from "./message.model";
import conversationService from "../Conversations/conversation.service";

// Create a new message
const createMessage = async (
  conversationId: string,
  senderId: string,
  content: string
) => {
  const message = new Message({
    conversationId,
    senderId,
    content,
  });

  const savedMessage = await message.save();

  // Update the conversation with the new message info
  await conversationService.updateLastMessageInfo(
    conversationId,
    savedMessage._id.toString(),
    content
  );

  return savedMessage;
};

// Get messages for a conversation
const getMessagesByConversation = async (
  conversationId: string,
  skip: number = 0,
  limit: number = 50
) => {
  return await Message.find({ conversationId })
    .sort({ createdAt: -1 }) // Sort by newest first
    .skip(skip)
    .limit(limit)
    .populate("senderId", "fullName profilePhoto");
};

// Update a message (for editing)
const updateMessage = async (
  messageId: string,
  content: string,
  userId: string
) => {
  return await Message.findOneAndUpdate(
    { _id: messageId, senderId: userId },
    { content },
    { new: true, runValidators: true }
  );
};

const messageService = {
  createMessage,
  getMessagesByConversation,
  updateMessage,
};

export default messageService;
