import { FilterQuery } from "mongoose";
import AgentRequest from "./agentRequest.model";
import { IAgentRequest } from "./agentRequest.interface";
import Agent from "../Agent/agent.model";


// Create a new agent request
const createAgentRequest = async (agentRequestData: Partial<IAgentRequest>) => {
  // Check if agent exists
  const agentExists = await Agent.findById(agentRequestData.agent_id);
  if (!agentExists) {
    throw new Error("Agent not found");
  }

  const agentRequest = new AgentRequest(agentRequestData);
  return await agentRequest.save();
};

// Get agent requests by agent_id
const getAgentRequestsByAgentId = async (agentId: string) => {
  return await AgentRequest.find({ agent_id: agentId }).populate('user_id', 'email username'); // Populate with user info
};

// Get agent requests by user_id
const getAgentRequestsByUserId = async (userId: string) => {
  return await AgentRequest.find({ user_id: userId }).populate('agent_id', 'fullName email'); // Populate with agent info
};

// Update agent request status
const updateAgentRequestStatus = async (
  agentRequestId: string,
  status: "pending" | "accept" | "decline" | "completed"
) => {
  return await AgentRequest.findByIdAndUpdate(
    { _id: agentRequestId },
    { $set: { status } },
    { new: true, runValidators: true }
  );
};

// Get all agent requests with optional filters
const getAllAgentRequests = async (
  userId?: string,
  agentId?: string,
  status?: "pending" | "accept" | "decline" | "completed"
) => {
  const query: FilterQuery<IAgentRequest> = {};

  // Add filters if provided
  if (userId) {
    query.user_id = userId;
  }

  if (agentId) {
    query.agent_id = agentId;
  }

  if (status) {
    query.status = status;
  }

  return await AgentRequest.find(query)
    .populate('agent_id', 'fullName email')
    .populate('user_id', 'email username');
};

// Get single agent request by ID
const getAgentRequestById = async (id: string) => {
  return await AgentRequest.findById(id)
    .populate('agent_id', 'fullName email')
    .populate('user_id', 'email username');
};

const agentRequestService = {
  createAgentRequest,
  getAgentRequestsByAgentId,
  getAgentRequestsByUserId,
  updateAgentRequestStatus,
  getAllAgentRequests,
  getAgentRequestById,
};

export default agentRequestService;