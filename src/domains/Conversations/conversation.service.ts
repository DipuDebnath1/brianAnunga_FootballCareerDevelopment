import Conversation from "./conversation.model";
import { IConversation } from "./conversation.model";
import Message from "../Messaging/message.model";

// Create a new private conversation between two users
const createConversation = async (
  participants: string[]
) => {
  // Ensure exactly two participants
  if (participants.length !== 2) {
    throw new Error("Private conversation must have exactly two participants");
  }

  // Check if a conversation already exists between these two users
  const existingConversation = await Conversation.findOne({
    $and: [
      { participants: { $in: [participants[0]] } },
      { participants: { $in: [participants[1]] } }
    ]
  });

  if (existingConversation) {
    return existingConversation;
  }

  const conversation = new Conversation({
    participants,
  });

  return await conversation.save();
};

// Get conversation by ID
const getConversationById = async (conversationId: string) => {
  return await Conversation.findById(conversationId).populate('participants', 'fullName profilePhoto');
};

// Get all conversations for a user
const getUserConversations = async (userId: string) => {
  return await Conversation.find({ participants: userId })
    .sort({ lastMessageAt: -1 }) // Sort by last message time
    .populate('participants', 'fullName profilePhoto')
    .populate('lastMessage', 'content createdAt');
};

// Update last message info in conversation
const updateLastMessageInfo = async (
  conversationId: string,
  messageId: string,
  messageContent: string
) => {
  return await Conversation.findByIdAndUpdate(
    conversationId,
    {
      lastMessage: messageId,
      lastMessageText: messageContent,
      lastMessageAt: new Date(),
    },
    { new: true }
  );
};

const conversationService = {
  createConversation,
  getConversationById,
  getUserConversations,
  updateLastMessageInfo,
};

export default conversationService;